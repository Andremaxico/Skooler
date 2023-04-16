export const scrollElementToBottom = (element: HTMLDivElement, value?: number) => {
	console.log('scrolll elmenet to bottom', value);

	let scrollToBottomHeight = 0;
	if(!value) {
		scrollToBottomHeight = element.scrollHeight - element.clientHeight
	}
	element.scrollTo({
		behavior: 'smooth',
		top: value || scrollToBottomHeight,
	});
}