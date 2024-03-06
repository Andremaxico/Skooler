import React, { useState } from 'react';
import classes from './Stream.module.scss';

import { Posts } from './Posts';
import { Search } from './Search';

type PropsType = {};

const Stream: React.FC<PropsType> = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	console.log('is loading', isLoading);

	return (
		<div className={classes.Stream}>
			<Search setIsLoading={setIsLoading} />
			<Posts isLoading={isLoading} />
			
		</div>
	)
}

export default Stream;
