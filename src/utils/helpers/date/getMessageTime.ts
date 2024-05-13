import { getMessageGroupDate } from "./getMessageGroupDate";

export const getMessageTime = (date: Date): string => {
	const messageTime = date.getTime();

	return getMessageGroupDate(messageTime);
}