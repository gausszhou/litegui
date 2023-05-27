import LiteGUI from ".";
import EventMitter from "./EventMitter";

/****************** AREA **************/
/** An Area is am streched container.
 * Areas can be split several times horizontally or vertically to fit different colums or rows
 *
 * @class Area
 * @constructor
 * @param {Object} options
 */

const EVENT_KEY_ON_SPLIT_MOVED = "split_moved"

type Direction = "horizontal" | "vertical";

class Area extends EventMitter {
  static VERTICAL = "vertical";
  static HORIZONTAL = "horizontal";
  static SPLITBAR_SIZE = 4;

  private _rootComputedSize: number[];

  public direction: Direction = "horizontal";
  public size?: string | number;

  public options: any;

  public root: HTMLElement;
  public content: HTMLElement;
  public splitbar?: HTMLElement;
  public sections: Area[];
  public dynamic_section?: Area;

  constructor(options?: any, legacy?: any) {
    super();
    // for legacy code
    if ((options && options.constructor === String) || legacy) {
      const id = options;
      options = legacy || {};
      options.id = id;
      console.warn("LiteGUI.Area legacy parameter, use options as first parameter instead of id.");
    }
    this.options = options || {};
    /* the root element containing all sections */
    this.root = this.createRoot();
    this.content = this.createContent();
    this.sections = [];
    this._rootComputedSize = [this.root.offsetWidth, this.root.offsetHeight];
    this.initDom();
    this.initEvent();
    this.initStyle();
  }

  createRoot() {
    const options = this.options;
    const root = document.createElement("div");
    root.className = "litearea";
    if (options.id) root.id = options.id;
    if (options.className) root.className += " " + options.className;
    return root;
  }

  createContent() {
    const options = this.options;
    var content = document.createElement("div");
    if (options.content_id) content.id = options.content_id;
    content.className = "liteareacontent";
    content.style.width = "100%";
    content.style.height = "100%";
    return content;
  }
  createSplitbar(direction: Direction) {
    // SPLITTER DRAGGER INTERACTION
    const lastPosition = [0, 0];
    const inner_mousedown = (e: MouseEvent) => {
      const doc = this.root.ownerDocument;
      doc.addEventListener("mousemove", inner_mousemove);
      doc.addEventListener("mouseup", inner_mouseup);
      lastPosition[0] = e.pageX;
      lastPosition[1] = e.pageY;
      e.stopPropagation();
      e.preventDefault();
    };

    const inner_mousemove = (e: MouseEvent) => {
      if (direction == "horizontal") {
        if (lastPosition[0] != e.pageX) this.moveSplit(lastPosition[0] - e.pageX);
      }
      if (direction == "vertical") {
        if (lastPosition[1] != e.pageY) this.moveSplit(e.pageY - lastPosition[1]);
      }

      lastPosition[0] = e.pageX;
      lastPosition[1] = e.pageY;
      e.stopPropagation();
      e.preventDefault();

      if (this.options.immediateResize || this.options.inmediateResize)
        // inmediate is for legacy...
        this.onResize();
    };

    const inner_mouseup = () => {
      const doc = this.root.ownerDocument;
      doc.removeEventListener("mousemove", inner_mousemove);
      doc.removeEventListener("mouseup", inner_mouseup);
      this.onResize();
    };

    const splitbar = document.createElement("div");
    splitbar.className = "litesplitbar " + direction;
    if (direction == "vertical") splitbar.style.height = Area.SPLITBAR_SIZE + "px";
    else splitbar.style.width = Area.SPLITBAR_SIZE + "px";
    splitbar.addEventListener("mousedown", inner_mousedown);
    return splitbar;
  }
  initDom() {
    this.root.appendChild(this.content);
  }
  initEvent() {
    if (this.options.autoresize) {
      LiteGUI.bind(LiteGUI, "resized", () => {
        this.onResize();
      });
    }
  }
  initStyle() {
    const options = this.options;
    let width = options.width || "100%";
    let height = options.height || "100%";
    if (width < 0) width = "calc( 100% - " + Math.abs(width) + "px)";
    if (height < 0) height = "calc( 100% - " + Math.abs(height) + "px)";
    this.root.style.width = width;
    this.root.style.height = height;
  }
  add(v: any) {
    if (typeof v === "string") {
      var element = document.createElement("div");
      element.innerHTML = v;
      v = element;
    }
    this.content.appendChild(v.root || v);
  }

