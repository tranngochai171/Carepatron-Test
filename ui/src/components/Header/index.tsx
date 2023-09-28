import { Button, Stack, Typography } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import i18next from 'i18next';
import commonConstants from '@/constants/common.constant';
import { LANGUAGES, LOCAL_STORAGE_LANGUAGE_KEY, MAPPING_FLAG, NAME_SPACES, locales } from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { themeAtomWithPersistence } from '../Providers/Providers';

const getThemeModeLang = (mode: (typeof commonConstants.THEME_MODE)[keyof typeof commonConstants.THEME_MODE]) => {
	const MAPPING_THEME_MODE: Record<
		(typeof commonConstants.THEME_MODE)[keyof typeof commonConstants.THEME_MODE],
		{ icon: React.ReactNode; text: string }
	> = {
		[commonConstants.THEME_MODE.LIGHT]: {
			icon: <Brightness4Icon />,
			text: i18next.t('common:light_mode'),
		},
		[commonConstants.THEME_MODE.DARK]: {
			icon: <Brightness7Icon />,
			text: i18next.t('common:dark_mode'),
		},
	} as const;
	return MAPPING_THEME_MODE[mode];
};

const Header = () => {
	const [themeAtom, setThemeAtom] = useAtom(themeAtomWithPersistence);

	const { t, i18n } = useTranslation(NAME_SPACES.CLIENTS);
	const changeLanguage = (lng: (typeof LANGUAGES)[keyof typeof LANGUAGES]) => {
		i18n.changeLanguage(lng);
		localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, lng);
	};
	const changeThemeMode = () => {
		setThemeAtom(
			themeAtom === commonConstants.THEME_MODE.LIGHT
				? commonConstants.THEME_MODE.DARK
				: commonConstants.THEME_MODE.LIGHT
		);
	};
	const currentLng = locales?.[i18n.language as keyof typeof locales];
	const { text: textMode, icon: iconMode } = getThemeModeLang(themeAtom);
	return (
		<Stack direction='row' justifyContent='space-between'>
			<Typography variant='h4' sx={{ textAlign: 'start' }} fontWeight={600}>
				{t('clients')}
			</Typography>
			<Stack gap={2} direction='row'>
				<Button
					variant='outlined'
					startIcon={
						<img
							src={MAPPING_FLAG[i18n.language as (typeof LANGUAGES)[keyof typeof LANGUAGES]].src}
							alt={MAPPING_FLAG[i18n.language as (typeof LANGUAGES)[keyof typeof LANGUAGES]].alt}
							style={{ width: 20 }}
						/>
					}
					onClick={() => changeLanguage(i18n.language === LANGUAGES.VI ? LANGUAGES.EN : LANGUAGES.VI)}
				>
					{currentLng}
				</Button>
				<Button variant='outlined' onClick={changeThemeMode} endIcon={iconMode}>
					{textMode}
				</Button>
			</Stack>
		</Stack>
	);
};

export default Header;
