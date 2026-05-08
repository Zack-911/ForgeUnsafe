"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeFree',
    aliases: ['$free'],
    description: 'Free a previously allocated pointer. Errors on double-free or invalid pointer.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'pointer',
            description: 'The pointer to free.',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    execute(_ctx, [pointer]) {
        try {
            native_1.native.unsafeFree(pointer);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeFree.js.map