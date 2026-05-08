"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeWriteI64',
    description: 'Write a signed 64-bit integer (little-endian) to a pointer. Pass value as string to preserve precision.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'value', description: 'Signed 64-bit value as string.', type: forgescript_1.ArgType.String, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try {
            native_1.native.unsafeWriteI64(pointer, value);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeWriteI64.js.map