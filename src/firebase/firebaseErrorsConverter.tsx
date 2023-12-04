import { AuthError } from "firebase/auth";

export const errorToText = (errorCode: string) => {
	switch (errorCode) {
		case 'auth/email-already-exists':
			return 'Така електронна адреса вже зареєстрована'
		case 'auth/email-already-in-use':
			return 'Така електронна адреса вже зареєстрована'
		case 'auth/wrong-password':
			return 'Неправильний пароль або електронна адреса'
		case 'auth/phone-number-already-exists':
			return 'Такий номер телефону вже зареєстрований'
		case 'auth/user-not-found':
			return 'Такого користувача не існує'
		case 'auth/invalid-email':
			return 'Неправильний формат електронної пошти'
		default:
			return 'Помилка. Спробуйте пізніше';
	}
}