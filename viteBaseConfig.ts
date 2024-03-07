import { fileURLToPath, URL } from 'node:url';
import { UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default function getBaseViteConfig(
  override?: UserConfigExport
): UserConfigExport {
  return {
    plugins: [
      vue(),
      dts(),
    ],
    resolve: {
      alias: {
        // @ts-ignore
        '~': fileURLToPath(new URL('./node_modules', import.meta.url))
      },
      extensions: [
        '.js',
        '.ts',
        '.vue',
        '.json',
        '.css'
      ]
    },
    ...override
  }
}
