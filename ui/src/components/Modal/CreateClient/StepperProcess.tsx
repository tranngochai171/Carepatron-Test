import { useUpdateCreatingProcessData } from '@/hooks/clients/useCreateClientProcess';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';

const StepperProcess = () => {
	const { t } = useTranslation(NAME_SPACES.CREATE_CLIENT_MODAL);
	const STEPS_TEXT = [t('progress_bar.personal_details'), t('progress_bar.contact_details')] as const;
	const { creatingProcessValue } = useUpdateCreatingProcessData();
	return (
		<Stepper activeStep={creatingProcessValue.processingStep}>
			{STEPS_TEXT.map((label) => {
				const stepProps: { completed?: boolean } = {};
				const labelProps: {
					optional?: React.ReactNode;
				} = {};
				return (
					<Step key={label} {...stepProps}>
						<StepLabel {...labelProps}>{label}</StepLabel>
					</Step>
				);
			})}
		</Stepper>
	);
};

export default StepperProcess;
