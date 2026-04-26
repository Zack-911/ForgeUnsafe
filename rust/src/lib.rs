#![deny(clippy::all)]

use napi_derive::napi;
use once_cell::sync::Lazy;
use std::{
    alloc::{alloc, alloc_zeroed, dealloc, realloc, Layout},
    collections::HashMap,
    sync::Mutex,
};

// ─── Allocation registry ──────────────────────────────────────────────────────
//
// Every pointer ForgeUnsafe hands to JS is registered here.
// addr (u64) → layout used for allocation.
//
// This lets us:
//  • call dealloc() with the correct layout on free()
//  • refuse to read/write outside known allocations
//  • detect double-free and use-after-free

struct AllocEntry {
    layout: Layout,
    tag: Option<String>, // optional user label
}

static REGISTRY: Lazy<Mutex<HashMap<u64, AllocEntry>>> =
    Lazy::new(|| Mutex::new(HashMap::new()));

// ─── Pointer encoding ─────────────────────────────────────────────────────────
//
// Pointers are passed to JS as decimal u64 strings (e.g. "140234567890312").
// This avoids JS number precision loss (f64 can't hold all u64 values exactly).

fn encode_ptr(ptr: *mut u8) -> String {
    format!("{}", ptr as u64)
}

fn decode_ptr(s: &str) -> napi::Result<*mut u8> {
    s.parse::<u64>()
        .map(|v| v as *mut u8)
        .map_err(|_| napi::Error::from_reason(format!("Invalid pointer: {:?}", s)))
}

fn registry_get(addr: u64) -> napi::Result<()> {
    let reg = REGISTRY.lock().unwrap();
    if !reg.contains_key(&addr) {
        return Err(napi::Error::from_reason(format!(
            "0x{:x} is not a known allocation (use-after-free or invalid pointer)",
            addr
        )));
    }
    Ok(())
}

// ─── Allocation ───────────────────────────────────────────────────────────────

/// Allocate `size` bytes on the heap and return the pointer as a decimal string.
/// Memory is NOT zero-initialised (mirrors malloc). Use `unsafe_calloc` for zeroed.
#[napi]
pub fn unsafe_malloc(size: u32) -> napi::Result<String> {
    if size == 0 {
        return Err(napi::Error::from_reason("Cannot allocate 0 bytes"));
    }
    let layout = Layout::array::<u8>(size as usize)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let ptr = unsafe { alloc(layout) };
    if ptr.is_null() {
        return Err(napi::Error::from_reason("Allocation failed (OOM)"));
    }

    let addr = ptr as u64;
    REGISTRY.lock().unwrap().insert(addr, AllocEntry { layout, tag: None });

    Ok(encode_ptr(ptr))
}

/// Allocate `size` bytes, zero-initialised (mirrors calloc).
#[napi]
pub fn unsafe_calloc(size: u32) -> napi::Result<String> {
    if size == 0 {
        return Err(napi::Error::from_reason("Cannot allocate 0 bytes"));
    }
    let layout = Layout::array::<u8>(size as usize)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let ptr = unsafe { alloc_zeroed(layout) };
    if ptr.is_null() {
        return Err(napi::Error::from_reason("Allocation failed (OOM)"));
    }

    let addr = ptr as u64;
    REGISTRY.lock().unwrap().insert(addr, AllocEntry { layout, tag: None });

    Ok(encode_ptr(ptr))
}

/// Reallocate a previous allocation to a new size. Returns the new pointer.
/// The old pointer is invalidated even if reallocation fails.
#[napi]
pub fn unsafe_realloc(pointer: String, new_size: u32) -> napi::Result<String> {
    if new_size == 0 {
        return Err(napi::Error::from_reason("Cannot reallocate to 0 bytes — use free instead"));
    }

    let old_ptr = decode_ptr(&pointer)?;
    let old_addr = old_ptr as u64;

    let mut reg = REGISTRY.lock().unwrap();
    let entry = reg.remove(&old_addr).ok_or_else(|| {
        napi::Error::from_reason(format!(
            "0x{:x} is not a known allocation",
            old_addr
        ))
    })?;

    let new_layout = Layout::array::<u8>(new_size as usize)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let new_ptr = unsafe { realloc(old_ptr, entry.layout, new_size as usize) };
    if new_ptr.is_null() {
        return Err(napi::Error::from_reason("Reallocation failed (OOM)"));
    }

    let new_addr = new_ptr as u64;
    reg.insert(new_addr, AllocEntry { layout: new_layout, tag: entry.tag });

    Ok(encode_ptr(new_ptr))
}

