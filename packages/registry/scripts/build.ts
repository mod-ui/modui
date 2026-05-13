import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "..", "src");
const OUT = join(__dirname, "..", "dist", "registry");

type FileType = "component" | "style" | "theme";

type RegistryFile = {
	path: string;
	content: string;
	type: FileType;
};

type RegistryItem = {
	name: string;
	dependencies: string[];
	registryDependencies: string[];
	files: RegistryFile[];
};

const PEER_DEPS = new Set(["react", "react-dom"]);

const IMPORT_RE = /from\s+["']([^"']+)["']/g;

function classifyFile(filename: string): FileType {
	if (filename.endsWith(".module.css")) return "style";
	if (filename.endsWith(".css")) return "theme";
	return "component";
}

function extractDeps(source: string, currentComponent: string) {
	const npm = new Set<string>();
	const registry = new Set<string>();
	for (const match of source.matchAll(IMPORT_RE)) {
		const spec = match[1];
		if (spec.startsWith(".")) {
			const m = spec.match(/^\.\.\/([^/]+)\//);
			if (m && m[1] !== currentComponent) registry.add(m[1]);
			continue;
		}
		if (spec.startsWith("@/") || spec.startsWith("~/")) continue;
		const pkg = spec.startsWith("@")
			? spec.split("/").slice(0, 2).join("/")
			: spec.split("/")[0];
		if (!PEER_DEPS.has(pkg)) npm.add(pkg);
	}
	return {
		dependencies: [...npm].sort(),
		registryDependencies: [...registry].sort(),
	};
}

async function buildComponent(name: string): Promise<RegistryItem> {
	const dir = join(SRC, "ui", name);
	const filenames = await readdir(dir);
	const files: RegistryFile[] = [];
	const depsSet = new Set<string>();
	const regDepsSet = new Set<string>();

	for (const filename of filenames) {
		const filePath = join(dir, filename);
		const content = await readFile(filePath, "utf8");
		const type = classifyFile(filename);
		files.push({
			path: `ui/${name}/${filename}`,
			content,
			type,
		});
		if (type === "component") {
			const { dependencies, registryDependencies } = extractDeps(content, name);
			for (const d of dependencies) depsSet.add(d);
			for (const d of registryDependencies) regDepsSet.add(d);
		}
	}

	return {
		name,
		dependencies: [...depsSet].sort(),
		registryDependencies: [...regDepsSet].sort(),
		files,
	};
}

async function buildTheme(filename: string): Promise<RegistryItem> {
	const filePath = join(SRC, "themes", filename);
	const content = await readFile(filePath, "utf8");
	const name = basename(filename, ".css");
	return {
		name,
		dependencies: [],
		registryDependencies: [],
		files: [
			{
				path: `themes/${filename}`,
				content,
				type: "theme",
			},
		],
	};
}

async function main() {
	await rm(OUT, { recursive: true, force: true });
	await mkdir(join(OUT, "themes"), { recursive: true });

	const componentNames = (
		await readdir(join(SRC, "ui"), { withFileTypes: true })
	)
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

	const components: RegistryItem[] = [];
	for (const name of componentNames) {
		const item = await buildComponent(name);
		components.push(item);
		await writeFile(
			join(OUT, `${name}.json`),
			`${JSON.stringify(item, null, 2)}\n`,
		);
	}

	const themeFiles = (await readdir(join(SRC, "themes"))).filter((f) =>
		f.endsWith(".css"),
	);
	const themes: RegistryItem[] = [];
	for (const filename of themeFiles) {
		const theme = await buildTheme(filename);
		themes.push(theme);
		await writeFile(
			join(OUT, "themes", `${theme.name}.json`),
			`${JSON.stringify(theme, null, 2)}\n`,
		);
	}

	const index = {
		version: "0.0.1",
		components: components.map(({ files: _files, ...rest }) => rest),
		themes: themes.map((t) => t.name),
	};
	await writeFile(
		join(OUT, "index.json"),
		`${JSON.stringify(index, null, 2)}\n`,
	);

	console.log(
		`Built ${components.length} component(s) and ${themes.length} theme(s) → ${OUT}`,
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
