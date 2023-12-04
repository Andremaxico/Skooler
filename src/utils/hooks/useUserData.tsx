import { usersAPI } from "../../api/usersApi"

export const useUserData = async (uid: string) => {
	const data = await usersAPI.getUserById(uid);

	return data;
}