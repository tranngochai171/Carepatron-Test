import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CREATING_STEPS, STEP_INDEX, useUpdateCreatingProcessData } from '@/hooks/clients/useCreateClientProcess';
import Control, { CONTROL_TYPE } from '@/components/ReactHookForm/Control';
import { Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';
import { TFunction } from 'i18next';

const createSchema = (t: TFunction<['create_client_modal', 'common'], undefined>) =>
	Yup.object().shape({
		firstName: Yup.string()
			.transform((value) => value.trim())
			.required(t('create_client_modal:form_data.first_name.error.required')),
		lastName: Yup.string()
			.transform((value) => value.trim())
			.required(t('create_client_modal:form_data.last_name.error.required')),
	});

export type ClientDataStep1ValueType = Yup.InferType<ReturnType<typeof createSchema>>;

export const createClientProcessStep1DefaultValue: ClientDataStep1ValueType = {
	firstName: '',
	lastName: '',
};

const CreateClientStep1 = () => {
	const { t } = useTranslation([NAME_SPACES.CREATE_CLIENT_MODAL, NAME_SPACES.COMMON]);
	const { creatingProcessValue, updateBookingProcessData, updateProcessStep } = useUpdateCreatingProcessData();
	const methods = useForm({
		defaultValues: creatingProcessValue?.[CREATING_STEPS.STEP_1] ?? createClientProcessStep1DefaultValue,
		resolver: yupResolver(createSchema(t)),
	});

	const onHandleNextStep = (step1Value: ClientDataStep1ValueType) => {
		updateBookingProcessData(step1Value, CREATING_STEPS.STEP_1);
		updateProcessStep(STEP_INDEX.STEP_2);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onHandleNextStep)}>
				<Stack gap={10}>
					<Stack gap={2}>
						<Control
							control={CONTROL_TYPE.INPUT}
							id='firstName'
							name='firstName'
							label={t('create_client_modal:form_data.first_name.label')}
						/>
						<Control
							control={CONTROL_TYPE.INPUT}
							id='lastName'
							name='lastName'
							label={t('create_client_modal:form_data.last_name.label')}
						/>
					</Stack>
					<Button sx={{ alignSelf: 'flex-end' }} type='submit' variant='contained'>
						{t('common:continue')}
					</Button>
				</Stack>
			</form>
		</FormProvider>
	);
};

export default CreateClientStep1;
