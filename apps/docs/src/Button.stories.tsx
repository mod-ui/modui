import { Button } from "@mod-ui/registry/src/ui/button/Button";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "UI/Button",
	component: Button,
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "outline", "ghost", "danger"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		disabled: { control: "boolean" },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: "Button",
	},
};

export const Secondary: Story = {
	args: {
		children: "Button",
		variant: "secondary",
	},
};

export const Outline: Story = {
	args: {
		children: "Button",
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		children: "Button",
		variant: "ghost",
	},
};

export const Danger: Story = {
	args: {
		children: "Button",
		variant: "danger",
	},
};

export const Small: Story = {
	args: {
		children: "Button",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		children: "Button",
		size: "lg",
	},
};

export const Disabled: Story = {
	args: {
		children: "Button",
		disabled: true,
	},
};
