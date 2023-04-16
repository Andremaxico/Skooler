import { div, Textarea } from '@mui/joy';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from '../../Modal';
import classes from './ChangePostModal.module.scss';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

type PropsType = {
	isShow: boolean,
	prevText: string,
	target: 'питання' | 'відповідь',
	changeP: (text: string) => void,
	cancel: () => void,
};
type FieldValues = {
	text: string,
}

export const ChangePostModal: React.FC<PropsType> = ({isShow, changeP, cancel, prevText, target}) => {
	const { control, handleSubmit, reset, formState: {errors}, setValue } = useForm<FieldValues>();

	const onSubmit = (data: FieldValues	) => {
		changeP(data.text);
		reset();
	}

	const handleClose = () => {
		cancel();
		reset();
	}

	useEffect(() => {
		setValue('text', prevText);
	}, [prevText])

	return (
		<Modal isShow={isShow}>   
			<div className={classes.ChangePost}>
				<h3 className={classes.title}>Редагувати {target}</h3>
				<form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
					<Controller 
						control={control}
						defaultValue={prevText}
						rules={{
							minLength: {value: 3, message: 'Тект повинен містити хоча б 3 символи'}
						}}
						name='text'
						render={({field: {onChange, value}}) => (
							<Textarea 
								error={!!errors.text}
								value={value}
								onChange={onChange}
								className={classes.textarea}
								placeholder='Новий текст'
								endDecorator={
									<div className={classes.buttons}>
										<div className={classes.cancelBtn} onClick={handleClose}>
											<CloseIcon />
										</div>
										<div className={classes.submitBtn} type='submit'>
											<DoneIcon />
										</div>
									</div>
								}
							/>
						)}
					/>
				</form>
			</div>
		</Modal>
	)
}
