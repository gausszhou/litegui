/**
 * LightCraft 的数据模型。
 *
 * 一张「照片」持有原始渲染结果（或导入的位图）与一组显影参数，
 * 原图只读，编辑全部是可序列化的参数 —— 这就是非破坏性编辑的落点。
 */
import type { DevelopParams, MaskSpec } from "./develop";
import type { SceneSpec } from "./photos";
import type { FlagKind } from "./ui";

export interface MaskEntry {
  id: string;
  name: string;
  spec: MaskSpec;
  /** 遮罩自身的再调整参数（默认全中性） */
  params: DevelopParams;
  visible: boolean;
}

export interface Photo {
  id: string;
  spec: SceneSpec;
  /** 网格/胶片条使用的 dataURL 缩略图 */
  thumb: string;
  rating: number;
  flag: FlagKind;
  keywords: string[];
  develop: DevelopParams;
  masks: MaskEntry[];
  /** 软删除标记 → 最近删除 */
  deleted: boolean;
  /** 导入的照片没有 SceneSpec 里的演示元数据差异，用这个标记 */
  imported: boolean;
  width: number;
  height: number;
  /** 全分辨率原始画布（按需生成） */
  source?: HTMLCanvasElement;
  /** 预览画布（最长边 1280） */
  preview?: HTMLCanvasElement;
  /** 预览画布的原始像素缓存 */
  previewPixels?: ImageData;
}

export type SortKey = "date" | "rating" | "name";

export type LibraryScope =
  | { kind: "all" }
  | { kind: "recent" }
  | { kind: "picks" }
  | { kind: "rated" }
  | { kind: "album"; name: string }
  | { kind: "date"; value: string }
  | { kind: "deleted" };

export interface HistoryStep {
  label: string;
  develop: DevelopParams;
  masks: MaskEntry[];
}

export type ViewMode = "library" | "develop";
export type PanelMode = "edit" | "mask" | "metadata" | "history";
export type GridSize = "s" | "m" | "l";

export interface AppState {
  photos: Photo[];
  selectedId: string;
  view: ViewMode;
  panel: PanelMode;
  activeMaskId: string | null;
  gridSize: GridSize;
  showLeft: boolean;
  compare: boolean;
  zoomMode: "fit" | "100" | "200";
  sort: SortKey;
  search: string;
  scope: LibraryScope;
}
