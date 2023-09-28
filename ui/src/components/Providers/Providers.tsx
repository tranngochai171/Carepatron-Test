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

export const LOCAL_STORAGE_MODE_THEME_KEY = 'mode_theme';
export const LOCAL_STORAGE_PRIMARY_COLOR_THEME_KEY = 'primary_color_theme';

export type ModeThemeType = (typeof commonConstants.MODE_THEME)[keyof typeof commonConstants.MODE_THEME];
export type PrimaryColorThemeType = (typeof THEME_COLOR_CONSTANT)[keyof typeof THEME_COLOR_CONSTANT];

// Define an atom to read and write the theme
const modeThemeAtom = atom(localStorage.getItem(LOCAL_STORAGE_MODE_THEME_KEY) ?? commonConstants.MODE_THEME.LIGHT);
const primaryColorThemeAtom = atom(
	localStorage.getItem(LOCAL_STORAGE_PRIMARY_COLOR_THEME_KEY) ?? THEME_COLOR_CONSTANT.primaryColor
);

// Define an atom to handle theme persistence
export const modeThemeAtomWithPersistence = atom(
	(get) => {
		const mode = get(modeThemeAtom);
		if (!Object.values(commonConstants.MODE_THEME).includes(mode as ModeThemeType)) {
			return commonConstants.MODE_THEME.LIGHT;
		}
		return mode as ModeThemeType;
	},
	(get, set, selectedTheme: ModeThemeType) => {
		set(modeThemeAtom, selectedTheme);
		localStorage.setItem(LOCAL_STORAGE_MODE_THEME_KEY, selectedTheme);
	}
);
export const primaryColorThemeAtomWithPersistence = atom(
	(get) => {
		const primaryColor = get(primaryColorThemeAtom);
		if (!Object.values(THEME_COLOR_CONSTANT).includes(primaryColor as PrimaryColorThemeType)) {
			return THEME_COLOR_CONSTANT.primaryColor;
		}
		return primaryColor as PrimaryColorThemeType;
	},
	(get, set, selectedPrimaryColorTheme: PrimaryColorThemeType) => {
		set(primaryColorThemeAtom, selectedPrimaryColorTheme);
		localStorage.setItem(LOCAL_STORAGE_PRIMARY_COLOR_THEME_KEY, selectedPrimaryColorTheme);
	}
);

const Providers = ({ children }: Props) => {
	const mode = useAtomValue(modeThemeAtomWithPersistence);
	const primaryColor = useAtomValue(primaryColorThemeAtomWithPersistence);

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
