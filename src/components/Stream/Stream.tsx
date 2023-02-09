import React, { useState } from 'react';
import classes from './Stream.module.scss';

import { Posts } from './Posts';
import { AddPost } from './AddPost';
import { Search } from './Search';
import { useSelector } from 'react-redux';
import { selectUserActionStatus } from '../../Redux/stream/stream-selectors';
import { ActionStatus } from '../../UI/ActionStatus';

type PropsType = {};

const Stream: React.FC<PropsType> = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const userAction = useSelector(selectUserActionStatus);

	console.log('userAction', userAction);

	return (
		<div className={classes.Stream}>
			<Search setIsLoading={setIsLoading} />
			<Posts isLoading={isLoading} />
		</div>
	)
}

export default Stream;
