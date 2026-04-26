import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeStats',
    aliases: ['$heapStats'],
    description: 'Return a JSON object with live allocation count and total bytes currently allocated.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    output: ArgType.Json,
    execute(_ctx: any) {
        return this.success(native.unsafeStats())
    },
})
