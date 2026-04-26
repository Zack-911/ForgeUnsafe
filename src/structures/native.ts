/**
 * native.ts
 *
 * Loads the compiled napi-rs addon (.node file) and re-exports its functions
 * with TypeScript types. The addon is found by checking:
 *   1. FORGEUNSAFE_ADDON environment variable (for custom paths)
 *   2. __dirname/forgeunsafe.<platform>-<arch>.node (standard napi-rs output)
 *   3. __dirname/forgeunsafe.node (fallback)
 */

import { existsSync } from 'fs'
import path from 'path'

// ─── Addon loading ────────────────────────────────────────────────────────────

function loadAddon(): NativeAddon {
    // 1. Env override
    if (process.env.FORGEUNSAFE_ADDON) {
        return require(process.env.FORGEUNSAFE_ADDON)
    }

    // 2. Platform-specific napi-rs triple name
    const platform = process.platform   // linux, darwin, win32
    const arch     = process.arch       // x64, arm64, ia32
    const triple   = `${platform}-${arch}`

    const candidates = [
        path.join(__dirname, '..', `forgeunsafe.${triple}.node`),
        path.join(__dirname, '..', 'forgeunsafe.node'),
        path.join(__dirname, '..', 'rust', 'target', 'release', 'libforgeunsafe.so'),
        path.join(__dirname, '..', 'rust', 'target', 'release', 'forgeunsafe.dll'),
        path.join(__dirname, '..', 'rust', 'target', 'release', 'libforgeunsafe.dylib'),
    ]

    for (const candidate of candidates) {
        if (existsSync(candidate)) return require(candidate)
    }

    throw new Error(
        `[ForgeUnsafe] Could not find native addon. ` +
        `Run \`npm run build:rust\` to compile it first, or set FORGEUNSAFE_ADDON to the .node file path.\n` +
        `Searched:\n${candidates.map(c => `  ${c}`).join('\n')}`
    )
}

// ─── Native interface ─────────────────────────────────────────────────────────

export interface NativeAddon {
    // Allocation
    unsafeMalloc(size: number): string
    unsafeCalloc(size: number): string
    unsafeRealloc(pointer: string, newSize: number): string
    unsafeFree(pointer: string): void
    unsafeTag(pointer: string, tag: string): void

    // Reads
    unsafeRead(pointer: string, length: number): Buffer
    unsafeReadString(pointer: string, length: number): string
    unsafeReadU8(pointer: string): number
    unsafeReadU16(pointer: string): number
    unsafeReadU32(pointer: string): number
    unsafeReadI32(pointer: string): number
    unsafeReadI64(pointer: string): string
    unsafeReadF32(pointer: string): number
    unsafeReadF64(pointer: string): number

    // Writes
    unsafeWrite(pointer: string, bytes: Buffer | Uint8Array): void
    unsafeWriteString(pointer: string, value: string): void
    unsafeWriteU8(pointer: string, value: number): void
    unsafeWriteU16(pointer: string, value: number): void
    unsafeWriteU32(pointer: string, value: number): void
    unsafeWriteI32(pointer: string, value: number): void
    unsafeWriteI64(pointer: string, value: string): void
    unsafeWriteF32(pointer: string, value: number): void
    unsafeWriteF64(pointer: string, value: number): void

    // Memory operations
    unsafeMemcopy(src: string, dst: string, size: number): void
    unsafeMemmove(src: string, dst: string, size: number): void
    unsafeMemset(pointer: string, value: number, size: number): void
    unsafeMemcmp(a: string, b: string, size: number): boolean

    // Pointer arithmetic
    unsafePtrOffset(pointer: string, offset: number): string
    unsafePtrDiff(a: string, b: string): string
    unsafeAllocSize(pointer: string): number
    unsafeIsValid(pointer: string): boolean

    // sizeof
    unsafeSizeof(typeName: string): number

    // Diagnostics
    unsafeHexDump(pointer: string, length: number): string
    unsafeListAllocations(): string
    unsafeStats(): string
}

export interface AllocationEntry {
    ptr: string
    size: number
    tag: string | null
}

export interface HeapStats {
    count: number
    totalBytes: number
}

// ─── Export singleton ─────────────────────────────────────────────────────────

export const native: NativeAddon = loadAddon()
