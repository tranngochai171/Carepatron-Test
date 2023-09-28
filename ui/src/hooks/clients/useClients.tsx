import { SetStateAction, useCallback, useMemo } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '@/services/api';
import getQueryKey from '@/utils/getQueryKey.util';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { ID_KEYS, TABLE_TYPE, getTableColumn } from '@/utils/tableCreation.util';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import commonConstants from '@/constants/common.constant';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';
import { MODAL_TYPES, OpenModalState } from '../common/useModal';
import useDialog from '../common/useDialog';

type UseGetClientsProps = {
	setOpenModal: (value: SetStateAction<OpenModalState | null>) => void;
};

export const useGetClients = ({ setOpenModal }: UseGetClientsProps) => {
	const theme = useTheme();
	const { t } = useTranslation(NAME_SPACES.COMMON);
	const { mutate: mutateDeleteClient, isLoading } = useDeleteClient();
	const [searchParams, setSearchParams] = useSearchParams({
		[commonConstants.FILTER_KEY.SEARCH]: '',
	});
	const { renderDialog, handleOpenDialog, handleCloseDialog } = useDialog();
	const search = useMemo(() => searchParams.get(commonConstants.FILTER_KEY.SEARCH) || '', [searchParams]);

	const debouncedOnHandleChangeKeyword = debounce((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		searchParams.set(commonConstants.FILTER_KEY.SEARCH, e.target.value);
		setSearchParams(searchParams);
	}, 500);

	const query = useQuery({
		queryKey: getQueryKey.clientListQueryKey(),
		queryFn: getClients,
	});

	const filteredClients = useMemo(
		() =>
			query?.data?.filter(({ firstName, lastName }) =>
				`${firstName} ${lastName}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
			) || [],
		[query.data, search]
	);

	const renderValue = useCallback(
		(id: keyof ClientType, row: ClientType) => {
			const value = row[id];
			let returnValue = null;
			switch (id) {
				case ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].NAME:
					returnValue = <Typography fontWeight={600}>{`${row.firstName} ${row.lastName}`}</Typography>;
					break;
				case ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].ACTIONS:
					returnValue = (
						<Stack direction='row' gap={1} justifyContent='flex-end'>
							<Button
								disabled={isLoading}
								variant='contained'
								onClick={() =>
									setOpenModal({
										modalType: MODAL_TYPES.CREATE_CLIENT_MODAL,
										data: { editData: row },
									})
								}
							>
								{t('edit')}
							</Button>
							<Button
								disabled={isLoading}
								variant='contained'
								onClick={() =>
									handleOpenDialog({
										handleConfirm: () =>
											mutateDeleteClient(row.id || '', { onSettled: () => handleCloseDialog() }),
									})
								}
							>
								{t('delete')}
							</Button>
						</Stack>
					);
					break;
				default:
					returnValue = <Typography>{value}</Typography>;
			}
			return returnValue;
		},
		[handleCloseDialog, handleOpenDialog, isLoading, mutateDeleteClient, setOpenModal, t]
	);

	return {
		search,
		query,
		debouncedOnHandleChangeKeyword,
		filteredClients,
		columns: getTableColumn({ type: TABLE_TYPE.CLIENTS_DASHBOARD, theme }),
		renderValue,
		renderDialog,
	};
};

export type PayloadCreateUpdateClient = ClientType & { isEditing: boolean };

export const useCreateUpdateClient = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(NAME_SPACES.TOAST);

	return useMutation({
		mutationFn: (payload: PayloadCreateUpdateClient) => {
			const { isEditing, ...rest } = payload;
			return isEditing ? updateClient(rest) : createClient(rest);
		},
		onSuccess: (_: any, payload) => {
			const { isEditing } = payload;
			queryClient.invalidateQueries(getQueryKey.clientListQueryKey());
			toast.success(isEditing ? t('client.edit_successfully') : t('client.create_successfully'));
		},
	});
};

export const useDeleteClient = () => {
	const queryClient = useQueryClient();
	const { t } = useTranslation(NAME_SPACES.TOAST);

	return useMutation({
		mutationFn: (clientId: string) => deleteClient(clientId),
		onSuccess: () => {
			queryClient.invalidateQueries(getQueryKey.clientListQueryKey());
			toast.success(t('client.delete_successfully'));
		},
	});
};
