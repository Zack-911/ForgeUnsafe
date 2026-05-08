"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeMemmove',
    aliases: ['$memmove'],
    description: 'Move N bytes from src to dst. Safe for overlapping regions.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'src', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'dst', description: 'Destination pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to move.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [src, dst, bytes]) {
        try {
            native_1.native.unsafeMemmove(src, dst, bytes);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeMemmove.js.map