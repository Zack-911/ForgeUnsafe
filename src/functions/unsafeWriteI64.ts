import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeWriteI64',
    description: 'Write a signed 64-bit integer (little-endian) to a pointer. Pass value as string to preserve precision.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.',                type: ArgType.String, required: true, rest: false },
        { name: 'value',   description: 'Signed 64-bit value as string.', type: ArgType.String, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try { native.unsafeWriteI64(pointer, value); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
