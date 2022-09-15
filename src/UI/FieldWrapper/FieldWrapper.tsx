import { Form, Input } from 'antd'
import { Rule } from 'antd/lib/form'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

type RuleType = {
	value: string | number | boolean,
	message: string,
}	

type PropsType = {
	control: Control,
	rules: Array<any>,
	name: string,
}

export const fieldWrapper = ({control, rules, name}: PropsType) => {
	//[{rule: value, memessage: '' }, {rule}] -> { rule: {value: value, message: ''}, rule }
	let controllerRules: {[key: string]: null | RuleType} = {};

	let rulesNames: Array<string> = [];
	let rulesValues: Array<RuleType> = [];

	//set rules names, rules values
	rules.forEach(rule => {
		const keys = Object.keys(rule);
		rulesNames.push(...keys);

		//{name: value, message: mes} -> push({value: value, messages: mes})
		const values: string[] = Object.values(rule);
		rulesValues.push({value: values[0], message: values[1]});
	});

	rulesNames.filter(name => name !== 'message').forEach((name, index) => {
		controllerRules[name] = rulesValues[index];
	});


	console.log('rules names', rulesNames, 'controller rules', controllerRules);

	function ContainerComponent <P>(Component: React.ComponentType<P>) {
		return (props: P) => (
			<Controller 
				name={name}
				control={control}
				rules={{
					required: `Ім'я є обов'язковим`,
					minLength: {value: 2, message: "Ім'я не може бути однією буквою"},
					maxLength: {value: 25, message: "Ім'я занадто довге, скоротіть, будь ласка"},
				}}
				render={({field: {onChange, value}}) => (
					<Form.Item
						name="surname"
						rules={[
							{required: true, message: `Прізвище є обов'язковим`},
							{min: 2, message: "Прізвище не може бути однією буквою"},
							{max: 25, message: "Прізвище занадто довге, скоротіть, будь ласка"},
						]}
					>
						<Component 
							{...props as P} onChange={onChange} value={value}
						/>
					</Form.Item>
				)}
			/>
		)
	}

	return ContainerComponent;
}
