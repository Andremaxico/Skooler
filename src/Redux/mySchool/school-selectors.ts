import { RootStateType } from "../store";

export const selectMySchoolEvents = (state: RootStateType) => {
	return state.mySchool.eventsData;
};

export const selectMySchoolPupils = (state: RootStateType) => {
	return state.mySchool.currSchoolPupils;
}

export const selectCurrClassPupils = (state: RootStateType) => {
	return state.mySchool.currClassPupils;
}