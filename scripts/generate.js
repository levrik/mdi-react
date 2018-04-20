const fs = require('fs');
const { sync: mkdirp } = require('mkdirp');
const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

const svgPathRegex = /\sd="(.*)"/;

function getRollupInputConfig(target) {
  return {
    external: [target],
    plugins: [
      babel({
        presets: [
          ['es2015', { modules: false }],
          target
        ],
        plugins: [
          'transform-object-rest-spread',
          'external-helpers'
        ]
      })
    ]
  };
}

function collectComponents(svgFilesPath) {
  const svgFiles = fs.readdirSync(svgFilesPath);
  return svgFiles.map(svgFile => {
    // build name
    const name = svgFile.split(/-/g).map(part => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join('').slice(0, -4);

    const content = fs.readFileSync(path.join(svgFilesPath, svgFile));
    const svgPathMatches = svgPathRegex.exec(content);
    const svgPath = svgPathMatches && svgPathMatches[1];
    // Skip on empty svgPath
    if (!svgPath) return null;

    // only concat once
    return component = {
      name: name + 'Icon',
      fileName: name + 'Icon.js',
      defFileName: name + 'Icon.d.ts',
      svgPath
    };
  }).filter(Boolean);
}

async function generate(target, jsCb, tsCb, tsAllCb) {
  const basePath = path.resolve(__dirname, '..');
  const svgFilesPath = path.resolve(basePath, 'mdi/svg');
  const buildPath = path.resolve(basePath, 'build');
  mkdirp(buildPath);
  const publishPath = path.resolve(basePath, 'publish-' + target);
  mkdirp(publishPath);
  const distPath = path.resolve(publishPath, 'dist');
  mkdirp(distPath);

  console.log('Collecting icons...');
  const components = collectComponents(svgFilesPath);
  console.log('Generating components...');
  const pathsToUnlink = [];
  for (const component of components) {
    console.log('Generating ' + component.name + '...');

    const fileContent = jsCb(component);
    const inputPath = path.resolve(buildPath, component.fileName);
    const outputPath = path.resolve(publishPath, component.fileName);

    fs.writeFileSync(inputPath, fileContent);

    const bundle = await rollup.rollup({
      input: inputPath,
      ...getRollupInputConfig(target)
    });

    await bundle.write({
      file: outputPath,
      format: 'cjs'
    });

    pathsToUnlink.push(inputPath);

    const definitionContent = tsCb(component);
    fs.writeFileSync(path.join(publishPath, component.defFileName), definitionContent);
  }

  console.log('Generating typings...');
  // create the global typings.d.ts
  const typingsContent = tsAllCb(components);
  fs.writeFileSync(path.resolve(distPath, 'typings.d.ts'), typingsContent);

  console.log('Generating index...');
  // create index.es.js and index.cjs.js
  const indexFileContent = components
    .map(component => `export { default as ${component.name} } from './${component.fileName}';`)
    .join('\n');

  const indexInputPath = path.resolve(buildPath, 'index.js');

  fs.writeFileSync(indexInputPath, indexFileContent);

  const bundle = await rollup.rollup({
    input: indexInputPath,
    ...getRollupInputConfig(target)
  });

  await Promise.all([
    bundle.write({
      file: path.resolve(distPath, 'index.cjs.js'),
      format: 'cjs'
    }),
    bundle.write({
      file: path.resolve(distPath, 'index.es.js'),
      format: 'es'
    })
  ]);

  // clean up
  fs.unlinkSync(indexInputPath);
  for (const pathToUnlink of pathsToUnlink) {
    fs.unlinkSync(pathToUnlink);
  }
}

module.exports = generate;
