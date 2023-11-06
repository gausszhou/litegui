
interface SplitOptions {
  id: string;
  vertical: boolean;
  parent: Split | HTMLDivElement;
}

interface SectionInfo {
  id: string;
  width: number | string;
  height: number | string;
}

interface Section {
  element: HTMLDivElement
  add: Function
}

/**
 * Split
 * @class Split
 * @constructor new Split([50, 50], { vertical: true })
 */
class Split {
  root: HTMLDivElement;
  sections: Section[] = [];

  constructor(sections: any[], options: any = {}) {
    this.root = this.createRoot(options);
    this.sections = [];
    sections.forEach((sectionInfo, index) => {
      const section = this.createSection(options, sectionInfo)
      section.element.classList.add("split-" + index);
      this.root.appendChild(section.element);
      this.sections.push(section);
    })
    if (options.parent) {
      if (options.parent.root) {
        options.parent.root.appendChild(this.root);
      } else {
        options.parent.appendChild(this.root);
      }
    }
  }
  // 
  addSection(sectionInfo: SectionInfo) {
    const section = this.createSection({}, sectionInfo);
    this.root.appendChild(section.element);
    this.sections.push(section);
  }
  getSection(index: number) {
    return this.sections[index];
  };
  // 
  createRoot(options: SplitOptions) {
    const root = document.createElement("div");
    root.className = "litesplit"
    root.classList.add(options.vertical ? "vsplit" : "hsplit");
    if (options.id) {
      root.id = options.id;
    }
    return root;
  }
  createSection(options: SplitOptions | any = {}, sectionInfo: SectionInfo | number | string): Section {
    const element = document.createElement("div");
    element.className = "split-section"
    if (typeof sectionInfo == "number") {
      if (options.vertical) {
        element.style.height = sectionInfo.toFixed(1) + "%";
      } else {
        element.style.width = sectionInfo.toFixed(1) + "%";
      }
    } else if (typeof sectionInfo == "string") {
      if (options.vertical) {
        element.style.height = sectionInfo;
      } else {
        element.style.width = sectionInfo;
      }
    } else {
      // object
      if (sectionInfo.id) {
        element.id = sectionInfo.id;
      }
      if (options.vertical) {
        element.style.height = typeof sectionInfo.height === "number" ? sectionInfo.height.toFixed(1) + "%" : sectionInfo.height;
      } else {
        element.style.width = typeof sectionInfo.width === "number" ? sectionInfo.width.toFixed(1) + "%" : sectionInfo.width;
      }
    }
    return {
      element,
      add: (ele: HTMLElement | Section) => {
        if (ele instanceof HTMLElement) {
          element.appendChild(ele);
        } else {
          element.appendChild(ele.element);
        }
      }
    }
  }

}

export default Split;
