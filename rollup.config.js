import { readdirSync } from 'fs';
import { resolve } from 'path';

import babel from 'rollup-plugin-babel';

const listOfEnties = readdirSync(resolve(__dirname, './build'));

export default listOfEnties.map(entry => {
  let output;
  switch (entry) {
    case 'index.js':
      output = [
        {
          file: resolve(__dirname, './publish/lib/index.cjs.js'),
          format: 'cjs',
        },
        {
          file: resolve(__dirname, './publish/dist/index.es.js'),
          format: 'es',
        },
      ];
      break;

    default:
      output = {
        file: resolve(__dirname, './publish', entry),
        format: 'cjs',
      };
      break;
  }

  return {
    input: resolve(__dirname, './build', entry),
    external: ['react'],
    plugins: [babel()],
    output,
  }
})
