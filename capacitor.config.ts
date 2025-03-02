
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7615a201c84d40f5a9dbaa7d867fd968',
  appName: 'character-mind-mapper',
  webDir: 'dist',
  server: {
    url: 'https://7615a201-c84d-40f5-a9db-aa7d867fd968.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: null,
    }
  }
};

export default config;
