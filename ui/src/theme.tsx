import { createTheme as createMuiTheme } from '@mui/material/styles';
import { ModeThemeType, PrimaryColorThemeType } from './components/Providers/Providers';

export const THEME_COLOR_CONSTANT = {
	primaryColor: '#3b5dd9',
	secondaryColor: '#de4040',
	greenColor: '#19a13f',
} as const;

const createTheme = (mode: ModeThemeType, primaryColor: PrimaryColorThemeType) =>
	createMuiTheme({
		typography: {
			fontFamily: 'Inclusive Sans, Arial, sans-serif',
		},
		palette: {
			mode,
			primary: {
				main: primaryColor || THEME_COLOR_CONSTANT.primaryColor,
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						textTransform: 'unset',
					},
				},
			},
			MuiStepLabel: {
				styleOverrides: {
					root: {
						'& .MuiSvgIcon-root.Mui-completed': {
							color: THEME_COLOR_CONSTANT.greenColor,
						},
					},
				},
			},
		},
	});

export default createTheme;
