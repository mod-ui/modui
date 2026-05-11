import { existsSync } from "node:fs";
import kleur from "kleur";
import prompts from "prompts";
import { fetchTheme } from "../registry/fetch.js";
import {
	DEFAULT_CONFIG,
	configPath,
	loadConfig,
	writeConfig,
	type Config,
} from "../utils/config.js";
import { writeItemFiles } from "../utils/write-files.js";

type InitOptions = {
	cwd: string;
	yes: boolean;
	theme: string;
	registry?: string;
};

export async function runInit(options: InitOptions) {
	const existing = existsSync(configPath(options.cwd))
		? await loadConfig(options.cwd)
		: null;

	if (existing && !options.yes) {
		const { proceed } = await prompts({
			type: "confirm",
			name: "proceed",
			message: "components.json already exists. Overwrite?",
			initial: false,
		});
		if (!proceed) {
			console.log(kleur.yellow("Aborted."));
			return;
		}
	}

	let config: Config = existing ?? DEFAULT_CONFIG;
	if (!options.yes) {
		const answers = await prompts([
			{
				type: "text",
				name: "ui",
				message: "Where should UI components be placed?",
				initial: config.paths.ui,
			},
			{
				type: "text",
				name: "themes",
				message: "Where should theme files be placed?",
				initial: config.paths.themes,
			},
		]);
		if (answers.ui && answers.themes) {
			config = {
				...config,
				paths: { ui: answers.ui, themes: answers.themes },
			};
		}
	}

	if (options.registry) {
		config = { ...config, registry: options.registry };
	}

	await writeConfig(options.cwd, config);
	console.log(kleur.green(`✓ Created components.json`));

	console.log(kleur.cyan(`\nFetching theme "${options.theme}"...`));
	const theme = await fetchTheme(config.registry, options.theme);
	await writeItemFiles(options.cwd, config, [theme], {
		overwrite: options.yes,
		yes: options.yes,
	});

	console.log(kleur.green("\n✓ Done. Try `modui add button`."));
}
