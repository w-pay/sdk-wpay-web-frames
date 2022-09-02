"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

/*
 * Searches NPM for the @wpay/sdk module at a given version
 *
 * Exit codes
 *  - 0 - Module not found at version
 *  - 1 - Module found at version
 *  - 2 - No version supplied
 */

if (process.argv.length < 4) {
	console.error(`Usage: ${path.relative(process.cwd(), process.argv[1])} <package> <version>`);
	process.exit(2);
}

const pkg = process.argv[2];
const version = process.argv[3];
const packageData = fetchPackageData(pkg);


console.log(`Searching for ${pkg}@${version}`);
const found = (!packageData.error || packageData.error.code !== "E404")
	&& packageData.versions.find((v) => v === version);

process.exit(checkResult(found, pkg, version));

function fetchPackageData(pkg) {
	const data = spawnSync("npm", [ "view", pkg, "--json", "-s" ], { encoding: "utf8" }).stdout;

	return data && data.length && JSON.parse(data) || { error: { code: "E404" } };
}

function checkResult(result, pkg, version) {
	if (result) {
		console.log(`Found ${pkg}@${version}`);

		return 1;
	}
	else {
		console.log(`Didn't find ${pkg}@${version}`);

		return  0;
	}
}
