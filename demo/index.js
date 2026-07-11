import "../src/styles/index.scss"
import LiteGUI from "../src/index"

console.log(LiteGUI);

window.onload = function () {
  LiteGUI.init({
    container: "#app"
  });

  const menubar = new LiteGUI.Menu("mainmenubar");
  LiteGUI.add(menubar);
  menubar.add("文件", {});
  menubar.add("文件/新建文本文件", {});
  menubar.add("文件/新建文件夹", {});
  menubar.add("文件/新建项目", {});
  menubar.add("文件/新建窗口", {});
  menubar.add("文件/使用配置文件新建窗口/创建配置文件", {});

  menubar.add("编辑", {});
  menubar.add("编辑/撤销", {});
  menubar.add("编辑/恢复", {});
  menubar.separator("编辑");
  menubar.add("编辑/剪切", {});
  menubar.add("编辑/复制", {});
  menubar.add("编辑/粘贴", {});

  menubar.add("视图", {});
  menubar.add("视图/工具栏", {});
  menubar.add("视图/状态栏", {});
  menubar.add("视图/属性", {});
  menubar.add("视图/大纲", {});
  menubar.add("视图/搜索", {});
  


  const area = new LiteGUI.Area();
  LiteGUI.add(area);

  const button = new LiteGUI.Button('按钮');
  LiteGUI.add(button);
};
