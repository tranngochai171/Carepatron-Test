import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Typography,
	styled,
} from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import i18next from 'i18next';
import commonConstants from '@/constants/common.constant';
import { LANGUAGES, LOCAL_STORAGE_LANGUAGE_KEY, MAPPING_FLAG, NAME_SPACES, locales } from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { LOCAL_HOST_KEY, ModeThemeType, PrimaryColorThemeType, themeAtomWithPersistence } from '../Providers/Providers';
import { THEME_COLOR_CONSTANT } from '@/theme';

const ActionButton = styled(Button)({
	width: '100%',
});

const getThemeModeLang = (mode: ModeThemeType) => {
	const MAPPING_THEME_MODE: Record<ModeThemeType, { icon: React.ReactNode; text: string }> = {
		[commonConstants.MODE_THEME.LIGHT]: {
			icon: <Brightness4Icon />,
			text: i18next.t('common:light_mode'),
		},
		[commonConstants.MODE_THEME.DARK]: {
			icon: <Brightness7Icon />,
			text: i18next.t('common:dark_mode'),
		},
	} as const;
	return MAPPING_THEME_MODE[mode];
};

const Header = () => {
	const [themeAtom, setThemeAtom] = useAtom(themeAtomWithPersistence);

	const { t, i18n } = useTranslation([NAME_SPACES.CLIENTS, NAME_SPACES.COMMON]);
	const changeLanguage = (lng: (typeof LANGUAGES)[keyof typeof LANGUAGES]) => {
		i18n.changeLanguage(lng);
		localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, lng);
	};
	const changeThemeMode = () => {
		setThemeAtom({
			type: LOCAL_HOST_KEY.MODE_THEME,
			selectedThemeValue:
				themeAtom.mode === commonConstants.MODE_THEME.LIGHT
					? commonConstants.MODE_THEME.DARK
					: commonConstants.MODE_THEME.LIGHT,
		});
	};

	const changePrimaryColor = (event: SelectChangeEvent) => {
		setThemeAtom({
			type: LOCAL_HOST_KEY.PRIMARY_COLOR_THEME,
			selectedThemeValue: event.target.value as PrimaryColorThemeType,
		});
	};

	const currentLng = locales?.[i18n.language as keyof typeof locales];
	const { text: textMode, icon: iconMode } = getThemeModeLang(themeAtom.mode as ModeThemeType);
	return (
		<Stack gap={2}>
			<Stack gap={2} direction='row' alignSelf='flex-end'>
				<ActionButton
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
				</ActionButton>
				<ActionButton variant='outlined' onClick={changeThemeMode} endIcon={iconMode}>
					{textMode}
				</ActionButton>
				<FormControl fullWidth variant='outlined' color='primary' sx={{ alignSelf: 'center' }}>
					<InputLabel id='demo-simple-select-label'>{t('common:color')}</InputLabel>
					<Select
						labelId='demo-simple-select-label'
						id='demo-simple-select'
						value={themeAtom.primaryColor}
						label={t('common:color')}
						onChange={changePrimaryColor}
					>
						{Object.values(THEME_COLOR_CONSTANT).map((color) => (
							<MenuItem key={color} value={color}>
								<Box sx={{ width: 20, aspectRatio: '1 / 1', backgroundColor: color }} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>
			<Typography variant='h4' sx={{ textAlign: 'start' }} fontWeight={600}>
				{t('clients')}
			</Typography>
		</Stack>
	);
};

export default Header;
