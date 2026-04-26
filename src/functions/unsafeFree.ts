import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeFree',
    aliases: ['$free'],
    description: 'Free a previously allocated pointer. Errors on double-free or invalid pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'pointer',
            description: 'The pointer to free.',
            type: ArgType.String,
            required: true,
            rest: false,
        },
    ],
    execute(_ctx, [pointer]) {
        try {
            native.unsafeFree(pointer)
            return this.success()
        } catch (e) {
            return this.customError((e as Error).message)
        }
    },
})
