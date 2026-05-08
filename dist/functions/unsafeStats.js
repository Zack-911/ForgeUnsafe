"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const native_1 = require("../structures/native");
exports.default = new forgescript_1.NativeFunction({
    name: '$unsafeStats',
    aliases: ['$heapStats'],
    description: 'Return a JSON object with live allocation count and total bytes currently allocated.',
    version: '1.0.0',
    unwrap: false,
    output: forgescript_1.ArgType.Json,
    execute(_ctx) {
        return this.success(native_1.native.unsafeStats());
    },
});
//# sourceMappingURL=unsafeStats.js.map