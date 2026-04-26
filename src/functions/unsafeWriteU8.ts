import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeWriteU8',
    description: 'Write an unsigned 8-bit integer to a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.',      type: ArgType.String, required: true, rest: false },
        { name: 'value',   description: 'Unsigned 8-bit value.', type: ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try { native.unsafeWriteU8(pointer, value); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
