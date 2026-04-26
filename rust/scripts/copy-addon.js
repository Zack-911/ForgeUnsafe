#!/usr/bin/env node
/**
 * copy-addon.js
 *
 * Copies the compiled Rust cdylib from target/release to the project root
 * as a .node file using the napi-rs platform-triple naming convention.
 *
 * e.g.  libforgeunsafe.so  →  forgeunsafe.linux-x64-gnu.node
 *        forgeunsafe.dll    →  forgeunsafe.win32-x64-msvc.node
 *        libforgeunsafe.dylib → forgeunsafe.darwin-x64.node
 */

const fs   = require('fs')
const path = require('path')

// ─── Resolve paths ────────────────────────────────────────────────────────────

// This script lives at rust/scripts/copy-addon.js, so the rust dir is one up
// and the project root is two up.
const rustDir    = path.resolve(__dirname, '..')
const projectDir = path.resolve(rustDir, '..')
const releaseDir = path.join(rustDir, 'target', 'release')

// ─── Detect source artifact ───────────────────────────────────────────────────

const sourceMap = {
    linux:  path.join(releaseDir, 'libforgeunsafe.so'),
    darwin: path.join(releaseDir, 'libforgeunsafe.dylib'),
    win32:  path.join(releaseDir, 'forgeunsafe.dll'),
}

const srcFile = sourceMap[process.platform]

if (!srcFile) {
    console.error(`[copy-addon] Unsupported platform: ${process.platform}`)
    process.exit(1)
}

if (!fs.existsSync(srcFile)) {
    console.error(`[copy-addon] Compiled addon not found: ${srcFile}`)
    console.error('[copy-addon] Run `cargo build --release` first.')
    process.exit(1)
}

// ─── Determine napi-rs triple ─────────────────────────────────────────────────

function getTriple() {
    const platform = process.platform   // linux | darwin | win32
    const arch     = process.arch       // x64 | arm64 | ia32 | arm

    const platformMap = { linux: 'linux', darwin: 'darwin', win32: 'win32' }
    const archMap     = { x64: 'x64', arm64: 'arm64', ia32: 'ia32', arm: 'arm' }

    const p = platformMap[platform] ?? platform
    const a = archMap[arch]         ?? arch

    // napi-rs appends an ABI suffix on Linux
    if (platform === 'linux') {
        return `${p}-${a}-gnu`
    }

    return `${p}-${a}`
}

const triple   = getTriple()
const destName = `forgeunsafe.${triple}.node`
const destFile = path.join(projectDir, destName)

// ─── Copy ─────────────────────────────────────────────────────────────────────

fs.copyFileSync(srcFile, destFile)

console.log(`[copy-addon] ${path.relative(projectDir, srcFile)} → ${destName}`)
