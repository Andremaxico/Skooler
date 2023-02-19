import { FormControl, IconButton, TextField } from '@mui/joy';
import React, { useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import classes from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '../../../Redux/store';
import { getPostsByQuery, searchShowingStatusChanged } from '../../../Redux/stream/stream-reducer';
import { useSelector } from 'react-redux';
import { selectIsSearchShowing } from '../../../Redux/stream/stream-selectors';
import cn from 'classnames';
import { QuestionCategoriesType } from '../../../utils/types';
import { CategoriesSelect } from '../../../UI/CategoriesSelect';

type PropsType = {
	setIsLoading: (value: boolean) => void
};

type FieldsValues = {
	query: string,
	category: QuestionCategoriesType,
}

export const Search: React.FC<PropsType> = ({setIsLoading}) => {
	const { control, handleSubmit, formState: {errors}, reset } = useForm<FieldsValues>();

	const isShow = useSelector(selectIsSearchShowing);

	const formRef = useRef<HTMLFormElement>(null);

	const dispatch = useAppDispatch();
	const onSubmit = async (data: FieldsValues) => {
		dispatch(searchShowingStatusChanged(false));
		setIsLoading(true);
		await dispatch(getPostsByQuery(data.query, data.category));
		setIsLoading(false); 
	}

	const fieldWrapRef = useRef<HTMLDivElement>(null);
	let inputEl: HTMLInputElement | null = null;

	useEffect(() => {
		inputEl = fieldWrapRef.current?.querySelector('input') || null;
	}, [fieldWrapRef]);
	
	useEffect(() => {
		if(inputEl && isShow) {
			inputEl.focus();
		}
	}, [inputEl, isShow]);

	useEffect(() => {
		if(!isShow) {
			reset();
		}
	}, [isShow])

	//when click anywhere
	const handleAreaClick = (e: React.MouseEvent) => {
		const isEmptyArea = (e.target as Element).closest('form') != formRef.current; 

		if(isEmptyArea) {
			//clear form
			//if(inputEl) inputEl.value = '';
			console.log('clear');
			//reset();
			//close search
			//dispatch(searchShowingStatusChanged(false));
		}
	}	

	return (
		<div className={cn(classes.Search, isShow ? classes._show : '')} onClick={handleAreaClick}>
			<form className={classes.form} ref={formRef} onSubmit={handleSubmit(onSubmit)}>
				<Controller 
					control={control}
					defaultValue={''}
					name='query'
					render={({field: {onChange, value}}) => (
						<FormControl>
							<TextField 
								value={value}
								onChange={onChange}
								ref={fieldWrapRef}
								placeholder='Пошук...'
								className={classes.input}
								endDecorator={
									<IconButton type='submit'>
										<SearchIcon />
									</IconButton>
								}
							/>
						</FormControl>
					)}
				/>
				<CategoriesSelect 
					control={control} 
					className={classes.categorySelect}
				/>
			</form>
		</div>
	)
}
