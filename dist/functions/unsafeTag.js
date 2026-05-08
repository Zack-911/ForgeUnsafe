"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeTag',
    description: 'Attach a human-readable label to an allocation for debugging.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'pointer', description: 'Pointer to label.', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'tag', description: 'Human-readable label text.', type: forgescript_1.ArgType.String, required: true, rest: false },
    ],
    execute(_ctx, [pointer, tag]) {
        try {
            native_1.native.unsafeTag(pointer, tag);
            return this.success();
        }
        catch (e) {
            return this.customError(e.message);
        }
    },
});
//# sourceMappingURL=unsafeTag.js.map