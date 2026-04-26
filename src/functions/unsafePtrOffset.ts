import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafePtrOffset',
    aliases: ['$ptrOffset'],
    description: 'Add a signed byte offset to a pointer. Returns the new pointer address. Does not create a new allocation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.',    type: ArgType.String, required: true, rest: false },
        { name: 'offset',  description: 'Signed byte offset.', type: ArgType.Number, required: true, rest: false },
    ],
    output: ArgType.String,
    execute(_ctx, [pointer, offset]) {
        try { return this.success(native.unsafePtrOffset(pointer, offset)) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
