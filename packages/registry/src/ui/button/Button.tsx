import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type ButtonProps = ComponentProps<"button"> & {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
};

export function Button({
	className,
	variant,
	size,
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			className={`${styles.root}${className ? ` ${className}` : ""}`}
			data-variant={variant}
			data-size={size}
			data-disabled={disabled || undefined}
			disabled={disabled}
			{...props}
		/>
	);
}
