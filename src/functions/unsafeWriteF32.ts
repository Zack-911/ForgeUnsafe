import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeWriteF32',
    description: 'Write a 32-bit float (little-endian) to a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.',    type: ArgType.String, required: true, rest: false },
        { name: 'value',   description: '32-bit float value.', type: ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try { native.unsafeWriteF32(pointer, value); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
