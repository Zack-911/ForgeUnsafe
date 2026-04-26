import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeMalloc',
    aliases: ['$malloc'],
    description: 'Allocate N bytes on the native heap. Returns a pointer string. Memory is uninitialized — use $unsafeCalloc for zeroed memory.',
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
            return this.success(native.unsafeMalloc(size))
        } catch (e) {
            return this.customError((e as Error).message)
        }
    },
})
