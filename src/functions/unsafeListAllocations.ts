import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeListAllocations',
    aliases: ['$listAllocations'],
    description: 'Return a JSON array of all live allocations with their pointer address, size, and tag.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    output: ArgType.Json,
    execute(_ctx: any) {
        return this.success(native.unsafeListAllocations())
    },
})
