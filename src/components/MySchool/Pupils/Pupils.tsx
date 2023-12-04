import { Col, Row } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setCurrClassPupils, setMySchoolPupils } from '../../../Redux/mySchool/school-reducer';
import { selectMySchoolPupils, selectCurrClassPupils } from '../../../Redux/mySchool/school-selectors';
import { useAppDispatch } from '../../../Redux/store';
import Preloader from '../../../UI/Preloader';
import { PupilCard } from './PupilCard';
import classes from './Pupils.module.scss';

type PropsType = {};

export const Pupils: React.FC<PropsType> = ({}) => {  
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const allPupilsValue = 'усі';

	const [selectedClass, setSelectedClass] = useState<string | undefined>(allPupilsValue);

	const currClassPupils = useSelector(selectCurrClassPupils);


	const handleClassChange = (value: string) => {
		setSelectedClass(value);
	}

	const dispatch = useAppDispatch(); 

	useEffect(() => {
		const fetchSchoolPupils = async () => {
			setIsFetching(true);
			await dispatch(setMySchoolPupils());
			await dispatch(setCurrClassPupils(null));
			setIsFetching(false);
		}
		fetchSchoolPupils();
	}, []);

	useEffect(() => {
		const getSelectedClassPupils = async () => {
			if(selectedClass) {
				setIsFetching(true);
				//якщо значення обраногог класу дорівнює "усі", то ми перелаємо null, щоб отримати усіх школярів
				let classValue: string | null = selectedClass !== allPupilsValue ? selectedClass : null;
				await dispatch(setCurrClassPupils(classValue));
				setIsFetching(false);
			}	
		}
		getSelectedClassPupils();
		console.log('curr class', selectedClass);
	}, [selectedClass]);

	let pupilsList: JSX.Element[] | null = null;

	if(currClassPupils && currClassPupils.length > 0) {
		pupilsList = currClassPupils.map(data => (
			<PupilCard data={data} key={data.uid}/>
		)) 
	}

	return (
		<div className={classes.Pupils}>
			<h2 className={classes.title}>Учні</h2>
			{/* <ClassSelect 
				className={classes.classSelect}
				placeholder='Клас' defaultValue={allPupilsValue}
				extraClass={allPupilsValue}
				onChange={handleClassChange} value={selectedClass}				
			/> */}
			<div className={classes.pupilsGrid}>
				{	isFetching && <Preloader /> 
					||
					pupilsList 
					||
					<div className={classes.noPupilsMessage}>Учнів не знайдено</div>
				}
			</div>	
		</div>
	)
}
