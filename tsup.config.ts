import { defineConfig } from 'tsup'

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./package/index.ts'],
    dts: true,
    clean: true,
    shims: true,
    skipNodeModulesBundle: true
})