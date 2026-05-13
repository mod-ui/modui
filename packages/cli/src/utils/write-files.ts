import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import kleur from "kleur";
import prompts from "prompts";
import type { Config } from "./config.js";
import type { RegistryFile, RegistryItem } from "../registry/schema.js";

function resolveTarget(cwd: string, config: Config, file: RegistryFile): string {
	if (file.type === "theme") {
		const filename = file.path.replace(/^themes\//, "");
		return join(cwd, config.paths.themes, filename);
	}
	const relative = file.path.replace(/^ui\//, "");
	return join(cwd, config.paths.ui, relative);
}

type WriteOptions = {
	overwrite: boolean;
	yes: boolean;
};

export async function writeItemFiles(
	cwd: string,
	config: Config,
	items: RegistryItem[],
	options: WriteOptions,
): Promise<{ written: string[]; skipped: string[] }> {
	const written: string[] = [];
	const skipped: string[] = [];

	for (const item of items) {
		for (const file of item.files) {
			const target = resolveTarget(cwd, config, file);
			const relTarget = target.replace(`${cwd}/`, "");

			if (existsSync(target) && !options.overwrite) {
				if (options.yes) {
					skipped.push(relTarget);
					console.log(kleur.gray(`  skipped ${relTarget} (exists)`));
					continue;
				}
				const { confirm } = await prompts({
					type: "confirm",
					name: "confirm",
					message: `${relTarget} already exists. Overwrite?`,
					initial: false,
				});
				if (!confirm) {
					skipped.push(relTarget);
					console.log(kleur.gray(`  skipped ${relTarget}`));
					continue;
				}
			}

			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, file.content, "utf8");
			written.push(relTarget);
			console.log(kleur.green(`  added ${relTarget}`));
		}
	}

	return { written, skipped };
}
