import { NativeModules, Platform } from 'react-native';

export type Environment = 'development' | 'staging' | 'production';

// Centralized environment configurations
const ENV_CONFIGS = {
  development: {
    // Dynamic default. If detection fails, it falls back to this
    apiUrl: 'http://localhost:5000',
  },
  staging: {
    apiUrl: 'https://staging-api.reactapp.com', // Replace with your staging endpoint
  },
  production: {
    apiUrl: 'https://api.reactapp.com', // Replace with your production API URL
  },
};

// Automatically switch environments based on release mode
// Or force it manually to 'staging' or 'production' for QA testing
export const getActiveEnvironment = (): Environment => {
  if (__DEV__) {
    return 'development';
  }
  return 'production';
};

export const getApiUrl = (): string => {
  const env = getActiveEnvironment();
  
  if (env !== 'development') {
    return ENV_CONFIGS[env].apiUrl;
  }

  // Dynamic host detection for local Wi-Fi / USB debugging
  let host = 'localhost';

  if (__DEV__) {
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      // Matches "http://<ip-or-host>:<port>/" prefix
      const match = scriptURL.match(/^https?:\/\/([^:/]+)(:\d+)?/);
      if (match && match[1]) {
        host = match[1];
        console.log(`[EnvConfig] Detected Metro Bundler host: ${host}`);
      }
    }
  }

  // If host is loopback (localhost/127.0.0.1) and we are on Android emulator,
  // we could use 10.0.2.2. However, since adb reverse tcp:5000 is run,
  // localhost works perfectly for both emulators and physical devices connected via USB.
  // When running on Wi-Fi, host will resolve to the computer's LAN IP (e.g. 192.168.1.15).
  const resolvedUrl = `http://${host}:5000`;
  console.log(`[EnvConfig] Resolved API URL for ${Platform.OS} in dev: ${resolvedUrl}`);
  
  return resolvedUrl;
};

export default {
  environment: getActiveEnvironment(),
  apiUrl: getApiUrl(),
};
