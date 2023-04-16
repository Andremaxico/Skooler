import { Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { Controller, Path } from 'react-hook-form';

type PropsType<FieldValues> = {
	placeholder: string,
	name: Path<FieldValues>,
	control: any,
	maxLength: number,
	className: string,
	defaultValue?: any,
}

export function About<FieldValues>({
	placeholder, maxLength = 100, control, name, className, defaultValue
}: PropsType<FieldValues>): JSX.Element {
	return (
		<Controller 
			control={control}
			name={name}
			defaultValue={defaultValue || null}
			render={({field: {onChange, value}}) => (
				<Form.Item
					initialValue={defaultValue || null}
					className={className}
				>
					<TextArea
						showCount maxLength={maxLength}
						placeholder={placeholder}
						onChange={onChange} 
						value={value as string | number | readonly string[] | undefined}
					/>
				</Form.Item>
			)}
		/>
	)
}
