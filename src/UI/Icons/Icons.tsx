import { HomeOutlined } from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import SvgIcon, { SvgIconProps } from '@mui/joy/SvgIcon';
import errorIcon from '../../assets/images/error-icon.png';
import StudyOutlined from '../../assets/images/study-icon.png';

const googleSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48">
		<defs>
			<path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
		</defs>
		<clipPath id="b">
			<use xlinkHref="#a" overflow="visible"/>
		</clipPath>
		<path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/>
		<path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
		<path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
		<path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z"/>
	</svg>
);

const facebookSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="48px" height="48px">
		<linearGradient id="Ld6sqrtcxMyckEl6xeDdMa" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#2aa4f4"/>
			<stop offset="1" stop-color="#007ad9"/>
		</linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"/>
		 <path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"/>
	</svg>
)  

const errorSvg = () => (
	//@ts-ignore
	<svg height="32" style={{overflow: 'visible', enableBackground: 'new 0 0 32 32', viewBox: "0 0 32 32", width: "32"}} xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g>
	<g id="Error_1_">
		<g id="Error">
			<circle cx="16" cy="16" id="BG" r="16" style={{fill: "#D72828"}}/>
			<path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style={{fill: "#E6E6E6"}}/>
		</g>
		</g>
	</g>
	</svg>
)

const signoutSvg = () => (
	<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	// @ts-ignore
			viewBox="0 0 384.971 384.971" style={{enableBackground: 'new 0 0 384.971 384.971'}} xmlSpace="preserve">
		<g>
			<g id="Sign_Out">
				<path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
					C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
					C192.485,366.299,187.095,360.91,180.455,360.91z"/>
				<path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
					c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
					c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"/>
			</g>
			<g>
			</g>
			<g>
			</g>
			<g>
			</g>
			<g>
			</g>
			<g>
			</g>
			<g>
			</g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
		<g>
		</g>
	</svg>
)

const emptySvg = () => (
	<svg version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
		<path d="m216 698.35 180.92-185.34c7.082-7.2578 16.797-11.352 26.938-11.352h352.28c10.141 0 19.855 4.0938 26.938 11.352l180.92 185.34v189.42c0 33.266-26.969 60.234-60.234 60.234h-647.53c-33.266 0-60.234-26.969-60.234-60.234zm56.469-15.129 146.82-151.3h361.41l146.82 151.3h-188.24v30.582c0 37.426-30.34 67.766-67.762 67.766h-143.06c-37.422 0-67.762-30.34-67.762-67.766v-30.582zm-26.469 30.781h186c0 52.355 42.445 94.801 94.801 94.801h146.4c52.355 0 94.801-42.445 94.801-94.801h186v168c0 19.883-16.117 36-36 36h-636c-19.883 0-36-16.117-36-36zm369.06-288c0 8.3555-6.7422 15.129-15.059 15.129s-15.059-6.7734-15.059-15.129v-158.87c0-8.3555 6.7422-15.129 15.059-15.129s15.059 6.7734 15.059 15.129zm97.375 13.637c-2.1562 8.0703-10.41 12.863-18.445 10.699-8.0312-2.1641-12.801-10.461-10.648-18.531l40.926-153.46c2.1523-8.0703 10.41-12.859 18.441-10.699 8.0352 2.1641 12.801 10.461 10.648 18.531zm-192.49-7.832c2.1523 8.0703-2.6172 16.367-10.648 18.531-8.0352 2.1641-16.293-2.6289-18.445-10.699l-40.922-153.46c-2.1523-8.0703 2.6133-16.367 10.648-18.531 8.0312-2.1602 16.289 2.6289 18.441 10.699z" fill-rule="evenodd"/>
	</svg>
)

const studySvg = () => (
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" fill='currentColor' xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xmlSpace="preserve">
	<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
	<g>
		<path d="M408.9,595.5l-249.7-86.3v179.6c0,79,61.8,109.9,140.3,149.1c4.2,2,103.3,49.4,200.5,49.4c101.8,0,196.7-47.6,202-50.3c71.2-36,138.5-69.9,138.5-148.3V509.2l-251.4,87.1C537.9,619.2,463.9,620,408.9,595.5z M792.9,576.1v112.7c0,46.8-40.6,69.5-113.7,106.4c-0.9,0.5-88.7,44.5-179.1,44.5c-86.1,0-178.8-44.2-179.5-44.6c-78.8-39.3-113.6-58.8-113.6-106.3V576.1l184.4,63.7c63,28.3,155.9,27.6,215.4,0.8L792.9,576.1z"/>
		<path d="M946.6,283.5l-365.7-154c-21.8-10.8-50.6-16.8-80.9-16.8c-30.4,0-59.1,6-79.5,16.2L51.9,284.1C15.4,302.3,10,326.9,10,339.9c0,13,5.5,37.5,42,55.5l368.7,127.2c43.1,20,115.5,20,158.6,0l277-95.7V485c0,29.9,24.5,53.3,55.9,53.3c30.4,0,55.1-23.9,55.1-53.3V382.5c20-16,22.9-34,22.6-44.2C989.6,325.9,983.7,302.1,946.6,283.5z M931.7,349.3l-12,6.9V485c0,7.4-15.7,7.5-15.7,0V360L562.5,478l-2.5,1c-30.5,14.5-89.7,14.5-120.1,0L71.8,352.1c-11.7-6.1-14.2-11.4-14.2-12.3c0-0.9,2.7-6.6,14.2-12.4l368.5-155.2c30.2-15,87.9-15.6,120.8,0.6l365.6,153.9c12.4,6.2,15.5,11.9,15.7,13C942.2,340.5,940.1,344.5,931.7,349.3z"/>
		<path d="M912.2,612.4c-17.9,0-32.6,13.4-34.1,30.3l-15.3,59.5l-0.5,4.5c0,26.5,21.9,47.3,49.9,47.3c27.1,0,49.2-21.3,49.2-47.3l-15.8-63.9C944.3,625.8,929.8,612.4,912.2,612.4z M912.2,718.3c-7.3,0-13.1-4.2-14.1-9.9l13.7-53.3l13.6,53.3C924.6,713.9,919,718.3,912.2,718.3z"/></g>
	</svg>
)

export const   GoogleIcon = (props: Partial<CustomIconComponentProps>) => (
	<SvgIcon component={googleSvg} {...props} />
);

export const SignoutIcon = (props: Partial<CustomIconComponentProps>) => (
	<SvgIcon component={signoutSvg} {...props}/>
);

export const FacebookIcon = (props: Partial<CustomIconComponentProps>) => (
	<SvgIcon component={facebookSvg} {...props}/>
)

export const ErrorIcon = (props: Partial<CustomIconComponentProps>) => (
	<div {...props}>
		<img src={errorIcon} alt='Помилка' style={{width: '100%', height: '100%'}}/>
		{/* <Icon component={errorSvg} {...props} /> */}
	</div>
);

export const StudyIcon = (props: Partial<CustomIconComponentProps>) => (
	<SvgIcon component={studySvg} {...props}/>
)

export const EmptyIcon = (props: Partial<CustomIconComponentProps>) => (
	<SvgIcon component={emptySvg} {...props}/>
)


