import * as Exp from '../Exp';

jest.mock('fs');

const fs = require('fs');
const mockfs = require('mock-fs');

describe('determineEntryPoint', () => {
  beforeEach(() => {
    const packageJson = JSON.stringify(
      {
        name: 'testing123',
        version: '0.1.0',
        main: 'index.js',
      },
      null,
      2
    );

    const packageJsonAndroid = JSON.stringify(
      {
        name: 'testing123android',
        version: '0.1.0',
        main: 'index.android.js',
      },
      null,
      2
    );

    const packageJsonIos = JSON.stringify(
      {
        name: 'testing123ios',
        version: '0.1.0',
        main: 'index.ios.js',
      },
      null,
      2
    );

    const packageJsonNoMain = JSON.stringify({
      name: 'testing456',
      version: '0.2.0',
    });

    const appJson = JSON.stringify(
      {
        name: 'testing 123',
        version: '0.1.0',
        slug: 'testing-123',
      },
      null,
      2
    );

    const appJsonWithEntry = JSON.stringify({
      name: 'testing567',
      version: '0.6.0',
      entryPoint: 'main.js',
    });

    fs.__configureFs({
      '/exists-no-platform/package.json': packageJson,
      '/exists-no-platform/app.json': appJson,
      '/exists-no-platform/index.js': 'console.log("lol")',

      '/exists-no-platform-no-main/package.json': packageJsonNoMain,
      '/exists-no-platform-no-main/app.json': appJson,
      '/exists-no-platform-no-main/index.js': 'console.log("lol")',

      '/exists-android/package.json': packageJsonAndroid,
      '/exists-android/app.json': appJson,
      '/exists-android/index.android.js': 'console.log("lol")',

      '/exists-ios/package.json': packageJsonIos,
      '/exists-ios/app.json': appJson,
      '/exists-ios/index.ios.js': 'console.log("lol")',

      '/exists-expjson/package.json': packageJson,
      '/exists-expjson/app.json': appJsonWithEntry,
      '/exists-expjson/main.js': 'console.log("lol")',

      '/expo-app-entry/package.json': packageJsonNoMain,
      '/expo-app-entry/app.json': appJson,
      '/expo-app-entry/App.js': 'console.log("lol")',
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  it('exists-no-platform', () => {
    const entryPoint = Exp.determineEntryPoint('/exists-no-platform');
    expect(entryPoint).toBe('index.js');
  });

  it('exists-no-platform-no-main', () => {
    const entryPoint = Exp.determineEntryPoint('/exists-no-platform-no-main');
    expect(entryPoint).toBe('index.js');
  });

  it('exists-android', () => {
    const entryPoint = Exp.determineEntryPoint('/exists-android');
    expect(entryPoint).toBe('index.android.js');
  });

  it('exists-ios', () => {
    const entryPoint = Exp.determineEntryPoint('/exists-ios');
    expect(entryPoint).toBe('index.ios.js');
  });

  it('exists-expjson', () => {
    const entryPoint = Exp.determineEntryPoint('/exists-expjson');
    expect(entryPoint).toBe('main.js');
  });

  it('uses node_modules/expo/AppEntry as a last resort', () => {
    const entryPoint = Exp.determineEntryPoint('/expo-app-entry');
    expect(entryPoint).toBe('node_modules/expo/AppEntry.js');
  });
});
