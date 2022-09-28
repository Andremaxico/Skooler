import React, { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin } from 'antd';
import { AccountDataType, ReceivedAccountDataType, SchoolInfoType, SchoolSearchItemType } from '../../../utils/types';
import classes from './AccountForm.module.scss';
import { searchSchool as searchSchools, sendMyAccountData } from '../../../Redux/account/account-reducer';
import TextArea from 'antd/lib/input/TextArea';
import { authAPI } from '../../../api/authApi';
import { useAppDispatch } from '../../../Redux/store';
import moment from 'moment';
import { InitialInput } from './InitialInput';
import { AvatarUpload } from './AvatarUpload';
import { UploadAvatarInfoType } from './AvatarUpload/AvatarUpload';
import { addZero } from '../../../utils/helpers/formatters';
import { sassNull } from 'sass';

type PropsType = {
	accountData: ReceivedAccountDataType | null,
	setIsEdit: (value: boolean) => void,
};
 
type SchoolDefaultValueType = ((SchoolInfoType | SchoolSearchItemType | undefined) & SchoolSearchItemType) | undefined;

export type FieldValues = AccountDataType & {
	school: SchoolSearchItemType,
	birthDate: any,
};

type SchoolSelectItemType = {
	disabled: boolean,
	label: string,
	value?: string,
}

export const AccountForm: React.FC<PropsType> = React.memo(({accountData, setIsEdit}) => {
	console.log('form', accountData);
	let defaultBirthDateValue = null;
	let defaultSchoolValue: SchoolSearchItemType | null = null;

	//форматовані дані для початкових значень деяких інпутів
	if(accountData) {
		const { date, months, years } = accountData?.birthDate;
		console.log('bitrh date', `${date}-${months}-${years}`);

		if(date && months && years) {
			defaultBirthDateValue = moment(`${addZero(years)}-${addZero(months)}-${addZero(date)}`);
		}  

		//
		const baseSchoolString = `${accountData?.school.institution_name} (${accountData?.school.institution_id})`;
		defaultSchoolValue = {
			id: Number(accountData?.school.institution_id),
			key: baseSchoolString,
			name: baseSchoolString,
			value: baseSchoolString,
		}
	}

	//use Form
   const { 
	  register, handleSubmit, watch, formState: {errors},
	  control, setValue,
	} = useForm<FieldValues>();

	//prealoder під час відправки запиту
	const [isSending, setIsSending] = useState<boolean>(false)

	//preloader для відображення, під час запиту на сервер
	const [fetching, setFetching] = useState<boolean>(false);

	//список для select
	const [schoolsSearchList, setSchoolsSearchList] = useState<SchoolSelectItemType[]>([]);

	const classesNums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	//це треба
	const fetchRef = useRef(0);

	const dispatch = useAppDispatch();

	//коли форма субітиться -> дані в staте -> дані на сервер
	const onSubmit = async (accountData: FieldValues) => {
		console.log('send data', accountData);

		setIsSending(true);
		await dispatch(sendMyAccountData(accountData));
		//await dispatch(setMySchool(Number(id)));
		setIsSending(false);
		setIsEdit(false);
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

	console.log('errors', errors);

	return (
		// onFinish == onSubmit
		<>
			<h2>Змінити дані профілю</h2>
			<Form 
				onFinish={handleSubmit(onSubmit)} className={classes.AccountForm}
			>
				{/* name & surname */}
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className={classes.initialsInputs}>
					<Col span={12}>
						{/* Input name */}
						<InitialInput 
							control={control} initValue={accountData?.name || null} label="Ім'я" 
							name='name'
						/>
					</Col>
					<Col span={12}>
						{/* Input surname */}
						<InitialInput 
							control={control} name='surname' label='Прізвище'
							initValue={accountData?.surname || null}
						/>
					</Col>
				</Row>

				{/* select schoold and class  */}
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
								defaultValue={defaultSchoolValue as SchoolSearchItemType}
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
								defaultValue={accountData?.class}
								rules={{required: 'Оберіть ваш клас'}}
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
					defaultValue={defaultBirthDateValue}

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
				<Form.Item className={classes.avatarUpload}>
					<AvatarUpload 
						setValue={setValue} name='avatar' 
						control={control} avatarUrl={accountData?.avatarUrl || null}
					/>
				</Form.Item>
				<Form.Item className={classes.aboutMe}>
					<Controller 
						name='aboutMe'
						control={control}
						defaultValue={accountData?.aboutMe}
						render={({field: {onChange, value}}) => (
							<TextArea
								showCount maxLength={250} onChange={onChange}
								className={classes.textareaWrap} value={value as string | number | readonly string[] | undefined}
								placeholder='Напишіть про себе...'
							/>
						)}
					/>
				</Form.Item>
				<Button htmlType='submit'>
					Зберегти
				</Button>
			</Form>
		</>	
	);

});