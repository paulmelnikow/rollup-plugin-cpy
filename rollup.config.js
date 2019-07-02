import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import { main, module, dependencies } from './package.json'

const external = ['util', ...Object.keys(dependencies)]

export default {
  input: 'src/index.js',
  output: [{ file: main, format: 'cjs' }, { file: module, format: 'es' }],
  plugins: [json(), buble({ transforms: { asyncAwait: false, forOf: false } })],
  external: external,
}
