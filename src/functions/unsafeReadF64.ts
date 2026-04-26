import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeReadF64',
    description: 'Read a 64-bit float (little-endian) from a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: ArgType.String, required: true, rest: false }],
    output: ArgType.Number,
    execute(_ctx, [pointer]) {
        try { return this.success(String(native.unsafeReadF64(pointer))) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
