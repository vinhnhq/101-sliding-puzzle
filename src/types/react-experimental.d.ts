// React@experimental exports `ViewTransition` and `Activity` directly (the
// `unstable_` prefix from earlier docs has been dropped). @types/react 19.0.x
// doesn't declare either yet, so we augment the module to keep call sites
// type-safe.

import type { ComponentType, Key, ReactNode } from "react";

declare module "react" {
	export const ViewTransition: ComponentType<{
		name?: string;
		children?: ReactNode;
	}>;

	export const Activity: ComponentType<{
		mode: "visible" | "hidden";
		children?: ReactNode;
		key?: Key;
	}>;
}
