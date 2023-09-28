import { NAME_SPACES } from '@/i18n/i18n';
import { Box, Button, Stack, Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';

const Container = styled(Box)({
	height: '100dvh',
	width: '100dvw',
	display: 'grid',
	placeItems: 'center',
});

const NotFound = () => {
	const navigate = useNavigate();
	const { t } = useTranslation(NAME_SPACES.COMMON);
	return (
		<Container>
			<Stack gap={2}>
				<Typography variant='h5'>{t('page_not_found')}</Typography>
				<Typography variant='h1'>404</Typography>
				<Button variant='contained' startIcon={<KeyboardBackspaceIcon />} onClick={() => navigate('/')}>
					{t('back_to_home_page')}
				</Button>
			</Stack>
		</Container>
	);
};

export default NotFound;
