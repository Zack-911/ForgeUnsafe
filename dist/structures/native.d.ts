/**
 * native.ts
 *
 * Loads the compiled napi-rs addon (.node file) and re-exports its functions
 * with TypeScript types. The addon is found by checking:
 *   1. FORGEUNSAFE_ADDON environment variable (for custom paths)
 *   2. __dirname/forgeunsafe.<platform>-<arch>.node (standard napi-rs output)
 *   3. __dirname/forgeunsafe.node (fallback)
 */
export interface NativeAddon {
    unsafeMalloc(size: number): string;
    unsafeCalloc(size: number): string;
    unsafeRealloc(pointer: string, newSize: number): string;
    unsafeFree(pointer: string): void;
    unsafeTag(pointer: string, tag: string): void;
    unsafeRead(pointer: string, length: number): Buffer;
    unsafeReadString(pointer: string, length: number): string;
    unsafeReadU8(pointer: string): number;
    unsafeReadU16(pointer: string): number;
    unsafeReadU32(pointer: string): number;
    unsafeReadI32(pointer: string): number;
    unsafeReadI64(pointer: string): string;
    unsafeReadF32(pointer: string): number;
    unsafeReadF64(pointer: string): number;
    unsafeWrite(pointer: string, bytes: Buffer | Uint8Array): void;
    unsafeWriteString(pointer: string, value: string): void;
    unsafeWriteU8(pointer: string, value: number): void;
    unsafeWriteU16(pointer: string, value: number): void;
    unsafeWriteU32(pointer: string, value: number): void;
    unsafeWriteI32(pointer: string, value: number): void;
    unsafeWriteI64(pointer: string, value: string): void;
    unsafeWriteF32(pointer: string, value: number): void;
    unsafeWriteF64(pointer: string, value: number): void;
    unsafeMemcopy(src: string, dst: string, size: number): void;
    unsafeMemmove(src: string, dst: string, size: number): void;
    unsafeMemset(pointer: string, value: number, size: number): void;
    unsafeMemcmp(a: string, b: string, size: number): boolean;
    unsafePtrOffset(pointer: string, offset: number): string;
    unsafePtrDiff(a: string, b: string): string;
    unsafeAllocSize(pointer: string): number;
    unsafeIsValid(pointer: string): boolean;
    unsafeSizeof(typeName: string): number;
    unsafeHexDump(pointer: string, length: number): string;
    unsafeListAllocations(): string;
    unsafeStats(): string;
}
export interface AllocationEntry {
    ptr: string;
    size: number;
    tag: string | null;
}
export interface HeapStats {
    count: number;
    totalBytes: number;
}
export declare const native: NativeAddon;
//# sourceMappingURL=native.d.ts.map