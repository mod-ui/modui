import { Input } from "@mod-ui/registry/src/ui/input/Input";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "UI/Input",
	component: Input,
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		type: {
			control: "select",
			options: ["text", "email", "password", "number", "search", "url", "tel"],
		},
		invalid: { control: "boolean" },
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: "Enter text...",
	},
};

export const Small: Story = {
	args: {
		placeholder: "Small input",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		placeholder: "Large input",
		size: "lg",
	},
};

export const Invalid: Story = {
	args: {
		placeholder: "Invalid input",
		invalid: true,
		defaultValue: "wrong@",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "Disabled",
		disabled: true,
	},
};

export const ReadOnly: Story = {
	args: {
		readOnly: true,
		defaultValue: "Read-only value",
	},
};

export const Password: Story = {
	args: {
		type: "password",
		placeholder: "Password",
		defaultValue: "secret123",
	},
};