  /* get container of the section */
  getSection(index: number) {
    index = index || 0;
    if (this.sections.length > index) return this.sections[index];
    return null;
  }

  // sends the resize event to all the sections
  public sendResizeEvent(e?: string) {
    this.sections.forEach(section => {
      section.onResize(e);
    });
  }

  public onResize(e?: string) {
    const rootCurrentSize = [this.root.offsetWidth, this.root.offsetHeight];
    if (
      e &&
      this._rootComputedSize &&
      rootCurrentSize[0] === this._rootComputedSize[0] &&
      rootCurrentSize[1] === this._rootComputedSize[1]
    ) {
      return false;
    }
    this.sendResizeEvent(e);
    return true;
  }

  public getWidth() {
    return this.root.offsetWidth;
  }

  public getHeight() {
    return this.root.offsetHeight;
  }

  public isVisible() {
    return this.root.style.display !== "none";
  }

  public hide() {
    this.root.style.display = "none";
  }

  public show() {
    this.root.style.display = "block";
  }

  public adjustHeight() {
    if (!this.root.parentElement) {
      console.error("Cannot adjust height of LiteGUI.Area without parent");
      return;
    }
    const y = this.root.getClientRects()[0].top;
    //adjust height
    this.root.style.height = "calc( 100% - " + y + "px )";
  }

  public showSection(num: number) {
    // get current section
    const section = this.sections[num];
    if (!section) return false;

    // show current section
    if (section.root.style.display !== "none") {
      return false; // already visible
    } else {
      section.root.style.display = "inline-block";
    }

    // get current section size
    let size = "";
    if (this.direction == "horizontal") size = section.root.style.width;
    if (this.direction === "vertical") size = section.root.style.height;
    if (size.indexOf("calc") != -1) size = "50%";

    // update other section size
    this.sections.forEach((section, i) => {
      if (i !== num) {
        if (this.direction === "horizontal") section.root.style.width = `calc( 100% - ${size} - 5px)`;
        if (this.direction === "vertical") section.root.style.height = `calc( 100% - ${size} - 5px)`;
      }
    });

    // show splitbar
    if (this.splitbar) this.splitbar.style.display = "inline-block";

    // resize
    this.sendResizeEvent();
    return true;
  }

  public hideSection(index: number) {
    this.sections.forEach((section, i) => {
      if (i === index) {
        // hide current section
        section.root.style.display = "none";
      } else {
        // full other section
        if (this.direction == "horizontal") section.root.style.width = "100%";
        if (this.direction === "vertical") section.root.style.height = "100%";
      }
    });

    // hide splitbar
    if (this.splitbar) this.splitbar.style.display = "none";

    // resize
    this.sendResizeEvent();
  }

  /**
   *
   * @param direction
   * @param sizes
   * @param editable
   */

