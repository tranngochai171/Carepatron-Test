import React, { useCallback, useMemo, useState } from 'react';
import { Backdrop, Box, CircularProgress, styled, SxProps, Theme } from '@mui/material';
import Modal from '@mui/material/Modal';
import loadable from '@loadable/component';
import { CreateClientModalProps } from '@/components/Modal/CreateClient/CreateClient.modal';
import { Provider } from 'jotai';

const CreateClientModal = loadable(() => import('@/components/Modal'), {
	resolveComponent: (components) => components.CreateClientModal,
	fallback: <div>Loading...</div>,
});

export const MODAL_TYPES = {
	CREATE_CLIENT_MODAL: CreateClientModal,
} as const;

// We will create union type if we have more modals
export type OpenModalState = {
	modalType: typeof MODAL_TYPES.CREATE_CLIENT_MODAL;
	data?: CreateClientModalProps['data'];
};

const StyledModal = styled(Modal)({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const style: SxProps<Theme> = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
	width: {
		xs: 'calc(100vw - 5rem)',
		md: '500px',
	},
};

type Props = {
	isLoading?: boolean;
	additionalStyles?: any;
};

const useModal = ({ isLoading, additionalStyles = {} }: Props) => {
	const [openModal, setOpenModal] = useState<OpenModalState | null>(null);
	const onHandleCloseModal = useCallback(() => {
		setOpenModal(null);
	}, []);
	const renderModal = useMemo(() => {
		const ModalComponent = openModal?.modalType || null;
		const data: any = openModal?.data || {};
		if (ModalComponent) {
			return (
				<Provider>
					<StyledModal
						open={!!openModal}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
						onClose={onHandleCloseModal}
						closeAfterTransition
						sx={{
							zIndex: (theme) => {
								return theme.zIndex.appBar + 1;
							},
						}}
					>
						<Box sx={{ ...style, ...additionalStyles }}>
							{isLoading && (
								<Backdrop open={true}>
									<CircularProgress color='inherit' />
								</Backdrop>
							)}
							<ModalComponent onCloseModal={onHandleCloseModal} data={data} />
						</Box>
					</StyledModal>
				</Provider>
			);
		}
		return null;
	}, [additionalStyles, isLoading, onHandleCloseModal, openModal]);

	return { renderModal, setOpenModal };
};

export default useModal;
