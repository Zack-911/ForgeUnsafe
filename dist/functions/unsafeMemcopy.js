"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeMemcopy',
    aliases: ['$memcopy', '$memcpy'],
    description: 'Copy N bytes from src pointer to dst pointer. Regions must not overlap.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'src', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'dst', description: 'Destination pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to copy.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    execute(_ctx, [src, dst, bytes]) {
        try {
            native_1.native.unsafeMemcopy(src, dst, bytes);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeMemcopy.js.map