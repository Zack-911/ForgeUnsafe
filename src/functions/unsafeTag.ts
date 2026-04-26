import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeTag',
    description: 'Attach a human-readable label to an allocation for debugging.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Pointer to label.',          type: ArgType.String, required: true, rest: false },
        { name: 'tag',     description: 'Human-readable label text.', type: ArgType.String, required: true, rest: false },
    ],
    execute(_ctx, [pointer, tag]) {
        try { native.unsafeTag(pointer, tag); return this.success() }
        catch (e) { return this.customError((e as Error).message) }
    },
})
