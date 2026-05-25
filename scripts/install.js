#!/usr/bin/env node

/**
 * install.js
 * 
 * Automatically downloads the pre-compiled native binary from GitHub Releases
 * based on the current platform and architecture.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// ─── Configuration ────────────────────────────────────────────────────────────

const REPO = 'Zack-911/ForgeUnsafe';
const BINARY_NAME = 'forgeunsafe';
const PACKAGE_JSON = require('../package.json');
const VERSION = PACKAGE_JSON.version;

// ─── Triple Detection ─────────────────────────────────────────────────────────

function getTriple() {
    const platform = process.platform;
    const arch = process.arch;

    if (platform === 'linux') {
        try {
            // Detect musl vs glibc
            const out = execSync('ldd --version 2>&1', { stdio: 'pipe' }).toString();
            if (out.includes('musl')) {
                return `linux-${arch}-musl`;
            }
        } catch (e) {
            // Fallback to gnu if ldd fails or is missing
        }
        return `linux-${arch}-gnu`;
    }

    if (platform === 'win32') {
        return `win32-${arch}-msvc`;
    }

    if (platform === 'darwin') {
        return `darwin-${arch}`;
    }

    return `${platform}-${arch}`;
}

const triple = getTriple();
const destName = `${BINARY_NAME}.${triple}.node`;
const projectRoot = path.resolve(__dirname, '..');
const destPath = path.join(projectRoot, destName);

// ─── Skip logic ───────────────────────────────────────────────────────────────

// Check if the specific triple binary already exists
if (fs.existsSync(destPath)) {
    console.log(`[install] Binary already exists: ${destName}`);
    process.exit(0);
}

// Check if a generic binary already exists (from manual build)
if (fs.existsSync(path.join(projectRoot, `${BINARY_NAME}.node`))) {
    console.log(`[install] Generic binary found, skipping download.`);
    process.exit(0);
}

// ─── Download logic ───────────────────────────────────────────────────────────

const url = `https://github.com/${REPO}/releases/download/v${VERSION}/${destName}`;

console.log(`[install] Downloading native addon for ${triple}...`);
console.log(`[install] Source: ${url}`);

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (res) => {
            // Handle redirects (GitHub uses S3/Azure for release assets)
            if (res.statusCode === 302 || res.statusCode === 301) {
                download(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(dest);
            res.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });
        });

        request.on('error', (err) => {
            fs.unlink(dest, () => { }); // Clean up partial file
            reject(err);
        });
    });
}

download(url, destPath)
    .then(() => {
        console.log(`[install] Successfully downloaded ${destName}`);
        process.exit(0);
    })
    .catch((err) => {
        console.error(`[install] Could not download binary: ${err.message}`);
        console.error(`[install] If you are a developer, run \`npm run build:rust\` to compile locally.`);
        process.exit(0);
    });