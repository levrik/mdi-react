#!/bin/bash
set -e
set -o pipefail

if [ "$1" == "--with-build-and-publish" ] && [ -z "$2" ]; then
  echo "--with-build-and-publish requires package type."
  exit 1
fi

mdi_prev="$(git show $GITHUB_SHA~1:package.json | jq -r '.dependencies["@mdi/svg"]')"
mdi_next="$(git show $GITHUB_SHA:package.json | jq -r '.dependencies["@mdi/svg"]')"

if [ "$mdi_prev" == "$mdi_next" ]; then
  echo "no mdi update found. skipping."
  exit 0
fi

react_version="$(jq -r '.version' publish-react/package.json)"
preact_version="$(jq -r '.version' publish-preact/package.json)"

if [ "$react_version" != "$preact_version" ]; then
  echo "versions of react and preact package don't match."
  exit 1
fi

echo "Install dependencies..."
yarn install --frozen-lockfile

echo "Update README.md, CHANGELOG.md, publish-react/package.json and publish-preact/package.json..."
node scripts/create-mdi-release.js $mdi_prev $mdi_next $react_version
echo "Sync changes to README-preact.md..."
node scripts/generate-preact-readme.js

if [ "$1" == "--with-commit" ]; then
  echo "Set up Git..."
  # Set up Git
  cat > $HOME/.netrc <<- EOF
		machine github.com
		login levrik
		password $GITHUB_TOKEN
		machine api.github.com
		login levrik
		password $GITHUB_TOKEN
EOF
  chmod 600 $HOME/.netrc

  git config --global user.email "me@levrik.io"
  git config --global user.name "Levin Rickert"

  echo "Create and push release commit..."

  push_branch=$(echo $GITHUB_REF | awk -F / '{ print $3 }')
  git checkout $push_branch
  git add .
  git commit -m "Release $(jq -r '.version' publish-react/package.json)"
  git push -u origin $push_branch
elif [ "$1" == "--with-build-and-publish" ]; then
  cd publish-$2
  npm publish
  cd ..
fi
