import { Form, Input } from 'antd'
import React from 'react'
import { Controller } from 'react-hook-form'

type PropsType = {
	name: string,
	control: any,
	initValue: string | null,
	label: string,
}

export const InitialInput: React.FC<PropsType> = ({
	name, control, initValue, label, ...rest
}) => {
	console.log('initials input', name, label);


	return (
		<Controller 
			name={name}
			control={control}
			defaultValue={initValue || ''}
			rules={{
				required: `${label} є обов'яковим`,
				minLength: {value: 2, message: `${label} не може бути однією буквою`},
				maxLength: {value: 25, message: `${label} занадто довге, скоротіть, будь ласка`},
			}}
			render={({field: {onChange, value}}) => (
				<Form.Item
					name={name}
					rules={[
						{required: true, message: `${label} є обов'язковим`},
						{min: 2, message: `${label} не може бути однією буквою`},
						{max: 25, message: `${label} занадто довге, скоротіть, будь ласка`},
					]}
					initialValue={initValue || ''}
				>
					<Input 
						placeholder={label} onChange={onChange} value={value}
						{...rest} type='text'
					/>
				</Form.Item>
			)}
		/>
	)
}
