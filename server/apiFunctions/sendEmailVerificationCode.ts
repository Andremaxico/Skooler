import google from 'googleapis';
import nodemailer from 'nodemailer';

const CLIENT_ID = '542140473944-k1v6t5uf89ia6k9p5oh7eq2afons73es.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04XtEJo5i7U4HCgYIARAAGAQSNwF-L9Ir88VjtSZGIDNtMdEBCf_X6UttAlwwI4SVcFGTet-_CLFBVcfy75m6LMMsbqH_wM8c8YI';

//const oAuth2Client = new google.Auth.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
//oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

export const sendEMailVerificationCode = async (email: string) => {
	try {
	//	const accessToken = await oAuth2Client.getAccessToken();
    
		// const transport = nodemailer.createTransport({
		// 	// auth: {
		// 	// 	type: 'OAuth2',
		// 	// 	//my email
		// 	// 	user: 'andremaxico321@gmail.com',
		// 	// 	clientId: CLIENT_ID,
		// 	// 	clientSecret: CLIENT_SECRET,
		// 	// 	refreshToken: REFRESH_TOKEN,
		// 	// 	accessToken: accessToken,
		// 	// }
		// 	service: 'gmail',
		// 	auth: {
		// 		type: 'OAuth2',
		// 		user: 'andremaxico321@gmail.com',
		// 		clientId: CLIENT_ID,
		// 		clientSecret: CLIENT_SECRET,
		// 		refreshToken: REFRESH_TOKEN,
		// 	},
		// });

		const transport = nodemailer.createTransport({
			host: "smtp.example.com",
			port: 587,
			secure: false, // upgrade later with STARTTLS
			auth: {
			  user: "username",
			  pass: "password",
			},
		 });

		const mailOptions = {
			from: 'Andre andremaxico321@gmail.com',
			to: email,
			subject: 'Ваш код для підтвердження реєстрації 0000000',
			text: 'Ваш код для підтвердження реєстрації 0000000',
			html: '<p>Ваш код для підтвердження реєстрації 0000000<p>',
		}

		const result = await transport.sendMail(mailOptions);
		console.log('email sent');
		//return result;
	} catch(error) {
		return error;
	}
} 