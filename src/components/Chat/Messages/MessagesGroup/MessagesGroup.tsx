import React from 'react'


type PropsType = {
	metadata: any,
	listRef: React.RefObject<HTMLDivElement>,
	children: JSX.Element[],
}

export type MessagesGroupMetadataType = {};

export const MessagesGroup: React.FC<PropsType> = ({metadata, children, listRef}) => {
	return (
		<div>
			{children}
		</div>
	)
}
