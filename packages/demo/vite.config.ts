import { resolve } from 'path';

import { AliasOptions, ConfigEnv, defineConfig } from 'vite';

// eslint-disable-next-line
import getBaseViteConfig from '../../viteBaseConfig';

export default ({ mode }: ConfigEnv) => {
  const aliases: AliasOptions = {
    'vue-datetime': (mode === 'development') ?
      resolve(__dirname, '../lib/src/index') : 'vue-datetime3',
  };
  return defineConfig(getBaseViteConfig({
    server: {
      port: 8080,
      fs: {
        // Allowing serving files from one level up to the project root
        allow: ['../..'],
      },
    },
    resolve: { alias: aliases },
  }));
};
