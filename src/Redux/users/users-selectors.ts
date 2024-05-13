import { RootStateType } from "../store";

export const selectFoundUsers = (state: RootStateType) => {
    return state.users.foundUsers;
} 