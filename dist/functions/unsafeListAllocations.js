"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeListAllocations',
    aliases: ['$listAllocations'],
    description: 'Return a JSON array of all live allocations with their pointer address, size, and tag.',
    version: '1.0.0',
    unwrap: false,
    output: forgescript_1.ArgType.Json,
    execute(_ctx) {
        return this.success(native_1.native.unsafeListAllocations());
    },
});
//# sourceMappingURL=unsafeListAllocations.js.map