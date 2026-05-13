import { existsSync } from "node:fs";
import { join } from "node:path";
import { execa } from "execa";
import kleur from "kleur";

type PackageManager = "pnpm" | "yarn" | "npm" | "bun";

function detectPackageManager(cwd: string): PackageManager {
	if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
	if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
	if (existsSync(join(cwd, "bun.lockb"))) return "bun";
	return "npm";
}

export async function installDependencies(cwd: string, deps: string[]) {
	if (deps.length === 0) return;
	const pm = detectPackageManager(cwd);
	const subcommand = pm === "npm" ? "install" : "add";
	console.log(kleur.cyan(`\nInstalling ${deps.length} dependency(ies) with ${pm}...`));
	await execa(pm, [subcommand, ...deps], { cwd, stdio: "inherit" });
}
