import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeRead',
    description: 'Read N raw bytes from a pointer. Returns a hex string of the bytes.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.',        type: ArgType.String, required: true, rest: false },
        { name: 'length',  description: 'Number of bytes to read.', type: ArgType.Number, required: true, rest: false },
    ],
    output: ArgType.String,
    execute(_ctx, [pointer, length]) {
        try {
            const buf = native.unsafeRead(pointer, length)
            return this.success(Buffer.from(buf).toString('hex'))
        } catch (e) { return this.customError((e as Error).message) }
    },
})
