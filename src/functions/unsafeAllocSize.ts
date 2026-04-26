import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeAllocSize',
    aliases: ['$allocSize'],
    description: 'Return the size in bytes of an existing allocation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Pointer to query.', type: ArgType.String, required: true, rest: false },
    ],
    output: ArgType.Number,
    execute(_ctx, [pointer]) {
        try { return this.success(String(native.unsafeAllocSize(pointer))) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
