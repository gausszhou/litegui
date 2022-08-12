var hs=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var rw=hs((st,lt)=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();function fs(t,r){var n,i,r=(r=r===void 0?{}:r).insertAt;t&&typeof document<"u"&&(n=document.head||document.getElementsByTagName("head")[0],(i=document.createElement("style")).type="text/css",r==="top"&&n.firstChild?n.insertBefore(i,n.firstChild):n.appendChild(i),i.styleSheet?i.styleSheet.cssText=t:i.appendChild(document.createTextNode(t)))}var gs=`@charset "UTF-8";
.inspector {
  color: #999;
}

.inspector.one_line {
  margin-bottom: 0;
  overflow: hidden;
  white-space: nowrap;
}

.inspector .separator {
  width: -moz-calc(100% - 10px);
  width: -webkit-calc(100% - 10px);
  width: calc(100% - 10px);
  border-top: 1px solid #111;
  border-bottom: 1px solid #555;
}

.inspector.one_line .separator {
  display: inline-block;
  width: auto;
  height: 1em;
  border-left: 1px solid #111;
  border-right: 1px solid #777;
  margin: 2px 5px 0 5px;
}

.inspector .widget {
  vertical-align: center;
  min-height: 1.2em;
  display: flex;
  align-items: center;
}

.inspector:not(.one_line) .widget.even {
  background-color: rgba(40, 40, 40, 0.5);
}

.inspector.one_line .widget {
  min-width: 100px;
  display: inline-block;
}

.inspector .widget:hover {
  background-color: #556 !important;
}

.inspector .wtitle,
.inspector .wsectiontitle {
  display: inline-block;
  position: relative;
  z-index: auto;
  background-color: #555;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  padding: 2px;
  padding-left: 8px;
  color: #BBC;
  font-size: 1.2em;
}

.inspector .wsectioncontent {
  padding: 4px 4px;
  background-color: #3A3A3A;
  transition: 1s all ease-in-out;
}

.inspector .wtitle {
  margin-top: 6px;
  background-color: #444;
  color: #888;
}

.inspector.dark .wtitle {
  background-color: #323232;
}

.inspector .wtitle .help {
  text-decoration: underline;
}

.inspector .wtitle .help .help-content {
  display: none;
  float: right;
}

.inspector .wsectiontitle {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-top: 4px;
  box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  white-space: nowrap;
}

.inspector .wsectiontitle .buttons {
  position: absolute;
  top: 4px;
  right: 4px;
}

.inspector .wsectiontitle button {
  font-size: 0.8em;
  background-color: #333;
  border: 1px solid #222;
  margin: 0;
  box-shadow: 0 0 0;
  padding: 0 1px 0 1px;
  margin-left: 2px;
}

.inspector .wsectioncontent button {
  white-space: nowrap;
  overflow: hidden;
}

.inspector .wcontent button.single {
  padding: 2px;
}

.inspector .icon {
  margin-right: 4px;
}

.inspector .wcontent .icon {
  margin: 0;
}

.inspector .wsection {
  /*padding: 4px 2px;*/
  margin-bottom: 4px;
}

.inspector .wsection.selected .wsectiontitle {
  background-color: #434959;
}

.inspector .wsection.selected .wsectioncontent {
  border: 2px solid #434959;
}

.inspector .wsection.collapsed {
  margin-bottom: 0;
  padding-bottom: 0;
}

.inspector .wsection.collapsed .wsectiontitle {
  border-bottom: 1px solid #222;
}

.inspector .switch-section-button {
  display: inline-block;
  margin: 6px 2px -4px 0;
  border-top: 6px solid #333;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.inspector .collapsed .switch-section-button {
  margin: 2px 0 0 2px;
  border-left: 6px solid #333;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-right: 6px solid transparent;
}

.inspector .wgroupheader:not(.collapsed) .switch-section-button {
  border-top: 6px solid #777;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.inspector .wgroupheader.collapsed .switch-section-button {
  border-left: 6px solid #777;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-right: 6px solid transparent;
}

.inspector .wsection.notitle {
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.inspector .wgroup {
  position: relative;
  width: -webkit-calc(100% - 2px);
  width: -moz-calc(100% - 2px);
  width: calc(100% - 2px);
  margin-top: 2px;
}

.inspector .wgroup .wgroupheader {
  margin-top: 0;
  padding-left: 4px;
  cursor: pointer;
}

.inspector .wgroup .wgroupcontent {
  margin-left: 10px;
}

.inspector .wgroup .wgrouptoggle {
  display: inline-block;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  text-align: center;
  margin: 2px;
  margin-right: 4px;
  color: #999;
  line-height: 8px;
  font-size: 14px;
}

.inspector .wname {
  display: inline-block;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 2px;
  padding-left: 4px;
  font-weight: normal;
  vertical-align: top;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  overflow: hidden;
  white-space: nowrap;
  width: 80px;
}

.inspector.one_line .wname {
  width: auto;
}

.inspector .wname .filling {
  color: #666;
  margin-left: 5px;
}

.inspector .wcontent {
  display: inline-block;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 2px;
  width: -webkit-calc(100% - 80px);
  width: -moz-calc(100% - 80px);
  width: calc(100% - 80px);
}

.inspector.proportionalnamesize .wname {
  width: 30%;
}

.inspector.proportionalnamesize .wcontent {
  width: 70%;
}

.inspector .wcontent.full {
  width: 100%;
  padding-left: 5px;
}

.inspector .inputfield {
  display: inline-block;
  background-color: #222;
  border: 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #3f3f3f;
  border-radius: 3px;
}

.inspector .wcontent .inputfield input:focus,
.inspector .wcontent .inputfield textarea:focus {
  outline: none;
}

.inspector input::placeholder {
  color: #687177;
}

.inspector input::-webkit-input-placeholder {
  color: #687177;
}

.inspector input::-moz-input-placeholder {
  color: #687177;
}

.inspector .inputfield.disabled {
  background-color: #333;
}

.inspector .inputfield.disabled input,
.inspector .inputfield.disabled textarea {
  color: #AAA;
}

.inspector .wcontent .inputfield.full {
  width: -moz-calc(100% - 4px);
  width: -webkit-calc(100% - 4px);
  width: calc(100% - 4px);
}

.inspector .wcontent .inputfield.textarea {
  display: block;
  margin: 0 4px 0 0;
  width: -moz-calc(100% - 4px);
  width: -webkit-calc(100% - 4px);
  width: calc(100% - 4px);
}

.inspector .wcontent .inputfield.button {
  margin: 0;
  width: -moz-calc(100% - 26px);
  width: -webkit-calc(100% - 26px);
  width: calc(100% - 26px);
}

.inspector .wcontent .inputcombo {
  border-bottom: 1px solid #666;
  border-top: 1px solid #111;
  border-radius: 4px;
}

.inspector .wcontent .inputcombo select {
  background: #262626;
  text-align-last: center;
}

.inspector .wcontent input,
.inspector .wcontent textarea {
  color: #5AF;
  border: 0;
  background-color: transparent;
}

.inspector .wcontent input:focus,
.inspector .wcontent textarea:focus {
  direction: ltr !important;
}

.inspector .wcontent input.text {
  width: -moz-calc(100% - 8px);
  width: -webkit-calc(100% - 8px);
  width: calc(100% - 8px);
}

.inspector .wcontent input.string {
  padding-left: 5px;
}

.inspector .wcontent input.fixed_size {
  font-family: "monospace", "courier new";
}

.inspector .wcontent input.number {
  border-radius: 3px 0 0 3px;
  text-align: center;
}

.inspector .wcontent input.nano {
  width: 1.5em;
}

.inspector .wcontent input.mini {
  width: 27px;
  margin-left: 3px;
}

.inspector .wcontent .disabled input.mini {
  width: 34px;
}

.inspector .wcontent input.medium {
  width: 51px;
}

.inspector .wcontent textarea {
  display: block;
  width: -moz-calc(100% - 10px);
  width: -webkit-calc(100% - 10px);
  width: calc(100% - 10px);
  padding: 2px 5px 2px 5px;
}

.inspector .winfo {
  display: block;
  width: -moz-calc(100% - 20px);
  width: -webkit-calc(100% - 20px);
  width: calc(100% - 20px);
  margin: 10px;
}

.inspector .confirm_button {
  font-size: 0.8em;
  padding: 1px;
  margin: 0;
  margin-left: 2px;
}

.inspector .wcontent .checkbox {
  width: 4em;
  display: inline-block;
  background-color: #222;
  border: 0;
  border-radius: 2px;
  margin: 0 !important;
  text-align: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.inspector .wcontent .checkbox.on {
  background-color: #5AF;
  color: black;
}

.inspector .wcontent .flag {
  font-size: 0.8em;
  margin-left: 5px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.inspector .wcontent select {
  color: #5AF;
  border: 0;
  background: #222;
  margin-right: 2px;
  width: -moz-calc(100% - 4px);
  width: -webkit-calc(100% - 4px);
  width: calc(100% - 4px);
}

.inspector .wcontent select.disabled {
  background: #333;
}

.inspector .wcontent button {
  background: -webkit-linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  background: -moz-linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  background: linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  border: 0 none;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0 1px 0 #5B5957 inset, 0 -1px 0 black, 0 1px 0 black, -1px 0 0 black, 1px 0 0 black, 0 1px 1px #111111;
  color: #CCC;
  display: inline-block;
  margin: 0 4px 0 0;
  padding: 0;
  text-shadow: 0 1px 1px black;
  vertical-align: top;
  width: -moz-calc(100% - 6px);
  width: -webkit-calc(100% - 6px);
  width: calc(100% - 6px);
}

.inspector .widget.big button,
.litepanel button.big {
  font-size: 2em;
}

.inspector .wcontent button.micro {
  width: 20px;
  margin: 0 0 0 4px;
}

.inspector .dragger {
  display: inline-block;
  vertical-align: top;
  margin-left: 2px;
  /*margin-right: 2px;*/
}

.inspector .dragger .full {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}

.inspector .dragger input {
  color: #5AF;
  /*font-size: 0.8em;*/
  border: 0;
  background-color: transparent;
}

.inspector .dragger .full input {
  width: -moz-calc(100% - 14px);
  width: -webkit-calc(100% - 14px);
  width: calc(100% - 14px);
}

.inspector .drag_widget {
  display: inline-block;
  width: 0.5em;
  min-width: 6px;
  height: 1.1em;
  background: transparent url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAOCAYAAADjXQYbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA0NDk1MjdGOENFMTFFMUE0RDE4Mzk5RDUwMTkxQ0EiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA0NDk1MjhGOENFMTFFMUE0RDE4Mzk5RDUwMTkxQ0EiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDQ0OTUyNUY4Q0UxMUUxQTREMTgzOTlENTAxOTFDQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMDQ0OTUyNkY4Q0UxMUUxQTREMTgzOTlENTAxOTFDQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtL6rxoAAACMSURBVHjaYqytrWVAAhJA/ALGYUKS4AHiA1AaQzIfiNWBOAFdEqS6CMoG0czIkiABIShbEYhDYJJCSLpgoBREsADxXyB2ZsAEzCDJX0CcDLMHCXSAJL8DsSjMHig4C8T3YQ7qQ9NVj+za40B8BMo+BcRb0QOhG0rXYAshkOrpQLwbmyTIS7nIFgMEGABQBhYS6byJwQAAAABJRU5ErkJggg==") no-repeat center center;
  vertical-align: top;
  margin: 0 2px;
  cursor: n-resize;
}

.inspector .drag_widget.disabled {
  display: none;
  background: transparent none no-repeat;
  cursor: default;
}

.inspector input.color {
  text-align: center;
  margin-top: 1px;
  border-radius: 2px !important;
  border-bottom: 1px solid #666;
  border-top: 1px solid #111;
  width: -moz-calc(100% - 40px);
  width: -webkit-calc(100% - 40px);
  width: calc(100% - 40px);
  user-select: text;
  -moz-user-select: text;
  -webkit-user-select: text;
}

.inspector .whidden {
  position: relative;
  overflow: hidden;
  color: #5AF;
}

.inspector .whidden .filename {
  padding-left: 4px;
  cursor: pointer;
  display: inline-block;
  height: 1.2em;
  overflow: hidden;
}

.inspector input.file {
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  background-color: transparent;
  opacity: 0;
  width: 100%;
  cursor: pointer;
}

.inspector button {
  margin-bottom: 4px;
}

.inspector button.right {
  float: right;
  margin-right: 5px;
  margin-top: 2px;
}

.inspector .ui-slider {
  display: inline-block;
  width: -moz-calc(100% - 40px);
  width: -webkit-calc(100% - 40px);
  width: calc(100% - 40px);
  margin-left: 2px;
  margin-bottom: 0.2em;
}

.inspector .ui-widget-content {
  border: 1px solid black !important;
}

.inspector .ui-slider.nextline {
  margin-left: 100px;
  width: 140px;
}

.inspector.full .ui-slider.nextline {
  margin-left: 200px;
  width: 200px;
}

.inspector .itemname {
  display: inline-block;
  min-width: 50px;
}

.inspector .itemcontent {
  vertical-align: top;
  display: inline-block;
  margin-top: 10px;
  margin-left: 0px;
}

.inspector .itemvalue {
  color: #88C;
}

button.wcombobutton {
  width: auto !important;
  margin: 0 2px !important;
  padding: 2px 4px 2px 4px !important;
  border-radius: 0 !important;
}

button.wcombobutton.selected {
  background: #AAA;
}

.inspector .wtag {
  display: inline-block;
  border-radius: 2px;
  padding: 2px;
  margin: 1px;
  background-color: #AAF;
  color: black;
}

.inspector .wtag .close {
  display: inline-block;
  background-color: #222;
  color: #AAF;
  padding: 0 2px 0 2px;
  margin-left: 2px;
  border-radius: 2px;
  font-size: 0.8em;
  cursor: pointer;
}

.inspector .wtag .close:hover {
  background-color: #444;
}

.inspector ul.lite-list {
  margin: 2px;
  padding: 0;
  list-style-type: none;
  min-height: 2em;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.inspector ul.lite-list li {
  margin: 2px;
  padding: 2px;
  cursor: pointer;
  border-radius: 2px;
}

.inspector ul.lite-list li.selected {
  background-color: #336da7;
  color: white;
}

.inspector ul.lite-list li:hover {
  color: black;
  background-color: #258;
}

.inspector .row-index,
.inspector .row-cell,
.inspector .row-trash {
  display: inline-block;
  vertical-align: top;
}

.inspector .row-index {
  width: 30px;
  text-align: center;
}

.inspector .row-cell {
  width: calc(100% - 70px);
}

.inspector .row-trash {
  width: 30px;
}

/* Here goes all the CSS related to layout the web (panels, windows, bars, etc) */
html,
body {
  height: 100%;
  background-color: #111;
}

div {
  margin: 0;
  padding: 0;
}

.litegui-wrap {
  width: 1000px;
  height: 600px;
  margin: auto;
  background-color: #333;
}

.litegui-wrap.fullscreen {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.litegui-maincontent {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.litearea {
  vertical-align: top;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
}

.litepanel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.litedialog {
  position: absolute;
  z-index: 10;
}

.litepanel,
.litedialog {
  background-color: #444;
  box-sizing: border-box;
  overflow: hidden;
  background-image: linear-gradient(top, #444444, #333333);
  color: #888;
}

.litepanel .panel-header,
.litedialog .panel-header {
  font-size: 1em;
  line-height: 1.5;
  padding: 0 0.3em;
  background-color: #778;
  background-image: linear-gradient(right, #555, #333);
  background-image: -moz-linear-gradient(right, #555, #333);
  background-image: -webkit-linear-gradient(right, #555, #333);
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: white;
  width: 100%;
  min-height: 20px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  overflow: hidden;
}

.litepanel .panel-header button,
.litedialog .panel-header button {
  margin-top: 0;
  background-image: none;
  border: 0;
  box-shadow: 0 0 0 transparent;
  background-color: #333;
}

.litedialog.alert {
  font-size: 1.6em;
}

.litedialog.ui-draggable .panel-header {
  cursor: move;
}

.litepanel .content {
  height: calc(100% - 20px);
  overflow-y: auto;
}

.litepanel .panel-footer,
.litedialog .panel-footer {
  position: absolute;
  bottom: 0;
  font-size: 0.8em;
  margin: 2px;
  padding: 2px 0 0 2px;
  width: -moz-calc(100% - 6px);
  width: -webkit-calc(100% - 6px);
  width: calc(100% - 6px);
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  text-align: right;
}

.litedialog .panel-footer.resizable {
  cursor: s-resize;
}

.litedialog .resizable-corner {
  display: inline-block;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  cursor: se-resize;
  opacity: 0;
  background-color: red;
}

.litedialog .panel-footer button {
  font-size: inherit;
  padding: 0.1em 0.6em;
}

.litedialog .buttons {
  position: absolute;
  top: 2px;
  right: 2px;
}

.litedialog .content p {
  padding: 0.2em;
  margin: 0.2em;
}

.litemodalbg {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 100;
}

/*! normalize.css v2.0.1 | MIT License | git.io/normalize */
/* ==========================================================================
   HTML5 display definitions
   ========================================================================== */
/*
 * Corrects \`block\` display not defined in IE 8/9.
 */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
nav,
section,
summary {
  display: block;
}

/*
 * Corrects \`inline-block\` display not defined in IE 8/9.
 */
audio,
canvas,
video {
  display: inline-block;
}

/*
 * Prevents modern browsers from displaying \`audio\` without controls.
 * Remove excess height in iOS 5 devices.
 */
audio:not([controls]) {
  display: none;
  height: 0;
}

/*
 * Addresses styling for \`hidden\` attribute not present in IE 8/9.
 */
[hidden] {
  display: none;
}

/* ==========================================================================
   Base
   ========================================================================== */
/*
 * 1. Sets default font family to sans-serif.
 * 2. Prevents iOS text size adjust after orientation change, without disabling
 *    user zoom.
 */
html {
  font-family: sans-serif; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -ms-text-size-adjust: 100%; /* 2 */
}

/*
 * Removes default margin.
 */
body {
  margin: 0;
}

/* ==========================================================================
   Links
   ========================================================================== */
/*
 * Addresses \`outline\` inconsistency between Chrome and other browsers.
 */
a:focus {
  outline: thin dotted;
}

/*
 * Improves readability when focused and also mouse hovered in all browsers.
 */
a:active,
a:hover {
  outline: 0;
}

/* ==========================================================================
   Typography
   ========================================================================== */
/*
 * Addresses \`h1\` font sizes within \`section\` and \`article\` in Firefox 4+,
 * Safari 5, and Chrome.
 */
h1 {
  font-size: 2em;
}

/*
 * Addresses styling not present in IE 8/9, Safari 5, and Chrome.
 */
abbr[title] {
  border-bottom: 1px dotted;
}

/*
 * Addresses style set to \`bolder\` in Firefox 4+, Safari 5, and Chrome.
 */
b,
strong {
  font-weight: bold;
}

/*
 * Addresses styling not present in Safari 5 and Chrome.
 */
dfn {
  font-style: italic;
}

/*
 * Addresses styling not present in IE 8/9.
 */
mark {
  background: #ff0;
  color: #000;
}

/*
 * Corrects font family set oddly in Safari 5 and Chrome.
 */
code,
kbd,
pre,
samp {
  font-family: monospace, serif;
  font-size: 1em;
}

/*
 * Improves readability of pre-formatted text in all browsers.
 */
pre {
  white-space: pre;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/*
 * Sets consistent quote types.
 */
q {
  quotes: "\u201C" "\u201D" "\u2018" "\u2019";
}

/*
 * Addresses inconsistent and variable font size in all browsers.
 */
small {
  font-size: 80%;
}

/*
 * Prevents \`sub\` and \`sup\` affecting \`line-height\` in all browsers.
 */
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sup {
  top: -0.5em;
}

sub {
  bottom: -0.25em;
}

/* ==========================================================================
   Embedded content
   ========================================================================== */
/*
 * Removes border when inside \`a\` element in IE 8/9.
 */
img {
  border: 0;
}

/*
 * Corrects overflow displayed oddly in IE 9.
 */
svg:not(:root) {
  overflow: hidden;
}

/* ==========================================================================
   Figures
   ========================================================================== */
/*
 * Addresses margin not present in IE 8/9 and Safari 5.
 */
figure {
  margin: 0;
}

/* ==========================================================================
   Forms
   ========================================================================== */
/*
 * Define consistent border, margin, and padding.
 */
fieldset {
  border: 1px solid #c0c0c0;
  margin: 0 2px;
  padding: 0.35em 0.625em 0.75em;
}

/*
 * 1. Corrects color not being inherited in IE 8/9.
 * 2. Remove padding so people aren't caught out if they zero out fieldsets.
 */
legend {
  border: 0; /* 1 */
  padding: 0; /* 2 */
}

/*
 * 1. Corrects font family not being inherited in all browsers.
 * 2. Corrects font size not being inherited in all browsers.
 * 3. Addresses margins set differently in Firefox 4+, Safari 5, and Chrome
 */
button,
input,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 2 */
  margin: 0; /* 3 */
}

/*
 * Addresses Firefox 4+ setting \`line-height\` on \`input\` using \`!important\` in
 * the UA stylesheet.
 */
button,
input {
  line-height: normal;
}

/*
 * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native \`audio\`
 *    and \`video\` controls.
 * 2. Corrects inability to style clickable \`input\` types in iOS.
 * 3. Improves usability and consistency of cursor style between image-type
 *    \`input\` and others.
 */
button,
html input[type=button],
input[type=reset],
input[type=submit] {
  -webkit-appearance: button; /* 2 */
  cursor: pointer; /* 3 */
}

/*
 * Re-set default cursor for disabled elements.
 */
button[disabled],
input[disabled] {
  cursor: default;
}

/*
 * 1. Addresses box sizing set to \`content-box\` in IE 8/9.
 * 2. Removes excess padding in IE 8/9.
 */
input[type=checkbox],
input[type=radio] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/*
 * 1. Addresses \`appearance\` set to \`searchfield\` in Safari 5 and Chrome.
 * 2. Addresses \`box-sizing\` set to \`border-box\` in Safari 5 and Chrome
 *    (include \`-moz\` to future-proof).
 */
input[type=search] {
  -webkit-appearance: textfield; /* 1 */
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box; /* 2 */
  box-sizing: content-box;
}

/*
 * Removes inner padding and search cancel button in Safari 5 and Chrome
 * on OS X.
 */
input[type=search]::-webkit-search-cancel-button,
input[type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
 * Removes inner padding and border in Firefox 4+.
 */
button::-moz-focus-inner,
input::-moz-focus-inner {
  border: 0;
  padding: 0;
}

/*
 * 1. Removes default vertical scrollbar in IE 8/9.
 * 2. Improves readability and alignment in all browsers.
 */
textarea {
  overflow: auto; /* 1 */
  vertical-align: top; /* 2 */
}

/* ==========================================================================
   Tables
   ========================================================================== */
/*
 * Remove most spacing between table cells.
 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/****** litegui css/style.css */
*,
*:before,
*:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/* Here goes the css related to look and feel (buttons, lists, titles) */
body {
  font-family: "Arial";
  font-size: 14px;
  color: #AAA;
}

h1,
h2,
h3 {
  margin: 0;
  padding: 0;
}

h1 {
  color: #777;
  /*font-size: 32px;*/
  /*text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.125);*/
  padding-left: 10px;
  height: 40px;
}

a {
  color: #dc8;
  text-decoration: none;
}

a:hover {
  color: #fea;
  text-decoration: underline;
}

#menu-bar {
  background-color: #523074;
}

.litedialog .lite-menu ul {
  height: 24px;
}

.lite-menu ul {
  font-family: Tahoma, sans-serif;
  margin: 0;
  padding: 0;
  height: 2em;
  display: flex;
  align-items: center;
  background-color: #232323;
  border-bottom: 1px solid #523074;
}

.lite-menu li {
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  color: #999;
  display: inline-block;
  min-width: 50px;
  padding-left: 10px;
  padding-right: 10px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.lite-menu li:hover {
  background-color: #553e6d;
  color: #EEE;
}

.lite-menu-panel {
  position: absolute;
  z-index: 10;
  top: 5px;
  left: 5px;
  min-width: 200px;
  padding: 4px 0;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 3px black;
  background-color: #212121;
}

.lite-menu-entry,
.litemenu-title {
  font-size: 14px;
  color: #AAA;
  padding: 2px;
  margin: 2px;
  padding-left: 2px;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.lite-menu-entry .icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 2px;
  vertical-align: top;
}

.lite-menu-entry.checked .icon {
  background-color: #AAF;
}

.lite-menu-entry .more {
  float: right;
  padding-right: 5px;
}

.lite-menu-entry.disabled {
  opacity: 0.5;
  cursor: default;
}

.lite-menu-entry.separator {
  display: block;
  border-top: 1px solid #333;
  border-bottom: 1px solid #666;
  width: 100%;
  height: 0px;
  margin: 3px 0 2px 0;
  background-color: transparent;
  padding: 0 !important;
  cursor: default !important;
}

.lite-menu-entry.has_submenu {
  border-right: 2px solid cyan;
}

.litemenu-title {
  color: #DDE;
  background-color: #111;
  margin: 0;
  padding: 2px;
  cursor: default;
}

.lite-menu-entry:hover:not(.disabled):not(.separator) {
  background-color: #555;
  color: #EEE;
}

.litecontextmenu {
  position: fixed;
  top: 100px;
  left: 100px;
  min-width: 100px;
  color: #AAF;
  padding: 0;
  box-shadow: 0 0 10px black !important;
  background-color: #2E2E2E !important;
}

.litecontextmenu .litemenu-title img {
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 4px;
}

.litecontextmenu .lite-menu-entry {
  margin: 2px;
  padding: 2px;
}

.litecontextmenu .lite-menu-entry.submenu {
  background-color: #2E2E2E !important;
}

button.litebutton {
  background: -webkit-linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  background: -moz-linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  background: linear-gradient(#32302D, #4B4947) repeat scroll 0 0 transparent;
  border: 0 none;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0 1px 0 #5B5957 inset, 0 -1px 0 black, 0 1px 0 black, -1px 0 0 black, 1px 0 0 black, 0 1px 1px #111111;
  color: #CCC;
  display: inline-block;
  margin: 2px;
  padding: 2px;
  text-shadow: 0 1px 1px black;
  vertical-align: top;
}

button.litebutton.flat {
  background: #32302D;
  box-shadow: 0 0 0 transparent;
  border: 0;
}

button.litebutton:hover:not(:disabled) {
  background: #aab !important;
}

button.litebutton:active:not(:disabled) {
  background: #fff !important;
}

button.litebutton:focus:not(:disabled) {
  outline: 1px solid #777;
}

button.litebutton:disabled {
  opacity: 0.5;
}

.litedialog .content button.litebutton {
  vertical-align: initial;
}

.litedialog button.litebutton.mini-button {
  margin: 2px 2px 0 0;
  line-height: 0;
  padding: 0;
  width: 1.1em;
  height: 1.1em;
  box-shadow: 0 0 0;
  border: 1px solid #222;
}

button.litebutton.close-button {
  background-size: 100% auto;
}

.litetabs {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.litetabs.vertical {
  height: 100%;
}

.litetabs ul.wtabcontainer {
  min-height: 24px;
  margin: 0;
  padding: 0;
  padding-left: 2px;
  /*margin-top: 4px;*/
  list-style-type: none;
  border-bottom: 2px solid #666;
  overflow: hidden;
  white-space: nowrap;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.litetabs.vertical > ul.wtabcontainer {
  vertical-align: top;
  padding-left: 0;
  border-bottom: 0;
  height: 100%;
  display: inline-block;
}

.litetabs li.wtab {
  color: #AAA;
  text-align: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  transition: all 0.3s;
}

.litetabs li.wtab .tabtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.litetabs.horizontal > ul.wtabcontainer > li.wtab {
  display: inline-block;
  min-width: 50px;
  min-height: 20px;
  height: calc(100% - 2px);
  margin-right: 2px;
  margin-top: 2px;
  vertical-align: top;
  padding: 4px 8px 2px 4px;
  border-radius: 3px 3px 0 0;
}

.litetabs.vertical > ul.wtabcontainer > li.wtab {
  position: relative;
  display: block;
  min-height: 64px;
  margin: 0;
  margin-bottom: 2px;
  padding: 0;
  border: 0;
  width: 100%;
  border-radius: 3px 0 0 3px;
}

.litetabs.vertical > ul.wtabcontainer > li.wtab .tabbigicon {
  opacity: 0.5;
}

.litetabs .wtab.autoswitch * {
  pointer-events: none;
}

.litetabs li.wtab.selected {
  color: #EEE !important;
  background-color: #777;
  /*border: 1px solid #888;*/
  border-bottom: 0;
  /*box-shadow: 0 -2px 2px rgba(0,0,0,0.5);*/
}

.litetabs li.wtab.button {
  color: #EEE;
  background-color: #333;
  border-bottom: 2px;
}

.litetabs li.wtab:hover:not(.selected) {
  background-color: #555;
  color: #DDD;
}

.litetabs li.wtab.selected .tabbigicon,
.litetabs li.wtab:hover .tabbigicon {
  opacity: 1;
}

.litetabs.vertical > ul.wtabcontainer > li.wtab .tabtitle {
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  text-align: center;
  overflow: hidden;
}

.litetabs ul.wtabcontainer li.wtab .tabclose {
  margin-left: 6px;
  margin-right: -6px;
  border-radius: 2px;
  opacity: 0.2;
  transition: all 0.3s;
  padding: 2px;
}

.litetabs ul.wtabcontainer li.wtab:hover .tabclose {
  opacity: 0.5;
}

.litetabs ul.wtabcontainer li.wtab .tabclose:hover {
  color: white;
  background-color: #333;
  opacity: 1;
}

.litetabs .wtabcontent {
  position: relative;
  background-color: #333;
  display: inline-block;
}

.litetabs.horizontal > .wtabcontent {
  padding-left: 2px;
  padding-right: 2px;
}

.litetabs.vertical > .wtabcontent {
  padding: 0;
  height: 100%;
}

/** split ****/
.litesplit {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.litesplit .split-section {
  display: inline-block;
  vertical-align: top;
  margin: 0;
  padding: 0;
  height: 100%;
}

/**** LiteTree ***/
li.ltreeitem {
  list-style-type: none;
  cursor: pointer;
  /*background: url("../imgs/tree_lines_16x16.png") no-repeat scroll 5px -8px transparent;*/
  /*padding-left: 20px;*/
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

li.ltreeitem:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1);
}

li.ltreeitem:hover {
  background-color: #444;
}

/*
li.ltreeitem:nth-child(even) div.ltreeitemtitle {
	background-color: black;
}
*/
li.ltreeitem.root_item {
  background: transparent;
  padding-left: 0px;
}

li.ltreeitem div.ltreeitemtitle {
  color: #AAA;
  min-width: 100px;
  white-space: nowrap;
}

li.ltreeitem div.ltreeitemtitle .incontent:hover {
  color: white;
}

li.ltreeitem.selected div.ltreeitemtitle .incontent {
  color: #EC6;
}

li.ltreeitem.semiselected div.ltreeitemtitle .incontent {
  color: #A96;
}

li.ltreeitem div.ltreeitemtitle.dragover .incontent {
  background-color: #EC6;
  color: black;
  padding: 3px;
  border-radius: 2px;
  font-size: 2em;
}

ul.ltreeitemchildren {
  margin: 0;
  padding: 0;
  margin-left: -2px;
  list-style-type: none;
  /*background: url("../imgs/tree_lines_16x16.png") repeat-y transparent;*/
  /*outline: 1px #aaa dotted;*/
}

li.ltreeitem .ltreeitemtitle .precontent {
  margin-right: 4px;
}

li.ltreeitem .ltreeitemtitle .postcontent {
  margin-left: 4px;
}

li.ltreeitem.hidden,
li.ltreeitem.filtered {
  display: none;
}

.listbox {
  font-size: 1em;
  width: 0.9em;
  height: 0.9em;
  margin-left: -1px;
  margin-right: 0.5em;
  margin-bottom: 2px;
  line-height: 1em;
  display: inline-block;
  /*outline: 1px solid #678;*/
  text-align: center;
  color: #79A;
}

.listbox.empty {
  margin-left: 2px;
  width: 0.4em;
  height: 0.4em;
  color: #36A;
  background-color: #467;
  /* Hide the text. */
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.listbox:hover {
  color: white;
  background-color: rgba(100, 100, 100, 0.5);
}

/**** LiteList ***/
ul.litelist {
  height: 100%;
  width: 100%;
  background-color: #111;
  margin: 0;
  padding: 0;
}

ul.litelist li {
  margin: 0;
  padding: 2px;
  padding-left: 10px;
  list-style-type: none;
  cursor: pointer;
}

ul.litelist li:hover {
  background-color: #333;
}

ul.litelist li.selected {
  color: #EEE;
  background-color: #48A;
}

ul.litelist li.selected {
  position: relative;
  background: #88b7d5;
  border: 1px solid #c2e1f5;
}

ul.litelist li.selected:after,
ul.litelist li.selected:before {
  left: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

ul.litelist li.selected:after {
  border-color: rgba(136, 183, 213, 0);
  border-left-color: #88b7d5;
  border-width: 10px;
  top: 50%;
  margin-top: -10px;
}

ul.litelist li.selected:before {
  border-color: rgba(194, 225, 245, 0);
  border-left-color: #c2e1f5;
  border-width: 11px;
  top: 50%;
  margin-top: -11px;
}

::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  border: 1px solid #5c5c5c;
  border-radius: 16px;
  background: #282828;
}

::-webkit-scrollbar-thumb {
  background: #5c5c5c;
  border-radius: 12px;
}

::-webkit-scrollbar-corner {
  background: #666;
}

ul.file-list {
  overflow: auto;
  padding: 0 1em;
  margin: 0;
  background-color: #222;
  box-shadow: inset 0 0 3px black;
  height: 100%;
}

ul.file-list li.file-item {
  width: 10em;
  height: 11.2em;
  display: inline-block;
  vertical-align: top;
  margin: 0.5em;
  padding: 0;
  box-shadow: 0 0 2px black;
  overflow: hidden;
  background-color: #555;
  cursor: pointer;
  text-align: center;
  border-radius: 2px;
  position: relative;
}

ul.file-list li.file-item.filtered {
  display: none;
}

ul.file-list li.file-item .title {
  display: block;
  height: 20px;
  padding: 0.1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: black;
}

ul.file-list li.file-item button {
  position: absolute;
  bottom: 2px;
  left: 2px;
  background: #333;
  box-shadow: none;
  text-shadow: none;
  display: none;
  padding: 3px;
  border: 1px solid #EEE;
}

ul.file-list li.file-item:hover button {
  display: block;
}

ul.file-list li.file-item:hover {
  color: white;
  background-color: #888;
}

ul.file-list li.file-item.selected {
  outline: 1px dashed #EEE;
}

ul.file-list li.file-item img {
  max-width: 10em;
  max-height: 10em;
}

ul.file-list li.file-item span.info {
  font-size: 2em;
  display: block;
  margin-top: 1.8em;
}

.litesplitbar {
  background-color: #222;
  display: inline-block;
}

.litesplitbar:hover {
  background-color: #888;
  transition: all 0.5s;
  transition-delay: 0.3s;
}

.litesplitbar.horizontal {
  cursor: e-resize;
  width: 2px;
  height: 100%;
}

.litesplitbar.vertical {
  cursor: n-resize;
  width: 100%;
  height: 2px;
}

input {
  color: #55AAFF;
  background-color: #222;
  border: 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #888;
  border-radius: 3px;
  user-select: text;
  -moz-user-select: text;
  -webkit-user-select: text;
}

textarea.textfield {
  color: #55AAFF;
  background-color: #222;
  border: 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #888;
  border-radius: 3px;
}

.tinybox {
  width: 8px;
  height: 8px;
  margin: 2px;
  margin-bottom: 0px;
  display: inline-block;
  background-color: #44ffaa;
  opacity: 0.5;
}

.tinybox.ok {
  background-color: #33FF99;
  opacity: 1;
}

.litepad {
  position: relative;
  background-color: #222;
  cursor: pointer;
}

.litepad .litepad-handler {
  position: absolute;
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #660;
  border: 2px solid #AAF;
  border-radius: 10px;
  top: 0;
  left: 0;
  pointer-events: none;
}

.ellipsis {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

table.litetable {
  width: 100%;
  height: 100%;
  display: block;
}

table.litetable tr {
  display: block;
  width: 100%;
}

table.litetable th,
table.litetable td {
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

table.litetable th {
  color: #6c7ba7;
  background: #272a30;
  font-weight: bold;
  /*
     background: -webkit-linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
     background: -moz-linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
     background: linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
  */
}

table.litetable td {
  padding: 2px 4px;
}

table.litetable tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.1);
}

/********************/
.liteslider {
  display: inline-block;
  position: relative;
  width: calc(100% - 50px);
  height: 1.2em;
  cursor: pointer;
}

.liteslider-value {
  width: 42px;
  padding-left: 5px;
}

.widget .wcontent .inputfield {
  display: flex;
  height: 100%;
  align-items: center;
}

.slider-container {
  padding: 0 2px;
  flex: 1;
}

.liteslider {
  display: block;
  width: 100%;
  border-radius: 2px;
}

.colorpicker-window {
  position: absolute;
  top: 50px;
  left: 10px;
  background-color: #333;
  padding: 2px;
  font-size: 0.8em;
  color: #aaa;
}

.colorpicker-window input {
  border: 0;
}

.searchbox {
  padding: 2px;
  opacity: 0.5;
  transition: all 0.5s;
  width: 100%;
}

.searchbox input {
  padding: 2px 4px;
  outline: 0;
  width: 100%;
}

.searchbox input:focus {
  outline: 0;
}

.searchbox:hover {
  opacity: 1;
}

.litecheckbox {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: top;
  background-color: #1f1f1f;
  border: 0;
  border-radius: 2px;
  margin: 0 4px;
  margin-top: 2px;
  text-align: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.litecheckbox .on {
  background-color: #5AF;
  color: black;
}

.litecheckbox .flag {
  display: block;
  width: 100%;
  height: 100%;
  border: 2px solid black;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

.liteconsole {
  width: 100%;
  height: 100%;
  background-color: black;
  border: 1px solid #222;
}

.liteconsole .log {
  width: 100%;
  height: calc(100% - 26px);
  overflow: auto;
  color: #AAA;
  padding: 4px;
}

.liteconsole .log .msg {
  white-space: pre-wrap;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.liteconsole .log .msg.me {
  color: white;
}

.liteconsole .log .msg.msglog {
  color: #AAA;
}

.liteconsole .log .msg.msgwarn {
  color: #FFA;
}

.liteconsole .log .msg.msgerror {
  color: #FAA;
}

.liteconsole .log .msg.good {
  color: #AFA;
}

.liteconsole .foot {
  width: 100%;
  height: 24px;
  color: #111;
}

.liteconsole .foot input {
  width: 100%;
  height: 24px;
  color: white;
  background-color: black;
  border: 0;
  border-top: 1px solid #444;
  margin: 0;
  padding-left: 10px;
  resize: none;
}

.liteconsole .foot input:focus {
  outline: none;
}

.litecomplexlist {
  background-color: black;
  padding: 4px;
  overflow: auto;
}

.litecomplexlist .listitem {
  border-radius: 2px;
  margin: 2px;
  padding: 2px;
  background-color: #2A2A2A;
  cursor: pointer;
  line-height: 2em;
}

.litecomplexlist .listitem:hover {
  background-color: #363636;
}

.litecomplexlist .listitem.selected {
  background-color: #354a5f;
}

.litecomplexlist .listtitle {
  margin: 4px;
  margin-top: 10px;
  font-size: 1.2em;
  color: #AAA;
}

.litecomplexlist .listitem .title {
  color: #8e96a7;
  width: calc(100% - 60px);
  display: inline-block;
  padding-left: 10px;
  font-size: 1.2em;
  vertical-align: middle;
}

.litecomplexlist .listitem .tick {
  cursor: pointer;
  text-align: center;
  width: 24px;
  height: 24px;
  display: inline-block;
  margin: 4px;
  color: #AFA;
  vertical-align: top;
  background-color: black;
  border-radius: 2px;
}

.litecomplexlist .listitem .tick span {
  transform: translate(0, 0px);
  display: inline-block;
}

.litecomplexlist .listitem:not(.enabled) .tick {
  color: black;
}

.litecomplexlist .listitem button {
  border: 0;
  background-color: #363636;
  border-radius: 4px;
  color: #9c9c9c;
  vertical-align: middle;
  margin-bottom: 0;
}

.litecomplexlist .listtext {
  cursor: pointer;
  text-align: center;
}`,qr=(fs(gs),typeof global=="object"&&global&&global.Object===Object&&global),ms=typeof self=="object"&&self&&self.Object===Object&&self,Z=qr||ms||Function("return this")(),Q=Z.Symbol,Hr=Object.prototype,bs=Hr.hasOwnProperty,vs=Hr.toString,me=Q?Q.toStringTag:void 0;function ys(t){var e=bs.call(t,me),n=t[me];try{var i=!(t[me]=void 0)}catch{}var r=vs.call(t);return i&&(e?t[me]=n:delete t[me]),r}var _s=Object.prototype,ws=_s.toString;function xs(t){return ws.call(t)}var ks="[object Null]",As="[object Undefined]",Oi=Q?Q.toStringTag:void 0;function it(t){return t==null?t===void 0?As:ks:(Oi&&Oi in Object(t)?ys:xs)(t)}function U(t){return t!=null&&typeof t=="object"}var Es="[object Symbol]";function ct(t){return typeof t=="symbol"||U(t)&&it(t)==Es}var Ls=NaN;function zi(t){return typeof t=="number"?t:ct(t)?Ls:+t}function H(t,e){for(var n=-1,i=t==null?0:t.length,r=Array(i);++n<i;)r[n]=e(t[n],n,t);return r}var E=Array.isArray,Ss=1/0,Pi=Q?Q.prototype:void 0,ji=Pi?Pi.toString:void 0;function ut(t){if(typeof t=="string")return t;if(E(t))return H(t,ut)+"";if(ct(t))return ji?ji.call(t):"";var e=t+"";return e=="0"&&1/t==-Ss?"-0":e}function Ye(t,e){return function(n,i){var r;if(n===void 0&&i===void 0)return e;if(n!==void 0&&(r=n),i!==void 0){if(r===void 0)return i;i=typeof n=="string"||typeof i=="string"?(n=ut(n),ut(i)):(n=zi(n),zi(i)),r=t(n,i)}return r}}var Ts=Ye(function(t,e){return t+e},0),Cs=/\s/;function Gr(t){for(var e=t.length;e--&&Cs.test(t.charAt(e)););return e}var Is=/^\s+/;function Vr(t){return t&&t.slice(0,Gr(t)+1).replace(Is,"")}function G(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var $i=NaN,Rs=/^[-+]0x[0-9a-f]+$/i,Ms=/^0b[01]+$/i,Ns=/^0o[0-7]+$/i,Os=parseInt;function gt(t){if(typeof t=="number")return t;if(ct(t))return $i;if(typeof(t=G(t)?G(e=typeof t.valueOf=="function"?t.valueOf():t)?e+"":e:t)!="string")return t===0?t:+t;t=Vr(t);var e=Ms.test(t);return e||Ns.test(t)?Os(t.slice(2),e?2:8):Rs.test(t)?$i:+t}var Di=1/0,zs=17976931348623157e292;function Ot(t){return t?(t=gt(t))===Di||t===-Di?(t<0?-1:1)*zs:t==t?t:0:t===0?t:0}function T(e){var e=Ot(e),n=e%1;return e==e?n?e-n:e:0}var Ps="Expected a function";function js(t,e){if(typeof e!="function")throw new TypeError(Ps);return t=T(t),function(){if(--t<1)return e.apply(this,arguments)}}function et(t){return t}var $s="[object AsyncFunction]",Ds="[object Function]",Fs="[object GeneratorFunction]",Bs="[object Proxy]";function Tt(t){return G(t)?(t=it(t),t==Ds||t==Fs||t==$s||t==Bs):!1}var $e=Z["__core-js_shared__"],Fi=function(){var t=/[^.]+$/.exec($e&&$e.keys&&$e.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Ws(t){return!!Fi&&Fi in t}var qs=Function.prototype,Hs=qs.toString;function Qt(t){if(t!=null){try{return Hs.call(t)}catch{}try{return t+""}catch{}}return""}var Gs=/[\\^$.*+?()[\]{}|]/g,Vs=/^\[object .+?Constructor\]$/,Us=Function.prototype,Ys=Object.prototype,Xs=Us.toString,Zs=Ys.hasOwnProperty,Js=RegExp("^"+Xs.call(Zs).replace(Gs,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Ur(t){return!(!G(t)||Ws(t))&&(Tt(t)?Js:Vs).test(Qt(t))}function Ks(t,e){return t==null?void 0:t[e]}function te(t,e){return t=Ks(t,e),Ur(t)?t:void 0}var xe=te(Z,"WeakMap"),We=xe&&new xe,Yr=We?function(t,e){return We.set(t,e),t}:et,Bi=Object.create,ae=function(){function t(){}return function(e){return G(e)?Bi?Bi(e):(t.prototype=e,e=new t,t.prototype=void 0,e):{}}}();function ke(t){return function(){var e=arguments;switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])}var n=ae(t.prototype),i=t.apply(n,e);return G(i)?i:n}}var Qs=1;function tl(t,e,n){var i=e&Qs,r=ke(t);return function o(){return(this&&this!==Z&&this instanceof o?r:t).apply(i?n:this,arguments)}}function dt(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}var el=Math.max;function Xr(t,e,n,i){for(var r=-1,o=t.length,a=n.length,s=-1,l=e.length,p=el(o-a,0),u=Array(l+p),d=!i;++s<l;)u[s]=e[s];for(;++r<a;)(d||r<o)&&(u[n[r]]=t[r]);for(;p--;)u[s++]=t[r++];return u}var nl=Math.max;function Zr(t,e,n,i){for(var r=-1,o=t.length,a=-1,s=n.length,l=-1,p=e.length,u=nl(o-s,0),d=Array(u+p),f=!i;++r<u;)d[r]=t[r];for(var h=r;++l<p;)d[h+l]=e[l];for(;++a<s;)(f||r<o)&&(d[h+n[a]]=t[r++]);return d}function il(t,e){for(var n=t.length,i=0;n--;)t[n]===e&&++i;return i}function Xe(){}var rl=4294967295;function M(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=rl,this.__views__=[]}function Wn(){}M.prototype=ae(Xe.prototype),M.prototype.constructor=M;var qn=We?function(t){return We.get(t)}:Wn,re={},ol=Object.prototype,al=ol.hasOwnProperty;function De(t){for(var e=t.name+"",n=re[e],i=al.call(re,e)?n.length:0;i--;){var r=n[i],o=r.func;if(o==null||o==t)return r.name}return e}function mt(t,e){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!e,this.__index__=0,this.__values__=void 0}function rt(t,e){var n=-1,i=t.length;for(e=e||Array(i);++n<i;)e[n]=t[n];return e}function Jr(t){if(t instanceof M)return t.clone();var e=new mt(t.__wrapped__,t.__chain__);return e.__actions__=rt(t.__actions__),e.__index__=t.__index__,e.__values__=t.__values__,e}mt.prototype=ae(Xe.prototype),mt.prototype.constructor=mt;var sl=Object.prototype,ll=sl.hasOwnProperty;function c(t){if(U(t)&&!E(t)&&!(t instanceof M)){if(t instanceof mt)return t;if(ll.call(t,"__wrapped__"))return Jr(t)}return new mt(t)}function Tn(t){var e=De(t),n=c[e];return typeof n!="function"||!(e in M.prototype)?!1:t===n?!0:(e=qn(n),!!e&&t===e[0])}c.prototype=Xe.prototype,c.prototype.constructor=c;var cl=800,ul=16,dl=Date.now;function Kr(t){var e=0,n=0;return function(){var i=dl(),r=ul-(i-n);if(n=i,0<r){if(++e>=cl)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var Qr=Kr(Yr),pl=/\{\n\/\* \[wrapped with (.+)\] \*/,hl=/,? & /;function fl(t){return t=t.match(pl),t?t[1].split(hl):[]}var gl=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;function ml(t,e){var n=e.length;if(!n)return t;var i=n-1;return e[i]=(1<n?"& ":"")+e[i],e=e.join(2<n?", ":" "),t.replace(gl,`{
/* [wrapped with `+e+`] */
`)}function Hn(t){return function(){return t}}var qe=function(){try{var t=te(Object,"defineProperty");return t({},"",{}),t}catch{}}(),bl=qe?function(t,e){return qe(t,"toString",{configurable:!0,enumerable:!1,value:Hn(e),writable:!0})}:et,Gn=Kr(bl);function ft(t,e){for(var n=-1,i=t==null?0:t.length;++n<i&&e(t[n],n,t)!==!1;);return t}function Ze(t,e,n,i){for(var r=t.length,o=n+(i?1:-1);i?o--:++o<r;)if(e(t[o],o,t))return o;return-1}function to(t){return t!=t}function vl(t,e,n){for(var i=n-1,r=t.length;++i<r;)if(t[i]===e)return i;return-1}function se(t,e,n){return e==e?vl(t,e,n):Ze(t,to,n)}function Je(t,e){return!!(t!=null&&t.length)&&-1<se(t,e,0)}var yl=1,_l=2,wl=8,xl=16,kl=32,Al=64,El=128,Ll=256,Sl=512,Tl=[["ary",El],["bind",yl],["bindKey",_l],["curry",wl],["curryRight",xl],["flip",Sl],["partial",kl],["partialRight",Al],["rearg",Ll]];function Cl(t,e){return ft(Tl,function(n){var i="_."+n[0];e&n[1]&&!Je(t,i)&&t.push(i)}),t.sort()}function eo(t,e,n){return e+="",Gn(t,ml(e,Cl(fl(e),n)))}var Il=1,Rl=2,Ml=4,Nl=8,Wi=32,qi=64;function no(t,e,n,i,d,f,a,s,l,p){var u=e&Nl,d=((e=(e|(u?Wi:qi))&~(u?qi:Wi))&Ml||(e&=~(Il|Rl)),[t,e,d,u?f:void 0,u?a:void 0,u?void 0:f,u?void 0:a,s,l,p]),f=n.apply(void 0,d);return Tn(t)&&Qr(f,d),f.placeholder=i,eo(f,t,e)}function le(t){return t.placeholder}var Ol=9007199254740991,zl=/^(?:0|[1-9]\d*)$/;function zt(t,e){var n=typeof t;return!!(e=e==null?Ol:e)&&(n=="number"||n!="symbol"&&zl.test(t))&&-1<t&&t%1==0&&t<e}var Pl=Math.min;function jl(t,e){for(var n=t.length,i=Pl(e.length,n),r=rt(t);i--;){var o=e[i];t[i]=zt(o,n)?r[o]:void 0}return t}var Hi="__lodash_placeholder__";function Dt(t,e){for(var n=-1,i=t.length,r=0,o=[];++n<i;){var a=t[n];a!==e&&a!==Hi||(t[n]=Hi,o[r++]=n)}return o}var $l=1,Dl=2,Fl=8,Bl=16,Wl=128,ql=512;function Ke(t,e,n,i,r,o,a,s,l,p){var u=e&Wl,d=e&$l,f=e&Dl,h=e&(Fl|Bl),g=e&ql,b=f?void 0:ke(t);return function y(){for(var F=arguments.length,w=Array(F),I=F;I--;)w[I]=arguments[I];if(h&&(D=il(w,R=le(y))),i&&(w=Xr(w,i,r,h)),o&&(w=Zr(w,o,a,h)),F-=D,h&&F<p)return D=Dt(w,R),no(t,e,Ke,y.placeholder,n,w,D,s,l,p-F);var R=d?n:this,D=f?R[t]:t,F=w.length;return s?w=jl(w,s):g&&1<F&&w.reverse(),u&&l<F&&(w.length=l),(D=this&&this!==Z&&this instanceof y?b||ke(D):D).apply(R,w)}}function Hl(t,e,n){var i=ke(t);return function r(){for(var o=arguments.length,a=Array(o),s=o,l=le(r);s--;)a[s]=arguments[s];return l=o<3&&a[0]!==l&&a[o-1]!==l?[]:Dt(a,l),(o-=l.length)<n?no(t,e,Ke,r.placeholder,void 0,a,l,void 0,void 0,n-o):dt(this&&this!==Z&&this instanceof r?i:t,this,a)}}var Gl=1;function Vl(t,e,n,i){var r=e&Gl,o=ke(t);return function a(){for(var s=-1,l=arguments.length,p=-1,u=i.length,d=Array(u+l),f=this&&this!==Z&&this instanceof a?o:t;++p<u;)d[p]=i[p];for(;l--;)d[p++]=arguments[++s];return dt(f,r?n:this,d)}}var Gi="__lodash_placeholder__",bn=1,Ul=2,Yl=4,Vi=8,be=128,Ui=256,Xl=Math.min;function Zl(t,e){var n,i=t[1],r=e[1],o=i|r,a=r==be&&i==Vi||r==be&&i==Ui&&t[7].length<=e[8]||r==(be|Ui)&&e[7].length<=e[8]&&i==Vi;return(o<(bn|Ul|be)||a)&&(r&bn&&(t[2]=e[2],o|=i&bn?0:Yl),(a=e[3])&&(n=t[3],t[3]=n?Xr(n,a,e[4]):a,t[4]=n?Dt(t[3],Gi):e[4]),(a=e[5])&&(n=t[5],t[5]=n?Zr(n,a,e[6]):a,t[6]=n?Dt(t[5],Gi):e[6]),(a=e[7])&&(t[7]=a),r&be&&(t[8]=t[8]==null?e[8]:Xl(t[8],e[8])),t[9]==null&&(t[9]=e[9]),t[0]=e[0],t[1]=o),t}var Jl="Expected a function",Yi=1,Kl=2,vn=8,yn=16,_n=32,Xi=64,Zi=Math.max;function Pt(t,e,n,i,r,o,a,s){var l=e&Kl;if(!l&&typeof t!="function")throw new TypeError(Jl);var p,u=i?i.length:0,d=(u||(e&=~(_n|Xi),i=r=void 0),a=a===void 0?a:Zi(T(a),0),s=s===void 0?s:T(s),u-=r?r.length:0,e&Xi&&(f=i,p=r,i=r=void 0),l?void 0:qn(t)),f=[t,e,n,i,r,f,p,o,a,s];return d&&Zl(f,d),t=f[0],e=f[1],n=f[2],i=f[3],r=f[4],!(s=f[9]=f[9]===void 0?l?0:t.length:Zi(f[9]-u,0))&&e&(vn|yn)&&(e&=~(vn|yn)),p=e&&e!=Yi?e==vn||e==yn?Hl(t,e,s):e!=_n&&e!=(Yi|_n)||r.length?Ke.apply(void 0,f):Vl(t,e,n,i):tl(t,e,n),eo((d?Yr:Qr)(p,f),t,e)}var Ql=128;function io(t,e,n){return e=n?void 0:e,e=t&&e==null?t.length:e,Pt(t,Ql,void 0,void 0,void 0,void 0,e)}function jt(t,e,n){e=="__proto__"&&qe?qe(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}function At(t,e){return t===e||t!=t&&e!=e}var tc=Object.prototype,ec=tc.hasOwnProperty;function Ce(t,e,n){var i=t[e];ec.call(t,e)&&At(i,n)&&(n!==void 0||e in t)||jt(t,e,n)}function Ct(t,e,n,i){for(var r=!n,o=(n=n||{},-1),a=e.length;++o<a;){var s=e[o],l=i?i(n[s],t[s],s,n,t):void 0;(r?jt:Ce)(n,s,l=l===void 0?t[s]:l)}return n}var Ji=Math.max;function ro(t,e,n){return e=Ji(e===void 0?t.length-1:e,0),function(){for(var i=arguments,r=-1,o=Ji(i.length-e,0),a=Array(o);++r<o;)a[r]=i[e+r];for(var r=-1,s=Array(e+1);++r<e;)s[r]=i[r];return s[e]=n(a),dt(t,this,s)}}function C(t,e){return Gn(ro(t,e,et),t+"")}var nc=9007199254740991;function Qe(t){return typeof t=="number"&&-1<t&&t%1==0&&t<=nc}function ot(t){return t!=null&&Qe(t.length)&&!Tt(t)}function nt(t,e,n){if(!G(n))return!1;var i=typeof e;return!!(i=="number"?ot(n)&&zt(e,n.length):i=="string"&&e in n)&&At(n[e],t)}function ce(t){return C(function(e,n){var i=-1,r=n.length,a=1<r?n[r-1]:void 0,o=2<r?n[2]:void 0,a=3<t.length&&typeof a=="function"?(r--,a):void 0;for(o&&nt(n[0],n[1],o)&&(a=r<3?void 0:a,r=1),e=Object(e);++i<r;){var s=n[i];s&&t(e,s,i,a)}return e})}var ic=Object.prototype;function Ie(t){var e=t&&t.constructor;return t===(typeof e=="function"&&e.prototype||ic)}function Vn(t,e){for(var n=-1,i=Array(t);++n<t;)i[n]=e(n);return i}var rc="[object Arguments]";function Ki(t){return U(t)&&it(t)==rc}var oo=Object.prototype,oc=oo.hasOwnProperty,ac=oo.propertyIsEnumerable,Kt=Ki(function(){return arguments}())?Ki:function(t){return U(t)&&oc.call(t,"callee")&&!ac.call(t,"callee")};function Un(){return!1}var ao=typeof st=="object"&&st&&!st.nodeType&&st,Qi=ao&&typeof lt=="object"&&lt&&!lt.nodeType&&lt,sc=Qi&&Qi.exports===ao,tr=sc?Z.Buffer:void 0,lc=tr?tr.isBuffer:void 0,Ft=lc||Un,cc="[object Arguments]",uc="[object Array]",dc="[object Boolean]",pc="[object Date]",hc="[object Error]",fc="[object Function]",gc="[object Map]",mc="[object Number]",bc="[object Object]",vc="[object RegExp]",yc="[object Set]",_c="[object String]",wc="[object WeakMap]",xc="[object ArrayBuffer]",kc="[object DataView]",Ac="[object Float32Array]",Ec="[object Float64Array]",Lc="[object Int8Array]",Sc="[object Int16Array]",Tc="[object Int32Array]",Cc="[object Uint8Array]",Ic="[object Uint8ClampedArray]",Rc="[object Uint16Array]",Mc="[object Uint32Array]",q={};function Nc(t){return U(t)&&Qe(t.length)&&!!q[it(t)]}function pt(t){return function(e){return t(e)}}q[Ac]=q[Ec]=q[Lc]=q[Sc]=q[Tc]=q[Cc]=q[Ic]=q[Rc]=q[Mc]=!0,q[cc]=q[uc]=q[xc]=q[dc]=q[kc]=q[pc]=q[hc]=q[fc]=q[gc]=q[mc]=q[bc]=q[vc]=q[yc]=q[_c]=q[wc]=!1;var so=typeof st=="object"&&st&&!st.nodeType&&st,we=so&&typeof lt=="object"&&lt&&!lt.nodeType&&lt,Oc=we&&we.exports===so,wn=Oc&&qr.process,vt=function(){try{var t=we&&we.require&&we.require("util").types;return t||wn&&wn.binding&&wn.binding("util")}catch{}}(),er=vt&&vt.isTypedArray,ue=er?pt(er):Nc,zc=Object.prototype,Pc=zc.hasOwnProperty;function lo(t,e){var n,i=E(t),r=!i&&Kt(t),o=!i&&!r&&Ft(t),a=!i&&!r&&!o&&ue(t),s=i||r||o||a,l=s?Vn(t.length,String):[],p=l.length;for(n in t)!e&&!Pc.call(t,n)||s&&(n=="length"||o&&(n=="offset"||n=="parent")||a&&(n=="buffer"||n=="byteLength"||n=="byteOffset")||zt(n,p))||l.push(n);return l}function co(t,e){return function(n){return t(e(n))}}var jc=co(Object.keys,Object),$c=Object.prototype,Dc=$c.hasOwnProperty;function Yn(t){if(!Ie(t))return jc(t);var e,n=[];for(e in Object(t))Dc.call(t,e)&&e!="constructor"&&n.push(e);return n}function X(t){return(ot(t)?lo:Yn)(t)}var Fc=Object.prototype,Bc=Fc.hasOwnProperty,Wc=ce(function(t,e){if(Ie(e)||ot(e))Ct(e,X(e),t);else for(var n in e)Bc.call(e,n)&&Ce(t,n,e[n])});function qc(t){var e=[];if(t!=null)for(var n in Object(t))e.push(n);return e}var Hc=Object.prototype,Gc=Hc.hasOwnProperty;function Vc(t){if(!G(t))return qc(t);var e,n=Ie(t),i=[];for(e in t)(e!="constructor"||!n&&Gc.call(t,e))&&i.push(e);return i}function at(t){return ot(t)?lo(t,!0):Vc(t)}var nr=ce(function(t,e){Ct(e,at(e),t)}),He=ce(function(t,e,n,i){Ct(e,at(e),t,i)}),Uc=ce(function(t,e,n,i){Ct(e,X(e),t,i)}),Yc=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Xc=/^\w*$/;function Xn(t,e){if(E(t))return!1;var n=typeof t;return!(n!="number"&&n!="symbol"&&n!="boolean"&&t!=null&&!ct(t))||Xc.test(t)||!Yc.test(t)||e!=null&&t in Object(e)}var Ae=te(Object,"create");function Zc(){this.__data__=Ae?Ae(null):{},this.size=0}function Jc(t){return t=this.has(t)&&delete this.__data__[t],this.size-=t?1:0,t}var Kc="__lodash_hash_undefined__",Qc=Object.prototype,tu=Qc.hasOwnProperty;function eu(t){var e,n=this.__data__;return Ae?(e=n[t])===Kc?void 0:e:tu.call(n,t)?n[t]:void 0}var nu=Object.prototype,iu=nu.hasOwnProperty;function ru(t){var e=this.__data__;return Ae?e[t]!==void 0:iu.call(e,t)}var ou="__lodash_hash_undefined__";function au(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=Ae&&e===void 0?ou:e,this}function Zt(t){var e=-1,n=t==null?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}function su(){this.__data__=[],this.size=0}function tn(t,e){for(var n=t.length;n--;)if(At(t[n][0],e))return n;return-1}Zt.prototype.clear=Zc,Zt.prototype.delete=Jc,Zt.prototype.get=eu,Zt.prototype.has=ru,Zt.prototype.set=au;var lu=Array.prototype,cu=lu.splice;function uu(n){var e=this.__data__,n=tn(e,n);return!(n<0)&&(n==e.length-1?e.pop():cu.call(e,n,1),--this.size,!0)}function du(n){var e=this.__data__,n=tn(e,n);return n<0?void 0:e[n][1]}function pu(t){return-1<tn(this.__data__,t)}function hu(t,e){var n=this.__data__,i=tn(n,t);return i<0?(++this.size,n.push([t,e])):n[i][1]=e,this}function Mt(t){var e=-1,n=t==null?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}Mt.prototype.clear=su,Mt.prototype.delete=uu,Mt.prototype.get=du,Mt.prototype.has=pu,Mt.prototype.set=hu;var Ee=te(Z,"Map");function fu(){this.size=0,this.__data__={hash:new Zt,map:new(Ee||Mt),string:new Zt}}function gu(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function en(t,e){return t=t.__data__,gu(e)?t[typeof e=="string"?"string":"hash"]:t.map}function mu(t){return t=en(this,t).delete(t),this.size-=t?1:0,t}function bu(t){return en(this,t).get(t)}function vu(t){return en(this,t).has(t)}function yu(t,e){var n=en(this,t),i=n.size;return n.set(t,e),this.size+=n.size==i?0:1,this}function Nt(t){var e=-1,n=t==null?0:t.length;for(this.clear();++e<n;){var i=t[e];this.set(i[0],i[1])}}Nt.prototype.clear=fu,Nt.prototype.delete=mu,Nt.prototype.get=bu,Nt.prototype.has=vu,Nt.prototype.set=yu;var _u="Expected a function";function nn(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(_u);function n(){var i=arguments,r=e?e.apply(this,i):i[0],o=n.cache;return o.has(r)?o.get(r):(i=t.apply(this,i),n.cache=o.set(r,i)||o,i)}return n.cache=new(nn.Cache||Nt),n}nn.Cache=Nt;var wu=500;function xu(e){var e=nn(e,function(i){return n.size===wu&&n.clear(),i}),n=e.cache;return e}var ku=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Au=/\\(\\)?/g,uo=xu(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ku,function(n,i,r,o){e.push(r?o.replace(Au,"$1"):i||n)}),e});function P(t){return t==null?"":ut(t)}function Wt(t,e){return E(t)?t:Xn(t,e)?[t]:uo(P(t))}var Eu=1/0;function It(t){if(typeof t=="string"||ct(t))return t;var e=t+"";return e=="0"&&1/t==-Eu?"-0":e}function ee(t,e){for(var n=0,i=(e=Wt(e,t)).length;t!=null&&n<i;)t=t[It(e[n++])];return n&&n==i?t:void 0}function Zn(t,e,n){return t=t==null?void 0:ee(t,e),t===void 0?n:t}function Jn(t,e){for(var n=-1,i=e.length,r=Array(i),o=t==null;++n<i;)r[n]=o?void 0:Zn(t,e[n]);return r}function qt(t,e){for(var n=-1,i=e.length,r=t.length;++n<i;)t[r+n]=e[n];return t}var ir=Q?Q.isConcatSpreadable:void 0;function Lu(t){return E(t)||Kt(t)||!!(ir&&t&&t[ir])}function J(t,e,n,i,r){var o=-1,a=t.length;for(n=n||Lu,r=r||[];++o<a;){var s=t[o];0<e&&n(s)?1<e?J(s,e-1,n,i,r):qt(r,s):i||(r[r.length]=s)}return r}function po(t){return t!=null&&t.length?J(t,1):[]}function $t(t){return Gn(ro(t,void 0,po),t+"")}var Su=$t(Jn),rn=co(Object.getPrototypeOf,Object),Tu="[object Object]",Cu=Function.prototype,Iu=Object.prototype,ho=Cu.toString,Ru=Iu.hasOwnProperty,Mu=ho.call(Object);function Re(t){return!U(t)||it(t)!=Tu?!1:(t=rn(t),t===null?!0:(t=Ru.call(t,"constructor")&&t.constructor,typeof t=="function"&&t instanceof t&&ho.call(t)==Mu))}var Nu="[object DOMException]",Ou="[object Error]";function Kn(t){if(!U(t))return!1;var e=it(t);return e==Ou||e==Nu||typeof t.message=="string"&&typeof t.name=="string"&&!Re(t)}var fo=C(function(t,e){try{return dt(t,void 0,e)}catch(n){return Kn(n)?n:new Error(n)}}),zu="Expected a function";function go(t,e){var n;if(typeof e!="function")throw new TypeError(zu);return t=T(t),function(){return 0<--t&&(n=e.apply(this,arguments)),t<=1&&(e=void 0),n}}var Pu=1,ju=32,Ge=C(function(t,e,n){var i,r=Pu;return n.length&&(i=Dt(n,le(Ge)),r|=ju),Pt(t,r,e,n,i)}),$u=(Ge.placeholder={},$t(function(t,e){return ft(e,function(n){n=It(n),jt(t,n,Ge(t[n],t))}),t})),Du=1,Fu=2,Bu=32,Qn=C(function(t,e,n){var i,r=Du|Fu;return n.length&&(i=Dt(n,le(Qn)),r|=Bu),Pt(e,r,t,n,i)});function yt(t,e,n){for(var i=-1,r=t.length,o=((n=r<n?r:n)<0&&(n+=r),r=n<(e=e<0?r<-e?0:r+e:e)?0:n-e>>>0,e>>>=0,Array(r));++i<r;)o[i]=t[i+e];return o}function Ht(t,e,n){var i=t.length;return n=n===void 0?i:n,!e&&i<=n?t:yt(t,e,n)}Qn.placeholder={};var Wu="\\ud800-\\udfff",qu="\\u0300-\\u036f",Hu="\\ufe20-\\ufe2f",Gu="\\u20d0-\\u20ff",Vu=qu+Hu+Gu,Uu="\\ufe0e\\ufe0f",Yu="\\u200d",Xu=RegExp("["+Yu+Wu+Vu+Uu+"]");function de(t){return Xu.test(t)}function Zu(t){return t.split("")}var mo="\\ud800-\\udfff",Ju="\\u0300-\\u036f",Ku="\\ufe20-\\ufe2f",Qu="\\u20d0-\\u20ff",td=Ju+Ku+Qu,ed="\\ufe0e\\ufe0f",nd="["+mo+"]",Cn="["+td+"]",In="\\ud83c[\\udffb-\\udfff]",id="(?:"+Cn+"|"+In+")",bo="[^"+mo+"]",vo="(?:\\ud83c[\\udde6-\\uddff]){2}",yo="[\\ud800-\\udbff][\\udc00-\\udfff]",rd="\\u200d",_o=id+"?",wo="["+ed+"]?",od="(?:"+rd+"(?:"+[bo,vo,yo].join("|")+")"+wo+_o+")*",ad=wo+_o+od,sd="(?:"+[bo+Cn+"?",Cn,vo,yo,nd].join("|")+")",ld=RegExp(In+"(?="+In+")|"+sd+ad,"g");function cd(t){return t.match(ld)||[]}function kt(t){return(de(t)?cd:Zu)(t)}function xo(t){return function(e){var i=de(e=P(e))?kt(e):void 0,n=i?i[0]:e.charAt(0),i=i?Ht(i,1).join(""):e.slice(1);return n[t]()+i}}var ti=xo("toUpperCase");function ko(t){return ti(P(t).toLowerCase())}function ei(t,e,n,i){var r=-1,o=t==null?0:t.length;for(i&&o&&(n=t[++r]);++r<o;)n=e(n,t[r],r,t);return n}function ni(t){return function(e){return t==null?void 0:t[e]}}var ud={\u00C0:"A",\u00C1:"A",\u00C2:"A",\u00C3:"A",\u00C4:"A",\u00C5:"A",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E4:"a",\u00E5:"a",\u00C7:"C",\u00E7:"c",\u00D0:"D",\u00F0:"d",\u00C8:"E",\u00C9:"E",\u00CA:"E",\u00CB:"E",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00CC:"I",\u00CD:"I",\u00CE:"I",\u00CF:"I",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00D1:"N",\u00F1:"n",\u00D2:"O",\u00D3:"O",\u00D4:"O",\u00D5:"O",\u00D6:"O",\u00D8:"O",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F6:"o",\u00F8:"o",\u00D9:"U",\u00DA:"U",\u00DB:"U",\u00DC:"U",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FC:"u",\u00DD:"Y",\u00FD:"y",\u00FF:"y",\u00C6:"Ae",\u00E6:"ae",\u00DE:"Th",\u00FE:"th",\u00DF:"ss",\u0100:"A",\u0102:"A",\u0104:"A",\u0101:"a",\u0103:"a",\u0105:"a",\u0106:"C",\u0108:"C",\u010A:"C",\u010C:"C",\u0107:"c",\u0109:"c",\u010B:"c",\u010D:"c",\u010E:"D",\u0110:"D",\u010F:"d",\u0111:"d",\u0112:"E",\u0114:"E",\u0116:"E",\u0118:"E",\u011A:"E",\u0113:"e",\u0115:"e",\u0117:"e",\u0119:"e",\u011B:"e",\u011C:"G",\u011E:"G",\u0120:"G",\u0122:"G",\u011D:"g",\u011F:"g",\u0121:"g",\u0123:"g",\u0124:"H",\u0126:"H",\u0125:"h",\u0127:"h",\u0128:"I",\u012A:"I",\u012C:"I",\u012E:"I",\u0130:"I",\u0129:"i",\u012B:"i",\u012D:"i",\u012F:"i",\u0131:"i",\u0134:"J",\u0135:"j",\u0136:"K",\u0137:"k",\u0138:"k",\u0139:"L",\u013B:"L",\u013D:"L",\u013F:"L",\u0141:"L",\u013A:"l",\u013C:"l",\u013E:"l",\u0140:"l",\u0142:"l",\u0143:"N",\u0145:"N",\u0147:"N",\u014A:"N",\u0144:"n",\u0146:"n",\u0148:"n",\u014B:"n",\u014C:"O",\u014E:"O",\u0150:"O",\u014D:"o",\u014F:"o",\u0151:"o",\u0154:"R",\u0156:"R",\u0158:"R",\u0155:"r",\u0157:"r",\u0159:"r",\u015A:"S",\u015C:"S",\u015E:"S",\u0160:"S",\u015B:"s",\u015D:"s",\u015F:"s",\u0161:"s",\u0162:"T",\u0164:"T",\u0166:"T",\u0163:"t",\u0165:"t",\u0167:"t",\u0168:"U",\u016A:"U",\u016C:"U",\u016E:"U",\u0170:"U",\u0172:"U",\u0169:"u",\u016B:"u",\u016D:"u",\u016F:"u",\u0171:"u",\u0173:"u",\u0174:"W",\u0175:"w",\u0176:"Y",\u0177:"y",\u0178:"Y",\u0179:"Z",\u017B:"Z",\u017D:"Z",\u017A:"z",\u017C:"z",\u017E:"z",\u0132:"IJ",\u0133:"ij",\u0152:"Oe",\u0153:"oe",\u0149:"'n",\u017F:"s"},dd=ni(ud),pd=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,hd="\\u0300-\\u036f",fd="\\ufe20-\\ufe2f",gd="\\u20d0-\\u20ff",md=hd+fd+gd,bd="["+md+"]",vd=RegExp(bd,"g");function Ao(t){return(t=P(t))&&t.replace(pd,dd).replace(vd,"")}var yd=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;function _d(t){return t.match(yd)||[]}var wd=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;function xd(t){return wd.test(t)}var Eo="\\ud800-\\udfff",kd="\\u0300-\\u036f",Ad="\\ufe20-\\ufe2f",Ed="\\u20d0-\\u20ff",Ld=kd+Ad+Ed,Lo="\\u2700-\\u27bf",So="a-z\\xdf-\\xf6\\xf8-\\xff",Sd="\\xac\\xb1\\xd7\\xf7",Td="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",Cd="\\u2000-\\u206f",Id=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",To="A-Z\\xc0-\\xd6\\xd8-\\xde",Rd="\\ufe0e\\ufe0f",Co=Sd+Td+Cd+Id,Io="['\u2019]",rr="["+Co+"]",Md="["+Ld+"]",Ro="\\d+",Nd="["+Lo+"]",Mo="["+So+"]",No="[^"+Eo+Co+Ro+Lo+So+To+"]",Od="\\ud83c[\\udffb-\\udfff]",zd="(?:"+Md+"|"+Od+")",Pd="[^"+Eo+"]",Oo="(?:\\ud83c[\\udde6-\\uddff]){2}",zo="[\\ud800-\\udbff][\\udc00-\\udfff]",ie="["+To+"]",jd="\\u200d",or="(?:"+Mo+"|"+No+")",$d="(?:"+ie+"|"+No+")",ar="(?:"+Io+"(?:d|ll|m|re|s|t|ve))?",sr="(?:"+Io+"(?:D|LL|M|RE|S|T|VE))?",Po=zd+"?",jo="["+Rd+"]?",Dd="(?:"+jd+"(?:"+[Pd,Oo,zo].join("|")+")"+jo+Po+")*",Fd="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",Bd="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",Wd=jo+Po+Dd,qd="(?:"+[Nd,Oo,zo].join("|")+")"+Wd,Hd=RegExp([ie+"?"+Mo+"+"+ar+"(?="+[rr,ie,"$"].join("|")+")",$d+"+"+sr+"(?="+[rr,ie+or,"$"].join("|")+")",ie+"?"+or+"+"+ar,ie+"+"+sr,Bd,Fd,Ro,qd].join("|"),"g");function Gd(t){return t.match(Hd)||[]}function $o(t,e,n){return t=P(t),(e=n?void 0:e)===void 0?(xd(t)?Gd:_d)(t):t.match(e)||[]}var Vd="['\u2019]",Ud=RegExp(Vd,"g");function pe(t){return function(e){return ei($o(Ao(e).replace(Ud,"")),t,"")}}var Yd=pe(function(t,e,n){return e=e.toLowerCase(),t+(n?ko(e):e)});function Xd(){if(!arguments.length)return[];var t=arguments[0];return E(t)?t:[t]}var Zd=Z.isFinite,Jd=Math.min;function ii(t){var e=Math[t];return function(n,i){var r;return n=gt(n),(i=i==null?0:Jd(T(i),292))&&Zd(n)?(r=(P(n)+"e").split("e"),+((r=(P(e(r[0]+"e"+(+r[1]+i)))+"e").split("e"))[0]+"e"+(+r[1]-i))):e(n)}}var Kd=ii("ceil");function Do(t){return t=c(t),t.__chain__=!0,t}var Qd=Math.ceil,tp=Math.max;function ep(t,e,n){e=(n?nt(t,e,n):e===void 0)?1:tp(T(e),0);var i=t==null?0:t.length;if(!i||e<1)return[];for(var r=0,o=0,a=Array(Qd(i/e));r<i;)a[o++]=yt(t,r,r+=e);return a}function ne(t,e,n){return t==t&&(n!==void 0&&(t=t<=n?t:n),e!==void 0&&(t=e<=t?t:e)),t}function np(t,e,n){return n===void 0&&(n=e,e=void 0),n!==void 0&&(n=(n=gt(n))==n?n:0),e!==void 0&&(e=(e=gt(e))==e?e:0),ne(gt(t),e,n)}function ip(){this.__data__=new Mt,this.size=0}function rp(n){var e=this.__data__,n=e.delete(n);return this.size=e.size,n}function op(t){return this.__data__.get(t)}function ap(t){return this.__data__.has(t)}var sp=200;function lp(t,e){var n=this.__data__;if(n instanceof Mt){var i=n.__data__;if(!Ee||i.length<sp-1)return i.push([t,e]),this.size=++n.size,this;n=this.__data__=new Nt(i)}return n.set(t,e),this.size=n.size,this}function xt(t){t=this.__data__=new Mt(t),this.size=t.size}function Fo(t,e){return t&&Ct(e,X(e),t)}function cp(t,e){return t&&Ct(e,at(e),t)}xt.prototype.clear=ip,xt.prototype.delete=rp,xt.prototype.get=op,xt.prototype.has=ap,xt.prototype.set=lp;var Bo=typeof st=="object"&&st&&!st.nodeType&&st,lr=Bo&&typeof lt=="object"&&lt&&!lt.nodeType&&lt,up=lr&&lr.exports===Bo,cr=up?Z.Buffer:void 0,ur=cr?cr.allocUnsafe:void 0;function Wo(t,e){return e?t.slice():(e=t.length,e=ur?ur(e):new t.constructor(e),t.copy(e),e)}function Gt(t,e){for(var n=-1,i=t==null?0:t.length,r=0,o=[];++n<i;){var a=t[n];e(a,n,t)&&(o[r++]=a)}return o}function ri(){return[]}var dp=Object.prototype,pp=dp.propertyIsEnumerable,dr=Object.getOwnPropertySymbols,oi=dr?function(t){return t==null?[]:(t=Object(t),Gt(dr(t),function(e){return pp.call(t,e)}))}:ri;function hp(t,e){return Ct(t,oi(t),e)}var fp=Object.getOwnPropertySymbols,qo=fp?function(t){for(var e=[];t;)qt(e,oi(t)),t=rn(t);return e}:ri;function gp(t,e){return Ct(t,qo(t),e)}function Ho(t,e,n){return e=e(t),E(t)?e:qt(e,n(t))}function Rn(t){return Ho(t,X,oi)}function ai(t){return Ho(t,at,qo)}var Mn=te(Z,"DataView"),Nn=te(Z,"Promise"),oe=te(Z,"Set"),pr="[object Map]",mp="[object Object]",hr="[object Promise]",fr="[object Set]",gr="[object WeakMap]",mr="[object DataView]",bp=Qt(Mn),vp=Qt(Ee),yp=Qt(Nn),_p=Qt(oe),wp=Qt(xe),Ut=it,St=Ut=Mn&&Ut(new Mn(new ArrayBuffer(1)))!=mr||Ee&&Ut(new Ee)!=pr||Nn&&Ut(Nn.resolve())!=hr||oe&&Ut(new oe)!=fr||xe&&Ut(new xe)!=gr?function(n){var e=it(n),n=e==mp?n.constructor:void 0,n=n?Qt(n):"";if(n)switch(n){case bp:return mr;case vp:return pr;case yp:return hr;case _p:return fr;case wp:return gr}return e}:Ut,xp=Object.prototype,kp=xp.hasOwnProperty;function Ap(t){var e=t.length,n=new t.constructor(e);return e&&typeof t[0]=="string"&&kp.call(t,"index")&&(n.index=t.index,n.input=t.input),n}var Ve=Z.Uint8Array;function si(t){var e=new t.constructor(t.byteLength);return new Ve(e).set(new Ve(t)),e}function Ep(t,e){return e=e?si(t.buffer):t.buffer,new t.constructor(e,t.byteOffset,t.byteLength)}var Lp=/\w*$/;function Sp(t){var e=new t.constructor(t.source,Lp.exec(t));return e.lastIndex=t.lastIndex,e}var br=Q?Q.prototype:void 0,vr=br?br.valueOf:void 0;function Tp(t){return vr?Object(vr.call(t)):{}}function Go(t,e){return e=e?si(t.buffer):t.buffer,new t.constructor(e,t.byteOffset,t.length)}var Cp="[object Boolean]",Ip="[object Date]",Rp="[object Map]",Mp="[object Number]",Np="[object RegExp]",Op="[object Set]",zp="[object String]",Pp="[object Symbol]",jp="[object ArrayBuffer]",$p="[object DataView]",Dp="[object Float32Array]",Fp="[object Float64Array]",Bp="[object Int8Array]",Wp="[object Int16Array]",qp="[object Int32Array]",Hp="[object Uint8Array]",Gp="[object Uint8ClampedArray]",Vp="[object Uint16Array]",Up="[object Uint32Array]";function Yp(t,e,n){var i=t.constructor;switch(e){case jp:return si(t);case Cp:case Ip:return new i(+t);case $p:return Ep(t,n);case Dp:case Fp:case Bp:case Wp:case qp:case Hp:case Gp:case Vp:case Up:return Go(t,n);case Rp:return new i;case Mp:case zp:return new i(t);case Np:return Sp(t);case Op:return new i;case Pp:return Tp(t)}}function Vo(t){return typeof t.constructor!="function"||Ie(t)?{}:ae(rn(t))}var Xp="[object Map]";function Zp(t){return U(t)&&St(t)==Xp}var yr=vt&&vt.isMap,Uo=yr?pt(yr):Zp,Jp="[object Set]";function Kp(t){return U(t)&&St(t)==Jp}var _r=vt&&vt.isSet,Yo=_r?pt(_r):Kp,Qp=1,th=2,eh=4,Xo="[object Arguments]",nh="[object Array]",ih="[object Boolean]",rh="[object Date]",oh="[object Error]",Zo="[object Function]",ah="[object GeneratorFunction]",sh="[object Map]",lh="[object Number]",Jo="[object Object]",ch="[object RegExp]",uh="[object Set]",dh="[object String]",ph="[object Symbol]",hh="[object WeakMap]",fh="[object ArrayBuffer]",gh="[object DataView]",mh="[object Float32Array]",bh="[object Float64Array]",vh="[object Int8Array]",yh="[object Int16Array]",_h="[object Int32Array]",wh="[object Uint8Array]",xh="[object Uint8ClampedArray]",kh="[object Uint16Array]",Ah="[object Uint32Array]",W={};function bt(t,e,n,i,r,o){var a,s=e&Qp,l=e&th,p=e&eh;if((a=n?r?n(t,i,r,o):n(t):a)===void 0){if(!G(t))return t;if(i=E(t),i){if(a=Ap(t),!s)return rt(t,a)}else{var u=St(t),d=u==Zo||u==ah;if(Ft(t))return Wo(t,s);if(u==Jo||u==Xo||d&&!r){if(a=l||d?{}:Vo(t),!s)return l?gp(t,cp(a,t)):hp(t,Fo(a,t))}else{if(!W[u])return r?t:{};a=Yp(t,u,s)}}if(d=(o=o||new xt).get(t),d)return d;o.set(t,a),Yo(t)?t.forEach(function(h){a.add(bt(h,e,n,h,t,o))}):Uo(t)&&t.forEach(function(h,g){a.set(g,bt(h,e,n,g,t,o))});var f=i?void 0:(p?l?ai:Rn:l?at:X)(t);ft(f||t,function(h,g){f&&(h=t[g=h]),Ce(a,g,bt(h,e,n,g,t,o))})}return a}W[Xo]=W[nh]=W[fh]=W[gh]=W[ih]=W[rh]=W[mh]=W[bh]=W[vh]=W[yh]=W[_h]=W[sh]=W[lh]=W[Jo]=W[ch]=W[uh]=W[dh]=W[ph]=W[wh]=W[xh]=W[kh]=W[Ah]=!0,W[oh]=W[Zo]=W[hh]=!1;var Eh=4;function Lh(t){return bt(t,Eh)}var Sh=1,Th=4;function Ch(t){return bt(t,Sh|Th)}var Ih=1,Rh=4;function Mh(t,e){return bt(t,Ih|Rh,e=typeof e=="function"?e:void 0)}var Nh=4;function Oh(t,e){return bt(t,Nh,e=typeof e=="function"?e:void 0)}function zh(){return new mt(this.value(),this.__chain__)}function Ph(t){for(var e=-1,n=t==null?0:t.length,i=0,r=[];++e<n;){var o=t[e];o&&(r[i++]=o)}return r}function jh(){var t=arguments.length;if(!t)return[];for(var e=Array(t-1),n=arguments[0],i=t;i--;)e[i-1]=arguments[i];return qt(E(n)?rt(n):[n],J(e,1))}var $h="__lodash_hash_undefined__";function Dh(t){return this.__data__.set(t,$h),this}function Fh(t){return this.__data__.has(t)}function Jt(t){var e=-1,n=t==null?0:t.length;for(this.__data__=new Nt;++e<n;)this.add(t[e])}function li(t,e){for(var n=-1,i=t==null?0:t.length;++n<i;)if(e(t[n],n,t))return!0;return!1}function Le(t,e){return t.has(e)}Jt.prototype.add=Jt.prototype.push=Dh,Jt.prototype.has=Fh;var Bh=1,Wh=2;function Ko(t,e,n,i,r,o){var a=n&Bh,s=t.length,l=e.length;if(s!=l&&!(a&&s<l))return!1;var l=o.get(t),p=o.get(e);if(l&&p)return l==e&&p==t;var u=-1,d=!0,f=n&Wh?new Jt:void 0;for(o.set(t,e),o.set(e,t);++u<s;){var h,g=t[u],b=e[u];if((h=i?a?i(b,g,u,e,t,o):i(g,b,u,t,e,o):h)!==void 0){if(h)continue;d=!1;break}if(f){if(!li(e,function(y,w){if(!Le(f,w)&&(g===y||r(g,y,n,i,o)))return f.push(w)})){d=!1;break}}else if(g!==b&&!r(g,b,n,i,o)){d=!1;break}}return o.delete(t),o.delete(e),d}function ci(t){var e=-1,n=Array(t.size);return t.forEach(function(i,r){n[++e]=[r,i]}),n}function on(t){var e=-1,n=Array(t.size);return t.forEach(function(i){n[++e]=i}),n}var qh=1,Hh=2,Gh="[object Boolean]",Vh="[object Date]",Uh="[object Error]",Yh="[object Map]",Xh="[object Number]",Zh="[object RegExp]",Jh="[object Set]",Kh="[object String]",Qh="[object Symbol]",tf="[object ArrayBuffer]",ef="[object DataView]",wr=Q?Q.prototype:void 0,xn=wr?wr.valueOf:void 0;function nf(t,e,n,i,r,o,a){switch(n){case ef:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case tf:return!!(t.byteLength==e.byteLength&&o(new Ve(t),new Ve(e)));case Gh:case Vh:case Xh:return At(+t,+e);case Uh:return t.name==e.name&&t.message==e.message;case Zh:case Kh:return t==e+"";case Yh:var s=ci;case Jh:if(s=s||on,t.size!=e.size&&!(i&qh))return!1;var l=a.get(t);return l?l==e:(i|=Hh,a.set(t,e),l=Ko(s(t),s(e),i,r,o,a),a.delete(t),l);case Qh:if(xn)return xn.call(t)==xn.call(e)}return!1}var rf=1,of=Object.prototype,af=of.hasOwnProperty;function sf(t,e,n,i,r,o){var a=n&rf,s=Rn(t),l=s.length;if(l!=Rn(e).length&&!a)return!1;for(var p=l;p--;){var u=s[p];if(!(a?u in e:af.call(e,u)))return!1}var d=o.get(t),f=o.get(e);if(d&&f)return d==e&&f==t;for(var h=!0,g=(o.set(t,e),o.set(e,t),a);++p<l;){var b,y=t[u=s[p]],w=e[u];if(!((b=i?a?i(w,y,u,e,t,o):i(y,w,u,t,e,o):b)===void 0?y===w||r(y,w,n,i,o):b)){h=!1;break}g=g||u=="constructor"}return h&&!g&&(d=t.constructor)!=(f=e.constructor)&&"constructor"in t&&"constructor"in e&&!(typeof d=="function"&&d instanceof d&&typeof f=="function"&&f instanceof f)&&(h=!1),o.delete(t),o.delete(e),h}var lf=1,xr="[object Arguments]",kr="[object Array]",Pe="[object Object]",cf=Object.prototype,Ar=cf.hasOwnProperty;function uf(t,e,n,i,r,o){var a=E(t),u=E(e),s=a?kr:St(t),u=u?kr:St(e),l=(s=s==xr?Pe:s)==Pe,p=(u=u==xr?Pe:u)==Pe,u=s==u;if(u&&Ft(t)){if(!Ft(e))return!1;l=!(a=!0)}return u&&!l?(o=o||new xt,a||ue(t)?Ko(t,e,n,i,r,o):nf(t,e,s,n,i,r,o)):!(n&lf)&&(a=l&&Ar.call(t,"__wrapped__"),s=p&&Ar.call(e,"__wrapped__"),a||s)?r(a?t.value():t,s?e.value():e,n,i,o=o||new xt):!!u&&sf(t,e,n,i,r,o=o||new xt)}function Me(t,e,n,i,r){return t===e||(t==null||e==null||!U(t)&&!U(e)?t!=t&&e!=e:uf(t,e,n,i,Me,r))}var df=1,pf=2;function ui(t,e,n,i){var r=n.length,o=r,a=!i;if(t==null)return!o;for(t=Object(t);r--;){var s=n[r];if(a&&s[2]?s[1]!==t[s[0]]:!(s[0]in t))return!1}for(;++r<o;){var l=(s=n[r])[0],p=t[l],u=s[1];if(a&&s[2]){if(p===void 0&&!(l in t))return!1}else{var d,f=new xt;if(!((d=i?i(p,u,l,t,e,f):d)===void 0?Me(u,p,df|pf,i,f):d))return!1}}return!0}function Qo(t){return t==t&&!G(t)}function di(t){for(var e=X(t),n=e.length;n--;){var i=e[n],r=t[i];e[n]=[i,r,Qo(r)]}return e}function ta(t,e){return function(n){return n!=null&&n[t]===e&&(e!==void 0||t in Object(n))}}function ea(t){var e=di(t);return e.length==1&&e[0][2]?ta(e[0][0],e[0][1]):function(n){return n===t||ui(n,t,e)}}function hf(t,e){return t!=null&&e in Object(t)}function na(t,e,n){for(var i=-1,r=(e=Wt(e,t)).length,o=!1;++i<r;){var a=It(e[i]);if(!(o=t!=null&&n(t,a)))break;t=t[a]}return o||++i!=r?o:!!(r=t==null?0:t.length)&&Qe(r)&&zt(a,r)&&(E(t)||Kt(t))}function pi(t,e){return t!=null&&na(t,e,hf)}var ff=1,gf=2;function ia(t,e){return Xn(t)&&Qo(e)?ta(It(t),e):function(n){var i=Zn(n,t);return i===void 0&&i===e?pi(n,t):Me(e,i,ff|gf)}}function hi(t){return function(e){return e==null?void 0:e[t]}}function mf(t){return function(e){return ee(e,t)}}function ra(t){return Xn(t)?hi(It(t)):mf(t)}function L(t){return typeof t=="function"?t:t==null?et:typeof t=="object"?E(t)?ia(t[0],t[1]):ea(t):ra(t)}var bf="Expected a function";function vf(t){var e=t==null?0:t.length,n=L;return t=e?H(t,function(i){if(typeof i[1]!="function")throw new TypeError(bf);return[n(i[0]),i[1]]}):[],C(function(i){for(var r=-1;++r<e;){var o=t[r];if(dt(o[0],this,i))return dt(o[1],this,i)}})}function oa(t,e,n){var i=n.length;if(t==null)return!i;for(t=Object(t);i--;){var r=n[i],o=e[r],a=t[r];if(a===void 0&&!(r in t)||!o(a))return!1}return!0}function yf(t){var e=X(t);return function(n){return oa(n,t,e)}}var _f=1;function wf(t){return yf(bt(t,_f))}function xf(t,e){return e==null||oa(t,e,X(e))}function kf(t,e,n,i){for(var r=-1,o=t==null?0:t.length;++r<o;){var a=t[r];e(i,a,n(a),t)}return i}function aa(t){return function(e,n,i){for(var r=-1,o=Object(e),a=i(e),s=a.length;s--;){var l=a[t?s:++r];if(n(o[l],l,o)===!1)break}return e}}var fi=aa();function Lt(t,e){return t&&fi(t,e,X)}function sa(t,e){return function(n,i){if(n!=null){if(!ot(n))return t(n,i);for(var r=n.length,o=e?r:-1,a=Object(n);(e?o--:++o<r)&&i(a[o],o,a)!==!1;);}return n}}var Vt=sa(Lt);function Af(t,e,n,i){return Vt(t,function(r,o,a){e(i,r,n(r),a)}),i}function an(t,e){return function(n,i){var r=E(n)?kf:Af,o=e?e():{};return r(n,t,L(i),o)}}var Ef=Object.prototype,Lf=Ef.hasOwnProperty,Sf=an(function(t,e,n){Lf.call(t,n)?++t[n]:jt(t,n,1)});function Tf(t,e){return t=ae(t),e==null?t:Fo(t,e)}var Cf=8;function gi(t,e,n){return t=Pt(t,Cf,void 0,void 0,void 0,void 0,void 0,e=n?void 0:e),t.placeholder=gi.placeholder,t}gi.placeholder={};var If=16;function mi(t,e,n){return t=Pt(t,If,void 0,void 0,void 0,void 0,void 0,e=n?void 0:e),t.placeholder=mi.placeholder,t}mi.placeholder={};var Fe=function(){return Z.Date.now()},Rf="Expected a function",Mf=Math.max,Nf=Math.min;function la(t,e,n){var i,r,o,a,s,l,p=0,u=!1,d=!1,f=!0;if(typeof t!="function")throw new TypeError(Rf);function h(I){var R=i,D=r;return i=r=void 0,p=I,a=t.apply(D,R)}function g(I){var R=I-l;return l===void 0||e<=R||R<0||d&&o<=I-p}function b(){var I,R=Fe();if(g(R))return y(R);s=setTimeout(b,(I=e-((R=R)-l),d?Nf(I,o-(R-p)):I))}function y(I){return s=void 0,f&&i?h(I):(i=r=void 0,a)}function w(){var I=Fe(),R=g(I);if(i=arguments,r=this,l=I,R){if(s===void 0)return p=I=l,s=setTimeout(b,e),u?h(I):a;if(d)return clearTimeout(s),s=setTimeout(b,e),h(l)}return s===void 0&&(s=setTimeout(b,e)),a}return e=gt(e)||0,G(n)&&(u=!!n.leading,d="maxWait"in n,o=d?Mf(gt(n.maxWait)||0,e):o,f="trailing"in n?!!n.trailing:f),w.cancel=function(){s!==void 0&&clearTimeout(s),i=l=r=s=void(p=0)},w.flush=function(){return s===void 0?a:y(Fe())},w}function Of(t,e){return t==null||t!=t?e:t}var ca=Object.prototype,zf=ca.hasOwnProperty,Pf=C(function(t,e){t=Object(t);var n=-1,i=e.length,r=2<i?e[2]:void 0;for(r&&nt(e[0],e[1],r)&&(i=1);++n<i;)for(var o=e[n],a=at(o),s=-1,l=a.length;++s<l;){var p=a[s],u=t[p];(u===void 0||At(u,ca[p])&&!zf.call(t,p))&&(t[p]=o[p])}return t});function ua(t,e,n){(n===void 0||At(t[e],n))&&(n!==void 0||e in t)||jt(t,e,n)}function Y(t){return U(t)&&ot(t)}function On(t,e){if((e!=="constructor"||typeof t[e]!="function")&&e!="__proto__")return t[e]}function da(t){return Ct(t,at(t))}function jf(t,e,n,i,r,o,a){var s,l,p,u=On(t,n),d=On(e,n),f=a.get(d);f||((e=(f=o?o(u,d,n+"",t,e,a):void 0)===void 0)&&(l=!(s=E(d))&&Ft(d),p=!s&&!l&&ue(d),f=d,s||l||p?f=E(u)?u:Y(u)?rt(u):l?Wo(d,!(e=!1)):p?Go(d,!(e=!1)):[]:Re(d)||Kt(d)?Kt(f=u)?f=da(u):G(u)&&!Tt(u)||(f=Vo(d)):e=!1),e&&(a.set(d,f),r(f,d,i,o,a),a.delete(d))),ua(t,n,f)}function sn(t,e,n,i,r){t!==e&&fi(e,function(o,a){var s;r=r||new xt,G(o)?jf(t,e,a,n,sn,i,r):(s=i?i(On(t,a),o,a+"",t,e,r):void 0,ua(t,a,s=s===void 0?o:s))},at)}function pa(t,e,n,i,r,o){return G(t)&&G(e)&&(o.set(e,t),sn(t,e,void 0,pa,o),o.delete(e)),t}var ha=ce(function(t,e,n,i){sn(t,e,n,i)}),$f=C(function(t){return t.push(void 0,pa),dt(ha,void 0,t)}),Df="Expected a function";function fa(t,e,n){if(typeof t!="function")throw new TypeError(Df);return setTimeout(function(){t.apply(void 0,n)},e)}var Ff=C(function(t,e){return fa(t,1,e)}),Bf=C(function(t,e,n){return fa(t,gt(e)||0,n)});function bi(t,e,n){for(var i=-1,r=t==null?0:t.length;++i<r;)if(n(e,t[i]))return!0;return!1}var Wf=200;function Ne(t,e,n,i){var r=-1,o=Je,a=!0,s=t.length,l=[],p=e.length;if(s){n&&(e=H(e,pt(n))),i?(o=bi,a=!1):e.length>=Wf&&(o=Le,a=!1,e=new Jt(e));t:for(;++r<s;){var d=t[r],u=n==null?d:n(d),d=i||d!==0?d:0;if(a&&u==u){for(var f=p;f--;)if(e[f]===u)continue t;l.push(d)}else o(e,u,i)||l.push(d)}}return l}var qf=C(function(t,e){return Y(t)?Ne(t,J(e,1,Y,!0)):[]});function ht(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}var Hf=C(function(t,e){var n=ht(e);return Y(n)&&(n=void 0),Y(t)?Ne(t,J(e,1,Y,!0),L(n)):[]}),Gf=C(function(t,e){var n=ht(e);return Y(n)&&(n=void 0),Y(t)?Ne(t,J(e,1,Y,!0),void 0,n):[]}),Vf=Ye(function(t,e){return t/e},1);function Uf(t,e,n){var i=t==null?0:t.length;return i?yt(t,(e=n||e===void 0?1:T(e))<0?0:e,i):[]}function Yf(t,e,n){var i=t==null?0:t.length;return i?yt(t,0,(e=i-(e=n||e===void 0?1:T(e)))<0?0:e):[]}function ln(t,e,n,i){for(var r=t.length,o=i?r:-1;(i?o--:++o<r)&&e(t[o],o,t););return n?yt(t,i?0:o,i?o+1:r):yt(t,i?o+1:0,i?r:o)}function Xf(t,e){return t&&t.length?ln(t,L(e),!0,!0):[]}function Zf(t,e){return t&&t.length?ln(t,L(e),!0):[]}function Rt(t){return typeof t=="function"?t:et}function Er(t,e){return(E(t)?ft:Vt)(t,Rt(e))}function Jf(t,e){for(var n=t==null?0:t.length;n--&&e(t[n],n,t)!==!1;);return t}var ga=aa(!0);function vi(t,e){return t&&ga(t,e,X)}var ma=sa(vi,!0);function Lr(t,e){return(E(t)?Jf:ma)(t,Rt(e))}function Kf(t,e,n){t=P(t),e=ut(e);var i=t.length,i=n=n===void 0?i:ne(T(n),0,i);return 0<=(n-=e.length)&&t.slice(n,i)==e}function Qf(t,e){return H(e,function(n){return[n,t[n]]})}function tg(t){var e=-1,n=Array(t.size);return t.forEach(function(i){n[++e]=[i,i]}),n}var eg="[object Map]",ng="[object Set]";function ba(t){return function(e){var n=St(e);return n==eg?ci(e):n==ng?tg(e):Qf(e,t(e))}}var Sr=ba(X),Tr=ba(at),ig={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},rg=ni(ig),va=/[&<>"']/g,og=RegExp(va.source);function ya(t){return(t=P(t))&&og.test(t)?t.replace(va,rg):t}var _a=/[\\^$.*+?()[\]{}|]/g,ag=RegExp(_a.source);function sg(t){return(t=P(t))&&ag.test(t)?t.replace(_a,"\\$&"):t}function wa(t,e){for(var n=-1,i=t==null?0:t.length;++n<i;)if(!e(t[n],n,t))return!1;return!0}function lg(t,e){var n=!0;return Vt(t,function(i,r,o){return n=!!e(i,r,o)}),n}function cg(t,e,n){return(E(t)?wa:lg)(t,L(e=n&&nt(t,e,n)?void 0:e))}var ug=4294967295;function xa(t){return t?ne(T(t),0,ug):0}function dg(t,e,n,i){var r=t.length;for((n=T(n))<0&&(n=r<-n?0:r+n),(i=i===void 0||r<i?r:T(i))<0&&(i+=r),i=i<n?0:xa(i);n<i;)t[n++]=e;return t}function pg(t,e,n,i){var r=t==null?0:t.length;return r?(n&&typeof n!="number"&&nt(t,e,n)&&(n=0,i=r),dg(t,e,n,i)):[]}function ka(t,e){var n=[];return Vt(t,function(i,r,o){e(i,r,o)&&n.push(i)}),n}function hg(t,e){return(E(t)?Gt:ka)(t,L(e))}function Aa(t){return function(e,a,i){var r,o=Object(e),a=(ot(e)||(r=L(a),e=X(e),a=function(s){return r(o[s],s,o)}),t(e,a,i));return-1<a?o[r?e[a]:a]:void 0}}var fg=Math.max;function Ea(t,e,n){var i=t==null?0:t.length;return i?(n=n==null?0:T(n),n<0&&(n=fg(i+n,0)),Ze(t,L(e),n)):-1}var gg=Aa(Ea);function La(t,e,n){var i;return n(t,function(r,o,a){if(e(r,o,a))return i=o,!1}),i}function mg(t,e){return La(t,L(e),Lt)}var bg=Math.max,vg=Math.min;function Sa(t,e,n){var i=t==null?0:t.length;if(!i)return-1;var r=i-1;return n!==void 0&&(r=T(n),r=n<0?bg(i+r,0):vg(r,i-1)),Ze(t,L(e),r,!0)}var yg=Aa(Sa);function _g(t,e){return La(t,L(e),vi)}function Cr(t){return t&&t.length?t[0]:void 0}function Ta(t,e){var n=-1,i=ot(t)?Array(t.length):[];return Vt(t,function(r,o,a){i[++n]=e(r,o,a)}),i}function cn(t,e){return(E(t)?H:Ta)(t,L(e))}function wg(t,e){return J(cn(t,e),1)}var xg=1/0;function kg(t,e){return J(cn(t,e),xg)}function Ag(t,e,n){return n=n===void 0?1:T(n),J(cn(t,e),n)}var Eg=1/0;function Lg(t){return t!=null&&t.length?J(t,Eg):[]}function Sg(t,e){return t!=null&&t.length?J(t,e=e===void 0?1:T(e)):[]}var Tg=512;function Cg(t){return Pt(t,Tg)}var Ig=ii("floor"),Rg="Expected a function",Mg=8,Ng=32,Og=128,zg=256;function Ca(t){return $t(function(e){var n=e.length,i=n,r=mt.prototype.thru;for(t&&e.reverse();i--;){var o=e[i];if(typeof o!="function")throw new TypeError(Rg);r&&!l&&De(o)=="wrapper"&&(l=new mt([],!0))}for(i=l?i:n;++i<n;)var a=De(o=e[i]),s=a=="wrapper"?qn(o):void 0,l=s&&Tn(s[0])&&s[1]==(Og|Mg|Ng|zg)&&!s[4].length&&s[9]==1?l[De(s[0])].apply(l,s[3]):o.length==1&&Tn(o)?l[a]():l.thru(o);return function(){var p=arguments,u=p[0];if(l&&p.length==1&&E(u))return l.plant(u).value();for(var d=0,f=n?e[d].apply(this,p):u;++d<n;)f=e[d].call(this,f);return f}})}var Pg=Ca(),jg=Ca(!0);function $g(t,e){return t==null?t:fi(t,Rt(e),at)}function Dg(t,e){return t==null?t:ga(t,Rt(e),at)}function Fg(t,e){return t&&Lt(t,Rt(e))}function Bg(t,e){return t&&vi(t,Rt(e))}function Wg(t){for(var e=-1,n=t==null?0:t.length,i={};++e<n;){var r=t[e];i[r[0]]=r[1]}return i}function un(t,e){return Gt(e,function(n){return Tt(t[n])})}function qg(t){return t==null?[]:un(t,X(t))}function Hg(t){return t==null?[]:un(t,at(t))}var Gg=Object.prototype,Vg=Gg.hasOwnProperty,Ug=an(function(t,e,n){Vg.call(t,n)?t[n].push(e):jt(t,n,[e])});function yi(t,e){return e<t}function dn(t){return function(e,n){return typeof e=="string"&&typeof n=="string"||(e=gt(e),n=gt(n)),t(e,n)}}var Yg=dn(yi),Xg=dn(function(t,e){return e<=t}),Zg=Object.prototype,Jg=Zg.hasOwnProperty;function Kg(t,e){return t!=null&&Jg.call(t,e)}function Qg(t,e){return t!=null&&na(t,e,Kg)}var tm=Math.max,em=Math.min;function nm(t,e,n){return t>=em(e,n)&&t<tm(e,n)}function im(t,e,n){return e=Ot(e),n===void 0?(n=e,e=0):n=Ot(n),nm(t=gt(t),e,n)}var rm="[object String]";function pn(t){return typeof t=="string"||!E(t)&&U(t)&&it(t)==rm}function _i(t,e){return H(e,function(n){return t[n]})}function he(t){return t==null?[]:_i(t,X(t))}var om=Math.max;function am(t,e,n,i){return t=ot(t)?t:he(t),n=n&&!i?T(n):0,i=t.length,n<0&&(n=om(i+n,0)),pn(t)?n<=i&&-1<t.indexOf(e,n):!!i&&-1<se(t,e,n)}var sm=Math.max;function lm(t,e,n){var i=t==null?0:t.length;return i?(n=n==null?0:T(n),se(t,e,n=n<0?sm(i+n,0):n)):-1}function cm(t){return t!=null&&t.length?yt(t,0,-1):[]}var um=Math.min;function wi(t,e,n){for(var i=n?bi:Je,r=t[0].length,o=t.length,a=o,s=Array(o),l=1/0,p=[];a--;){var u=t[a];a&&e&&(u=H(u,pt(e))),l=um(u.length,l),s[a]=!n&&(e||120<=r&&120<=u.length)?new Jt(a&&u):void 0}var u=t[0],d=-1,f=s[0];t:for(;++d<r&&p.length<l;){var g=u[d],h=e?e(g):g,g=n||g!==0?g:0;if(!(f?Le(f,h):i(p,h,n))){for(a=o;--a;){var b=s[a];if(!(b?Le(b,h):i(t[a],h,n)))continue t}f&&f.push(h),p.push(g)}}return p}function xi(t){return Y(t)?t:[]}var dm=C(function(t){var e=H(t,xi);return e.length&&e[0]===t[0]?wi(e):[]}),pm=C(function(t){var e=ht(t),n=H(t,xi);return e===ht(n)?e=void 0:n.pop(),n.length&&n[0]===t[0]?wi(n,L(e)):[]}),hm=C(function(t){var e=ht(t),n=H(t,xi);return(e=typeof e=="function"?e:void 0)&&n.pop(),n.length&&n[0]===t[0]?wi(n,void 0,e):[]});function fm(t,e,n,i){return Lt(t,function(r,o,a){e(i,n(r),o,a)}),i}function Ia(t,e){return function(n,i){return fm(n,t,e(i),{})}}var gm=Object.prototype,mm=gm.toString,bm=Ia(function(t,e,n){t[e=e!=null&&typeof e.toString!="function"?mm.call(e):e]=n},Hn(et)),Ra=Object.prototype,vm=Ra.hasOwnProperty,ym=Ra.toString,_m=Ia(function(t,e,n){e!=null&&typeof e.toString!="function"&&(e=ym.call(e)),vm.call(t,e)?t[e].push(n):t[e]=[n]},L);function Ma(t,e){return e.length<2?t:ee(t,yt(e,0,-1))}function Oe(t,e,n){return e=(t=Ma(t,e=Wt(e,t)))==null?t:t[It(ht(e))],e==null?void 0:dt(e,t,n)}var wm=C(Oe),xm=C(function(t,e,n){var i=-1,r=typeof e=="function",o=ot(t)?Array(t.length):[];return Vt(t,function(a){o[++i]=r?dt(e,a,n):Oe(a,e,n)}),o}),km="[object ArrayBuffer]";function Am(t){return U(t)&&it(t)==km}var Ir=vt&&vt.isArrayBuffer,Em=Ir?pt(Ir):Am,Lm="[object Boolean]";function Sm(t){return t===!0||t===!1||U(t)&&it(t)==Lm}var Tm="[object Date]";function Cm(t){return U(t)&&it(t)==Tm}var Rr=vt&&vt.isDate,Im=Rr?pt(Rr):Cm;function Rm(t){return U(t)&&t.nodeType===1&&!Re(t)}var Mm="[object Map]",Nm="[object Set]",Om=Object.prototype,zm=Om.hasOwnProperty;function Pm(t){if(t!=null){if(ot(t)&&(E(t)||typeof t=="string"||typeof t.splice=="function"||Ft(t)||ue(t)||Kt(t)))return!t.length;var e,n=St(t);if(n==Mm||n==Nm)return!t.size;if(Ie(t))return!Yn(t).length;for(e in t)if(zm.call(t,e))return!1}return!0}function jm(t,e){return Me(t,e)}function $m(t,e,n){var i=(n=typeof n=="function"?n:void 0)?n(t,e):void 0;return i===void 0?Me(t,e,void 0,n):!!i}var Dm=Z.isFinite;function Fm(t){return typeof t=="number"&&Dm(t)}function Na(t){return typeof t=="number"&&t==T(t)}function Bm(t,e){return t===e||ui(t,e,di(e))}function Wm(t,e,n){return n=typeof n=="function"?n:void 0,ui(t,e,di(e),n)}var qm="[object Number]";function Oa(t){return typeof t=="number"||U(t)&&it(t)==qm}function Hm(t){return Oa(t)&&t!=+t}var Gm=$e?Tt:Un,Vm="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";function Um(t){if(Gm(t))throw new Error(Vm);return Ur(t)}function Ym(t){return t==null}function Xm(t){return t===null}var Zm="[object RegExp]";function Jm(t){return U(t)&&it(t)==Zm}var Mr=vt&&vt.isRegExp,ki=Mr?pt(Mr):Jm,Nr=9007199254740991;function Km(t){return Na(t)&&-Nr<=t&&t<=Nr}function Qm(t){return t===void 0}var tb="[object WeakMap]";function eb(t){return U(t)&&St(t)==tb}var nb="[object WeakSet]";function ib(t){return U(t)&&it(t)==nb}var rb=1;function ob(t){return L(typeof t=="function"?t:bt(t,rb))}var ab=Array.prototype,sb=ab.join;function lb(t,e){return t==null?"":sb.call(t,e)}var cb=pe(function(t,e,n){return t+(n?"-":"")+e.toLowerCase()}),ub=an(function(t,e,n){jt(t,n,e)});function db(t,e,n){for(var i=n+1;i--;)if(t[i]===e)return i;return i}var pb=Math.max,hb=Math.min;function fb(t,e,n){var i=t==null?0:t.length;if(!i)return-1;var r=i;return n!==void 0&&(r=(r=T(n))<0?pb(i+r,0):hb(r,i-1)),e==e?db(t,e,r):Ze(t,to,r,!0)}var gb=pe(function(t,e,n){return t+(n?" ":"")+e.toLowerCase()}),mb=xo("toLowerCase");function Ai(t,e){return t<e}var bb=dn(Ai),vb=dn(function(t,e){return t<=e});function yb(t,e){var n={};return e=L(e),Lt(t,function(i,r,o){jt(n,e(i,r,o),i)}),n}function _b(t,e){var n={};return e=L(e),Lt(t,function(i,r,o){jt(n,r,e(i,r,o))}),n}var wb=1;function xb(t){return ea(bt(t,wb))}var kb=1;function Ab(t,e){return ia(t,bt(e,kb))}function hn(t,e,n){for(var i=-1,r=t.length;++i<r;){var o,a,s=t[i],l=e(s);l!=null&&(o===void 0?l==l&&!ct(l):n(l,o))&&(o=l,a=s)}return a}function Eb(t){return t&&t.length?hn(t,et,yi):void 0}function Lb(t,e){return t&&t.length?hn(t,L(e),yi):void 0}function Ei(t,e){for(var n,i=-1,r=t.length;++i<r;){var o=e(t[i]);o!==void 0&&(n=n===void 0?o:n+o)}return n}var Sb=NaN;function za(t,e){var n=t==null?0:t.length;return n?Ei(t,e)/n:Sb}function Tb(t){return za(t,et)}function Cb(t,e){return za(t,L(e))}var Ib=ce(function(t,e,n){sn(t,e,n)}),Rb=C(function(t,e){return function(n){return Oe(n,t,e)}}),Mb=C(function(t,e){return function(n){return Oe(t,n,e)}});function Nb(t){return t&&t.length?hn(t,et,Ai):void 0}function Ob(t,e){return t&&t.length?hn(t,L(e),Ai):void 0}function Pa(t,e,n){var i=X(e),i=un(e,i),r=!(G(n)&&"chain"in n&&!n.chain),o=Tt(t);return ft(i,function(a){var s=e[a];t[a]=s,o&&(t.prototype[a]=function(){var l,p=this.__chain__;return r||p?(((l=t(this.__wrapped__)).__actions__=rt(this.__actions__)).push({func:s,args:arguments,thisArg:t}),l.__chain__=p,l):s.apply(t,qt([this.value()],arguments))})}),t}var zb=Ye(function(t,e){return t*e},1),Pb="Expected a function";function Se(t){if(typeof t!="function")throw new TypeError(Pb);return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}function jb(t){for(var e,n=[];!(e=t.next()).done;)n.push(e.value);return n}var $b="[object Map]",Db="[object Set]",kn=Q?Q.iterator:void 0;function ja(t){if(!t)return[];if(ot(t))return(pn(t)?kt:rt)(t);if(kn&&t[kn])return jb(t[kn]());var e=St(t);return(e==$b?ci:e==Db?on:he)(t)}function Fb(){this.__values__===void 0&&(this.__values__=ja(this.value()));var t=this.__index__>=this.__values__.length;return{done:t,value:t?void 0:this.__values__[this.__index__++]}}function $a(t,e){var n=t.length;if(n)return zt(e+=e<0?n:0,n)?t[e]:void 0}function Bb(t,e){return t&&t.length?$a(t,T(e)):void 0}function Wb(t){return t=T(t),C(function(e){return $a(e,t)})}function Li(t,e){return(t=Ma(t,e=Wt(e,t)))==null||delete t[It(ht(e))]}function qb(t){return Re(t)?void 0:t}var Hb=1,Gb=2,Vb=4,Ub=$t(function(t,e){var n={};if(t!=null)for(var i=!1,r=(e=H(e,function(o){return o=Wt(o,t),i=i||1<o.length,o}),Ct(t,ai(t),n),i&&(n=bt(n,Hb|Gb|Vb,qb)),e.length);r--;)Li(n,e[r]);return n});function ze(t,e,n,i){if(G(t))for(var r=-1,o=(e=Wt(e,t)).length,a=o-1,s=t;s!=null&&++r<o;){var l,p=It(e[r]),u=n;if(p==="__proto__"||p==="constructor"||p==="prototype")return t;r!=a&&(l=s[p],(u=i?i(l,p,s):void 0)===void 0&&(u=G(l)?l:zt(e[r+1])?[]:{})),Ce(s,p,u),s=s[p]}return t}function Da(t,e,n){for(var i=-1,r=e.length,o={};++i<r;){var a=e[i],s=ee(t,a);n(s,a)&&ze(o,Wt(a,t),s)}return o}function Fa(t,e){if(t==null)return{};var n=H(ai(t),function(i){return[i]});return e=L(e),Da(t,n,function(i,r){return e(i,r[0])})}function Yb(t,e){return Fa(t,Se(L(e)))}function Xb(t){return go(2,t)}function Zb(t,e){var n=t.length;for(t.sort(e);n--;)t[n]=t[n].value;return t}function Ba(t,e){if(t!==e){var n=t!==void 0,i=t===null,r=t==t,o=ct(t),a=e!==void 0,s=e===null,l=e==e,p=ct(e);if(!s&&!p&&!o&&e<t||o&&a&&l&&!s&&!p||i&&a&&l||!n&&l||!r)return 1;if(!i&&!o&&!p&&t<e||p&&n&&r&&!i&&!o||s&&n&&r||!a&&r||!l)return-1}return 0}function Jb(t,e,n){for(var i=-1,r=t.criteria,o=e.criteria,a=r.length,s=n.length;++i<a;){var l=Ba(r[i],o[i]);if(l)return s<=i?l:l*(n[i]=="desc"?-1:1)}return t.index-e.index}function Wa(t,e,n){e=e.length?H(e,function(r){return E(r)?function(o){return ee(o,r.length===1?r[0]:r)}:r}):[et];var i=-1;return e=H(e,pt(L)),Zb(Ta(t,function(r,o,a){return{criteria:H(e,function(s){return s(r)}),index:++i,value:r}}),function(r,o){return Jb(r,o,n)})}function Kb(t,e,n,i){return t==null?[]:Wa(t,e=E(e)?e:e==null?[]:[e],n=E(n=i?void 0:n)?n:n==null?[]:[n])}function Si(t){return $t(function(e){return e=H(e,pt(L)),C(function(n){var i=this;return t(e,function(r){return dt(r,i,n)})})})}var Qb=Si(H),tv=C,ev=Math.min,nv=tv(function(t,e){var n=(e=e.length==1&&E(e[0])?H(e[0],pt(L)):H(J(e,1),pt(L))).length;return C(function(i){for(var r=-1,o=ev(i.length,n);++r<o;)i[r]=e[r].call(this,i[r]);return dt(t,this,i)})}),iv=Si(wa),rv=Si(li),ov=9007199254740991,av=Math.floor;function zn(t,e){var n="";if(!(!t||e<1||ov<e))for(;e%2&&(n+=t),(e=av(e/2))&&(t+=t),e;);return n}var sv=hi("length"),qa="\\ud800-\\udfff",lv="\\u0300-\\u036f",cv="\\ufe20-\\ufe2f",uv="\\u20d0-\\u20ff",dv=lv+cv+uv,pv="\\ufe0e\\ufe0f",hv="["+qa+"]",Pn="["+dv+"]",jn="\\ud83c[\\udffb-\\udfff]",fv="(?:"+Pn+"|"+jn+")",Ha="[^"+qa+"]",Ga="(?:\\ud83c[\\udde6-\\uddff]){2}",Va="[\\ud800-\\udbff][\\udc00-\\udfff]",gv="\\u200d",Ua=fv+"?",Ya="["+pv+"]?",mv="(?:"+gv+"(?:"+[Ha,Ga,Va].join("|")+")"+Ya+Ua+")*",bv=Ya+Ua+mv,vv="(?:"+[Ha+Pn+"?",Pn,Ga,Va,hv].join("|")+")",Or=RegExp(jn+"(?="+jn+")|"+vv+bv,"g");function yv(t){for(var e=Or.lastIndex=0;Or.test(t);)++e;return e}function fe(t){return(de(t)?yv:sv)(t)}var _v=Math.ceil;function Ue(t,e){var n=(e=e===void 0?" ":ut(e)).length;return n<2?n?zn(e,t):e:(n=zn(e,_v(t/fe(e))),de(e)?Ht(kt(n),0,t).join(""):n.slice(0,t))}var wv=Math.ceil,xv=Math.floor;function kv(t,e,n){t=P(t);var i=(e=T(e))?fe(t):0;return!e||e<=i?t:(e=(e-i)/2,Ue(xv(e),n)+t+Ue(wv(e),n))}function Av(t,e,n){t=P(t);var i=(e=T(e))?fe(t):0;return e&&i<e?t+Ue(e-i,n):t}function Ev(t,e,n){t=P(t);var i=(e=T(e))?fe(t):0;return e&&i<e?Ue(e-i,n)+t:t}var Lv=/^\s+/,Sv=Z.parseInt;function Tv(t,e,n){return e=n||e==null?0:e&&+e,Sv(P(t).replace(Lv,""),e||0)}var Cv=32,fn=C(function(t,e){var n=Dt(e,le(fn));return Pt(t,Cv,void 0,e,n)}),Iv=(fn.placeholder={},64),Ti=C(function(t,e){var n=Dt(e,le(Ti));return Pt(t,Iv,void 0,e,n)}),Rv=(Ti.placeholder={},an(function(t,e,n){t[n?0:1].push(e)},function(){return[[],[]]}));function Mv(t,e){return Da(t,e,function(n,i){return pi(t,i)})}var Nv=$t(function(t,e){return t==null?{}:Mv(t,e)});function Ov(t){for(var e,r=this;r instanceof Xe;)var n=Jr(r),i=(n.__index__=0,n.__values__=void 0,e?i.__wrapped__=n:e=n,n),r=r.__wrapped__;return i.__wrapped__=t,e}function zv(t){return function(e){return t==null?void 0:ee(t,e)}}function Pv(t,e,n,i){for(var r=n-1,o=t.length;++r<o;)if(i(t[r],e))return r;return-1}var jv=Array.prototype,zr=jv.splice;function Ci(t,e,n,i){var r=i?Pv:se,o=-1,a=e.length,s=t;for(t===e&&(e=rt(e)),n&&(s=H(t,pt(n)));++o<a;)for(var l=0,p=e[o],u=n?n(p):p;-1<(l=r(s,u,l,i));)s!==t&&zr.call(s,l,1),zr.call(t,l,1);return t}function Xa(t,e){return t&&t.length&&e&&e.length?Ci(t,e):t}var $v=C(Xa);function Dv(t,e,n){return t&&t.length&&e&&e.length?Ci(t,e,L(n)):t}function Fv(t,e,n){return t&&t.length&&e&&e.length?Ci(t,e,void 0,n):t}var Bv=Array.prototype,Wv=Bv.splice;function Za(t,e){for(var n=t?e.length:0,i=n-1;n--;){var r,o=e[n];n!=i&&o===r||(zt(r=o)?Wv.call(t,o,1):Li(t,o))}return t}var qv=$t(function(t,e){var n=t==null?0:t.length,i=Jn(t,e);return Za(t,H(e,function(r){return zt(r,n)?+r:r}).sort(Ba)),i}),Hv=Math.floor,Gv=Math.random;function Ii(t,e){return t+Hv(Gv()*(e-t+1))}var Vv=parseFloat,Uv=Math.min,Yv=Math.random;function Xv(t,e,n){var i;return n&&typeof n!="boolean"&&nt(t,e,n)&&(e=n=void 0),n===void 0&&(typeof e=="boolean"?(n=e,e=void 0):typeof t=="boolean"&&(n=t,t=void 0)),t===void 0&&e===void 0?(t=0,e=1):(t=Ot(t),e===void 0?(e=t,t=0):e=Ot(e)),e<t&&(i=t,t=e,e=i),n||t%1||e%1?(i=Yv(),Uv(t+i*(e-t+Vv("1e-"+((i+"").length-1))),e)):Ii(t,e)}var Zv=Math.ceil,Jv=Math.max;function Kv(t,e,n,i){for(var r=-1,o=Jv(Zv((e-t)/(n||1)),0),a=Array(o);o--;)a[i?o:++r]=t,t+=n;return a}function Ja(t){return function(e,n,i){return i&&typeof i!="number"&&nt(e,n,i)&&(n=i=void 0),e=Ot(e),n===void 0?(n=e,e=0):n=Ot(n),Kv(e,n,i=i===void 0?e<n?1:-1:Ot(i),t)}}var Qv=Ja(),t0=Ja(!0),e0=256,n0=$t(function(t,e){return Pt(t,e0,void 0,void 0,void 0,e)});function Ka(t,e,n,i,r){return r(t,function(o,a,s){n=i?(i=!1,o):e(n,o,a,s)}),n}function i0(t,e,n){var i=E(t)?ei:Ka,r=arguments.length<3;return i(t,L(e),n,r,Vt)}function r0(t,e,n,i){var r=t==null?0:t.length;for(i&&r&&(n=t[--r]);r--;)n=e(n,t[r],r,t);return n}function o0(t,e,n){var i=E(t)?r0:Ka,r=arguments.length<3;return i(t,L(e),n,r,ma)}function a0(t,e){return(E(t)?Gt:ka)(t,Se(L(e)))}function s0(t,e){var n=[];if(t&&t.length){var i=-1,r=[],o=t.length;for(e=L(e);++i<o;){var a=t[i];e(a,i,t)&&(n.push(a),r.push(i))}Za(t,r)}return n}function l0(t,e,n){return e=(n?nt(t,e,n):e===void 0)?1:T(e),zn(P(t),e)}function c0(){var t=arguments,e=P(t[0]);return t.length<3?e:e.replace(t[1],t[2])}var u0="Expected a function";function d0(t,e){if(typeof t!="function")throw new TypeError(u0);return C(t,e=e===void 0?e:T(e))}function p0(t,e,n){var i=-1,r=(e=Wt(e,t)).length;for(r||(r=1,t=void 0);++i<r;){var o=t==null?void 0:t[It(e[i])];o===void 0&&(i=r,o=n),t=Tt(o)?o.call(t):o}return t}var h0=Array.prototype,f0=h0.reverse;function $n(t){return t==null?t:f0.call(t)}var g0=ii("round");function Qa(t){var e=t.length;return e?t[Ii(0,e-1)]:void 0}function m0(t){return Qa(he(t))}function b0(t){return(E(t)?Qa:m0)(t)}function gn(t,e){var n=-1,i=t.length,r=i-1;for(e=e===void 0?i:e;++n<e;){var o=Ii(n,r),a=t[o];t[o]=t[n],t[n]=a}return t.length=e,t}function v0(t,e){return gn(rt(t),ne(e,0,t.length))}function y0(t,e){return t=he(t),gn(t,ne(e,0,t.length))}function _0(t,e,n){return e=(n?nt(t,e,n):e===void 0)?1:T(e),(E(t)?v0:y0)(t,e)}function w0(t,e,n){return t==null?t:ze(t,e,n)}function x0(t,e,n,i){return i=typeof i=="function"?i:void 0,t==null?t:ze(t,e,n,i)}function k0(t){return gn(rt(t))}function A0(t){return gn(he(t))}function E0(t){return(E(t)?k0:A0)(t)}var L0="[object Map]",S0="[object Set]";function T0(t){if(t==null)return 0;if(ot(t))return pn(t)?fe(t):t.length;var e=St(t);return e==L0||e==S0?t.size:Yn(t).length}function C0(t,e,n){var i=t==null?0:t.length;return i?(n=n&&typeof n!="number"&&nt(t,e,n)?(e=0,i):(e=e==null?0:T(e),n===void 0?i:T(n)),yt(t,e,n)):[]}var I0=pe(function(t,e,n){return t+(n?"_":"")+e.toLowerCase()});function R0(t,e){var n;return Vt(t,function(i,r,o){return!(n=e(i,r,o))}),!!n}function M0(t,e,n){return(E(t)?li:R0)(t,L(e=n&&nt(t,e,n)?void 0:e))}var N0=C(function(t,e){if(t==null)return[];var n=e.length;return 1<n&&nt(t,e[0],e[1])?e=[]:2<n&&nt(e[0],e[1],e[2])&&(e=[e[0]]),Wa(t,J(e,1),[])}),O0=4294967295,z0=O0-1,P0=Math.floor,j0=Math.min;function Ri(t,e,n,i){var r=0,o=t==null?0:t.length;if(o===0)return 0;for(var a=(e=n(e))!=e,s=e===null,l=ct(e),p=e===void 0;r<o;){var u=P0((r+o)/2),d=n(t[u]),f=d!==void 0,h=d===null,b=d==d,g=ct(d),b=a?i||b:p?b&&(i||f):s?b&&f&&(i||!h):l?b&&f&&!h&&(i||!g):!h&&!g&&(i?d<=e:d<e);b?r=u+1:o=u}return j0(o,z0)}var $0=4294967295,D0=$0>>>1;function mn(t,e,n){var i=0,r=t==null?i:t.length;if(typeof e=="number"&&e==e&&r<=D0){for(;i<r;){var o=i+r>>>1,a=t[o];a!==null&&!ct(a)&&(n?a<=e:a<e)?i=1+o:r=o}return r}return Ri(t,e,et,n)}function F0(t,e){return mn(t,e)}function B0(t,e,n){return Ri(t,e,L(n))}function W0(t,e){var n=t==null?0:t.length;if(n){var i=mn(t,e);if(i<n&&At(t[i],e))return i}return-1}function q0(t,e){return mn(t,e,!0)}function H0(t,e,n){return Ri(t,e,L(n),!0)}function G0(t,e){if(t!=null&&t.length){var n=mn(t,e,!0)-1;if(At(t[n],e))return n}return-1}function ts(t,e){for(var n=-1,i=t.length,r=0,o=[];++n<i;){var a,s=t[n],l=e?e(s):s;n&&At(l,a)||(a=l,o[r++]=s===0?0:s)}return o}function V0(t){return t&&t.length?ts(t):[]}function U0(t,e){return t&&t.length?ts(t,L(e)):[]}var Y0=4294967295;function X0(t,e,n){return n&&typeof n!="number"&&nt(t,e,n)&&(e=n=void 0),(n=n===void 0?Y0:n>>>0)?(t=P(t))&&(typeof e=="string"||e!=null&&!ki(e))&&!(e=ut(e))&&de(t)?Ht(kt(t),0,n):t.split(e,n):[]}var Z0="Expected a function",J0=Math.max;function K0(t,e){if(typeof t!="function")throw new TypeError(Z0);return e=e==null?0:J0(T(e),0),C(function(r){var i=r[e],r=Ht(r,0,e);return i&&qt(r,i),dt(t,this,r)})}var Q0=pe(function(t,e,n){return t+(n?" ":"")+ti(e)});function ty(t,e,n){return t=P(t),n=n==null?0:ne(T(n),0,t.length),e=ut(e),t.slice(n,n+e.length)==e}function ey(){return{}}function ny(){return""}function iy(){return!0}var ry=Ye(function(t,e){return t-e},0);function oy(t){return t&&t.length?Ei(t,et):0}function ay(t,e){return t&&t.length?Ei(t,L(e)):0}function sy(t){var e=t==null?0:t.length;return e?yt(t,1,e):[]}function ly(t,e,n){return t&&t.length?yt(t,0,(e=n||e===void 0?1:T(e))<0?0:e):[]}function cy(t,e,n){var i=t==null?0:t.length;return i?yt(t,(e=i-(e=n||e===void 0?1:T(e)))<0?0:e,i):[]}function uy(t,e){return t&&t.length?ln(t,L(e),!1,!0):[]}function dy(t,e){return t&&t.length?ln(t,L(e)):[]}function py(t,e){return e(t),t}var es=Object.prototype,hy=es.hasOwnProperty;function Pr(t,e,n,i){return t===void 0||At(t,es[n])&&!hy.call(i,n)?e:t}var fy={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"};function gy(t){return"\\"+fy[t]}var ns=/<%=([\s\S]+?)%>/g,my=/<%-([\s\S]+?)%>/g,by=/<%([\s\S]+?)%>/g,Dn={escape:my,evaluate:by,interpolate:ns,variable:"",imports:{_:{escape:ya}}},vy="Invalid `variable` option passed into `_.template`",yy=/\b__p \+= '';/g,_y=/\b(__p \+=) '' \+/g,wy=/(__e\(.*?\)|\b__t\)) \+\n'';/g,xy=/[()=,{}\[\]\/\s]/,ky=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,je=/($^)/,Ay=/['\n\r\u2028\u2029\\]/g,Ey=Object.prototype,jr=Ey.hasOwnProperty;function Ly(t,e,p){var i,r,d=Dn.imports._.templateSettings||Dn,p=(p&&nt(t,e,p)&&(e=void 0),t=P(t),e=He({},e,d,Pr),He({},e.imports,d.imports,Pr)),o=X(p),a=_i(p,o),s=0,d=e.interpolate||je,l="__p += '",p=RegExp((e.escape||je).source+"|"+d.source+"|"+(d===ns?ky:je).source+"|"+(e.evaluate||je).source+"|$","g"),u=jr.call(e,"sourceURL")?"//# sourceURL="+(e.sourceURL+"").replace(/\s/g," ")+`
`:"",d=(t.replace(p,function(f,h,g,b,y,w){return g=g||b,l+=t.slice(s,w).replace(Ay,gy),h&&(i=!0,l+=`' +
__e(`+h+`) +
'`),y&&(r=!0,l+=`';
`+y+`;
__p += '`),g&&(l+=`' +
((__t = (`+g+`)) == null ? '' : __t) +
'`),s=w+f.length,f}),l+=`';
`,jr.call(e,"variable")&&e.variable);if(d){if(xy.test(d))throw new Error(vy)}else l=`with (obj) {
`+l+`
}
`;if(l=(r?l.replace(yy,""):l).replace(_y,"$1").replace(wy,"$1;"),l="function("+(d||"obj")+`) {
`+(d?"":`obj || (obj = {});
`)+"var __t, __p = ''"+(i?", __e = _.escape":"")+(r?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+l+`return __p
}`,p=fo(function(){return Function(o,u+"return "+l).apply(void 0,a)}),p.source=l,Kn(p))throw p;return p}var Sy="Expected a function";function Ty(t,e,n){var i=!0,r=!0;if(typeof t!="function")throw new TypeError(Sy);return G(n)&&(i="leading"in n?!!n.leading:i,r="trailing"in n?!!n.trailing:r),la(t,e,{leading:i,maxWait:e,trailing:r})}function Te(t,e){return e(t)}var Cy=9007199254740991,An=4294967295,Iy=Math.min;function Ry(t,e){if((t=T(t))<1||Cy<t)return[];for(var n=An,i=Iy(t,An),i=(e=Rt(e),t-=An,Vn(i,e));++n<t;)e(n);return i}function My(){return this}function is(t,e){return ei(e,function(n,i){return i.func.apply(i.thisArg,qt([n],i.args))},t=t instanceof M?t.value():t)}function En(){return is(this.__wrapped__,this.__actions__)}function Ny(t){return P(t).toLowerCase()}function Oy(t){return E(t)?H(t,It):ct(t)?[t]:rt(uo(P(t)))}var $r=9007199254740991;function zy(t){return t?ne(T(t),-$r,$r):t===0?t:0}function Py(t){return P(t).toUpperCase()}function jy(t,e,n){var i,r=E(t),o=r||Ft(t)||ue(t);return e=L(e),n==null&&(i=t&&t.constructor,n=o?r?new i:[]:G(t)&&Tt(i)?ae(rn(t)):{}),(o?ft:Lt)(t,function(a,s,l){return e(n,a,s,l)}),n}function rs(t,e){for(var n=t.length;n--&&-1<se(e,t[n],0););return n}function os(t,e){for(var n=-1,i=t.length;++n<i&&-1<se(e,t[n],0););return n}function $y(t,e,n){return(t=P(t))&&(n||e===void 0)?Vr(t):!t||!(e=ut(e))?t:(n=kt(t),t=kt(e),Ht(n,os(n,t),rs(n,t)+1).join(""))}function Dy(t,e,n){return(t=P(t))&&(n||e===void 0)?t.slice(0,Gr(t)+1):!t||!(e=ut(e))?t:(n=kt(t),Ht(n,0,rs(n,kt(e))+1).join(""))}var Fy=/^\s+/;function By(t,e,n){return(t=P(t))&&(n||e===void 0)?t.replace(Fy,""):!t||!(e=ut(e))?t:(n=kt(t),Ht(n,os(n,kt(e))).join(""))}var Wy=30,qy="...",Hy=/\w*$/;function Gy(t,r){var n,a=Wy,i=qy,r=(G(r)&&(n="separator"in r?r.separator:n,a="length"in r?T(r.length):a,i="omission"in r?ut(r.omission):i),(t=P(t)).length);if((r=de(t)?(o=kt(t)).length:r)<=a)return t;if(r=a-fe(i),r<1)return i;var o,a=o?Ht(o,0,r).join(""):t.slice(0,r);if(n!==void 0)if(o&&(r+=a.length-r),ki(n)){if(t.slice(r).search(n)){var s,l=a;for((n=n.global?n:RegExp(n.source,P(Hy.exec(n))+"g")).lastIndex=0;s=n.exec(l);)var p=s.index;a=a.slice(0,p===void 0?r:p)}}else t.indexOf(ut(n),r)==r||-1<(o=a.lastIndexOf(n))&&(a=a.slice(0,o));return a+i}function Vy(t){return io(t,1)}var Uy={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},Yy=ni(Uy),as=/&(?:amp|lt|gt|quot|#39);/g,Xy=RegExp(as.source);function Zy(t){return(t=P(t))&&Xy.test(t)?t.replace(as,Yy):t}var Jy=1/0,Ky=oe&&1/on(new oe([,-0]))[1]==Jy?function(t){return new oe(t)}:Wn,Qy=200;function Bt(t,e,n){var i=-1,r=Je,o=t.length,a=!0,s=[],l=s;if(n)a=!1,r=bi;else if(Qy<=o){var p=e?null:Ky(t);if(p)return on(p);a=!1,r=Le,l=new Jt}else l=e?[]:s;t:for(;++i<o;){var d=t[i],u=e?e(d):d,d=n||d!==0?d:0;if(a&&u==u){for(var f=l.length;f--;)if(l[f]===u)continue t;e&&l.push(u),s.push(d)}else r(l,u,n)||(l!==s&&l.push(u),s.push(d))}return s}var t_=C(function(t){return Bt(J(t,1,Y,!0))}),e_=C(function(t){var e=ht(t);return Y(e)&&(e=void 0),Bt(J(t,1,Y,!0),L(e))}),n_=C(function(t){var e=typeof(e=ht(t))=="function"?e:void 0;return Bt(J(t,1,Y,!0),void 0,e)});function i_(t){return t&&t.length?Bt(t):[]}function r_(t,e){return t&&t.length?Bt(t,L(e)):[]}function o_(t,e){return e=typeof e=="function"?e:void 0,t&&t.length?Bt(t,void 0,e):[]}var a_=0;function s_(t){var e=++a_;return P(t)+e}function l_(t,e){return t==null||Li(t,e)}var c_=Math.max;function Mi(t){if(!t||!t.length)return[];var e=0;return t=Gt(t,function(n){if(Y(n))return e=c_(n.length,e),!0}),Vn(e,function(n){return H(t,hi(n))})}function ss(t,e){return!t||!t.length?[]:(t=Mi(t),e==null?t:H(t,function(n){return dt(e,void 0,n)}))}function ls(t,e,n,i){return ze(t,e,n(ee(t,e)),i)}function u_(t,e,n){return t==null?t:ls(t,e,Rt(n))}function d_(t,e,n,i){return i=typeof i=="function"?i:void 0,t==null?t:ls(t,e,Rt(n),i)}var p_=pe(function(t,e,n){return t+(n?" ":"")+e.toUpperCase()});function h_(t){return t==null?[]:_i(t,at(t))}var f_=C(function(t,e){return Y(t)?Ne(t,e):[]});function g_(t,e){return fn(Rt(e),t)}var m_=$t(function(t){function e(o){return Jn(o,t)}var n=t.length,i=n?t[0]:0,r=this.__wrapped__;return!(1<n||this.__actions__.length)&&r instanceof M&&zt(i)?((r=r.slice(i,+i+(n?1:0))).__actions__.push({func:Te,args:[e],thisArg:void 0}),new mt(r,this.__chain__).thru(function(o){return n&&!o.length&&o.push(void 0),o})):this.thru(e)});function b_(){return Do(this)}function v_(){var t=this.__wrapped__;return t instanceof M?(t=t,(t=(t=this.__actions__.length?new M(this):t).reverse()).__actions__.push({func:Te,args:[$n],thisArg:void 0}),new mt(t,this.__chain__)):this.thru($n)}function Ni(t,e,n){var i=t.length;if(i<2)return i?Bt(t[0]):[];for(var r=-1,o=Array(i);++r<i;)for(var a=t[r],s=-1;++s<i;)s!=r&&(o[r]=Ne(o[r]||a,t[s],e,n));return Bt(J(o,1),e,n)}var y_=C(function(t){return Ni(Gt(t,Y))}),__=C(function(t){var e=ht(t);return Y(e)&&(e=void 0),Ni(Gt(t,Y),L(e))}),w_=C(function(t){var e=typeof(e=ht(t))=="function"?e:void 0;return Ni(Gt(t,Y),void 0,e)}),x_=C(Mi);function cs(t,e,n){for(var i=-1,r=t.length,o=e.length,a={};++i<r;){var s=i<o?e[i]:void 0;n(a,t[i],s)}return a}function k_(t,e){return cs(t||[],e||[],Ce)}function A_(t,e){return cs(t||[],e||[],ze)}var E_=C(function(t){var e=t.length,e=typeof(e=1<e?t[e-1]:void 0)=="function"?(t.pop(),e):void 0;return ss(t,e)}),x={chunk:ep,compact:Ph,concat:jh,difference:qf,differenceBy:Hf,differenceWith:Gf,drop:Uf,dropRight:Yf,dropRightWhile:Xf,dropWhile:Zf,fill:pg,findIndex:Ea,findLastIndex:Sa,first:Cr,flatten:po,flattenDeep:Lg,flattenDepth:Sg,fromPairs:Wg,head:Cr,indexOf:lm,initial:cm,intersection:dm,intersectionBy:pm,intersectionWith:hm,join:lb,last:ht,lastIndexOf:fb,nth:Bb,pull:$v,pullAll:Xa,pullAllBy:Dv,pullAllWith:Fv,pullAt:qv,remove:s0,reverse:$n,slice:C0,sortedIndex:F0,sortedIndexBy:B0,sortedIndexOf:W0,sortedLastIndex:q0,sortedLastIndexBy:H0,sortedLastIndexOf:G0,sortedUniq:V0,sortedUniqBy:U0,tail:sy,take:ly,takeRight:cy,takeRightWhile:uy,takeWhile:dy,union:t_,unionBy:e_,unionWith:n_,uniq:i_,uniqBy:r_,uniqWith:o_,unzip:Mi,unzipWith:ss,without:f_,xor:y_,xorBy:__,xorWith:w_,zip:x_,zipObject:k_,zipObjectDeep:A_,zipWith:E_},$={countBy:Sf,each:Er,eachRight:Lr,every:cg,filter:hg,find:gg,findLast:yg,flatMap:wg,flatMapDeep:kg,flatMapDepth:Ag,forEach:Er,forEachRight:Lr,groupBy:Ug,includes:am,invokeMap:xm,keyBy:ub,map:cn,orderBy:Kb,partition:Rv,reduce:i0,reduceRight:o0,reject:a0,sample:b0,sampleSize:_0,shuffle:E0,size:T0,some:M0,sortBy:N0},L_={now:Fe},V={after:js,ary:io,before:go,bind:Ge,bindKey:Qn,curry:gi,curryRight:mi,debounce:la,defer:Ff,delay:Bf,flip:Cg,memoize:nn,negate:Se,once:Xb,overArgs:nv,partial:fn,partialRight:Ti,rearg:n0,rest:d0,spread:K0,throttle:Ty,unary:Vy,wrap:g_},k={castArray:Xd,clone:Lh,cloneDeep:Ch,cloneDeepWith:Mh,cloneWith:Oh,conformsTo:xf,eq:At,gt:Yg,gte:Xg,isArguments:Kt,isArray:E,isArrayBuffer:Em,isArrayLike:ot,isArrayLikeObject:Y,isBoolean:Sm,isBuffer:Ft,isDate:Im,isElement:Rm,isEmpty:Pm,isEqual:jm,isEqualWith:$m,isError:Kn,isFinite:Fm,isFunction:Tt,isInteger:Na,isLength:Qe,isMap:Uo,isMatch:Bm,isMatchWith:Wm,isNaN:Hm,isNative:Um,isNil:Ym,isNull:Xm,isNumber:Oa,isObject:G,isObjectLike:U,isPlainObject:Re,isRegExp:ki,isSafeInteger:Km,isSet:Yo,isString:pn,isSymbol:ct,isTypedArray:ue,isUndefined:Qm,isWeakMap:eb,isWeakSet:ib,lt:bb,lte:vb,toArray:ja,toFinite:Ot,toInteger:T,toLength:xa,toNumber:gt,toPlainObject:da,toSafeInteger:zy,toString:P},tt={add:Ts,ceil:Kd,divide:Vf,floor:Ig,max:Eb,maxBy:Lb,mean:Tb,meanBy:Cb,min:Nb,minBy:Ob,multiply:zb,round:g0,subtract:ry,sum:oy,sumBy:ay},Ln={clamp:np,inRange:im,random:Xv},A={assign:Wc,assignIn:nr,assignInWith:He,assignWith:Uc,at:Su,create:Tf,defaults:Pf,defaultsDeep:$f,entries:Sr,entriesIn:Tr,extend:nr,extendWith:He,findKey:mg,findLastKey:_g,forIn:$g,forInRight:Dg,forOwn:Fg,forOwnRight:Bg,functions:qg,functionsIn:Hg,get:Zn,has:Qg,hasIn:pi,invert:bm,invertBy:_m,invoke:wm,keys:X,keysIn:at,mapKeys:yb,mapValues:_b,merge:Ib,mergeWith:ha,omit:Ub,omitBy:Yb,pick:Nv,pickBy:Fa,result:p0,set:w0,setWith:x0,toPairs:Sr,toPairsIn:Tr,transform:jy,unset:l_,update:u_,updateWith:d_,values:he,valuesIn:h_},Et={at:m_,chain:Do,commit:zh,lodash:c,next:Fb,plant:Ov,reverse:v_,tap:py,thru:Te,toIterator:My,toJSON:En,value:En,valueOf:En,wrapperChain:b_},O={camelCase:Yd,capitalize:ko,deburr:Ao,endsWith:Kf,escape:ya,escapeRegExp:sg,kebabCase:cb,lowerCase:gb,lowerFirst:mb,pad:kv,padEnd:Av,padStart:Ev,parseInt:Tv,repeat:l0,replace:c0,snakeCase:I0,split:X0,startCase:Q0,startsWith:ty,template:Ly,templateSettings:Dn,toLower:Ny,toUpper:Py,trim:$y,trimEnd:Dy,trimStart:By,truncate:Gy,unescape:Zy,upperCase:p_,upperFirst:ti,words:$o},z={attempt:fo,bindAll:$u,cond:vf,conforms:wf,constant:Hn,defaultTo:Of,flow:Pg,flowRight:jg,identity:et,iteratee:ob,matches:xb,matchesProperty:Ab,method:Rb,methodOf:Mb,mixin:Pa,noop:Wn,nthArg:Wb,over:Qb,overEvery:iv,overSome:rv,property:ra,propertyOf:zv,range:Qv,rangeRight:t0,stubArray:ri,stubFalse:Un,stubObject:ey,stubString:ny,stubTrue:iy,times:Ry,toPath:Oy,uniqueId:s_};function S_(){var t=new M(this.__wrapped__);return t.__actions__=rt(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=rt(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=rt(this.__views__),t}function T_(){var t;return this.__filtered__?((t=new M(this)).__dir__=-1,t.__filtered__=!0):(t=this.clone()).__dir__*=-1,t}var C_=Math.max,I_=Math.min;function R_(t,e,n){for(var i=-1,r=n.length;++i<r;){var o=n[i],a=o.size;switch(o.type){case"drop":t+=a;break;case"dropRight":e-=a;break;case"take":e=I_(e,t+a);break;case"takeRight":t=C_(t,e-a)}}return{start:t,end:e}}var M_=1,N_=2,O_=Math.min;function z_(){var t=this.__wrapped__.value(),e=this.__dir__,n=E(t),i=e<0,r=n?t.length:0,a=R_(0,r,this.__views__),o=a.start,a=a.end,s=a-o,l=i?a:o-1,p=this.__iteratees__,u=p.length,d=0,f=O_(s,this.__takeCount__);if(!n||!i&&r==s&&f==s)return is(t,this.__actions__);var h=[];t:for(;s--&&d<f;){for(var g=-1,b=t[l+=e];++g<u;){var y=p[g],w=y.iteratee,y=y.type,w=w(b);if(y==N_)b=w;else if(!w){if(y==M_)continue t;break t}}h[d++]=b}return h}var P_="4.17.21",j_=2,$_=1,D_=3,Dr=4294967295,F_=Array.prototype,B_=Object.prototype,Fr=B_.hasOwnProperty,Br=Q?Q.iterator:void 0,W_=Math.max,Wr=Math.min,Sn=function(t){return function(e,n,i){var r,o;return i!=null||((o=(o=(r=G(n))&&X(n))&&o.length&&un(n,o))?o.length:r)||(i=n,n=e,e=this),t(e,n,i)}}(Pa);c.after=V.after,c.ary=V.ary,c.assign=A.assign,c.assignIn=A.assignIn,c.assignInWith=A.assignInWith,c.assignWith=A.assignWith,c.at=A.at,c.before=V.before,c.bind=V.bind,c.bindAll=z.bindAll,c.bindKey=V.bindKey,c.castArray=k.castArray,c.chain=Et.chain,c.chunk=x.chunk,c.compact=x.compact,c.concat=x.concat,c.cond=z.cond,c.conforms=z.conforms,c.constant=z.constant,c.countBy=$.countBy,c.create=A.create,c.curry=V.curry,c.curryRight=V.curryRight,c.debounce=V.debounce,c.defaults=A.defaults,c.defaultsDeep=A.defaultsDeep,c.defer=V.defer,c.delay=V.delay,c.difference=x.difference,c.differenceBy=x.differenceBy,c.differenceWith=x.differenceWith,c.drop=x.drop,c.dropRight=x.dropRight,c.dropRightWhile=x.dropRightWhile,c.dropWhile=x.dropWhile,c.fill=x.fill,c.filter=$.filter,c.flatMap=$.flatMap,c.flatMapDeep=$.flatMapDeep,c.flatMapDepth=$.flatMapDepth,c.flatten=x.flatten,c.flattenDeep=x.flattenDeep,c.flattenDepth=x.flattenDepth,c.flip=V.flip,c.flow=z.flow,c.flowRight=z.flowRight,c.fromPairs=x.fromPairs,c.functions=A.functions,c.functionsIn=A.functionsIn,c.groupBy=$.groupBy,c.initial=x.initial,c.intersection=x.intersection,c.intersectionBy=x.intersectionBy,c.intersectionWith=x.intersectionWith,c.invert=A.invert,c.invertBy=A.invertBy,c.invokeMap=$.invokeMap,c.iteratee=z.iteratee,c.keyBy=$.keyBy,c.keys=X,c.keysIn=A.keysIn,c.map=$.map,c.mapKeys=A.mapKeys,c.mapValues=A.mapValues,c.matches=z.matches,c.matchesProperty=z.matchesProperty,c.memoize=V.memoize,c.merge=A.merge,c.mergeWith=A.mergeWith,c.method=z.method,c.methodOf=z.methodOf,c.mixin=Sn,c.negate=Se,c.nthArg=z.nthArg,c.omit=A.omit,c.omitBy=A.omitBy,c.once=V.once,c.orderBy=$.orderBy,c.over=z.over,c.overArgs=V.overArgs,c.overEvery=z.overEvery,c.overSome=z.overSome,c.partial=V.partial,c.partialRight=V.partialRight,c.partition=$.partition,c.pick=A.pick,c.pickBy=A.pickBy,c.property=z.property,c.propertyOf=z.propertyOf,c.pull=x.pull,c.pullAll=x.pullAll,c.pullAllBy=x.pullAllBy,c.pullAllWith=x.pullAllWith,c.pullAt=x.pullAt,c.range=z.range,c.rangeRight=z.rangeRight,c.rearg=V.rearg,c.reject=$.reject,c.remove=x.remove,c.rest=V.rest,c.reverse=x.reverse,c.sampleSize=$.sampleSize,c.set=A.set,c.setWith=A.setWith,c.shuffle=$.shuffle,c.slice=x.slice,c.sortBy=$.sortBy,c.sortedUniq=x.sortedUniq,c.sortedUniqBy=x.sortedUniqBy,c.split=O.split,c.spread=V.spread,c.tail=x.tail,c.take=x.take,c.takeRight=x.takeRight,c.takeRightWhile=x.takeRightWhile,c.takeWhile=x.takeWhile,c.tap=Et.tap,c.throttle=V.throttle,c.thru=Te,c.toArray=k.toArray,c.toPairs=A.toPairs,c.toPairsIn=A.toPairsIn,c.toPath=z.toPath,c.toPlainObject=k.toPlainObject,c.transform=A.transform,c.unary=V.unary,c.union=x.union,c.unionBy=x.unionBy,c.unionWith=x.unionWith,c.uniq=x.uniq,c.uniqBy=x.uniqBy,c.uniqWith=x.uniqWith,c.unset=A.unset,c.unzip=x.unzip,c.unzipWith=x.unzipWith,c.update=A.update,c.updateWith=A.updateWith,c.values=A.values,c.valuesIn=A.valuesIn,c.without=x.without,c.words=O.words,c.wrap=V.wrap,c.xor=x.xor,c.xorBy=x.xorBy,c.xorWith=x.xorWith,c.zip=x.zip,c.zipObject=x.zipObject,c.zipObjectDeep=x.zipObjectDeep,c.zipWith=x.zipWith,c.entries=A.toPairs,c.entriesIn=A.toPairsIn,c.extend=A.assignIn,c.extendWith=A.assignInWith,Sn(c,c),c.add=tt.add,c.attempt=z.attempt,c.camelCase=O.camelCase,c.capitalize=O.capitalize,c.ceil=tt.ceil,c.clamp=Ln.clamp,c.clone=k.clone,c.cloneDeep=k.cloneDeep,c.cloneDeepWith=k.cloneDeepWith,c.cloneWith=k.cloneWith,c.conformsTo=k.conformsTo,c.deburr=O.deburr,c.defaultTo=z.defaultTo,c.divide=tt.divide,c.endsWith=O.endsWith,c.eq=k.eq,c.escape=O.escape,c.escapeRegExp=O.escapeRegExp,c.every=$.every,c.find=$.find,c.findIndex=x.findIndex,c.findKey=A.findKey,c.findLast=$.findLast,c.findLastIndex=x.findLastIndex,c.findLastKey=A.findLastKey,c.floor=tt.floor,c.forEach=$.forEach,c.forEachRight=$.forEachRight,c.forIn=A.forIn,c.forInRight=A.forInRight,c.forOwn=A.forOwn,c.forOwnRight=A.forOwnRight,c.get=A.get,c.gt=k.gt,c.gte=k.gte,c.has=A.has,c.hasIn=A.hasIn,c.head=x.head,c.identity=et,c.includes=$.includes,c.indexOf=x.indexOf,c.inRange=Ln.inRange,c.invoke=A.invoke,c.isArguments=k.isArguments,c.isArray=E,c.isArrayBuffer=k.isArrayBuffer,c.isArrayLike=k.isArrayLike,c.isArrayLikeObject=k.isArrayLikeObject,c.isBoolean=k.isBoolean,c.isBuffer=k.isBuffer,c.isDate=k.isDate,c.isElement=k.isElement,c.isEmpty=k.isEmpty,c.isEqual=k.isEqual,c.isEqualWith=k.isEqualWith,c.isError=k.isError,c.isFinite=k.isFinite,c.isFunction=k.isFunction,c.isInteger=k.isInteger,c.isLength=k.isLength,c.isMap=k.isMap,c.isMatch=k.isMatch,c.isMatchWith=k.isMatchWith,c.isNaN=k.isNaN,c.isNative=k.isNative,c.isNil=k.isNil,c.isNull=k.isNull,c.isNumber=k.isNumber,c.isObject=G,c.isObjectLike=k.isObjectLike,c.isPlainObject=k.isPlainObject,c.isRegExp=k.isRegExp,c.isSafeInteger=k.isSafeInteger,c.isSet=k.isSet,c.isString=k.isString,c.isSymbol=k.isSymbol,c.isTypedArray=k.isTypedArray,c.isUndefined=k.isUndefined,c.isWeakMap=k.isWeakMap,c.isWeakSet=k.isWeakSet,c.join=x.join,c.kebabCase=O.kebabCase,c.last=ht,c.lastIndexOf=x.lastIndexOf,c.lowerCase=O.lowerCase,c.lowerFirst=O.lowerFirst,c.lt=k.lt,c.lte=k.lte,c.max=tt.max,c.maxBy=tt.maxBy,c.mean=tt.mean,c.meanBy=tt.meanBy,c.min=tt.min,c.minBy=tt.minBy,c.stubArray=z.stubArray,c.stubFalse=z.stubFalse,c.stubObject=z.stubObject,c.stubString=z.stubString,c.stubTrue=z.stubTrue,c.multiply=tt.multiply,c.nth=x.nth,c.noop=z.noop,c.now=L_.now,c.pad=O.pad,c.padEnd=O.padEnd,c.padStart=O.padStart,c.parseInt=O.parseInt,c.random=Ln.random,c.reduce=$.reduce,c.reduceRight=$.reduceRight,c.repeat=O.repeat,c.replace=O.replace,c.result=A.result,c.round=tt.round,c.sample=$.sample,c.size=$.size,c.snakeCase=O.snakeCase,c.some=$.some,c.sortedIndex=x.sortedIndex,c.sortedIndexBy=x.sortedIndexBy,c.sortedIndexOf=x.sortedIndexOf,c.sortedLastIndex=x.sortedLastIndex,c.sortedLastIndexBy=x.sortedLastIndexBy,c.sortedLastIndexOf=x.sortedLastIndexOf,c.startCase=O.startCase,c.startsWith=O.startsWith,c.subtract=tt.subtract,c.sum=tt.sum,c.sumBy=tt.sumBy,c.template=O.template,c.times=z.times,c.toFinite=k.toFinite,c.toInteger=T,c.toLength=k.toLength,c.toLower=O.toLower,c.toNumber=k.toNumber,c.toSafeInteger=k.toSafeInteger,c.toString=k.toString,c.toUpper=O.toUpper,c.trim=O.trim,c.trimEnd=O.trimEnd,c.trimStart=O.trimStart,c.truncate=O.truncate,c.unescape=O.unescape,c.uniqueId=z.uniqueId,c.upperCase=O.upperCase,c.upperFirst=O.upperFirst,c.each=$.forEach,c.eachRight=$.forEachRight,c.first=x.head,Sn(c,function(){var t={};return Lt(c,function(e,n){Fr.call(c.prototype,n)||(t[n]=e)}),t}(),{chain:!1}),c.VERSION=P_,(c.templateSettings=O.templateSettings).imports._=c,ft(["bind","bindKey","curry","curryRight","partial","partialRight"],function(t){c[t].placeholder=c}),ft(["drop","take"],function(t,e){M.prototype[t]=function(n){n=n===void 0?1:W_(T(n),0);var i=this.__filtered__&&!e?new M(this):this.clone();return i.__filtered__?i.__takeCount__=Wr(n,i.__takeCount__):i.__views__.push({size:Wr(n,Dr),type:t+(i.__dir__<0?"Right":"")}),i},M.prototype[t+"Right"]=function(n){return this.reverse()[t](n).reverse()}}),ft(["filter","map","takeWhile"],function(t,e){var n=e+1,i=n==$_||n==D_;M.prototype[t]=function(r){var o=this.clone();return o.__iteratees__.push({iteratee:L(r),type:n}),o.__filtered__=o.__filtered__||i,o}}),ft(["head","last"],function(t,e){var n="take"+(e?"Right":"");M.prototype[t]=function(){return this[n](1).value()[0]}}),ft(["initial","tail"],function(t,e){var n="drop"+(e?"":"Right");M.prototype[t]=function(){return this.__filtered__?new M(this):this[n](1)}}),M.prototype.compact=function(){return this.filter(et)},M.prototype.find=function(t){return this.filter(t).head()},M.prototype.findLast=function(t){return this.reverse().find(t)},M.prototype.invokeMap=C(function(t,e){return typeof t=="function"?new M(this):this.map(function(n){return Oe(n,t,e)})}),M.prototype.reject=function(t){return this.filter(Se(L(t)))},M.prototype.slice=function(t,e){t=T(t);var n=this;return n.__filtered__&&(0<t||e<0)?new M(n):(t<0?n=n.takeRight(-t):t&&(n=n.drop(t)),e!==void 0?(e=T(e))<0?n.dropRight(-e):n.take(e-t):n)},M.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},M.prototype.toArray=function(){return this.take(Dr)},Lt(M.prototype,function(t,e){var n=/^(?:filter|find|map|reject)|While$/.test(e),i=/^(?:head|last)$/.test(e),r=c[i?"take"+(e=="last"?"Right":""):e],o=i||/^find/.test(e);r&&(c.prototype[e]=function(){function a(b){return b=r.apply(c,qt([b],p)),i&&d?b[0]:b}var s,l=this.__wrapped__,p=i?[1]:arguments,g=l instanceof M,f=p[0],u=g||E(l),d=(u&&n&&typeof f=="function"&&f.length!=1&&(g=u=!1),this.__chain__),f=!!this.__actions__.length,h=o&&!d,g=g&&!f;return!o&&u?(l=g?l:new M(this),(s=t.apply(l,p)).__actions__.push({func:Te,args:[a],thisArg:void 0}),new mt(s,d)):h&&g?t.apply(this,p):(s=this.thru(a),h?i?s.value()[0]:s.value():s)})}),ft(["pop","push","shift","sort","splice","unshift"],function(t){var e=F_[t],n=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",i=/^(?:pop|shift)$/.test(t);c.prototype[t]=function(){var r,o=arguments;return i&&!this.__chain__?(r=this.value(),e.apply(E(r)?r:[],o)):this[n](function(a){return e.apply(E(a)?a:[],o)})}}),Lt(M.prototype,function(t,e){var n,i=c[e];i&&(n=i.name+"",Fr.call(re,n)||(re[n]=[]),re[n].push({name:e,func:i}))}),re[Ke(void 0,j_).name]=[{name:"wrapper",func:void 0}],M.prototype.clone=S_,M.prototype.reverse=T_,M.prototype.value=z_,c.prototype.at=Et.at,c.prototype.chain=Et.wrapperChain,c.prototype.commit=Et.commit,c.prototype.next=Et.next,c.prototype.plant=Et.plant,c.prototype.reverse=Et.reverse,c.prototype.toJSON=c.prototype.valueOf=c.prototype.value=Et.value,c.prototype.first=c.prototype.head,Br&&(c.prototype[Br]=Et.toIterator);const q_=["abstract","else","instanceof","super","boolean","enum","int","switch","break","export","interface","synchronized","byte","extends","let","this","case","false","long","throw","catch","final","native","throws","char","finally","new","transient","class","float","null","true","const","for","package","try","continue","function","private","typeof","debugger","goto","protected","var","default","if","public","void","delete","implements","return","volatile","do","import","short","while","double","in","static","with"];function H_(t,e,n){return e=e||q_,t=(t=(t=(t=(t=(t=t.replace(/\b(\w+)\b/g,function(i){return e.indexOf(i)!=-1?"<span class='rsv'>"+i+"</span>":i})).replace(/\b([0-9]+)\b/g,function(i){return"<span class='num'>"+i+"</span>"})).replace(/(\w+\.\w+)/g,function(i){return i=i.split("."),"<span class='obj'>"+i[0]+"</span>.<span class='prop'>"+i[1]+"</span>"})).replace(/(\w+)\(/g,function(i){return"<span class='prop'>"+i.substr(0,i.length-1)+"</span>("})).replace(/(\"(\\.|[^\"])*\")/g,function(i){return"<span class='str'>"+i+"</span>"})).replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,function(i){return"<span class='cmnt'>"+i.replace(/<[^>]*>/g,"")+"</span>"}),t=n?t:"<style>.obj { color: #79B; } .prop { color: #B97; }	.str,.num { color: #A79; } .cmnt { color: #798; } .rsv { color: #9AB; } </style>"+t}function B(t,n){(t&&t.constructor===String||n)&&(o=t,(t=n||{}).id=o,console.warn("LiteGUI.Area legacy parameter, use options as first parameter instead of id.")),t=t||{};var n=document.createElement("div"),o=(n.className="litearea",t.id&&(n.id=t.id),t.className&&(n.className+=" "+t.className),this.root=n,this.root.litearea=this,t.width||"100%"),i=t.height||"100%",r=(o<0&&(o="calc( 100% - "+Math.abs(o)+"px)"),i<0&&(i="calc( 100% - "+Math.abs(i)+"px)"),n.style.width=o,n.style.height=i,this.options=t,this),o=(this._computed_size=[this.root.offsetWidth,this.root.offserHeight],document.createElement("div"));t.content_id&&(o.id=t.content_id),o.className="liteareacontent",o.style.width="100%",o.style.height="100%",this.root.appendChild(o),this.content=o,this.split_direction="none",this.sections=[],t.autoresize&&m.bind(m,"resized",function(){r.onResize()})}function Yt(t){t=t||{},this.root=document.createElement("div"),this.root.className="liteconsole",this.root.innerHTML="<div class='log'></div><div class='foot'><input type='text'/></div>",this.log_element=this.root.querySelector(".log"),this.input=this.root.querySelector("input"),this.input.addEventListener("keydown",this.processKeyDown.bind(this)),this._prompt=t.prompt||"]",this.onAutocomplete=null,this.onProcessCommand=null,this.history=[],this._history_offset=0}function N(t,e){var n;(e||t&&t.constructor===String)&&(n=t,(t=e||{}).id=n,console.warn("LiteGUI.Dialog legacy parameter, use options as first parameter instead of id.")),this._ctor(t)}function Be(t,e){t==null?t=0:t.constructor===String?t=parseFloat(t):t.constructor!==Number&&(t=0),this.value=t;var n=e.precision!=null?e.precision:3,i=(this.options=e||{},document.createElement("div")),r=(i.className="dragger "+(e.extraclass||""),this.root=i,document.createElement("span")),o=(r.className="inputfield "+(e.extraclass||"")+(e.full?" full":""),e.disabled&&(r.className+=" disabled"),i.appendChild(r),e.dragger_class||"full"),a=document.createElement("input"),s=(a.className="text number "+(o||""),a.value=t.toFixed(n)+(e.units||""),a.tabIndex=e.tab_index,this.input=a,i.input=a,e.disabled&&(a.disabled=!0),e.tab_index&&(a.tabIndex=e.tab_index),r.appendChild(a),a.addEventListener("keydown",function(h){if(h.keyCode==38)f(1,h);else{if(h.keyCode!=40)return;f(-1,h)}return h.stopPropagation(),h.preventDefault(),!0}),document.createElement("div")),l=(s.className="drag_widget",e.disabled&&(s.className+=" disabled"),r.appendChild(s),(i.dragger=s).addEventListener("mousedown",function(h){(l=a.ownerDocument).removeEventListener("mousemove",p),l.removeEventListener("mouseup",d),e.disabled||(i.requestPointerLock&&i.requestPointerLock(),l.addEventListener("mousemove",p),l.addEventListener("mouseup",d),s.data=[h.screenX,h.screenY],m.trigger(i,"start_dragging")),h.stopPropagation(),h.preventDefault()}),a.addEventListener("wheel",u,!1),a.addEventListener("mousewheel",u,!1),null);function p(h){var g=[h.screenX-s.data[0],s.data[1]-h.screenY],b=(h.movementX!==void 0&&(g=[h.movementX,-h.movementY]),s.data=[h.screenX,h.screenY],e.horizontal?0:1);return f(g[b],h),h.stopPropagation(),h.preventDefault(),!1}function u(h){document.activeElement===this&&(f(0<(h.wheelDelta!==void 0?h.wheelDelta:h.deltaY?-h.deltaY/3:0)?1:-1,h),h.stopPropagation(),h.preventDefault())}function d(h){m.trigger(i,"stop_dragging");var g=l||document;return l=null,g.removeEventListener("mousemove",p),g.removeEventListener("mouseup",d),g.exitPointerLock&&g.exitPointerLock(),m.trigger(s,"blur"),h.stopPropagation(),h.preventDefault(),!1}function f(h,y){e.linear||(h=0<h?Math.pow(h,1.2):-1*Math.pow(Math.abs(h),1.2));var b=e.step||1,y=(y&&y.shiftKey?b*=10:y&&y.ctrlKey&&(b*=.1),parseFloat(a.value)+h*b);e.max!=null&&y>e.max&&(y=e.max),e.min!=null&&y<e.min&&(y=e.min),a.value=y.toFixed(n),e.units&&(a.value+=e.units),m.trigger(a,"change")}}function _(t){var e;t&&t.constructor===String&&(e=t,(t=arguments[1]||{}).id=e,console.warn("LiteGUI.Inspector legacy parameter, use options as first parameter instead of id.")),t=t||{},this.root=document.createElement("DIV"),this.root.className="inspector "+(t.full?"full":"")+(t.className||""),t.one_line&&(this.one_line=!0,this.root.className+=" one_line"),t.id&&(this.root.id=t.id),this.sections=[],this.values={},this.widgets=[],this.widgets_by_name={},this.row_number=0,this.addContainer(),this.tab_index=Math.floor(1e4*Math.random()),t.width&&(this.root.style.width=m.sizeToCSS(t.width)),t.height&&(this.root.style.height=m.sizeToCSS(t.height),t.one_line||(this.root.style.overflow="auto")),t.name_width&&(this.name_width=t.name_width),t.widgets_width&&(this.widgets_width=t.widgets_width),t.noscroll&&(this.root.style.overflow="hidden"),t.onchange&&(this.onchange=t.onchange),t.parent&&this.appendTo(t.parent),this.className=this.root.className,this.widgets_per_row=t.widgets_per_row||1}B.VERTICAL="vertical",B.HORIZONTAL="horizontal",B.splitbar_size=4,B.prototype.getSection=function(t){return this.sections.length>(t=t||0)?this.sections[t]:null},B.prototype.onResize=function(t){var e=[this.root.offsetWidth,this.root.offsetHeight];t&&this._computed_size&&e[0]==this._computed_size[0]&&e[1]==this._computed_size[1]||this.sendResizeEvent(t)},B.prototype.sendResizeEvent=function(t){if(this.sections.length)for(var e in this.sections)this.sections[e].onResize(t);else for(var n=0;n<this.root.childNodes.length;n++){var i=this.root.childNodes[n];i.litearea?i.litearea.onResize():m.trigger(i,"resize")}this.onresize&&this.onresize()},B.prototype.getWidth=function(){return this.root.offsetWidth},B.prototype.getHeight=function(){return this.root.offsetHeight},B.prototype.isVisible=function(){return this.root.style.display!="none"},B.prototype.adjustHeight=function(){var t;this.root.parentNode?(this.root.parentNode.offsetHeight,t=this.root.getClientRects()[0].top,this.root.style.height="calc( 100% - "+t+"px )"):console.error("Cannot adjust height of LiteGUI.Area without parent")},B.prototype.split=function(t,e,n){if(!t||t.constructor!==String||(e=e||["50%",null],t!="vertical"&&t!="horizontal"))throw"First parameter must be a string: 'vertical' or 'horizontal'";if(this.sections.length)throw"cannot split twice";var i,r,o=new m.Area({content_id:this.content.id}),a=(o.root.style.display="inline-block",new m.Area),s=(a.root.style.display="inline-block",""),l=null,p=null,u=(n&&(s=" - "+(B.splitbar_size+2)+"px",(l=document.createElement("div")).className="litesplitbar "+t,t=="vertical"?l.style.height=B.splitbar_size+"px":l.style.width=B.splitbar_size+"px",(this.splitbar=l).addEventListener("mousedown",function(g){var b=u.root.ownerDocument;b.addEventListener("mousemove",f),b.addEventListener("mouseup",h),d[0]=g.pageX,d[1]=g.pageY,g.stopPropagation(),g.preventDefault()})),e=e||["50%",null],t=="vertical"?(o.root.style.width="100%",a.root.style.width="100%",e[0]==null?(typeof(r=e[1])=="number"&&(r=e[1]+"px"),o.root.style.height="-moz-calc( 100% - "+r+s+" )",o.root.style.height="-webkit-calc( 100% - "+r+s+" )",o.root.style.height="calc( 100% - "+r+s+" )",a.root.style.height=r,a.size=r,p=o):e[1]==null?(typeof(r=e[0])=="number"&&(r=e[0]+"px"),o.root.style.height=r,o.size=r,a.root.style.height="-moz-calc( 100% - "+r+s+" )",a.root.style.height="-webkit-calc( 100% - "+r+s+" )",a.root.style.height="calc( 100% - "+r+s+" )",p=a):(typeof(n=e[0])=="number"&&(n=e[0]+"px"),typeof(r=e[1])=="number"&&(r=e[1]+"px"),o.root.style.height=n,o.size=n,a.root.style.height=r,a.size=r)):(o.root.style.height="100%",a.root.style.height="100%",e[0]==null?(typeof(i=e[1])=="number"&&(i=e[1]+"px"),o.root.style.width="-moz-calc( 100% - "+i+s+" )",o.root.style.width="-webkit-calc( 100% - "+i+s+" )",o.root.style.width="calc( 100% - "+i+s+" )",a.root.style.width=i,a.size=e[1],p=o):e[1]==null?(typeof(i=e[0])=="number"&&(i=e[0]+"px"),o.root.style.width=i,o.size=i,a.root.style.width="-moz-calc( 100% - "+i+s+" )",a.root.style.width="-webkit-calc( 100% - "+i+s+" )",a.root.style.width="calc( 100% - "+i+s+" )",p=a):(typeof(n=e[0])=="number"&&(n=e[0]+"px"),typeof(r=e[1])=="number"&&(r=e[1]+"px"),o.root.style.width=n,o.size=n,a.root.style.width=r,a.size=r)),o.root.removeChild(o.content),o.root.appendChild(this.content),o.content=this.content,this.root.appendChild(o.root),l&&this.root.appendChild(l),this.root.appendChild(a.root),this.sections=[o,a],this.dynamic_section=p,this.direction=t,this),d=[0,0];function f(g){t=="horizontal"?d[0]!=g.pageX&&u.moveSplit(d[0]-g.pageX):t=="vertical"&&d[1]!=g.pageY&&u.moveSplit(g.pageY-d[1]),d[0]=g.pageX,d[1]=g.pageY,g.stopPropagation(),g.preventDefault(),(u.options.immediateResize||u.options.inmediateResize)&&u.onResize()}function h(g){var b=u.root.ownerDocument;b.removeEventListener("mousemove",f),b.removeEventListener("mouseup",h),u.onResize()}},B.prototype.hide=function(){this.root.style.display="none"},B.prototype.show=function(){this.root.style.display="block"},B.prototype.showSection=function(t){var e=this.sections[t],n=0;if(!e||e.root.style.display=="none"){for(var i in(n=this.direction=="horizontal"?e.root.style.width:e.root.style.height).indexOf("calc")!=-1&&(n="50%"),this.sections)e=this.sections[i],i==t?e.root.style.display="inline-block":this.direction=="horizontal"?e.root.style.width="calc( 100% - "+n+" - 5px)":e.root.style.height="calc( 100% - "+n+" - 5px)";this.splitbar&&(this.splitbar.style.display="inline-block"),this.sendResizeEvent()}},B.prototype.hideSection=function(t){for(var e in this.sections){var n=this.sections[e];e==t?n.root.style.display="none":this.direction=="horizontal"?n.root.style.width="100%":n.root.style.height="100%"}this.splitbar&&(this.splitbar.style.display="none"),this.sendResizeEvent()},B.prototype.moveSplit=function(t){if(this.sections)for(var e,n=this.sections[0],i=this.sections[1],r=" - "+B.splitbar_size+"px",o=this.options.minSplitSize||10,a=(this.direction=="horizontal"?this.dynamic_section==n?(e=i.root.offsetWidth+t,n.root.style.width="-moz-calc( 100% - "+(e=e<o?o:e)+"px "+r+" )",n.root.style.width="-webkit-calc( 100% - "+e+"px "+r+" )",n.root.style.width="calc( 100% - "+e+"px "+r+" )",i.root.style.width=e+"px"):(e=n.root.offsetWidth-t,i.root.style.width="-moz-calc( 100% - "+(e=e<o?o:e)+"px "+r+" )",i.root.style.width="-webkit-calc( 100% - "+e+"px "+r+" )",i.root.style.width="calc( 100% - "+e+"px "+r+" )",n.root.style.width=e+"px"):this.direction=="vertical"&&(this.dynamic_section==n?(e=i.root.offsetHeight-t,n.root.style.height="-moz-calc( 100% - "+(e=e<o?o:e)+"px "+r+" )",n.root.style.height="-webkit-calc( 100% - "+e+"px "+r+" )",n.root.style.height="calc( 100% - "+e+"px "+r+" )",i.root.style.height=e+"px"):(e=n.root.offsetHeight+t,i.root.style.height="-moz-calc( 100% - "+(e=e<o?o:e)+"px "+r+" )",i.root.style.height="-webkit-calc( 100% - "+e+"px "+r+" )",i.root.style.height="calc( 100% - "+e+"px "+r+" )",n.root.style.height=e+"px")),m.trigger(this.root,"split_moved"),this.root.querySelectorAll(".litearea")),s=0;s<a.length;++s)m.trigger(a[s],"split_moved")},B.prototype.addEventListener=function(t,e,n,i){return this.root.addEventListener(t,e,n,i)},B.prototype.setAreaSize=function(t,e){var n=this.sections[1],i=" - "+B.splitbar_size+"px";n.root.style.width="-moz-calc( 100% - "+e+i+" )",n.root.style.width="-webkit-calc( 100% - "+e+i+" )",n.root.style.width="calc( 100% - "+e+i+" )"},B.prototype.merge=function(t){if(this.sections.length==0)throw"not splitted";t=this.sections[t||0],this.root.appendChild(t.content),this.content=t.content,this.root.removeChild(this.sections[0].root),this.root.removeChild(this.sections[1].root),this.sections=[],this._computed_size=null,this.onResize()},B.prototype.add=function(t){var e;typeof t=="string"&&((e=document.createElement("div")).innerHTML=t,t=e),this.content.appendChild(t.root||t)},B.prototype.query=function(t){return this.root.querySelector(t)},Yt.prototype.processKeyDown=function(t){if(!this._input_blocked){if(t.keyCode==13){var e=this.input.value.trim();this.addMessage(this._prompt+e,"me",!0),this.input.value="",this.history.push(e),10<this.history.length&&this.history.shift(),this.onProcessCommand&&this.onProcessCommand(e),this._history_offset=0}else if(t.keyCode==38||t.keyCode==40){if(this._history_offset+=t.keyCode==38?-1:1,0<this._history_offset?this._history_offset=0:this._history_offset<-this.history.length&&(this._history_offset=-this.history.length),e=this.history.length+this._history_offset,e<0)return;e>=this.history.length?this.input.value="":this.input.value=this.history[e]}else{if(t.keyCode!=9||!this.onAutocomplete)return;this.input.value=this.onAutocomplete(this.input.value)}t.preventDefault(),t.stopPropagation()}},Yt.prototype.addMessage=function(t,e,n){var i=this.log_element,r=null;if(t&&t.constructor===Array)for(var o=0;o<t.length;++o)a(t[o]);else t&&t.constructor===Object?a(JSON.stringify(t,null,"")):a(t);function a(s){r=document.createElement("pre"),n?r.innerText=s:r.innerHTML=s,r.className="msg",e&&(r.className+=" "+e),i.appendChild(r),1e3<i.children.length&&i.removeChild(i.children[0])}return this.log_element.scrollTop=1e6,r.update=function(s){this.innerHTML=s},r},Yt.prototype.log=function(){var t=Array.prototype.slice.call(arguments).join(",");return this.addMessage(t,"msglog")},Yt.prototype.warn=function(){var t=Array.prototype.slice.call(arguments).join(",");return this.addMessage(t,"msgwarn")},Yt.prototype.error=function(){var t=Array.prototype.slice.call(arguments).join(",");return this.addMessage(t,"msgerror")},Yt.prototype.clear=function(){this.log_element.innerHTML=""},N.MINIMIZED_WIDTH=200,N.title_height="20px",N.getDialog=function(t){return t=document.getElementById(t),t?t.dialog:null},N.prototype._ctor=function(t){t=t||{};var e=this,n=(this.left=0,this.right=0,this.width=t.width,this.height=t.height,this.minWidth=t.minWidth||150,this.minHeight=t.minHeight||100,this.content=t.content||"",document.createElement("div")),i=(t.id&&(n.id=t.id),n.className="litedialog "+(t.className||""),n.data=this,n.dialog=this,"");if(t.title&&(i+="<div class='panel-header'>"+t.title+"</div><div class='buttons'>",t.minimize&&(i+="<button class='litebutton mini-button minimize-button'>-</button><button class='litebutton mini-button maximize-button' style='display:none'></button>"),t.hide&&(i+="<button class='litebutton mini-button hide-button'></button>"),t.detachable&&(i+="<button class='litebutton mini-button detach-button'></button>"),(t.close||t.closable)&&(i+="<button class='litebutton mini-button close-button'>"+m.special_codes.close+"</button>"),i+="</div>"),i+="<div class='content'>"+this.content+"</div>",n.innerHTML=i+="<div class='panel-footer'></div>",this.root=n,this.content=n.querySelector(".content"),this.footer=n.querySelector(".panel-footer"),t.fullcontent&&(this.content.style.width="100%",this.content.style.height=t.title?"calc( 100% - "+N.title_height+" )":"100%"),t.buttons)for(var r in t.buttons)this.addButton(t.buttons[r].name,t.buttons[r]);t.scroll==1&&(this.content.style.overflow="auto"),i=n.querySelector(".close-button"),i&&i.addEventListener("click",this.close.bind(this)),i=n.querySelector(".maximize-button"),i&&i.addEventListener("click",this.maximize.bind(this)),i=n.querySelector(".minimize-button"),i&&i.addEventListener("click",this.minimize.bind(this)),i=n.querySelector(".hide-button"),i&&i.addEventListener("click",this.hide.bind(this)),i=n.querySelector(".detach-button"),i&&i.addEventListener("click",function(){e.detachWindow()}),this.enableProperties(t),this.root.addEventListener("DOMNodeInsertedIntoDocument",function(){e.on_attached_to_DOM&&e.on_attached_to_DOM(),e.on_resize&&e.on_resize()}),this.root.addEventListener("DOMNodeRemovedFromDocument",function(){e.on_detached_from_DOM&&e.on_detached_from_DOM()}),(t.attach||t.parent)&&(n=null,(n=(n=t.parent?typeof t.parent=="string"?document.querySelector(t.parent):t.parent:n)||m.root).appendChild(this.root),this.center())},N.prototype.add=function(t){this.content.appendChild(t.root||t)},N.prototype.enableProperties=function(t){t=t||{};var e=this,n=this.root;n.style.position="absolute",n.style.minWidth=this.minWidth+"px",n.style.minHeight=this.minHeight+"px",this.width&&(n.style.width=this.width+"px"),this.height&&(typeof this.height=="number"?n.style.height=this.height+"px":this.height.indexOf("%")!=-1&&(n.style.height=this.height),this.content.style.height="calc( "+this.height+"px - 24px )"),n.style.boxShadow="0 0 3px black",t.draggable&&(this.draggable=!0,m.draggable(n,n.querySelector(".panel-header"),function(){e.bringToFront()},null,function(){return!e.minimized})),t.resizable&&this.setResizable()},N.prototype.setResizable=function(){var t,e,n,i,r,o;function a(s){var l,p,u,d;return s.type=="mousedown"?(document.body.addEventListener("mousemove",a),document.body.addEventListener("mouseup",a),o=this==n,i[0]=s.pageX,i[1]=s.pageY):s.type=="mousemove"?(p=(l=(u=m.getRect(t)).width)-(i[0]-s.pageX),d=(u=u.height)-(i[1]-s.pageY),o&&(t.style.width=p+"px"),t.style.height=d+"px",i[0]=s.pageX,i[1]=s.pageY,r.content.style.height="calc( 100% - 24px )",!r.on_resize||l==p&&u==d||r.on_resize(s,p,d)):s.type=="mouseup"&&(document.body.removeEventListener("mousemove",a),document.body.removeEventListener("mouseup",a),o=!1),s.preventDefault(),s.stopPropagation(),!1}this.resizable||(t=this.root,this.resizable=!0,(e=this.footer).style.minHeight="4px",e.classList.add("resizable"),(n=document.createElement("div")).className="resizable-corner",this.root.appendChild(n),e.addEventListener("mousedown",a),n.addEventListener("mousedown",a,!0),r=this,o=!(i=[0,0]))},N.prototype.dockTo=function(t,e){var n;t&&(n=this.root,e=e||"full",t=t.content||t,n.style.top=0,n.style.left=0,n.style.boxShadow="0 0 0",e=="full"?(n.style.position="relative",n.style.width="100%",n.style.height="100%",this.content.style.width="100%",this.content.style.height="calc(100% - "+m.Panel.title_height+")",this.content.style.overflow="auto"):e=="left"||e=="right"?(n.style.position="absolute",n.style.top=0,n.style[e]=0,n.style.width=this.width+"px",n.style.height="100%",this.content.style.height="calc(100% - "+m.Panel.title_height+")",this.content.style.overflow="auto",e=="right"&&(n.style.left="auto",n.style.right=0)):e!="bottom"&&e!="top"||(n.style.width="100%",n.style.height=this.height+"px",e=="bottom"&&(n.style.bottom=0,n.style.top="auto")),this.draggable&&m.draggable(n),t.content?t.content.appendChild(n):typeof t=="string"&&!(t=document.querySelector(t))||t.appendChild(n))},N.prototype.addButton=function(t,e){(e=e||{}).constructor===Function&&(e={callback:e});var n=this,i=document.createElement("button");return i.className="litebutton",i.innerHTML=t,e.className&&(i.className+=" "+e.className),this.root.querySelector(".panel-footer").appendChild(i),i.addEventListener("click",function(r){e.callback&&e.callback(this),e.close&&n.close()}),i},N.prototype.close=function(){m.remove(this.root),m.trigger(this,"closed",this),this.on_close&&this.on_close(),this.onclose&&console.warn("Dialog: Do not use onclose, use on_close instead"),this.dialog_window&&(this.dialog_window.close(),this.dialog_window=null)},N.prototype.highlight=function(t){t=t||100,this.root.style.outline="1px solid white";var e=this.root.ownerDocument;(e.defaultView||e.parentWindow).focus(),setTimeout(function(){this.root.style.outline=null}.bind(this),t)},N.minimized=[],N.prototype.minimize=function(){var t;this.minimized||(this.minimized=!0,this.old_box=this.root.getBoundingClientRect(),this.root.querySelector(".content").style.display="none",(t=this.root.querySelector(".minimize-button"))&&(t.style.display="none"),(t=this.root.querySelector(".maximize-button"))&&(t.style.display=""),this.root.style.width=m.Dialog.MINIMIZED_WIDTH+"px",m.bind(this,"closed",function(){m.Dialog.minimized.splice(m.Dialog.minimized.indexOf(this),1),m.Dialog.arrangeMinimized()}),m.Dialog.minimized.push(this),m.Dialog.arrangeMinimized(),m.trigger(this,"minimizing"))},N.arrangeMinimized=function(){for(var t in m.Dialog.minimized){var e=m.Dialog.minimized[t],n=e.root.parentNode.getBoundingClientRect().height-20;e.root.style.left=m.Dialog.MINIMIZED_WIDTH*t,e.root.style.top=n+"px"}},N.prototype.maximize=function(){var t;this.minimized&&(this.minimized=!1,this.root.querySelector(".content").style.display="",m.draggable(this.root),this.root.style.left=this.old_box.left+"px",this.root.style.top=this.old_box.top+"px",this.root.style.width=this.old_box.width+"px",this.root.style.height=this.old_box.height+"px",(t=this.root.querySelector(".minimize-button"))&&(t.style.display=""),(t=this.root.querySelector(".maximize-button"))&&(t.style.display="none"),m.Dialog.minimized.splice(m.Dialog.minimized.indexOf(this),1),m.Dialog.arrangeMinimized(),m.trigger(this,"maximizing"))},N.prototype.makeModal=function(){m.showModalBackground(!0),m.modalbg_div.appendChild(this.root),this.show(),this.center(),m.bind(this,"closed",function(t){m.showModalBackground(!1)})},N.prototype.bringToFront=function(){var t=this.root.parentNode;t.removeChild(this.root),t.appendChild(this.root)},N.prototype.show=function(t,e){this.root.parentNode||(e?(((e=e.ownerDocument).querySelector(".litegui-wrap")||e.body).appendChild(this.root),(e.defaultView||e.parentWindow).focus()):m.add(this),this.center()),this.detach_window||(this.root.style.display="",m.trigger(this,"shown"))},N.prototype.hide=function(t){this.root.style.display="none",m.trigger(this,"hidden")},N.prototype.fadeIn=function(t){t=t||1e3,this.root.style.display="",this.root.style.opacity=0;var e=this;setTimeout(function(){e.root.style.transition="opacity "+t+"ms",e.root.style.opacity=1},100)},N.prototype.setPosition=function(t,e){this.root.parentNode||console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM"),this.root.position="absolute",this.root.style.left=t+"px",this.root.style.top=e+"px"},N.prototype.setSize=function(t,e){this.root.style.width=typeof t=="number"?t+"px":t,this.root.style.height=typeof e=="number"?e+"px":e},N.prototype.setTitle=function(t){this.header&&(this.header.innerHTML=t)},N.prototype.center=function(){var t,e,n,i;this.root.parentNode&&(this.root.position="absolute",t=this.root.offsetWidth,e=this.root.offsetHeight,n=this.root.parentNode.offsetWidth,i=this.root.parentNode.offsetHeight,this.root.style.left=Math.floor(.5*(n-t))+"px",this.root.style.top=Math.floor(.5*(i-e))+"px")},N.prototype.adjustSize=function(t,e){var n,i;t=t||0,this.content.style.height="auto",this.content.offsetHeight!=0||e?(e=0,(i=this.root.querySelector(".panel-footer"))&&(e+=i.offsetHeight),i=this.content.offsetWidth,e=this.content.offsetHeight+20+t+e,this.setSize(i,e)):(n=this,setTimeout(function(){n.adjustSize(t,!0)},1))},N.prototype.clear=function(){this.content.innerHTML=""},N.prototype.detachWindow=function(t,e){if(!this.dialog_window){for(var i=this.root.getClientRects()[0],n=i.width,i=i.height,r="Window",o=this.root.querySelector(".panel-header"),a=(o&&(r=o.textContent),window.open("","","width="+n+", height="+i+", location=no, status=no, menubar=no, titlebar=no, fullscreen=yes")),s=(a.document.write("<head><title>"+r+"</title>"),this.dialog_window=a,document.querySelectorAll("link[rel='stylesheet'],style")),l=0;l<s.length;l++)a.document.write(s[l].outerHTML);return a.document.write("</head><body></body>"),a.document.close(),a.onbeforeunload=function(){var p=m.windows.indexOf(a);p!=-1&&m.windows.splice(p,1),e&&e()},a.document.body.appendChild(this.content),this.root.style.display="none",this._old_height=this.content.style.height,this.content.style.height="100%",m.windows.push(a),t&&t(),a}},N.prototype.reattachWindow=function(t){var e;this.dialog_window&&(this.root.appendChild(this.content),this.root.style.display="",this.content.style.height=this._old_height,delete this._old_height,this.dialog_window.close(),(e=m.windows.indexOf(this.dialog_window))!=-1&&m.windows.splice(e,1),this.dialog_window=null)},N.showAll=function(){for(var t=document.body.querySelectorAll("litedialog"),e=0;e<t.length;e++)t[e].dialog.show()},N.hideAll=function(){for(var t=document.body.querySelectorAll("litedialog"),e=0;e<t.length;e++)t[e].dialog.hide()},N.closeAll=function(){for(var t=document.body.querySelectorAll("litedialog"),e=0;e<t.length;e++)t[e].dialog.close()},Be.prototype.setRange=function(t,e){this.options.min=t,this.options.max=e},Be.prototype.setValue=function(t,e){t=parseFloat(t),this.value=t,this.options.precision&&(t=t.toFixed(this.options.precision)),this.options.units&&(t+=this.options.units),this.input.value=t,e||m.trigger(this.input,"change")},Be.prototype.getValue=function(){return this.value},_.prototype.getValues=function(){var t,e={};for(t in this.widgets_by_name)e[t]=this.widgets_by_name[t].getValue();return e},_.prototype.setValues=function(t){for(var e in t)this.widgets_by_name[e]&&this.widgets_by_name[e].setValue(t[e])},_.prototype.appendTo=function(t,e){(t=t&&(t.constructor===String?document.querySelector(t):t))&&(e?t.insertBefore(this.root,t.firstChild):t.appendChild(this.root))},_.prototype.clear=function(){for(purgeElement(this.root,!0);this.root.hasChildNodes();)this.root.removeChild(this.root.lastChild);this.root.className=this.className,this.row_number=0,this.values={},this.widgets=[],this.widgets_by_name={},this.sections=[],this.current_section=null,this._current_container=null,this._current_container_stack=null,this.addContainer()},_.prototype.refresh=function(){this.on_refresh&&this.on_refresh()},_.prototype.append=function(t,e){var n=(e=e||{}).widget_parent||this._current_container||this.root;e.replace?e.replace.parentNode.replaceChild(t,e.replace):(t.section=this.current_section,n.appendChild(t))},_.prototype.pushContainer=function(t){if(this._current_container_stack){if(this._current_container_stack.indexOf(t)!=-1)return void console.warn("Container already in the stack");this._current_container_stack.push(t)}else this._current_container_stack=[t];this._current_container=t},_.prototype.isContainerInStack=function(t){return!!this._current_container_stack&&this._current_container_stack.indexOf(t)!=-1},_.prototype.popContainer=function(t){if(this.row_number=0,this._current_container_stack&&this._current_container_stack.length){if(t)for(var e=this._current_container_stack.pop();e&&e!=t;)e=this._current_container_stack.pop();else this._current_container_stack.pop();this._current_container=this._current_container_stack[this._current_container_stack.length-1]}else this._current_container=null},_.prototype.setup=function(t){for(var e in t)e=t[e],this.add(e.type,e.name,e.value,e.options)},_.prototype.getWidget=function(t){return(t!==null&&t.constructor===Number?this.widgets:this.widgets_by_name)[t]},_.prototype.inspectInstance=function(t,e,n,i){if(t){e=e||(t.getProperties?t.getProperties():this.collectProperties(t));var r=t.constructor,o=(!n&&r.properties&&(n=r.properties),{});if(t.getInspectorProperties)o=t.getInspectorProperties();else for(var a in e)if(n&&n[a])o[a]=f(n[a]);else{var s=e[a];if(r["@"+a]){var l=r["@"+a];l&&l.widget===null||(o[a]=f(l))}else if(t["@"+a])o[a]=t["@"+a];else if(s!=null)switch(s.constructor){case Number:o[a]={type:"number",step:.1};break;case String:o[a]={type:"string"};break;case Boolean:o[a]={type:"boolean"};break;default:if(s&&(s.constructor===Array||s.constructor.BYTES_PER_ELEMENT)){var p=s[0]!=null&&s[0].constructor===Number;switch(s.length){case 2:o[a]={type:p?"vec2":"Array",step:.1};break;case 3:o[a]={type:p?"vec3":"Array",step:.1};break;case 4:o[a]={type:p?"vec4":"Array",step:.1};break;default:o[a]={type:"Array"}}}}}if(i)for(var a in i)delete o[i[a]];if(r.properties_order){var u={};for(a in r.properties_order){var d=r.properties_order[a];o[d]?u[d]=o[d]:console.warn("property not found in instance:",d)}for(a in o)u[a]||(u[a]=o[a]);o=u}return this.showProperties(t,o)}function f(h,g){for(var b in g=g||{},h)g[b]=h[b];return g}},_.prototype.collectProperties=function(t){var e,n,i={};for(e in t)e[0]!="_"&&e[0]!="@"&&e.substr(0,6)!="jQuery"&&((n=t[e])&&n.constructor==Function&&!t.constructor["@"+e]||(i[e]=n));return i},_.prototype.showProperties=function(t,e){for(var n in e){var i,r,o=n,a=e[n];a&&((a=a.constructor===String?{type:a}:a).name&&(o=a.name),a.callback||(i={instance:t,name:o,options:a},a.type!="function"&&(a.callback=_.assignValue.bind(i))),a.callback_update||(a.callback_update=function(){return this.instance[this.name]}.bind(i={instance:t,name:o})),a.instance=t,a.varname=o,r=a.widget||a.type||"string",this.on_addProperty&&this.on_addProperty(r,t,o,t[o],a),this.add(r,o,t[o],a))}if(t.constructor.widgets)for(var n in t.constructor.widgets){var s=t.constructor.widgets[n];this.add(s.widget,s.name,s.value,s)}t.onShowProperties&&t.onShowProperties(this),t.constructor.onShowProperties&&t.constructor.onShowProperties(t,this)},_.assignValue=function(t){var e=this.instance,n=e[this.name];if(n==null||t==null||this.options.type=="enum")e[this.name]=t;else if(typeof n=="number")e[this.name]=parseFloat(t);else if(typeof n=="string")e[this.name]=t;else if(!(t&&t.length&&n&&n.length)||Object.getOwnPropertyDescriptor(e,this.name)&&Object.getOwnPropertyDescriptor(e,this.name).set||Object.getOwnPropertyDescriptor(e.__proto__,this.name)&&Object.getOwnPropertyDescriptor(e.__proto__,this.name).set)e[this.name]=t;else for(var i=0;i<t.length;++i)n[i]=t[i]},_.prototype.createWidget=function(t,e,n){n=n||{},e=e==null?"":e;var i=document.createElement("DIV"),r=(i.className="widget "+(n.className||""),i.inspector=this,i.options=n,i.name=t,this.row_number+=this.widgets_per_row,this.row_number%2==0&&(i.className+=" even"),n.width||this.widgets_width),r=(r&&(i.style.width=m.sizeToCSS(r),i.style.width||(i.style.width="calc("+m.sizeToCSS(r)+")"),i.style.minWidth="auto"),n.height||this.height),r=(r&&(i.style.height=m.sizeToCSS(r),i.style.height||(i.style.height="calc("+m.sizeToCSS(r)+")"),i.style.minHeight="auto"),this.widgets.push(i),(n.widget_name||t)&&(this.widgets_by_name[n.widget_name||t]=i),this.widgets_per_row!=1&&(n.width||(i.style.width=(100/this.widgets_per_row).toFixed(2)+"%"),i.style.display="inline-block"),""),o="",a=(t==null||!this.name_width&&!n.name_width||this.one_line||(r="style='width: calc("+(a=m.sizeToCSS(n.name_width||this.name_width))+" - 0px); width: -webkit-calc("+a+" - 0px); width: -moz-calc("+a+" - 0px); '",o="style='width: calc( 100% - "+a+"); width: -webkit-calc(100% - "+a+"); width: -moz-calc( 100% - "+a+"); '"),n.name_width&&(r="style='width: "+m.sizeToCSS(n.name_width)+" '"),n.content_width&&(o="style='width: "+m.sizeToCSS(n.content_width)+" '"),""),s="",l=this.one_line?"":"<span class='filling'></span>",p=(n.pretitle&&(s=n.pretitle),"wcontent "),u=t;return n.title&&(u=n.title),t==null?p+=" full":a+=t===""?"<span class='wname "+t+"' title='"+u+"' "+r+">"+s+"</span>":"<span class='wname "+t+"' title='"+u+"' "+r+">"+s+t+l+"</span>",e.constructor===String||e.constructor===Number||e.constructor===Boolean?i.innerHTML=a+"<span class='info_content "+p+"' "+o+">"+e+"</span>":(i.innerHTML=a+"<span class='info_content "+p+"' "+o+"></span>",(n=i.querySelector("span.info_content"))&&n.appendChild(e)),i.content=i.querySelector("span.info_content"),i.remove=function(){this.parentNode&&this.parentNode.removeChild(this)},i},_.onWidgetChange=function(t,e,n,i,r,o){var a=t.section,s=(i.skip_wchange||(a&&m.trigger(a,"wbeforechange",n),m.trigger(t,"wbeforechange",n)),this.values[e]=n,void 0);return i.callback&&(s=r?i.callback.apply(t,n):i.callback.call(t,n,o)),i.skip_wchange||(a&&m.trigger(a,"wchange",n,t),m.trigger(t,"wchange",n,t)),this.onchange&&this.onchange(e,n,t),s},_.widget_constructors={null:"addNull",title:"addTitle",info:"addInfo",default:"addDefault",number:"addNumber",slider:"addSlider",string:"addString",text:"addString",textarea:"addTextarea",color:"addColor",boolean:"addCheckbox",checkbox:"addCheckbox",icon:"addIcon",vec2:"addVector2",vector2:"addVector2",vec3:"addVector3",vector3:"addVector3",vec4:"addVector4",vector4:"addVector4",enum:"addCombo",dropdown:"addCombo",combo:"addCombo",button:"addButton",buttons:"addButtons",file:"addFile",line:"addLine",list:"addList",tree:"addTree",datatree:"addDataTree",pad:"addPad",array:"addArray",separator:"addSeparator"},_.registerWidget=function(t,e){var n="add"+t.charAt(0).toUpperCase()+t.slice(1);_.prototype[n]=e,_.widget_constructors[t]=n},_.prototype.add=function(t,e,n,i){if(!t)throw"Inspector: no type specified";arguments.length==1&&typeof t=="object"&&(t=(i=t).type,e=i.name,n=i.value);var r=m.Inspector.widget_constructors[t.toLowerCase()];if(r){if((r=r.constructor===String?m.Inspector.prototype[r]:r)&&r.constructor===Function)return i&&i.constructor===Function&&(i={callback:i}),r.call(this,e,n,i)}else console.warn("LiteGUI.Inspector do not have a widget called",t)},_.prototype.getValue=function(t){return this.values[t]},_.prototype.applyOptions=function(t,e){t&&e&&(e.className&&(t.className+=" "+e.className),e.id&&(t.id=e.id),e.width&&(t.style.width=m.sizeToCSS(e.width)),e.height&&(t.style.height=m.sizeToCSS(e.height)))},_.prototype.addSeparator=function(){var t=document.createElement("DIV");return t.className="separator",this.append(t),t},_.prototype.addNull=function(t,e,n){return null},_.prototype.addDefault=function(t,e,n){return e==null?null:e.constructor===Boolean?this.addCheckbox(t,e,n):e.constructor===String?this.addString(t,e,n):e.constructor===Number?this.addNumber(t,e,n):e.length==4?this.addVector4(t,e,n):e.length==3?this.addVector3(t,e,n):e.length==2?this.addVector2(t,e,n):null},_.prototype.addString=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e||"","text"),o=(n.password&&(r="password"),n.focus?"autofocus":""),a=this.createWidget(t,"<span class='inputfield full "+(n.disabled?"disabled":"")+"'><input type='"+r+"' tabIndex='"+this.tab_index+"' "+o+" class='text string' value='"+e+"' "+(n.disabled?"disabled":"")+"/></span>",n),s=a.querySelector(".wcontent input");return n.placeHolder&&s.setAttribute("placeHolder",n.placeHolder),n.align=="right"&&(s.style.direction="rtl"),s.addEventListener(n.immediate?"keyup":"change",function(l){l=_.onWidgetChange.call(i,a,t,l.target.value,n),l!==void 0&&(this.value=l)}),n.callback_enter&&s.addEventListener("keydown",function(l){l.keyCode==13&&(_.onWidgetChange.call(i,a,t,l.target.value,n),n.callback_enter(),l.preventDefault())}),this.tab_index+=1,a.setIcon=function(l){l?(s.style.background="transparent url('"+l+"') no-repeat left 4px center",s.style.paddingLeft="1.7em"):(s.style.background="",s.style.paddingLeft="")},n.icon&&a.setIcon(n.icon),a.setValue=function(l,p){l!==void 0&&l!==s.value&&(s.value=l,p||m.trigger(s,"change"))},a.getValue=function(){return s.value},a.focus=function(){this.querySelector("input").focus()},a.disable=function(){s.disabled=!0},a.enable=function(){s.disabled=!1},this.append(a,n),this.processElement(a,n),a},_.prototype.addStringButton=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e===void 0?"":e,this.createWidget(t,"<span class='inputfield button'><input type='text' tabIndex='"+this.tab_index+"' class='text string' value='' "+(n.disabled?"disabled":"")+"/></span><button class='micro'>"+(n.button||"...")+"</button>",n)),o=r.querySelector(".wcontent input"),a=(o.value=e,o.addEventListener("change",function(s){s=_.onWidgetChange.call(i,r,t,s.target.value,n),s!==void 0&&(this.value=s)}),n.disabled&&o.setAttribute("disabled","disabled"),r.setIcon=function(s){s?(o.style.background="transparent url('"+s+"') no-repeat left 4px center",o.style.paddingLeft="1.7em"):(o.style.background="",o.style.paddingLeft="")},n.icon&&r.setIcon(n.icon),r.querySelector(".wcontent button"));return a.addEventListener("click",function(s){n.callback&&n.callback.call(r,o.value,s)}),n.button_width&&(a.style.width=m.sizeToCSS(n.button_width),r.querySelector(".inputfield").style.width="calc( 100% - "+a.style.width+" - 6px)"),this.tab_index+=1,this.append(r,n),r.setValue=function(s,l){o.value=s,l||m.trigger(o,"change")},r.disable=function(){o.disabled=!0,a.disabled=!0},r.enable=function(){o.disabled=!1,a.disabled=!1},r.getValue=function(){return o.value},r.focus=function(){m.focus(o)},this.processElement(r,n),r},_.prototype.addTextarea=function(t,e,n){n=this.processOptions(n),e=e||"";var i=this,r=(this.values[t]=e,this.createWidget(t,"<span class='inputfield textarea "+(n.disabled?"disabled":"")+"'><textarea tabIndex='"+this.tab_index+"' "+(n.disabled?"disabled":"")+"></textarea></span>",n)),o=(this.tab_index++,r.querySelector(".wcontent textarea"));return o.value=e,o.addEventListener(n.immediate?"keyup":"change",function(a){_.onWidgetChange.call(i,r,t,a.target.value,n,!1,a)}),n.callback_keydown&&o.addEventListener("keydown",n.callback_keydown),n.height&&(o.style.height="calc( "+m.sizeToCSS(n.height)+" - 5px )"),this.append(r,n),r.setValue=function(a,s){a!==void 0&&a!=o.value&&(e=a,o.value=a,s||m.trigger(o,"change"))},r.getValue=function(a){return o.value},r.focus=function(){m.focus(o)},r.disable=function(){o.disabled=!0},r.enable=function(){o.disabled=!1},this.processElement(r,n),r},_.prototype.addNumber=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e||0,this.createWidget(t,"",n)),o=(this.append(r,n),n.extraclass="full",n.tab_index=this.tab_index,n.full=!0,n.precision=n.precision!==void 0?n.precision:2,n.step=n.step===void 0?n.precision==0?1:.1:n.step,this.tab_index++,null);(o=new m.Dragger(e,n)).root.style.width="calc( 100% - 1px )",r.querySelector(".wcontent").appendChild(o.root),o.root.addEventListener("start_dragging",function(s){this.callback_before&&this.callback_before.call(r)}.bind(n)),r.dragger=o,n.disabled&&o.input.setAttribute("disabled","disabled");var a=r.querySelector("input");return a.addEventListener("change",function(s){var l;m.trigger(r,"wbeforechange",s.target.value),i.values[t]=s.target.value,n.callback&&typeof(l=n.callback.call(r,parseFloat(s.target.value)))=="number"&&(this.value=l),m.trigger(r,"wchange",s.target.value),i.onchange&&i.onchange(t,s.target.value,r)}),r.setValue=function(s,l){s!==void 0&&(s=parseFloat(s),n.precision&&(s=s.toFixed(n.precision)),s+=n.units||"",a.value!=s&&(a.value=s,l||m.trigger(a,"change")))},r.setRange=function(s,l){o.setRange(s,l)},r.getValue=function(){return parseFloat(a.value)},r.focus=function(){m.focus(a)},r.disable=function(){a.disabled=!0},r.enable=function(){a.disabled=!1},this.processElement(r,n),r},_.prototype.addVector2=function(t,e,n){(n=this.processOptions(n)).step||(n.step=.1);var i=this,r=(this.values[t]=e=e||[0,0],this.createWidget(t,"",n)),o=(n.step=n.step||.1,n.tab_index=this.tab_index,n.full=!0,this.tab_index++,r.querySelector(".wcontent")),a=new m.Dragger(e[0],n),s=(a.root.style.marginLeft=0,a.root.style.width="calc( 50% - 1px )",o.appendChild(a.root),n.tab_index=this.tab_index,this.tab_index++,new m.Dragger(e[1],n));function l(d){this.callback_before&&this.callback_before(d)}s.root.style.width="calc( 50% - 1px )",o.appendChild(s.root),r.draggers=[a,s],m.bind(a.root,"start_dragging",l.bind(n)),m.bind(s.root,"start_dragging",l.bind(n));for(var p=r.querySelectorAll("input"),u=0;u<p.length;++u)p[u].addEventListener("change",function(d){for(var f=[],h=p,g=0;g<h.length;g++)f.push(parseFloat(h[g].value));if(m.trigger(r,"wbeforechange",[f]),i.values[t]=f,n.callback){var b=n.callback.call(r,f);if(typeof b=="object"&&2<=b.length){for(g=0;g<h.length;g++)h[g].value=b[g];f=b}}m.trigger(r,"wchange",[f]),i.onchange&&i.onchange(t,f,r)});return this.append(r,n),r.setValue=function(d,f){d&&(a.getValue()!=d[0]&&a.setValue(d[0],!0),s.getValue()!=d[1]&&s.setValue(d[1],f))},r.setRange=function(d,f){a.setRange(d,f),s.setRange(d,f)},this.processElement(r,n),r},_.prototype.addVector3=function(t,e,n){(n=this.processOptions(n)).step||(n.step=.1);var i=this,r=(this.values[t]=e=e||[0,0,0],this.createWidget(t,"",n)),o=(n.step=n.step||.1,n.tab_index=this.tab_index,n.full=!0,this.tab_index++,new m.Dragger(e[0],n)),a=(o.root.style.marginLeft=0,o.root.style.width="calc( 33% - 1px )",r.querySelector(".wcontent").appendChild(o.root),n.tab_index=this.tab_index,this.tab_index++,new m.Dragger(e[1],n)),s=(a.root.style.width="calc( 33% - 1px )",r.querySelector(".wcontent").appendChild(a.root),n.tab_index=this.tab_index,this.tab_index++,new m.Dragger(e[2],n));function l(d){this.callback_before&&this.callback_before()}s.root.style.width="calc( 33% - 1px )",r.querySelector(".wcontent").appendChild(s.root),r.draggers=[o,a,s],o.root.addEventListener("start_dragging",l.bind(n)),a.root.addEventListener("start_dragging",l.bind(n)),s.root.addEventListener("start_dragging",l.bind(n));for(var p=r.querySelectorAll("input"),u=0;u<p.length;++u)p[u].addEventListener("change",function(d){for(var f=[],h=p,g=0;g<h.length;g++)f.push(parseFloat(h[g].value));if(m.trigger(r,"wbeforechange",[f]),i.values[t]=f,n.callback){var b=n.callback.call(r,f);if(typeof b=="object"&&3<=b.length){for(g=0;g<h.length;g++)h[g].value=b[g];f=b}}m.trigger(r,"wchange",[f]),i.onchange&&i.onchange(t,f,r)});return this.append(r,n),r.setValue=function(d,f){d&&(o.setValue(d[0],!0),a.setValue(d[1],!0),s.setValue(d[2],f))},r.setRange=function(d,f){o.setRange(d,f),a.setRange(d,f),s.setRange(d,f)},this.processElement(r,n),r},_.prototype.addVector4=function(t,e,n){(n=this.processOptions(n)).step||(n.step=.1);for(var i=this,r=(this.values[t]=e=e||[0,0,0],this.createWidget(t,"",n)),o=(n.step=n.step||.1,n.tab_index=this.tab_index,n.full=!0,this.tab_index++,r.draggers=[]),a=0;a<4;a++){var s=new m.Dragger(e[a],n);s.root.style.marginLeft=0,s.root.style.width="calc( 25% - 1px )",r.querySelector(".wcontent").appendChild(s.root),n.tab_index=this.tab_index,this.tab_index++,s.root.addEventListener("start_dragging",l.bind(n)),o.push(s)}function l(u){this.callback_before&&this.callback_before()}for(var p=r.querySelectorAll("input"),a=0;a<p.length;++a)p[a].addEventListener("change",function(d){for(var f=[],h=p,g=0;g<h.length;g++)f.push(parseFloat(h[g].value));if(m.trigger(r,"wbeforechange",[f]),i.values[t]=f,n.callback){var b=n.callback.call(r,f);if(typeof b=="object"&&4<=b.length){for(g=0;g<h.length;g++)h[g].value=b[g];f=b}}m.trigger(r,"wchange",[f]),i.onchange&&i.onchange(t,f,r)});return this.append(r,n),r.setValue=function(u,d){if(u)for(var f=0;f<o.length;f++)o[f].setValue(u[f],d)},r.setRange=function(u,d){for(var f in o)o[f].setRange(u,d)},this.processElement(r,n),r},_.prototype.addPad=function(t,e,n){(n=this.processOptions(n)).step||(n.step=.1);var i=this,r=(this.values[t]=e=e||[0,0],this.createWidget(t,"",n)),o=(n.step=n.step||.1,n.tab_index=this.tab_index,n.full=!0,this.tab_index++,n.minx||n.min||0),a=n.miny||n.min||0,s=n.maxx||n.max||1,l=n.maxy||n.max||1,p=r.querySelector(".wcontent"),u=document.createElement("div"),d=(u.className="litepad",p.appendChild(u),u.style.width="100%",u.style.height="100px",n.background&&(u.style.backgroundImage="url('"+n.background+"')",u.style.backgroundSize="100%",u.style.backgroundRepeat="no-repeat"),document.createElement("div"));return d.className="litepad-handler",u.appendChild(d),n.tab_index=this.tab_index,this.tab_index++,u._onMouseEvent=function(f){var h=u.getBoundingClientRect();if(f.mousex=f.pageX-h.left,f.mousey=f.pageY-h.top,f.preventDefault(),f.stopPropagation(),f.type=="mousedown")document.body.addEventListener("mousemove",u._onMouseEvent),document.body.addEventListener("mouseup",u._onMouseEvent);else if(f.type=="mousemove"){var g=f.mousex/h.width,h=f.mousey/h.height,g=[g*(s-o)+o,h*(l-a)+o];if(m.trigger(r,"wbeforechange",[g]),r.setValue(g),n.callback){var b=n.callback.call(r,g);if(b&&2<=b.length)for(var y=0;y<elems.length;y++)r.setValue(b)}m.trigger(r,"wchange",[g]),i.onchange&&i.onchange(t,g,r)}else f.type=="mouseup"&&(document.body.removeEventListener("mousemove",u._onMouseEvent),document.body.removeEventListener("mouseup",u._onMouseEvent));return!0},u.addEventListener("mousedown",u._onMouseEvent),r.setValue=function(f,h){var g,b,y;f!==void 0&&(y=u.getBoundingClientRect(),g=(f[0]-o)/(s-o),f=(f[1]-a)/(l-a),g=Math.max(0,Math.min(g,1)),f=Math.max(0,Math.min(f,1)),b=(y.width-10)/y.width*100,y=(y.height-10)/y.height*100,d.style.left=(g*b).toFixed(1)+"%",d.style.top=(f*y).toFixed(1)+"%")},this.append(r,n),r.setValue(e),this.processElement(r,n),r},_.prototype.addInfo=function(t,e,n){n=this.processOptions(n),e=e==null?"":e;var i=null,r=(t!=null?i=this.createWidget(t,e,n):(i=document.createElement("div"),n.className&&(i.className=n.className),e.nodeName!==void 0?(i.innerHTML="<span class='winfo'></span>",i.childNodes[0].appendChild(e)):i.innerHTML="<span class='winfo'>"+e+"</span>"),i.querySelector(".winfo")||i.querySelector(".wcontent"));n.callback&&i.addEventListener("click",n.callback.bind(i)),i.setValue=function(a){a!==void 0&&r&&(r.innerHTML=a)};var o=(o=i.querySelector("span.info_content"))||i.querySelector(".winfo");return n.width&&(i.style.width=m.sizeToCSS(n.width),i.style.display="inline-block",t||(r.style.margin="2px")),n.height&&(o.style.height=m.sizeToCSS(n.height),o.style.overflow="auto"),i.scrollToBottom=function(){o.scrollTop=o.offsetTop},i.add=function(a){o.appendChild(a)},this.append(i,n),this.processElement(i,n),i},_.prototype.addSlider=function(t,e,n){(n=this.processOptions(n)).min===void 0&&(n.min=0),n.max===void 0&&(n.max=1),n.step===void 0&&(n.step=.01);const i=n.step;var r=this,o=(e==null&&(e=0),this.values[t]=e,this.createWidget(t,"<span class='inputfield full'>				<input tabIndex='"+this.tab_index+"' type='text' class='slider-text fixed liteslider-value' value='' /><span class='slider-container'></span></span>",n)),a=o.querySelector(".slider-container"),s=new m.Slider(e,n),l=(a.appendChild(s.root),o.querySelector(".slider-text"));return l.value=e,l.addEventListener("change",function(p){var u=parseFloat(this.value);e=Math.floor(u/i)*i,s.setValue(e),_.onWidgetChange.call(r,o,t,u,n)}),s.onChange=function(p){var u=Math.floor(parseFloat(p)/i)*i;s.setValue(u),l.value=u,_.onWidgetChange.call(r,o,t,p,n)},this.append(o,n),o.setValue=function(p,u){p!==void 0&&(e=p,s.setValue(p,u))},o.getValue=function(){return e},this.processElement(o,n),o},_.prototype.addCheckbox=function(t,e,n){n=this.processOptions(n),e=!!e;var i=this,r=(this.values[t]=e,n.label_on||n.label||"on"),o=n.label_off||n.label||"off",a=e?r:o,s=this.createWidget(t,"<span class='inputfield'><span tabIndex='"+this.tab_index+"' class='fixed flag checkbox "+(e?"on":"off")+"'>"+a+"</span></span>",n),l=(this.tab_index++,s.querySelector(".wcontent .checkbox"));return l.addEventListener("keypress",function(p){p.keyCode==32&&m.trigger(this,"click")}),s.addEventListener("click",function(){e=!e,s.querySelector("span.flag").innerHTML=e?r:o,e?l.classList.add("on"):l.classList.remove("on"),_.onWidgetChange.call(i,s,t,e,n)}),s.getValue=function(){return e},s.setValue=function(p,u){p!==void 0&&(e=p,i.values[t]==p||u||m.trigger(l,"click"))},this.append(s,n),this.processElement(s,n),s},_.prototype.addFlags=function(t,e,n){var i={};for(r in t)i[r]=t[r];if(e)for(var r in e)i[r]===void 0&&(i[r]=!!e[r]);for(r in i){var o,a={};for(o in n)a[o]=n[o];a.callback=function(s){return function(l){t[s]=l}}(r),this.addCheckbox(r,i[r],a)}},_.prototype.addCombo=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e,this.tab_index++,this.createWidget(t,"<span class='inputfield full inputcombo "+(n.disabled?"disabled":"")+"'></span>",n)),o=(r.options=n).values||[],a=(o.constructor===Function&&(o=n.values()),"<select tabIndex='"+this.tab_index+"' "+(n.disabled?"disabled":"")+" class='"+(n.disabled?"disabled":"")+"'></select>"),s=(r.querySelector("span.inputcombo").innerHTML=a,l(o),!1);function l(p,u){u&&(e=u);var d,f="",h=0;for(d in o=p=p||[]){var g=o[d],b=o.constructor===Array?h:d,y=o.constructor===Array?g:d;g&&g.title&&(y=g.title),f+="<option value='"+b+"' "+(g==e?" selected":"")+" data-index='"+b+"'>"+y+"</option>",h++}r.querySelector("select").innerHTML=f}return r.querySelector(".wcontent select").addEventListener("change",function(p){p=p.target.value,e=o[p],s||_.onWidgetChange.call(i,r,t,e,n)}),r.getValue=function(){return e},r.setValue=function(p,u){if(p!==void 0){e=p;var d=r.querySelector("select"),f=d.querySelectorAll("option"),h=-1;if(o.constructor===Array)h=o.indexOf(p);else{var g=0;for(b in o){if(o[g]==p){h=g;break}g++}}if(h!=-1){for(var b in s=u,f){var y=f[b];y&&y.dataset&&(parseFloat(y.dataset.index)==h?(y.setAttribute("selected",!0),d.selectedIndex=h):y.removeAttribute("selected"))}s=!1}}},r.setOptionValues=l,this.append(r,n),this.processElement(r,n),r},_.prototype.addComboButtons=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e||"","");if(n.values)for(var o in n.values)r+="<button class='wcombobutton "+(e==n.values[o]?"selected":"")+"' data-name='options.values[i]'>"+n.values[o]+"</button>";var a=this.createWidget(t,r,n),s=a.querySelectorAll(".wcontent button");return m.bind(s,"click",function(l){for(var l=l.target.innerHTML,p=(i.values[t]=l,a.querySelectorAll(".selected")),u=0;u<p.length;++u)p[u].classList.remove("selected");this.classList.add("selected"),_.onWidgetChange.call(i,a,t,l,n)}),this.append(a,n),this.processElement(a,n),a},_.prototype.addTags=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e||[],"<select>");if(n.values)for(var o in n.values)r+="<option>"+n.values[o]+"</option>";var a=this.createWidget(t,"<span class='inputfield full'>"+(r+="</select><div class='wtagscontainer inputfield'></div>")+"</span>",n);for(o in a.tags={},n.value)s(n.value[o]);function s(l){var p;a.tags[l]||(m.trigger(a,"wbeforechange",a.tags),a.tags[l]=!0,(p=document.createElement("div")).data=l,p.className="wtag",p.innerHTML=l+"<span class='close'>X</span>",p.querySelector(".close").addEventListener("click",function(u){var d=this.parentNode.data;delete a.tags[d],m.remove(this.parentNode),m.trigger(a,"wremoved",d),_.onWidgetChange.call(i,a,t,a.tags,n)}),a.querySelector(".wtagscontainer").appendChild(p),i.values[t]=a.tags,n.callback&&n.callback.call(a,a.tags),m.trigger(a,"wchange",a.tags),m.trigger(a,"wadded",l),i.onchange&&i.onchange(t,a.tags,a))}return a.querySelector(".wcontent select").addEventListener("change",function(l){s(l.target.value)}),this.append(a,n),this.processElement(a,n),a},_.prototype.addList=function(t,e,n){n=this.processOptions(n);for(var i=this,o="",o="<ul class='lite-list' "+(o=n.height?"style='height: 100%; overflow: auto;'":o)+" tabIndex='"+this.tab_index+"'><ul>",r=(this.tab_index++,this.createWidget(t,"<span class='inputfield full "+(n.disabled?"disabled":"")+"' style='height: 100%;'>"+o+"</span>",n)),o=(r.querySelector(".info_content").style.height="100%",r.querySelector(".lite-list"),r.querySelector(".inputfield")),a=(o.style.height="100%",o.style.paddingBottom="0.2em",r.querySelectorAll("ul")),s=0;s<a.length;++s){var l=a[s];l.addEventListener("focus",function(){document.addEventListener("keydown",p,!0)}),l.addEventListener("blur",function(){document.removeEventListener("keydown",p,!0)})}function p(h){var g=r.querySelector("li.selected");if(g){if(h.keyCode==13){if(!g)return;var b=e[g.dataset.pos];n.callback_dblclick&&n.callback_dblclick.call(i,b)}else if(h.keyCode==40)b=g.nextSibling,b&&m.trigger(b,"click"),g.scrollIntoViewIfNeeded&&g.scrollIntoViewIfNeeded({block:"end",behavior:"smooth"});else{if(h.keyCode!=38)return;b=g.previousSibling,b&&m.trigger(b,"click"),g.scrollIntoViewIfNeeded&&g.scrollIntoViewIfNeeded({block:"end",behavior:"smooth"})}return h.preventDefault(),h.stopPropagation(),!0}}function u(h){if(n.multiselection)this.classList.toggle("selected");else{for(var g=r.querySelectorAll("li"),b=0;b<g.length;++b)g[b].classList.remove("selected");this.classList.add("selected")}var y=e[this.dataset.pos];_.onWidgetChange.call(i,r,t,y,n),m.trigger(r,"wadded",y)}function d(h){var g=e[this.dataset.pos];n.callback_dblclick&&n.callback_dblclick.call(i,g)}function f(h,g,D){var y=D,w=D,I=(g=!!g,null),R="";h!=null&&(h.constructor===String||h.constructor===Number||h.constructor===Boolean?w=String(h):h&&(w=h.content||h.title||h.name||D,I=h.style,h.icon&&(R="<img src='"+h.icon+"' class='icon' /> "),h.selected&&(g=!0)));var D=(D=w).replace(/<(?:.|\n)*?>/gm,""),F=document.createElement("li");return F.classList.add("item-"+m.safeName(y)),g&&F.classList.add("selected"),F.dataset.name=D,F.dataset.pos=y,F.value=h,I&&F.setAttribute("style",I),F.innerHTML=R+w,F.addEventListener("click",u),n.callback_dblclick&&F.addEventListener("dblclick",d),F}return r.updateItems=function(h,g){g=g||n.selected,e=h;var b=this.querySelector("ul");if(b.innerHTML="",e)for(var y in e)y=f(e[y],g,y),b.appendChild(y);m.bind(b.querySelectorAll("li"),"click",u)},r.addItem=function(h,g,b){var y;e.constructor!==Array?console.error("cannot add item to list of object, only array"):(e.push(h),y=this.querySelector("ul"),h=f(h,g),y.appendChild(h))},r.removeItem=function(h){for(var g=r.querySelectorAll(".wcontent li"),b=0;b<g.length;b++)g[b].dataset.name==h&&m.remove(g[b])},r.updateItems(e,n.selected),this.append(r,n),r.getSelected=function(){for(var h=[],g=this.querySelectorAll("ul li.selected"),b=0;b<g.length;++b)h.push(g[b].dataset.name);return h},r.getByIndex=function(h){return this.querySelectorAll("ul li")[h]},r.getIndex=r.getByIndex,r.selectIndex=function(h,g){for(var b=this.querySelectorAll("ul li"),y=0;y<b.length;++y){var w=b[y];y==h?w.classList.add("selected"):g||w.classList.remove("selected")}return b[h]},r.deselectIndex=function(h){return h=this.querySelectorAll("ul li")[h],h&&h.classList.remove("selected"),h},r.scrollToIndex=function(h){h=this.querySelectorAll("ul li")[h],h&&(this.scrollTop=h.offsetTop)},r.selectAll=function(){for(var h=this.querySelectorAll("ul li"),g=0;g<h.length;++g){var b=h[g];b.classList.contains("selected")||m.trigger(b,"click")}},r.deselectAll=function(){for(var h=this.querySelectorAll("ul li"),g=0;g<h.length;++g){var b=h[g];b.classList.contains("selected")&&m.trigger(b,"click")}},r.setValue=function(h){h!==void 0&&this.updateItems(h)},r.getNumberOfItems=function(){return this.querySelectorAll("ul li").length},r.filter=function(h,g){var b,y=this.querySelectorAll("ul li"),w=!1;h&&h.constructor===String&&(b=h,g&&b.toLowerCase(),w=!0,h=function(F){return(g?F:F.toLowerCase()).indexOf(b)!=-1});for(var I=0;I<y.length;++I){var R,D=y[I];h?(R=D.value,h(R=w&&R!=null&&R.constructor!==String?D.innerHTML:R,D,D.classList.contains("selected"))?D.style.display="":D.style.display="none"):D.style.display=""}},r.selectByFilter=function(h){for(var g=this.querySelectorAll("ul li"),b=0;b<g.length;++b){var y=g[b],w=h(y.value,y,y.classList.contains("selected"));w===!0?y.classList.add("selected"):w===!1&&y.classList.remove("selected")}},n.height&&(r.scrollTop=0),this.processElement(r,n),r},_.prototype.addButton=function(t,e,n){n=this.processOptions(n),e=n.button_text||e||"";var i=this,r=t===null?"single":"",o=(n.micro&&(r+=" micro"),""),a=(n.disabled&&(o="disabled='disabled'"),n.title||""),s=this.createWidget(t,"<button tabIndex='"+this.tab_index+"' "+o+"></button>",n),l=(this.tab_index++,s.querySelector("button"));return l.setAttribute("title",a),l.className="litebutton "+r,l.innerHTML=e,l.addEventListener("click",function(p){_.onWidgetChange.call(i,s,t,this.innerHTML,n,!1,p),m.trigger(l,"wclick",e)}),this.append(s,n),s.wclick=function(p){n.disabled||m.bind(this,"wclick",p)},s.setValue=function(p){p!==void 0&&(l.innerHTML=p)},s.disable=function(){l.disabled=!0},s.enable=function(){l.disabled=!1},this.processElement(s,n),s},_.prototype.addButtons=function(t,e,n){n=this.processOptions(n);var i=this,r="",o="calc( "+(100/(e=e||"").length).toFixed(3)+"% - 4px )",a="width:"+o+"; width: -moz-"+o+"; width: -webkit-"+o+"; margin: 2px;";if(e&&typeof e=="object")for(var s in e){var l="";r+="<button class='litebutton' title='"+(l=n.title&&n.title.constructor===Array?n.title[s]||"":l)+"' tabIndex='"+this.tab_index+"' style='"+a+"'>"+e[s]+"</button>",this.tab_index++}for(var p=this.createWidget(t,r,n),u=p.querySelectorAll("button"),s=0;s<u.length;++s)u[s].addEventListener("click",function(f){_.onWidgetChange.call(i,p,t,this.innerHTML,n,null,f),m.trigger(p,"wclick",this.innerHTML)});return this.append(p,n),this.processElement(p,n),p},_.prototype.addIcon=function(t,e,n){n=this.processOptions(n),e=e||"";var i=this,r=n.image,o=n.width||n.size||20,a=n.height||n.size||20,s=this.createWidget(t,"<span class='icon' "+(n.title?"title='"+n.title+"'":"")+" tabIndex='"+this.tab_index+"'></span>",n),l=(this.tab_index++,s.querySelector("span.wcontent")),p=s.querySelector("span.icon"),u=n.x||0,d=(n.index&&(u=n.index*-o),e?a:0);return s.style.minWidth=s.style.width=o+"px",s.style.margin="0 2px",s.style.padding="0",l.style.margin="0",l.style.padding="0",p.style.display="inline-block",p.style.cursor="pointer",p.style.width=o+"px",p.style.height=a+"px",p.style.backgroundImage="url('"+r+"')",p.style.backgroundPosition=u+"px "+d+"px",p.addEventListener("mousedown",function(f){f.preventDefault(),e=!e,f=_.onWidgetChange.call(i,s,t,e,n),m.trigger(s,"wclick",e),f=(e=f!==void 0?f:e)?a:0,p.style.backgroundPosition=u+"px "+f+"px",n.toggle===!1&&setTimeout(function(){p.style.backgroundPosition=u+"px 0px",e=!1},200)}),this.append(s,n),s.setValue=function(f,h){f!==void 0&&(f=(e=f)?a:0,p.style.backgroundPosition=u+"px "+f+"px",h||_.onWidgetChange.call(i,s,t,e,n))},s.getValue=function(){return e},this.processElement(s,n),s},_.prototype.addColor=function(t,e,n){n=this.processOptions(n),e=e||[0,0,0];var i,r=this,a=(this.values[t]=e,"<input tabIndex='"+this.tab_index+"' id='colorpicker-"+t+"' class='color' value='"+e[0]+","+e[1]+","+e[2]+"' "+(n.disabled?"disabled":"")+"/>"),o=(this.tab_index++,n.show_rgb&&(a+="<span class='rgb-color'>"+_.parseColor(e)+"</span>"),this.createWidget(t,a,n)),a=(this.append(o,n),o.querySelector("input.color")),s=null;return window.jscolor?((s=new jscolor.color(a)).pickerFaceColor="#333",s.pickerBorderColor="black",s.pickerInsetColor="#222",s.rgb_intensity=1,n.disabled&&(s.pickerOnfocus=!1),e.constructor!==String&&e.length&&2<e.length&&(s.fromRGB(+e[0],+e[1],+e[2]),s.rgb_intensity=1),a.addEventListener("change",function(l){var p=o.querySelector(".rgb-color");p&&(p.innerHTML=m.Inspector.parseColor(s.rgb))}),s.onImmediateChange=function(){var l=[s.rgb[0]*s.rgb_intensity,s.rgb[1]*s.rgb_intensity,s.rgb[2]*s.rgb_intensity],p=[l.concat(),s.toString()];m.trigger(o,"wbeforechange",p),r.values[t]=l,n.callback&&n.callback.call(o,l.concat(),"#"+s.toString(),s),m.trigger(o,"wchange",p),r.onchange&&r.onchange(t,l.concat(),o)},n.step=n.step||.01,n.dragger_class="nano",i=new m.Dragger(1,n),o.querySelector(".wcontent").appendChild(i.root),i.input.addEventListener("change",function(l){var p=parseFloat(this.value);s.rgb_intensity=p,s.onImmediateChange&&s.onImmediateChange()}),o.setValue=function(l,p){s.fromRGB(l[0],l[1],l[2]),p||m.trigger(i.input,"change")},o.getValue=function(){return e}):a.addEventListener("change",function(l){var p=o.querySelector(".rgb-color");p&&(p.innerHTML=m.Inspector.parseColor(s.rgb))}),this.processElement(o,n),o},_.prototype.addFile=function(t,e,n){n=this.processOptions(n);var i=this,r=(this.values[t]=e=e||"",this.createWidget(t,"<span class='inputfield full whidden' style='width: calc(100% - 26px)'><span class='filename'></span></span><button class='litebutton' style='width:20px; margin-left: 2px;'>...</button><input type='file' size='100' class='file' value='"+e+"'/>",n)),o=(r.querySelector(".wcontent").style.position="relative",r.querySelector(".wcontent input")),a=r.querySelector(".wcontent .filename");return e&&(a.innerText=e.name),o.addEventListener("change",function(s){var l;s.target.files.length?((l=s.target.files[0]).files=s.target.files,n.generate_url&&(l.url=URL.createObjectURL(s.target.files[0])),a.innerText=l.name,n.read_file?((s=new FileReader).onload=function(p){l.data=p.target.result,_.onWidgetChange.call(i,r,t,l,n)},n.read_file=="binary"?s.readAsArrayBuffer(l):n.read_file=="data_url"?s.readAsDataURL(l):s.readAsText(l)):_.onWidgetChange.call(i,r,t,l,n)):(a.innerText="",_.onWidgetChange.call(i,r,t,null,n))}),this.append(r,n),r},_.prototype.addLine=function(t,o,n){n=this.processOptions(n);var i=this,r=(this.values[t]=o=o||"",this.createWidget(t,"<span class='line-editor'></span>",n)),o=(r.style.width="100%",new m.LineEditor(o,n));return r.querySelector("span.line-editor").appendChild(o),m.bind(o,"change",function(a){m.trigger(r,"wbeforechange",[a.target.value]),n.callback&&n.callback.call(r,a.target.value),m.trigger(r,"wchange",[a.target.value]),_.onWidgetChange.call(i,r,t,a.target.value,n)}),this.append(r,n),r},_.prototype.addTree=function(r,e,n){n=this.processOptions(n),e=e||"";var i=this.createWidget(r,"<div class='wtree inputfield full'></div>",n),r=i.querySelector(".wtree"),o=(n.height&&(r.style.height=typeof n.height=="number"?n.height+"px":n.height,r.style.overflow="auto"),i.tree=new m.Tree(e,n.tree_options));return o.onItemSelected=function(a,s){n.callback&&n.callback.call(i,a,s)},r.appendChild(o.root),i.setValue=function(a){o.updateTree(a)},this.append(i,n),this.processElement(i,n),i},_.prototype.addDataTree=function(t,e,n){return n=this.processOptions(n),e=e||"",t=this.createWidget(t,"<div class='wtree'></div>",n),function i(r,o){for(var a in o){var s=document.createElement("div");s.className="treenode",typeof o[a]=="object"?(s.innerHTML="<span class='itemname'>"+a+"</span><span class='itemcontent'></span>",i(s.querySelector(".itemcontent"),o[a])):s.innerHTML="<span class='itemname'>"+a+"</span><span class='itemvalue'>"+o[a]+"</span>",r.appendChild(s)}}(t.querySelector(".wtree"),e),this.append(t,n),t},_.prototype.addArray=function(t,e,n){var i,r,o,a,s=this;{if(e&&e.constructor===Array)return i=(n=this.processOptions(n)).data_type||"string",r=n.max_items||100,o=null,this.widgets_per_row=3,this.addInfo(t,null,{name_width:"100%",width:"100% - 160px"}),a=this.addString("length",e.length||"0",{width:100,callback:function(u){u=parseInt(u),(e=e<0?0:e).length=u,l.call(o)}}),this.addButtons(null,["+","-"],{width:60,callback:function(u){u=="+"?e.length=e.length+1:0<e.length&&(e.length=e.length-1),a.setValue(e.length),l.call(o)}}),this.widgets_per_row=1,(o=this.addContainer(t,n)).value=e,l.call(o),o.setValue=function(u){this.value=u,l.call(o)},o.getValue=function(){return this.value=v},o;console.error("Inspector: Array widget value must be a valid array")}function l(){var u=this.value,d=Math.min(u.length,r);s.widgets_per_row+=1,this.innerHTML="";for(var f=0;f<d;++f){var h=null,g=(u[f]!==void 0&&(h=u[f]),document.createElement("div"));g.className="array-row",g.innerHTML="<span class='row-index'>"+f+"</span><span class='row-cell'></span><button style='width: 30px;' class='litebutton single row-trash'><img src='imgs/mini-icon-trash.png'/></button>",this.appendChild(g);var b={widget_parent:g.querySelector(".row-cell"),callback:p.bind({value:this.value,index:f})};if(n.data_options)for(var y in n.data_options)b[y]=n.data_options[y];s.add(i,null,h,b)}--s.widgets_per_row}function p(u){this.value[this.index]=u,n.callback&&n.callback.call(o,this.value,this.index)}},_.prototype.addContainer=function(t,e){return t&&t.constructor!==String&&console.warn("LiteGUI.Inspector.addContainer first parameter must be a string with the name"),t=this.startContainer(null,e),this.endContainer(),t},_.prototype.startContainer=function(t,e){e=this.processOptions(e);var n=document.createElement("DIV");return n.className="wcontainer",this.applyOptions(n,e),this.row_number=0,this.append(n),this.pushContainer(n),e.widgets_per_row&&(this.widgets_per_row=e.widgets_per_row),e.height&&(n.style.height=m.sizeToCSS(e.height),n.style.overflow="auto"),n.refresh=function(){n.on_refresh&&n.on_refresh.call(this,n)},n},_.prototype.endContainer=function(t,e){this.popContainer()},_.prototype.addSection=function(t,e){e=this.processOptions(e);var n=this,i=(this.current_section&&this.current_section.end(),document.createElement("DIV")),r=(i.className="wsection",t||(i.className+=" notitle"),e.className&&(i.className+=" "+e.className),e.collapsed&&(i.className+=" collapsed"),e.id&&(i.id=e.id),e.instance&&(i.instance=e.instance),"");return t&&(r+="<div class='wsectiontitle'>"+(e.no_collapse?"":"<span class='switch-section-button'></span>")+t+"</div>"),i.innerHTML=r+="<div class='wsectioncontent'></div>",i._last_container_stack=this._current_container_stack.concat(),this.root.appendChild(i),this.sections.push(i),i.sectiontitle=i.querySelector(".wsectiontitle"),t&&i.sectiontitle.addEventListener("click",function(o){o.target.localName!="button"&&(i.classList.toggle("collapsed"),(o=i.querySelector(".wsectioncontent")).style.display=o.style.display==="none"?null:"none",e.callback&&e.callback.call(i,!i.classList.contains("collapsed")))}),e.collapsed&&(i.querySelector(".wsectioncontent").style.display="none"),this.setCurrentSection(i),e.widgets_per_row&&(this.widgets_per_row=e.widgets_per_row),i.refresh=function(){i.on_refresh&&i.on_refresh.call(this,i)},i.end=function(){var o;n.current_section==this&&(n._current_container_stack=this._last_container_stack,n._current_container=null,(o=this.querySelector(".wsectioncontent"))&&(n.isContainerInStack(o)&&n.popContainer(o),n.current_section=null))},i},_.prototype.setCurrentSection=function(t){var e;this.current_section!=t&&(e=(this.current_section=t).parentNode,this.popContainer(e),e=t.querySelector(".wsectioncontent"),this.pushContainer(e))},_.prototype.getCurrentSection=function(){for(var t=this._current_container_stack.length-1;0<=t;--t){var e=this._current_container_stack[t];if(e.classList.contains("wsectioncontent"))return e.parentNode}return null},_.prototype.endCurrentSection=function(){this.current_section&&this.current_section.end()},_.prototype.beginGroup=function(i,e){e=this.processOptions(e);var n=document.createElement("DIV"),i=(n.className="wgroup",n.innerHTML="<div class='wgroupheader "+(e.title?"wtitle":"")+"'><span class='switch-section-button'></span>"+(i=i||"")+"</div>",n.group=!0,document.createElement("DIV")),r=(i.className="wgroupcontent",e.collapsed&&(i.style.display="none"),e.height&&(i.style.height=m.sizeToCSS(e.height)),e.scrollable&&(i.style.overflow="auto"),n.appendChild(i),e.collapsed||!1),o=n.querySelector(".wgroupheader");return r&&o.classList.add("collapsed"),o.addEventListener("click",function(a){var s=n.querySelector(".wgroupcontent").style;s.display=s.display==="none"?"":"none",(r=!r)?o.classList.add("collapsed"):o.classList.remove("collapsed"),a.preventDefault()}),this.append(n,e),this.pushContainer(i),n},_.prototype.endGroup=function(){for(;this.popContainer(),this._current_container&&!this._current_container.classList.contains("wgroupcontent"););},_.prototype.addTitle=function(i,e){e=this.processOptions(e);var n=document.createElement("DIV"),i="<span class='wtitle'><span class='text'>"+i+"</span>";return e.help&&(i+="<span class='help'><div class='help-content'>"+e.help+"</div></span>"),n.innerHTML=i+="</span>",n.setValue=function(r){this.querySelector(".text").innerHTML=r},this.row_number=0,this.append(n,e),n},_.prototype.scrollTo=function(n){var e,n=this.root.querySelector("#"+n);n&&(e=this.root.offsetTop,n=n.offsetTop-e,this.root.parentNode.parentNode.scrollTop=n)},_.prototype.processOptions=function(t){return(t=typeof t=="function"?{callback:t}:t)||{}},_.prototype.processElement=function(t,e){e.callback_update&&t.setValue&&(t.on_update=function(){this.setValue(e.callback_update.call(this),!0)})},_.prototype.updateWidgets=function(){for(var t=0;t<this.widgets.length;++t){var e=this.widgets[t];e.on_update&&e.on_update(e)}},_.parseColor=function(t){return"<span style='color: #FAA'>"+t[0].toFixed(2)+"</span>,<span style='color: #AFA'>"+t[1].toFixed(2)+"</span>,<span style='color: #AAF'>"+t[2].toFixed(2)+"</span>"};const G_="lite-menu",V_="lite-menu-panel",U_="lite-menu-entry";function _t(t,e){e=e||{},this.menu=[],this.panels=[],this.root=document.createElement("div"),this.root.id=t,this.root.className=G_,this.content=document.createElement("ul"),this.root.appendChild(this.content),this.is_open=!1,this.auto_open=e.auto_open||!1,this.sort_entries=e.sort_entries||!1}function ve(t,e){this._ctor(t,e)}function us(t,e,n){var i,r;e=e||{},t&&t.constructor===String&&(i=t,t=e,(e=n||{}).id=i,console.warn("LiteGUI.Split legacy parameter, use sections as first parameter instead of id."));const o=document.createElement("div");for(r in this.root=o,e.id&&(o.id=e.id),o.className="litesplit "+(e.vertical?"vsplit":"hsplit"),this.sections=[],t){var a=document.createElement("div");a.className="split-section split"+r,typeof t[r]=="number"?e.vertical?a.style.height=t[r].toFixed(1)+"%":a.style.width=t[r].toFixed(1)+"%":typeof t[r]=="string"?e.vertical?a.style.height=t[r]:a.style.width=t[r]:(t[r].id&&(a.id=t[r].id),e.vertical?a.style.height=typeof t[r].height=="Number"?t[r].height.toFixed(1)+"%":t[r].height:a.style.width=typeof t[r].width=="Number"?t[r].width.toFixed(1)+"%":t[r].width),a.add=function(s){this.appendChild(s.root||s)},this.sections.push(a),o.appendChild(a)}e.parent&&(e.parent.root||e.parent).appendChild(o)}function Xt(t){t=t||{},this.root=document.createElement("table"),this.root.classList.add("litetable"),this.columns=[],this.column_fields=[],this.rows=[],this.data=[],this._must_update_header=!0,t.colums&&this.setColumns(t.colums),t.scrollable&&(this.root.style.overflow="auto"),t.height&&(this.root.style.height=m.sizeToCSS(t.height)),t.columns&&this.setColumns(t.columns),t.rows&&this.setRows(t.data)}function j(t,n){(n||t&&t.constructor===String)&&(i=t,(t=n||{}).id=i,console.warn("LiteGUI.Tabs legacy parameter, use options as first parameter instead of id.")),this.options=t=t||{};var n=this.mode=t.mode||"horizontal",i=document.createElement("DIV"),r=(t.id&&(i.id=t.id),i.data=this,i.className="litetabs "+n,this.root=i,(this.root.tabs=this).current_tab=null,n=="horizontal"?t.size&&(t.size=="full"?this.root.style.height="100%":this.root.style.height=t.size):n=="vertical"&&t.size&&(t.size=="full"?this.root.style.width="100%":this.root.style.width=t.size),t.width&&(this.root.style.width=t.width.constructor===Number?t.width.toFixed(0)+"px":t.width),t.height&&(this.root.style.height=t.height.constructor===Number?t.height.toFixed(0)+"px":t.height),document.createElement("UL"));function o(a){a.deltaY&&(r.scrollLeft+=a.deltaY)}r.className="wtabcontainer",n=="vertical"?r.style.width=m.Tabs.tabs_width+"px":r.style.height=m.Tabs.tabs_height+"px",r.addEventListener("wheel",o),r.addEventListener("mousewheel",o),this.list=r,this.root.appendChild(this.list),this.tabs_root=r,this.tabs={},this.tabs_by_index=[],this.selected=null,this.onchange=t.callback,t.parent&&this.appendTo(t.parent)}function S(t,e,i){(i||t&&t.constructor===String)&&(o=t,t=e,(e=i||{}).id=o,console.warn("LiteGUI.Tree legacy parameter, use data as first parameter instead of id.")),e=e||{};var i=document.createElement("div"),r=(this.root=i,e.id&&(i.id=e.id),i.className="litetree",this.tree=t,this),o=(this.options=e=e||{allow_rename:!1,allow_drag:!0,allow_multiselection:!1},this.indent_offset=e.indent_offset||0,e.height&&(this.root.style.height=typeof e.height=="string"?e.height:Math.round(e.height)+"px"),this.collapsed_depth=3,e.collapsed_depth!=null&&(this.collapsed_depth=e.collapsed_depth),i.addEventListener("click",function(a){a.target==r.root&&r.onBackgroundClicked&&r.onBackgroundClicked(a,r)}),i.addEventListener("contextmenu",function(a){return a.button==2&&(r.onContextMenu&&r.onContextMenu(a),a.preventDefault()),!1}),this.createAndInsert(t,e,null));if(!o)throw"Error in LiteGUI.Tree, createAndInsert returned null";o.className+=" root_item",this.root_item=o}function Fn(t,e){e=e||{},t=t||"";var n=document.createElement("div"),i=(n.className="litegui searchbox",e.placeholder!=null?e.placeholder:"Search"),r=(n.innerHTML="<input value='"+t+"' placeholder='"+i+"'/>",this.input=n.querySelector("input"),this.root=n,this);this.input.onchange=function(o){o=o.target.value,e.callback&&e.callback.call(r,o)}}function ye(t,e){this.options=e=e||{};var n,i=this,r=(e.parentMenu&&(e.parentMenu.constructor!==this.constructor?(console.error("parentMenu must be of class ContextMenu, ignoring it"),e.parentMenu=null):(this.parentMenu=e.parentMenu,this.parentMenu.lock=!0,this.parentMenu.current_submenu=this)),e.event&&e.event.constructor.name!=="MouseEvent"&&e.event.constructor.name!=="PointerEvent"&&e.event.constructor.name!=="CustomEvent"&&(console.error("Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it."),e.event=null),document.createElement("div"));for(n in r.className="litecontextmenu litemenubar-panel",r.style.minWidth=100,r.style.minHeight=100,r.style.pointerEvents="none",setTimeout(function(){r.style.pointerEvents="auto"},100),r.addEventListener("mouseup",function(f){return f.preventDefault(),!0},!0),r.addEventListener("contextmenu",function(f){return f.button==2&&f.preventDefault(),!1},!0),r.addEventListener("mousedown",function(f){if(f.button==2)return i.close(),f.preventDefault(),!0},!0),this.root=r,e.title&&((u=document.createElement("div")).className="litemenu-title",u.innerHTML=e.title,r.appendChild(u)),t){var o=t.constructor==Array?t[n]:n,a=(o!=null&&o.constructor!==String&&(o=o.content===void 0?String(o):o.content),t[n]);this.addItem(o,a,e)}function s(f){var h=parseInt(r.style.top);return r.style.top=(h+.1*f.deltaY).toFixed()+"px",f.preventDefault(),!0}r.addEventListener("mouseleave",function(f){i.lock||(r.closing_timer&&clearTimeout(r.closing_timer),r.closing_timer=setTimeout(i.close.bind(i,f),500))}),r.addEventListener("mouseenter",function(f){r.closing_timer&&clearTimeout(r.closing_timer)}),r.addEventListener("wheel",s,!0),r.addEventListener("mousewheel",s,!0);var l,p,u=document,u=((u=(u=e.event?e.event.target.ownerDocument:u)||document).body.appendChild(r),e.left||0),d=e.top||0;e.event&&(e.event.constructor.name!=="MouseEvent"&&e.event.constructor.name!=="PointerEvent"&&e.event.constructor.name!=="CustomEvent"?(console.warn("Event passed to ContextMenu is not of type MouseEvent"),e.event=null):(u=e.event.pageX-10,d=e.event.pageY-10,e.title&&(d-=20),e.parentMenu&&(u=(l=e.parentMenu.root.getBoundingClientRect()).left+l.width),l=document.body.getBoundingClientRect(),p=r.getBoundingClientRect(),u>l.width-p.width-10&&(u=l.width-p.width-10),d>l.height-p.height-10&&(d=l.height-p.height-10))),r.style.left=u+"px",r.style.top=d+"px"}function Y_(t,e){this.value=t;var n=this.root=document.createElement("span"),i=(n.className="litecheckbox inputfield",n.dataset.value=t,this.element=document.createElement("span"));i.className="fixed flag checkbox "+(t?"on":"off"),n.appendChild(i),n.addEventListener("click",function(r){this.setValue(this.root.dataset.value!="true"),r.preventDefault(),r.stopPropagation()}.bind(this)),this.setValue=function(r){var o;this.value!==r&&this.root.dataset.value!=r.toString()&&((this.root.dataset.value=r)?(this.element.classList.remove("off"),this.element.classList.add("on")):(this.element.classList.remove("on"),this.element.classList.add("off")),o=this.value,this.value=r,e&&e(r,o))},this.getValue=function(){return this.value}}function Bn(t,e,n){n=n||{};var i,r=this.root=document.createElement("ul"),o=(r.id=t,r.className="litelist",this.items=[],this);for(i in this.callback=n.callback,e){var a=document.createElement("li"),s=(a.className="list-item",a.data=e[i],a.dataset.value=e[i],"");typeof e[i]=="string"?s=e[i]+"<span class='arrow'></span>":(s=(e[i].name||e[i].title||"")+"<span class='arrow'></span>",e[i].id&&(a.id=e[i].id)),a.innerHTML=s,a.addEventListener("click",function(){for(var l=r.querySelectorAll(".list-item.selected"),p=0;p<l.length;++p)l[p].classList.remove("selected");this.classList.add("selected"),m.trigger(o.root,"wchanged",this),o.callback&&o.callback(this.data)}),r.appendChild(a)}n.parent&&(n.parent.root||n.parent).appendChild(r)}function X_(t,e){e=e||{};var n=this.root=document.createElement("div"),i=this;function r(l){var p,u,d=n.getBoundingClientRect();d&&(d=d.width,p=e.min||0,u=e.max||1,i.setValue((u-p)*(l/d)+p))}this.value=t,n.className="liteslider",this.setValue=function(l,p){var d=e.min||0,u=e.max||1,u=(l<d?l=d:u<l&&(l=u),u-d),d=(l-d)/u,u=(100*d).toFixed(1)+"%",d=(100*d+2).toFixed(1)+"%";n.style.background="linear-gradient(to right, #999 "+u+", #FC0 "+d+", #333 "+d+")",l!=this.value&&(this.value=l,p||(m.trigger(this.root,"change",l),this.onChange&&this.onChange(l)))};var o=null;function a(l){var p=n.getBoundingClientRect();if(p)return r((l.x===void 0?l.pageX:l.x)-p.left),l.preventDefault(),!1}function s(l){var p=o||document;return o=null,p.removeEventListener("mousemove",a),p.removeEventListener("mouseup",s),l.preventDefault(),!1}n.addEventListener("mousedown",function(l){var p;l.offsetX?(p=l.offsetX,l.offsetY):l.layerX&&(p=l.layerX,l.layerY),r(p),(o=n.ownerDocument).addEventListener("mousemove",a),o.addEventListener("mouseup",s),l.preventDefault(),l.stopPropagation()}),this.setValue(t)}function Z_(t,e){e=e||{};var n=document.createElement("div"),i=(n.className="curve "+(e.extraclass||""),n.style.minHeight="50px",n.style.width=e.width||"100%",n.bgcolor=e.bgcolor||"#222",n.pointscolor=e.pointscolor||"#5AF",n.linecolor=e.linecolor||"#444",n.value=t||[],n.xrange=e.xrange||[0,1],n.yrange=e.yrange||[0,1],n.defaulty=e.defaulty!=null?e.defaulty:.5,n.no_trespassing=e.no_trespassing||!1,n.show_samples=e.show_samples||0,n.options=e,n.style.minWidth="50px",n.style.minHeight="20px",document.createElement("canvas"));function r(h){return[i.width*((n.xrange[1]-n.xrange[0])*h[0]+n.xrange[0]),i.height*((n.yrange[1]-n.yrange[0])*h[1]+n.yrange[0])]}function o(h){return[(h[0]/i.width-n.xrange[0])/(n.xrange[1]-n.xrange[0]),(h[1]/i.height-n.yrange[0])/(n.yrange[1]-n.yrange[0])]}i.width=e.width||200,i.height=e.height||50,n.appendChild(i),n.canvas=i,n.addEventListener("mousedown",function(h){document.addEventListener("mousemove",l),document.addEventListener("mouseup",p);var b=i.getBoundingClientRect(),g=h.clientX-b.left,b=h.clientY-b.top;{var y;(a=function(w,I){for(var R=1e5,D=-1,F=0;F<n.value.length;F++){var ge=r(n.value[F]),ge=d([w,I],ge);ge<R&&ge<8&&(R=ge,D=F)}return D}(g,i.height-b))==-1&&(y=o([g,i.height-b]),n.value.push(y),f(),a=n.value.indexOf(y))}s=[g,b],n.redraw(),h.preventDefault(),h.stopPropagation()}),n.getValueAt=function(h){if(h<n.xrange[0]||h>n.xrange[1])return n.defaulty;for(var g=[n.xrange[0],n.defaulty],b=0,y=0;y<n.value.length;y+=1){var w=n.value[y];if(h==w[0])return w[1];if(h<w[0])return b=(h-g[0])/(w[0]-g[0]),g[1]*(1-b)+w[1]*b;g=w}return w=[n.xrange[1],n.defaulty],b=(h-g[0])/(w[0]-g[0]),g[1]*(1-b)+w[1]*b},n.resample=function(h){for(var g=[],b=(n.xrange[1]-n.xrange[0])/h,y=n.xrange[0];y<=n.xrange[1];y+=b)g.push(n.getValueAt(y));return g},n.addValue=function(h){for(var g=0;g<n.value;g++){var b=n.value[g];if(!(b[0]<h[0]))return n.value.splice(g,0,h),void redraw()}n.value.push(h),redraw()};var a=-1,s=(n.redraw=function(){var h=i.parentNode.getBoundingClientRect(),g=(h&&i.width!=h.width&&h.width&&h.width<1e3&&(i.width=h.width),i.getContext("2d")),b=(g.setTransform(1,0,0,1,0,0),g.translate(0,i.height),g.scale(1,-1),g.fillStyle=n.bgcolor,g.fillRect(0,0,i.width,i.height),g.strokeStyle=n.linecolor,g.beginPath(),r([n.xrange[0],n.defaulty]));for(y in g.moveTo(b[0],b[1]),n.value)b=r(n.value[y]),g.lineTo(b[0],b[1]);b=r([n.xrange[1],n.defaulty]),g.lineTo(b[0],b[1]),g.stroke();for(var y=0;y<n.value.length;y+=1)b=r(n.value[y]),g.fillStyle=a==y?"white":n.pointscolor,g.beginPath(),g.arc(b[0],b[1],a==y?4:2,0,2*Math.PI),g.fill();if(n.show_samples){var w=n.resample(n.show_samples);for(g.fillStyle="#888",y=0;y<w.length;y+=1)b=r([y*((n.xrange[1]-n.xrange[0])/n.show_samples)+n.xrange[0],w[y]]),g.beginPath(),g.arc(b[0],b[1],2,0,2*Math.PI),g.fill()}},window.onresize=()=>n.redraw(),[0,0]);function l(h){var g,b,y,w=i.getBoundingClientRect(),I=h.clientX-w.left,R=h.clientY-w.top;I<0?I=0:I>i.width&&(I=i.width),R<0?R=0:R>i.height&&(R=i.height),a!=-1&&d([h.clientX-w.left,h.clientY-w.top],[I,R])>.5*i.height?(n.value.splice(a,1),p(h)):(w=o([-(s[0]-I),s[1]-R]),a!=-1&&(g=n.xrange[0],b=n.xrange[1],n.no_trespassing&&(0<a&&(g=n.value[a-1][0]),a<n.value.length-1&&(b=n.value[a+1][0])),(y=n.value[a])[0]+=w[0],y[1]+=w[1],y[0]<g?y[0]=g:y[0]>b&&(y[0]=b),y[1]<n.yrange[0]?y[1]=n.yrange[0]:y[1]>n.yrange[1]&&(y[1]=n.yrange[1])),f(),n.redraw(),s[0]=I,s[1]=R,u(),h.preventDefault(),h.stopPropagation())}function p(h){a=-1,n.redraw(),document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",p),u(),h.preventDefault(),h.stopPropagation()}function u(){e.callback?e.callback.call(n,n.value):m.trigger(n,"change")}function d(h,g){return Math.sqrt(Math.pow(g[0]-h[0],2)+Math.pow(g[1]-h[1],2))}function f(){var h=null;a!=-1&&(h=n.value[a]),n.value.sort(function(g,b){return g[0]-b[0]}),h&&(a=n.value.indexOf(h))}return n.redraw(),n}function _e(t){t=t||{},this.root=document.createElement("div"),this.root.className="litecomplexlist",this.item_code=t.item_code||"<div class='listitem'><span class='tick'><span>"+m.special_codes.tick+"</span></span><span class='title'></span><button class='trash'>"+m.special_codes.close+"</button></div>",t.height&&(this.root.style.height=m.sizeToCSS(t.height)),this.selected=null,this.onItemSelected=null,this.onItemToggled=null,this.onItemRemoved=null}function J_(t,e){var n=document.createElement("span");return n.className="listbox "+(t?"listopen":"listclosed"),n.innerHTML=t?"&#9660;":"&#9658;",n.dataset.value=t?"open":"closed",n.addEventListener("click",function(i){i.target.setValue(this.dataset.value!="open"),this.stopPropagation&&i.stopPropagation()}),n.on_change_callback=e,n.setEmpty=function(i){i?this.classList.add("empty"):this.classList.remove("empty")},n.expand=function(){this.setValue(!0)},n.collapse=function(){this.setValue(!1)},n.setValue=function(i){this.dataset.value!=(i?"open":"closed")&&(i?(this.dataset.value="open",this.innerHTML="&#9660;",this.classList.add("listopen"),this.classList.remove("listclosed")):(this.dataset.value="closed",this.innerHTML="&#9658;",this.classList.remove("listopen"),this.classList.add("listclosed")),e&&e(this.dataset.value))},n.getValue=function(){return this.dataset.value},n}_t.closing_time=500,_t.prototype.clear=function(){this.content.innerHTML="",this.menu=[],this.panels=[]},_t.prototype.attachToPanel=function(t){t.content.insertBefore(this.root,t.content.firstChild)},_t.prototype.add=function(t,e){typeof(e=e||{})=="function"&&(e={callback:e});for(var n=this.menu.length,i=t.split("/"),r=0,o=0,a=this.menu,s=null;a;){if(5<r)throw"Error: Menu too deep";if(a.length==o){var l={parent:s,children:[]},s=l;if(r==i.length-1&&(l.data=e),l.disable=function(){this.data&&(this.data.disabled=!0)},l.enable=function(){this.data&&delete this.data.disabled},l.name=i[r],a.push(l),++r==i.length)break;l.children=[],a=l.children,o=0}else{if(a[o]&&i[r]==a[o].name){if(r<i.length-1){s=a[o],a=a[o].children,o=0,r++;continue}if(a[o].name!==""){console.warn("Warning: Adding menu that already exists: "+t);break}}o++}}n!=this.menu.length&&this.updateMenu()},_t.prototype.remove=function(t){if(t=this.findMenu(t),t){if(!t.parent||!t.parent.children)return console.warn("menu without parent?");var e=t.parent.children.indexOf(t);e!=-1&&t.parent.children.splice(e,1)}},_t.prototype.separator=function(t,e){t=this.findMenu(t),t&&t.children.push({separator:!0,order:e||10})},_t.prototype.findMenu=function(t){for(var e=t.split("/"),n=0,i=0,r=this.menu;r;){if(n==e.length)return r;if(r.length<=i)return null;if(e[n]=="*")return r[i].children;if(e[n]==r[i].name){if(n==e.length-1)return r[i];r=r[i].children,i=0,n++}else i++}return null},_t.prototype.updateMenu=function(){var t,e=this;for(t in this.content.innerHTML="",this.menu){var n=document.createElement("li");n.innerHTML="<span class='icon'></span><span class='name'>"+this.menu[t].name+"</span>",this.content.appendChild(n),n.data=this.menu[t],(this.menu[t].element=n).addEventListener("click",function(i){var r=this.data;r.data&&r.data.callback&&typeof r.data.callback=="function"&&r.data.callback(r.data),e.is_open?(e.is_open=!1,e.hidePanels()):(e.is_open=!0,e.showMenu(r,i,this))}),n.addEventListener("mouseover",function(i){e.hidePanels(),(e.is_open||e.auto_open)&&e.showMenu(this.data,i,this)})}},_t.prototype.hidePanels=function(){if(this.panels.length){for(var t in this.panels)m.remove(this.panels[t]);this.panels=[]}},_t.prototype.showMenu=function(t,e,n,i){if(i||this.hidePanels(),t.children&&t.children.length){var r,o=this,a=(o.closing_by_leave&&clearInterval(o.closing_by_leave),document.createElement("div")),s=(a.className=V_,[]);for(r in t.children)s.push(t.children[r]);for(r in this.sort_entries&&s.sort(function(d,f){var h=10,g=10;return d&&d.data&&d.data.order!=null&&(h=d.data.order),d&&d.separator&&d.order!=null&&(h=d.order),f&&f.data&&f.data.order!=null&&(g=f.data.order),h-(g=f&&f.separator&&f.order!=null?f.order:g)}),s){var l=document.createElement("p"),p=s[r],u=(l.className=U_,l.className+=l.children?" submenu":"",p.children&&p.children.length);u&&l.classList.add("has_submenu"),p&&p.name?l.innerHTML="<span class='icon'></span><span class='name'>"+p.name+(u?"<span class='more'>+</span>":"")+"</span>":l.classList.add("separator"),l.data=p,l.data.data&&(((u=l.data.data).type=="checkbox"&&u.instance&&u.property&&u.instance[u.property]==1||u.checkbox==1||u.instance&&u.property&&u.hasOwnProperty("value")&&u.instance[u.property]==u.value||typeof u.isChecked=="function"&&u.isChecked.call(u.instance,u))&&(l.className+=" checked"),u.disabled&&(l.className+=" disabled")),l.addEventListener("click",function(){var d=this.data;if(d.data){if(d.data.disabled)return;d.data.instance&&d.data.property&&(d.data.type=="checkbox"?(d.data.instance[d.data.property]=!d.data.instance[d.data.property],d.data.instance[d.data.property]?this.classList.add("checked"):this.classList.remove("checked")):d.data.hasOwnProperty("value")&&(d.data.instance[d.data.property]=d.data.value)),d.data.checkbox!=null&&(d.data.checkbox=!d.data.checkbox,d.data.checkbox?this.classList.add("checked"):this.classList.remove("checked")),d.data.callback&&typeof d.data.callback=="function"&&d.data.callback(d.data)}d.children&&d.children.length?o.showMenu(d,e,this,!0):(o.is_open=!1,o.hidePanels())}),l.addEventListener("mouseenter",function(d){}),a.appendChild(l)}a.addEventListener("mouseleave",function(d){o.closing_by_leave&&clearInterval(o.closing_by_leave),o.closing_by_leave=setTimeout(function(){o.is_open=!1,o.hidePanels()},m.Menu.closing_time)}),a.addEventListener("mouseenter",function(d){o.closing_by_leave&&clearInterval(o.closing_by_leave),o.closing_by_leave=null}),n=n.getBoundingClientRect(),a.style.left=n.left+(i?200:0)+"px",a.style.top=n.top+n.height+(i?-20:10)+"px",this.panels.push(a),document.body.appendChild(a)}},ve.title_height="20px",ve.prototype._ctor=function(i,e){!e&&i&&i.constructor!==String&&(e=i,i=null),this.content=(e=e||{}).content||"";var n=this.root=document.createElement("div"),i=(i&&(n.id=i),n.className="litepanel "+(e.className||""),n.data=this,"");e.title&&(i+="<div class='panel-header'>"+e.title+"</div>"),i+="<div class='content'>"+this.content+"</div>",n.innerHTML=i+="<div class='panel-footer'></div>",e.title&&(this.header=this.root.querySelector(".panel-header")),this.content=this.root.querySelector(".content"),this.footer=this.root.querySelector(".panel-footer"),e.width&&(this.root.style.width=m.sizeToCSS(e.width)),e.height&&(this.root.style.height=m.sizeToCSS(e.height)),e.position&&(this.root.style.position="absolute",this.root.style.left=m.sizeToCSS(e.position[0]),this.root.style.top=m.sizeToCSS(e.position[1])),e.scroll==1&&(this.content.style.overflow="auto")},ve.prototype.add=function(t){this.content.appendChild(t.root)},ve.prototype.clear=function(){for(;this.content.firstChild;)this.content.removeChild(this.content.firstChild)},us.prototype.getSection=function(t){return this.sections[t]},Xt.prototype.setRows=function(t,e){this.data=t,this.updateContent(e)},Xt.prototype.addRow=function(t,e){for(var n=document.createElement("tr"),i=0;i<this.column_fields.length;++i){var r=document.createElement("td"),o=null,o=((o=t.constructor===Array?t[i]:t[this.column_fields[i]])===void 0&&(o=""),r.innerHTML=o,this.columns[i]);if(o===void 0)break;o.className&&(r.className=o.className),o.width&&(r.style.width=o.width),n.appendChild(r)}return this.root.appendChild(n),this.rows.push(n),e||this.data.push(t),n},Xt.prototype.updateRow=function(t,e){if(this.data[t]=e,t=this.rows[t],t){for(var n=t.querySelectorAll("td"),i=0;i<n.length;++i){var r=this.columns[i],o=null;(o=e.constructor===Array?e[i]:e[r.field])===void 0&&(o=""),n[i].innerHTML=o}return t}},Xt.prototype.updateCell=function(t,e,n){if(t=this.rows[t],t&&(e=t.childNodes[e]))return e.innerHTML=n,e},Xt.prototype.setColumns=function(t){this.columns.length=0,this.column_fields.length=0;for(var e=Math.floor(100/t.length).toFixed(1)+"%",n=[],i=0;i<t.length;++i){var r=t[i];r!=null&&(r={name:(r=r.constructor!==String&&r.constructor!==Number?r:{name:String(r)}).name||"",width:m.sizeToCSS(r.width||e),field:(r.field||r.name||"").toLowerCase(),className:r.className},i==t.length-1?r.width=" calc( 100% - ( "+n.join(" + ")+" ) )":n.push(r.width),this.columns.push(r),this.column_fields.push(r.field))}this._must_update_header=!0,this.updateContent()},Xt.prototype.updateContent=function(t){if(this.root.innerHTML="",this._must_update_header){this.header=document.createElement("tr");for(var e=0;e<this.columns.length;++e){var n=this.columns[e],i=document.createElement("th");i.innerHTML=n.name,n.width&&(i.style.width=n.width),n.th=i,this.header.appendChild(i)}this._must_update_header=!1}if(this.root.appendChild(this.header),this.data)if(t=this.data.length!=this.rows.length?!1:t)for(e=0;e<this.rows.length;++e){var r=this.data[e],r=this.updateRow(e,r);this.root.appendChild(r)}else for(e=this.rows.length=0;e<this.data.length;++e){var o=this.data[e];this.addRow(o,!0)}},j.tabs_width=64,j.tabs_height=26,j.prototype.show=function(){this.root.style.display="block"},j.prototype.hide=function(){this.root.style.display="none"},j.prototype.getCurrentTab=function(){return this.current_tab?this.tabs[this.current_tab[0]]:null},j.prototype.getCurrentTabId=function(){return this.current_tab[0]},j.prototype.getPreviousTab=function(){return this.previous_tab?this.tabs[this.previous_tab[0]]:null},j.prototype.appendTo=function(t,e){e?t.prepend(this.root):t.appendChild(this.root)},j.prototype.getTab=function(t){return this.tabs[t]},j.prototype.getTabByIndex=function(t){return this.tabs_by_index[t]},j.prototype.getNumOfTabs=function(){var t,e=0;for(t in this.tabs)e++;return e},j.prototype.getTabContent=function(t){if(t=this.tabs[t],t)return t.content},j.prototype.getTabIndex=function(t){var e=this.tabs[t];if(e){for(var n=0;n<this.list.childNodes.length;n++)if(this.list.childNodes[n]==e.tab)return n}return-1},j.prototype.addTab=function(t,e,n){typeof(e=e||{})=="function"&&(e={callback:e});var i=this,r=(t==null&&(t="rand_"+(1e6*Math.random()|0)),document.createElement("LI")),a=t.replace(/ /gi,"_"),o=(r.className="wtab wtab-"+a+" ",r.dataset.id=t,r.innerHTML="<span class='tabtitle'>"+(e.title||t)+"</span>",e.button&&(r.className+="button "),e.tab_className&&(r.className+=e.tab_className),e.bigicon&&(r.innerHTML="<img class='tabbigicon' src='"+e.bigicon+"'/>"+r.innerHTML),e.closable&&(r.innerHTML+="<span class='tabclose'>"+m.special_codes.close+"</span>",r.querySelector("span.tabclose").addEventListener("click",function(l){i.removeTab(t),l.preventDefault(),l.stopPropagation()},!0)),e.index!==void 0?(o=this.list.childNodes[e.index])?this.list.insertBefore(r,o):this.list.appendChild(r):this.plus_tab?this.list.insertBefore(r,this.plus_tab):this.list.appendChild(r),e.tab_width&&(r.style.width=e.tab_width.constructor===Number?e.tab_width.toFixed(0)+"px":e.tab_width,r.style.minWidth="0"),this.options.autoswitch&&(r.classList.add("autoswitch"),r.addEventListener("dragenter",function(l){i._timeout_mouseover&&clearTimeout(i._timeout_mouseover),i._timeout_mouseover=setTimeout(function(){m.trigger(this,"click"),i._timeout_mouseover=null}.bind(this),500)}),r.addEventListener("dragleave",function(l){i._timeout_mouseover&&(clearTimeout(i._timeout_mouseover),i._timeout_mouseover=null)})),document.createElement("div")),a=(e.id&&(o.id=e.id),o.className="wtabcontent wtabcontent-"+a+" "+(e.className||""),o.dataset.id=t,o.style.display="none",this.mode=="horizontal"?e.size&&(o.style.overflow="auto",e.size=="full"?(o.style.width="100%",o.style.height="calc( 100% - "+m.Tabs.tabs_height+"px )",o.style.height="-moz-calc( 100% - "+m.Tabs.tabs_height+"px )",o.style.height="-webkit-calc( 100% - "+m.Tabs.tabs_height+"px )"):o.style.height=e.size):this.mode=="vertical"&&e.size&&(o.style.overflow="auto",e.size=="full"?(o.style.height="100%",o.style.width="calc( 100% - "+m.Tabs.tabs_width+"px )",o.style.width="-moz-calc( 100% - "+m.Tabs.tabs_width+"px )",o.style.width="-webkit-calc( 100% - "+m.Tabs.tabs_width+"px )"):o.style.width=e.size),e.width!==void 0&&(o.style.width=typeof e.width=="string"?e.width:e.width+"px"),e.height!==void 0&&(o.style.height=typeof e.height=="string"?e.height:e.height+"px"),e.content&&(typeof e.content=="string"?o.innerHTML=e.content:o.appendChild(e.content)),this.root.appendChild(o),e.button?r.addEventListener("click",function(l){var p=this.dataset.id;e.callback&&e.callback(p,l)}):r.addEventListener("click",j.prototype.onTabClicked),r.options=e,r.tabs=this,r.querySelector("span.tabtitle")),s={id:t,tab:r,content:o,title:a,add:function(l){this.content.appendChild(l.root||l)},setTitle:function(l){this.title.innerHTML=l},click:function(){m.trigger(this.tab,"click")},destroy:function(){i.removeTab(this.id)}};return e.onclose&&(s.onclose=e.onclose),this.tabs[t]=s,this.recomputeTabsByIndex(),r.addEventListener("contextmenu",function(l){return l.button==2&&(l.preventDefault(),e.callback_context&&e.callback_context.call(s)),!1}.bind(this)),e.selected!=1&&this.selected!=null||this.selectTab(t,e.skip_callbacks),s},j.prototype.addPlusTab=function(t){this.plus_tab&&console.warn("There is already a plus tab created in this tab widget"),this.plus_tab=this.addTab("plus_tab",{title:"+",tab_width:20,button:!0,callback:t,skip_callbacks:!0})},j.prototype.addButtonTab=function(t,e,n){return this.addTab(t,{title:e,tab_width:20,button:!0,callback:n,skip_callbacks:!0})},j.prototype.onTabClicked=function(t){if(!this.classList.contains("selected")&&this.parentNode){var e=this.options,n=this.parentNode.parentNode.tabs;if(!n)throw"tabs not found";var i=n;if(!e.callback_canopen||e.callback_canopen()!=0){i.current_tab&&i.current_tab[0]!=r&&i.current_tab[2]&&i.current_tab[2].callback_leave&&i.current_tab[2].callback_leave(i.current_tab[0],i.current_tab[1],i.current_tab[2]);var r=this.dataset.id,o=null;for(l in i.tabs){var a=i.tabs[l];l==r?(a.selected=!0,a.content.style.display="",o=a.content):(delete a.selected,a.content.style.display="none")}for(var s=i.list.querySelectorAll("li.wtab"),l=0;l<s.length;++l)s[l].classList.remove("selected");this.classList.add("selected"),i.previous_tab=i.current_tab,i.current_tab=[r,o,e],t&&(e.callback&&e.callback(r,o,t),m.trigger(i,"wchange",[r,o]),i.onchange&&i.onchange(r,o)),i.selected=r}}},j.prototype.selectTab=function(t,e){if(t){t.constructor!=String&&(t=t.id);for(var n=this.list.querySelectorAll("li.wtab"),i=0;i<n.length;i++)if(t==n[i].dataset.id){this.onTabClicked.call(n[i],!e);break}}},j.prototype.setTabVisibility=function(t,e){t=this.tabs[t],t&&(t.tab.style.display=e?"none":null,t.content.style.display=e?"none":null)},j.prototype.recomputeTabsByIndex=function(){for(var t in this.tabs_by_index=[],this.tabs){for(var t=this.tabs[t],e=0,n=t.tab;(n=n.previousSibling)!=null;)e++;this.tabs_by_index[e]=t}},j.prototype.removeTab=function(t){var e=this.tabs[t];e?(e.onclose&&e.onclose(e),e.tab.parentNode&&e.tab.parentNode.removeChild(e.tab),e.content.parentNode&&e.content.parentNode.removeChild(e.content),delete this.tabs[t],this.recomputeTabsByIndex()):console.warn("tab not found: "+t)},j.prototype.removeAllTabs=function(t){var e,n=[];for(e in this.tabs)n.push(this.tabs[e]);for(e in n){var i=n[e];i==this.plus_tab&&t||(i.tab.parentNode&&i.tab.parentNode.removeChild(i.tab),i.content.parentNode&&i.content.parentNode.removeChild(i.content),delete this.tabs[i.id])}this.recomputeTabsByIndex()},j.prototype.clear=function(){this.removeAllTabs()},j.prototype.hideTab=function(t){this.setTabVisibility(t,!1)},j.prototype.showTab=function(t){this.setTabVisibility(t,!0)},j.prototype.transferTab=function(t,e,n){var i=this.tabs[t];if(i){e.tabs[t]=i,n!==void 0?e.list.insertBefore(i.tab,e.list.childNodes[n]):e.list.appendChild(i.tab),e.root.appendChild(i.content),delete this.tabs[t];var r,o=null;for(r in this.tabs){o=r;break}o&&this.selectTab(o),i.tab.classList.remove("selected"),e.selectTab(t)}},j.prototype.detachTab=function(t,e,n){if(this.tabs[t]){for(var i=this.getTabIndex(t),r=window.open("","","width=800, height=600, location=no, status=no, menubar=no, titlebar=no, fullscreen=yes"),o=(r.document.write("<head><title>"+t+"</title>"),document.querySelectorAll("link[rel='stylesheet'],style")),a=0;a<o.length;a++)r.document.write(o[a].outerHTML);r.document.write("</head><body></body>"),r.document.close();var s=this,l=new m.Tabs(null,this.options);return r.tabs=l,r.onbeforeunload=function(){l.transferTab(t,s,i),n&&n()},l.list.style.height="20px",r.document.body.appendChild(l.root),s.transferTab(t,l),l.tabs[t].tab.classList.add("selected"),this.recomputeTabsByIndex(),e&&e(),r}},S.INDENT=20,S.prototype.updateTree=function(t){this.root.innerHTML="",t=this.createAndInsert(t,this.options,null),t?(t.className+=" root_item",this.root_item=t):this.root_item=null},S.prototype.insertItem=function(t,e,n,i){e||(r=this.root.childNodes[0])&&(e=r.dataset.item_id);var r=this.createAndInsert(t,i,e,n);return e&&this._updateListBox(this._findElement(e)),r},S.prototype.createAndInsert=function(t,e,n,i){var r=-1,o=(n?r=this._findElementIndex(n):n===void 0&&(r=0),null),a=0,s=(r!=-1&&(o=this.root.childNodes[r],a=parseInt(o.dataset.level)+1),this.createTreeItem(t,e,a));if(s){if(s.parent_id=n,this.getItem(s.dataset.item_id)&&console.warn("There another item with the same ID in this tree"),r==-1?this.root.appendChild(s):this._insertInside(s,r,i),o&&!this._isNodeChildrenVisible(n)&&s.classList.add("hidden"),t.children)for(var l=0;l<t.children.length;++l)this.createAndInsert(t.children[l],e,t.id);return this._updateListBox(s,e,a),e&&e.selected&&this.markAsSelected(s,!0),s}},S.prototype._insertInside=function(t,e,n,a){var r=this.root.childNodes[e];if(!r)throw"No parent node found, index: "+e+", nodes: "+this.root.childNodes.length;var r=parseInt(r.dataset.level),o=a!==void 0?a:r+1,a=t.querySelector(".indentblock");a&&(a.style.paddingLeft=(o+this.indent_offset)*S.INDENT+"px"),t.dataset.level=o;for(var s=e+1;s<this.root.childNodes.length;++s){var l=this.root.childNodes[s];if(l.classList&&l.classList.contains("ltreeitem")){var p=parseInt(l.dataset.level);if(p==o&&n)n--;else if(p<o||n===0&&p===o)return void this.root.insertBefore(t,l)}}this.root.appendChild(t)},S.prototype._isNodeChildrenVisible=function(t){return t=this.getItem(t),!t||t.classList.contains("hidden")?!1:(t=t.querySelector(".listbox"),!t||t.getValue()!="closed")},S.prototype._findElement=function(t){if(!t||t.constructor!==String)throw"findElement param must be string with item id";for(var e=0;e<this.root.childNodes.length;++e){var n=this.root.childNodes[e];if(n.classList&&n.classList.contains("ltreeitem")&&n.classList.contains("ltreeitem-"+t))return n}return null},S.prototype._findElementIndex=function(t){for(var e=0;e<this.root.childNodes.length;++e){var n=this.root.childNodes[e];if(n.classList&&n.classList.contains("ltreeitem")){if(typeof t=="string"){if(n.dataset.item_id===t)return e}else if(n===t)return e}}return-1},S.prototype._findElementLastChildIndex=function(t){if(t!=-1)for(var e=parseInt(this.root.childNodes[t].dataset.level),n=t+1;n<this.root.childNodes.length;++n){var i=this.root.childNodes[n];if(i.classList&&i.classList.contains("ltreeitem")&&parseInt(i.dataset.level)==e)return n}return-1},S.prototype._findChildElements=function(t,e){if(t=this._findElementIndex(t),t!=-1){for(var n=this.root.childNodes[t],i=parseInt(n.dataset.level),r=[],o=t+1;o<this.root.childNodes.length;++o){var a=this.root.childNodes[o];if(a.classList&&a.classList.contains("ltreeitem")){var s=parseInt(a.dataset.level);if(!(e&&i+1<s)){if(s<=i)return r;r.push(a)}}}return r}},S.prototype.createTreeItem=function(t,e,n){if(t!=null){e=e||this.options;var i=document.createElement("li"),r=(i.className="ltreeitem",this);if(t.id&&(e=t.id.replace(/\s/g,"_"),i.className+=" ltreeitem-"+e,i.dataset.item_id=t.id),t.dataset)for(var o in t.dataset)i.dataset[o]=t.dataset[o];(t.DOM=i).data=t,n!==void 0&&(i.dataset.level=n,i.classList.add("ltree-level-"+n));var a=document.createElement("div"),e=(a.className="ltreeitemtitle",t.className&&(a.className+=" "+t.className),a.innerHTML="<span class='precontent'></span><span class='indentblock'></span><span class='collapsebox'></span><span class='incontent'></span><span class='postcontent'></span>",t.content||t.id||"");if(a.querySelector(".incontent").innerHTML=e,t.precontent&&(a.querySelector(".precontent").innerHTML=t.precontent),t.postcontent&&(a.querySelector(".postcontent").innerHTML=t.postcontent),t.dataset)for(var o in t.dataset)i.dataset[o]=t.dataset[o];i.appendChild(a),i.title_element=a,t.visible===!1&&(i.style.display="none");var n=i,e=(n.addEventListener("click",function(u){u.preventDefault(),u.stopPropagation();var d=this,f=d.title_element;if(!f._editing){if(u.ctrlKey&&r.options.allow_multiselection){if(r.isNodeSelected(d))return d.classList.remove("selected"),m.trigger(r,"item_remove_from_selection",{item:d,data:d.data}),void m.trigger(r.root,"item_remove_from_selection",{item:d,data:d.data});r.markAsSelected(d,!0),m.trigger(r,"item_add_to_selection",{item:d,data:d.data}),m.trigger(r.root,"item_add_to_selection",{item:d,data:d.data});var h=!1;!(h=t.callback?t.callback.call(r,d):h)&&r.onItemAddToSelection&&r.onItemAddToSelection(d.data,d)}if(u.shiftKey&&r.options.allow_multiselection){if(f=r.getSelectedItem(),f&&f!==d)for(var u=Array.prototype.slice.call(f.parentNode.children),f=u.indexOf(f),g=u.indexOf(d),b=f<g?u.slice(f,g):u.slice(g,f),y=0;y<b.length;++y){var w=b[y];r.markAsSelected(w,!0),m.trigger(r,"item_add_to_selection",{item:w,data:w.data}),m.trigger(r.root,"item_add_to_selection",{item:w,data:w.data})}}else r.markAsSelected(d),r._skip_scroll=!0,m.trigger(r,"item_selected",{item:d,data:d.data}),m.trigger(r.root,"item_selected",{item:d,data:d.data}),h=!1,!(h=t.callback?t.callback.call(r,d):h)&&r.onItemSelected&&r.onItemSelected(d.data,d),r._skip_scroll=!1}}),n.addEventListener("dblclick",function(u){var d=this,f=d.title_element.querySelector(".incontent");{var h;m.trigger(r,"item_dblclicked",d),m.trigger(r.root,"item_dblclicked",d),!f._editing&&r.options.allow_rename&&(f._editing=!0,f._old_name=f.innerHTML,(h=f).innerHTML="<input type='text' value='"+f.innerHTML+"' />",(f=f.querySelector("input")).addEventListener("blur",function(g){var b=g.target.value;setTimeout(function(){h.innerHTML=b},1),delete h._editing,m.trigger(r.root,"item_renamed",{old_name:h._old_name,new_name:b,item:d,data:d.data}),delete h._old_name}),f.addEventListener("keydown",function(g){g.keyCode==13&&this.blur()}),f.focus(),u.preventDefault())}u.preventDefault(),u.stopPropagation()}),n.addEventListener("contextmenu",function(u){if(u.preventDefault(),u.stopPropagation(),u.button==2)return!!r.onItemContextMenu&&r.onItemContextMenu(u,{item:this,data:this.data})}),a),s=(this.options.allow_drag&&(e.draggable=!0,e.addEventListener("dragstart",function(u){if(u.dataTransfer.setData("item_id",this.parentNode.dataset.item_id),t.onDragData){var d=t.onDragData();if(d)for(var f in d)u.dataTransfer.setData(f,d[f])}})),0);return e.addEventListener("dragenter",function(u){if(u.preventDefault(),t.skipdrag)return!1;s==0&&a.classList.add("dragover"),s++}),e.addEventListener("dragleave",function(u){u.preventDefault(),--s==0&&a.classList.remove("dragover")}),e.addEventListener("dragover",function(u){u.preventDefault()}),e.addEventListener("drop",function(u){if(a.classList.remove("dragover"),u.preventDefault(),t.skipdrag)return!1;var d,f=u.dataTransfer.getData("item_id");f?(d=this.parentNode.dataset.item_id,(!r.onMoveItem||r.onMoveItem&&r.onMoveItem(r.getItem(f),r.getItem(d))!=0)&&r.moveItem(f,d)&&m.trigger(r.root,"item_moved",{item:r.getItem(f),parent_item:r.getItem(d)})):m.trigger(r.root,"drop_on_item",{item:this,event:u}),r.onDropItem&&r.onDropItem(u,this.parentNode.data)}),i}console.error("Tree item cannot be null")},S.prototype.filterByName=function(t){for(var e=0;e<this.root.childNodes.length;++e){var n,i=this.root.childNodes[e];i.classList&&i.classList.contains("ltreeitem")&&(n=i.querySelector(".incontent"))&&(n=n.innerHTML.toLowerCase(),t&&n.indexOf(t.toLowerCase())==-1?i.classList.add("filtered"):(i.data&&i.data.visible!==!1&&i.classList.remove("filtered"),(n=i.querySelector(".indentblock"))&&(n.style.paddingLeft=t?0:paddingLeft=(parseInt(i.dataset.level)+this.indent_offset)*S.INDENT+"px")))}},S.prototype.filterByRule=function(t,e){if(!t)throw"filterByRule requires a callback";for(var n=0;n<this.root.childNodes.length;++n){var i,r=this.root.childNodes[n];r.classList&&r.classList.contains("ltreeitem")&&(i=r.querySelector(".incontent"))&&(t(r.data,i,e)?(r.data&&r.data.visible!==!1&&r.classList.remove("filtered"),(i=r.querySelector(".indentblock"))&&(name?i.style.paddingLeft=0:i.style.paddingLeft=paddingLeft=(parseInt(r.dataset.level)+this.indent_offset)*m.Tree.INDENT+"px")):r.classList.add("filtered"))}},S.prototype.getItem=function(t){if(t){if(t.classList)return t;for(var e=0;e<this.root.childNodes.length;++e){var n=this.root.childNodes[e];if(n.classList&&n.classList.contains("ltreeitem")&&n.dataset.item_id===t)return n}}return null},S.prototype.expandItem=function(n,e){var n=this.getItem(n);n&&n.listbox&&(n.listbox.setValue(!0),e&&(n=this.getParent(n))&&this.expandItem(n,e))},S.prototype.collapseItem=function(t){t=this.getItem(t),t&&t.listbox&&listbox.setValue(!1)},S.prototype.isInsideArea=function(t){if(t=t.constructor===String?this.getItem(t):t,!t)return!1;var e=this.root.getClientRects();return e.length?(e=e[0].height,t=t.offsetTop,this.root.scrollTop<t&&t<this.root.scrollTop+e):!1},S.prototype.scrollToItem=function(o){var e,n,i,r,o=o.constructor===String?this.getItem(o):o;o&&(e=this.root.parentNode)&&(n=e.getBoundingClientRect())&&(i=n.height,r=(parseInt(o.dataset.level)+this.indent_offset)*S.INDENT+50,e.scrollTop=o.offsetTop-.5*i|0,.75*n.width<r?e.scrollLeft=r:e.scrollLeft=0)},S.prototype.setSelectedItem=function(t,e,n){{if(t)return(t=this.getItem(t))?t.classList.contains("selected")?void 0:(this.markAsSelected(t),e&&!this._skip_scroll&&this.scrollToItem(t),this.expandItem(t,!0),n&&m.trigger(t,"click"),t):null;this.unmarkAllAsSelected()}},S.prototype.addItemToSelection=function(t){if(t)return t=this.getItem(t),t?(this.markAsSelected(t,!0),t):null},S.prototype.removeItemFromSelection=function(t){if(t)return t=this.getItem(t),t?void t.classList.remove("selected"):null},S.prototype.getSelectedItem=function(){return this.root.querySelector(".ltreeitem.selected")},S.prototype.getSelectedItems=function(){return this.root.querySelectorAll(".ltreeitem.selected")},S.prototype.isItemSelected=function(t){return t=this.getItem(t),!!t&&this.isNodeSelected(t)},S.prototype.getChildren=function(t,e){return t&&t.constructor!==String&&t.dataset&&(t=t.dataset.item_id),this._findChildElements(t,e)},S.prototype.getParent=function(t){return t=this.getItem(t),t?this.getItem(t.parent_id):null},S.prototype.getAncestors=function(t,e){return e=e||[],t=this.getItem(t),t?(e.push(t),this.getAncestors(t.parent_id,e)):e},S.prototype.isAncestor=function(i,e){if(i=this.getItem(i),!i)return!1;var n=this.getItem(e),i=this.getItem(i.parent_id);return!!i&&(i==n||this.isAncestor(i,e))},S.prototype.moveItem=function(n,e){if(n===e)return!1;var n=this.getItem(n),i=this.getItem(e);if(this.isAncestor(i,n))return!1;this._findElementIndex(i);var r=parseInt(i.dataset.level),o=this.getParent(n);if(!o)return console.error("node parent not found by id, maybe id has changed"),!1;var a=r-parseInt(o.dataset.level);if(!i||!n||i==o)return!1;n.parent_id=e;var s=this.getChildren(n);if(s){s.unshift(n);for(var l=0;l<s.length;l++)s[l].parentNode.removeChild(s[l]);for(l=0;l<s.length;l++){var p=s[l],u=parseInt(p.dataset.level)+a;p.dataset.level=u}var d=this._findElementIndex(i),f=this._findElementLastChildIndex(d);for(f==-1&&(f=0),l=0;l<s.length;l++)p=s[l],this._insertInside(p,d,f+l-1,parseInt(p.dataset.level))}return this._updateListBox(i),o&&this._updateListBox(o),!0},S.prototype.removeItem=function(i,e){var n=i;if(!(n=typeof i=="string"?this.getItem(i):n))return!1;var i=this.getParent(n),r=null;if(e&&(r=this.getChildren(n)),this.root.removeChild(n),r)for(var o=0;o<r.length;o++)this.root.removeChild(r[o]);return i&&this._updateListBox(i),!0},S.prototype.updateItem=function(t,e){return t=this.getItem(t),!!t&&((t.data=e).id&&(t.id=e.id),e.content&&(t.title_element.querySelector(".incontent").innerHTML=e.content),!0)},S.prototype.updateItemId=function(t,e){var n=this.getItem(t);if(!n)return!1;var i=this.getChildren(t,!0);n.id=e;for(var r=0;r<i.length;++r)i[r].parent_id=e;return!0},S.prototype.clear=function(t){if(t)for(var e=this.root.querySelectorAll(".ltreeitem"),n=1;n<e.length;n++){var i=e[n];this.root.removeChild(i)}else this.root.innerHTML=""},S.prototype.getNodeByIndex=function(t){return this.root.querySelectorAll(".ltreeitem")[t]},S.prototype.unmarkAllAsSelected=function(){this.root.classList.remove("selected");var t=this.root.querySelectorAll(".ltreeitem.selected");if(t)for(var e=0;e<t.length;e++)t[e].classList.remove("selected");for(var n=this.root.querySelectorAll(".ltreeitem.semiselected"),e=0;e<n.length;e++)n[e].classList.remove("semiselected")},S.prototype.isNodeSelected=function(t){return!!t.classList.contains("selected")},S.prototype.markAsSelected=function(t,e){if(!t.classList.contains("selected")){e||this.unmarkAllAsSelected(),t.classList.add("selected");for(var n=this.getParent(t),i=[];n&&i.indexOf(n)==-1;)n.classList.add("semiselected"),i.push(n),n=this.getParent(n)}},S.prototype._updateListBox=function(t,e,n){var i,r,o;t&&(i=this,t.listbox||(o=t.title_element.querySelector(".collapsebox"),(r=m.createLitebox(!0,function(a){i.onClickBox(a,t),m.trigger(i.root,"item_collapse_change",{item:t,data:r.getValue()})})).stopPropagation=!0,r.setEmpty(!0),o.appendChild(r),t.listbox=r),(e&&e.collapsed||n>=this.collapsed_depth)&&t.listbox.collapse(),(o=this.getChildren(t.dataset.item_id))&&(o.length?t.listbox.setEmpty(!1):t.listbox.setEmpty(!0)))},S.prototype.onClickBox=function(t,e){var n=this.getChildren(e);if(n)for(var i=0;i<n.length;++i){var r=n[i],o=this.getParent(r),a=!0;(a=o?this._isNodeChildrenVisible(o):a)?r.classList.remove("hidden"):r.classList.add("hidden")}},Fn.prototype.setValue=function(t){this.input.value=t,this.input.onchange()},Fn.prototype.getValue=function(){return this.input.value},ye.prototype.addItem=function(t,e,n){var i=this,r=(n=n||{},document.createElement("div")),o=!(r.className="litemenu-entry submenu");function a(s){var l=this.value,p=!0;if(i.current_submenu&&i.current_submenu.close(s),n.callback&&n.callback.call(i,l,n,s)===!0&&(p=!1),l&&(l.callback&&!n.ignore_item_callbacks&&l.disabled!==!0&&l.callback.call(this,l,n,s,i)===!0&&(p=!1),l.submenu)){if(!l.submenu.options)throw"ContextMenu submenu needs options";new m.ContextMenu(l.submenu.options,{callback:l.submenu.callback,event:s,parentMenu:i,ignore_item_callbacks:l.submenu.ignore_item_callbacks,title:l.submenu.title,autoopen:n.autoopen}),p=!1}p&&!i.lock&&i.close()}return e===null?r.classList.add("separator"):(r.innerHTML=e&&e.title?e.title:t,(r.value=e)&&(e.disabled&&(o=!0,r.classList.add("disabled")),(e.submenu||e.has_submenu)&&r.classList.add("has_submenu")),typeof e=="function"?(r.dataset.value=t,r.onclick_callback=e):r.dataset.value=e),this.root.appendChild(r),o||r.addEventListener("click",a),n.autoopen&&r.addEventListener("mouseenter",function(s){var l=this.value;l&&l.has_submenu&&a.call(this,s)}),r},ye.prototype.close=function(t,e){this.root.parentNode&&this.root.parentNode.removeChild(this.root),this.parentMenu&&!e&&(this.parentMenu.lock=!1,this.parentMenu.current_submenu=null,t===void 0?this.parentMenu.close():t&&!m.isCursorOverElement(t,this.parentMenu.root)&&m.trigger(this.parentMenu.root,"mouseleave",t)),this.current_submenu&&this.current_submenu.close(t,!0),this.root.closing_timer&&clearTimeout(this.root.closing_timer)},ye.prototype.getTopMenu=function(){return this.options.parentMenu?this.options.parentMenu.getTopMenu():this},ye.prototype.getFirstEvent=function(){return this.options.parentMenu?this.options.parentMenu.getFirstEvent():this.options.event},Bn.prototype.getSelectedItem=function(){return this.root.querySelector(".list-item.selected")},Bn.prototype.setSelectedItem=function(t){for(var e=this.root.querySelectorAll(".list-item"),n=0;n<e.length;n++){var i=e[n];if(i.data==t){m.trigger(i,"click");break}}},_e.prototype.addTitle=function(t){return t=m.createElement("div",".listtitle",t),this.root.appendChild(t),t},_e.prototype.addHTML=function(t,e){return t=m.createElement("div",".listtext",t),e&&t.addEventListener("mousedown",e),this.root.appendChild(t),t},_e.prototype.clear=function(){this.root.innerHTML=""},_e.prototype.addItem=function(t,r,n,i){var r=r||t.content||t.name,o=m.createListItem(this.item_code,{".title":r}),a=(o.item=t,n&&o.classList.add("enabled"),i||(o.querySelector(".trash").style.display="none"),this);return o.addEventListener("mousedown",function(s){s.preventDefault(),this.setSelected(!0),a.onItemSelected&&a.onItemSelected(t,o)}),o.querySelector(".tick").addEventListener("mousedown",function(s){s.preventDefault(),o.classList.toggle("enabled"),a.onItemToggled&&a.onItemToggled(t,o,o.classList.contains("enabled"))}),o.querySelector(".trash").addEventListener("mousedown",function(s){s.preventDefault(),s.stopPropagation(),s.stopImmediatePropagation(),a.onItemRemoved&&a.onItemRemoved(t,o)}),o.setContent=function(s,l){l?o.querySelector(".title").innerHTML=s:o.querySelector(".title").innerText=s},o.toggleEnabled=function(s){o.classList.toggle("enabled")},o.setSelected=function(s){m.removeClass(a.root,"selected"),s?this.classList.add("selected"):this.classList.remove("selected"),a.selected=o.item},o.show=function(){this.style.display=""},o.hide=function(){this.style.display="none"},this.root.appendChild(o),o},window.beautifyCode=H_;const K={Area:B,Consoel:Yt,Dialog:N,Dragger:Be,Inspector:_,Menu:_t,Panel:ve,Split:us,Table:Xt,Tabs:j,Tree:S,SearchBox:Fn,ContextMenu:ye,Checkbox:Y_,List:Bn,LineEditor:Z_,Slider:X_,ComplexList:_e,createLitebox:J_,root:null,content:null,panels:{},windows:[],undo_steps:[],modalbg_div:null,mainmenu:null,init:function(t){(t=t||{}).width&&t.height&&this.setWindowSize(t.width,t.height),this.container=null,t.container&&(this.container=document.getElementById(t.container)),this.container||(this.container=document.body),t.wrapped?((e=document.createElement("div")).style.position="relative",e.style.overflow="hidden",this.root=e,this.container.appendChild(e),e=document.createElement("div"),this.content=e,this.root.appendChild(e),this.root.classList.contains("fullscreen")&&window.addEventListener("resize",function(n){K.maximizeWindow()})):this.root=this.content=this.container,this.root.className="litegui-wrap fullscreen",this.content.className="litegui-maincontent";var e=this.modalbg_div=document.createElement("div");this.modalbg_div.className="litemodalbg",this.root.appendChild(this.modalbg_div),e.style.display="none",t.menubar&&this.createMenu(),t.gui_callback&&t.gui_callback(),window.addEventListener("beforeunload",function(n){for(var i in K.windows)K.windows[i].close();K.windows=[]})},trigger:function(t,e,n,i){var r=document.createEvent("CustomEvent");return r.initCustomEvent(e,!0,!0,n),t.dispatchEvent?t.dispatchEvent(r):t.__events&&t.__events.dispatchEvent(r),r},bind:function(t,e,n){if(!t)throw"Cannot bind to null";if(!e)throw"Event bind missing";if(!n)throw"Bind callback missing";if((t=t.constructor===String?document.querySelectorAll(t):t).constructor===NodeList||t.constructor===Array)for(var i=0;i<t.length;++i)r(t[i]);else r(t);function r(o){var a;o.addEventListener?o.addEventListener(e,n):(o.__events||((a=document.createElement("span")).widget=o,Object.defineProperty(o,"__events",{enumerable:!1,configurable:!1,writable:!1,value:a})),o.__events.addEventListener(e,n))}},unbind:function(t,e,n){t.removeEventListener?t.removeEventListener(e,n):t.__events&&t.__events.removeEventListener&&t.__events.removeEventListener(e,n)},removeClass:function(t,e,n){n||(e="."+(n=e));for(var i=(t||document).querySelectorAll(e),r=0;r<i.length;++r)i[r].classList.remove(n)},add:function(t){this.content.appendChild(t.root||t)},remove:function(t){if(t){if(t.constructor===String)for(var e=document.querySelectorAll(t),n=0;n<e.length;++n)(t=e[n])&&t.parentNode&&t.parentNode.removeChild(t);if(t.constructor===Array||t.constructor===NodeList)for(n=0;n<t.length;++n)K.remove(t[n]);else t.root&&t.root.parentNode?t.root.parentNode.removeChild(t.root):t.parentNode&&t.parentNode.removeChild(t)}},getById:function(t){return document.getElementById(t)},createMenu:function(){this.menubar=new K.Menu("mainmenubar"),this.add(this.menubar)},setWindowSize:function(t,e){var n=this.root.style;if(t&&e)n.width=t+"px",n.height=e+"px",n.boxShadow="0 0 4px black",this.root.classList.remove("fullscreen");else{if(this.root.classList.contains("fullscreen"))return;this.root.classList.add("fullscreen"),n.width="100%",n.height="100%",n.boxShadow="0 0 0"}K.trigger(K,"resized")},maximizeWindow:function(){this.setWindowSize()},setCursor:function(t){this.root.style.cursor=t},isCursorOverElement:function(i,r){var n=i.pageX,i=i.pageY,r=r.getBoundingClientRect();return!!r&&i>r.top&&i<r.top+r.height&&n>r.left&&n<r.left+r.width},getRect:function(t){return t.getBoundingClientRect()},toClipboard:function(t,e){t&&t.constructor!==String&&(t=JSON.stringify(t));var n,i=null;if(!e)try{document.queryCommandSupported("copy"),(i=document.createElement("input")).type="text",i.style.opacity=0,i.value=t,document.body.appendChild(i),i.select(),n=document.execCommand("copy"),console.log(n?"saved to clipboard":"problem saving to clipboard"),document.body.removeChild(i)}catch{i&&document.body.removeChild(i),console.warn("Oops, unable to copy using the true clipboard")}try{this._safe_cliboard=null,localStorage.setItem("litegui_clipboard",t)}catch{this._safe_cliboard=t,console.warn("cliboard quota excedeed")}},getLocalClipboard:function(){var t=localStorage.getItem("litegui_clipboard");return(t=!t&&this._safe_cliboard?this._safe_cliboard:t)?t[0]=="{"?JSON.parse(t):t:null},addCSS:function(t){if(t)if(t.constructor===String){var e=document.createElement("style");e.type="text/css",e.innerHTML=t,document.getElementsByTagName("head")[0].appendChild(e)}else for(var n in t)document.body.style[n]=t[n]},requireCSS:function(t,e){for(typeof t=="string"&&(t=[t]);t.length;){var n=document.createElement("link");n.rel="stylesheet",n.type="text/css",n.href=t.shift(1),n.media="all",document.getElementsByTagName("head")[0].appendChild(n),t.length==0&&(n.onload=e)}},request:function(t){var e=t.dataType||"text",n=(e=="json"||e=="xml"?e="text":e=="binary"&&(e="arraybuffer",t.mimeType="application/octet-stream"),new XMLHttpRequest),i=(n.open(t.data?"POST":"GET",t.url,!0),e&&(n.responseType=e),t.mimeType&&n.overrideMimeType(t.mimeType),t.nocache&&n.setRequestHeader("Cache-Control","no-cache"),n.onload=function(o){var a,s=this.response;if(this.status!=200)a="Error "+this.status,t.error&&t.error(a),LEvent.trigger(n,"fail",this.status);else{if(t.dataType=="json")try{s=JSON.parse(s)}catch(l){if(!t.error)throw l;t.error(l)}else if(t.dataType=="xml")try{s=new DOMParser().parseFromString(s,"text/xml")}catch(l){if(!t.error)throw l;t.error(l)}t.success&&t.success.call(this,s,this)}},n.onerror=function(o){t.error&&t.error(o)},new FormData);if(t.data)for(var r in t.data)i.append(r,t.data[r]);return n.send(i),n},requestText:function(t,e,n){return this.request({url:t,dataType:"text",success:e,error:n})},requestJSON:function(t,e,n){return this.request({url:t,dataType:"json",success:e,error:n})},requestBinary:function(t,e,n){return this.request({url:t,dataType:"binary",success:e,error:n})},requireScript:function(t,e,n,i,r){if(!t)throw"invalid URL";var o,a=(t=t.constructor===String?[t]:t).length,s=[];for(o in t){var l=document.createElement("script");l.num=o,l.type="text/javascript",l.src=t[o]+(r?"?version="+r:""),l.original_src=t[o],l.async=!1,l.onload=function(p){a--,s.push(this),a?i&&i(this.original_src,this.num):e&&e(s)},n&&(l.onerror=function(p){n(p,this.original_src,this.num)}),document.getElementsByTagName("head")[0].appendChild(l)}},requireScriptSerial:function(t,e,n){typeof t=="string"&&(t=[t]);var i=[];(function r(){var o=document.createElement("script");o.type="text/javascript",o.src=t.shift(1),o.onload=function(a){t.length?(n&&n(t[0],t.length),r()):(i.push(this),e&&e(i))},document.getElementsByTagName("head")[0].appendChild(o)})()},newDiv:function(t,e){return this.createElement("div",t,e)},createElement:function(t,e,n,i,r){var o=document.createElement(t);if(e)for(var a=e.split(" "),s=0;s<a.length;s++)a[s][0]=="."?o.classList.add(a[s].substr(1)):a[s][0]=="#"?o.id=a[s].substr(1):o.id=a[s];if(o.root=o,n&&(o.innerHTML=n),o.add=function(l){this.appendChild(l.root||l)},i)if(i.constructor===String)o.setAttribute("style",i);else for(var s in i)o.style[s]=i[s];if(r)for(var s in r)o.addEventListener(s,r[s]);return o},createListItem:function(t,e,n){var i=document.createElement("span");if(i.innerHTML=t,i=i.childNodes[0],e)for(var r in e){var o=i.querySelector(r);o&&(o.innerText=e[r])}if(n)for(var r in n)i.style[r]=n[r];return i},createButton:function(t,e,n,i){var r=document.createElement("button");if(r.className="litegui litebutton button",t)for(var o=t.split(" "),a=0;a<o.length;a++)o[a][0]=="."?r.classList.add(o[a].substr(1)):o[a][0]=="#"?r.id=o[a].substr(1):r.id=o[a];if(r.root=r,e!==void 0&&(r.innerHTML=e),n&&r.addEventListener("click",n),i)if(i.constructor===String)r.setAttribute("style",i);else for(var a in i)r.style[a]=i[a];return r},getParents:function(t){for(var e=[];(t=t.parentElement)!==null;)t.nodeType===Node.ELEMENT_NODE&&e.push(elem);return e},newWindow:function(t,e,n,i){i=i||{};for(var r=window.open("","","width="+e+", height="+n+", location=no, status=no, menubar=no, titlebar=no, fullscreen=yes"),o=(r.document.write("<html><head><title>"+t+"</title>"),document.querySelectorAll("link[rel='stylesheet'],style")),a=0;a<o.length;a++)r.document.write(o[a].outerHTML);if(i.scripts)for(var s=document.querySelectorAll("script"),a=0;a<s.length;a++)s[a].src&&r.document.write(s[a].outerHTML);return e=i.content||"",r.document.write("</head><body>"+e+"</body></html>"),r.document.close(),r},showModalBackground:function(t){K.modalbg_div&&(K.modalbg_div.style.display=t?"block":"none")},showMessage:function(t,e){return(e=e||{}).title=e.title||"Attention",e.content=t,e.close="fade",t=new K.Dialog(e),e.noclose||t.addButton("Close",{close:!0}),t.makeModal("fade"),t},popup:function(t,e){return(e=e||{}).min_height=140,e.content=t=typeof t=="string"?"<p>"+t+"</p>":t,e.close="fade",t=new K.Dialog(e),e.noclose||t.addButton("Close",{close:!0}),t.show(),t},alert:function(t,e){return(e=e||{}).className="alert",e.title=e.title||"Alert",e.width=e.width||280,e.height=e.height||140,typeof t=="string"&&(t="<p>"+t+"</p>"),K.remove(".litepanel.alert"),K.showMessage(t,e)},confirm:function(t,e,n){(n=n||{}).className="alert",n.title=n.title||"Confirm",n.width=n.width||280,typeof t=="string"&&(t="<p>"+t+"</p>"),t+="<button class='litebutton' data-value='yes' style='width:45%; margin-left: 10px'>Yes</button><button class='litebutton' data-value='no' style='width:45%'>No</button>",n.noclose=!0;for(var i=this.showMessage(t,n),r=(i.content.style.paddingBottom="10px",i.content.querySelectorAll("button")),o=0;o<r.length;o++)r[o].addEventListener("click",a);function a(s){s=this.dataset.value=="yes",i.close(),e&&e(s)}return r[0].focus(),i},prompt:function(t,e,n){(n=n||{}).className="alert",n.title=n.title||"Prompt",n.width=n.width||280,typeof t=="string"&&(t="<p>"+t+"</p>");for(var i=n.value||"",r="<input type='text' value='"+i+"'/>",o=(t+="<p>"+(r=n.textarea?"<textarea class='textfield' style='width:95%'>"+i+"</textarea>":r)+"</p><button class='litebutton' data-value='accept' style='width:45%; margin-left: 10px; margin-bottom: 10px'>Accept</button><button class='litebutton' data-value='cancel' style='width:45%'>Cancel</button>",n.noclose=!0,this.showMessage(t,n)),a=o.content.querySelectorAll("button"),s=0;s<a.length;s++)a[s].addEventListener("click",p);var l=o.content.querySelector("input,textarea");function p(){var u=l.value;this.dataset&&this.dataset.value=="cancel"&&(u=null),o.close(),e&&e(u)}return l.addEventListener("keydown",function(u){if(u=u||window.event,u=u.keyCode||u.which,u=="13")return p(),!1;u=="29"&&o.close()},!0),l.focus(),o},choice:function(t,e,n,i){for(var r in(i=i||{}).className="alert",i.title=i.title||"Select one option",i.width=i.width||280,typeof t=="string"&&(t="<p>"+t+"</p>"),e)t+="<button class='litebutton' data-value='"+r+"' style='width:45%; margin-left: 10px'>"+(e[r].content||e[r])+"</button>";i.noclose=!0;for(var o=this.showMessage(t,i),a=(o.content.style.paddingBottom="10px",o.content.querySelectorAll("button")),r=0;r<a.length;r++)a[r].addEventListener("click",s);function s(l){l=e[this.dataset.value],o.close(),n&&n(l)}return o},downloadURL:function(t,e){var n=document.createElement("a");n.href=t,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n)},downloadFile:function(t,e,n){var i,r;e?(n=n||(e.constructor===String?"text/plain":"application/octet-stream"),i=null,i=e.constructor!==File&&e.constructor!==Blob?new Blob([e],{type:n}):e,r=URL.createObjectURL(i),(n=document.createElement("a")).setAttribute("href",r),n.setAttribute("download",t),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n),setTimeout(function(){URL.revokeObjectURL(r)},6e4)):console.warn("No file provided to download")},getUrlVars:function(){for(var t,e=[],n=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),i=0;i<n.length;i++)t=n[i].split("="),e.push(t[0]),e[t[0]]=t[1];return e},getUrlVar:function(t){return K.getUrlVars()[t]},focus:function(t){t.focus()},blur:function(t){t.blur()},draggable:function(t,e,n,i,r){(e=e||t).addEventListener("mousedown",function u(d){if(d.type=="mousedown")return s||(s=t.getClientRects()[0],l=s?s.left:0,p=s?s.top:0),r&&r(t,d)==0?(d.stopPropagation(),d.preventDefault()):(o=d.clientX,a=d.clientY,document.addEventListener("mousemove",u),document.addEventListener("mouseup",u),n&&n(t,d),d.stopPropagation(),d.preventDefault()),!1;if(d.type=="mouseup")return document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",u),void(i&&i(t,d));{var f,h;d.type=="mousemove"&&(f=d.clientX-o,h=d.clientY-a,o=d.clientX,a=d.clientY,l+=f,p+=h,t.style.left=l+"px",t.style.top=p+"px")}}),e.style.cursor="move";var o=0,a=0,s=t.getClientRects()[0],l=s?s.left:0,p=s?s.top:0;t.style.position="absolute",t.style.left=l+"px",t.style.top=p+"px"},cloneObject:function(t,e){var n,i=e||{};for(n in t)if(n[0]!="_"&&n.substr(0,6)!="jQuery"){var r=t[n];if(r==null)i[n]=null;else if(!Tt(r))if(typeof r=="number"||typeof r=="string")i[n]=r;else if(r.constructor==Float32Array)i[n]=Array.apply([],r);else if(E(r))i[n]&&i[n].constructor==Float32Array?i[n].set(r):i[n]=JSON.parse(JSON.stringify(r));else try{i[n]=JSON.parse(JSON.stringify(r))}catch(o){console.error(o)}}return i},safeName:function(t){return String(t).replace(/[\s\.]/g,"")},special_codes:{close:"&#10005;",navicon:"&#9776;",refresh:"&#8634;",gear:"&#9881;",open_folder:"&#128194;",download:"&#11123;",tick:"&#10003;",trash:"&#128465;"},htmlEncode:function(t){var e=document.createElement("div");return e.innerHTML=t,e.innerText},htmlDecode:function(t){var e=document.createElement("div");return e.innerText=t,e.innerHTML},sizeToCSS:function(t){return t==null?null:t.constructor===String?t:0<=t?(0|t)+"px":"calc( 100% - "+Math.abs(0|t)+"px )"},getElementWindow:function(t){return t=t.ownerDocument,t.defaultView||t.parentWindow},createDropArea:function(t,e,n,i){function r(a){t.addEventListener("dragexit",r),t.addEventListener("dragover",r),t.addEventListener("drop",o),a.stopPropagation(),a.preventDefault(),a.type=="dragenter"&&n&&n(a,this),a.type=="dragexit"&&i&&i(a,this)}function o(a){a.stopPropagation(),a.preventDefault(),t.removeEventListener("dragexit",r),t.removeEventListener("dragover",r),t.removeEventListener("drop",o);var s=void 0;if(s=e?e(a):s)return a.stopPropagation(),a.stopImmediatePropagation(),!0}t.addEventListener("dragenter",r)}};Object.defineProperty(String.prototype,"template",{value:function(t,e){for(var n,o=this,i=/{{([^}}]+)?}}/g;n=i.exec(o);)var r=e?new Function("with(this) { try { return "+n[1]+"} catch(e) { return 'error';} }").call(t):t[n[1]],o=o.replace(n[0],r);return o},enumerable:!1}),window.escapeHtmlEntities===void 0&&(window.escapeHtmlEntities=function(t){return t.replace(/[\u00A0-\u2666<>\&]/g,function(e){return"&"+(escapeHtmlEntities.entityTable[e.charCodeAt(0)]||"#"+e.charCodeAt(0))+";"})},escapeHtmlEntities.entityTable={34:"quot",38:"amp",39:"apos",60:"lt",62:"gt",160:"nbsp",161:"iexcl",162:"cent",163:"pound",164:"curren",165:"yen",166:"brvbar",167:"sect",168:"uml",169:"copy",170:"ordf",171:"laquo",172:"not",173:"shy",174:"reg",175:"macr",176:"deg",177:"plusmn",178:"sup2",179:"sup3",180:"acute",181:"micro",182:"para",183:"middot",184:"cedil",185:"sup1",186:"ordm",187:"raquo",188:"frac14",189:"frac12",190:"frac34",191:"iquest",192:"Agrave",193:"Aacute",194:"Acirc",195:"Atilde",196:"Auml",197:"Aring",198:"AElig",199:"Ccedil",200:"Egrave",201:"Eacute",202:"Ecirc",203:"Euml",204:"Igrave",205:"Iacute",206:"Icirc",207:"Iuml",208:"ETH",209:"Ntilde",210:"Ograve",211:"Oacute",212:"Ocirc",213:"Otilde",214:"Ouml",215:"times",216:"Oslash",217:"Ugrave",218:"Uacute",219:"Ucirc",220:"Uuml",221:"Yacute",222:"THORN",223:"szlig",224:"agrave",225:"aacute",226:"acirc",227:"atilde",228:"auml",229:"aring",230:"aelig",231:"ccedil",232:"egrave",233:"eacute",234:"ecirc",235:"euml",236:"igrave",237:"iacute",238:"icirc",239:"iuml",240:"eth",241:"ntilde",242:"ograve",243:"oacute",244:"ocirc",245:"otilde",246:"ouml",247:"divide",248:"oslash",249:"ugrave",250:"uacute",251:"ucirc",252:"uuml",253:"yacute",254:"thorn",255:"yuml",402:"fnof",913:"Alpha",914:"Beta",915:"Gamma",916:"Delta",917:"Epsilon",918:"Zeta",919:"Eta",920:"Theta",921:"Iota",922:"Kappa",923:"Lambda",924:"Mu",925:"Nu",926:"Xi",927:"Omicron",928:"Pi",929:"Rho",931:"Sigma",932:"Tau",933:"Upsilon",934:"Phi",935:"Chi",936:"Psi",937:"Omega",945:"alpha",946:"beta",947:"gamma",948:"delta",949:"epsilon",950:"zeta",951:"eta",952:"theta",953:"iota",954:"kappa",955:"lambda",956:"mu",957:"nu",958:"xi",959:"omicron",960:"pi",961:"rho",962:"sigmaf",963:"sigma",964:"tau",965:"upsilon",966:"phi",967:"chi",968:"psi",969:"omega",977:"thetasym",978:"upsih",982:"piv",8226:"bull",8230:"hellip",8242:"prime",8243:"Prime",8254:"oline",8260:"frasl",8472:"weierp",8465:"image",8476:"real",8482:"trade",8501:"alefsym",8592:"larr",8593:"uarr",8594:"rarr",8595:"darr",8596:"harr",8629:"crarr",8656:"lArr",8657:"uArr",8658:"rArr",8659:"dArr",8660:"hArr",8704:"forall",8706:"part",8707:"exist",8709:"empty",8711:"nabla",8712:"isin",8713:"notin",8715:"ni",8719:"prod",8721:"sum",8722:"minus",8727:"lowast",8730:"radic",8733:"prop",8734:"infin",8736:"ang",8743:"and",8744:"or",8745:"cap",8746:"cup",8747:"int",8756:"there4",8764:"sim",8773:"cong",8776:"asymp",8800:"ne",8801:"equiv",8804:"le",8805:"ge",8834:"sub",8835:"sup",8836:"nsub",8838:"sube",8839:"supe",8853:"oplus",8855:"otimes",8869:"perp",8901:"sdot",8968:"lceil",8969:"rceil",8970:"lfloor",8971:"rfloor",9001:"lang",9002:"rang",9674:"loz",9824:"spades",9827:"clubs",9829:"hearts",9830:"diams",338:"OElig",339:"oelig",352:"Scaron",353:"scaron",376:"Yuml",710:"circ",732:"tilde",8194:"ensp",8195:"emsp",8201:"thinsp",8204:"zwnj",8205:"zwj",8206:"lrm",8207:"rlm",8211:"ndash",8212:"mdash",8216:"lsquo",8217:"rsquo",8218:"sbquo",8220:"ldquo",8221:"rdquo",8222:"bdquo",8224:"dagger",8225:"Dagger",8240:"permil",8249:"lsaquo",8250:"rsaquo",8364:"euro"});var m=K;let wt=null;window.onload=function(){m.init(),K_(),wt=new m.Area({id:"mainarea",content_id:"canvasarea",height:"calc( 100% - 30px )",main:!0,inmediateResize:!0}),m.add(wt);var t=document.createElement("canvas");t.width=t.height=100,t.times=0,t.redraw=function(){const e=t.parentNode.getClientRects()[0];t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.clearRect(0,0,this.width,this.height),n.lineWidth=1,n.strokeStyle="#AAF",n.font="16px arial",n.strokeRect(10.5,10.5,this.width-20,this.height-20),n.strokeText("Redraw times: "+this.times,20.5,30.5),this.times+=1},wt.content.appendChild(t),wt.split("horizontal",[null,340],!0),Q_(),wt.getSection(0).split("vertical",[null,"100px"],!0),tw(),ps(),ew(),nw(),t.redraw(),wt.onresize=function(){t.redraw()},wt.getSection(0).onresize=()=>t.redraw(),wt.getSection(0).getSection(1).onresize=()=>t.redraw(),window.onresize=()=>t.redraw()};function K_(){const t=new m.Menu("MainMenu");m.add(t),t.add("File/New"),t.add("File/Open..."),t.add("File/Open_Recent"),t.add("File/Revert"),t.add("File/Recover"),t.add("File/Recover/Last Session"),t.add("File/Recover/Auto Save"),t.add("File/"),t.add("File/Save"),t.add("File/Save As..."),t.add("File/Save Copy"),t.add("File/"),t.add("File/Link..."),t.add("File/Append..."),t.add("File/Data Previews"),t.add("File/Data Previews/Refresh Data-Block Previews"),t.add("File/Data Previews/Batch-Generate Previews"),t.add("File/Data Previews/"),t.add("File/Data Previews/Clear Data-Block Previews"),t.add("File/Data Previews/Batch-Clear Previews"),t.add("File/"),t.add("File/Import"),t.add("File/Export"),t.add("File/"),t.add("File/External Data"),t.add("File/Clean Up"),t.add("File/"),t.add("File/Defaults"),t.add("File/"),t.add("File/Quit"),t.add("Edit/Undo"),t.add("Edit/Redo"),t.add("Edit/"),t.add("Edit/Undo History..."),t.add("Edit/"),t.add("Edit/Repeat Last"),t.add("Edit/Repeat History..."),t.add("Edit/"),t.add("Edit/Adjust Last Operation"),t.add("Edit/"),t.add("Edit/Copy",{callback:function(){console.log("Copy")}}),t.add("Edit/Paste",{callback:function(){console.log("Paste")}}),t.add("Edit/Clear",{callback:function(){console.log("Clear")}}),t.add("View/Fixed size",{callback:function(){m.setWindowSize(1e3,600)}}),t.add("View/Maximize",{callback:function(){m.setWindowSize()}}),t.add("View/"),t.add("View/Bottom panel",{callback:function(){}}),t.add("View/Side panel",{callback:function(){}}),t.add("Debug/Dialog",{callback:function(){ps()}}),t.add("Debug/Message",{callback:function(){m.showMessage("This is an example of message")}}),t.add("Debug/Modal",{callback:function(){var e=new m.Dialog("blarg",{width:300,height:100,close:!0,content:"This is an example of modal dialog"});e.makeModal(),e.addButton("Accept",{close:!0}),e.addButton("Cancel",{close:"fade"})}})}function Q_(){const t=new m.Panel("right-panel",{title:"Docked Right Panel",close:!0});return wt.getSection(1).add(t),m.bind(t,"closed",function(){wt.merge()}),ds(t),t}function tw(){var t=new m.Panel({id:"bottom-panel",title:"Docked Bottom Panel",hide:!1});return wt.getSection(0).getSection(1).add(t),m.bind(t,"closed",function(){m.mainarea.getSection(0).merge()}),t}function ds(t){t=t||window.sidepanel,t.content.innerHTML="";var e=new m.Tabs;e.addTab("Info"),e.addTab("Tree",{selected:!0,width:"100%",height:200}),e.addTab("Extra"),e.getTabContent("Info").appendChild(m.createElement("strong",null,"Example of code inside tab container"));var n={id:"Rootnode",children:[{id:"Child1"},{id:"Child2",children:[{id:"SubChild1"},{id:"SubChild2"},{id:"SubChild3"},{id:"SubChild4"}]},{id:"Child3"}]};const i=new m.Tree(n,{allow_rename:!0});m.bind(i.root,"item_selected",function(a){console.log("Node selected: ",a.detail)}),e.getTabContent("Tree").appendChild(i.root),i.insertItem({id:"FOO"},"Child2",2),i.insertItem({id:"MAX"},"Child1"),t.add(e);const o=new m.Inspector;o.onchange=function(a,s,l){console.log("Widget change: "+a+" -> "+s)},t.content.appendChild(o.root),o.addSection("Number Stuff"),o.addSlider("Slider",20,{min:1,max:100,step:1}),o.addVector2("Vector2",[10,20],{min:0}),o.addVector3("Vector3",[10,20,30],{min:0}),o.addVector4("Vector4",[.1,.2,.3,.4],{min:0}),o.addSection("Text Stuff"),o.addString("String","foo"),o.addStringButton("String Button","foo",{callback:function(a){console.log("Button: "+a)}}),o.addTextarea(null,"a really long silly text",{height:100}),o.addCombo("Combo","javi",{values:["foo","faa","super largo texto que no cabe entero","javi","nada"],callback:function(a){console.log("Combo selected: "+a)}}),o.addComboButtons("Combobtns","javi",{values:["foo","faa","javi","nada"],callback:function(a){console.log("Combo button selected: "+a)}}),o.addTags("Tags","pop",{values:["rap","blues","pop","jazz"],callback:function(a){console.log("Tag added: "+JSON.stringify(a))}}),o.addSection("Other widgets"),o.addCheckbox("Checkbox",!0,{callback:function(a){console.log("Checkbox pressed: "+a)}}),o.addButton("Serialize","Save",{callback:function(a){console.log("Button pressed: "+a)}}),o.addButtons("Serialize",["Save","Load","New"],{callback:function(a){console.log("Button pressed: "+a)}}),o.addButton(null,"Save"),o.addSeparator(),o.addColor("Color",[0,1,0]),o.addPad("Pad",[.5,.5],function(a){console.log(a)}),o.addFile("File","test.png"),o.addLine("Line",[[.5,1],[.75,.25]],{defaulty:0,width:120})}function ew(){var t=new m.Dialog({title:"Table dialog",close:!0,minimize:!0,width:300,scroll:!0,resizable:!0,draggable:!0});t.show(),t.setPosition(100,200),t.addButton("Randomize",r),t.show();const e=new m.Table({scrollable:!0});t.add(e),e.setColumns(["Name",{name:"Age",width:50},"Address"]);const n=[];for(var i=0;i<10;++i)n.push({name:iw(),age:30,address:"none"});r();function r(){for(var o in n)n[o].age=Math.random()*100|0;e.setRows(n,!0)}}function nw(){const t=new m.Dialog({title:"Complex List",close:!0,minimize:!0,width:300,height:400,scroll:!0,resizable:!0,draggable:!0});t.show(),t.setPosition(450,200);const e=new m.ComplexList({height:"100%"});t.add(e),e.addTitle("Example of title");for(var n=0;n<10;++n)e.addItem({},"Example",Math.random()>.5,!0);e.addTitle("Example of title");for(var n=0;n<10;++n)e.addItem({},"More items",Math.random()>.5,!0);return e.addHTML("+ click me"),t}function ps(){var t="Dialog_"+(Math.random()*100>>0),e=new m.Dialog({id:t,title:t,close:!0,minimize:!0,width:300,scroll:!0,resizable:!0,draggable:!0,detachable:!0});e.show("fade"),e.setPosition(800,200);var n=new m.Menu("minimenu");n.add("File/New"),n.add("File/Open..."),n.add("File/Save"),n.add("File/Save As"),n.add("Center",{callback:function(){e.center()}}),n.attachToPanel(e);var i=new m.Inspector;return i.addButton("button","Update",{callback:function(){ds()}}),i.addString("string","foo"),i.addNumber("number",10,{min:0}),i.addTree("tree",{person:"javi",info:{age:32,location:"barcelona"},role:"worker"}),i.addSeparator(),i.addVector2("vector2",[10,20],{min:0}),i.addVector3("vector3",[10,20,30],{min:0}),i.addSeparator(),i.addTextarea("textarea","a really long silly text"),i.addInfo("info","a really long silly text"),i.addSlider("slider",10,{min:1,max:100,step:1}),i.addCheckbox("checkbox",!0),i.addCheckbox("checkbox2",!1),i.addCombo("combo","javi",{values:["foo","faa","super largo texto que no cabe entero","javi","nada"]}),i.addButtons("Serialize",["Save","Load","New"]),i.addButton(null,"Save"),e.add(i),e}function iw(){var t=["Phil","Smith","Gregory","Martin","James","Coleman","Jerry","Helen","Mary"],e=[];return e.push(t[Math.floor(Math.random()*t.length)]),e.push(t[Math.floor(Math.random()*t.length)]),e.join(" ")}});export default rw();
