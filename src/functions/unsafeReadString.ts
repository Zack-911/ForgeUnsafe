import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeReadString',
    description: 'Read N bytes from a pointer as a UTF-8 string.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.',          type: ArgType.String, required: true, rest: false },
        { name: 'length',  description: 'Number of bytes to read.', type: ArgType.Number, required: true, rest: false },
    ],
    output: ArgType.String,
    execute(_ctx, [pointer, length]) {
        try { return this.success(native.unsafeReadString(pointer, length)) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
