#! /bin/sh

name=$([ -z "$npm_package_name" ] && { npm -s run env echo '$npm_package_name'; } || { echo $npm_package_name; })
version=$(cat package.json | jq -r '.version')

node $PWD/scripts/check-version-published.js $name $version

if [ $? -eq 0 ] ; then
  npm publish --access=public
else
  echo "No changes to publish"
fi
