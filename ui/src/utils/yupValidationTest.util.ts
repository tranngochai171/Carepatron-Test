import { matchIsValidTel } from 'mui-tel-input';

const yupValidationTest = {
	IS_VALID_PHONE: {
		NAME: 'is-valid-phone',
		MESSAGE: 'Phone number is not valid',
		TEST: (val: string) => matchIsValidTel(val),
	},
};

export default yupValidationTest;
