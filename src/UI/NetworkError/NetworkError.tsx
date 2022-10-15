import React from 'react';
import { Typography } from 'antd';
import classes from './NetworkError.module.scss';

const { Text } = Typography;

type PropsType = {
	message: string,
};

export const NetworkError: React.FC<PropsType> = ({message}) => {
	console.log('network error render');
	return (
		<div className={classes.NetworkError}>
			<Text className={classes.message}>{message}</Text>
		</div>
	)
}
