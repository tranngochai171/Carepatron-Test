import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import i18next from 'i18next';
import { CssBaseline } from '@mui/material';
import { atom, useAtomValue } from 'jotai';
import commonConstants from '@/constants/common.constant';
import createTheme, { THEME_COLOR_CONSTANT } from '@/theme';

type Props = {
	children: React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onError = (error: any) => {
	// Fallback Error Catch If we don't define onError when using useQuery
	toast.error(error?.response?.data?.message ?? error?.message ?? i18next.t('common:something_end_wrong'));
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			onError,
		},
		mutations: {
			retry: false,
			onError,
		},
	},
});

export const LOCAL_HOST_KEY = {
	MODE_THEME: 'mode_theme',
	PRIMARY_COLOR_THEME: 'primary_color_theme',
} as const;

export type LocalHostThemeType = (typeof LOCAL_HOST_KEY)[keyof typeof LOCAL_HOST_KEY];
export type ModeThemeType = (typeof commonConstants.MODE_THEME)[keyof typeof commonConstants.MODE_THEME];
export type PrimaryColorThemeType = (typeof THEME_COLOR_CONSTANT)[keyof typeof THEME_COLOR_CONSTANT];

const getDefaultThemeValue = <T,>(list: T[], value: T, defaultValue: T) => {
	if (!Object.values(list).includes(value as T)) {
		return defaultValue;
	}
	return value;
};

// Define an atom to read and write the theme
const themeAtom = atom({
	mode: localStorage.getItem(LOCAL_HOST_KEY.MODE_THEME) ?? commonConstants.MODE_THEME.LIGHT,
	primaryColor: localStorage.getItem(LOCAL_HOST_KEY.PRIMARY_COLOR_THEME) ?? THEME_COLOR_CONSTANT.primaryColor,
});

// Define an atom to handle theme persistence
export const themeAtomWithPersistence = atom(
	(get): { mode: ModeThemeType; primaryColor: PrimaryColorThemeType } => {
		let { mode, primaryColor } = get(themeAtom);

		[mode, primaryColor] = [
			{
				list: Object.values(commonConstants.MODE_THEME),
				value: mode,
				defaultValue: commonConstants.MODE_THEME.LIGHT,
			},
			{
				list: Object.values(THEME_COLOR_CONSTANT),
				value: primaryColor,
				defaultValue: THEME_COLOR_CONSTANT.primaryColor,
			},
		].map(({ list, value, defaultValue }) => getDefaultThemeValue(list, value, defaultValue));

		return { mode, primaryColor } as { mode: ModeThemeType; primaryColor: PrimaryColorThemeType };
	},
	(get, set, { type, selectedThemeValue }: { type: LocalHostThemeType; selectedThemeValue: string }) => {
		switch (type) {
			case LOCAL_HOST_KEY.MODE_THEME:
				set(themeAtom, { ...get(themeAtom), mode: selectedThemeValue });
				break;
			case LOCAL_HOST_KEY.PRIMARY_COLOR_THEME:
				set(themeAtom, { ...get(themeAtom), primaryColor: selectedThemeValue });
				break;
			default:
		}
		localStorage.setItem(type, selectedThemeValue);
	}
);

const Providers = ({ children }: Props) => {
	const { mode, primaryColor } = useAtomValue(themeAtomWithPersistence);

	return (
		<ThemeProvider theme={createTheme(mode, primaryColor)}>
			<CssBaseline />
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default Providers;
