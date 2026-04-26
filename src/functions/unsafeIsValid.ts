import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeIsValid',
    aliases: ['$isValidPtr'],
    description: 'Returns true if the pointer refers to a live allocation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Pointer to check.', type: ArgType.String, required: true, rest: false },
    ],
    output: ArgType.Boolean,
    execute(_ctx, [pointer]) {
        return this.success(String(native.unsafeIsValid(pointer)))
    },
})
