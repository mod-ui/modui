import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

export const configSchema = z.object({
	$schema: z.string().optional(),
	registry: z.string(),
	paths: z.object({
		ui: z.string(),
		themes: z.string(),
	}),
});

export type Config = z.infer<typeof configSchema>;

export const DEFAULT_CONFIG: Config = {
	$schema: "https://modui.dev/schema.json",
	registry: "https://mod-ui.github.io/modui/r",
	paths: {
		ui: "src/components/ui",
		themes: "src/styles",
	},
};

export const CONFIG_FILENAME = "components.json";

export function configPath(cwd: string) {
	return join(cwd, CONFIG_FILENAME);
}

export async function loadConfig(cwd: string): Promise<Config | null> {
	const path = configPath(cwd);
	if (!existsSync(path)) return null;
	const raw = await readFile(path, "utf8");
	const parsed = JSON.parse(raw);
	return configSchema.parse(parsed);
}

export async function writeConfig(cwd: string, config: Config) {
	await writeFile(
		configPath(cwd),
		`${JSON.stringify(config, null, 2)}\n`,
		"utf8",
	);
}
