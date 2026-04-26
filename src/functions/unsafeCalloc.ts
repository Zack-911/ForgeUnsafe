import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeCalloc',
    aliases: ['$calloc'],
    description: 'Allocate N bytes on the native heap, zero-initialized. Returns a pointer string.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'size',
            description: 'Number of bytes to allocate.',
            type: ArgType.Number,
            required: true,
            rest: false,
        },
    ],
    output: ArgType.String,
    execute(_ctx, [size]) {
        try {
            return this.success(native.unsafeCalloc(size))
        } catch (e) {
            return this.customError((e as Error).message)
        }
    },
})
