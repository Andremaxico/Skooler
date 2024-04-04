export const scrollElementToBottom = (element: HTMLElement | Window, value?: number) => {
	console.log('scrolll elmenet to bottom', value);

	let scrollToBottomHeight = 0;
	if(!value) {
		//@ts-ignore
		scrollToBottomHeight = (element.scrollHeight || element.scrollY) - element.clientHeight
	}
	element.scrollTo({
		behavior: 'smooth',
		top: value || scrollToBottomHeight,
	});
}