"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeRead',
    description: 'Read N raw bytes from a pointer. Returns a hex string of the bytes.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Source pointer.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'length', description: 'Number of bytes to read.', type: forgescript_1.ArgType.Number, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.String,
    execute(_ctx, [pointer, length]) {
        try {
            const buf = native_1.native.unsafeRead(pointer, length);
            return this.success(Buffer.from(buf).toString('hex'));
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeRead.js.map