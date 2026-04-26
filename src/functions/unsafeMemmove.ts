import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeMemmove',
    aliases: ['$memmove'],
    description: 'Move N bytes from src to dst. Safe for overlapping regions.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'src',   description: 'Source pointer.',          type: ArgType.String, required: true, rest: false },
        { name: 'dst',   description: 'Destination pointer.',     type: ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to move.', type: ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [src, dst, bytes]) {
        try { native.unsafeMemmove(src, dst, bytes); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