/// Free a previously allocated pointer.
#[napi]
pub fn unsafe_free(pointer: String) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    let addr = ptr as u64;

    let mut reg = REGISTRY.lock().unwrap();
    let entry = reg.remove(&addr).ok_or_else(|| {
        napi::Error::from_reason(format!(
            "Double-free or invalid pointer: 0x{:x}",
            addr
        ))
    })?;

    unsafe { dealloc(ptr, entry.layout) };
    Ok(())
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

/// Attach a human-readable tag to an allocation (for heap dumps / debugging).
#[napi]
pub fn unsafe_tag(pointer: String, tag: String) -> napi::Result<()> {
    let addr = decode_ptr(&pointer)? as u64;
    let mut reg = REGISTRY.lock().unwrap();
    let entry = reg.get_mut(&addr).ok_or_else(|| {
        napi::Error::from_reason(format!("Unknown pointer 0x{:x}", addr))
    })?;
    entry.tag = Some(tag);
    Ok(())
}

// ─── Reads ────────────────────────────────────────────────────────────────────

/// Read `length` raw bytes from pointer. Returns a Buffer.
#[napi]
pub fn unsafe_read(pointer: String, length: u32) -> napi::Result<Vec<u8>> {
    let ptr = decode_ptr(&pointer)?;
    let addr = ptr as u64;
    registry_get(addr)?;

    let reg = REGISTRY.lock().unwrap();
    let entry = &reg[&addr];
    if length as usize > entry.layout.size() {
        return Err(napi::Error::from_reason(format!(
            "Read of {} bytes exceeds allocation size of {} bytes",
            length,
            entry.layout.size()
        )));
    }
    drop(reg);

    Ok(unsafe { std::slice::from_raw_parts(ptr, length as usize).to_vec() })
}

/// Read a UTF-8 string from pointer up to `length` bytes.
#[napi]
pub fn unsafe_read_string(pointer: String, length: u32) -> napi::Result<String> {
    let bytes = unsafe_read(pointer, length)?;
    String::from_utf8(bytes).map_err(|e| napi::Error::from_reason(e.to_string()))
}

/// Read a u8 at pointer.
#[napi]
pub fn unsafe_read_u8(pointer: String) -> napi::Result<u32> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(unsafe { *ptr } as u32)
}

/// Read a u16 at pointer (little-endian).
#[napi]
pub fn unsafe_read_u16(pointer: String) -> napi::Result<u32> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(u16::from_le_bytes(unsafe { *(ptr as *const [u8; 2]) }) as u32)
}

/// Read a u32 at pointer (little-endian).
#[napi]
pub fn unsafe_read_u32(pointer: String) -> napi::Result<u32> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(u32::from_le_bytes(unsafe { *(ptr as *const [u8; 4]) }))
}

/// Read an i32 at pointer (little-endian).
#[napi]
pub fn unsafe_read_i32(pointer: String) -> napi::Result<i32> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(i32::from_le_bytes(unsafe { *(ptr as *const [u8; 4]) }))
}

/// Read an i64 at pointer (little-endian). Returns as string to avoid JS precision loss.
#[napi]
pub fn unsafe_read_i64(pointer: String) -> napi::Result<String> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(i64::from_le_bytes(unsafe { *(ptr as *const [u8; 8]) }).to_string())
}

/// Read an f32 at pointer (little-endian).
#[napi]
pub fn unsafe_read_f32(pointer: String) -> napi::Result<f64> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(f32::from_le_bytes(unsafe { *(ptr as *const [u8; 4]) }) as f64)
}

/// Read an f64 at pointer (little-endian).
#[napi]
pub fn unsafe_read_f64(pointer: String) -> napi::Result<f64> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    Ok(f64::from_le_bytes(unsafe { *(ptr as *const [u8; 8]) }))
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/// Write raw bytes to pointer.
#[napi]
pub fn unsafe_write(pointer: String, bytes: Vec<u8>) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    let addr = ptr as u64;
    registry_get(addr)?;

    let reg = REGISTRY.lock().unwrap();
    let entry = &reg[&addr];
    if bytes.len() > entry.layout.size() {
        return Err(napi::Error::from_reason(format!(
            "Write of {} bytes exceeds allocation size of {} bytes",
            bytes.len(),
            entry.layout.size()
        )));
    }
    drop(reg);

    unsafe { std::ptr::copy_nonoverlapping(bytes.as_ptr(), ptr, bytes.len()) };
    Ok(())
}

