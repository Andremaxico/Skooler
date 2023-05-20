import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, UploadFile } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { Controller, UseFormSetValue } from 'react-hook-form';
import { FieldValues } from '../AccountForm';
import ImgCrop from 'antd-img-crop';

export type UploadAvatarInfoType = UploadChangeParam<UploadFile<any>>;

const getBase64 = (img: any, callback: (url: string | ArrayBuffer | null) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: File) => {
	//check isfile have correct type
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  //check is file  smaller than 2MB
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }

  return isJpgOrPng && isLt2M;
};


type PropsType = {
	name: string,
	control: any,
	setValue: UseFormSetValue<FieldValues>,
	avatarUrl: string | null,
}

export const AvatarUpload: React.FC<PropsType> = ({name, control, setValue, avatarUrl}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(avatarUrl);

	const handleChange = (info: UploadAvatarInfoType) => {
		console.log('info', info);
		const avatarFile = info.file.originFileObj;

		if(avatarFile) {
			setValue('avatar', avatarFile);
		}

		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}
		if (info.file.status === 'error' || info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(info.file.originFileObj, (url: string | ArrayBuffer | null) => {
				//turn off preloader
				setLoading(false);

				//set url
				setImageUrl(url);
			});
		}
	};

	const uploadButton = (
		<div>
		{/* {loading ? <LoadingOutlined/> : <PlusOutlined />} */}
			<div
				style={{
					marginTop: 8,
				}}
			>
				Upload
			</div>
		</div>
	);
	
	const onPreview = async (file: UploadFile) => {
		let src = file.url as string;
		if (!src) {
		  src = await new Promise(resolve => {
			 const reader = new FileReader();
			 reader.readAsDataURL(file.originFileObj as RcFile);
			 reader.onload = () => resolve(reader.result as string);
		  });
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow?.document.write(image.outerHTML);
	};

	//@ts-ignore
	return (
		<Controller
			name={name}
			control={control}
			render={({field: {onChange, value}}) => (
				<ImgCrop>
					<Upload
						name="avatar"
						listType="picture-card"
						className="avatar-uploader"
						showUploadList={false}
						// @ts-ignore
						value={value}
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						beforeUpload={beforeUpload}
						onChange={handleChange}
						onPreview={onPreview}
					>
						{imageUrl ? (
							<img
								src={imageUrl as string}
								alt="avatar"
								style={{
									width: '100%',
								}}
							/>
						) : (
							uploadButton
						)}
					</Upload>
				</ImgCrop>
			)} 
		/>
	);
};
