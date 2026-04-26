import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeMemcopy',
    aliases: ['$memcopy', '$memcpy'],
    description: 'Copy N bytes from src pointer to dst pointer. Regions must not overlap.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'src',   description: 'Source pointer.',          type: ArgType.String, required: true, rest: false },
        { name: 'dst',   description: 'Destination pointer.',     type: ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to copy.', type: ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [src, dst, bytes]) {
        try { native.unsafeMemcopy(src, dst, bytes); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