  split(direction: Direction, sizes: any[], editable: boolean) {
    if (direction !== "vertical" && direction !== "horizontal") {
      throw new Error("First parameter must be a string: 'vertical' or 'horizontal'");
    }

    if (!sizes) sizes = ["50%", null];

    if (this.sections.length) throw "cannot split twice";

    //create areas
    const area1 = new Area({ content_id: this.content.id }, false);
    area1.root.style.display = "inline-block";

    const area2 = new Area();
    area2.root.style.display = "inline-block";

    let splitinfo = "";
    let splitbar = null;
    let dynamic_section = undefined;

    if (editable) {
      splitinfo = " - " + (Area.SPLITBAR_SIZE + 2) + "px"; // 2 px margin
      splitbar = this.createSplitbar(direction);
      this.splitbar = splitbar;
    }

    sizes = sizes || ["50%", null];

    if (direction == "vertical") {
      area1.root.style.width = "100%";
      area2.root.style.width = "100%";

      if (sizes[0] == null) {
        var h = sizes[1];
        if (typeof h == "number") h = sizes[1] + "px";
        area1.root.style.height = "calc( 100% - " + h + splitinfo + " )";
        area2.root.style.height = h;
        area2.size = h;
        dynamic_section = area1;
      } else if (sizes[1] == null) {
        var h = sizes[0];
        if (typeof h == "number") h = sizes[0] + "px";
        area1.root.style.height = h;
        area1.size = h;
        area2.root.style.height = "calc( 100% - " + h + splitinfo + " )";
        dynamic_section = area2;
      } else {
        var h1 = sizes[0];
        if (typeof h1 == "number") h1 = sizes[0] + "px";
        var h2 = sizes[1];
        if (typeof h2 == "number") h2 = sizes[1] + "px";
        area1.root.style.height = h1;
        area1.size = h1;
        area2.root.style.height = h2;
        area2.size = h2;
      }
    }

    if (direction == "horizontal") {
      area1.root.style.height = "100%";
      area2.root.style.height = "100%";

      if (sizes[0] == null) {
        var w = sizes[1];
        if (typeof w == "number") w = sizes[1] + "px";
        area1.root.style.width = "calc( 100% - " + w + splitinfo + " )";
        area2.root.style.width = w;
        area2.size = sizes[1];
        dynamic_section = area1;
      } else if (sizes[1] == null) {
        var w = sizes[0];
        if (typeof w == "number") w = sizes[0] + "px";
        area1.root.style.width = w;
        area1.size = w;
        area2.root.style.width = "calc( 100% - " + w + splitinfo + " )";
        dynamic_section = area2;
      } else {
        var w1 = sizes[0];
        if (typeof w1 == "number") w1 = sizes[0] + "px";
        var w2 = sizes[1];
        if (typeof w2 == "number") w2 = sizes[1] + "px";
        area1.root.style.width = w1;
        area1.size = w1;
        area2.root.style.width = w2;
        area2.size = w2;
      }
    }

    area1.root.removeChild(area1.content);
    area1.root.appendChild(this.content);
    area1.content = this.content;

    this.root.appendChild(area1.root);
    if (splitbar) this.root.appendChild(splitbar);
    this.root.appendChild(area2.root);

    this.direction = direction;
    this.sections = [area1, area2];
    this.dynamic_section = dynamic_section;
  }

  moveSplit(delta: number) {
    if (!this.sections) return false;

    const area1 = this.sections[0];
    const area2 = this.sections[1];
    const splitinfo = " - " + Area.SPLITBAR_SIZE + "px";

    const min_size = this.options.minSplitSize || 10;

    if (this.direction == "horizontal") {
      if (this.dynamic_section == area1) {
        var size = area2.root.offsetWidth + delta;
        if (size < min_size) size = min_size;
        area1.root.style.width = "calc( 100% - " + size + "px " + splitinfo + " )";
        area2.root.style.width = size + "px"; //other split
      } else {
        var size = area1.root.offsetWidth - delta;
        if (size < min_size) size = min_size;
        area2.root.style.width = "calc( 100% - " + size + "px " + splitinfo + " )";
        area1.root.style.width = size + "px"; //other split
      }
    } else if (this.direction == "vertical") {
      if (this.dynamic_section == area1) {
        var size = area2.root.offsetHeight - delta;
        if (size < min_size) size = min_size;
        area1.root.style.height = "calc( 100% - " + size + "px " + splitinfo + " )";
        area2.root.style.height = size + "px"; //other split
      } else {
        var size = area1.root.offsetHeight + delta;
        if (size < min_size) size = min_size;
        area2.root.style.height = "calc( 100% - " + size + "px " + splitinfo + " )";
        area1.root.style.height = size + "px"; //other split
      }
    }

    LiteGUI.trigger(this.root, EVENT_KEY_ON_SPLIT_MOVED);

    //trigger split_moved event in all areas inside this area
    var areas = this.root.querySelectorAll(".litearea");
    for (var i = 0; i < areas.length; ++i) LiteGUI.trigger(areas[i], EVENT_KEY_ON_SPLIT_MOVED);
    
    return true;
  }

  setAreaSize(sectionIndex: number, size: number | string) {
    const element = this.sections[sectionIndex || 0];
    const splitInfo =  ` - ${Area.SPLITBAR_SIZE}px`;
    element.root.style.width = `calc( 100% - ${size}  ${splitInfo} )`;
  }
  /**
   * 
   * @param sectionIndex 
   */
  merge(sectionIndex: number) {
    if (this.sections.length == 0) throw new Error("not splitted");
    const section = this.sections[sectionIndex || 0];
    this.root.appendChild(section.root);
    this.content = section.content;
    // remove all section
    this.root.removeChild(this.sections[0].root);
    this.root.removeChild(this.sections[1].root);
    this.sections = [];
    this._rootComputedSize = [];
    this.onResize();
  }

  public addEventListener(event: string, listener: EventListener) {
    return this.root.addEventListener(event, listener);
  }

  public query(selector: string) {
    return this.root.querySelector(selector);
  }
}

export default Area;
