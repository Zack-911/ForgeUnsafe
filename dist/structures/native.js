"use strict";
/**
 * native.ts
 *
 * Loads the compiled napi-rs addon (.node file) and re-exports its functions
 * with TypeScript types. The addon is found by checking:
 *   1. FORGEUNSAFE_ADDON environment variable (for custom paths)
 *   2. __dirname/forgeunsafe.<platform>-<arch>.node (standard napi-rs output)
 *   3. __dirname/forgeunsafe.node (fallback)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.native = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// ─── Addon loading ────────────────────────────────────────────────────────────
function loadAddon() {
    // 1. Env override
    if (process.env.FORGEUNSAFE_ADDON) {
        return require(process.env.FORGEUNSAFE_ADDON);
    }
    // 2. Build napi-rs platform triple
    //    Linux uses an ABI suffix (-gnu / -musl); darwin and win32 do not.
    const platform = process.platform; // linux | darwin | win32
    const arch = process.arch; // x64 | arm64 | ia32 | arm
    function getTriple() {
        if (platform === 'linux') {
            // detect musl vs glibc
            try {
                const { execSync } = require('child_process');
                const out = execSync('ldd --version 2>&1').toString();
                return out.includes('musl') ? `linux-${arch}-musl` : `linux-${arch}-gnu`;
            }
            catch {
                return `linux-${arch}-gnu`;
            }
        }
        return `${platform}-${arch}`;
    }
    const triple = getTriple();
    // __dirname is <project>/dist/structures when running compiled output,
    // so go up two levels to reach the project root where copy-addon.js
    // places the .node file.
    const projectRoot = path_1.default.resolve(__dirname, '..', '..');
    const distRoot = path_1.default.resolve(__dirname, '..');
    const candidates = [
        // project root (primary — where copy-addon.js puts the file)
        path_1.default.join(projectRoot, `forgeunsafe.${triple}.node`),
        path_1.default.join(projectRoot, 'forgeunsafe.node'),
        // dist root (in case someone copies it there)
        path_1.default.join(distRoot, `forgeunsafe.${triple}.node`),
        path_1.default.join(distRoot, 'forgeunsafe.node'),
        // raw Rust build output (dev convenience)
        path_1.default.join(projectRoot, 'rust', 'target', 'release', 'libforgeunsafe.so'),
        path_1.default.join(projectRoot, 'rust', 'target', 'release', 'forgeunsafe.dll'),
        path_1.default.join(projectRoot, 'rust', 'target', 'release', 'libforgeunsafe.dylib'),
    ];
    for (const candidate of candidates) {
        if ((0, fs_1.existsSync)(candidate))
            return require(candidate);
    }
    throw new Error(`[ForgeUnsafe] Could not find native addon. ` +
        `Run \`npm run build:rust\` to compile it first, or set FORGEUNSAFE_ADDON to the .node file path.\n` +
        `Searched:\n${candidates.map(c => `  ${c}`).join('\n')}`);
}
// ─── Export singleton ─────────────────────────────────────────────────────────
exports.native = loadAddon();
//# sourceMappingURL=native.js.map