import { Form, Select } from 'antd'
import React from 'react'
import { Controller, Path } from 'react-hook-form'

type PropsType   = {
	className: string,
	extraClass?: string,
	placeholder: string,
	onChange: any,
	value: string | undefined,
	defaultValue?: string,
}

export function ClassSelect({
	className,  extraClass, placeholder, onChange, value, defaultValue
}: PropsType): JSX.Element {
	const classesNums: Array<number | string> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	let classesStrings = classesNums.map(num => `${num} клас`);

	if(extraClass) {
		classesStrings = [...classesStrings, extraClass];
	}

	return (
		<Select
			placeholder={placeholder} className={className}
			onChange={onChange} value={value} defaultValue={defaultValue}
		>
			{classesStrings.map(str => (
				<Select.Option key={str} value={str}>
					{str}
				</Select.Option>
			))}
		</Select>
	)
}

