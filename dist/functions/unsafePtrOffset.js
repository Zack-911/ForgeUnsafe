"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafePtrOffset',
    aliases: ['$ptrOffset'],
    description: 'Add a signed byte offset to a pointer. Returns the new pointer address. Does not create a new allocation.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'offset', description: 'Signed byte offset.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [pointer, offset]) {
        try {
            return this.success(native_1.native.unsafePtrOffset(pointer, offset));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafePtrOffset.js.map