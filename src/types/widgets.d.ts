export type Area = any
export type Console = any
export type Dialog = any
export type Dragger = any
export type Inspector = any
export type Table = any
export type Split = any
export type Tabs = any
export type Tree = any
export type Widgets = any
export type Panel = any

export interface Menu {
  add: (path: string, data: object) => void;
  remove: () => void;
  clear: () => void;
  showMenu: () => void;
  findMenu: () => MenuItem[]
}

export interface MenuItem {
  name: string;
  element: HTMLElement;
  children: any;
}



export type Button = any
export type SearchBox = any
export type ContextMenu = any
export type Checkbox = any
export type List = any
export type LineEditor = any
export type Slider = any
export type ComplexList = any
