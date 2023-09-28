import { memo } from 'react';
import { Paper, Button, Stack, InputBase, IconButton, CircularProgress } from '@mui/material';
import Page from '../../components/Page';
import { useGetClients } from '@/hooks/clients/useClients';
import useModal, { MODAL_TYPES } from '@/hooks/common/useModal';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';

import DashboardWithVirtualized from '@/components/Common/Dashboard/DashboardWithVirtualized';
import Header from '@/components/Header';

function Clients() {
	const { t } = useTranslation(NAME_SPACES.CLIENTS);
	const { renderModal, setOpenModal } = useModal({});
	const { query, search, debouncedOnHandleChangeKeyword, filteredClients, columns, renderValue, renderDialog } =
		useGetClients({
			setOpenModal,
		});
	const { isFetching } = query;

	return (
		<Page>
			<Stack gap={4}>
				<Header />
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
					height={{ xs: 'calc(100dvh - 350px)', md: 'calc(100dvh - 300px)' }}
				/>
			</Paper>
			{renderModal}
			{renderDialog}
		</Page>
	);
}

export default memo(Clients);
