import { Command } from "commander";
import kleur from "kleur";
import pkg from "../package.json" with { type: "json" };
import { runAdd } from "./commands/add.js";
import { runInit } from "./commands/init.js";

const program = new Command();

program
	.name("modui")
	.description("CSS Modules UI components for React. Copy, paste, customize.")
	.version(pkg.version);

program
	.command("init")
	.description("Initialize modui in your project")
	.option("-y, --yes", "Skip prompts and use defaults", false)
	.option("--theme <name>", "Theme to install", "default")
	.option("--registry <url>", "Override registry URL")
	.option("--cwd <path>", "Working directory", process.cwd())
	.action(async (opts) => {
		try {
			await runInit({
				cwd: opts.cwd,
				yes: opts.yes,
				theme: opts.theme,
				registry: opts.registry,
			});
		} catch (err) {
			console.error(kleur.red(err instanceof Error ? err.message : String(err)));
			process.exit(1);
		}
	});

program
	.command("add [components...]")
	.description("Add components to your project")
	.option("-y, --yes", "Skip prompts", false)
	.option("--overwrite", "Overwrite existing files without prompting", false)
	.option("--skip-install", "Don't install npm dependencies", false)
	.option("--registry <url>", "Override registry URL")
	.option("--cwd <path>", "Working directory", process.cwd())
	.action(async (components: string[], opts) => {
		try {
			await runAdd(components, {
				cwd: opts.cwd,
				yes: opts.yes,
				overwrite: opts.overwrite,
				skipInstall: opts.skipInstall,
				registry: opts.registry,
			});
		} catch (err) {
			console.error(kleur.red(err instanceof Error ? err.message : String(err)));
			process.exit(1);
		}
	});

program.parseAsync();
