import type { ComponentProps } from "react";
import styles from "./Input.module.css";

type InputProps = Omit<ComponentProps<"input">, "size"> & {
	size?: "sm" | "md" | "lg";
	invalid?: boolean;
};

export function Input({
	className,
	size,
	invalid,
	disabled,
	readOnly,
	...props
}: InputProps) {
	return (
		<input
			className={`${styles.root}${className ? ` ${className}` : ""}`}
			data-size={size}
			data-disabled={disabled || undefined}
			data-readonly={readOnly || undefined}
			aria-invalid={invalid || props["aria-invalid"]}
			disabled={disabled}
			readOnly={readOnly}
			{...props}
		/>
	);
}
