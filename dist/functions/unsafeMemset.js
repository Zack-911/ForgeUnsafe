"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeMemset',
    aliases: ['$memset'],
    description: 'Fill N bytes at pointer with a byte value.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Target pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'value', description: 'Byte value to fill (0-255).', type: forgescript_1.ArgType.Number, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to fill.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [pointer, value, bytes]) {
        try {
            native_1.native.unsafeMemset(pointer, value, bytes);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeMemset.js.map