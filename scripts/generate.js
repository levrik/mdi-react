const fs = require('fs');
const { sync: mkdirp } = require('mkdirp');
const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const meta = require('@mdi/svg/meta.json');

const svgPathRegex = /\sd="(.*)"/;
const startsWithNumberRegex = /^\d/;

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

function normalizeName(name) {
  return name.split(/[ -]/g).map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('') + 'Icon';
}

function collectComponents(svgFilesPath) {
  const svgFiles = fs.readdirSync(svgFilesPath);

  const icons = [];
  for (const svgFile of svgFiles) {
    const origName = svgFile.slice(0, -4);
    const name = normalizeName(origName);

    const content = fs.readFileSync(path.join(svgFilesPath, svgFile));
    const svgPathMatches = svgPathRegex.exec(content);
    const svgPath = svgPathMatches && svgPathMatches[1];
    // skip on empty svgPath
    if (!svgPath) throw new Error('Empty SVG path');

    const icon = {
      name: name,
      aliases: [],
      fileName: name + '.js',
      defFileName: name + '.d.ts',
      svgPath
    };

    const iconMeta = meta.find(entry => entry.name === origName);
    if (iconMeta) {
      icon.aliases = iconMeta.aliases;
    }

    icons.push(icon);
  }

  const aliases = [];
  const removeAliases = [];
  for (const icon of icons) {
    for (const alias of icon.aliases) {
      const normalizedAlias = normalizeName(alias);

      // if the alias starts with a number, ignore it since JavaScript
      // doesn't support variable names starting with a number
      if (startsWithNumberRegex.test(normalizedAlias)) {
        continue;
      }

      // check if alias duplicates top-level icon name and ignore
      if (icons.find(icon => icon.name.toLowerCase() === normalizedAlias.toLowerCase())) {
        continue;
      }

      // check if alias itself is duplicated
      const duplicateAlias = aliases.find(alias2 => alias2.name.toLowerCase() === normalizedAlias.toLowerCase());
      if (duplicateAlias) {
        // check if duplicate alias is on same icon
        // if not note for removal from final list
        if (duplicateAlias.aliasFor !== icon.name) {
          console.warn(`Duplicate alias ${normalizedAlias} (${icon.name}, ${duplicateAlias.aliasFor})`);
          removeAliases.push(duplicateAlias.name);
          continue;
        }

        continue;
      }

      aliases.push({
        name: normalizedAlias,
        aliasFor: icon.name,
        fileName: normalizedAlias + '.js',
        defFileName: normalizedAlias + '.d.ts',
        svgPath: icon.svgPath
      });
    }

    // removed no longer required aliases array
    delete icon.aliases;
  }

  // clean up remaining alias duplicates
  for (const aliasName of removeAliases) {
    const index = aliases.find(alias => aliasName === alias);
    aliases.splice(index, 1);
  }

  return [...icons, ...aliases];
}

async function generate(target, jsCb, tsCb, tsAllCb) {
  const basePath = path.resolve(__dirname, '..');
  const svgFilesPath = path.resolve(basePath, 'node_modules/@mdi/svg/svg');
  const buildPath = path.resolve(basePath, 'build');
  mkdirp(buildPath);
  const publishPath = path.resolve(basePath, 'publish-' + target);
  mkdirp(publishPath);
  const distPath = path.resolve(publishPath, 'dist');
  mkdirp(distPath);
  const indexFilePath = path.resolve(basePath, 'publish-' + target, 'index.js');

  const indexFileStream = fs.createWriteStream(indexFilePath, {flags:'a'});

  console.log('Collecting components...');
  const components = collectComponents(svgFilesPath);
  console.log('Generating components...');
  const pathsToUnlink = [];
  for (const component of components) {
    if (!component.aliasFor) {
      console.log('Generating ' + component.name + '...');
    } else {
      console.log('Generating alias ' + component.name + '...');
    }

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

    // remember paths to unlink later
    if (!pathsToUnlink.includes(inputPath)) {
      pathsToUnlink.push(inputPath);
    }

    const definitionContent = tsCb(component);
    fs.writeFileSync(path.join(publishPath, component.defFileName), definitionContent);
    indexFileStream.write(
      `export {default as ${component.name}} from './${component.name}';\n`
    )
  }

  console.log('Generating typings...');
  // create the global typings.d.ts
  const typingsContent = tsAllCb();
  fs.writeFileSync(path.resolve(distPath, 'typings.d.ts'), typingsContent);

  // clean up
  for (const pathToUnlink of pathsToUnlink) {
    fs.unlinkSync(pathToUnlink);
  }
}

module.exports = generate;
