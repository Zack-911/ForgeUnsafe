import { ForgeClient, ForgeExtension } from '@tryforge/forgescript';
export declare class ForgeUnsafe extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    readonly native: import("./structures").NativeAddon;
    init(_client: ForgeClient): void;
}
export * from './structures';
//# sourceMappingURL=index.d.ts.map