# forge.unsafe

Real native memory management for ForgeScript via napi-rs. Exposes `malloc`, `free`, `realloc`, typed reads/writes, pointer arithmetic, `memcpy`, `memset`, `memcmp`, hex dumps, and live heap diagnostics — all from ForgeScript `$functions`.

The addon is compiled from Rust using [napi-rs](https://napi.rs). All pointers are real OS-level memory addresses backed by Rust's allocator.

---

## Building

### Prerequisites

- Rust + Cargo — [rustup.rs](https://rustup.rs)
- Node.js ≥ 18
- `@napi-rs/cli` — `npm i -g @napi-rs/cli`

### Build the native addon

```bash
cd rust
cargo build --release
```

The compiled `.node` file will be at:
- Linux:   `rust/target/release/libforgeunsafe.so`
- macOS:   `rust/target/release/libforgeunsafe.dylib`
- Windows: `rust/target/release/forgeunsafe.dll`

Copy it to the project root and rename it `forgeunsafe.node`:
```bash
cp rust/target/release/libforgeunsafe.so forgeunsafe.node   # Linux
cp rust/target/release/libforgeunsafe.dylib forgeunsafe.node # macOS
```

Or use the napi-rs CLI to build and name it correctly:
```bash
napi build --platform --release
```

### Build TypeScript

```bash
npm run build:ts
```

---

## Setup

```ts
import { ForgeClient } from '@tryforge/forgescript'
import { ForgeUnsafe } from '@tryforge/forge.unsafe'

const unsafe = new ForgeUnsafe()

const client = new ForgeClient({
    token: process.env.BOT_TOKEN,
    extensions: [unsafe],
    // ...
})

// Direct TypeScript access (bypasses ForgeScript):
const ptr = unsafe.native.unsafeMalloc(8)
unsafe.native.unsafeWriteF64(ptr, Math.PI)
console.log(unsafe.native.unsafeReadF64(ptr)) // 3.141592653589793
unsafe.native.unsafeFree(ptr)
```

---

## $functions reference

### Allocation

| Function | Description |
|---|---|
| `$unsafeMalloc[size]` | Allocate N bytes. Returns pointer string. Memory is uninitialized. |
| `$unsafeCalloc[size]` | Allocate N bytes, zero-initialized. Returns pointer string. |
| `$unsafeRealloc[ptr;newSize]` | Resize an allocation. Old pointer is invalidated. Returns new pointer. |
| `$unsafeFree[ptr]` | Free an allocation. Errors on double-free or unknown pointer. |
| `$unsafeTag[ptr;label]` | Attach a debug label to an allocation. |

### Typed reads

| Function | Returns |
|---|---|
| `$unsafeRead[ptr;length]` | Raw bytes as hex string |
| `$unsafeReadString[ptr;length]` | UTF-8 string |
| `$unsafeReadU8[ptr]` | u8 (0–255) |
| `$unsafeReadU16[ptr]` | u16 (0–65535), little-endian |
| `$unsafeReadU32[ptr]` | u32, little-endian |
| `$unsafeReadI32[ptr]` | i32, little-endian |
| `$unsafeReadI64[ptr]` | i64 as string (avoids JS precision loss) |
| `$unsafeReadF32[ptr]` | f32 as JS number |
| `$unsafeReadF64[ptr]` | f64 as JS number |

### Typed writes

| Function | Description |
|---|---|
| `$unsafeWriteString[ptr;value]` | Write UTF-8 string bytes |
| `$unsafeWriteU8[ptr;value]` | Write u8 |
| `$unsafeWriteU16[ptr;value]` | Write u16, little-endian |
| `$unsafeWriteU32[ptr;value]` | Write u32, little-endian |
| `$unsafeWriteI32[ptr;value]` | Write i32, little-endian |
| `$unsafeWriteI64[ptr;value]` | Write i64 (pass as string), little-endian |
| `$unsafeWriteF32[ptr;value]` | Write f32, little-endian |
| `$unsafeWriteF64[ptr;value]` | Write f64, little-endian |

### Memory operations

| Function | Description |
|---|---|
| `$unsafeMemcopy[src;dst;bytes]` | Copy N bytes. Regions must not overlap. |
| `$unsafeMemmove[src;dst;bytes]` | Move N bytes. Safe for overlapping regions. |
| `$unsafeMemset[ptr;value;bytes]` | Fill N bytes with a value (0–255). |
| `$unsafeMemcmp[a;b;bytes]` | Compare N bytes. Returns `true` if identical. |

### Pointer arithmetic

| Function | Description |
|---|---|
| `$unsafePtrOffset[ptr;offset]` | Add signed byte offset to pointer. Returns new address. |
| `$unsafePtrDiff[a;b]` | Byte difference between two addresses (as string). |
| `$unsafeAllocSize[ptr]` | Size of the allocation at this pointer. |
| `$unsafeIsValid[ptr]` | `true` if pointer is a live allocation. |
| `$unsafeSizeof[type]` | Byte size of a primitive type name. |

### Diagnostics

| Function | Description |
|---|---|
| `$unsafeHexDump[ptr;length]` | Formatted hex+ASCII dump. |
| `$unsafeListAllocations` | JSON array of all live allocations. |
| `$unsafeStats` | JSON `{ count, totalBytes }` of current heap usage. |

---

## Pointer format

Pointers are decimal `u64` strings, e.g. `"140234567890312"`. This avoids JavaScript `Number` precision loss — a 64-bit address doesn't fit in a 53-bit float. Always store them in `$let` or pass them directly:

```
$let[ptr;$unsafeMalloc[16]]
$unsafeWriteI32[$get[ptr];42]
$unsafeReadI32[$get[ptr]]    → 42
$unsafeFree[$get[ptr]]
```

---

## Safety

ForgeUnsafe maintains a global allocation registry (Rust `Mutex<HashMap<u64, Layout>>`). Every `malloc`/`calloc`/`realloc` result is registered. Every read/write checks the registry before touching memory. `free` removes the entry and calls `dealloc`. This gives you:

- **Double-free detection** — `$unsafeFree` on an already-freed pointer errors.
- **Use-after-free detection** — `$unsafeRead` / `$unsafeWrite` on a freed pointer errors.
- **Bounds checking** — reads/writes that exceed the allocation size error.
- **Pointer arithmetic safety** — `$unsafePtrOffset` returns a raw address without registering it; reads/writes at the offset still validate against the base allocation's registered entry. Note: ForgeUnsafe does not validate that offset pointers point inside the original allocation — that responsibility is yours.

This is still `unsafe` Rust under the hood. ForgeUnsafe trusts that the pointer strings you pass are the ones it gave you. Never construct pointer strings manually.
