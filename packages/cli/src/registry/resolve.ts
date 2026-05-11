import { fetchItem } from "./fetch.js";
import type { RegistryItem } from "./schema.js";

export async function resolveItems(
	registry: string,
	names: string[],
): Promise<RegistryItem[]> {
	const visited = new Set<string>();
	const collected: RegistryItem[] = [];

	async function visit(name: string) {
		if (visited.has(name)) return;
		visited.add(name);
		const item = await fetchItem(registry, name);
		for (const dep of item.registryDependencies) {
			await visit(dep);
		}
		collected.push(item);
	}

	for (const name of names) {
		await visit(name);
	}

	return collected;
}
