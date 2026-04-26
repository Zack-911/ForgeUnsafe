import { ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript'
import path from 'path'
import { native } from './structures/native'

export class ForgeUnsafe extends ForgeExtension {
    name        = 'ForgeUnsafe'
    description = 'Real native memory management for ForgeScript — malloc, free, pointer arithmetic, typed reads/writes via napi-rs.'
    version     = require('../package.json').version as string

    /**
     * Direct access to the native addon.
     * Use this from your own TypeScript code when you need to call
     * native memory functions without going through ForgeScript $functions.
     */
    public readonly native = native

    init(client: ForgeClient): void {
        this.load(path.join(__dirname, './functions'))
        Logger.info(`[ForgeUnsafe] v${this.version} loaded — native memory management ready.`)
    }
}

export * from './structures'
