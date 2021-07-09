const semver = require('semver');
const fs = require('fs');
const path = require('path');

const [, , mdiVersion, nextMdiVersion, pkgVersion] = process.argv;

if (!mdiVersion || !nextMdiVersion || !pkgVersion) {
  console.log('Missing arguments');
  process.exit(1);
}

if (![mdiVersion, nextMdiVersion, pkgVersion].every(semver.valid)) {
  console.log('Not all arguments are valid semver');
  process.exit(1);
}

const nextPkgVersion = semver.inc(
  pkgVersion,
  semver.diff(mdiVersion, nextMdiVersion)
);

const changelogContent = fs.readFileSync(
  path.resolve(__dirname, '..', 'CHANGELOG.md'),
  'utf8'
);

const CHANGELOG_LIST_MARKER = '<!-- Changelog list -->';
const newChangelogEntry = `${CHANGELOG_LIST_MARKER}

## ${nextPkgVersion} [![Material Design Icons version](https://img.shields.io/badge/mdi-v${nextMdiVersion}-blue.svg?style=flat-square)](https://materialdesignicons.com)

_No changes_`;

const nextChangelogContent = changelogContent.replace(
  CHANGELOG_LIST_MARKER,
  newChangelogEntry
);

fs.writeFileSync(
  path.resolve(__dirname, '..', 'CHANGELOG.md'),
  nextChangelogContent
);

const readmeContent = fs.readFileSync(
  path.resolve(__dirname, '..', 'README.md'),
  'utf8'
);

const nextReadmeContent = readmeContent
  .replace(`New v${pkgVersion} released`, `New v${nextPkgVersion} released`)
  .replace(
    `https://img.shields.io/badge/mdi-v${mdiVersion}-blue.svg?style=flat-square`,
    `https://img.shields.io/badge/mdi-v${nextMdiVersion}-blue.svg?style=flat-square`
  );

fs.writeFileSync(path.resolve(__dirname, '..', 'README.md'), nextReadmeContent);

function updatePackageJson(pkg) {
  const packageJsonContent = fs.readFileSync(
    path.resolve(__dirname, '..', `publish-${pkg}`, 'package.json'),
    'utf8'
  );

  const nextPackageJsonContent = packageJsonContent.replace(
    `"version": "${pkgVersion}"`,
    `"version": "${nextPkgVersion}"`
  );

  fs.writeFileSync(
    path.resolve(__dirname, '..', `publish-${pkg}`, 'package.json'),
    nextPackageJsonContent
  );
}

updatePackageJson('react');
updatePackageJson('preact');
updatePackageJson('react-native');
