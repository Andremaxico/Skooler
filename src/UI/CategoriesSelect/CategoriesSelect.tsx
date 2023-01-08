import { FormControl } from '@mui/joy';
import Autocomplete from '@mui/joy/Autocomplete';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectQuesionsCategories } from '../../Redux/stream/stream-selectors';
import { QuestionCategoriesType } from '../../utils/types';

type PropsType = {
	control: Control<object extends { category: QuestionCategoriesType } ? any : any>,
	className?: string, 
}

export const CategoriesSelect: React.FC<PropsType> = React.forwardRef(({control, className}, fieldWrapRef) => {
	const categories = useSelector(selectQuesionsCategories);

	return (
		<Controller 
			control={control}
			name='category'
			defaultValue={''}
			rules={{
				required: 'Оберіть категорію'
			}}
			render={({field: {value, onChange}}) => (
				<FormControl className={className}>
					<Autocomplete
						placeholder='Категорія'
						value={value}
						onSelect={onChange}
						options={categories}
						required
					/>
				</FormControl>
			)}
		/>
	)
});
