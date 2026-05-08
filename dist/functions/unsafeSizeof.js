"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeSizeof',
    aliases: ['$sizeof'],
    description: 'Returns the byte size of a primitive type. Types: u8, u16, u32, u64, i8, i16, i32, i64, f32, f64, ptr.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'type', description: 'Primitive type name (u8, u16, u32, u64, i8, i16, i32, i64, f32, f64, ptr).', type: forgescript_1.ArgType.String, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.Number,
    execute(_ctx, [type]) {
        try {
            return this.success(String(native_1.native.unsafeSizeof(type)));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeSizeof.js.map