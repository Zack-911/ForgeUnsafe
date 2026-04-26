import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeRealloc',
    aliases: ['$realloc'],
    description: 'Resize a previous allocation. Returns the new pointer. The old pointer is invalidated.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'pointer',
            description: 'The pointer to reallocate.',
            type: ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'newSize',
            description: 'New size in bytes.',
            type: ArgType.Number,
            required: true,
            rest: false,
        },
    ],
    output: ArgType.String,
    execute(_ctx, [pointer, newSize]) {
        try {
            return this.success(native.unsafeRealloc(pointer, newSize))
        } catch (e) {
            return this.customError((e as Error).message)
        }
    },
})
