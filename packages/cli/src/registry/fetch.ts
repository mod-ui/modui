import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
	registryIndexSchema,
	registryItemSchema,
	type RegistryIndex,
	type RegistryItem,
} from "./schema.js";

const cache = new Map<string, unknown>();

async function fetchJson(url: string): Promise<unknown> {
	if (cache.has(url)) return cache.get(url);

	let raw: string;
	if (url.startsWith("file://")) {
		raw = await readFile(fileURLToPath(url), "utf8");
	} else if (url.startsWith("/") || url.match(/^[A-Za-z]:[\\/]/)) {
		raw = await readFile(url, "utf8");
	} else {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
		}
		raw = await res.text();
	}

	const parsed = JSON.parse(raw);
	cache.set(url, parsed);
	return parsed;
}

function joinUrl(base: string, path: string): string {
	if (base.startsWith("http")) {
		return `${base.replace(/\/$/, "")}/${path}`;
	}
	return `${base.replace(/\/$/, "")}/${path}`;
}

export async function fetchIndex(registry: string): Promise<RegistryIndex> {
	const data = await fetchJson(joinUrl(registry, "index.json"));
	return registryIndexSchema.parse(data);
}

export async function fetchItem(
	registry: string,
	name: string,
): Promise<RegistryItem> {
	const data = await fetchJson(joinUrl(registry, `${name}.json`));
	return registryItemSchema.parse(data);
}

export async function fetchTheme(
	registry: string,
	name: string,
): Promise<RegistryItem> {
	const data = await fetchJson(joinUrl(registry, `themes/${name}.json`));
	return registryItemSchema.parse(data);
}
