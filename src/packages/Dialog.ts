/**
 * new Dialog(id)
 */

interface LiteDialogElement extends HTMLDivElement {
	dialog: any;
}

class Dialog {
	static MINIMIZED_WIDTH: number = 200;
	static MIN_WIDTH: number = 150;
	static MIN_HEIGHT: number = 150;
	private title_height: string = "20px";
	private left: number = 0;
	private right: number = 0;
	private width: number = 0;
	private height: number = 0;
	private minWidth: number = 150;
	private minHeight: number = 150;
	private content: string = "";
	constructor(options: any, legacy: any) {
		if (legacy || options.constructor === String) {
			const id: string = options;
			options = legacy || {};
			options.id = id;
		}

		this._ctor(options);
	}

	private _ctor(options: any) {
		options = options || {};
		const that = this;
		this.left = 0;
		this.right = 0;
		this.width = options.width;
		this.height = options.height;
		this.minWidth = options.minWidth || Dialog.MIN_WIDTH;
		this.minHeight = options.minHeight || Dialog.MIN_HEIGHT;
		this.content = options.content || "";
	}

	public getDialog(id: string) {
		const element = document.getElementById(id) as LiteDialogElement;
		if (!element) return null;
		return element.dialog;
	}
}
