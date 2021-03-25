const fs = require("fs");
const prettier = require("prettier");

const name = process.argv[2];

const pkg = {
	name,
	version: "1.0.0",
	main: "dist/index.js",
	types: "dist/index.d.ts",
	files: ["dist", "package.json"],
	scripts: {
		build: "tsc --build",
		clean: "rm -rf dist",
		"ts-link": "node ../../scripts/ts-link.js",
	},
	dependencies: {
		"@types/node": "^14.0.14",
	},
	devDependencies: {
		typescript: "^4.0.5",
	},
};

const tsconfig = {
	references: [],
	extends: "../../tsconfig.package.json",
	include: ["src/**/**.ts"],
	compilerOptions: {
		rootDir: "src",
		outDir: "dist",
		tsBuildInfoFile: "dist/tsbuildinfo",
	},
};

const dir = `${__dirname}/../${pkg.name}`;

fs.mkdirSync(dir);
fs.writeFileSync(`${dir}/package.json`, prettier.format(JSON.stringify(pkg), { parser: "json" }));
fs.writeFileSync(`${dir}/tsconfig.json`, prettier.format(JSON.stringify(tsconfig), { parser: "json" }));

fs.mkdirSync(`${dir}/src`);
fs.writeFileSync(`${dir}/src/index.ts`, "");

console.log(`Created ${pkg.name}`);

const modulePkg = {
	name: `${pkg.name}-module`,
	version: "1.0.0",
	main: "dist/index.js",
	types: "dist/index.d.ts",
	files: ["dist", "package.json"],
	scripts: {
		build: "tsc --build",
		clean: "rm -rf dist",
		"ts-link": "node ../../scripts/ts-link.js",
	},
	dependencies: {
		[pkg.name]: "workspace:",
		"@types/node": "^14.0.14",
		inversify: "^5.0.1",
	},
	devDependencies: {
		typescript: "^4.0.5",
	},
};

const moduleTsconfig = {
	references: [{ path: `../${name}` }],
	extends: "../../tsconfig.package.json",
	include: ["src/**/**.ts"],
	compilerOptions: {
		rootDir: "src",
		outDir: "dist",
		tsBuildInfoFile: "dist/tsbuildinfo",
	},
};

const moduleIndexTs = `
	import { interfaces } from "inversify";

	export const serviceProvider: interfaces.ContainerModuleCallBack = (bind) => {
		//
	};

	export default serviceProvider;
`;

const moduleDir = `${__dirname}/../${modulePkg.name}`;

fs.mkdirSync(moduleDir);
fs.writeFileSync(`${moduleDir}/package.json`, prettier.format(JSON.stringify(modulePkg), { parser: "json" }));
fs.writeFileSync(`${moduleDir}/tsconfig.json`, prettier.format(JSON.stringify(moduleTsconfig), { parser: "json" }));

fs.mkdirSync(`${moduleDir}/src`);
fs.writeFileSync(`${moduleDir}/src/index.ts`, prettier.format(moduleIndexTs, { parser: "typescript" }));

console.log(`Created ${modulePkg.name}`);
