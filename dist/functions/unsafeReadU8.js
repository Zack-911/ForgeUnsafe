"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeReadU8',
    description: 'Read an unsigned 8-bit integer from a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false }],
    output: forgescript_1.ArgType.Number,
    execute(_ctx, [pointer]) {
        try {
            return this.success(String(native_1.native.unsafeReadU8(pointer)));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeReadU8.js.map