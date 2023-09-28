import { Theme } from '@mui/material';
import i18next from 'i18next';

export const TABLE_TYPE = {
	CLIENTS_DASHBOARD: 'CLIENTS_DASHBOARD',
} as const;

export const ID_KEYS = {
	[TABLE_TYPE.CLIENTS_DASHBOARD]: {
		NAME: 'name',
		PHONE_NUMBER: 'phoneNumber',
		EMAIL: 'email',
		ACTIONS: 'actions',
	},
};

type TableValueType = { type: (typeof TABLE_TYPE)[keyof typeof TABLE_TYPE]; theme: Theme };

export const getTableColumn = ({ type, theme }: TableValueType): ColumnDashboard[] => {
	switch (type) {
		case TABLE_TYPE.CLIENTS_DASHBOARD:
			return [
				{
					id: ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].NAME,
					label: i18next.t('clients:dashboard.header_label.name'),
					cellStyle: {
						color: theme.palette.primary.main,
					},
				},
				{
					id: ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].PHONE_NUMBER,
					label: i18next.t('clients:dashboard.header_label.phone'),
					headerStyle: {
						width: 150,
					},
				},
				{
					id: ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].EMAIL,
					label: i18next.t('clients:dashboard.header_label.email'),
				},
				{
					id: ID_KEYS[TABLE_TYPE.CLIENTS_DASHBOARD].ACTIONS,
					label: i18next.t('clients:dashboard.header_label.actions'),
					headerStyle: {
						textAlign: 'right',
					},
					cellStyle: {
						textAlign: 'right',
					},
				},
			];
		default:
			return [];
	}
};
