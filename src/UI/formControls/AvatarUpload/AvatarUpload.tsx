import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectCurrAvatarUrl, selectMyUid } from '../../../Redux/account/account-selectors';
import { RegistrationFieldValues } from '../../../components/Registration/Registration';
import classes from './AvatarUpload.module.scss';
import { sendMyCurrentAvatar } from '../../../Redux/account/account-reducer';
import { AppDispatchType, useAppDispatch } from '../../../Redux/store';
import { Modal } from '../../Modal';
import AvatarEdit from 'react-avatar-edit';
import { SaveBtn } from '../../../components/Registration/SaveBtn';
import { CloseBtn } from '../../CloseBtn';
import { dataURItoBlob } from '../../../utils/helpers/converters';
import { Avatar } from '@mui/joy';
import Preloader from '../../Preloader/Preloader';
import { ReturnBtn } from '../../../components/Registration/ReturnBtn';
import { UserAvatar } from '../../UserAvatar';
import { getFileReader } from '../../../utils/helpers/getFileReader';

//TODO:
//Add new avatar cropping

type PropsType = {
	name?: string,
	surname?: string,
	setSelectedFile: (f: File | Blob) => void,
	selectedFile: File | Blob | null,
	existingAvatarUrl?: string,
	size?: number,
};

function stringToColor(string: string) {
	let hash = 0;
	let i;
 
	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
	  hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
 
	let color = '#';
 
	for (i = 0; i < 3; i += 1) {
	  const value = (hash >> (i * 8)) & 0xff;
	  color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */
 
	return color;
}


export const AvatarUpload: React.FC<PropsType> = ({ name, surname, setSelectedFile, selectedFile, size, existingAvatarUrl }) => {
	const [isCutting, setIsCutting] = useState<boolean>(false);
	const [localImgSrc, setLocalImgSrc] = useState<string | undefined>(existingAvatarUrl);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const avatarUrl = useSelector(selectCurrAvatarUrl);

	const dispatch: AppDispatchType = useAppDispatch();
	const uid = useSelector(selectMyUid);

	useEffect(() => {
		if(avatarUrl) {
			setIsLoading(false);
		}
	}, [avatarUrl]);

	//when user selected file
	const inputChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {

		//TODO:
		//it's in other paart of component (avatr cut)
		//треба отримати шлях до обраного зображення

		if (e.target.files && e.target.files.length > 0) {
			const currFile = e.target.files[0];

			console.log('curr file', currFile);

			//check if file is too big -> stop
			// if(currFile && currFile.size > 71680){
			// 	alert("File is too big!");
			// 	e.target.value = "";
			// 	return;
			// } else {
				
			// }

			setSelectedFile(currFile)
		 }
	}

	useEffect(() => {
		//its for cropping image
		if(selectedFile) {
			const reader = getFileReader(selectedFile);
			reader.addEventListener('load',  () => {
				setLocalImgSrc(reader.result as string);
				setIsCutting(true);
			})
		}
	}, [selectedFile])
 
	//очистити все
	const close = () => {
		setIsCutting(false);
		setLocalImgSrc(undefined);
	}

	// надіслати файл на сервер
	// const save = () => {
	// 	if(localImgSrc) {
	// 		const blob = dataURItoBlob(localImgSrc);
	// 		if(uid && blob) {
	// 			dispatch(sendMyCurrentAvatar(blob, uid));
	// 		}
	// 	}
	// 	close();
	// }

	//зберегти проміжкову версію кропу
	// const onCrop = (preview: string) => {
	// 	console.log('preview', preview);
	// 	setLocalImgSrc(preview);
	// }

	return (
		<div 
			className={classes.AvatarUpload}
			style={{
				width: `${size || 100}px`,
				height: `${size || 100}px`,
			}}
		>
			{!isLoading ?
				<UserAvatar 
					src={localImgSrc}
					fullName={`${name} ${surname}`}
					className={classes.userAvatar}
				/>
			: 
				<Preloader />
			}
			<div className={classes.addAvatar}>
				<label htmlFor='avatar' className={classes.label}>
					<div className={classes.addIcon}></div>
				</label>
				<input 
					type={'file'}
					id='avatar' 
					//accept="image/png, image/gif, image/jpg" 
					className={classes.input}
					onChange={inputChangeHandler}
					//{...register('avatar')}
				/>
			</div>      
		</div>
	)
}

 