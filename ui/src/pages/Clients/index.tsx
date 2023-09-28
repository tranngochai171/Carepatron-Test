import { memo } from 'react';
import { Paper, Typography, Button, Stack, InputBase, IconButton, CircularProgress, useTheme } from '@mui/material';
import Page from '../../components/Page';
import { useGetClients } from '@/hooks/clients/useClients';
import useModal, { MODAL_TYPES } from '@/hooks/common/useModal';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LOCAL_STORAGE_LANGUAGE_KEY, MAPPING_FLAG, NAME_SPACES, locales } from '@/i18n/i18n';
import Dashboard from '@/components/Common/Dashboard/Dashboard';
import { useAtom } from 'jotai';
import { themeAtomWithPersistence } from '@/components/Providers/Providers';
import commonConstants from '@/constants/common.constant';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import i18next from 'i18next';
import DashboardWithVirtualized from '@/components/Common/Dashboard/DashboardWithVirtualized';

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

function Clients() {
	const theme = useTheme();
	const { t, i18n } = useTranslation(NAME_SPACES.CLIENTS);
	const { renderModal, setOpenModal } = useModal({});
	const { query, search, debouncedOnHandleChangeKeyword, filteredClients, columns, renderValue, renderDialog } =
		useGetClients({
			setOpenModal,
		});
	const [themeAtom, setThemeAtom] = useAtom(themeAtomWithPersistence);
	const { isFetching } = query;
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
		<Page>
			<Stack gap={4}>
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
				<Stack
					gap={2}
					direction={{ xs: 'column-reverse', sm: 'row' }}
					alignItems='center'
					justifyContent='space-between'
				>
					<Stack direction='row' alignItems='center' sx={{ minWidth: 'min(400px, 100%)' }}>
						<Paper sx={{ width: '100%' }}>
							<Stack direction='row' alignItems='center'>
								<InputBase
									id='search'
									sx={{ ml: 1, flex: 1 }}
									placeholder={t('action_bar.search_place_holder')}
									inputProps={{ 'aria-label': 'search name' }}
									onChange={debouncedOnHandleChangeKeyword}
									defaultValue={search}
								/>
								<IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
									<SearchIcon />
								</IconButton>
							</Stack>
						</Paper>
						{isFetching ? <CircularProgress /> : null}
					</Stack>

					<Button
						variant='contained'
						color='primary'
						onClick={() =>
							setOpenModal({
								modalType: MODAL_TYPES.CREATE_CLIENT_MODAL,
							})
						}
						sx={{ marginLeft: 'auto' }}
					>
						{t('action_bar.create_new_client')}
					</Button>
				</Stack>
			</Stack>
			<Paper sx={{ margin: 'auto', marginTop: 3 }}>
				<DashboardWithVirtualized
					columns={columns}
					data={filteredClients || []}
					renderValue={renderValue}
					noDataText={t('dashboard.no_data_text')}
					height={{ xs: 'calc(100dvh - 250px)', md: 'calc(100dvh - 200px)' }}
				/>
			</Paper>
			{renderModal}
			{renderDialog}
		</Page>
	);
}

export default memo(Clients);
