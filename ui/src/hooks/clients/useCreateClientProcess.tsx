import { useCallback, useEffect } from 'react';
import {
	ClientDataStep1ValueType,
	createClientProcessStep1DefaultValue,
} from '@/components/Modal/CreateClient/CreateClientStep1';
import {
	ClientDataStep2ValueType,
	createClientProcessStep2DefaultValue,
} from '@/components/Modal/CreateClient/CreateClientStep2';
import { atom, useAtomValue } from 'jotai';
import { useImmerAtom } from 'jotai-immer';

export enum STEP_INDEX {
	STEP_1,
	STEP_2,
}

export const CREATING_STEPS = {
	STEP_1: 'step1',
	STEP_2: 'step2',
} as const;

type CreateClientProcessValueType = {
	processingStep: number;
	[CREATING_STEPS.STEP_1]: ClientDataStep1ValueType;
	[CREATING_STEPS.STEP_2]: ClientDataStep2ValueType;
};

const defaultValueProcess: CreateClientProcessValueType = {
	processingStep: 0,
	[CREATING_STEPS.STEP_1]: createClientProcessStep1DefaultValue,
	[CREATING_STEPS.STEP_2]: createClientProcessStep2DefaultValue,
} as const;

export const createClientProcessValueAtom = atom<CreateClientProcessValueType>(defaultValueProcess);

type AutoUpdateStepsType = {
	goTo: (index: number, fromIndex?: number) => void;
};

export const useAutoUpdateStep = ({ goTo }: AutoUpdateStepsType) => {
	const creatingProcessValue = useAtomValue(createClientProcessValueAtom);
	useEffect(() => {
		goTo(creatingProcessValue.processingStep);
	}, [creatingProcessValue.processingStep, goTo]);
};

export const useUpdateCreatingProcessData = (editData?: ClientType) => {
	const [creatingProcessValue, setCreatingProcessValue] = useImmerAtom(createClientProcessValueAtom);
	const restoreProcessValueToDefault = useCallback(() => {
		setCreatingProcessValue(() => defaultValueProcess);
	}, [setCreatingProcessValue]);

	const updateProcessStep = (currentStepIndex: number) => {
		setCreatingProcessValue((draft) => {
			draft.processingStep = currentStepIndex;
		});
	};

	const updateBookingProcessData = <T extends (typeof CREATING_STEPS)[keyof typeof CREATING_STEPS]>(
		data: CreateClientProcessValueType[T],
		step: T
	) => {
		setCreatingProcessValue((draft) => {
			draft[step] = data;
		});
	};

	useEffect(() => {
		if (editData) {
			setCreatingProcessValue((draft) => {
				draft = {
					processingStep: 0,
					step1: {
						firstName: editData.firstName,
						lastName: editData.lastName,
					},
					step2: {
						email: editData.email,
						phoneNumber: editData.phoneNumber,
					},
				};
				return draft;
			});
		}
	}, [editData, restoreProcessValueToDefault, setCreatingProcessValue]);

	return { creatingProcessValue, restoreProcessValueToDefault, updateProcessStep, updateBookingProcessData };
};
