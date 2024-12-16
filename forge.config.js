import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const packagerConfig = {
  asar: true,
  name: 'ExamCountdown',
  executableName: 'ExamCountdown',
  icon: path.resolve(__dirname, 'assets/icon'),
  ignore: [
    ".github/workflows",
    ".gitignore",
    ".gitpod.yml",
    "forge.config.js",
    "website",
  ],
};
export const rebuildConfig = {};
export const makers = [
  {
    name: '@electron-forge/maker-squirrel',
    config: {
      name: 'ExamCountdown',
      authors: 'Nyasers',
      iconUrl: 'https://ec.nyase.ru/favicon.ico',
      setupIcon: path.resolve(__dirname, 'assets/icon.ico'),
    },
  },
];
export const plugins = [
  {
    name: '@electron-forge/plugin-auto-unpack-natives',
    config: {},
  },
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  new FusesPlugin({
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  }),
];
export const publishers = [
  {
    name: '@electron-forge/publisher-github',
    config: {
      repository: {
        owner: 'Nyasers',
        name: 'ExamCountdown',
      },
      prerelease: false,
      draft: true
    },
  },
];