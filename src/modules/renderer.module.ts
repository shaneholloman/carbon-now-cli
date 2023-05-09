import { chromium, Browser, Page } from '@playwright/test';
import {
  CARBON_CUSTOM_THEME,
  CARBON_LOCAL_STORAGE_KEY,
} from '../../src/helpers/carbon/constants.helper.js';

export default class Renderer {
  private type!: CarbonCLIDownloadType;
  private browser!: Browser;
  private page!: Page;
  private readonly pageOptions = {
    viewport: {
      width: 1800,
      height: 1000,
    },
    deviceScaleFactor: 2,
  };

  static async create(
    type: CarbonCLIDownloadType = 'png',
    disableHeadless: boolean = false
  ): Promise<Renderer> {
    if (!['png', 'svg'].includes(type)) {
      throw new Error('Invalid type. Only png and svg are supported.');
    }
    const RendererInstance = new this();
    RendererInstance.type = type;
    await RendererInstance.init(disableHeadless);
    return RendererInstance;
  }

  private async init(hasHeadlessDisabled: boolean): Promise<void> {
    this.browser = await chromium.launch({
      headless: !hasHeadlessDisabled,
    });
    this.page = await this.browser.newPage(this.pageOptions);
  }

  private async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await (await this.page.waitForSelector('#export-menu'))?.click();
    await (await this.page.$(`#export-${this.type}`))?.click();
  }

  public async setCustomTheme(
    highlights: CarbonThemeHighlightsInterface,
    theme: CarbonCustomThemeNameType = CARBON_CUSTOM_THEME
  ): Promise<void> {
    await this.page.addInitScript(
      ({ highlights, theme, CARBON_LOCAL_STORAGE_KEY }) => {
        const themes: CarbonLocalStorageThemeInterface[] = [
          {
            id: theme,
            name: theme,
            highlights,
            custom: true,
          },
        ];
        window.localStorage.setItem(
          CARBON_LOCAL_STORAGE_KEY,
          JSON.stringify(themes)
        );
      },
      // Passing this in as the 2nd parameter is crucial, see:
      // https://github.com/microsoft/playwright/issues/6258#issuecomment-1030704374
      { highlights, theme, CARBON_LOCAL_STORAGE_KEY }
    );
  }

  public async download(
    url: string,
    saveDirectory: string = process.cwd()
  ): Promise<void> {
    try {
      const queuedDownloadEvent = this.page.waitForEvent('download');
      await this.navigate(url);
      await (
        await queuedDownloadEvent
      )?.saveAs(`${saveDirectory}/carbon.${this.type}`);
    } catch (e) {
      throw new Error((e as Error).message);
    } finally {
      await this.browser.close();
    }
  }
}
