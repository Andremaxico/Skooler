export const stringAvatar = (fullName: string) => {
	const [name, surname] = fullName.split(' ');
	return {
	  sx: {
		 bgcolor: '#fff'
	  },
	  //взяти першу букву прізвища та імені
	  children: `${name.trim()[0]}${surname.trim()[0]}`,
	};
}