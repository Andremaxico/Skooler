import { RootStateType } from "../store";

export const selectNetworkError = (state: RootStateType) => {
	return state.app.networkError;
}