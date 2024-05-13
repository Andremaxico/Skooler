import React from 'react';
import classes from './ErrorBanner.module.scss';
import { Button } from '@mui/joy';
import { useAppDispatch } from '../../Redux/store';
import { globalErrorStateChanged } from '../../Redux/app/appReducer';

type PropsType = {};

export const ErrorBanner: React.FC<PropsType> = () => {

    const dispatch = useAppDispatch();
    const handleOkBtnClick = () => {
        dispatch(globalErrorStateChanged(false));
    }

    return (
        <div className={classes.ErrorBanner}>
            <div className={classes.content}>
                <div className={classes.title}>Помилка</div>
                <p className={classes.text}>Щось пішло не так</p>
                <div className={classes.buttons}>
                    <Button
                        color='danger'
                        className={classes.btn}
                        onClick={handleOkBtnClick}
                    >
                        Гаразд
                    </Button>
                </div>
            </div>
            <div className={classes.closeLayer}></div>
        </div>
    )
}
