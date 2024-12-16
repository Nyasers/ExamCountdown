import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

export const packagerConfig = {
  asar: true,
  name: 'ExamCountdown',
  executableName: 'ExamCountdown',
  icon: './assets/icon.ico',
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
      setupIcon: './assets/icon.ico',
      iconUrl: 'https://ec.nyase.ru/favicon.ico',
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