import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeReadU8',
    description: 'Read an unsigned 8-bit integer from a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: ArgType.String, required: true, rest: false }],
    output: ArgType.Number,
    execute(_ctx, [pointer]) {
        try { return this.success(String(native.unsafeReadU8(pointer))) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
