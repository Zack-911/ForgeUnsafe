import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafePtrDiff',
    aliases: ['$ptrDiff'],
    description: 'Subtract two pointer addresses. Returns the signed byte difference as a string.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'a', description: 'First pointer.',  type: ArgType.String, required: true, rest: false },
        { name: 'b', description: 'Second pointer.', type: ArgType.String, required: true, rest: false },
    ],
    output: ArgType.String,
    execute(_ctx, [a, b]) {
        try { return this.success(native.unsafePtrDiff(a, b)) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
