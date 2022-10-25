import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>['items'][number];

export const getMenuItem = (
	label: React.ReactNode,
	key?: React.Key | null,
	icon?: React.ReactNode,
	children?: MenuItem[],
	theme?: 'dark' | 'light',
): MenuItem => ({
	key,
	icon,
	children,
	label,
	theme,
} as MenuItem);