import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import i18next from 'i18next';
import { CssBaseline } from '@mui/material';
import { atom, useAtomValue } from 'jotai';
import commonConstants from '@/constants/common.constant';
import { useMemo } from 'react';
import createTheme from '@/theme';

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

export const LOCAL_STORAGE_THEME_KEY = 'theme';

type ThemeModeType = (typeof commonConstants.THEME_MODE)[keyof typeof commonConstants.THEME_MODE];

// Define an atom to read and write the theme
const themeAtom = atom(localStorage.getItem(LOCAL_STORAGE_THEME_KEY) ?? commonConstants.THEME_MODE.LIGHT);

// Define an atom to handle theme persistence
export const themeAtomWithPersistence = atom(
	(get) => {
		const mode = get(themeAtom);
		if (!Object.values(commonConstants.THEME_MODE).includes(mode as ThemeModeType)) {
			return commonConstants.THEME_MODE.LIGHT;
		}
		return mode as ThemeModeType;
	},
	(get, set, selectedTheme: string) => {
		set(themeAtom, selectedTheme);
		localStorage.setItem(LOCAL_STORAGE_THEME_KEY, selectedTheme);
	}
);

const Providers = ({ children }: Props) => {
	const themeValue = useAtomValue(themeAtom);
	const mode = useMemo(() => {
		if (!Object.values(commonConstants.THEME_MODE).includes(themeValue as ThemeModeType)) {
			return commonConstants.THEME_MODE.LIGHT;
		}
		return themeValue as ThemeModeType;
	}, [themeValue]);

	return (
		<ThemeProvider theme={createTheme(mode)}>
			<CssBaseline />
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default Providers;
