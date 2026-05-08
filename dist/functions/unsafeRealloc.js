"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeRealloc',
    aliases: ['$realloc'],
    description: 'Resize a previous allocation. Returns the new pointer. The old pointer is invalidated.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'pointer',
            description: 'The pointer to reallocate.',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'newSize',
            description: 'New size in bytes.',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [pointer, newSize]) {
        try {
            return this.success(native_1.native.unsafeRealloc(pointer, newSize));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeRealloc.js.map