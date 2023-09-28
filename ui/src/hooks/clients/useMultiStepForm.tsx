import { ReactElement, useState, useMemo, useCallback } from 'react';

type MultiStepFormType = {
	component: ReactElement;
};

function useMultiStepForm(steps: MultiStepFormType[]) {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [fromGoto, setFromGoto] = useState<number | null>(null);

	function next() {
		if (fromGoto) {
			setCurrentStepIndex(fromGoto);
			setFromGoto(null);
		} else {
			setCurrentStepIndex((i) => {
				if (i >= steps.length - 1) return i;
				return i + 1;
			});
		}
	}

	function back() {
		if (fromGoto) {
			setCurrentStepIndex(fromGoto);
			setFromGoto(null);
		} else {
			setCurrentStepIndex((i) => {
				if (i <= 0) return i;
				return i - 1;
			});
		}
	}

	const goTo = useCallback((index: number, fromIndex?: number) => {
		setCurrentStepIndex(index);
		setFromGoto(fromIndex ?? null);
	}, []);

	const percentageProgress = useMemo(
		() => Math.round(((currentStepIndex + 1) * 100) / steps.length),
		[currentStepIndex, steps]
	);

	return {
		currentStepIndex,
		step: steps[currentStepIndex].component,
		steps,
		totalSteps: steps.length,
		isFirstStep: currentStepIndex === 0,
		isLastStep: currentStepIndex === steps.length - 1,
		goTo,
		next,
		back,
		percentageProgress,
	} as const;
}

export default useMultiStepForm;
