import { buffer } from "node:stream/consumers";

export const dateFromMoment = (moment: moment.Moment)  => {
	return moment.toDate();
}

export const dataURItoBlob = (dataURI: string) => {
	// convert base64/URLEncoded data component to raw binary data held in a string
	let byteString, mimeString, ia;
	if (dataURI.split(',')[0].indexOf('base64') >= 0) {
		byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type:mimeString});
	}

}