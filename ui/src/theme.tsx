import { createTheme as createMuiTheme } from '@mui/material/styles';
import commonConstants from './constants/common.constant';

export const THEME_CONSTANT = {
	primaryColor: '#345FFF',
	secondaryColor: '#ffe734',
	greenColor: '#008025',
} as const;

const createTheme = (mode: (typeof commonConstants.THEME_MODE)[keyof typeof commonConstants.THEME_MODE]) =>
	createMuiTheme({
		palette: {
			mode,
			primary: {
				main: THEME_CONSTANT.primaryColor,
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
							color: THEME_CONSTANT.greenColor,
						},
					},
				},
			},
		},
	});

export default createTheme;
