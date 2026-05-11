import { z } from "zod";

export const registryFileSchema = z.object({
	path: z.string(),
	content: z.string(),
	type: z.enum(["component", "style", "theme"]),
});

export const registryItemSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	dependencies: z.array(z.string()).default([]),
	registryDependencies: z.array(z.string()).default([]),
	files: z.array(registryFileSchema),
});

export const registryIndexEntrySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	dependencies: z.array(z.string()).default([]),
	registryDependencies: z.array(z.string()).default([]),
});

export const registryIndexSchema = z.object({
	version: z.string(),
	components: z.array(registryIndexEntrySchema),
	themes: z.array(z.string()),
});

export type RegistryFile = z.infer<typeof registryFileSchema>;
export type RegistryItem = z.infer<typeof registryItemSchema>;
export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type RegistryIndexEntry = z.infer<typeof registryIndexEntrySchema>;
