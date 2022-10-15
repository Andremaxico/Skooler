import React, { useState } from 'react';
import { Events } from './Events';
import classes from './MySchool.module.scss';
import { Pupils } from './Pupils';

type PropsType = {};

const MySchool: React.FC<PropsType> = ({}) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(true);

	return (
		<div className={classes.MySchool}>
			<Events isAdmin={isAdmin}/>  
			<Pupils />
		</div>
	)
}

export default MySchool