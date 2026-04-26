import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeWriteString',
    description: 'Write a UTF-8 string to a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.',  type: ArgType.String, required: true, rest: false },
        { name: 'value',   description: 'String to write.', type: ArgType.String, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try { native.unsafeWriteString(pointer, value); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
