import { CONFIG_LATEST_PRESET } from '../../helpers/cli/constants.helper.js';

export default {
  start: {
    type: 'number',
    alias: 's',
    default: 1,
  },
  end: {
    type: 'number',
    alias: 'e',
    default: 1000,
  },
  openInBrowser: {
    type: 'boolean',
    default: false,
  },
  saveTo: {
    type: 'string',
    default: process.cwd(),
  },
  saveAs: {
    type: 'string',
  },
  interactive: {
    type: 'boolean',
    alias: 'i',
    default: false,
  },
  preset: {
    type: 'string',
    alias: 'p',
    default: CONFIG_LATEST_PRESET,
  },
  copy: {
    type: 'boolean',
    alias: 'c',
    default: false,
  },
  config: {
    type: 'string',
  },
  fromClipboard: {
    type: 'boolean',
    default: false,
  },
  headless: {
    type: 'boolean',
    alias: 'h',
    default: true,
  },
} as const;
