import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { CREATING_STEPS, STEP_INDEX, useUpdateCreatingProcessData } from '@/hooks/clients/useCreateClientProcess';
import Control, { CONTROL_TYPE } from '@/components/ReactHookForm/Control';
import yupValidationTest from '@/utils/yupValidationTest.util';
import { Stack, Button } from '@mui/material';
import { PayloadCreateUpdateClient, useCreateUpdateClient } from '@/hooks/clients/useClients';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NAME_SPACES } from '@/i18n/i18n';

const createSchema = (t: TFunction<['create_client_modal', 'common'], undefined>) =>
	Yup.object().shape({
		email: Yup.string()
			.transform((value) => value.trim())
			.email(t('create_client_modal:form_data.email.error.not_valid_email'))
			.required(t('create_client_modal:form_data.email.error.required')),
		phoneNumber: Yup.string()
			.required(t('create_client_modal:form_data.phone_number.error.required'))
			.test(
				yupValidationTest.IS_VALID_PHONE.NAME,
				yupValidationTest.IS_VALID_PHONE.MESSAGE,
				yupValidationTest.IS_VALID_PHONE.TEST
			),
	});

export type ClientDataStep2ValueType = Yup.InferType<ReturnType<typeof createSchema>>;

export const createClientProcessStep2DefaultValue: ClientDataStep2ValueType = {
	email: '',
	phoneNumber: '',
};

type Props = {
	onCloseModal: () => void;
	editData?: ClientType;
};

const CreateClientStep2 = ({ onCloseModal, editData }: Props) => {
	const { t } = useTranslation([NAME_SPACES.CREATE_CLIENT_MODAL, NAME_SPACES.COMMON]);
	const { creatingProcessValue, updateProcessStep, restoreProcessValueToDefault } = useUpdateCreatingProcessData();
	const { mutate: mutateCreateNewClient, isLoading } = useCreateUpdateClient();
	const methods = useForm({
		defaultValues: creatingProcessValue?.[CREATING_STEPS.STEP_2] ?? createClientProcessStep2DefaultValue,
		resolver: yupResolver(createSchema(t)),
	});
	const isEditing = !!editData;
	const onHandleCreateClient = (step2Value: ClientDataStep2ValueType) => {
		const payload: PayloadCreateUpdateClient = {
			isEditing,
			...creatingProcessValue[CREATING_STEPS.STEP_1],
			...step2Value,
			...(editData?.id ? { id: editData?.id } : {}),
		};
		mutateCreateNewClient(payload, {
			onSuccess: () => {
				restoreProcessValueToDefault();
				onCloseModal();
			},
		});
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onHandleCreateClient)}>
				<Stack gap={8}>
					<Stack gap={2}>
						<Control
							id='email'
							control={CONTROL_TYPE.INPUT}
							name='email'
							label={t('create_client_modal:form_data.email.label')}
						/>
						<Control
							id='phoneNumber'
							control={CONTROL_TYPE.PHONE}
							name='phoneNumber'
							label={t('create_client_modal:form_data.phone_number.label')}
							forceCallingCode
						/>
					</Stack>
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<Button
							onClick={() => updateProcessStep(STEP_INDEX.STEP_1)}
							type='button'
							startIcon={<ArrowBackIcon />}
						>
							{t('common:back')}
						</Button>
						<Button disabled={isLoading} type='submit' variant='contained'>
							{isEditing ? t('common:edit') : t('create_client_modal:create_client')}
						</Button>
					</Stack>
				</Stack>
			</form>
		</FormProvider>
	);
};

export default CreateClientStep2;
