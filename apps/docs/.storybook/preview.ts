import type { Preview } from "@storybook/react-vite";
import "@mod-ui/registry/src/themes/default.css";

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Theme",
			toolbar: {
				title: "Theme",
				items: [
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "dark", icon: "moon", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "light",
	},
	decorators: [
		(Story, context) => {
			document.documentElement.setAttribute(
				"data-theme",
				context.globals.theme,
			);
			return Story();
		},
	],
};

export default preview;
