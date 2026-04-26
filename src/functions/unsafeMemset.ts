import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeMemset',
    aliases: ['$memset'],
    description: 'Fill N bytes at pointer with a byte value.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.',            type: ArgType.String, required: true, rest: false },
        { name: 'value',   description: 'Byte value to fill (0-255).', type: ArgType.Number, required: true, rest: false },
        { name: 'bytes',   description: 'Number of bytes to fill.',    type: ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value, bytes]) {
        try { native.unsafeMemset(pointer, value, bytes); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
