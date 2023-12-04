export const getFileReader = (
	selectedFile: File | Blob,
) => {
	const reader = new FileReader();
	reader.readAsDataURL(selectedFile);
	return reader;  
}