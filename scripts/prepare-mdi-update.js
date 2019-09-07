const semver = require('semver');
const fs = require('fs');
const path = require('path');

// TODO: get from arguments
const mdiVersion = '3.7.95';
const nextMdiVersion = '3.8.64';
const pkgVersion = '5.5.0';

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
