import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

const sendEmail = async ({email, code}) => {
	console.log('send email', email, code);

	const transport = nodemailer.createTransport({
		service: 'gmail',
		secure: false, // upgrade later with STARTTLS
		host: 'http://localhost:5173/Skooler',
		port: 587,
		auth: {
		  user: "andremaxico321@gmail.com",
		  pass: "xdnxwnrwzqyloqst",
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false
	  },
	 });

	const mailOptions = {
		from: 'Andre andremaxico321@gmail.com',
		to: email,
		subject: `Ваш код для підтвердження реєстрації ${code} у Skooler`,
		text: `Ваш код для підтвердження реєстрації ${code} у Skooler`,
		html: `<p>Ваш код для підтвердження реєстрації ${code} у Skooler<p>`,
	} 

	await transport.sendMail(mailOptions);	
}

app.get("/", (req, res) => {
	sendEmail(req.body)
		.then((response) => res.send(response))
		.catch((error) => res.status(500).send(response));
})


app.post('/send_email', (req, res) => {
	sendEmail(req.body)
	.then((response) => res.send(response))
	.catch((error) => res.status(500).send(error));
})

app.use((err, req, res, text) => {
	console.log(err.stack);
	res.type('text\plain');
	res.status(500);
	res.send('internal server error 500');
})

app.listen(port, () => {
	console.log('listening on port 5000');
})

