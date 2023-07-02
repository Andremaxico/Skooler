import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectCurrAvatarUrl, selectMyUid } from '../../../../Redux/account/account-selectors';
import { RegistrationFieldValues } from '../../Registration';
import classes from './AvatarUpload.module.scss';
import { sendMyCurrentAvatar } from '../../../../Redux/account/account-reducer';
import { AppDispatchType, useAppDispatch } from '../../../../Redux/store';
import { Modal } from '../../../../UI/Modal';
import AvatarEdit from 'react-avatar-edit';
import { SaveBtn } from '../../SaveBtn';
import { CloseBtn } from '../../../../UI/CloseBtn';
import { dataURItoBlob } from '../../../../utils/helpers/converters';
import { Avatar } from '@mui/joy';
import Preloader from '../../../../UI/Preloader/Preloader';
import { ReturnBtn } from '../../ReturnBtn';
import { UserAvatar } from '../../../../UI/UserAvatar';

//TODO:
//Add new avatar cropping

type PropsType = {
	register: UseFormRegister<RegistrationFieldValues>,
	getValues: UseFormGetValues<RegistrationFieldValues>, 
	setValue: UseFormSetValue<RegistrationFieldValues>,
	errors: FieldErrors<RegistrationFieldValues>,
	submit: () => void,
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

const getLocalImgSrc = (
	setLocalImgSrc: (src: string) => void, 
	setIsCutting: (bool: boolean) => void,
	selectedFile: File | Blob,
) => {
	const reader = new FileReader();
	reader.addEventListener('load', async () => { 
		setLocalImgSrc(reader.result as string);
		setIsCutting(true);
	});
	reader.readAsDataURL(selectedFile);
}


export const AvatarUpload: React.FC<PropsType> = ({register, getValues, setValue, submit, errors}) => {
	const [isCutting, setIsCutting] = useState<boolean>(false);
	const [localImgSrc, setLocalImgSrc] = useState<null | string>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);

	const name = getValues('name');
	const surname = getValues('surname');

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
			console.log('file... :', currFile);
			setSelectedFile(currFile)
			//set value of avatar 
			if(currFile) {
				setValue('avatar', currFile);
	
				console.log('value of avatar setted', currFile);
			}


			//check if file is too big -> stop
			if(selectedFile && selectedFile.size > 71680){
				alert("File is too big!");
				e.target.value = "";
				return;
			};
		 }
	}

	useEffect(() => {
		//its for cropping image
		if(selectedFile) {
			getLocalImgSrc(setLocalImgSrc, setIsCutting, selectedFile); 
		}
	}, [selectedFile])

	//run after positive validiting in SaveBtn
	const handleSubmit = async () => {
		//set avatar to the firestore
		//we do it here, becouse in SaveBtn we must throw too many props
		if(selectedFile) {
			// console.log('send my current avatar');
			// setIsLoading(true);
			//dispatch(sendMyCurrentAvatar(selectedFile, uid));
			setValue('avatar', selectedFile);

			console.log('value of avatar setted', selectedFile);
		}
	}
 
	//очистити все
	const close = () => {
		setIsCutting(false);
		setLocalImgSrc(null);
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

	console.log('avatarUrl', avatarUrl);
	console.log('img src', localImgSrc);
	console.log('selected file', selectedFile);

	return (
		<div className={`${classes.AvatarUpload} ${classes.Step}`}>
			<h2 className={classes.title}>{`Бажаєте ${ avatarUrl ? 'змінити' : `додати`} своє фото?`}</h2>
			{/* {localImgSrc &&
				<Modal isShow={isCutting}>
					<div className={classes.cutAvatar}>
						<CloseBtn onClick={close} className={classes.closeBtn} />
						<AvatarEdit
							height={100}
							width={100}
							onCrop={onCrop}
							onClose={close}
							//onBeforeFileLoad={onBeforeFileLoad}
							src={localImgSrc}
						/>
						<SaveBtn 
							errors={errors}
							fieldsNames={['avatar']}
							className={classes.saveBtn}
						/>
					</div>
				</Modal>
			} */}
			<div className={classes.currentAvatar}>
				{!isLoading ?
					<UserAvatar 
						src={localImgSrc} 
						name={name} 
						surname={surname}
						size='lg'
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
			<div className={classes.buttons}>
				<ReturnBtn />
				<SaveBtn 
					errors={errors}
					fieldsNames={['avatar']}
					className={classes.saveBtn}
					onSubmitFunctions={[handleSubmit]}
					submit={true}
				/>
			</div>       
		</div>
	)
}

 