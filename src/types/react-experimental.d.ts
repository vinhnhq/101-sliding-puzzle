// React@experimental exports `unstable_ViewTransition` and stable `Activity`
// (since React 19.2) at runtime, but @types/react 19.0.x doesn't declare them.
// This file augments the module so call sites stay type-safe.

import type { ComponentType, Key, ReactNode } from "react";

declare module "react" {
	export const unstable_ViewTransition: ComponentType<{
		name?: string;
		children?: ReactNode;
	}>;

	export const Activity: ComponentType<{
		mode: "visible" | "hidden";
		children?: ReactNode;
		key?: Key;
	}>;
}
