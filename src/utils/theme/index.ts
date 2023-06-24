import { createTheme } from "@mui/material";
import { extendTheme as extendJoyTheme } from '@mui/joy/styles';
import { blue, grey } from "@mui/material/colors";
import { deepmerge } from "@mui/utils";
import {
	Experimental_CssVarsProvider as MaterialCssVarsProvider,
	experimental_extendTheme as extendMaterialTheme,
 } from "@mui/material/styles";

const primaryCol = {
	50: '#d0d6c9',
	100: '#b0bba5',
	200: '#909f81',
	300: '#81916f',
	400: '#61764b',
	500: '#576a44',
	600: '#4e5e3c',
	700: '#445335',
 }
 
 //mui theme
 const muiTheme = extendMaterialTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: {
				  main: '#61764B',
				  dark: '#4e5e3c',
				  light: '#81916f',
				},
				secondary: {
				  main: '#9BA17B',
				},
			 },
		}
	}
});
 
 // Note: you can't put `joyTheme` inside Material UI's `extendMuiTheme(joyTheme)`
 // because some of the values in the Joy UI theme refers to CSS variables and
 // not raw colors.
 
 //joyUI theme
 const joyTheme = extendJoyTheme({
	// This is required to point to `var(--mui-*)` because we are using
	// `CssVarsProvider` from Material UI.
	cssVarPrefix: 'mui',
	colorSchemes: {
	  light: {
		 palette: {
			primary: {
			  ...primaryCol,
			  solidColor: 'var(--mui-palette-primary-contrastText)',
			  solidBg: 'var(--mui-palette-primary-main)',
			  solidHoverBg: 'var(--mui-palette-primary-dark)',
			  plainColor: 'var(--mui-palette-primary-main)',
			  plainHoverBg:
				 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
			  plainActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
			  outlinedBorder: 'rgba(var(--mui-palette-primary-mainChannel) / 0.5)',
			  outlinedColor: 'var(--mui-palette-primary-main)',
			  outlinedHoverBg:
				 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
			  outlinedHoverBorder: 'var(--mui-palette-primary-main)',
			  outlinedActiveBg: 'rgba(var(--mui-palette-primary-mainChannel) / 0.3)',
		 
			},
			neutral: {
			  ...grey,
			},
			// Do the same for the `danger`, `info`, `success`, and `warning` palettes,
			divider: 'var(--mui-palette-divider)',
			text: {
			  tertiary: 'rgba(0 0 0 / 0.56)',
			},
 
		 },
	  },
	  // Do the same for dark mode
	  // dark: { ... }
	},
	fontFamily: {
	  display: '"Roboto","Helvetica","Arial",sans-serif',
	  body: '"Roboto","Helvetica","Arial",sans-serif',
	},
	//@ts-ignore
	shadows: {
	  xs: `var(--mui-shadowRing), ${muiTheme.shadows[1]}`,
	  sm: `var(--mui-shadowRing), ${muiTheme.shadows[2]}`,
	  md: `var(--mui-shadowRing), ${muiTheme.shadows[4]}`,
	  lg: `var(--mui-shadowRing), ${muiTheme.shadows[8]}`,
	  xl: `var(--mui-shadowRing), ${muiTheme.shadows[12]}`,
	},
 });
 
 // You can use your own `deepmerge` function.
 // muiTheme will deeply merge to joyTheme.
export const theme = deepmerge(joyTheme, muiTheme);

console.log('theme', theme);