/// Write a UTF-8 string to pointer.
#[napi]
pub fn unsafe_write_string(pointer: String, value: String) -> napi::Result<()> {
    unsafe_write(pointer, value.into_bytes())
}

/// Write a u8 to pointer.
#[napi]
pub fn unsafe_write_u8(pointer: String, value: u32) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *ptr = value as u8 };
    Ok(())
}

/// Write a u16 to pointer (little-endian).
#[napi]
pub fn unsafe_write_u16(pointer: String, value: u32) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *(ptr as *mut [u8; 2]) = (value as u16).to_le_bytes() };
    Ok(())
}

/// Write a u32 to pointer (little-endian).
#[napi]
pub fn unsafe_write_u32(pointer: String, value: u32) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *(ptr as *mut [u8; 4]) = value.to_le_bytes() };
    Ok(())
}

/// Write an i32 to pointer (little-endian).
#[napi]
pub fn unsafe_write_i32(pointer: String, value: i32) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *(ptr as *mut [u8; 4]) = value.to_le_bytes() };
    Ok(())
}

/// Write an i64 to pointer (little-endian). Accepts string to avoid JS precision loss.
#[napi]
pub fn unsafe_write_i64(pointer: String, value: String) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    let v = value
        .parse::<i64>()
        .map_err(|_| napi::Error::from_reason(format!("Invalid i64: {}", value)))?;
    unsafe { *(ptr as *mut [u8; 8]) = v.to_le_bytes() };
    Ok(())
}

/// Write an f32 to pointer (little-endian).
#[napi]
pub fn unsafe_write_f32(pointer: String, value: f64) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *(ptr as *mut [u8; 4]) = (value as f32).to_le_bytes() };
    Ok(())
}

/// Write an f64 to pointer (little-endian).
#[napi]
pub fn unsafe_write_f64(pointer: String, value: f64) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { *(ptr as *mut [u8; 8]) = value.to_le_bytes() };
    Ok(())
}

// ─── Memory operations ────────────────────────────────────────────────────────

/// Copy `size` bytes from `src` to `dst`. Regions must not overlap — use unsafe_memmove for overlapping regions.
#[napi]
pub fn unsafe_memcopy(src: String, dst: String, size: u32) -> napi::Result<()> {
    let src_ptr = decode_ptr(&src)?;
    let dst_ptr = decode_ptr(&dst)?;
    registry_get(src_ptr as u64)?;
    registry_get(dst_ptr as u64)?;
    unsafe { std::ptr::copy_nonoverlapping(src_ptr, dst_ptr, size as usize) };
    Ok(())
}

/// Copy `size` bytes from `src` to `dst`. Safe for overlapping regions.
#[napi]
pub fn unsafe_memmove(src: String, dst: String, size: u32) -> napi::Result<()> {
    let src_ptr = decode_ptr(&src)?;
    let dst_ptr = decode_ptr(&dst)?;
    registry_get(src_ptr as u64)?;
    registry_get(dst_ptr as u64)?;
    unsafe { std::ptr::copy(src_ptr, dst_ptr, size as usize) };
    Ok(())
}

/// Fill `size` bytes at `pointer` with `value`.
#[napi]
pub fn unsafe_memset(pointer: String, value: u32, size: u32) -> napi::Result<()> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;
    unsafe { std::ptr::write_bytes(ptr, value as u8, size as usize) };
    Ok(())
}

/// Compare `size` bytes at `a` and `b`. Returns true if equal.
#[napi]
pub fn unsafe_memcmp(a: String, b: String, size: u32) -> napi::Result<bool> {
    let ptr_a = decode_ptr(&a)?;
    let ptr_b = decode_ptr(&b)?;
    registry_get(ptr_a as u64)?;
    registry_get(ptr_b as u64)?;
    let sa = unsafe { std::slice::from_raw_parts(ptr_a, size as usize) };
    let sb = unsafe { std::slice::from_raw_parts(ptr_b, size as usize) };
    Ok(sa == sb)
}

// ─── Pointer arithmetic ───────────────────────────────────────────────────────

