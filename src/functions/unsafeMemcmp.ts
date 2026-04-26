import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeMemcmp',
    aliases: ['$memcmp'],
    description: 'Compare N bytes at two pointers. Returns true if they are identical.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'a',     description: 'First pointer.',              type: ArgType.String, required: true, rest: false },
        { name: 'b',     description: 'Second pointer.',             type: ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to compare.', type: ArgType.Number, required: true, rest: false },
    ],
    output: ArgType.Boolean,
    execute(_ctx, [a, b, bytes]) {
        try { return this.success(String(native.unsafeMemcmp(a, b, bytes))) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
