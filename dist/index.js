"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeUnsafe = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const path_1 = __importDefault(require("path"));
const native_1 = require("./structures/native");
class ForgeUnsafe extends forgescript_1.ForgeExtension {
    constructor() {
        super(...arguments);
        this.name = 'ForgeUnsafe';
        this.description = 'Real native memory management for ForgeScript — malloc, free, pointer arithmetic, typed reads/writes via napi-rs.';
        this.version = require('../package.json').version;
        this.native = native_1.native;
    }
    init(_client) {
        this.load(path_1.default.join(__dirname, './functions'));
    }
}
exports.ForgeUnsafe = ForgeUnsafe;
__exportStar(require("./structures"), exports);
//# sourceMappingURL=index.js.map