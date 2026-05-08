"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeCalloc',
    aliases: ['$calloc'],
    description: 'Allocate N bytes on the native heap, zero-initialized. Returns a pointer string.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'size',
            description: 'Number of bytes to allocate.',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [size]) {
        try {
            return this.success(native_1.native.unsafeCalloc(size));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeCalloc.js.map