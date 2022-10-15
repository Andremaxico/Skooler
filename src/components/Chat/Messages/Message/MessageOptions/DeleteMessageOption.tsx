import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

type PropsType = {
	showDeleteConfirm: (messageId: string) => void,
	className: string,
	messageId: string,
}

export const DeleteMessageOption: React.FC<PropsType> = ({showDeleteConfirm, className, messageId}) => {
	return (
		<Text 
			onClick={() => showDeleteConfirm(messageId)}
			type='danger' className={className}
		>Видалити</Text>
	)
};