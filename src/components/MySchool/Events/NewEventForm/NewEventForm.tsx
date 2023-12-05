import { Row, Col, Input, Form, Button, Select, DatePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { sendNewEvent } from '../../../../Redux/mySchool/school-reducer';
import { useAppDispatch } from '../../../../Redux/store';
import { dateFromMoment } from '../../../../utils/helpers/converters';
import classes from './NewEventForm.module.scss';
import { v1 } from 'uuid';
import { ControlOutlined } from '@ant-design/icons';

type PropsType = {
	onSave: () => void,
};
type FieldsValues = {
	title: string,
	leading: string,
	date: moment.Moment,
	about: string
};

const getTommorowDate = () => {
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1);
	return tomorrow;
}

export const NewEventForm: React.FC<PropsType> = ({onSave}) => {
	const { register, formState: { errors }, control, handleSubmit, setValue } = useForm<FieldsValues>();

	const tomorrowMoment = moment(getTommorowDate());
	
	const dispatch = useAppDispatch();

	const onSubmit = async (data: FieldsValues) => {
		//conver moment -> date
		await dispatch(sendNewEvent({...data, date: dateFromMoment(data.date), id: v1()}));
		onSave();
	}

	return (
		<Form onFinish={handleSubmit(onSubmit)} className={classes.NewEventForm}>
			<Row>
				{/* title */}
				<Col>
				{/* @ts-ignore   */}
					<Controller 
						name='title'
						control={control}	
						rules={{
							required: 'required',
							minLength: {value: 1, message: `Назва занадто коротка`},
							maxLength: {value: 50, message: `Назва занадто довга`},
						}}
						render={({field: {onChange, value}}) => (
							<Form.Item
								name='title'
								rules={[
									{required: true, message: `Назва є обов'язковою`},
									{min: 1, message: `Назва занадто коротка`},
									{max: 50, message: `Назва занадто довга`},
								]}
							>
								<Input 
									placeholder='Назва події' onChange={onChange} value={value}
									className={classes.input}
								/>
							</Form.Item>
						)}			 
					/> 
				</Col>
				{/* leading(хто проводить) */}
				{/* <Col>
					<Controller 
						name='leading'
						defaultValue={'усі'}
						control={control}
						render={({field: {onChange, value}}) => (
							<Form.Item
								name={'leading'}
								initialValue={'усі'}
							>
								<ClassSelect
									onChange={onChange} value={value}
									extraClass='усі'
									placeholder='Хто проводить'
									className={classes.leading}
								/>
							</Form.Item>
						)}
					/>
				</Col> */}
				{/* Дата проведення */}
 				<Col>
					{/* <Controller 
						name='date'
						control={control}
						defaultValue={tomorrowMoment}

						rules={{
							required: `Дата проведення ж обов'язковою`
						}}

						render={({field: {onChange, value}}) => (
							<Form.Item
								initialValue={tomorrowMoment}
								name='date'
								rules={[
									{required: true, message: `Дата проведення ж обов'язковою`}
								]}
							>
								<DatePicker
									placeholder='Дата проведення' value={value}
									onChange={(value: moment.Moment | null): void => {
										if(value) {
											setValue('date', value);
										}	
									}}
								/>
							</Form.Item>
						)}
					/> */}
				</Col>
			</Row>

			{/* <About<FieldsValues>
				// @ts-ignore
				control={control}
				name='about'
				className={classes.about}
				maxLength={350}
				placeholder='Про подію'
			/> */}
			<Button htmlType='submit'>Зберегти подію</Button>
		</Form>
	)
}
