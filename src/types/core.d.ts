import {
	Area,
	Console,
	Dialog,
	Dragger,
	Inspector,
	Split,
	Table,
	Tabs,
	Tree,
	Button,
	SearchBox,
	ContextMenu,
	Checkbox,
	List,
	LineEditor,
	Slider,
	ComplexList
} from "./widgets";

import { ContentType } from "./utils";

export interface LiteGUIInstance {
	Area: Area;
	Consoel: Console;
	Dialog: Dialog;
	Dragger: Dragger;
	Inspector: Inspector;
	Menu: Menu;
	Panel: Panel;
	Split: Split;
	Table: Table;
	Tabs: Tabs;
	Tree: Tree;
	SearchBox: SearchBox;
	ContextMenu: ContextMenu;
	Checkbox: Checkbox;
	List: List;
	LineEditor: LineEditor;
	Slider: Slider;
	ComplexList: ComplexList;

	root: any;
	content: any;
	mainmenu: any;
	menubar: any;
	container: null | HTMLElement;
	panels: any;
	windows: any[];
	special_codes: any;
	undo_steps: any;
	modalbg_div: any;
	_safe_cliboard: any;

	init: (optins: LiteGUIInitOptions) => void;
	trigger: (a: any, b?: any, c?: any) => void;
	bind: (a: any, b: any, c: () => void) => void;
	unbind: (a: any, b: any, c: () => void) => void;
	removeClass: (element: HTMLElement, selector: string, class_name: string) => void;
	add: (liteGUIElement: any) => void;
	remove: (any) => void;
	setWindowSize: (width?: number, height?: number) => void;
	maximizeWindow: () => void;

	sizeToCSS: (size: number) => null | string;
	setCursor: (cursorStyle: string) => void;
	isCursorOverElement: (event: MouseEvent, element: HTMLElement) => void;
	getRect: (element) => any;
	toClipboard: (object: string, force_local: boolean) => void;
	getLocalClipboard: () => any;
	addCSS: (string) => void;

	requireCSS: (url: string | string[], onComplete: Callback) => void;
	request: (req: any) => void;
	requestText: (url: URL, onComplete: Callback, onError: Callback) => void;
	requestJSON: (url: URL, onComplete: Callback, onError: Callback) => void;
	requestBinary: (url: URL, onComplete: Callback, onError: Callback) => void;
	requireScript: (
		url: string | string[],
		onComplete: Callback,
		onError: Callback,
		onProgress: Callback,
		version: any
	) => void;
	requireScriptSerial: (url: string | string[], onComplete: Callback, onProgress: Callback) => void;

	createElement: (tag: string, id_class: string, content: string, style: object, events: any) => any;
	createListItem: (code: string, values: string[], styles: string[]) => void;
	createButton: (id_class: string, content: string, callback: Callback, styles: string[]) => HTMLElement;
	createMenu: () => void;

	newWindow: (title: string, width: number, height: number, options: any) => void;
	getParents: (element: HTMLElement) => HTMLElement[];

	showModalBackground: (v: boolean) => void;
	showMessage: (conent: string, options: any) => any;

	popup: () => any;
	alert: (content: string, options: any) => any;
	confirm: (content: string, callback: any, options: any) => any;
	prompt: (content: string, callback: any, options: any) => any;
	choice: (content: string, callback: any, options: any) => any;
	downloadURL: (url: string, filename: string) => void;
	downloadFile: (filename: string, data: any, dataType: ContentType) => void;

	getUrlVar: (name: string) => any;
	getUrlVars: () => any;

	focus: (element: HTMLElement) => void;
	blur: (element: HTMLElement) => void;
	draggable: (container: any, dragger?: any, on_start?: any, on_finish?: any, on_is_draggable?: any) => any;

	cloneObject: (a: any, b: any) => any;
	safeName: (name: string) => string;
	createDropArea: (element: any, callback_drop: any, callback_enter: any, callback_exit: any) => any;
}

interface LiteGUIInitOptions {
	width: number;
	height: number;
	wrapped: any;
	container: string;
	menubar: any;
	gui_callback: any;
}

interface LiteGUIWidget {
	root: HTMLElement;
	attributes: any[];
	childNodes: any[];
	[propName: string]: any;
}

interface Callback {
	(event: any, ...item: any): any;
}
