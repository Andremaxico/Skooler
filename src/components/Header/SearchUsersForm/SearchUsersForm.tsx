import React, { useEffect, useRef, useState } from 'react'
import classes from './SearchUsersForm.module.scss';
import { FormControl, FormHelperText, FormLabel, IconButton, Input } from '@mui/joy';
import cn from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import { ViewSidebar } from '@mui/icons-material';
import { useAppDispatch } from '../../../Redux/store';
import { searchUsersByFullname } from '../../../Redux/users/users-reducer';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { event } from 'firebase-functions/v1/analytics';

type PropsType = {
    closeForm: () => void,
};

type FormFieldsType = {
    searchTerm: string,
}

export const SearchUsersForm: React.FC<PropsType> = ({closeForm}) => {
    const { control, handleSubmit, formState: {errors} } = useForm<FormFieldsType>();

    //joy Ui provides <div> instead of <input />
    const inputRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();

    const onSubmit = async (data: FormFieldsType) => {
        console.log('navigate');
        navigate(`/searchUsers/${data.searchTerm}`);
    }

    const handleBlur = (e: React.FocusEvent) => {
        console.log(e.currentTarget, e.relatedTarget, e.currentTarget.contains(e.relatedTarget));
        if(!e.currentTarget.contains(e.relatedTarget)) {
            closeForm();
        }
    }

    useEffect(() => {
        console.log(inputRef.current);
        //joy Ui provides <div> instead of <input />
        const input = inputRef.current?.querySelector('input');
        if(input) {
            input.focus();
        }
    }, [inputRef]);
    
    return (
        <form 
            className={classes.form} 
            onSubmit={handleSubmit(onSubmit)}
            ref={formRef}
            onBlur={handleBlur}
        >
            <Controller
                name='searchTerm'
                control={control}
                rules={{
                    required: "Це поле є обовʼязковим",
                    maxLength: {value: 100, message: 'Максимум 100 символів'},
                    pattern: {value: /[А-Яа-я]+[^\w]/, message: 'У полі мають бути тільки українські літери'}
                }}
                render={({field: { value, onChange }}) => (
                    <FormControl>
                        <Input
                            value={value}
                            onChange={onChange}
                            error={!!errors.searchTerm}
                            placeholder='Пошук користувачів'
                            className={cn('input', classes.input)}
                            endDecorator={
                                <button 
                                    type='submit' 
                                    className={classes.submitBtn} 
                                    ref={submitBtnRef}
                                >
                                    <PersonSearchIcon className={classes.icon} />
                                </button>
                            }
                            ref={inputRef}
                        />
                        {errors.searchTerm &&
                            <FormHelperText className={'fieldErrorText'}>{errors.searchTerm.message}</FormHelperText>
                        }
                    </FormControl>
                )}
            />
        </form>
    )
}
