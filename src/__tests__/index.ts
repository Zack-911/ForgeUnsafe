import { ForgeClient } from '@tryforge/forgescript'
import { ForgeUnsafe } from '..'

const unsafe = new ForgeUnsafe()

const client = new ForgeClient({
    token: process.env.BOT_TOKEN,
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    prefixes: ['!'],
    events: ['messageCreate'],
    extensions: [unsafe],
})

// ── Allocate, write, read, free cycle ──────────────────────────────────────
client.commands.add({
    name: 'memtest',
    type: 'messageCreate',
    code: `
        $let[ptr;$unsafeMalloc[64]]
        $unsafeWriteString[$get[ptr];Hello from native memory!]
        Result: $unsafeReadString[$get[ptr];25]
        Alloc size: $unsafeAllocSize[$get[ptr]] bytes
        $unsafeFree[$get[ptr]]
        Freed. Valid after free: $unsafeIsValid[$get[ptr]]
    `,
})

// ── Typed integer reads/writes ─────────────────────────────────────────────
client.commands.add({
    name: 'typetest',
    type: 'messageCreate',
    code: `
        $let[p;$unsafeCalloc[16]]
        $unsafeWriteI32[$get[p];-2147483648]
        $unsafeWriteF64[$unsafePtrOffset[$get[p];8];3.14159265]
        i32: $unsafeReadI32[$get[p]]
        f64: $unsafeReadF64[$unsafePtrOffset[$get[p];8]]
        $unsafeFree[$get[p]]
    `,
})

// ── Heap diagnostics ───────────────────────────────────────────────────────
client.commands.add({
    name: 'heapstats',
    type: 'messageCreate',
    code: `
        **Heap stats:** $unsafeStats
        **Live allocations:** $unsafeListAllocations
    `,
})

// ── Hex dump ───────────────────────────────────────────────────────────────
client.commands.add({
    name: 'hexdump',
    type: 'messageCreate',
    code: `
        $let[p;$unsafeMalloc[32]]
        $unsafeWriteString[$get[p];ABCDEFGHIJKLMNOP0123456789!@#$%^]
        \`\`\`
        $unsafeHexDump[$get[p];32]
        \`\`\`
        $unsafeFree[$get[p]]
    `,
})

// ── sizeof reference ───────────────────────────────────────────────────────
client.commands.add({
    name: 'sizeof',
    type: 'messageCreate',
    code: `
        u8=$unsafeSizeof[u8] u16=$unsafeSizeof[u16] u32=$unsafeSizeof[u32]
        i64=$unsafeSizeof[i64] f32=$unsafeSizeof[f32] f64=$unsafeSizeof[f64]
        ptr=$unsafeSizeof[ptr]
    `,
})

// ── Direct native access from TS ───────────────────────────────────────────
const ptr = unsafe.native.unsafeMalloc(8)
unsafe.native.unsafeWriteF64(ptr, Math.PI)
console.log('[ForgeUnsafe] π from native memory:', unsafe.native.unsafeReadF64(ptr))
unsafe.native.unsafeFree(ptr)

client.login()
