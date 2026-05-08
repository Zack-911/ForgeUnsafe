"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeWriteU8',
    description: 'Write an unsigned 8-bit integer to a pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'value', description: 'Unsigned 8-bit value.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value]) {
        try {
            native_1.native.unsafeWriteU8(pointer, value);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeWriteU8.js.map