import React, { ChangeEvent, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import type { SelectProps, DefaultOptionType } from 'antd/es/select';
import { schoolsAPI } from '../../../api/schoolsApi';
import { AccountDataType, SchoolSearchItemType } from '../../../utils/types';
import { debounce } from 'lodash';
import classes from './AccountForm.module.scss';
import { searchSchool as searchSchools } from '../../../Redux/account/account-reducer';
import { Option } from 'antd/lib/mentions';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

type PropsType = {};

type FormFieldsType = {
	school: string,
}

type SchoolSelectItemType = {
	label: string,
	value?: string,
}

export const AccountForm: React.FC<PropsType> = ({}) => {
   const { 
	  register, handleSubmit, watch, formState: {errors},
	  control, setValue,
	} = useForm<FormFieldsType & AccountDataType>({});

	//preloader для відображення, під час запиту на сервер
	const [fetching, setFetching] = useState(false);

	const [currSchoolData, setCurrSchoolData] = useState<SchoolSearchItemType[]>([]);

	//список для select
	const [schoolsSearchList, setSchoolsSearchList] = useState<SchoolSelectItemType[]>([]);

	const classesNums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	//це треба
	const fetchRef = useRef(0);

	//коли форма субітиться -> дані в staте
	const onSubmit = (data: FormFieldsType) => {
		console.log('data', data);
	}
	
	console.log('errors', errors);

	const debounceFetcher = useMemo(() => {
		const loadOptions = (value: string) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;

			setSchoolsSearchList([]);

			setFetching(true);

			//отримати дані із серверу
			searchSchools(value).then((newOptions: SchoolSearchItemType[]) => {
				if (fetchId !== fetchRef.current) {
					// for fetch callback order
					return;
				}

				//фідформатувати результат для options
				const schoolsList: SchoolSelectItemType[] = newOptions.map(school => {
					return {
						label: school.name,
						value: `${school.name} (${school.id})`,
					}
				});
				setSchoolsSearchList(schoolsList);
				setFetching(false);
			});
		};
		return loadOptions;
	}, []);

	return (
		// onFinish == onSubmit
		<Form onFinish={handleSubmit(onSubmit)} className={classes.AccountForm}>
			{/* name & surname */}
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={classes.nsInputs}>
				<Col span={12}>
					{/* Input name */}
					<Controller 
						name='name'
						control={control}
						rules={{
							required: `Ім'я є обов'язковим`,
							minLength: {value: 2, message: "Ім'я не може бути однією буквою"},
							maxLength: {value: 25, message: "Ім'я занадто довге, скоротіть, будь ласка"},
						}}
						render={({field: {onChange, value}}) => (
							<Form.Item
								name="name"
								rules={[
									{required: true, message: `Ім'я є обов'язковим`},
									{min: 2, message: "Ім'я не може бути однією буквою"},
									{max: 25, message: "Ім'я занадто довге, скоротіть, будь ласка"},
								]}
							>
								<Input 
									placeholder="Ім'я" onChange={onChange} value={value}
									className={classes.input} type='text'
								/>
							</Form.Item>
						)}
					/>
				</Col>
				<Col span={12}>
					{/* Input surname */}
					<Controller 
						name='surname'
						control={control}
						rules={{
							required: `Ім'я є обов'язковим`,
							minLength: {value: 2, message: "Ім'я не може бути однією буквою"},
							maxLength: {value: 25, message: "Ім'я занадто довге, скоротіть, будь ласка"},
						}}
						render={({field: {onChange, value}}) => (
							<Form.Item
								name="sername"
								rules={[
									{required: true, message: `Прізвище є обов'язковим`},
									{min: 2, message: "Прізвище не може бути однією буквою"},
									{max: 25, message: "Прізвище занадто довге, скоротіть, будь ласка"},
								]}
							>
								<Input 
									placeholder="Прізвище" onChange={onChange} value={value}
									className={classes.input} type='text'
								/>
							</Form.Item>
						)}
					/>
				</Col>
			</Row>

			<div className={classes.schoolInfo}>
				{/* select school(input -> fetcht to server -> options) */}
				<Form.Item >
					<Controller 
						name='school'
						control={control}
						rules={
							{required: 'Оберіть школу!'}
						}
						render={({field: {onChange, value}}) => (
							<Select
								onChange={(value: string) => {
									setValue('school', value);
								}}
								value={value}
								labelInValue
								filterOption={false}
								onSearch={debounceFetcher}
								placeholder="Знайти навчальний заклад"	
								showSearch
								notFoundContent={fetching ? <Spin size="small" /> : null}
								options={schoolsSearchList}
								className={classes.selectSchool}
							/>
						)}
					/>
				</Form.Item>
				{/* select class */}
				<Form.Item >
					<Controller
						name='class'
						control={control}
						rules={
							{required: 'Chio!'}
						}
							render={({field: {onChange, value}}) => (
							<Select
								placeholder='Ваш клас' className={classes.selectClass}
								style={{ width: 120 }} onChange={onChange} value={value}
							>
								{classesNums.map(num => {
									return <Select.Option value={num as unknown as string}>{num}</Select.Option>
								})}
							</Select>
						)}
					/>
				</Form.Item>
			</div>
			{/* select birth date */}
			<Form.Item>
        		<DatePicker placeholder='Дата народження' />
      	</Form.Item>
			<Button htmlType='submit'>Submit</Button>
		</Form>	
	);

}