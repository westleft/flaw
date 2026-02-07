import Constants from 'expo-constants'

/**
 * 取得目前 app 版本
 * @returns 版本號字串，例如 "0.1.0"
 */
export function getAppVersion(): string {
  return Constants.expoConfig?.version || Constants.manifest?.version || '0.0.0'
}

/**
 * 取得完整的版本資訊（包含 build number，如果有）
 */
export function getAppVersionInfo() {
  return {
    version: Constants.expoConfig?.version || Constants.manifest?.version || '0.0.0',
    // iOS build number
    iosBuildNumber: Constants.expoConfig?.ios?.buildNumber,
    // Android version code
    androidVersionCode: Constants.expoConfig?.android?.versionCode,
  }
}
