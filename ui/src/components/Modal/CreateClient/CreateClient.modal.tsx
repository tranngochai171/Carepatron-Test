import { Stack, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAutoUpdateStep, useUpdateCreatingProcessData } from '@/hooks/clients/useCreateClientProcess';
import useMultiStepForm from '@/hooks/clients/useMultiStepForm';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';

const StepperProcess = loadable(() => import('@/components/Modal/CreateClient'), {
	resolveComponent: (components) => components.StepperProcess,
	fallback: <div>Loading...</div>,
});
const CreateClientStep1 = loadable(() => import('@/components/Modal/CreateClient'), {
	resolveComponent: (components) => components.CreateClientStep1,
	fallback: <div>Loading...</div>,
});
const CreateClientStep2 = loadable(() => import('@/components/Modal/CreateClient'), {
	resolveComponent: (components) => components.CreateClientStep2,
	fallback: <div>Loading...</div>,
});

export type CreateClientModalProps = {
	onCloseModal: () => void;
	data?: {
		editData: ClientType;
	};
};

const CreateClientModal = ({ onCloseModal, data }: CreateClientModalProps) => {
	const editData = data?.editData;
	useUpdateCreatingProcessData(editData);
	const isEditing = !!editData;
	const { t } = useTranslation(NAME_SPACES.CREATE_CLIENT_MODAL);
	const { step, goTo } = useMultiStepForm([
		{ component: <CreateClientStep1 /> },
		{ component: <CreateClientStep2 onCloseModal={onCloseModal} editData={editData} /> },
	]);
	useAutoUpdateStep({ goTo });

	return (
		<Stack gap={2}>
			<Stack justifyContent='space-between' alignItems='center' direction='row'>
				<Typography variant='h6'>{isEditing ? t('edit_client') : t('create_new_client')}</Typography>
				<IconButton onClick={onCloseModal}>
					<CloseIcon />
				</IconButton>
			</Stack>
			<StepperProcess />
			{step}
		</Stack>
	);
};

export default CreateClientModal;
