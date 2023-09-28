import { isValidElement, useCallback, useMemo, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Stack,
	SxProps,
	Theme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';

type DialogInfoType = {
	title?: string;
	content?: string | React.ReactNode;
	handleConfirm: () => void;
	handleDecline?: () => void;
	approveText?: string;
	disapproveText?: string;
	hideDisapproveButton?: boolean;
	showCloseIcon?: boolean;
	additionalStyles?: SxProps<Theme>;
};

const useDialog = () => {
	const { t } = useTranslation(NAME_SPACES.COMMON);
	const [open, setOpen] = useState<DialogInfoType | null>(null);

	const handleOpenDialog = useCallback((info: DialogInfoType) => {
		setOpen(info);
	}, []);

	const handleCloseDialog = () => {
		setOpen(null);
	};

	const renderDialog = useMemo(
		() =>
			!!open ? (
				<Dialog
					open={!!open}
					onClose={handleCloseDialog}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'
					sx={open?.additionalStyles ? { ...open.additionalStyles } : {}}
				>
					<DialogTitle id='alert-dialog-title'>{open.title ? open.title : t('are_you_sure')}</DialogTitle>
					{open?.showCloseIcon ? (
						<IconButton
							aria-label='close'
							onClick={handleCloseDialog}
							sx={{
								position: 'absolute',
								right: 8,
								top: 8,
							}}
						>
							<CloseIcon />
						</IconButton>
					) : null}
					{open?.content && (
						<DialogContent>
							{isValidElement(open.content) ? (
								open.content
							) : (
								<DialogContentText id='alert-dialog-description'>{open.content}</DialogContentText>
							)}
						</DialogContent>
					)}
					<DialogActions sx={{ p: 2 }}>
						<Stack width='100%' gap={1.2}>
							<Button onClick={open?.handleConfirm} autoFocus variant='contained'>
								{open?.approveText ?? t('yes')}
							</Button>
							{open.hideDisapproveButton ? null : (
								<Button
									onClick={open?.handleDecline ? open.handleDecline : handleCloseDialog}
									variant='outlined'
								>
									{open?.disapproveText ?? t('no')}
								</Button>
							)}
						</Stack>
					</DialogActions>
				</Dialog>
			) : null,
		[open, t]
	);

	return { renderDialog, handleOpenDialog, handleCloseDialog };
};

export default useDialog;
