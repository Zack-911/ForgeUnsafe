"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeMalloc',
    aliases: ['$malloc'],
    description: 'Allocate N bytes on the native heap. Returns a pointer string. Memory is uninitialized — use $unsafeCalloc for zeroed memory.',
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
            return this.success(native_1.native.unsafeMalloc(size));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeMalloc.js.map