"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafePtrDiff',
    aliases: ['$ptrDiff'],
    description: 'Subtract two pointer addresses. Returns the signed byte difference as a string.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'a', description: 'First pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'b', description: 'Second pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [a, b]) {
        try {
            return this.success(native_1.native.unsafePtrDiff(a, b));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafePtrDiff.js.map