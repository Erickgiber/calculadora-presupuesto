const TOAST_DURATION_MS = 2800;

class Toast {
	message = $state('');
	#timer: ReturnType<typeof setTimeout> | undefined;

	show(message: string) {
		this.message = message;
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => (this.message = ''), TOAST_DURATION_MS);
	}
}

export const toast = new Toast();
