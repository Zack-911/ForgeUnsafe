"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeReadF32',
    description: 'Read a 32-bit float (little-endian) from a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false }],
    output: forgescript_1.ArgType.Number,
    execute(_ctx, [pointer]) {
        try {
            return this.success(String(native_1.native.unsafeReadF32(pointer)));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeReadF32.js.map