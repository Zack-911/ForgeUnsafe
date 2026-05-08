"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeHexDump',
    aliases: ['$hexDump'],
    description: 'Return a formatted hex+ASCII dump of N bytes at a pointer. Useful for debugging memory contents.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'length', description: 'Number of bytes to dump.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [pointer, length]) {
        try {
            return this.success(native_1.native.unsafeHexDump(pointer, length));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeHexDump.js.map