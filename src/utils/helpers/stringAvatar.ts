export const stringAvatar = (name: string, surname: string) => {
	return {
	  sx: {
		 bgcolor: '#fff'
	  },
	  //взяти першу букву прізвища та імені
	  children: `${name.trim()[0]}${surname.trim()[0]}`,
	};
}