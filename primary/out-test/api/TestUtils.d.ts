import * as playwright from 'playwright';
import { ITerminalInitOnlyOptions, ITerminalOptions } from 'xterm';
export declare function pollFor<T>(page: playwright.Page, evalOrFn: string | (() => Promise<T>), val: T, preFn?: () => Promise<void>, maxDuration?: number): Promise<void>;
export declare function writeSync(page: playwright.Page, data: string): Promise<void>;
export declare function timeout(ms: number): Promise<void>;
export declare function openTerminal(page: playwright.Page, options?: ITerminalOptions & ITerminalInitOnlyOptions): Promise<void>;
export declare function getBrowserType(): playwright.BrowserType<playwright.WebKitBrowser> | playwright.BrowserType<playwright.ChromiumBrowser> | playwright.BrowserType<playwright.FirefoxBrowser>;
export declare function launchBrowser(): Promise<playwright.Browser>;
