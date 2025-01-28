import esbuild from 'esbuild'

import { dependencies } from './package.json'

const external = [...Object.keys(dependencies), 'node:http']

void esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'neutral',
  minify: false, // TODO: set it back to true
  sourcemap: true,
  outfile: './dist/index.js',
  format: 'cjs',
  external,
})
