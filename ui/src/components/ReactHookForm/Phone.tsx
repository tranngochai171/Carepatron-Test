import { ComponentPropsWithoutRef } from 'react';
import { MuiTelInput } from 'mui-tel-input';
import { Controller, useFormContext } from 'react-hook-form';

export type PhoneProps = ComponentPropsWithoutRef<typeof MuiTelInput> & { name: string; label: string };

const DEFAULT_COUNTRY = 'NZ';

const Phone = (props: PhoneProps) => {
	const { name, label, ...rest } = props;
	const { control } = useFormContext();
	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange, onBlur, value }, fieldState: { invalid, error } }) => {
				return (
					<MuiTelInput
						fullWidth
						value={value}
						label={label}
						inputProps={{
							onBlur,
						}}
						onChange={(value: string) => {
							onChange(value);
						}}
						defaultCountry={DEFAULT_COUNTRY}
						error={Boolean(invalid)}
						helperText={error?.message}
						disableFormatting
						{...rest}
					/>
				);
			}}
		/>
	);
};

export default Phone;
