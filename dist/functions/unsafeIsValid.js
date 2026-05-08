"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeIsValid',
    aliases: ['$isValidPtr'],
    description: 'Returns true if the pointer refers to a live allocation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Pointer to check.', type: forgescript_1.ArgType.String, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(_ctx, [pointer]) {
        return this.success(String(native_1.native.unsafeIsValid(pointer)));
    },
});
//# sourceMappingURL=unsafeIsValid.js.map