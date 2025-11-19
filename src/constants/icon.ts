import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
	{
		src: "/favicon/favicon-light.png",
		theme: "light",
		sizes: "32x32",
	},
	{
		src: "/favicon/favicon-dark.png",
		theme: "dark",
		sizes: "32x32",
	},
];
