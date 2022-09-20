import React, { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import { AccountDataType, SchoolSearchItemType } from '../../../utils/types';
import classes from './AccountForm.module.scss';
import { searchSchool as searchSchools, sendMyAccountData } from '../../../Redux/account/account-reducer';
import TextArea from 'antd/lib/input/TextArea';
import { authAPI } from '../../../api/authApi';
import { useAppDispatch } from '../../../Redux/store';

type PropsType = {
	accountData: AccountDataType,
};
 

type FieldValues = AccountDataType & {
	school: string,
	birthDate: moment.Moment | null,
}

type BirthDateExtenderType = {
	birthDate: moment.Moment | null,
}

type SchoolSelectItemType = {
	disabled: boolean,
	label: string,
	value?: string,
}

export const AccountForm: React.FC<PropsType> = ({accountData}) => {
   const { 
	  register, handleSubmit, watch, formState: {errors},
	  control, setValue,
	} = useForm<FieldValues>({
		defaultValues: accountData
	});

	//preloader для відображення, під час запиту на сервер
	const [fetching, setFetching] = useState(false);

	//список для select
	const [schoolsSearchList, setSchoolsSearchList] = useState<SchoolSelectItemType[]>([]);

	const classesNums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	//це треба
	const fetchRef = useRef(0);

	const dispatch = useAppDispatch();
	//коли форма субітиться -> дані в staте -> дані на сервер
	const onSubmit = (data: FieldValues) => {
		dispatch(sendMyAccountData(data));
	}

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
						disabled: false,
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

			<Row className={classes.schoolInfo} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				{/* select school(input -> fetcht to server -> options) */}
				<Col span={15}>
					<Form.Item >
						<Controller 
							name='school'
							control={control}
							rules={
								{required: 'Оберіть школу!'}
							}
							render={({field: {onChange, value}}) => (
								<Select
									onChange={onChange}
									disabled={false}
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
				</Col>
				{/* select class */}
				<Col span={3}>
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
										return <Select.Option key={num} value={num as unknown as string}>{num}</Select.Option>
									})}
								</Select>
							)}
						/>
					</Form.Item>
				</Col>
			</Row>
			{/* select birth date */}
									
			<Controller 
				name='birthDate'
				control={control}
				
				render={({field: {onChange, value}}) => (
					<Form.Item>
						<DatePicker 
							placeholder='Дата народження' value={value}
							onChange={(value: moment.Moment | null): void => {
								setValue('birthDate', value);
						  }}
						/>
					</Form.Item>
				)}
			/>
			<Form.Item>
				<TextArea
					showCount maxLength={250}
					className={classes.textareaWrap}
					placeholder='Напишіть про себе...'
				/>
			</Form.Item>
			<Button htmlType='submit'>Submit</Button>
		</Form>	
	);

}