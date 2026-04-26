import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { native } from '../structures/native'

export default new NativeFunction({
    name: '$unsafeSizeof',
    aliases: ['$sizeof'],
    description: 'Returns the byte size of a primitive type. Types: u8, u16, u32, u64, i8, i16, i32, i64, f32, f64, ptr.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'type', description: 'Primitive type name (u8, u16, u32, u64, i8, i16, i32, i64, f32, f64, ptr).', type: ArgType.String, required: true, rest: false },
    ],
    output: ArgType.Number,
    execute(_ctx, [type]) {
        try { return this.success(String(native.unsafeSizeof(type))) }
        catch (e) { return this.customError((e as Error).message) }
    },
})
