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

    // 2. Build napi-rs platform triple
    //    Linux uses an ABI suffix (-gnu / -musl); darwin and win32 do not.
    const platform = process.platform   // linux | darwin | win32
    const arch     = process.arch       // x64 | arm64 | ia32 | arm

    function getTriple(): string {
        if (platform === 'linux') {
            // detect musl vs glibc
            try {
                const { execSync } = require('child_process')
                const out = execSync('ldd --version 2>&1').toString()
                return out.includes('musl') ? `linux-${arch}-musl` : `linux-${arch}-gnu`
            } catch {
                return `linux-${arch}-gnu`
            }
        }
        return `${platform}-${arch}`
    }

    const triple = getTriple()

    // __dirname is <project>/dist/structures when running compiled output,
    // so go up two levels to reach the project root where copy-addon.js
    // places the .node file.
    const projectRoot = path.resolve(__dirname, '..', '..')
    const distRoot    = path.resolve(__dirname, '..')

    const candidates = [
        // project root (primary — where copy-addon.js puts the file)
        path.join(projectRoot, `forgeunsafe.${triple}.node`),
        path.join(projectRoot, 'forgeunsafe.node'),
        // dist root (in case someone copies it there)
        path.join(distRoot, `forgeunsafe.${triple}.node`),
        path.join(distRoot, 'forgeunsafe.node'),
        // raw Rust build output (dev convenience)
        path.join(projectRoot, 'rust', 'target', 'release', 'libforgeunsafe.so'),
        path.join(projectRoot, 'rust', 'target', 'release', 'forgeunsafe.dll'),
        path.join(projectRoot, 'rust', 'target', 'release', 'libforgeunsafe.dylib'),
    ]

    for (const candidate of candidates) {
        if (existsSync(candidate)) return require(candidate)
    }

    throw new Error(
        `[ForgeUnsafe] Could not find native addon.\n` +
        `This extension requires a native binary. We tried searching in:\n` +
        candidates.map(c => `  - ${c}`).join('\n') +
        ` \n\n` +
        `If you are using this as a dependency, try running:\n` +
        `  node node_modules/forge.unsafe/scripts/install.js\n\n` +
        `If you are developing locally, run:\n` +
        `  npm run build:rust`
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