/// Add a signed byte offset to a pointer. Returns new pointer string.
/// Does NOT register the result — it is a view into an existing allocation.
#[napi]
pub fn unsafe_ptr_offset(pointer: String, offset: i32) -> napi::Result<String> {
    let ptr = decode_ptr(&pointer)?;
    let result = unsafe { ptr.offset(offset as isize) };
    Ok(encode_ptr(result))
}

/// Subtract two pointers and return the byte difference as a signed string.
#[napi]
pub fn unsafe_ptr_diff(a: String, b: String) -> napi::Result<String> {
    let pa = decode_ptr(&a)? as i64;
    let pb = decode_ptr(&b)? as i64;
    Ok((pa - pb).to_string())
}

/// Return the size of the allocation at this pointer.
#[napi]
pub fn unsafe_alloc_size(pointer: String) -> napi::Result<u32> {
    let addr = decode_ptr(&pointer)? as u64;
    let reg = REGISTRY.lock().unwrap();
    let entry = reg.get(&addr).ok_or_else(|| {
        napi::Error::from_reason(format!("Unknown pointer 0x{:x}", addr))
    })?;
    Ok(entry.layout.size() as u32)
}

/// Return true if the pointer is a known live allocation.
#[napi]
pub fn unsafe_is_valid(pointer: String) -> bool {
    match decode_ptr(&pointer) {
        Ok(ptr) => REGISTRY.lock().unwrap().contains_key(&(ptr as u64)),
        Err(_) => false,
    }
}

// ─── sizeof ───────────────────────────────────────────────────────────────────

/// Return the size in bytes of a primitive type name.
/// Accepts: u8, u16, u32, u64, i8, i16, i32, i64, f32, f64, ptr
#[napi]
pub fn unsafe_sizeof(type_name: String) -> napi::Result<u32> {
    match type_name.to_lowercase().as_str() {
        "u8"  | "i8"  | "bool" | "byte" => Ok(1),
        "u16" | "i16"                   => Ok(2),
        "u32" | "i32" | "f32"           => Ok(4),
        "u64" | "i64" | "f64" | "ptr"  => Ok(8),
        other => Err(napi::Error::from_reason(format!("Unknown type: {}", other))),
    }
}

// ─── Heap dump ────────────────────────────────────────────────────────────────

/// Return a formatted hex dump of `length` bytes at `pointer`.
#[napi]
pub fn unsafe_hex_dump(pointer: String, length: u32) -> napi::Result<String> {
    let ptr = decode_ptr(&pointer)?;
    registry_get(ptr as u64)?;

    let bytes = unsafe { std::slice::from_raw_parts(ptr, length as usize) };
    let mut out = String::new();
    let base_addr = ptr as u64;

    for (chunk_idx, chunk) in bytes.chunks(16).enumerate() {
        let offset = chunk_idx * 16;
        out.push_str(&format!("{:016x}  ", base_addr + offset as u64));

        // Hex bytes
        for (i, b) in chunk.iter().enumerate() {
            out.push_str(&format!("{:02x} ", b));
            if i == 7 { out.push(' '); }
        }
        // Pad last line
        if chunk.len() < 16 {
            let pad = 16 - chunk.len();
            for _ in 0..pad { out.push_str("   "); }
            if chunk.len() <= 8 { out.push(' '); }
        }

        out.push_str(" |");
        for &b in chunk {
            out.push(if b.is_ascii_graphic() || b == b' ' { b as char } else { '.' });
        }
        out.push_str("|\n");
    }

    Ok(out)
}

/// Return a JSON summary of all live allocations.
#[napi]
pub fn unsafe_list_allocations() -> String {
    let reg = REGISTRY.lock().unwrap();
    let entries: Vec<String> = reg
        .iter()
        .map(|(addr, entry)| {
            format!(
                r#"{{"ptr":"{}","size":{},"tag":{}}}"#,
                addr,
                entry.layout.size(),
                entry.tag.as_ref().map_or("null".into(), |t| format!("\"{}\"", t))
            )
        })
        .collect();
    format!("[{}]", entries.join(","))
}

/// Return count of live allocations and total bytes allocated.
#[napi]
pub fn unsafe_stats() -> String {
    let reg = REGISTRY.lock().unwrap();
    let count = reg.len();
    let total: usize = reg.values().map(|e| e.layout.size()).sum();
    format!(r#"{{"count":{},"totalBytes":{}}}"#, count, total)
}
