const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const prettier = require("prettier");

const rootRelPath = path.relative(`${__dirname}/..`, process.cwd());
console.log(`Linking ${rootRelPath}`);

const saveTsConfig = (tsConfigPath, tsConfig) => {
	tsConfig.references.sort((a, b) => a.path.localeCompare(b.path));
	const tsConfigPrettyJson = prettier.format(JSON.stringify(tsConfig), { parser: "json" });
	fs.writeFileSync(tsConfigPath, tsConfigPrettyJson);
};

const pkgPackage = JSON.parse(fs.readFileSync("package.json"));
const pkgTsConfig = JSON.parse(fs.readFileSync("tsconfig.json"));
pkgTsConfig.references = [];

for (const [dep, depVersion] of Object.entries(pkgPackage.dependencies || {})) {
	if (depVersion === "workspace:") {
		const subprocess = cp.spawnSync(process.argv0, ["--print", `require.resolve("${dep}/tsconfig.json")`]);

		if (subprocess.status === 0) {
			const depTsConfigPath = subprocess.stdout.toString().trim();
			const referencePath = path.relative(process.cwd(), path.dirname(depTsConfigPath));
			pkgTsConfig.references.push({ path: referencePath });
		}
	}
}

saveTsConfig("tsconfig.json", pkgTsConfig);
