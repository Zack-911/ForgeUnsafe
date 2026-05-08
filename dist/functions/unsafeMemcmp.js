"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeMemcmp',
    aliases: ['$memcmp'],
    description: 'Compare N bytes at two pointers. Returns true if they are identical.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'a', description: 'First pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'b', description: 'Second pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'bytes', description: 'Number of bytes to compare.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(_ctx, [a, b, bytes]) {
        try {
            return this.success(String(native_1.native.unsafeMemcmp(a, b, bytes)));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeMemcmp.js.map