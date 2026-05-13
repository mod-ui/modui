import kleur from "kleur";
import prompts from "prompts";
import { fetchIndex } from "../registry/fetch.js";
import { resolveItems } from "../registry/resolve.js";
import { loadConfig } from "../utils/config.js";
import { installDependencies } from "../utils/install-deps.js";
import { writeItemFiles } from "../utils/write-files.js";

type AddOptions = {
	cwd: string;
	overwrite: boolean;
	yes: boolean;
	skipInstall: boolean;
	registry?: string;
};

export async function runAdd(names: string[], options: AddOptions) {
	const config = await loadConfig(options.cwd);
	if (!config) {
		console.error(
			kleur.red("components.json not found. Run `modui init` first."),
		);
		process.exit(1);
	}

	const registry = options.registry ?? config.registry;

	let selected = names;
	if (selected.length === 0) {
		const index = await fetchIndex(registry);
		const { picked } = await prompts({
			type: "multiselect",
			name: "picked",
			message: "Which components would you like to add?",
			choices: index.components.map((c) => ({ title: c.name, value: c.name })),
			hint: "Space to select. Enter to submit.",
			instructions: false,
		});
		if (!picked || picked.length === 0) {
			console.log(kleur.yellow("No components selected."));
			return;
		}
		selected = picked;
	}

	console.log(kleur.cyan(`\nResolving ${selected.join(", ")}...`));
	const items = await resolveItems(registry, selected);

	const npmDeps = new Set<string>();
	for (const item of items) {
		for (const dep of item.dependencies) npmDeps.add(dep);
	}

	const resolvedNames = items.map((i) => i.name);
	const extra = resolvedNames.filter((n) => !selected.includes(n));
	if (extra.length > 0) {
		console.log(
			kleur.gray(`  including dependencies: ${extra.join(", ")}`),
		);
	}

	console.log(kleur.cyan("\nWriting files..."));
	await writeItemFiles(options.cwd, config, items, {
		overwrite: options.overwrite,
		yes: options.yes,
	});

	if (!options.skipInstall && npmDeps.size > 0) {
		await installDependencies(options.cwd, [...npmDeps]);
	} else if (npmDeps.size > 0) {
		console.log(
			kleur.yellow(
				`\nSkipped install. Run manually: ${[...npmDeps].join(" ")}`,
			),
		);
	}

	console.log(kleur.green("\n✓ Done."));
}
