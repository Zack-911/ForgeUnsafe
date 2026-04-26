import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeHexDump',
    aliases: ['$hexDump'],
    description: 'Return a formatted hex+ASCII dump of N bytes at a pointer. Useful for debugging memory contents.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.',        type: ArgType.String, required: true, rest: false },
        { name: 'length',  description: 'Number of bytes to dump.', type: ArgType.Number, required: true, rest: false },
    ],
    output: ArgType.String,
    execute(_ctx, [pointer, length]) {
        try { return this.success(native.unsafeHexDump(pointer, length)) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
