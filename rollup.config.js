import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/e7ipc-electron7.ts',
  output: {
    file: './lib/e7ipc-electron7.js',
    format: 'cjs',
    sourcemap: true,
    sourcemapExcludeSources: true,
  },
  external: [],

  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          sourceMap: true,
          declaration: false,
        },
      },
    }),
  ],
}
