"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeWriteU16',
    description: 'Write an unsigned 16-bit integer (little-endian) to a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'value', description: 'Unsigned 16-bit value.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try {
            native_1.native.unsafeWriteU16(pointer, value);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeWriteU16.js.map