import { RecursivePartial } from "./types";
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, properties?: RecursivePartial<HTMLElementTagNameMap[K]>): HTMLElementTagNameMap[K];
export declare function navigateTo(page: string): Promise<void>;
export declare function createObfuscatedWindow(url: string): void;
export declare const parser: DOMParser;
export declare const password = "SDIYBT";
