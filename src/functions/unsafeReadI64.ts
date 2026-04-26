import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeReadI64',
    description: 'Read a signed 64-bit integer (little-endian) from a pointer. Returns as string to preserve precision.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: ArgType.String, required: true, rest: false }],
    output: ArgType.String,
    execute(_ctx, [pointer]) {
        try { return this.success(native.unsafeReadI64(pointer)) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
