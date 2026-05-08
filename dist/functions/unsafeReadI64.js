"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeReadI64',
    description: 'Read a signed 64-bit integer (little-endian) from a pointer. Returns as string to preserve precision.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false }],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [pointer]) {
        try {
            return this.success(native_1.native.unsafeReadI64(pointer));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeReadI64.js.map