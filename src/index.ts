import { ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript'
import path from 'path'
import { native } from './structures/native'

export class ForgeUnsafe extends ForgeExtension {
    name = 'ForgeUnsafe'
    description = 'Real native memory management for ForgeScript — malloc, free, pointer arithmetic, typed reads/writes via napi-rs.'
    version = require('../package.json').version as string

    public readonly native = native

    init(_client: ForgeClient): void {
        this.load(path.join(__dirname, './functions'))
    }
}

export * from './structures'
