import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectCurrAvatarUrl, selectMyUid } from '../../../../Redux/account/account-selectors';
import { RegistrationFieldValues } from '../../Registration';
import classes from './AvatarUpload.module.scss';
import { sendMyCurrentAvatar } from '../../../../Redux/account/account-reducer';
import { AppDispatchType, useAppDispatch } from '../../../../Redux/store';
import { Modal } from '../../../../UI/Modal';
import AvatarEdit from 'react-avatar-edit';
import { SaveBtn } from '../../../../UI/SaveBtn';
import { CloseBtn } from '../../../../UI/CloseBtn';
import { dataURItoBlob } from '../../../../utils/helpers/converters';
import { Avatar } from '@mui/joy';


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

function stringAvatar(name: string) {
	return {
	  sx: {
		 bgcolor: '#fff'
	  },
	  //взяти першу букву прізвища та імені
	  children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
	};
}

export const AvatarUpload: React.FC<PropsType> = ({register, getValues, setValue, submit, errors}) => {
	const [isCutting, setIsCutting] = useState<boolean>(false);
	const [localImgSrc, setLocalImgSrc] = useState<null | string>(null);


	//@ts-ignore
	const userFullname = `${getValues('name')} ${getValues('surname')}`;
	console.log('fullname:', userFullname);
	const avatarUrl = useSelector(selectCurrAvatarUrl);

	const dispatch: AppDispatchType = useAppDispatch();
	const uid = useSelector(selectMyUid);

	//when user selected file
	const inputChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {

		//TODO:
		//it's in other paart of component (avatr cut)
			//треба отримати шлях до обраного зображення

		if (e.target.files && e.target.files.length > 0) {
			console.log('file... :', e.target.files[0]);
			const selectedFile: File = e.target.files[0]; 

			//end function
			//check if file is too big
			if(e.target.files[0].size > 71680){
				alert("File is too big!");
				e.target.value = "";
				return;
			};

			//set local url
			// if (e.target.files && e.target.files.length > 0) {
			// 	const reader = new FileReader();
			// 	reader.addEventListener('load', async () => {
			// 	  setLocalImgSrc(e.target.value);
			// 	  setIsCutting(true);
			// 	});
			// 	reader.readAsDataURL(e.target.files[0]);
			//  }

			if(uid) {
				dispatch(sendMyCurrentAvatar(e.target.files[0], uid));
			}
		 }

		// //@ts-ignore // капець із цим каллером !!!
		// console.log('uploadig file', getValues('avatar'), 'uid', uid);

		// console.log('event', e.target.files ? e.target.files[0] : null);
	}

	//очистити все
	const close = () => {
		setIsCutting(false);
		setLocalImgSrc(null);
	}

	// надіслати файл на сервер
	const save = () => {
		if(localImgSrc) {
			const blob = dataURItoBlob(localImgSrc);
			if(uid && blob) {
				dispatch(sendMyCurrentAvatar(blob, uid));
			}
		}
		close();
	}

	//зберегти проміжкову версію кропу
	const onCrop = (preview: string) => {
		console.log('preview', preview);
		setLocalImgSrc(preview);
	}

	console.log('avatarUrl', avatarUrl);
	console.log('img src', localImgSrc);

	return (
		<div className={`${classes.AvatarUpload} ${classes.Step}`}>
			<h2 className={classes.title}>{`Бажаєте ${ avatarUrl ? 'змінити' : `додати`} своє фото?`}</h2>
			{localImgSrc &&
				<Modal isShow={isCutting}>
					<div className={classes.cutAvatar}>
						<CloseBtn onClick={close} className={classes.closeBtn} />
						<AvatarEdit
							width={390}
							height={295}
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
			}
			<div className={classes.currentAvatar}>
				{avatarUrl ?
					<Avatar className={classes.avatar} src={avatarUrl ||  undefined} />
				:
					<Avatar className={classes.avatar} {...stringAvatar(userFullname)} />
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
			<SaveBtn 
				errors={errors}
				fieldsNames={['avatar']}
				className={classes.saveBtn}
			/>
		</div>
	)
}

 