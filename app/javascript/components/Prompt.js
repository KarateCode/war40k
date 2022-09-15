/* globals document, CustomEvent */

const Prompt = {
	on(event, callback) {
		document.addEventListener(event, (e) => callback(e.detail))
	},

	close(result) {
		document.dispatchEvent(new CustomEvent('closePrompt', {detail: result}))
	},

	async open(props = {}) {
		document.dispatchEvent(new CustomEvent('open', {detail: {props}}))

		let callback
		const result = await new Promise((resolve, reject) => {
			callback = (e) => {
				resolve(e.detail)
			}
			document.addEventListener('closePrompt', callback)
		})

		document.removeEventListener('closePrompt', callback)
		return result
	},
};

export default Prompt
