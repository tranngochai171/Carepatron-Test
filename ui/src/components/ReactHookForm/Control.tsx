import Input, { InputProps } from './Input';
import Phone, { PhoneProps } from './Phone';

export const CONTROL_TYPE = {
	INPUT: 'input',
	PHONE: 'phone',
} as const;

type Props =
	| ({
			control: typeof CONTROL_TYPE.INPUT;
	  } & InputProps)
	| ({ control: typeof CONTROL_TYPE.PHONE } & PhoneProps);

const Control = (props: Props) => {
	const { control, ...rest } = props;
	switch (control) {
		case CONTROL_TYPE.INPUT:
			return <Input {...(rest as InputProps)} />;
		case CONTROL_TYPE.PHONE:
			return <Phone {...(rest as PhoneProps)} />;
		default:
			return null;
	}
};
export default Control;
