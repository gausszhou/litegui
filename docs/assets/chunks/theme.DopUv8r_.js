const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/VPLocalSearchBox.CQsC00rG.js","assets/chunks/framework.CezWKtOZ.js","assets/chunks/basic.BPqrfo4-.js","assets/chunks/basic.B-zoXXbS.js","assets/chunks/basic.Bm9E4Cdp.js","assets/chunks/basic.DiXG1mAY.js","assets/chunks/basic.ClBGREY_.js","assets/chunks/basic.CbojscF6.js","assets/chunks/basic.Db-HioNj.js","assets/chunks/basic.CN0yDhPk.js","assets/chunks/basic.CEYRVe2N.js","assets/chunks/basic.B6USPduq.js","assets/chunks/basic.D8VHk0gq.js","assets/chunks/basic.C1Zy1dUL.js","assets/chunks/basic.CB-uqJJt.js","assets/chunks/basic.DxmhBZbC.js","assets/chunks/basic.CKpI8PV7.js","assets/chunks/basic.Cm2pAqlW.js","assets/chunks/basic.tjERq7T0.js","assets/chunks/basic.BTRvsrBO.js","assets/chunks/basic.C2WSwf0Q.js"])))=>i.map(i=>d[i]);
var ji=Object.defineProperty;var Xn=r=>{throw TypeError(r)};var Wi=(r,n,t)=>n in r?ji(r,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[n]=t;var c=(r,n,t)=>Wi(r,typeof n!="symbol"?n+"":n,t),Ve=(r,n,t)=>n.has(r)||Xn("Cannot "+t);var g=(r,n,t)=>(Ve(r,n,"read from private field"),t?t.call(r):n.get(r)),B=(r,n,t)=>n.has(r)?Xn("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(r):n.set(r,t),D=(r,n,t,e)=>(Ve(r,n,"write to private field"),e?e.call(r,t):n.set(r,t),t),W=(r,n,t)=>(Ve(r,n,"access private method"),t);import{d as z,c as k,r as E,n as G,o as f,a as Jt,t as q,b as N,w as C,T as In,e as M,_ as $,u as ii,i as qi,f as Yi,g as Te,h as O,j as S,k as x,l as Gt,m as He,p as Y,q as It,s as Me,v as Bt,x as Nn,y as Pn,z as Xi,A as Zi,F as K,B as rt,C as qt,D as ze,E as I,G as $n,H as yt,I as ri,J as Ie,K as jt,L as Ne,M as Ui,N as Vn,O as Re,P as oi,Q as si,R as Pe,S as Ji,U as Gi,V as tt,W as ai,X as li,Y as Ki,Z as Qi,$ as tr,a0 as er,a1 as nr,a2 as ir}from"./framework.CezWKtOZ.js";function Mt(r){return r==null?"auto":typeof r=="string"?r:r>=0?(r|0)+"px":"calc( 100% - "+Math.abs(r|0)+"px )"}function Fe(r,n,t,e="",i={}){const o=document.createElement(r);if(n)for(const s of n.split(" "))s[0]==="."?o.classList.add(s.slice(1)):s[0]==="#"?o.id=s.slice(1):o.id=s;return t&&(o.innerHTML=t),e&&(typeof e=="string"?o.setAttribute("style",e):Object.entries(e).forEach(([s,a])=>{o.style[s]=a})),Object.entries(i).forEach(([s,a])=>{o.addEventListener(s,a)}),o}function ci(r,n,t){const e=document.createElement("span");if(e.innerHTML=r,n)for(const i in n){const o=e.querySelector(i);o&&(o.textContent=n[i])}return t&&typeof t!="string"&&Object.entries(t).forEach(([i,o])=>{e.style[i]=o}),e}function ye(r){var n;return r?(typeof r=="string"?document.querySelectorAll(r).forEach(t=>{var e;return(e=t.parentElement)==null?void 0:e.removeChild(t)}):r instanceof Array||r instanceof NodeList?Array.from(r).forEach(t=>ye(t)):(n=r.root)!=null&&n.parentNode?r.root.parentNode.removeChild(r.root):r.parentNode&&r.parentNode.removeChild(r),!0):!1}function rr(r,n){const t=n.getBoundingClientRect();return t?r.pageY>t.top&&r.pageY<t.top+t.height&&r.pageX>t.left&&r.pageX<t.left+t.width:!1}function je(r,n,t,e,i){const o=n||r;o.addEventListener("mousedown",u),o.style.cursor="move";let s=0,a=0,l=0,d=0;function h(){const p=r.getBoundingClientRect(),_=r.offsetParent;if(_){const b=_.getBoundingClientRect();return{left:p.left-b.left+_.scrollLeft,top:p.top-b.top+_.scrollTop}}return{left:p.left+window.scrollX,top:p.top+window.scrollY}}function u(p){if(p.type==="mousedown"){if(i&&i(r,p)===!1)return p.stopPropagation(),p.preventDefault(),!1;const _=h();return l=_.left,d=_.top,r.style.position="absolute",r.style.left=`${l}px`,r.style.top=`${d}px`,s=p.clientX,a=p.clientY,document.addEventListener("mousemove",u),document.addEventListener("mouseup",u),t&&t(r,p),p.stopPropagation(),p.preventDefault(),!1}if(p.type==="mouseup"){document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",u),e&&e(r,p);return}if(p.type==="mousemove"){const _=l+(p.clientX-s),b=d+(p.clientY-a);r.style.left=`${_}px`,r.style.top=`${b}px`}return!0}}function or(r){return String(r??"").replace(/[&<>"']/g,n=>{switch(n){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return"&#39;"}})}function di(r){return{all:r=r||new Map,on:function(n,t){var e=r.get(n);e?e.push(t):r.set(n,[t])},off:function(n,t){var e=r.get(n);e&&(t?e.splice(e.indexOf(t)>>>0,1):r.set(n,[]))},emit:function(n,t){var e=r.get(n);e&&e.slice().map(function(i){i(t)}),(e=r.get("*"))&&e.slice().map(function(i){i(n,t)})}}}class Q{constructor(){c(this,"emitter",di())}on(n,t){return this.emitter.on(n,t),this}off(n,t){return this.emitter.off(n,t),this}once(n,t){const e=i=>{this.off(n,e),t(i)};return this.on(n,e)}emit(n,t){return this.emitter.emit(n,t),this}removeAllListeners(){return this.emitter.all.clear(),this}}function hi(r){return typeof r=="string"?Array.from(document.querySelectorAll(r)):r instanceof NodeList||r instanceof Array?Array.from(r):[r]}function ui(r,n,t){if(!r)throw new Error("Cannot bind to null");if(!n)throw new Error("Event bind missing");if(!t)throw new Error("Bind callback missing");for(const e of hi(r))sr(e,n,t)}function sr(r,n,t){if(r instanceof Q){r.on(n,t);return}if(typeof r.addEventListener=="function"){r.addEventListener(n,t);return}r.__events instanceof Q||Object.defineProperty(r,"__events",{value:new Q,enumerable:!1,configurable:!0}),r.__events.on(n,t)}function ar(r,n,t){for(const e of hi(r))e instanceof Q?e.off(n,t):typeof e.removeEventListener=="function"?e.removeEventListener(n,t):e.__events instanceof Q&&e.__events.off(n,t)}function U(r,n,t){const e=new CustomEvent(n,{bubbles:!0,cancelable:!0,detail:t});return r instanceof Q?r.emit(n,e):r&&typeof r.dispatchEvent=="function"?r.dispatchEvent(e):(r==null?void 0:r.__events)instanceof Q?r.__events.emit(n,e):r&&typeof r.fireEvent=="function"&&r.fireEvent(e),e}const ot={root:null,content:null,modalbg:null,windows:[],events:new Q,specialCodes:{close:"&#10005;",navicon:"&#9776;",refresh:"&#8634;",gear:"&#9881;",open_folder:"&#128194;",download:"&#11123;",tick:"&#10003;",trash:"&#128465;"}};function Bn(){return ot.root||document.body}function lr(){return ot.content||Bn()}function cr(){return ot.modalbg}function We(r){ot.modalbg&&(ot.modalbg.style.display=r?"block":"none")}let qe="dark";function dr(r){return qe=r,document.documentElement.dataset.lgTheme=r,qe}function hr(){return qe}const Zn=new Set;function me(r,n){Zn.has(r)||(Zn.add(r),console.warn(`[LiteGUI] ${n}`))}function gi(r){let n=r.attributes,t,e,i;if(n)for(t=n.length-1;t>=0;t-=1)i=n[t].name,typeof r[i]=="function"&&(r[i]=null);if(n=r.childNodes,n)for(e=n.length,t=0;t<e;t+=1)gi(r.childNodes[t])}class ur extends Q{constructor(){super(...arguments);c(this,"root",document.createElement("div"))}style(t,e){return t!=="length"&&t!=="parentRule"&&e!==void 0&&e!==null&&e!==""&&t!=="float"&&t!=="cssFloat"&&(this.root.style[t]=e),this}width(t){return typeof t=="number"?this.root.style.width=t+"px":this.root.style.width=t,this}height(t){return typeof t=="number"?this.root.style.height=t+"px":this.root.style.height=t,this}class(t){return this.root.className=t,this}id(t){return this.root.id=t,this}}const Un="split_moved",ut=class ut extends Q{constructor(t,e){super();c(this,"_rootComputedSize");c(this,"direction","horizontal");c(this,"size");c(this,"options");c(this,"root");c(this,"content");c(this,"splitbar");c(this,"sections");c(this,"dynamic_section");if(t&&t.constructor===String||e){const i=t;t=e||{},t.id=i,me("area-legacy-args","Area(id, options) is deprecated; use Area(options).")}this.options=t||{},this.root=this.createRoot(),this.content=this.createContent(),this.sections=[],this._rootComputedSize=[this.root.offsetWidth,this.root.offsetHeight],this.initDom(),this.initEvent(),this.initStyle()}createRoot(){const t=this.options,e=document.createElement("div");return e.className="lg-area",t.id&&(e.id=t.id),t.className&&(e.className+=" "+t.className),e}createContent(){const t=this.options;var e=document.createElement("div");return t.content_id&&(e.id=t.content_id),e.className="lg-area__content",e.style.width="100%",e.style.height="100%",e}createSplitbar(t){const e=[0,0],i=l=>{const d=this.root.ownerDocument;d.addEventListener("mousemove",o),d.addEventListener("mouseup",s),e[0]=l.pageX,e[1]=l.pageY,l.stopPropagation(),l.preventDefault()},o=l=>{t=="horizontal"&&e[0]!=l.pageX&&this.moveSplit(e[0]-l.pageX),t=="vertical"&&e[1]!=l.pageY&&this.moveSplit(l.pageY-e[1]),e[0]=l.pageX,e[1]=l.pageY,l.stopPropagation(),l.preventDefault(),(this.options.immediateResize||this.options.inmediateResize)&&this.onResize()},s=()=>{const l=this.root.ownerDocument;l.removeEventListener("mousemove",o),l.removeEventListener("mouseup",s),this.onResize()},a=document.createElement("div");return a.className="lg-area__splitbar lg-area__splitbar--"+t,t=="vertical"?a.style.height=ut.SPLITBAR_SIZE+"px":a.style.width=ut.SPLITBAR_SIZE+"px",a.addEventListener("mousedown",i),a}initDom(){this.root.appendChild(this.content)}initEvent(){this.options.autoresize&&ui(ot.events,"resized",()=>{this.onResize()})}initStyle(){const t=this.options;this.root.style.width=Mt(t.width??"100%"),this.root.style.height=Mt(t.height??"100%")}add(t){if(typeof t=="string"){var e=document.createElement("div");e.innerHTML=t,t=e}this.content.appendChild(t.root||t)}getSection(t){return t=t||0,this.sections.length>t?this.sections[t]:null}sendResizeEvent(t){this.sections.forEach(e=>{e.onResize(t)})}onResize(t){const e=[this.root.offsetWidth,this.root.offsetHeight];return t&&this._rootComputedSize&&e[0]===this._rootComputedSize[0]&&e[1]===this._rootComputedSize[1]?!1:(this.sendResizeEvent(t),!0)}getWidth(){return this.root.offsetWidth}getHeight(){return this.root.offsetHeight}isVisible(){return this.root.style.display!=="none"}hide(){this.root.style.display="none"}show(){this.root.style.display="block"}adjustHeight(){if(!this.root.parentElement){console.error("Cannot adjust height of LiteGUI.Area without parent");return}const t=this.root.getClientRects()[0].top;this.root.style.height="calc( 100% - "+t+"px )"}showSection(t){const e=this.sections[t];if(!e||e.root.style.display!=="none")return!1;e.root.style.display=this.direction==="vertical"?"block":"inline-block";let i="";return this.direction=="horizontal"&&(i=e.root.style.width),this.direction==="vertical"&&(i=e.root.style.height),i.indexOf("calc")!=-1&&(i="50%"),this.sections.forEach((o,s)=>{s!==t&&(this.direction==="horizontal"&&(o.root.style.width=`calc( 100% - ${i} - 5px)`),this.direction==="vertical"&&(o.root.style.height=`calc( 100% - ${i} - 5px)`))}),this.splitbar&&(this.splitbar.style.display=this.direction==="vertical"?"block":"inline-block"),this.sendResizeEvent(),!0}hideSection(t){this.sections.forEach((e,i)=>{i===t?e.root.style.display="none":(this.direction=="horizontal"&&(e.root.style.width="100%"),this.direction==="vertical"&&(e.root.style.height="100%"))}),this.splitbar&&(this.splitbar.style.display="none"),this.sendResizeEvent()}split(t,e,i){if(t!=="vertical"&&t!=="horizontal")throw new Error("First parameter must be a string: 'vertical' or 'horizontal'");if(e||(e=["50%",null]),this.sections.length)throw"cannot split twice";const o=t==="vertical"?"block":"inline-block",s=new ut({content_id:this.content.id},!1);s.root.style.display=o;const a=new ut;a.root.style.display=o;let l="",d=null,h;if(i&&(l=" - "+(ut.SPLITBAR_SIZE+2)+"px",d=this.createSplitbar(t),d.style.display=o,this.splitbar=d),e=e||["50%",null],t=="vertical")if(s.root.style.width="100%",a.root.style.width="100%",e[0]==null){var u=e[1];typeof u=="number"&&(u=e[1]+"px"),s.root.style.height="calc( 100% - "+u+l+" )",a.root.style.height=u,a.size=u,h=s}else if(e[1]==null){var u=e[0];typeof u=="number"&&(u=e[0]+"px"),s.root.style.height=u,s.size=u,a.root.style.height="calc( 100% - "+u+l+" )",h=a}else{var p=e[0];typeof p=="number"&&(p=e[0]+"px");var _=e[1];typeof _=="number"&&(_=e[1]+"px"),s.root.style.height=p,s.size=p,a.root.style.height=_,a.size=_}if(t=="horizontal")if(s.root.style.height="100%",a.root.style.height="100%",e[0]==null){var b=e[1];typeof b=="number"&&(b=e[1]+"px"),s.root.style.width="calc( 100% - "+b+l+" )",a.root.style.width=b,a.size=e[1],h=s}else if(e[1]==null){var b=e[0];typeof b=="number"&&(b=e[0]+"px"),s.root.style.width=b,s.size=b,a.root.style.width="calc( 100% - "+b+l+" )",h=a}else{var y=e[0];typeof y=="number"&&(y=e[0]+"px");var m=e[1];typeof m=="number"&&(m=e[1]+"px"),s.root.style.width=y,s.size=y,a.root.style.width=m,a.size=m}s.root.removeChild(s.content),s.root.appendChild(this.content),s.content=this.content,this.root.appendChild(s.root),d&&this.root.appendChild(d),this.root.appendChild(a.root),this.direction=t,this.sections=[s,a],this.dynamic_section=h}moveSplit(t){if(!this.sections)return!1;const e=this.sections[0],i=this.sections[1],o=" - "+ut.SPLITBAR_SIZE+"px",s=this.options.minSplitSize||10;if(this.direction=="horizontal")if(this.dynamic_section==e){var a=i.root.offsetWidth+t;a<s&&(a=s),e.root.style.width="calc( 100% - "+a+"px "+o+" )",i.root.style.width=a+"px"}else{var a=e.root.offsetWidth-t;a<s&&(a=s),i.root.style.width="calc( 100% - "+a+"px "+o+" )",e.root.style.width=a+"px"}else if(this.direction=="vertical")if(this.dynamic_section==e){var a=i.root.offsetHeight-t;a<s&&(a=s),e.root.style.height="calc( 100% - "+a+"px "+o+" )",i.root.style.height=a+"px"}else{var a=e.root.offsetHeight+t;a<s&&(a=s),i.root.style.height="calc( 100% - "+a+"px "+o+" )",e.root.style.height=a+"px"}U(this.root,Un);for(var l=this.root.querySelectorAll(".lg-area"),d=0;d<l.length;++d)U(l[d],Un);return!0}setAreaSize(t,e){const i=this.sections[t||0],o=` - ${ut.SPLITBAR_SIZE}px`;i.root.style.width=`calc( 100% - ${e}  ${o} )`}merge(t){if(this.sections.length===0)throw new Error("not splitted");const e=this.sections[t||0];if(!e)throw new Error("section not found");const i=e.content;this.root.innerHTML="",this.root.appendChild(i),this.content=i,this.sections=[],this.dynamic_section=void 0,this.splitbar=void 0,this._rootComputedSize=[],this.onResize()}addEventListener(t,e){return this.root.addEventListener(t,e)}query(t){return this.root.querySelector(t)}};c(ut,"VERTICAL","vertical"),c(ut,"HORIZONTAL","horizontal"),c(ut,"SPLITBAR_SIZE",4);let we=ut;class Ye{constructor(){c(this,"root",document.createElement("div"));c(this,"stopPropagation",!1);this.root.addEventListener("click",n=>{this.stopPropagation&&n.stopPropagation()})}setEmpty(n=!0){n&&(this.root.innerHTML="")}}class Dn extends ur{constructor(t,e){super();c(this,"root");c(this,"content");c(this,"options");e=e||{},typeof e=="function"&&(e={callback:e}),this.options=e,this.root=this.createElementRoot(),this.content=this.createElementButton(),this.initDom(t),this.initEvent()}createElementRoot(){var i;const t=document.createElement("div");t.classList.add("lg-button");const e=(i=this.options)==null?void 0:i.size;return e&&t.classList.add(`lg-button--${e}`),t}createElementButton(){const t=document.createElement("button");return t.className="lg-button__control",t}initDom(t){this.content.innerHTML=t,this.root.appendChild(this.content)}initEvent(){this.content.addEventListener("click",()=>{this.click()})}click(){const t=this.options.callback;return t&&t.call(this),this.emit("click",this),this}}class pi{constructor(n,t){c(this,"value");c(this,"options");c(this,"root");c(this,"element");t=t||{},typeof t=="function"&&(t={onChange:t}),this.options=t,this.value=n,this.root=this.createElementRoot(),this.element=this.createElementContent(),this.root.dataset.value=n.toString(),this.initDom(),this.initEvent()}createElementRoot(){const n=this.root=document.createElement("span");return n.className="lg-checkbox lg-input",n.setAttribute("role","checkbox"),n.setAttribute("aria-checked",this.value.toString()),n.tabIndex=0,n}createElementContent(){const n=this.value,t=this.element=document.createElement("span");return t.className="lg-checkbox__flag "+(n?"lg-checkbox--on":"lg-checkbox--off"),t}initDom(){this.root.appendChild(this.element)}initEvent(){this.root.addEventListener("click",n=>{this.toggle(),n.preventDefault(),n.stopPropagation()}),this.root.addEventListener("keydown",n=>{(n.key===" "||n.key==="Enter")&&(this.toggle(),n.preventDefault(),n.stopPropagation())})}toggle(){this.setValue(this.root.dataset.value!=="true")}setValue(n){var i;if(this.value===n)return!1;this.onValueChange(n);const t=this.value;this.value=n,this.root.dataset.value=this.value.toString(),this.root.setAttribute("aria-checked",this.value.toString());const e=(i=this.options)==null?void 0:i.onChange;return e&&e(n,t),!0}onValueChange(n){n?(this.element.classList.remove("lg-checkbox--off"),this.element.classList.add("lg-checkbox--on")):(this.element.classList.remove("lg-checkbox--on"),this.element.classList.add("lg-checkbox--off"))}getValue(){return this.value}}class mi{constructor(n={}){c(this,"root");c(this,"item_code");c(this,"selected");c(this,"onItemSelected");c(this,"onItemToggled");c(this,"onItemRemoved");this.root=document.createElement("div"),this.root.className="lg-complex-list",this.item_code=n.item_code||"<div class='lg-complex-list__item'><span class='lg-complex-list__tick'><span>Tick</span></span><span class='lg-complex-list__item-title'></span><button class='lg-complex-list__trash'>Close</button></div>",n.height&&(this.root.style.height=Mt(n.height)),this.selected=null,this.onItemSelected=null,this.onItemToggled=null,this.onItemRemoved=null}addTitle(n){const t=Fe("div",".lg-complex-list__title",n);return this.root.appendChild(t),t}addHTML(n,t){const e=Fe("div",".lg-complex-list__text",n);return t&&e.addEventListener("mousedown",t),this.root.appendChild(e),e}clear(){this.root.innerHTML=""}addItem(n,t,e,i){const o=t||n.content||n.name||"",s=ci(this.item_code,{".lg-complex-list__item-title":o});if(s.item=n,e&&s.classList.add("lg-is-enabled"),!i){const d=s.querySelector(".lg-complex-list__trash");d&&(d.style.display="none")}s.addEventListener("mousedown",d=>{var h;d.preventDefault(),(h=s.setSelected)==null||h.call(s,!0),this.onItemSelected&&this.onItemSelected(n,s)});const a=s.querySelector(".lg-complex-list__tick");a&&a.addEventListener("mousedown",d=>{d.preventDefault(),s.classList.toggle("lg-is-enabled"),this.onItemToggled&&this.onItemToggled(n,s,s.classList.contains("enabled"))});const l=s.querySelector(".lg-complex-list__trash");return l&&l.addEventListener("mousedown",d=>{d.preventDefault(),d.stopPropagation(),d.stopImmediatePropagation(),this.onItemRemoved&&this.onItemRemoved(n,s)}),s.setContent=(d,h)=>{const u=s.querySelector(".lg-complex-list__item-title");u&&(h?u.innerHTML=d:u.textContent=d)},s.toggleEnabled=()=>{s.classList.toggle("lg-is-enabled")},s.setSelected=d=>{this.root.querySelectorAll(".lg-complex-list__item.lg-is-selected").forEach(h=>h.classList.remove("lg-is-selected")),d?s.classList.add("lg-is-selected"):s.classList.remove("lg-is-selected"),this.selected=s.item},s.show=()=>{s.style.display=""},s.hide=()=>{s.style.display="none"},this.root.appendChild(s),s}getSelected(){return this.selected}}class fi extends Q{constructor(t){super();c(this,"options");c(this,"_prompt");c(this,"history");c(this,"_history_offset");c(this,"_input_blocked");c(this,"root");c(this,"$log");c(this,"$footer");c(this,"$input");c(this,"onAutocomplete");c(this,"onProcessCommand");t=t||{},this.options=t,this._prompt=t.prompt||"]",this.onAutocomplete=null,this.onProcessCommand=null,this.history=[],this._history_offset=0,this.root=this.createRoot(),this.$log=this.createLog(),this.$footer=this.createFooter(),this.$input=this.createInput(),this.initDom(),this.initEvent()}createRoot(){const t=document.createElement("div");return t.className="lg-console",t}createLog(){const t=document.createElement("div");return t.className="lg-console__log",t}createFooter(){const t=document.createElement("div");return t.className="lg-console__footer",t}createInput(){const t=document.createElement("input");return t.type="text",t}initDom(){this.root.appendChild(this.$log),this.root.appendChild(this.$footer),this.$footer.appendChild(this.$input)}initEvent(){this.$input.addEventListener("keydown",this.processKeyDown.bind(this))}processKeyDown(t){if(!this._input_blocked){if(t.keyCode==13){var e=this.$input.value,i=e.trim();this.addMessage(this._prompt+i,"me",!0),this.$input.value="",this.history.push(i),this.history.length>10&&this.history.shift(),this.onProcessCommand&&this.onProcessCommand(i),this._history_offset=0}else if(t.keyCode==38||t.keyCode==40){this._history_offset+=t.keyCode==38?-1:1,this._history_offset>0?this._history_offset=0:this._history_offset<-this.history.length&&(this._history_offset=-this.history.length);var o=this.history.length+this._history_offset;if(o<0)return;o>=this.history.length?this.$input.value="":this.$input.value=this.history[o]}else if(t.keyCode==9)if(this.onAutocomplete)this.$input.value=this.onAutocomplete(this.$input.value);else return;else return;t.preventDefault(),t.stopPropagation()}}addMessage(t,e,i){const o=this.$log;let s=null;const a=h=>{if(s=document.createElement("pre"),i?s.innerText=h:s.innerHTML=h,s.className="lg-console__message",e){const u=e.startsWith("msg")?e.slice(3):e,p=e.startsWith("lg-")?e:`lg-console__message--${u}`;s.classList.add(p)}o.appendChild(s),o.children.length>1e3&&o.removeChild(o.children[0])};if(t&&t.constructor===Array)for(var l=0;l<t.length;++l)a(t[l]);else t&&t.constructor===Object?a(JSON.stringify(t,null,"")):a(t.toString());return this.$log.scrollTop=1e6,{update:h=>{s&&(s.innerHTML=h)}}}log(...t){return this.addMessage(t.join(","),"msglog")}warn(...t){return this.addMessage(t.join(","),"msgwarn")}error(...t){return this.addMessage(t.join(","),"msgerror")}clear(){this.$log.innerHTML=""}}class ae{constructor(n,t={}){c(this,"options");c(this,"root");c(this,"parentMenu");c(this,"lock",!1);c(this,"current_submenu");var l;this.options=t,t.parentMenu&&(t.parentMenu instanceof ae?(this.parentMenu=t.parentMenu,this.parentMenu.lock=!0,this.parentMenu.current_submenu=this):(console.error("parentMenu must be of class ContextMenu, ignoring it"),t.parentMenu=void 0)),t.event&&t.event.constructor.name!=="MouseEvent"&&t.event.constructor.name!=="PointerEvent"&&t.event.constructor.name!=="CustomEvent"&&(console.error("Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it."),t.event=void 0);const e=this.root=document.createElement("div");if(e.className="lg-context-menu",e.style.minWidth="100px",e.style.minHeight="100px",e.style.pointerEvents="none",setTimeout(()=>{e.style.pointerEvents="auto"},100),e.addEventListener("mouseup",d=>{d.preventDefault()},!0),e.addEventListener("contextmenu",d=>{d.button===2&&d.preventDefault()},!0),e.addEventListener("mousedown",d=>{d.button===2&&(this.close(),d.preventDefault())},!0),t.title){const d=document.createElement("div");d.className="lg-context-menu__title",d.innerHTML=t.title,e.appendChild(d)}const i=Array.isArray(n)?n.map(d=>[(d==null?void 0:d.title)??(d==null?void 0:d.content)??String(d),d]):Object.entries(n);for(const[d,h]of i)this.addItem(d,h,t);e.addEventListener("mouseleave",d=>{this.lock||(e.closing_timer&&clearTimeout(e.closing_timer),e.closing_timer=setTimeout(()=>this.close(d),500))}),e.addEventListener("mouseenter",()=>{e.closing_timer&&clearTimeout(e.closing_timer)});const o=d=>{const h=parseInt(e.style.top||"0");return e.style.top=`${h+d.deltaY*.1}px`,d.preventDefault(),!0};e.addEventListener("wheel",o,!0),e.addEventListener("mousewheel",o,!0);const s=t.event&&((l=t.event.target)==null?void 0:l.ownerDocument)||document;(t.container||s.body).appendChild(e),this.computePosition()}computePosition(){let n=this.options.left||0,t=this.options.top||0;if(this.options.event)if(this.options.event.constructor.name!=="MouseEvent"&&this.options.event.constructor.name!=="PointerEvent"&&this.options.event.constructor.name!=="CustomEvent")console.warn("Event passed to ContextMenu is not of type MouseEvent"),this.options.event=void 0;else{const e=this.options.event;if(n=e.pageX-10,t=e.pageY-10,this.options.title&&(t-=20),this.options.parentMenu){const s=this.options.parentMenu.root.getBoundingClientRect();n=s.left+s.width}const i=document.body.getBoundingClientRect(),o=this.root.getBoundingClientRect();n>i.width-o.width-10&&(n=i.width-o.width-10),t>i.height-o.height-10&&(t=i.height-o.height-10)}this.root.style.left=`${n}px`,this.root.style.top=`${t}px`}addItem(n,t,e={}){const i=this,o=document.createElement("div");o.className="lg-context-menu__item";let s=!1;t===null?o.classList.add("lg-context-menu__item--separator"):(o.innerHTML=t&&t.title?t.title:String(n??""),o.value=t,t&&(t.disabled&&(s=!0,o.classList.add("lg-context-menu__item--disabled")),(t.submenu||t.has_submenu)&&o.classList.add("lg-context-menu__item--has-submenu")),typeof t=="function"?(o.dataset.value=String(n),o.onclick_callback=t):o.dataset.value=String(t)),this.root.appendChild(o),s||o.addEventListener("click",l),e.autoopen&&o.addEventListener("mouseenter",a);function a(d){const h=this.value;!h||!h.has_submenu||l.call(this,d)}function l(d){const h=this.value;let u=!0;if(i.current_submenu&&i.current_submenu.close(d),e.callback&&e.callback.call(i,h,e,d)===!0&&(u=!1),h&&(h.callback&&!e.ignore_item_callbacks&&h.disabled!==!0&&h.callback.call(this,h,e,d,i)===!0&&(u=!1),h.submenu)){if(!h.submenu.options)throw new Error("ContextMenu submenu needs options");i.current_submenu=new ae(h.submenu.options,{callback:h.submenu.callback,event:d,parentMenu:i,ignore_item_callbacks:h.submenu.ignore_item_callbacks,title:h.submenu.title,autoopen:e.autoopen,container:e.container}),u=!1}u&&!i.lock&&i.close()}return o}close(n,t){this.root.parentNode&&this.root.parentNode.removeChild(this.root),this.parentMenu&&!t&&(this.parentMenu.lock=!1,this.parentMenu.current_submenu=void 0,n===void 0?this.parentMenu.close():n&&!rr(n,this.parentMenu.root)&&U(this.parentMenu.root,"mouseleave",n)),this.current_submenu&&this.current_submenu.close(n,!0),this.root.closing_timer&&clearTimeout(this.root.closing_timer)}getTopMenu(){return this.options.parentMenu?this.options.parentMenu.getTopMenu():this}getFirstEvent(){return this.options.parentMenu?this.options.parentMenu.getFirstEvent():this.options.event}}const j=class j extends Q{constructor(t={}){super();c(this,"draggable",!1);c(this,"resizable",!1);c(this,"minimized",!1);c(this,"maximized",!1);c(this,"isModal",!1);c(this,"top",0);c(this,"bottom",0);c(this,"old_box");c(this,"on_resize");c(this,"on_hide");c(this,"on_show");c(this,"on_minimize");c(this,"on_maximize");c(this,"on_detach");c(this,"on_attach");c(this,"on_close");c(this,"on_enter");c(this,"on_escape");c(this,"on_keydown");c(this,"on_keyup");c(this,"left",0);c(this,"right",0);c(this,"width",0);c(this,"height",0);c(this,"minWidth",150);c(this,"minHeight",150);c(this,"options");c(this,"root");c(this,"header");c(this,"buttons");c(this,"content");c(this,"footer");c(this,"id");c(this,"dialogWindow");c(this,"oldStyleWidth","0px");c(this,"oldStyleHeight","0px");typeof t=="string"&&me("dialog-string-arg","Dialog(id) is deprecated; use Dialog({ id }).");const e=typeof t=="string"?{id:t}:t;this.options=e,this.id=e.id??"",this.left=0,this.right=0,this.width=e.width??j.MIN_WIDTH,this.height=e.height??j.MIN_HEIGHT,this.minWidth=e.minWidth??j.MIN_WIDTH,this.minHeight=e.minHeight??j.MIN_HEIGHT,this.root=this.createElementRoot(),this.header=this.createElementHeader(),this.buttons=this.createElementButtons(),this.content=this.createElementContent(),this.footer=this.createElementFooter(),this.initDom(),this.initAccessibility(),this.bindWindowButtons(),this.enableProperties({draggable:e.draggable,resizable:e.resizable}),j.INSTANCE_LIST.push(this),(e.attach||e.parent)&&(((typeof e.parent=="string"?document.querySelector(e.parent):e.parent)||Bn()).appendChild(this.root),this.center())}createElementRoot(){const t=this.options,e=document.createElement("div");return e.className="lg-dialog",this.id&&(e.id=this.id),t.className&&(e.className+=" "+t.className),e}createElementHeader(){const t=this.options,e=document.createElement("div");return e.className="lg-dialog__header",e.textContent=t.title||"",t.title||(e.style.display="none"),e}createElementButtons(){const t=this.options,e=document.createElement("div");e.className="lg-dialog__buttons";const i=(o,s,a)=>{const l=document.createElement("button");return l.type="button",l.className=`lg-button__control lg-button__control--mini lg-dialog__button--${o.replace("-button","")}`,l.textContent=s,l.title=a,l};if(t.minimize){e.appendChild(i("minimize-button","-","Minimize"));const o=i("maximize-button","□","Maximize");o.style.display="none",e.appendChild(o)}return t.hide&&e.appendChild(i("hide-button","","Hide")),t.detachable&&e.appendChild(i("detach-button","","Detach")),(t.close||t.closable)&&e.appendChild(i("close-button","×","Close")),e}createElementContent(){const t=this.options,e=document.createElement("div");return e.className="lg-dialog__content",t.content&&(e.innerHTML=t.content),e}createElementFooter(){const t=document.createElement("div");return t.className="lg-dialog__footer",t}initDom(){this.root.appendChild(this.header),this.root.appendChild(this.buttons),this.root.appendChild(this.content),this.root.appendChild(this.footer),this.initStyle()}initAccessibility(){this.root.setAttribute("role","dialog"),this.root.tabIndex=-1;const t=`litegui-dialog-title-${++j._uid}`;this.header.id=t,this.root.setAttribute("aria-labelledby",t),this.options.title||this.root.setAttribute("aria-label","Dialog")}bindWindowButtons(){const t=this.root.querySelector(".lg-dialog__button--close");t==null||t.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.close()});const e=this.root.querySelector(".lg-dialog__button--minimize");e==null||e.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.minimize()});const i=this.root.querySelector(".lg-dialog__button--maximize");i==null||i.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.maximize()});const o=this.root.querySelector(".lg-dialog__button--hide");o==null||o.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),this.hide()})}initStyle(){const t=this.options;(t.fullscreen||t.fullcontent)&&(this.content.style.width="100%",this.content.style.height=t.title?"calc( 100% - "+j.TITLE_HEIGHT+" )":"100%"),t.scroll==!0&&(this.content.style.overflow="auto"),t.buttons&&t.buttons.forEach(e=>{this.addButtonToFooter(e.name,e)})}add(t){var e;(e=this.content)==null||e.appendChild(t.root||t)}addButtonToFooter(t,e){const i=new Dn(t,{size:e.size,callback:()=>{var o;(o=e.callback)==null||o.call(e,i),e.close&&this.close()}});return this.footer.appendChild(i.root),i}clear(){this.content&&(this.content.innerHTML="")}show(){return this.root.parentNode||(lr().appendChild(this.root),this.center()),this.root.style.display="",this.emit("shown",this),this.on_show&&this.on_show(),this}hide(){return this.root.style.display="none",this.emit("hidden",this),this.on_hide&&this.on_hide(),this}close(){const t=this.root.parentNode;t==null||t.removeChild(this.root),this.emit("closed",this),this.options.onClose&&this.options.onClose(),this.on_close&&this.on_close();const e=j.INSTANCE_LIST.indexOf(this);e!==-1&&j.INSTANCE_LIST.splice(e,1);const i=j.minimized.indexOf(this);i!==-1&&j.minimized.splice(i,1),j.arrangeMinimized(),this.isModal&&(this.isModal=!1,this.root.removeAttribute("aria-modal"),We(!1)),this.dialogWindow&&(this.dialogWindow.close(),this.dialogWindow=null)}setSize(t,e){this.root.style.width=typeof t=="number"?t+"px":t,this.root.style.height=typeof e=="number"?e+"px":e}setPositon(t,e){this.root.parentNode||console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM"),this.root.style.position="absolute",this.root.style.left=t+"px",this.root.style.top=e+"px"}setTitle(t){return this.header?(this.header.innerHTML=t,!0):!1}getDialogById(t){const e=j.INSTANCE_LIST.find(i=>i.id===t);return e||null}static getDialog(t){return j.INSTANCE_LIST.find(e=>e.id===t)}static showAll(){j.INSTANCE_LIST.forEach(t=>{t.show()})}static hideAll(){j.INSTANCE_LIST.forEach(t=>{t.hide()})}static closeAll(){j.INSTANCE_LIST.forEach(t=>{t.close()})}enableProperties(t={}){const e=this.root;if(e.style.position="absolute",e.style.minWidth=`${this.minWidth}px`,e.style.minHeight=`${this.minHeight}px`,e.style.boxShadow="0 0 3px black",this.width&&(e.style.width=typeof this.width=="number"?`${this.width}px`:this.width),this.height&&(typeof this.height=="number"?(e.style.height=`${this.height}px`,this.content.style.height="calc(100% - 24px)"):this.height.includes("%")&&(e.style.height=this.height,this.content.style.height="calc(100% - 24px)")),t.draggable){this.draggable=!0;const i=e.querySelector(".lg-dialog__header");je(e,i||e,()=>{},()=>!this.minimized)}t.resizable&&this.setResizable()}setResizable(){if(this.resizable)return;this.resizable=!0;const t=this.root,e=this.footer;e.style.minHeight="4px",e.classList.add("lg-dialog__footer--resizable");const i=document.createElement("div");i.className="lg-dialog__resize-handle",t.appendChild(i);let o={x:0,y:0},s=!1;const a=l=>{switch(l.type){case"mousedown":document.body.addEventListener("mousemove",a),document.body.addEventListener("mouseup",a),s=l.target===i,o={x:l.pageX,y:l.pageY};break;case"mousemove":{const d=t.getBoundingClientRect(),h=d.width-(o.x-l.pageX),u=d.height-(o.y-l.pageY);s&&(t.style.width=`${Math.max(this.minWidth,h)}px`),t.style.height=`${Math.max(this.minHeight,u)}px`,this.content.style.height="calc(100% - 24px)",o={x:l.pageX,y:l.pageY},this.on_resize&&(d.width!==h||d.height!==u)&&this.on_resize(l,h,u);break}case"mouseup":document.body.removeEventListener("mousemove",a),document.body.removeEventListener("mouseup",a),s=!1;break}l.preventDefault(),l.stopPropagation()};e.addEventListener("mousedown",a),i.addEventListener("mousedown",a)}dockTo(t,e="full"){if(!t)return;const i=this.root;switch(i.style.top="0",i.style.left="0",i.style.boxShadow="none",e){case"full":i.style.position="relative",i.style.width="100%",i.style.height="100%",this.content.style.width="100%",this.content.style.height=`calc(100% - ${j.TITLE_HEIGHT})`,this.content.style.overflow="auto";break;case"left":case"right":i.style.position="absolute",i.style.top="0",i.style[e]="0",i.style.width=`${this.width}px`,i.style.height="100%",this.content.style.height=`calc(100% - ${j.TITLE_HEIGHT})`,this.content.style.overflow="auto",e==="right"&&(i.style.left="auto",i.style.right="0");break;case"top":case"bottom":i.style.width="100%",i.style.height=`${this.height}px`,e==="bottom"&&(i.style.bottom="0",i.style.top="auto");break}if(this.draggable&&je(i,i.querySelector(".lg-dialog__header")||i),typeof t=="string"){const o=document.querySelector(t);o&&o.appendChild(i)}else t.content?t.content.appendChild(i):t.appendChild(i)}highlight(t=100){this.root.style.outline="1px solid white",setTimeout(()=>{this.root.style.outline=""},t)}minimize(){if(this.minimized)return;this.minimized=!0,this.old_box=this.root.getBoundingClientRect(),this.content.style.display="none";const t=this.root.querySelector(".lg-dialog__button--minimize"),e=this.root.querySelector(".lg-dialog__button--maximize");t&&(t.style.display="none"),e&&(e.style.display=""),this.root.style.width=`${j.MINIMIZED_WIDTH}px`,j.minimized.includes(this)||j.minimized.push(this),j.arrangeMinimized(),this.emit("minimize",this),this.on_minimize&&this.on_minimize()}static arrangeMinimized(){j.minimized.forEach((t,e)=>{const i=t.root.parentElement;if(!i)return;const o=i.getBoundingClientRect().height-20;t.root.style.left=j.MINIMIZED_WIDTH*e+"px",t.root.style.top=o+"px"})}maximize(){if(!this.minimized)return;this.minimized=!1,this.content.style.display="",this.old_box&&(this.root.style.left=`${this.old_box.left}px`,this.root.style.top=`${this.old_box.top}px`,this.root.style.width=`${this.old_box.width}px`,this.root.style.height=`${this.old_box.height}px`);const t=this.root.querySelector(".lg-dialog__button--minimize"),e=this.root.querySelector(".lg-dialog__button--maximize");t&&(t.style.display=""),e&&(e.style.display="none");const i=j.minimized.indexOf(this);i!==-1&&(j.minimized.splice(i,1),j.arrangeMinimized()),this.emit("maximize",this),this.on_maximize&&this.on_maximize()}makeModal(){this.isModal=!0,this.root.setAttribute("aria-modal","true"),We(!0);const t=cr()||document.body;this.root.parentNode!==t&&t.appendChild(this.root),this.show(),this.center()}fadeIn(t=1e3){this.root.style.display="",this.root.style.opacity="0",requestAnimationFrame(()=>{this.root.style.transition=`opacity ${t}ms`,this.root.style.opacity="1"})}setPosition(t,e){if(!this.root.parentNode){console.warn("LiteGUI.Dialog: Cannot set position of dialog if it is not in the DOM");return}this.root.style.position="absolute",this.root.style.left=`${t}px`,this.root.style.top=`${e}px`}center(){if(!this.root.parentNode)return;this.root.style.position="absolute";const t=this.root.offsetWidth,e=this.root.offsetHeight,i=this.root.parentElement.offsetWidth,o=this.root.parentElement.offsetHeight;this.root.style.left=`${Math.floor((i-t)*.5)}px`,this.root.style.top=`${Math.floor((o-e)*.5)}px`}adjustSize(t=0,e=!1){if(this.content.style.height="auto",this.content.offsetHeight===0&&!e){setTimeout(()=>{this.adjustSize(t,!0)},1);return}let i=0;const o=this.root.querySelector(".lg-dialog__footer");o&&(i+=o.offsetHeight);const s=this.content.offsetWidth,a=this.content.offsetHeight+20+t+i;this.setSize(s,a)}reattachWindow(){if(this.dialogWindow){this.root.appendChild(this.content),this.root.style.display="",this.dialogWindow.close();var t=ot.windows.indexOf(this.dialogWindow);t!=-1&&ot.windows.splice(t,1),this.dialogWindow=null}}};c(j,"INSTANCE_LIST",[]),c(j,"MINIMIZED_WIDTH",200),c(j,"MIN_WIDTH",150),c(j,"MIN_HEIGHT",150),c(j,"TITLE_HEIGHT","20px"),c(j,"minimized",[]),c(j,"maximized",[]),c(j,"_uid",0);let le=j;const gr=38,pr=40;class bi extends Q{constructor(t,e){super();c(this,"options");c(this,"value");c(this,"precision");c(this,"root");c(this,"wrap");c(this,"input");c(this,"dragger");t==null?t=0:t.constructor===String?t=parseFloat(t):t.constructor!==Number&&(t=0),this.options=e||{},this.value=t,this.precision=this.options.precision||3,this.root=this.createRoot(),this.wrap=this.createWrap(),this.input=this.createInput(),this.dragger=this.createDragger(),this.initDom(),this.initEvent()}createRoot(){const t=this.options,e=document.createElement("div");return e.className="lg-dragger "+(t.extraclass?t.extraclass:""),e}createWrap(){const t=this.options,e=document.createElement("span");return e.className="lg-input "+(t.extraclass?t.extraclass:"")+(t.full?" lg-input--full":""),t.disabled&&(e.className+=" lg-is-disabled"),e}createInput(){const t=this.options,e=this.value,i=this.precision,o=t.dragger_class||"full",s=document.createElement("input");return s.className="lg-input__field lg-input__field--number"+(" lg-input__field--"+o),s.value=e.toFixed(i)+(t.units?t.units:""),s.tabIndex=t.tab_index,t.disabled&&(s.disabled=!0),t.tab_index&&(s.tabIndex=t.tab_index),s}createDragger(){const t=this.options,e=document.createElement("div");return e.className="lg-dragger__widget",t.disabled&&(e.className+=" lg-is-disabled"),e}initDom(){this.root.appendChild(this.wrap),this.wrap.appendChild(this.input),this.wrap.appendChild(this.dragger)}initEvent(){const t=this.options,e=this.precision;let i=[],o=null;const s=(b,y)=>{t.linear||(b=b>0?Math.pow(b,1.2):Math.pow(Math.abs(b),1.2)*-1);let m=t.step?t.step:1;y&&y.shiftKey?m*=10:y&&y.ctrlKey&&(m*=.1);let w=parseFloat(this.input.value)+b*m;t.max!=null&&w>t.max&&(w=t.max),t.min!=null&&w<t.min&&(w=t.min),this.value=w,this.input.value=w.toFixed(e),t.units&&(this.input.value+=t.units),U(this.input,"change")},a=b=>{o=this.input.ownerDocument,o.removeEventListener("mousemove",d),o.removeEventListener("mouseup",l),t.disabled||(this.root.requestPointerLock&&this.root.requestPointerLock(),o.addEventListener("mousemove",d),o.addEventListener("mouseup",l),i=[b.screenX,b.screenY],U(this.root,"start_dragging")),b.stopPropagation(),b.preventDefault()},l=b=>{U(this.root,"stop_dragging");const y=o||document;return o=null,y.removeEventListener("mousemove",d),y.removeEventListener("mouseup",l),y.exitPointerLock&&y.exitPointerLock(),U(this.dragger,"blur"),b.stopPropagation(),b.preventDefault(),!1},d=b=>{const y=b.screenX-i[0],m=i[1]-b.screenY;let w=[y,m];b.movementX!==void 0&&(w=[b.movementX,-b.movementY]),i=[b.screenX,b.screenY];const A=t.horizontal?0:1;return s(w[A],b),b.stopPropagation(),b.preventDefault(),!1},h=b=>{const y=b.deltaY?-b.deltaY/3:0;s(y>0?1:-1,b),b.stopPropagation(),b.preventDefault()},u=b=>{if(b.keyCode==gr)s(1,b);else if(b.keyCode==pr)s(-1,b);else return!1;return b.stopPropagation(),b.preventDefault(),!0},p=b=>{const y=parseFloat(this.input.value);if(!Number.isFinite(y)){this.input.value=this.value.toFixed(e)+(t.units?t.units:"");return}let m=y;t.max!=null&&m>t.max&&(m=t.max),t.min!=null&&m<t.min&&(m=t.min);const w=m!==this.value;this.value=m,m!==y&&(this.input.value=m.toFixed(e)+(t.units?t.units:"")),w&&b&&U(this.input,"change")},_=b=>{b.key==="Enter"&&p(!0)};this.dragger.addEventListener("mousedown",a),this.input.addEventListener("wheel",h,!1),this.input.addEventListener("keydown",u),this.input.addEventListener("keydown",_),this.input.addEventListener("change",()=>p(!1))}setRange(t,e){this.options.min=t,this.options.max=e}setValue(t,e=!1){const i=typeof t=="string"?parseFloat(t):t;this.value=i,this.options.precision&&(t=i.toFixed(this.options.precision)),this.options.units&&(t+=this.options.units),this.input.value=t.toString(),e||U(this.input,"change")}getValue(){return this.value}}class mr extends Q{constructor(t={}){super();c(this,"root");c(this,"left");c(this,"center");c(this,"right");c(this,"titleElement",null);this.root=document.createElement("header"),this.root.className=["lg-header-bar",t.variant==="area"?"lg-header-bar--area":"lg-header-bar--topbar",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),t.height!==void 0&&(this.root.style.height=typeof t.height=="number"?`${t.height}px`:t.height),this.left=this.createSlot("left"),this.center=this.createSlot("center"),this.right=this.createSlot("right"),this.root.append(this.left,this.center,this.right),t.title&&this.setTitle(t.title,t.titleIcon,t.titleTooltip),t.left&&this.setLeft(t.left),t.center&&this.setCenter(t.center),t.right&&this.setRight(t.right)}createSlot(t){const e=document.createElement("div");return e.className=`lg-header-bar__${t}`,e}append(t,e){const i=Array.isArray(e)?e:[e];for(const o of i)if(typeof o=="string"){const s=document.createElement("span");s.className="lg-header-bar__text",s.innerHTML=o,t.appendChild(s)}else t.appendChild(o);return this}setLeft(t){return this.left.innerHTML="",this.append(this.left,t)}setCenter(t){return this.center.innerHTML="",this.append(this.center,t)}setRight(t){return this.right.innerHTML="",this.append(this.right,t)}addLeft(t){return this.append(this.left,t)}addCenter(t){return this.append(this.center,t)}addRight(t){return this.append(this.right,t)}setTitle(t,e,i){if(this.titleElement||(this.titleElement=document.createElement("div"),this.titleElement.className="lg-header-bar__title",this.left.prepend(this.titleElement)),this.titleElement.innerHTML="",e){const s=document.createElement("span");s.className="lg-header-bar__icon",s.innerHTML=e,this.titleElement.appendChild(s)}const o=document.createElement("span");return o.className="lg-header-bar__title-text",o.textContent=t,this.titleElement.appendChild(o),i&&(this.titleElement.title=i),this}clear(){return this.left.innerHTML="",this.center.innerHTML="",this.right.innerHTML="",this.titleElement=null,this}show(){return this.root.style.display="",this}hide(){return this.root.style.display="none",this}appendTo(t){return t.appendChild(this.root),this}}class fr extends Q{constructor(t={}){super();c(this,"root");c(this,"header");c(this,"titleElement");c(this,"subtitleElement");c(this,"zoomElement");c(this,"viewport");c(this,"stage");c(this,"image");c(this,"empty");c(this,"zoom");c(this,"minZoom");c(this,"maxZoom");c(this,"panX",0);c(this,"panY",0);c(this,"dragging",!1);c(this,"dragX",0);c(this,"dragY",0);c(this,"autoFit");c(this,"naturalWidth",0);c(this,"naturalHeight",0);this.zoom=t.zoom??1,this.minZoom=t.minZoom??.1,this.maxZoom=t.maxZoom??8,this.autoFit=t.autoFit!==!1,this.root=document.createElement("div"),this.root.className=["lg-image-editor",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),t.checkerboard&&this.root.classList.add("lg-image-editor--checkerboard"),this.header=document.createElement("div"),this.header.className="lg-image-editor__header",this.titleElement=document.createElement("span"),this.titleElement.className="lg-image-editor__title",this.subtitleElement=document.createElement("span"),this.subtitleElement.className="lg-image-editor__subtitle",this.header.append(this.titleElement,this.subtitleElement);const e=document.createElement("span");e.className="lg-image-editor__spacer",this.header.appendChild(e),this.header.appendChild(this.createButton("−","Zoom Out",()=>this.setZoom(this.zoom/1.25,!0))),this.zoomElement=document.createElement("span"),this.zoomElement.className="lg-image-editor__zoom",this.header.appendChild(this.zoomElement),this.header.appendChild(this.createButton("+","Zoom In",()=>this.setZoom(this.zoom*1.25,!0))),this.header.appendChild(this.createButton("Fit","Fit Image",()=>this.fit(!0))),this.header.appendChild(this.createButton("1:1","Zoom 1:1",()=>this.resetView(!0))),this.root.appendChild(this.header),this.viewport=document.createElement("div"),this.viewport.className="lg-image-editor__viewport",this.stage=document.createElement("div"),this.stage.className="lg-image-editor__stage",this.image=document.createElement("img"),this.image.className="lg-image-editor__image",this.image.draggable=!1,this.image.alt=t.title||"Image",this.empty=document.createElement("div"),this.empty.className="lg-image-editor__empty",this.empty.textContent=t.emptyText||"No image",this.stage.append(this.image,this.empty),this.viewport.appendChild(this.stage),this.root.appendChild(this.viewport),this.setTitle(t.title||"Image",t.subtitle||""),t.src&&this.setSource(t.src),this.bindEvents(),this.applyTransform(),this.updateZoomLabel()}createButton(t,e,i){const o=document.createElement("button");return o.type="button",o.className="lg-image-editor__btn",o.textContent=t,o.title=e,o.setAttribute("aria-label",e),o.addEventListener("click",i),o}bindEvents(){this.image.addEventListener("load",()=>{this.naturalWidth=this.image.naturalWidth,this.naturalHeight=this.image.naturalHeight,this.image.classList.add("lg-image-editor__image--loaded"),this.empty.style.display="none",this.autoFit&&this.fit(!1),this.updateSubtitle()}),this.image.addEventListener("error",()=>{this.image.classList.remove("lg-image-editor__image--loaded"),this.empty.style.display=""}),this.viewport.addEventListener("pointerdown",t=>{t.button===0&&(t.preventDefault(),this.dragging=!0,this.dragX=t.clientX-this.panX,this.dragY=t.clientY-this.panY,this.viewport.classList.add("lg-image-editor__viewport--dragging"))}),window.addEventListener("pointermove",t=>{this.dragging&&(this.panX=t.clientX-this.dragX,this.panY=t.clientY-this.dragY,this.applyTransform())}),window.addEventListener("pointerup",()=>{this.dragging=!1,this.viewport.classList.remove("lg-image-editor__viewport--dragging")}),this.viewport.addEventListener("wheel",t=>{t.preventDefault();const e=t.deltaY<0?1.12:1/1.12;this.setZoom(this.zoom*e,!0)},{passive:!1}),this.viewport.addEventListener("dblclick",()=>this.resetView(!0))}setTitle(t,e){return this.titleElement.textContent=t,this.image.alt=t,e!==void 0?this.subtitleElement.textContent=e:this.updateSubtitle(),this}updateSubtitle(){this.naturalWidth&&this.naturalHeight&&(this.subtitleElement.textContent=`${this.naturalWidth} × ${this.naturalHeight} · ${Math.round(this.zoom*100)}%`)}setSource(t){return this.autoFit=!0,this.panX=0,this.panY=0,this.image.classList.remove("lg-image-editor__image--loaded"),this.empty.style.display="",this.image.src=t,this.applyTransform(),this.emit("source",t),this}getSource(){return this.image.getAttribute("src")||""}setZoom(t,e=!1){return this.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,t)),this.applyTransform(),this.updateZoomLabel(),this.updateSubtitle(),e&&this.emit("zoom",this.zoom),this}getZoom(){return this.zoom}fit(t=!1){const e=this.viewport.getBoundingClientRect();if(!this.naturalWidth||!this.naturalHeight||!e.width||!e.height)return this;const i=Math.min(e.width/this.naturalWidth,e.height/this.naturalHeight)*.92;return this.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,i)),this.panX=0,this.panY=0,this.applyTransform(),this.updateZoomLabel(),this.updateSubtitle(),t&&this.emit("zoom",this.zoom),this}resetView(t=!1){return this.zoom=1,this.panX=0,this.panY=0,this.applyTransform(),this.updateZoomLabel(),this.updateSubtitle(),t&&this.emit("zoom",this.zoom),this}applyTransform(){this.stage.style.transform=`translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`}updateZoomLabel(){this.zoomElement.textContent=`${Math.round(this.zoom*100)}%`}appendTo(t){return t.appendChild(this.root),this}}var br=typeof global=="object"&&global&&global.Object===Object&&global,vr=typeof self=="object"&&self&&self.Object===Object&&self,xr=br||vr||Function("return this")(),ke=xr.Symbol,vi=Object.prototype,_r=vi.hasOwnProperty,yr=vi.toString,se=ke?ke.toStringTag:void 0;function wr(r){var n=_r.call(r,se),t=r[se];try{r[se]=void 0;var e=!0}catch{}var i=yr.call(r);return e&&(n?r[se]=t:delete r[se]),i}var kr=Object.prototype,Er=kr.toString;function Sr(r){return Er.call(r)}var Cr="[object Null]",Lr="[object Undefined]",Jn=ke?ke.toStringTag:void 0;function Ar(r){return r==null?r===void 0?Lr:Cr:Jn&&Jn in Object(r)?wr(r):Sr(r)}var Tr=Array.isArray;function Mr(r){var n=typeof r;return r!=null&&(n=="object"||n=="function")}var zr="[object AsyncFunction]",Ir="[object Function]",Nr="[object GeneratorFunction]",Pr="[object Proxy]";function $r(r){if(!Mr(r))return!1;var n=Ar(r);return n==Ir||n==Nr||n==zr||n==Pr}class xi extends Q{constructor(t=[],e={}){var i;super();c(this,"canvas");c(this,"selected",-1);c(this,"last_mouse",[0,0]);c(this,"value");c(this,"xrange");c(this,"yrange");c(this,"defaulty");c(this,"no_trespassing");c(this,"show_samples");c(this,"bgcolor");c(this,"pointscolor");c(this,"linecolor");c(this,"options");c(this,"root");this.root=document.createElement("div"),this.root.className="curve "+(e.extraclass||""),this.root.style.minHeight="50px",this.root.style.width=((i=e.width)==null?void 0:i.toString())||"100%",this.root.style.minWidth="50px",this.root.style.minHeight="20px",this.bgcolor=e.bgcolor||"#222",this.pointscolor=e.pointscolor||"#5AF",this.linecolor=e.linecolor||"#444",this.value=t,this.xrange=e.xrange||[0,1],this.yrange=e.yrange||[0,1],this.defaulty=e.defaulty??.5,this.no_trespassing=e.no_trespassing||!1,this.show_samples=e.show_samples||0,this.options=e,this.canvas=document.createElement("canvas"),this.canvas.width=e.width||200,this.canvas.height=e.height||50,this.root.appendChild(this.canvas),this.root.addEventListener("mousedown",this.onmousedown.bind(this)),this.redraw()}convert(t){return[this.canvas.width*((this.xrange[1]-this.xrange[0])*t[0]+this.xrange[0]),this.canvas.height*((this.yrange[1]-this.yrange[0])*t[1]+this.yrange[0])]}unconvert(t){return[(t[0]/this.canvas.width-this.xrange[0])/(this.xrange[1]-this.xrange[0]),(t[1]/this.canvas.height-this.yrange[0])/(this.yrange[1]-this.yrange[0])]}getValueAt(t){if(t<this.xrange[0]||t>this.xrange[1])return this.defaulty;let e=[this.xrange[0],this.defaulty],i=0;for(const s of this.value){if(t===s[0])return s[1];if(t<s[0])return i=(t-e[0])/(s[0]-e[0]),e[1]*(1-i)+s[1]*i;e=s}const o=[this.xrange[1],this.defaulty];return i=(t-e[0])/(o[0]-e[0]),e[1]*(1-i)+o[1]*i}resample(t){const e=[],i=(this.xrange[1]-this.xrange[0])/t;for(let o=this.xrange[0];o<=this.xrange[1];o+=i)e.push(this.getValueAt(o));return e}addValue(t){for(let e=0;e<this.value.length;e++)if(!(this.value[e][0]<t[0])){this.value.splice(e,0,t),this.redraw();return}this.value.push(t),this.redraw()}redraw(){const t=this.root.getBoundingClientRect();t&&this.canvas.width!==t.width&&t.width&&t.width<1e3&&(this.canvas.width=t.width),t&&this.canvas.height!==t.height&&t.height&&t.height<1e3&&(this.canvas.height=t.height);const e=this.canvas.getContext("2d");e.setTransform(1,0,0,1,0,0),e.translate(0,this.canvas.height),e.scale(1,-1),e.fillStyle=this.bgcolor,e.fillRect(0,0,this.canvas.width,this.canvas.height),e.strokeStyle=this.linecolor,e.beginPath();let i=this.convert([this.xrange[0],this.defaulty]);e.moveTo(i[0],i[1]);for(const o of this.value)i=this.convert(o),e.lineTo(i[0],i[1]);i=this.convert([this.xrange[1],this.defaulty]),e.lineTo(i[0],i[1]),e.stroke();for(let o=0;o<this.value.length;o++){const s=this.value[o];i=this.convert(s),e.fillStyle=this.selected===o?"white":this.pointscolor,e.beginPath(),e.arc(i[0],i[1],this.selected===o?4:2,0,Math.PI*2),e.fill()}if(this.show_samples){const o=this.resample(this.show_samples);e.fillStyle="#888";for(let s=0;s<o.length;s++){const a=[s*((this.xrange[1]-this.xrange[0])/this.show_samples)+this.xrange[0],o[s]];i=this.convert(a),e.beginPath(),e.arc(i[0],i[1],2,0,Math.PI*2),e.fill()}}}distance(t,e){return Math.sqrt(Math.pow(e[0]-t[0],2)+Math.pow(e[1]-t[1],2))}computeSelected(t,e){let o=1e5,s=-1;for(let a=0;a<this.value.length;a++){const l=this.value[a],d=this.convert(l),h=this.distance([t,e],d);h<o&&h<8&&(o=h,s=a)}return s}sortValues(){let t=null;this.selected!==-1&&(t=this.value[this.selected]),this.value.sort((e,i)=>e[0]-i[0]),t&&(this.selected=this.value.indexOf(t))}onchange(){this.options.callback?this.options.callback.call(this,this.value):U(this,"change")}onmousedown(t){document.addEventListener("mousemove",this.onmousemove.bind(this)),document.addEventListener("mouseup",this.onmouseup.bind(this));const e=this.canvas.getBoundingClientRect(),i=t.clientX-e.left,o=t.clientY-e.top;if(this.selected=this.computeSelected(i,this.canvas.height-o),this.selected===-1){const s=this.unconvert([i,this.canvas.height-o]);this.value.push(s),this.sortValues(),this.selected=this.value.indexOf(s)}this.last_mouse=[i,o],this.redraw(),t.preventDefault(),t.stopPropagation()}onmousemove(t){const e=this.canvas.getBoundingClientRect();let i=t.clientX-e.left,o=t.clientY-e.top;if(i=Math.max(0,Math.min(i,this.canvas.width)),o=Math.max(0,Math.min(o,this.canvas.height)),this.selected!==-1&&this.distance([t.clientX-e.left,t.clientY-e.top],[i,o])>this.canvas.height*.5){this.value.splice(this.selected,1),this.onmouseup(t);return}const s=this.last_mouse[0]-i,a=this.last_mouse[1]-o,l=this.unconvert([-s,a]);if(this.selected!==-1){let d=this.xrange[0],h=this.xrange[1];this.no_trespassing&&(this.selected>0&&(d=this.value[this.selected-1][0]),this.selected<this.value.length-1&&(h=this.value[this.selected+1][0]));const u=this.value[this.selected];u[0]=Math.max(d,Math.min(h,u[0]+l[0])),u[1]=Math.max(this.yrange[0],Math.min(this.yrange[1],u[1]+l[1]))}this.sortValues(),this.redraw(),this.last_mouse=[i,o],this.onchange(),t.preventDefault(),t.stopPropagation()}onmouseup(t){this.selected=-1,this.redraw(),document.removeEventListener("mousemove",this.onmousemove.bind(this)),document.removeEventListener("mouseup",this.onmouseup.bind(this)),this.onchange(),t.preventDefault(),t.stopPropagation()}}class _i{constructor(n,t,e={}){c(this,"root");c(this,"items",[]);c(this,"callback");this.root=document.createElement("ul"),this.root.id=n,this.root.className="lg-list",this.root.setAttribute("role","listbox"),this.callback=e.callback,this.items=t;for(const i of t){const o=this.createItem(i);o.addEventListener("click",()=>{this.selectElement(o,!0)}),this.root.appendChild(o)}e.parent&&("root"in e.parent?e.parent.root:e.parent).appendChild(this.root)}itemValue(n){return typeof n=="string"?n:n.value||n.label||""}selectElement(n,t){var i;this.root.querySelectorAll(".lg-list__item").forEach(o=>{o.classList.remove("lg-is-selected"),o.setAttribute("aria-selected","false")}),n.classList.add("lg-is-selected"),n.setAttribute("aria-selected","true");const e=n.dataset.value||"";this.items.forEach(o=>{typeof o!="string"&&(o.checked=this.itemValue(o)===e)}),t&&((i=this.callback)==null||i.call(this,n))}createItem(n){const t=document.createElement("li");t.className="lg-list__item",t.setAttribute("role","option"),t.setAttribute("aria-selected","false"),t.dataset.value=this.itemValue(n),typeof n!="string"&&n.id&&(t.id=n.id),t.textContent=t.dataset.value||"";const e=document.createElement("span");return e.className="lg-list__arrow",t.appendChild(e),t}getSelectedItem(){return this.root.querySelector(".lg-list__item.lg-is-selected")}getSelectedValue(){var n;return((n=this.getSelectedItem())==null?void 0:n.dataset.value)??null}setSelectedItem(n){const t=Array.from(this.root.querySelectorAll(".lg-list__item")).find(e=>e.dataset.value===n);return t?(this.selectElement(t,!0),!0):!1}clear(){this.root.innerHTML="",this.items=[]}}const Vr="lg-menu",Br="lg-menu__list",Dr="lg-menu__item",Or="lg-menu__panel",Hr="lg-menu__panel-item";class On{constructor(n,t=null,e=null){c(this,"name");c(this,"data");c(this,"separator");c(this,"element");c(this,"parent");c(this,"children");this.name=n,this.parent=t,this.children=[],this.data=e,this.separator=!1,this.element=null}disable(){this.data&&(this.data.disabled=!0)}enable(){this.data&&(this.data.disabled=!1)}static create(n,t,e=null){return new On(n,t,e)}}class Ee{constructor(n,t={}){c(this,"root");c(this,"menus");c(this,"panels");c(this,"content");c(this,"is_open",!1);c(this,"auto_open",!1);c(this,"sort_entries",!1);c(this,"closing_by_leave",null);c(this,"container");c(this,"currentMainMenuItem",null);t=t||{},this.menus=[],this.panels=[],this.root=document.createElement("div"),this.root.className=Vr,this.root.id=n,this.content=document.createElement("ul"),this.content.className=Br,this.content.setAttribute("role","menubar"),this.root.appendChild(this.content),this.is_open=!1,this.auto_open=t.auto_open||!1,this.sort_entries=t.sort_entries||!1,this.container=t.container,this.bindDismissEvents()}bindDismissEvents(){const n=()=>{this.is_open&&(this.is_open=!1,this.hideMenuPanel())},t=e=>e instanceof Node?this.root.contains(e)?!0:this.panels.some(i=>i.contains(e)):!1;document.addEventListener("mousedown",e=>{this.is_open&&(t(e.target)||n())},!0),document.addEventListener("keydown",e=>{(e.key==="Escape"||e.key==="Esc")&&n()})}add(n,t={}){const e=this.menus.length,i=n.split("/");if(i.length>5)throw new Error("Menu too deep");let o=0,s=null,a=this.menus;for(;o<i.length;){const l=a.find(d=>d.name===i[o]);if(l)s=l,o++,a=s.children;else{const d=o===i.length-1,h=On.create(i[o],s,d?t:null);a.push(h),s=h,o++,a=s.children}}e!==this.menus.length&&this.updateMainMenu()}remove(n){const t=this.findMenu(n);if(!t)return!1;if(!t.parent||!t.parent.children)return console.warn("menu without parent?");var e=t.parent.children.indexOf(t);e!=-1&&t.parent.children.splice(e,1)}separator(n,t){var i;const e=this.findMenu(n);return e?((i=e.children)==null||i.push({separator:!0,order:t||10}),!0):!1}findMenu(n){const t=n.split("/");let e=0,i=this.menus;for(;e<t.length&&i.length>0;){const o=i.find(s=>s.name===t[e]);if(!o)return null;if(e===t.length-1)return o;i=o.children||[],e++}return null}clear(){this.content.innerHTML="",this.menus=[],this.panels=[]}createMainMenuItemElement(n){const t=document.createElement("li");t.className=Dr,t.setAttribute("role","menuitem"),t.setAttribute("aria-haspopup","true");const e=document.createElement("span");e.className="lg-menu__icon";const i=document.createElement("span");return i.className="lg-menu__name",i.textContent=n.name,t.append(e,i),t.addEventListener("click",o=>{const s=n;s.data&&s.data.callback&&typeof s.data.callback=="function"&&s.data.callback(s.data),this.is_open?(this.is_open=!1,this.hideMenuPanel()):(this.is_open=!0,this.currentMainMenuItem=s,this.showMenuPanel(s,o,t))}),t.addEventListener("mouseenter",o=>{this.is_open&&this.currentMainMenuItem!==n&&(this.hideMenuPanel(),this.currentMainMenuItem=n,this.showMenuPanel(n,o,t))}),t}createPanelItemElement(n){return document.createElement("p")}updateMainMenu(){this.content.innerHTML="",this.menus.forEach(n=>{const t=this.createMainMenuItemElement(n);n.element=t,this.content.appendChild(t)})}showMenuPanel(n,t,e,i=!1,o=1){var u;if(i?this.closePanelsFromLevel(o):this.hideMenuPanel(),!n.children||!n.children.length)return!1;this.closing_by_leave&&clearInterval(this.closing_by_leave);const s=document.createElement("div");s.className=Or,s.setAttribute("role","menu"),s.dataset.level=String(o);const a=Array.from(n.children);this.sort_entries&&a.sort((p,_)=>{let b=10,y=10;return p&&p.data&&p.data.order!=null&&(b=p.data.order),p&&p.separator&&p.order!=null&&(b=p.order),_&&_.data&&_.data.order!=null&&(y=_.data.order),_&&_.separator&&_.order!=null&&(y=_.order),b-y});for(var l in a){const p=document.createElement("p"),_=a[l];p.className=Hr,p.setAttribute("role","menuitem");const b=(u=_.children)==null?void 0:u.length;if(b&&p.classList.add("lg-menu__panel-item--has-submenu"),_.name){const y=document.createElement("span");y.className="lg-menu__icon";const m=document.createElement("span");m.className="lg-menu__name",m.textContent=_.name,p.append(y,m);const w=_.data&&_.data.shortcut;if(w){const A=document.createElement("span");A.className="lg-menu__shortcut",A.textContent=String(w),p.appendChild(A)}if(b){const A=document.createElement("span");A.className="lg-menu__more",A.textContent="+",p.appendChild(A)}}else p.classList.add("lg-menu__panel-item--separator"),p.setAttribute("role","separator");if(_.data){var d=_.data,h=d.type=="checkbox"&&d.instance&&d.property&&d.instance[d.property]==!0||d.checkbox==!0||d.instance&&d.property&&Object.prototype.hasOwnProperty.call(d,"value")&&d.instance[d.property]==d.value||typeof d.isChecked=="function"&&d.isChecked.call(d.instance,d);h&&(p.className+=" lg-menu__panel-item--checked"),d.disabled&&(p.className+=" lg-menu__panel-item--disabled")}p.addEventListener("click",y=>{const m=_.data;if(m){if(m.disabled)return;m.instance&&m.property&&(m.type=="checkbox"?(m.instance[m.property]=!m.instance[m.property],m.instance[m.property]?p.classList.add("lg-menu__panel-item--checked"):p.classList.remove("lg-menu__panel-item--checked")):Object.prototype.hasOwnProperty.call(m,"value")&&(m.instance[m.property]=m.value)),m.checkbox!=null&&(m.checkbox=!m.checkbox,m.checkbox?p.classList.add("lg-menu__panel-item--checked"):p.classList.remove("lg-menu__panel-item--checked")),m.callback&&typeof m.callback=="function"&&m.callback(m)}_.children&&_.children.length?this.showMenuPanel(_,y,p,!0,o+1):(this.is_open=!1,this.hideMenuPanel())}),p.addEventListener("mouseenter",function(y){}),s.appendChild(p)}return s.addEventListener("mouseenter",()=>{this.closing_by_leave&&clearInterval(this.closing_by_leave),this.closing_by_leave=null}),s.style.visibility="hidden",this.panels.push(s),(this.container||Bn()).appendChild(s),this.positionPanel(s,e,i),s.style.visibility="",!0}positionPanel(n,t,e){const i=t.getBoundingClientRect(),o=n.getBoundingClientRect(),s=document.documentElement.clientWidth||window.innerWidth,a=document.documentElement.clientHeight||window.innerHeight;let l,d;e?(l=i.right-1,d=i.top,l+o.width>s&&(l=i.left-o.width+1),d+o.height>a&&(d=a-o.height-4)):(l=i.left,d=i.bottom+2,l+o.width>s&&(l=s-o.width-4),d+o.height>a&&(d=i.top-o.height-2)),l=Math.max(4,Math.min(l,s-o.width-4)),d=Math.max(4,Math.min(d,a-o.height-4)),n.style.left=`${Math.round(l)}px`,n.style.top=`${Math.round(d)}px`}closePanelsFromLevel(n){const t=[];for(const e of this.panels)Number(e.dataset.level??1)>=n?ye(e):t.push(e);this.panels=t}hideMenuPanel(){if(!this.panels.length)return!1;for(var n in this.panels)ye(this.panels[n]);return this.panels=[],!0}attachToPanel(n){n.content.insertBefore(this.root,n.content.firstChild)}}c(Ee,"closing_time",500);class Hn extends Q{constructor(t={},e={}){super();c(this,"id");c(this,"options");c(this,"root");c(this,"header");c(this,"titleElement");c(this,"content");c(this,"footer");const i=typeof t=="string"?{...e,id:t}:t||{};this.options=i,this.id=i.id||"",this.root=this.createElementRoot(),this.header=this.createElementHeader(),this.titleElement=this.header.querySelector(".lg-panel__title"),this.content=this.createElementContent(),this.footer=this.createElementFooter(),this.initDom(),this.initStyle()}createElementRoot(){const t=document.createElement("div");return this.id&&(t.id=this.id),t.className="lg-panel "+(this.options.className||""),t}createElementHeader(){const t=document.createElement("div");t.className="lg-panel__header";const e=document.createElement("span");if(e.className="lg-panel__title",e.textContent=this.options.title||"",t.appendChild(e),this.options.close){const i=document.createElement("button");i.type="button",i.className="lg-button__control lg-button__control--mini lg-panel__close",i.textContent="×",i.title="Close",i.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.close()}),t.appendChild(i)}return!this.options.title&&!this.options.close&&(t.style.display="none"),t}createElementContent(){const t=document.createElement("div");return t.className="lg-panel__content",this.options.content&&(t.innerHTML=this.options.content),t}createElementFooter(){const t=document.createElement("div");return t.className="lg-panel__footer",t}initDom(){this.root.appendChild(this.header),this.root.appendChild(this.content),this.root.appendChild(this.footer)}initStyle(){const t=this.options;t.width&&(this.root.style.width=Mt(t.width)),t.height&&(this.root.style.height=Mt(t.height)),t.position&&(this.root.style.position="absolute",this.root.style.left=Mt(t.position[0]),this.root.style.top=Mt(t.position[1])),t.scroll==!0&&(this.content.style.overflow="auto")}add(t){this.content.appendChild(t.root||t)}setTitle(t){return this.titleElement.textContent=t,this}close(){var t;return(t=this.root.parentElement)==null||t.removeChild(this.root),this.emit("closed",this),this}show(){return this.root.style.display="",this}hide(){return this.root.style.display="none",this}clear(){return this.content.innerHTML="",this}}c(Hn,"TITLE_HEIGHT","20px");class yi{constructor(n="",t={}){c(this,"root");c(this,"input");c(this,"options");this.options=t,this.root=this.createElementRoot(),this.input=this.createElementInput(n),this.initDom(),this.initEvent()}createElementRoot(){const n=document.createElement("div");return n.className="lg-searchbox",n.setAttribute("role","search"),n}createElementInput(n){const t=document.createElement("input");return t.className="lg-searchbox__input",t.value=n,t.type="search",t.placeholder=this.options.placeholder??"Search",t.setAttribute("aria-label",this.options.placeholder??"Search"),t}initDom(){this.root.appendChild(this.input)}initEvent(){this.input.onchange=n=>{var e,i;const t=n.target.value;(i=(e=this.options).callback)==null||i.call(e,t)}}setValue(n){this.input.value=n,this.input.dispatchEvent(new Event("change"))}getValue(){return this.input.value}}class wi{constructor(n,t={}){c(this,"root");c(this,"value");c(this,"docBinded",null);c(this,"onChange");c(this,"handleMouseDown",n=>{this.setFromX(n.offsetX||n.layerX),this.docBinded=this.root.ownerDocument,this.docBinded.addEventListener("mousemove",this.handleMouseMove),this.docBinded.addEventListener("mouseup",this.handleMouseUp),n.preventDefault(),n.stopPropagation()});c(this,"handleMouseMove",n=>{const t=this.root.getBoundingClientRect();if(!t)return;const e=n.clientX===void 0?n.pageX:n.clientX;this.setFromX(e-t.left),n.preventDefault()});c(this,"handleKeyDown",n=>{const t=this.options.min??0,e=this.options.max??1,i=this.options.step??(e-t)/100;let o=null;n.key==="ArrowRight"||n.key==="ArrowUp"?o=this.value+i:n.key==="ArrowLeft"||n.key==="ArrowDown"?o=this.value-i:n.key==="Home"?o=t:n.key==="End"&&(o=e),o!==null&&(this.setValue(o),n.preventDefault(),n.stopPropagation())});c(this,"handleMouseUp",n=>{const t=this.docBinded||document;this.docBinded=null,t.removeEventListener("mousemove",this.handleMouseMove),t.removeEventListener("mouseup",this.handleMouseUp),n.preventDefault()});this.options=t,this.root=document.createElement("div"),this.value=n,this.root.className="lg-slider",this.root.setAttribute("role","slider"),this.root.tabIndex=0,this.root.addEventListener("mousedown",this.handleMouseDown),this.root.addEventListener("keydown",this.handleKeyDown),this.setValue(n,!0)}setFromX(n){const t=this.root.getBoundingClientRect();if(!t||!t.width)return;const e=Math.max(0,Math.min(1,n/t.width)),i=this.options.min??0,o=this.options.max??1;this.setValue(i+(o-i)*e)}setValue(n,t=!1){var d;const e=this.options.min??0,i=this.options.max??1;n=Math.max(e,Math.min(i,n));const o=i-e,s=o===0?0:(n-e)/o,a=`${(s*100).toFixed(1)}%`,l=`${(s*100+2).toFixed(1)}%`;this.root.style.background=`linear-gradient(to right, #999 ${a}, #FC0 ${l}, #333 ${l})`,this.root.setAttribute("aria-valuemin",String(e)),this.root.setAttribute("aria-valuemax",String(i)),this.root.setAttribute("aria-valuenow",String(n)),n!==this.value&&(this.value=n,t||(U(this.root,"change",n),(d=this.onChange)==null||d.call(this,n)))}getValue(){return this.value}setRange(n,t){return this.options.min=n,this.options.max=t,this.setValue(this.value,!0),this}focus(){return this.root.focus(),this}}class ki{constructor(n,t={}){c(this,"root");c(this,"sections",[]);c(this,"vertical");this.vertical=!!t.vertical,this.root=this.createRoot(t),this.sections=[],n.forEach((e,i)=>{const o=this.createSection(t,e);o.element.classList.add("lg-split__section--"+i),this.root.appendChild(o.element),this.sections.push(o)}),t.parent&&(t.parent.root?t.parent.root.appendChild(this.root):t.parent.appendChild(this.root))}addSection(n){const t=this.createSection({vertical:this.vertical},n);this.root.appendChild(t.element),this.sections.push(t)}getSection(n){return this.sections[n]}createRoot(n){const t=document.createElement("div");return t.className="lg-split",t.classList.add(n.vertical?"lg-split--vertical":"lg-split--horizontal"),n.id&&(t.id=n.id),t}createSection(n={},t){const e=document.createElement("div");return e.className="lg-split__section",typeof t=="number"?n.vertical?e.style.height=t.toFixed(1)+"%":e.style.width=t.toFixed(1)+"%":typeof t=="string"?n.vertical?e.style.height=t:e.style.width=t:(t.id&&(e.id=t.id),n.vertical?t.height!==void 0&&(e.style.height=typeof t.height=="number"?t.height.toFixed(1)+"%":t.height):t.width!==void 0&&(e.style.width=typeof t.width=="number"?t.width.toFixed(1)+"%":t.width)),{element:e,add:i=>{i instanceof HTMLElement?e.appendChild(i):e.appendChild(i.element)}}}}class Ei extends Q{constructor(t={}){super();c(this,"root");c(this,"header");c(this,"data",[]);c(this,"rows",[]);c(this,"columns",[]);c(this,"column_fields",[]);c(this,"_must_update_header",!0);c(this,"allowHTML",!1);this.allowHTML=!!t.allowHTML,this.root=this.createRoot(),this.header=document.createElement("tr"),t.columns&&this.setColumns(t.columns),t.rows&&this.setRows(t.rows,!1),t.scrollable&&(this.root.style.overflow="auto"),t.height&&(this.root.style.height=Mt(t.height))}createRoot(){const t=document.createElement("table");return t.classList.add("lg-table"),t}setRows(t,e=!1){this.data=t,this.updateContent(e)}addRow(t,e=!1){const i=document.createElement("tr");for(let o=0;o<this.column_fields.length;++o){const s=document.createElement("td"),a=Array.isArray(t)?t[o]:t[this.column_fields[o]];this.setCellValue(s,a);const l=this.columns[o];if(!l)break;l.className&&(s.className=l.className),l.width&&(s.style.width=String(l.width)),i.appendChild(s)}return this.root.appendChild(i),this.rows.push(i),e||this.data.push(t),i}updateRow(t,e){this.data[t]=e;const i=this.rows[t];if(!i)return null;const o=i.querySelectorAll("td");for(let s=0;s<o.length;++s){const a=this.columns[s];if(!a)continue;const l=Array.isArray(e)?e[s]:e[a.field];this.setCellValue(o[s],l)}return i}updateCell(t,e,i){const o=this.rows[t];if(!o)return null;const s=o.children[e];return s?(this.setCellValue(s,i),s):null}setCellValue(t,e){const i=e==null?"":String(e);this.allowHTML?t.innerHTML=i:t.textContent=i}setColumns(t){this.columns.length=0,this.column_fields.length=0;const e=Math.floor(100/t.length).toFixed(1)+"%",i=[];for(let o=0;o<t.length;++o){const s=t[o];if(s==null)continue;const a=typeof s=="string"||typeof s=="number",l=a?String(s):s.name??"",d=a?String(s).toLowerCase():(s.field??l).toLowerCase(),h=a?void 0:s.width,u=a?void 0:s.className,p={name:l,width:Mt(h===void 0?e:h),field:d,className:u};o===t.length-1?p.width=i.length?`calc(100% - (${i.join(" + ")}))`:"100%":i.push(String(p.width)),this.columns.push(p),this.column_fields.push(d)}this._must_update_header=!0,this.updateContent()}updateContent(t=!1){if(this.root.innerHTML="",this._must_update_header){this.header=document.createElement("tr");for(let e=0;e<this.columns.length;++e){const i=this.columns[e],o=document.createElement("th");o.scope="col",o.textContent=i.name??"",i.width&&(o.style.width=String(i.width)),i.th=o,this.header.appendChild(o)}this._must_update_header=!1}if(this.root.appendChild(this.header),!this.data)return!1;if(this.data.length!==this.rows.length&&(t=!1),t)for(let e=0;e<this.rows.length;++e){const i=this.updateRow(e,this.data[e]);i&&this.root.appendChild(i)}else{this.rows.length=0;for(let e=0;e<this.data.length;++e)this.addRow(this.data[e],!0)}return!0}}class Rr{constructor(){c(this,"id");c(this,"content");c(this,"title");c(this,"tab");c(this,"options");c(this,"onclose");c(this,"selected");this.id="",this.content=document.createElement("div"),this.title=document.createElement("span"),this.selected=!1}add(n){this.content.appendChild(n.root||n)}setTitle(n){this.title.innerHTML=n}click(){U(this,"click")}destroy(){}}const gt=class gt{constructor(n={},t){c(this,"options");c(this,"mode");c(this,"root",document.createElement("div"));c(this,"current_tab");c(this,"previous_tab");c(this,"plus_tab");c(this,"_timeout_mouseover");c(this,"list",document.createElement("ul"));c(this,"tabs_root");c(this,"tabs");c(this,"tabs_by_index");c(this,"selected");c(this,"onchange");if(t||typeof n=="string"){const o=n;n=t||{},n.id=o,me("tabs-legacy-args","Tabs(id, options) is deprecated; use Tabs(options).")}this.options=n,this.mode=n.mode||"horizontal";const e=document.createElement("div");n.id&&(e.id=n.id),e.className="lg-tabs lg-tabs--"+this.mode,this.root=e,this.current_tab=null,this.mode==="horizontal"?n.size&&(this.root.style.height=n.size==="full"?"100%":n.size):this.mode==="vertical"&&n.size&&(this.root.style.width=n.size==="full"?"100%":n.size),n.width&&(this.root.style.width=typeof n.width=="number"?`${n.width.toFixed(0)}px`:n.width),n.height&&(this.root.style.height=typeof n.height=="number"?`${n.height.toFixed(0)}px`:n.height);const i=document.createElement("ul");i.className="lg-tabs__list",this.mode==="vertical"?i.style.width=`${gt.tabs_width}px`:i.style.height=`${gt.tabs_height}px`,this.list=i,i.setAttribute("role","tablist"),this.root.appendChild(i),this.tabs_root=i,this.tabs={},this.tabs_by_index=[],this.selected=null,this.onchange=n.callback,n.parent&&this.appendTo(n.parent)}show(){this.root.style.display="block"}hide(){this.root.style.display="none"}getCurrentTab(){return this.current_tab?this.tabs[this.current_tab[0]]:null}getCurrentTabId(){return this.current_tab?this.current_tab[0]:null}getPreviousTab(){return this.previous_tab?this.tabs[this.previous_tab[0]]:null}appendTo(n,t=!1){t?n.prepend(this.root):n.appendChild(this.root)}getTab(n){return this.tabs[n]}getTabByIndex(n){return this.tabs_by_index[n]}getNumOfTabs(){return Object.keys(this.tabs).length}getTabContent(n){const t=this.tabs[n];if(t)return t.content}getTabIndex(n){const t=this.tabs[n];if(!t)return-1;for(var e=0;e<this.list.childNodes.length;e++)if(this.list.childNodes[e]==t.tab)return e;return-1}addTab(n,t,e){var h;t=t||{},typeof t=="function"&&(t={callback:t});var i=this;n==null&&(n="rand_"+(Math.random()*1e6|0));var o=document.createElement("LI");if(o.className="lg-tabs__tab ",o.dataset.id=n,o.innerHTML="<span class='lg-tabs__tab-title'>"+(t.title||n)+"</span>",t.button&&(o.className+="lg-tabs__tab--button "),t.tab_className&&(o.className+=t.tab_className),t.bigicon&&(o.innerHTML="<img class='lg-tabs__tab-icon' src='"+t.bigicon+"'/>"+o.innerHTML),t.closable&&(o.innerHTML+="<span class='lg-tabs__tab-close'>Close</span>",o.querySelector("span.lg-tabs__tab-close").addEventListener("click",function(u){i.removeTab(n),u.preventDefault(),u.stopPropagation()},!0)),t.index!==void 0){var s=this.list.childNodes[t.index];s?this.list.insertBefore(o,s):this.list.appendChild(o)}else(h=this.plus_tab)!=null&&h.tab?this.list.insertBefore(o,this.plus_tab.tab):this.list.appendChild(o);t.tab_width&&(o.style.width=t.tab_width.constructor===Number?t.tab_width.toFixed(0)+"px":t.tab_width,o.style.minWidth="0"),this.options.autoswitch&&(o.classList.add("lg-tabs__tab--autoswitch"),o.addEventListener("dragenter",function(u){i._timeout_mouseover&&clearTimeout(i._timeout_mouseover),i._timeout_mouseover=setTimeout((function(){U(o,"click"),i._timeout_mouseover=null}).bind(this),500)}),o.addEventListener("dragleave",function(u){i._timeout_mouseover&&(clearTimeout(i._timeout_mouseover),i._timeout_mouseover=null)}));var a=document.createElement("div");t.id&&(a.id=t.id),a.className="lg-tabs__panel "+(t.className||""),a.dataset.id=n,a.style.display="none",a.setAttribute("role","tabpanel"),a.setAttribute("aria-hidden","true"),o.setAttribute("role","tab"),o.setAttribute("aria-selected","false"),o.tabIndex=-1,this.mode=="horizontal"?t.size&&(a.style.overflow="auto",t.size=="full"?(a.style.width="100%",a.style.height="calc( 100% - "+gt.tabs_height+"px )",a.style.height="-moz-calc( 100% - "+gt.tabs_height+"px )",a.style.height="-webkit-calc( 100% - "+gt.tabs_height+"px )"):a.style.height=t.size):this.mode=="vertical"&&t.size&&(a.style.overflow="auto",t.size=="full"?(a.style.height="100%",a.style.width="calc( 100% - "+gt.tabs_width+"px )",a.style.width="-moz-calc( 100% - "+gt.tabs_width+"px )",a.style.width="-webkit-calc( 100% - "+gt.tabs_width+"px )"):a.style.width=t.size),t.width!==void 0&&(a.style.width=typeof t.width=="string"?t.width:t.width+"px"),t.height!==void 0&&(a.style.height=typeof t.height=="string"?t.height:t.height+"px"),t.content&&(typeof t.content=="string"?a.innerHTML=t.content:a.appendChild(t.content)),this.root.appendChild(a),t.button?o.addEventListener("click",function(u){var p=this.dataset.id;t.callback&&t.callback(p,u)}):o.addEventListener("click",()=>{this.onTabClicked(o)});const l=o.querySelector("span.lg-tabs__tab-title"),d=new Rr;return d.id=n,d.tab=o,d.content=a,d.title=l||d.title,d.options=t,t.onclose&&(d.onclose=t.onclose),this.tabs[n]=d,this.recomputeTabsByIndex(),o.addEventListener("contextmenu",u=>(u.button!=2||(u.preventDefault(),t.callback_context&&t.callback_context.call(d)),!1)),(t.selected==!0||this.selected==null)&&this.selectTab(n,t.skip_callbacks),d}addPlusTab(n){if(this.plus_tab){console.warn("该标签组件中已存在加号标签页");return}return this.plus_tab=this.addTab("plus_tab",{title:"+",tab_width:20,button:!0,callback:n,skip_callbacks:!0}),this.plus_tab}addButtonTab(n,t,e){return this.addTab(n,{title:t,tab_width:20,button:!0,callback:e,skip_callbacks:!0})}onTabClicked(n,t=!0){var s;const e=n.dataset.id;if(!e)return;const i=this.tabs[e];if(!i)return;const o=i.options||{};if(!(o.callback_canopen&&o.callback_canopen()===!1)){this.current_tab&&this.current_tab[0]!==e&&((s=this.current_tab[2])!=null&&s.callback_leave)&&this.current_tab[2].callback_leave(this.current_tab[0],this.current_tab[1],this.current_tab[2]);for(const a in this.tabs){const l=this.tabs[a];a===e?(l.selected=!0,l.content.style.display="",l.content.setAttribute("aria-hidden","false")):(delete l.selected,l.content.style.display="none",l.content.setAttribute("aria-hidden","true"))}this.list.querySelectorAll("li.lg-tabs__tab").forEach(a=>{const l=a===n;a.classList.toggle("lg-tabs__tab--selected",l),a.setAttribute("aria-selected",l?"true":"false"),a.tabIndex=l?0:-1}),this.previous_tab=this.current_tab,this.current_tab=[e,i.content,o],this.selected=e,t&&(o.callback&&o.callback(e,i.content,n),U(this,"wchange",[e,i.content]),this.onchange&&this.onchange(e,i.content))}}selectTab(n,t=!1){if(!n)return;typeof n!="string"&&(n=n.id);const e=this.tabs[n];!e||!e.tab||this.onTabClicked(e.tab,!t)}setTabVisibility(n,t){const e=this.tabs[n];e&&(e.tab.style.display=t?null:"none",e.content.style.display=t?null:"none")}recomputeTabsByIndex(){this.tabs_by_index=[],Array.from(this.list.children).forEach((t,e)=>{const i=t.getAttribute("data-id");i&&this.tabs[i]&&(this.tabs_by_index[e]=this.tabs[i])})}removeTab(n){var t=this.tabs[n];if(!t){console.warn("tab not found: "+n);return}t.onclose&&t.onclose(t),t.tab.parentNode&&t.tab.parentNode.removeChild(t.tab),t.content.parentNode&&t.content.parentNode.removeChild(t.content),delete this.tabs[n],this.recomputeTabsByIndex()}removeAllTabs(n=!1){var t=[];for(var e in this.tabs)t.push(this.tabs[e]);for(var e in t){var i=t[e];i==this.plus_tab&&n||(i.tab.parentNode&&i.tab.parentNode.removeChild(i.tab),i.content.parentNode&&i.content.parentNode.removeChild(i.content),delete this.tabs[i.id])}this.recomputeTabsByIndex()}clear(){this.removeAllTabs()}showTab(n){this.setTabVisibility(n,!0)}hideTab(n){this.setTabVisibility(n,!1)}transferTab(n,t,e){const i=this.tabs[n];if(!i)return;t.tabs[n]=i,e!==void 0?t.list.insertBefore(i.tab,t.list.childNodes[e]):t.list.appendChild(i.tab),t.root.appendChild(i.content),delete this.tabs[n];const o=Object.keys(this.tabs);o.length>0&&this.selectTab(o[0]),i.tab.classList.remove("lg-tabs__tab--selected"),t.selectTab(n)}};c(gt,"tabs_width",64),c(gt,"tabs_height",26);let Se=gt;const Gn=di(),P=class P{static init(n={}){if(this.container=null,n.container&&(this.container=document.getElementById(n.container)||document.querySelector(n.container)),this.container||(this.container=document.body),n.wrapped){const t=document.createElement("div");t.className="lg-app",t.style.position="relative",t.style.overflow="hidden",this.root=t,ot.root=t,this.container.appendChild(t);const e=document.createElement("div");this.content=e,ot.content=e,this.root.appendChild(e),window.addEventListener("resize",()=>{P.maximizeWindow()})}else this.root=this.container,this.content=this.container,ot.root=this.root,ot.content=this.content;return this.root.classList.add("lg-app__wrap","lg-app--fullscreen"),this.content.classList.add("lg-app__main"),n.width&&n.height&&this.setWindowSize(n.width,n.height),this.modalbg_div=document.createElement("div"),this.modalbg_div.className="lg-modal-backdrop",this.modalbg_div.style.display="none",ot.modalbg=this.modalbg_div,this.root.appendChild(this.modalbg_div),n.theme&&P.setTheme(n.theme),n.menubar&&this.createMenu(),n.gui_callback&&n.gui_callback(),window.addEventListener("beforeunload",function(){for(const t of P.windows)t.close();P.windows=[]}),this}static createMenu(){const n=new Ee("mainmenubar");return P.menubar=n,P.add(n),n}static setWindowSize(n,t){if(!this.root)return!1;const e=this.root.style;if(n&&t)e.width=n+"px",e.height=t+"px",e.boxShadow="0 0 4px black",this.root.classList.remove("lg-app--fullscreen");else{if(this.root.classList.contains("lg-app--fullscreen"))return;this.root.classList.add("lg-app--fullscreen"),e.width="100%",e.height="100%",e.boxShadow="0 0 0"}return P.trigger(P,"resized"),!0}static bind(n,t,e){ui(n,t,e)}static unbind(n,t,e){ar(n,t,e)}static add(n){(P.content||P.root||document.body).appendChild(n.root||n)}static remove(n){return ye(n)}static setCursor(n){return this.root?(this.root.style.cursor=n,!0):!1}static getById(n){return document.getElementById(n)}static trigger(n,t,e){return U(n,t,e)}static fireEvent(n){const t=n.type,e=n.detail;P.emit(t,e)}static maximizeWindow(){P.setWindowSize()}static on(n,t){Gn.on(n,t)}static emit(n,t){Gn.emit(n,t)}static sizeToCSS(n){return Mt(n)}static removeClass(n,t,e){e||(e=t,t="."+t);const i=(n||document).querySelectorAll(t);Array.from(i).forEach(o=>{o.classList.remove(e)})}static isCursorOverElement(n,t){var e=n.pageX,i=n.pageY,o=t.getBoundingClientRect();return o?i>o.top&&i<o.top+o.height&&e>o.left&&e<o.left+o.width:!1}static getRect(n){return n.getBoundingClientRect()}static toClipboard(n,t=!1){n&&n.constructor!==String&&(n=JSON.stringify(n));var e=null,i=!1;if(!t)try{e=document.createElement("input"),e.type="text",e.style.opacity="0",e.value=n,document.body.appendChild(e),e.select(),i=document.execCommand("copy"),console.log(i?"saved to clipboard":"problem saving to clipboard"),document.body.removeChild(e)}catch{e&&document.body.removeChild(e),console.warn("Oops, unable to copy using the true clipboard")}try{this._safe_cliboard=null,localStorage.setItem("litegui_clipboard",n)}catch{this._safe_cliboard=n,console.warn("cliboard quota excedeed")}}static getLocalClipboard(){var n=localStorage.getItem("litegui_clipboard");return!n&&this._safe_cliboard&&(n=this._safe_cliboard),n?n[0]=="{"?JSON.parse(n):n:null}static addCSS(n){if(n)if(typeof n=="string"){const t=document.createElement("style");t.type="text/css",t.innerHTML=n,document.getElementsByTagName("head")[0].appendChild(t);return}else Object.entries(n).forEach(([t,e])=>{document.body.style[t]=e})}static requireCSS(n,t){for(typeof n=="string"&&(n=[n]);n.length;){const e=document.createElement("link");e.rel="stylesheet",e.type="text/css",e.href=n.shift(),e.media="all",document.getElementsByTagName("head")[0].appendChild(e),n.length==0&&(e.onload=t)}}static request(n){var t=n.dataType||"text";t=="json"||t=="xml"?t="text":t=="binary"&&(t="arraybuffer",n.mimeType="application/octet-stream");var e=new XMLHttpRequest;e.open(n.data?"POST":"GET",n.url,!0),t&&(e.responseType=t),n.mimeType&&e.overrideMimeType(n.mimeType),n.nocache&&e.setRequestHeader("Cache-Control","no-cache"),e.onload=function(){var s=this.response;if(this.status!=200){var a="Error "+this.status;n.error&&n.error(a),P.trigger(e,"fail",this.status);return}if(n.dataType=="json")try{s=JSON.parse(s)}catch(d){if(n.error)n.error(d);else throw d}else if(n.dataType=="xml")try{var l=new DOMParser;s=l.parseFromString(s,"text/xml")}catch(d){if(n.error)n.error(d);else throw d}n.success&&n.success.call(this,s,this)},e.onerror=function(s){n.error&&n.error(s)};var i=new FormData;if(n.data)for(var o in n.data)i.append(o,n.data[o]);return e.send(i),e}static requestText(n,t,e){return this.request({url:n,dataType:"text",success:t,error:e})}static requestJSON(n,t,e){return this.request({url:n,dataType:"json",success:t,error:e})}static requestBinary(n,t,e){return this.request({url:n,dataType:"binary",success:t,error:e})}static requireScript(n,t,e,i,o){if(!n)throw"invalid URL";let s=[];typeof n=="string"?s=[n]:s=n;let a=n.length;const l=[];s.forEach((d,h)=>{const u=document.createElement("script");u.setAttribute("script_index",h.toString()),u.setAttribute("original_src",d),u.async=!1,u.type="text/javascript",u.src=d+(o?"?version="+o:""),u.onload=()=>{a--,l.push(u),a?i&&i(u.getAttribute("original_src"),u.getAttribute("script_index")):t&&t(l)},u.onerror=p=>{e&&e(p,u.getAttribute("original_src"),u.getAttribute("script_index"))},document.getElementsByTagName("head")[0].appendChild(u)})}static requireScriptSerial(n,t,e){let i=[];typeof n=="string"?i=[n]:i=n;const o=[];function s(){var a=document.createElement("script");a.type="text/javascript",a.src=i.shift(),a.onload=()=>(o.push(a),i.length?(e&&e(i[0],n.length),s(),!1):(t&&t(o),!0)),document.getElementsByTagName("head")[0].appendChild(a)}s()}static createElement(n,t,e,i="",o={}){return Fe(n,t,e,i,o)}static craeteDivElement(n,t){return P.createElement("div",n,t)}static createListItem(n,t,e){return ci(n,t,e)}static createButton(n,t,e,i){var o=document.createElement("button");if(o.className="lg-button__control",n)for(var s=n.split(" "),a=0;a<s.length;a++)s[a][0]=="."?o.classList.add(s[a].substr(1)):s[a][0]=="#"?o.id=s[a].substr(1):o.id=s[a];return t!==void 0&&(o.innerHTML=t),e&&o.addEventListener("click",e),i&&(typeof i=="string"?o.setAttribute("style",i):Object.entries(i).forEach(([l,d])=>{o.style[l]=d})),o}static getParents(n){const t=[];for(;n.parentElement!==null;)n=n.parentElement,n.nodeType===Node.ELEMENT_NODE&&t.push(n);return t}static newWindow(n,t,e,i={scripts:!1,content:""}){const o=window.open("","",`width=${t}, height=${e}, location=no, status=no, menubar=no, titlebar=no, fullscreen=yes`);if(!o)return null;const s=[],a=[];document.querySelectorAll("link[rel='stylesheet'],style").forEach(u=>{s.push(u.outerHTML)}),i.scripts&&document.querySelectorAll("script").forEach(p=>{a.push(p.outerHTML)});const d=i.content||"",h=`
    <html>
      <head>
         ${s.join(`
`)}
         ${a.join(`
`)}
        <title>${n}</title>
      </head>
      <body>
        ${d}
      </body>
    </html>`;return o.document.write(h),o.document.close(),o}static showModalBackground(n){We(n)}static setTheme(n){return dr(n)}static getTheme(){return hr()}static escapeHTML(n){return or(n)}static showMessage(n,t={}){t.title=t.title||"Attention",t.content=n,t.close="fade";var e=new P.Dialog(t);return t.noclose||e.addButtonToFooter("Close",{name:"Close",close:!0}),e.makeModal(),e}static popup(n="",t={}){t.min_height=140,t.close="fade",typeof n=="string"&&(n="<p>"+n+"</p>"),t.content=n;const e=new le(t);return t.noclose||e.addButtonToFooter("Close",{name:"Close",close:!0}),e.show(),e}static alert(n,t={}){return t.className="lg-dialog--alert",t.title=t.title||"Alert",t.width=t.width||280,t.height=t.height||140,typeof n=="string"&&(n="<p>"+n+"</p>"),P.remove(".lg-dialog--alert"),P.showMessage(n,t)}static confirm(n,t,e={}){e.className="lg-dialog--alert",e.title=e.title||"Confirm",e.width=e.width||280,typeof n=="string"&&(n="<p>"+n+"</p>"),n+=`<button class='lg-button__control' data-value='yes' style='width:45%; margin-left: 10px'>Yes</button>
       <button class='lg-button__control' data-value='no' style='width:45%' margin-left: 10px'>No</button>`,e.noclose=!0;const i=this.showMessage(n,e);i.content.style.paddingBottom="10px";const o=i.content.querySelectorAll("button");return o.forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.value==="yes";i.close(),t&&t(a)})}),o[0].focus(),i}static prompt(n,t,e={}){e=e||{},e.className="lg-dialog--alert",e.title=e.title||"Prompt",e.width=e.width||280,typeof n=="string"&&(n="<p>"+n+"</p>");var i=e.value||"",o="<input type='text' value='"+i+"'/>";e.textarea&&(o="<textarea class='textfield' style='width:95%'>"+i+"</textarea>"),n+="<p>"+o+"</p><button class='lg-button__control' data-value='accept' style='width:45%; margin-left: 10px; margin-bottom: 10px'>Accept</button><button class='lg-button__control' data-value='cancel' style='width:45%'>Cancel</button>",e.noclose=!0;var s=this.showMessage(n,e),a=s.content.querySelector("input,textarea"),l=s.content.querySelectorAll("button");return l.forEach(d=>{d.addEventListener("click",()=>{const h=a==null?void 0:a.value;s.close(),t&&(d.dataset.value==="cancel"?t(null):t(h))})}),a==null||a.focus(),s}static choice(n,t,e,i={}){i.className="lg-dialog--alert",i.title=i.title||"Select one option",i.width=i.width||280,typeof n=="string"&&(n="<p>"+n+"</p>");for(var o in t)n+="<button class='lg-button__control' data-value='"+o+"' style='width:45%; margin-left: 10px'>"+(t[o].content||t[o])+"</button>";i.noclose=!0;const s=this.showMessage(n,i);return s.content.style.paddingBottom="10px",s.content.querySelectorAll("button").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.value;s.close(),e&&e(d)})}),s}static downloadURL(n,t){var e=document.createElement("a");e.href=n,e.download=t,document.body.appendChild(e),e.click(),document.body.removeChild(e)}static downloadFile(n,t,e){if(!t){console.warn("No file provided to download");return}e||(t.constructor===String?e="text/plain":e="application/octet-stream");var i=null;t.constructor!==File&&t.constructor!==Blob?i=new Blob([t],{type:e}):i=t;var o=URL.createObjectURL(i),s=document.createElement("a");s.setAttribute("href",o),s.setAttribute("download",n),s.style.display="none",document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(function(){URL.revokeObjectURL(o)},1e3*60)}static getUrlVars(){const n={},t=window.location.href.slice(window.location.href.indexOf("?")+1).split("&");for(var e=0;e<t.length;e++){const i=t[e].split("=");n[i[0]]=i[1]}return n}static getUrlVar(n){return P.getUrlVars()[n]}static focus(n){n.focus()}static blur(n){n.blur()}static draggable(n,t,e,i,o){je(n,t,e,i,o)}static cloneObject(n,t){var e=t||{};for(var i in n)if(!(i[0]=="_"||i.substr(0,6)=="jQuery")){var o=n[i];if(o==null)e[i]=null;else{if($r(o))continue;if(typeof o=="number"||typeof o=="string")e[i]=o;else if(o.constructor==Float32Array)e[i]=Array.apply([],o);else if(Tr(o))e[i]&&e[i].constructor==Float32Array?e[i].set(o):e[i]=JSON.parse(JSON.stringify(o));else try{e[i]=JSON.parse(JSON.stringify(o))}catch(s){console.error(s)}}}return e}static safeName(n){return String(n).replace(/[\s.]/g,"")}static htmlEncode(n){const t=document.createElement("div");return t.innerHTML=n,t.textContent??""}static htmlDecode(n){const t=document.createElement("div");return t.textContent=n,t.innerHTML}static getElementWindow(n){return n.ownerDocument.defaultView}static createDropArea(n,t,e,i){n.addEventListener("dragenter",o);function o(a){a.stopPropagation(),a.preventDefault(),n.addEventListener("dragexit",o),n.addEventListener("dragover",o),n.addEventListener("drop",s),a.type=="dragenter"&&e&&e(a,n),a.type=="dragexit"&&i&&i(a,n)}function s(a){a.stopPropagation(),a.preventDefault(),n.removeEventListener("dragexit",o),n.removeEventListener("dragover",o),n.removeEventListener("drop",s);let l;t&&(l=t(a)),l&&(a.stopPropagation(),a.stopImmediatePropagation())}}static createLitebox(){return new Ye}};c(P,"Area",we),c(P,"Box",Ye),c(P,"Button",Dn),c(P,"Checkbox",pi),c(P,"Console",fi),c(P,"Dialog",le),c(P,"Dragger",bi),c(P,"Panel",Hn),c(P,"Split",ki),c(P,"Table",Ei),c(P,"Menu",Ee),c(P,"Tabs",Se),c(P,"SearchBox",yi),c(P,"ContextMenu",ae),c(P,"List",_i),c(P,"LineEditor",xi),c(P,"Slider",wi),c(P,"ComplexList",mi),c(P,"root"),c(P,"mainmenu",null),c(P,"menubar",null),c(P,"container",null),c(P,"content"),c(P,"modalbg_div",null),c(P,"windows",ot.windows),c(P,"panels",{}),c(P,"__events",ot.events),c(P,"_safe_cliboard",null),c(P,"undo_steps",[]),c(P,"redo_steps",[]),c(P,"special_codes",ot.specialCodes);let T=P;const Le=class Le{constructor(n,t,e){c(this,"root");c(this,"tree");c(this,"options");c(this,"indent_offset");c(this,"collapsed_depth");c(this,"root_item");c(this,"onBackgroundClicked");c(this,"onContextMenu");c(this,"_insertInside",function(n,t,e,i){var o=this.root.childNodes[t];if(!o)throw"No parent node found, index: "+t+", nodes: "+this.root.childNodes.length;var s=parseInt(o.dataset.level),a=i!==void 0?i:s+1,l=n.querySelector(".indentblock");l&&(l.style.paddingLeft=(a+this.indent_offset)*Le.INDENT+"px"),n.dataset.level=a;for(var d=t+1;d<this.root.childNodes.length;++d){var h=this.root.childNodes[d];if(!(!h.classList||!h.classList.contains("ltreeitem"))){var u=parseInt(h.dataset.level);if(u==a&&e){e--;continue}if(u<a||e===0&&u===a){this.root.insertBefore(n,h);return}}}this.root.appendChild(n)});c(this,"_isNodeChildrenVisible",function(n){var t=this.getItem(n);if(!t||t.classList.contains("hidden"))return!1;var e=t.querySelector(".listbox");return e?e.getValue()!="closed":!0});if(typeof n=="string"){const o=n;n=t,t=e||{},t.id=o,me("tree-legacy-args","Tree(id, data, options) is deprecated; use Tree(data, options).")}this.options=t||{allow_rename:!1,allow_drag:!0,allow_multiselection:!1},this.root=document.createElement("div"),this.options.id&&(this.root.id=this.options.id),this.root.className="litetree",this.tree=n,this.indent_offset=this.options.indent_offset||0,this.options.height&&(this.root.style.height=typeof this.options.height=="string"?this.options.height:Math.round(this.options.height)+"px"),this.collapsed_depth=this.options.collapsed_depth??3,this.root.addEventListener("click",o=>{var s;o.target===this.root&&((s=this.onBackgroundClicked)==null||s.call(this,o,this))}),this.root.addEventListener("contextmenu",o=>{var s;return o.button!==2||((s=this.onContextMenu)==null||s.call(this,o),o.preventDefault()),!1});const i=this.createAndInsert(n,this.options,null);if(!i)throw new Error("Error in LiteGUI.Tree, createAndInsert returned null");i.className+=" root_item",this.root_item=i}updateTree(n){this.root.innerHTML="";var t=this.createAndInsert(n,this.options,null);t?(t.className+=" root_item",this.root_item=t):this.root_item=null}insertItem(n,t,e,i){if(!t){var o=this.root.childNodes[0];o&&(t=o.dataset.item_id)}var s=this.createAndInsert(n,i,t,e);return t&&this._updateListBox(this._findElement(t)),s}createAndInsert(n,t,e,i){var o=-1;e?o=this._findElementIndex(e):e===void 0&&(o=0);var s=null,a=0;o!=-1&&(s=this.root.childNodes[o],a=parseInt(s.dataset.level)+1);var l=this.createTreeItem(n,t,a);if(l){l.parent_id=e;var d=this.getItem(l.dataset.item_id);if(d&&console.warn("There another item with the same ID in this tree"),o==-1?this.root.appendChild(l):this._insertInside(l,o,i),s&&!this._isNodeChildrenVisible(e)&&l.classList.add("hidden"),n.children)for(var h=0;h<n.children.length;++h)this.createAndInsert(n.children[h],t,n.id);return this._updateListBox(l,t,a),t&&t.selected&&this.markAsSelected(l,!0),l}}_findElement(n){if(!n||n.constructor!==String)throw"findElement param must be string with item id";for(var t=0;t<this.root.childNodes.length;++t){var e=this.root.childNodes[t];if(!(!e.classList||!e.classList.contains("ltreeitem"))&&e.classList.contains("ltreeitem-"+n))return e}return null}};c(Le,"INDENT",20);let R=Le;R.prototype._findElementIndex=function(r){for(var n=0;n<this.root.childNodes.length;++n){var t=this.root.childNodes[n];if(!(!t.classList||!t.classList.contains("ltreeitem"))){if(typeof r=="string"){if(t.dataset.item_id===r)return n}else if(t===r)return n}}return-1};R.prototype._findElementLastChildIndex=function(r){if(r==-1)return-1;for(var n=parseInt(this.root.childNodes[r].dataset.level),t=r+1;t<this.root.childNodes.length;++t){var e=this.root.childNodes[t];if(!(!e.classList||!e.classList.contains("ltreeitem"))){var i=parseInt(e.dataset.level);if(i==n)return t}}return-1};R.prototype._findChildElements=function(r,n){var t=this._findElementIndex(r);if(t!=-1){for(var e=this.root.childNodes[t],i=parseInt(e.dataset.level),o=[],s=t+1;s<this.root.childNodes.length;++s){var a=this.root.childNodes[s];if(!(!a.classList||!a.classList.contains("ltreeitem"))){var l=parseInt(a.dataset.level);if(!(n&&l>i+1)){if(l<=i)return o;o.push(a)}}}return o}};R.prototype.createTreeItem=function(r,n,t){if(r==null){console.error("Tree item cannot be null");return}n=n||this.options;var e=document.createElement("li");e.className="ltreeitem";var i=this;if(r.id){var o=r.id.replace(/\s/g,"_");e.className+=" ltreeitem-"+o,e.dataset.item_id=r.id}if(r.dataset)for(var s in r.dataset)e.dataset[s]=r.dataset[s];r.DOM=e,e.data=r,t!==void 0&&(e.dataset.level=t,e.classList.add("ltree-level-"+t));var a=document.createElement("div");a.className="ltreeitemtitle",r.className&&(a.className+=" "+r.className),a.innerHTML="<span class='precontent'></span><span class='indentblock'></span><span class='collapsebox'></span><span class='incontent'></span><span class='postcontent'></span>";var l=r.content||r.id||"";if(a.querySelector(".incontent").innerHTML=l,r.precontent&&(a.querySelector(".precontent").innerHTML=r.precontent),r.postcontent&&(a.querySelector(".postcontent").innerHTML=r.postcontent),r.dataset)for(var s in r.dataset)e.dataset[s]=r.dataset[s];e.appendChild(a),e.title_element=a,r.visible===!1&&(e.style.display="none");var d=e;d.addEventListener("click",h),d.addEventListener("dblclick",u),d.addEventListener("contextmenu",function(y){var m=this;if(y.preventDefault(),y.stopPropagation(),y.button==2)return i.onItemContextMenu?i.onItemContextMenu(y,{item:m,data:m.data}):!1});function h(y){y.preventDefault(),y.stopPropagation();var m=this,w=m.title_element;if(!w._editing){if(y.ctrlKey&&i.options.allow_multiselection){if(i.isNodeSelected(m)){m.classList.remove("selected"),U(i,"item_remove_from_selection",{item:m,data:m.data}),U(i.root,"item_remove_from_selection",{item:m,data:m.data});return}i.markAsSelected(m,!0),U(i,"item_add_to_selection",{item:m,data:m.data}),U(i.root,"item_add_to_selection",{item:m,data:m.data});var A=!1;r.callback&&(A=r.callback.call(i,m)),!A&&i.onItemAddToSelection&&i.onItemAddToSelection(m.data,m)}if(y.shiftKey&&i.options.allow_multiselection){var V=i.getSelectedItem();if(!V||V===m)return;for(var H=Array.prototype.slice.call(V.parentNode.children),Z=H.indexOf(V),at=H.indexOf(m),bt=at>Z?H.slice(Z,at):H.slice(at,Z),nt=0;nt<bt.length;++nt){var oe=bt[nt];i.markAsSelected(oe,!0),U(i,"item_add_to_selection",{item:oe,data:oe.data}),U(i.root,"item_add_to_selection",{item:oe,data:oe.data})}}else{i.markAsSelected(m),i._skip_scroll=!0,U(i,"item_selected",{item:m,data:m.data}),U(i.root,"item_selected",{item:m,data:m.data});var A=!1;r.callback&&(A=r.callback.call(i,m)),!A&&i.onItemSelected&&i.onItemSelected(m.data,m),i._skip_scroll=!1}}}function u(y){var m=this,w=m.title_element.querySelector(".incontent");if(U(i,"item_dblclicked",m),U(i.root,"item_dblclicked",m),!w._editing&&i.options.allow_rename){w._editing=!0,w._old_name=w.innerHTML;var A=w;w.innerHTML="<input type='text' value='"+w.innerHTML+"' />";var V=w.querySelector("input");V.addEventListener("blur",function(H){var Z=H.target.value;setTimeout(function(){A.innerHTML=Z},1),delete A._editing,U(i.root,"item_renamed",{old_name:A._old_name,new_name:Z,item:m,data:m.data}),delete A._old_name}),V.addEventListener("keydown",function(H){H.keyCode==13&&this.blur()}),V.focus(),y.preventDefault()}y.preventDefault(),y.stopPropagation()}var p=a;this.options.allow_drag&&(p.draggable=!0,p.addEventListener("dragstart",function(y){if(y.dataTransfer.setData("item_id",this.parentNode.dataset.item_id),!!r.onDragData){var m=r.onDragData();if(m)for(var w in m)y.dataTransfer.setData(w,m[w])}}));var _=0;p.addEventListener("dragenter",function(y){if(y.preventDefault(),r.skipdrag)return!1;_==0&&a.classList.add("dragover"),_++}),p.addEventListener("dragleave",function(y){y.preventDefault(),_--,_==0&&a.classList.remove("dragover")}),p.addEventListener("dragover",b);function b(y){y.preventDefault()}return p.addEventListener("drop",function(y){if(a.classList.remove("dragover"),y.preventDefault(),r.skipdrag)return!1;var m=y.dataTransfer.getData("item_id");if(!m){U(i.root,"drop_on_item",{item:this,event:y}),i.onDropItem&&i.onDropItem(y,this.parentNode.data);return}{var w=this.parentNode.dataset.item_id;(!i.onMoveItem||i.onMoveItem&&i.onMoveItem(i.getItem(m),i.getItem(w))!=!1)&&i.moveItem(m,w)&&U(i.root,"item_moved",{item:i.getItem(m),parent_item:i.getItem(w)})}i.onDropItem&&i.onDropItem(y,this.parentNode.data)}),e};R.prototype.filterByName=function(r){for(var n=0;n<this.root.childNodes.length;++n){var t=this.root.childNodes[n];if(!(!t.classList||!t.classList.contains("ltreeitem"))){var e=t.querySelector(".incontent");if(e){var i=e.innerHTML.toLowerCase();if(!r||i.indexOf(r.toLowerCase())!=-1){t.data&&t.data.visible!==!1&&t.classList.remove("filtered");var o=t.querySelector(".indentblock");o&&(r?o.style.paddingLeft=0:o.style.paddingLeft=paddingLeft=(parseInt(t.dataset.level)+this.indent_offset)*R.INDENT+"px")}else t.classList.add("filtered")}}}};R.prototype.filterByRule=function(r,n){if(!r)throw"filterByRule requires a callback";for(var t=0;t<this.root.childNodes.length;++t){var e=this.root.childNodes[t];if(!(!e.classList||!e.classList.contains("ltreeitem"))){var i=e.querySelector(".incontent");if(i)if(r(e.data,i,n)){e.data&&e.data.visible!==!1&&e.classList.remove("filtered");var o=e.querySelector(".indentblock");o&&(name?o.style.paddingLeft=0:o.style.paddingLeft=paddingLeft=(parseInt(e.dataset.level)+this.indent_offset)*R.INDENT+"px")}else e.classList.add("filtered")}}};R.prototype.getItem=function(r){if(!r)return null;if(r.classList)return r;for(var n=0;n<this.root.childNodes.length;++n){var t=this.root.childNodes[n];if(!(!t.classList||!t.classList.contains("ltreeitem"))&&t.dataset.item_id===r)return t}return null};R.prototype.expandItem=function(r,n){var t=this.getItem(r);if(t&&t.listbox&&(t.listbox.setValue(!0),!!n)){var e=this.getParent(t);e&&this.expandItem(e,n)}};R.prototype.collapseItem=function(r){var n=this.getItem(r);n&&n.listbox&&listbox.setValue(!1)};R.prototype.isInsideArea=function(r){var n=r.constructor===String?this.getItem(r):r;if(!n)return!1;var t=this.root.getClientRects();if(!t.length)return!1;var e=t[0],i=e.height,o=n.offsetTop;return this.root.scrollTop<o&&o<this.root.scrollTop+i};R.prototype.scrollToItem=function(r){var n=r.constructor===String?this.getItem(r):r;if(n){var t=this.root.parentNode;if(t){var e=t.getBoundingClientRect();if(e){var i=e.height,o=(parseInt(n.dataset.level)+this.indent_offset)*R.INDENT+50;t.scrollTop=n.offsetTop-i*.5|0,e.width*.75<o?t.scrollLeft=o:t.scrollLeft=0}}}};R.prototype.setSelectedItem=function(r,n,t){if(!r){this.unmarkAllAsSelected();return}var e=this.getItem(r);if(!e)return null;if(!e.classList.contains("selected"))return this.markAsSelected(e),n&&!this._skip_scroll&&this.scrollToItem(e),this.expandItem(e,!0),t&&U(e,"click"),e};R.prototype.addItemToSelection=function(r){if(r){var n=this.getItem(r);return n?(this.markAsSelected(n,!0),n):null}};R.prototype.removeItemFromSelection=function(r){if(r){var n=this.getItem(r);if(!n)return null;n.classList.remove("selected")}};R.prototype.getSelectedItem=function(){return this.root.querySelector(".ltreeitem.selected")};R.prototype.getSelectedItems=function(){return this.root.querySelectorAll(".ltreeitem.selected")};R.prototype.isItemSelected=function(r){var n=this.getItem(r);return n?this.isNodeSelected(n):!1};R.prototype.getChildren=function(r,n){return r&&r.constructor!==String&&r.dataset&&(r=r.dataset.item_id),this._findChildElements(r,n)};R.prototype.getParent=function(r){var n=this.getItem(r);return n?this.getItem(n.parent_id):null};R.prototype.getAncestors=function(r,n){n=n||[];var t=this.getItem(r);return t?(n.push(t),this.getAncestors(t.parent_id,n)):n};R.prototype.isAncestor=function(r,n){var t=this.getItem(r);if(!t)return!1;var e=this.getItem(n),i=this.getItem(t.parent_id);return i?i==e?!0:this.isAncestor(i,n):!1};R.prototype.moveItem=function(r,n){if(r===n)return!1;var t=this.getItem(r),e=this.getItem(n);if(this.isAncestor(e,t))return!1;var i=this._findElementIndex(e),o=parseInt(e.dataset.level),s=this.getParent(t);if(!s)return console.error("node parent not found by id, maybe id has changed"),!1;var a=parseInt(s.dataset.level),l=o-a;if(!e||!t||e==s)return!1;t.parent_id=n;var d=this.getChildren(t);if(d){d.unshift(t);for(var h=0;h<d.length;h++)d[h].parentNode.removeChild(d[h]);for(var h=0;h<d.length;h++){var u=d[h],p=parseInt(u.dataset.level)+l;u.dataset.level=p}i=this._findElementIndex(e);var _=this._findElementLastChildIndex(i);_==-1&&(_=0);for(var h=0;h<d.length;h++){var u=d[h];this._insertInside(u,i,_+h-1,parseInt(u.dataset.level))}}return this._updateListBox(e),s&&this._updateListBox(s),!0};R.prototype.removeItem=function(r,n){var t=r;if(typeof r=="string"&&(t=this.getItem(r)),!t)return!1;var e=this.getParent(t),i=null;if(n&&(i=this.getChildren(t)),this.root.removeChild(t),i)for(var o=0;o<i.length;o++)this.root.removeChild(i[o]);return e&&this._updateListBox(e),!0};R.prototype.updateItem=function(r,n){var t=this.getItem(r);if(!t)return!1;if(t.data=n,n.id&&(t.id=n.id),n.content){var e=t.title_element.querySelector(".incontent");e.innerHTML=n.content}return!0};R.prototype.updateItemId=function(r,n){var t=this.getItem(r);if(!t)return!1;var e=this.getChildren(r,!0);t.id=n;for(var i=0;i<e.length;++i){var o=e[i];o.parent_id=n}return!0};R.prototype.clear=function(r){if(!r){this.root.innerHTML="";return}for(var n=this.root.querySelectorAll(".ltreeitem"),t=1;t<n.length;t++){var e=n[t];this.root.removeChild(e)}};R.prototype.getNodeByIndex=function(r){var n=this.root.querySelectorAll(".ltreeitem");return n[r]};R.prototype.unmarkAllAsSelected=function(){this.root.classList.remove("selected");var r=this.root.querySelectorAll(".ltreeitem.selected");if(r)for(var n=0;n<r.length;n++)r[n].classList.remove("selected");for(var t=this.root.querySelectorAll(".ltreeitem.semiselected"),n=0;n<t.length;n++)t[n].classList.remove("semiselected")};R.prototype.isNodeSelected=function(r){return!!r.classList.contains("selected")};R.prototype.markAsSelected=function(r,n){if(!r.classList.contains("selected")){n||this.unmarkAllAsSelected(),r.classList.add("selected");for(var t=this.getParent(r),e=[];t&&e.indexOf(t)==-1;)t.classList.add("semiselected"),e.push(t),t=this.getParent(t)}};R.prototype._updateListBox=function(r,n,t){if(r){if(!r.listbox){var e=r.title_element.querySelector(".collapsebox"),i=new T.Box;i.stopPropagation=!0,i.setEmpty(!0),e.appendChild(i.root),r.listbox=i}(n&&n.collapsed||t>=this.collapsed_depth)&&r.listbox.collapse();var o=this.getChildren(r.dataset.item_id);o&&(o.length?r.listbox.setEmpty(!1):r.listbox.setEmpty(!0))}};R.prototype.onClickBox=function(r,n){var t=this.getChildren(n);if(t)for(var e=0;e<t.length;++e){var i=t[e],o=this.getParent(i),s=!0;o&&(s=this._isNodeChildrenVisible(o)),s?i.classList.remove("hidden"):i.classList.add("hidden")}};class L{constructor(n={}){c(this,"root");c(this,"sections",[]);c(this,"values",{});c(this,"widgets",[]);c(this,"widgets_by_name",{});c(this,"row_number",0);c(this,"tab_index");c(this,"one_line",!1);c(this,"name_width");c(this,"widgets_width");c(this,"className");c(this,"widgets_per_row");c(this,"onchange");if(typeof n=="string"){const t=n;n=arguments[1]||{},n.id=t,me("inspector-legacy-args","Inspector(id, options) is deprecated; use Inspector(options).")}this.root=document.createElement("div"),this.root.className=`inspector ${n.full?"full":""} ${n.className||""}`,n.one_line&&(this.one_line=!0,this.root.className+=" one_line"),n.id&&(this.root.id=n.id),this.addContainer(),this.tab_index=Math.floor(Math.random()*1e4),n.width&&(this.root.style.width=T.sizeToCSS(n.width)),n.height&&(this.root.style.height=T.sizeToCSS(n.height),n.one_line||(this.root.style.overflow="auto")),n.name_width&&(this.name_width=n.name_width),n.widgets_width&&(this.widgets_width=n.widgets_width),n.noscroll&&(this.root.style.overflow="hidden"),n.onchange&&(this.onchange=n.onchange),n.parent&&this.appendTo(n.parent),this.className=this.root.className,this.widgets_per_row=n.widgets_per_row||1}}L.prototype.getValues=function(){var r={};for(var n in this.widgets_by_name)r[n]=this.widgets_by_name[n].getValue();return r};L.prototype.setValues=function(r){for(var n in r)this.widgets_by_name[n]&&this.widgets_by_name[n].setValue(r[n])};L.prototype.appendTo=function(r,n){r&&(r.constructor===String&&(r=document.querySelector(r)),r&&(n?r.insertBefore(this.root,r.firstChild):r.appendChild(this.root)))};L.prototype.clear=function(){for(gi(this.root);this.root.hasChildNodes();)this.root.removeChild(this.root.lastChild);this.root.className=this.className,this.row_number=0,this.values={},this.widgets=[],this.widgets_by_name={},this.sections=[],this.current_section=null,this._current_container=null,this._current_container_stack=null,this.addContainer()};L.prototype.refresh=function(){this.on_refresh&&this.on_refresh()};L.prototype.append=function(r,n){n=n||{};var t=n.widget_parent||this._current_container||this.root;n.replace?n.replace.parentNode.replaceChild(r,n.replace):(r.section=this.current_section,t.appendChild(r))};L.prototype.pushContainer=function(r){if(!this._current_container_stack)this._current_container_stack=[r];else{if(this._current_container_stack.indexOf(r)!=-1){console.warn("Container already in the stack");return}this._current_container_stack.push(r)}this._current_container=r};L.prototype.isContainerInStack=function(r){return this._current_container_stack?this._current_container_stack.indexOf(r)!=-1:!1};L.prototype.popContainer=function(r){if(this.row_number=0,this._current_container_stack&&this._current_container_stack.length){if(r)for(var n=this._current_container_stack.pop();n&&n!=r;)n=this._current_container_stack.pop();else this._current_container_stack.pop();this._current_container=this._current_container_stack[this._current_container_stack.length-1]}else this._current_container=null};L.prototype.setup=function(r){for(var n in r){var t=r[n];this.add(t.type,t.name,t.value,t.options)}};L.prototype.getWidget=function(r){return r!==null&&r.constructor===Number?this.widgets[r]:this.widgets_by_name[r]};L.prototype.inspectInstance=function(r,n,t,e){if(!r)return;n||(r.getProperties?n=r.getProperties():n=this.collectProperties(r));var i=r.constructor;!t&&i.properties&&(t=i.properties);var o={};if(r.getInspectorProperties)o=r.getInspectorProperties();else for(var s in n){if(t&&t[s]){o[s]=p(t[s]);continue}var a=n[s];if(i["@"+s]){var l=i["@"+s];if(l&&l.widget===null)continue;o[s]=p(l)}else if(r["@"+s])o[s]=r["@"+s];else{if(a==null)continue;switch(a.constructor){case Number:o[s]={type:"number",step:.1};break;case String:o[s]={type:"string"};break;case Boolean:o[s]={type:"boolean"};break;default:if(a&&(a.constructor===Array||a.constructor.BYTES_PER_ELEMENT)){var d=a[0]!=null&&a[0].constructor===Number;switch(a.length){case 2:o[s]={type:d?"vec2":"Array",step:.1};break;case 3:o[s]={type:d?"vec3":"Array",step:.1};break;case 4:o[s]={type:d?"vec4":"Array",step:.1};break;default:o[s]={type:"Array"};break}}}}}if(e)for(var s in e)delete o[e[s]];if(i.properties_order){var h={};for(var s in i.properties_order){var u=i.properties_order[s];o[u]?h[u]=o[u]:console.warn("property not found in instance:",u)}for(var s in o)h[s]||(h[s]=o[s]);o=h}return this.showProperties(r,o);function p(_,b){b=b||{};for(var y in _)b[y]=_[y];return b}};L.prototype.collectProperties=function(r){var n={};for(var t in r)if(!(t[0]=="_"||t[0]=="@"||t.substr(0,6)=="jQuery")){var e=r[t];e&&e.constructor==Function&&!r.constructor["@"+t]||(n[t]=e)}return n};L.prototype.showProperties=function(r,n){for(var t in n){var e=t,i=n[t];if(i){if(i.constructor===String&&(i={type:i}),i.name&&(e=i.name),!i.callback){var o={instance:r,name:e,options:i};i.type=="function"||(i.callback=L.assignValue.bind(o))}if(!i.callback_update){var o={instance:r,name:e};i.callback_update=(function(){return this.instance[this.name]}).bind(o)}i.instance=r,i.varname=e;var s=i.widget||i.type||"string";this.on_addProperty&&this.on_addProperty(s,r,e,r[e],i),this.add(s,e,r[e],i)}}if(r.constructor.widgets)for(var t in r.constructor.widgets){var a=r.constructor.widgets[t];this.add(a.widget,a.name,a.value,a)}r.onShowProperties&&r.onShowProperties(this),r.constructor.onShowProperties&&r.constructor.onShowProperties(r,this)};L.assignValue=function(r){var n=this.instance,t=n[this.name];if(t==null||r==null||this.options.type=="enum")n[this.name]=r;else if(typeof t=="number")n[this.name]=parseFloat(r);else if(typeof t=="string")n[this.name]=r;else if(r&&r.length&&t&&t.length&&(!Object.getOwnPropertyDescriptor(n,this.name)||!Object.getOwnPropertyDescriptor(n,this.name).set)&&(!Object.getOwnPropertyDescriptor(n.__proto__,this.name)||!Object.getOwnPropertyDescriptor(n.__proto__,this.name).set))for(var e=0;e<r.length;++e)t[e]=r[e];else n[this.name]=r};L.prototype.createWidget=function(r,n,t){t=t||{},n=n??"";var e=document.createElement("DIV");e.className="widget "+(t.className||""),e.inspector=this,e.options=t,e.name=r,this.row_number+=this.widgets_per_row,this.row_number%2==0&&(e.className+=" even");var i=t.width||this.widgets_width;i&&(e.style.width=T.sizeToCSS(i),e.style.width||(e.style.width="calc("+T.sizeToCSS(i)+")"),e.style.minWidth="auto");var o=t.height||this.height;o&&(e.style.height=T.sizeToCSS(o),e.style.height||(e.style.height="calc("+T.sizeToCSS(o)+")"),e.style.minHeight="auto"),this.widgets.push(e),(t.widget_name||r)&&(this.widgets_by_name[t.widget_name||r]=e),this.widgets_per_row!=1&&(t.width||(e.style.width=(100/this.widgets_per_row).toFixed(2)+"%"),e.style.display="inline-block");var s="",a="";if(r!=null&&(this.name_width||t.name_width)&&!this.one_line){var l=T.sizeToCSS(t.name_width||this.name_width);s="style='width: calc("+l+" - 0px); width: -webkit-calc("+l+" - 0px); width: -moz-calc("+l+" - 0px); '",a="style='width: calc( 100% - "+l+"); width: -webkit-calc(100% - "+l+"); width: -moz-calc( 100% - "+l+"); '"}t.name_width&&(s="style='width: "+T.sizeToCSS(t.name_width)+" '"),t.content_width&&(a="style='width: "+T.sizeToCSS(t.content_width)+" '");var d="",h="",u=this.one_line?"":"<span class='filling'></span>";t.pretitle&&(h=t.pretitle);var p="wcontent ",_=r;if(t.title&&(_=t.title),r==null?p+=" full":r===""?d+="<span class='wname' title='"+_+"' "+s+">"+h+"</span>":d+="<span class='wname' title='"+_+"' "+s+">"+h+r+u+"</span>",n.constructor===String||n.constructor===Number||n.constructor===Boolean)e.innerHTML=d+"<span class='info_content "+p+"' "+a+">"+n+"</span>";else{e.innerHTML=d+"<span class='info_content "+p+"' "+a+"></span>";var b=e.querySelector("span.info_content");b&&b.appendChild(n)}return e.content=e.querySelector("span.info_content"),e.remove=function(){this.parentNode&&this.parentNode.removeChild(this)},e};L.onWidgetChange=function(r,n,t,e,i,o){var s=r.section;e.skip_wchange||(s&&T.trigger(s,"wbeforechange",t),T.trigger(r,"wbeforechange",t)),this.values[n]=t;var a=void 0;return e.callback&&(i?a=e.callback.apply(r,t):a=e.callback.call(r,t,o)),e.skip_wchange||(s&&T.trigger(s,"wchange",t,r),T.trigger(r,"wchange",t,r)),this.onchange&&this.onchange(n,t,r),a};L.widget_constructors={null:"addNull",title:"addTitle",info:"addInfo",default:"addDefault",number:"addNumber",slider:"addSlider",string:"addString",text:"addString",textarea:"addTextarea",color:"addColor",boolean:"addCheckbox",checkbox:"addCheckbox",icon:"addIcon",vec2:"addVector2",vector2:"addVector2",vec3:"addVector3",vector3:"addVector3",vec4:"addVector4",vector4:"addVector4",enum:"addCombo",dropdown:"addCombo",combo:"addCombo",button:"addButton",buttons:"addButtons",file:"addFile",line:"addLine",list:"addList",tree:"addTree",datatree:"addDataTree",pad:"addPad",array:"addArray",separator:"addSeparator"};L.registerWidget=function(r,n){var t="add"+r.charAt(0).toUpperCase()+r.slice(1);L.prototype[t]=n,L.widget_constructors[r]=t};L.prototype.add=function(r,n,t,e){if(!r)throw"Inspector: no type specified";arguments.length==1&&typeof r=="object"&&(e=r,r=e.type,n=e.name,t=e.value);var i=L.widget_constructors[r.toLowerCase()];if(!i){console.warn("Inspector do not have a widget called",r);return}if(i.constructor===String&&(i=L.prototype[i]),!!i&&i.constructor===Function)return e&&e.constructor===Function&&(e={callback:e}),i.call(this,n,t,e)};L.prototype.getValue=function(r){return this.values[r]};L.prototype.applyOptions=function(r,n){!r||!n||(n.className&&(r.className+=" "+n.className),n.id&&(r.id=n.id),n.width&&(r.style.width=T.sizeToCSS(n.width)),n.height&&(r.style.height=T.sizeToCSS(n.height)))};L.prototype.addSeparator=function(){var r=document.createElement("DIV");return r.className="separator",this.append(r),r};L.prototype.addNull=function(r,n,t){return null};L.prototype.addDefault=function(r,n,t){return n==null?null:n.constructor===Boolean?this.addCheckbox(r,n,t):n.constructor===String?this.addString(r,n,t):n.constructor===Number?this.addNumber(r,n,t):n.length==4?this.addVector4(r,n,t):n.length==3?this.addVector3(r,n,t):n.length==2?this.addVector2(r,n,t):null};L.prototype.addString=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this;this.values[r]=n;var i="text";t.password&&(i="password");var o=t.focus?"autofocus":"",s=this.createWidget(r,"<span class='inputfield full "+(t.disabled?"disabled":"")+"'><input type='"+i+"' tabIndex='"+this.tab_index+"' "+o+" class='text string' value='"+n+"' "+(t.disabled?"disabled":"")+"/></span>",t),a=s.querySelector(".wcontent input");return t.placeHolder&&a.setAttribute("placeHolder",t.placeHolder),t.align=="right"&&(a.style.direction="rtl"),a.addEventListener(t.immediate?"keyup":"change",function(l){var d=L.onWidgetChange.call(e,s,r,l.target.value,t);d!==void 0&&(this.value=d)}),t.callback_enter&&a.addEventListener("keydown",function(l){l.keyCode==13&&(L.onWidgetChange.call(e,s,r,l.target.value,t),t.callback_enter(),l.preventDefault())}),this.tab_index+=1,s.setIcon=function(l){l?(a.style.background="transparent url('"+l+"') no-repeat left 4px center",a.style.paddingLeft="1.7em"):(a.style.background="",a.style.paddingLeft="")},t.icon&&s.setIcon(t.icon),s.setValue=function(l,d){l!==void 0&&l!==a.value&&(a.value=l,d||T.trigger(a,"change"))},s.getValue=function(){return a.value},s.focus=function(){this.querySelector("input").focus()},s.disable=function(){a.disabled=!0},s.enable=function(){a.disabled=!1},this.append(s,t),this.processElement(s,t),s};L.prototype.addStringButton=function(r,n,t){t=this.processOptions(t),n===void 0&&(n="");var e=this;this.values[r]=n;var i=this.createWidget(r,"<span class='inputfield button'><input type='text' tabIndex='"+this.tab_index+"' class='text string' value='' "+(t.disabled?"disabled":"")+"/></span><button class='micro'>"+(t.button||"...")+"</button>",t),o=i.querySelector(".wcontent input");o.value=n,o.addEventListener("change",function(l){var d=L.onWidgetChange.call(e,i,r,l.target.value,t);d!==void 0&&(this.value=d)}),t.disabled&&o.setAttribute("disabled","disabled"),i.setIcon=function(l){l?(o.style.background="transparent url('"+l+"') no-repeat left 4px center",o.style.paddingLeft="1.7em"):(o.style.background="",o.style.paddingLeft="")},t.icon&&i.setIcon(t.icon);var s=i.querySelector(".wcontent button");if(s.addEventListener("click",function(l){t.callback_button&&t.callback_button.call(i,o.value,l)}),t.button_width){s.style.width=T.sizeToCSS(t.button_width);var a=i.querySelector(".inputfield");a.style.width="calc( 100% - "+s.style.width+" - 6px)"}return this.tab_index+=1,this.append(i,t),i.setValue=function(l,d){o.value=l,d||T.trigger(o,"change")},i.disable=function(){o.disabled=!0,s.disabled=!0},i.enable=function(){o.disabled=!1,s.disabled=!1},i.getValue=function(){return o.value},i.focus=function(){T.focus(o)},this.processElement(i,t),i};L.prototype.addTextarea=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this;this.values[r]=n;var i=this.createWidget(r,"<span class='inputfield textarea "+(t.disabled?"disabled":"")+"'><textarea tabIndex='"+this.tab_index+"' "+(t.disabled?"disabled":"")+"></textarea></span>",t);this.tab_index++;var o=i.querySelector(".wcontent textarea");return o.value=n,o.addEventListener(t.immediate?"keyup":"change",function(s){L.onWidgetChange.call(e,i,r,s.target.value,t,!1,s)}),t.callback_keydown&&o.addEventListener("keydown",t.callback_keydown),t.height&&(o.style.height="calc( "+T.sizeToCSS(t.height)+" - 5px )"),this.append(i,t),i.setValue=function(s,a){s!==void 0&&s!=o.value&&(n=s,o.value=s,a||T.trigger(o,"change"))},i.getValue=function(s){return o.value},i.focus=function(){T.focus(o)},i.disable=function(){o.disabled=!0},i.enable=function(){o.disabled=!1},this.processElement(i,t),i};L.prototype.addNumber=function(r,n,t){t=this.processOptions(t),n=n||0;var e=this;this.values[r]=n;var i=this.createWidget(r,"",t);this.append(i,t),t.extraclass="full",t.tab_index=this.tab_index,t.full=!0,t.precision=t.precision!==void 0?t.precision:2,t.step=t.step===void 0?t.precision==0?1:.1:t.step,this.tab_index++;var o=null;o=new T.Dragger(n,t),o.root.style.width="calc( 100% - 1px )",i.querySelector(".wcontent").appendChild(o.root),o.root.addEventListener("start_dragging",s.bind(t)),i.dragger=o,t.disabled&&o.input.setAttribute("disabled","disabled");function s(l){this.callback_before&&this.callback_before.call(i)}var a=i.querySelector("input");return a.addEventListener("change",function(l){if(T.trigger(i,"wbeforechange",l.target.value),e.values[r]=l.target.value,t.callback){var d=t.callback.call(i,parseFloat(l.target.value));typeof d=="number"&&(this.value=d)}T.trigger(i,"wchange",l.target.value),e.onchange&&e.onchange(r,l.target.value,i)}),i.setValue=function(l,d){l!==void 0&&(l=parseFloat(l),t.precision&&(l=l.toFixed(t.precision)),l+=t.units||"",a.value!=l&&(a.value=l,d||T.trigger(a,"change")))},i.setRange=function(l,d){o.setRange(l,d)},i.getValue=function(){return parseFloat(a.value)},i.focus=function(){T.focus(a)},i.disable=function(){a.disabled=!0},i.enable=function(){a.disabled=!1},this.processElement(i,t),i};L.prototype.addVector2=function(r,n,t){t=this.processOptions(t),t.step||(t.step=.1),n=n||[0,0];var e=this;this.values[r]=n;var i=this.createWidget(r,"",t);t.step=t.step||.1,t.tab_index=this.tab_index,t.full=!0,this.tab_index++;var o=i.querySelector(".wcontent"),s=new T.Dragger(n[0],t);s.root.style.marginLeft=0,s.root.style.width="calc( 50% - 1px )",o.appendChild(s.root),t.tab_index=this.tab_index,this.tab_index++;var a=new T.Dragger(n[1],t);a.root.style.width="calc( 50% - 1px )",o.appendChild(a.root),i.draggers=[s,a],T.bind(s.root,"start_dragging",l.bind(t)),T.bind(a.root,"start_dragging",l.bind(t));function l(u){this.callback_before&&this.callback_before(u)}for(var d=i.querySelectorAll("input"),h=0;h<d.length;++h)d[h].addEventListener("change",function(u){for(var p=[],_=d,b=0;b<_.length;b++)p.push(parseFloat(_[b].value));if(T.trigger(i,"wbeforechange",[p]),e.values[r]=p,t.callback){var y=t.callback.call(i,p);if(typeof y=="object"&&y.length>=2){for(var b=0;b<_.length;b++)_[b].value=y[b];p=y}}T.trigger(i,"wchange",[p]),e.onchange&&e.onchange(r,p,i)});return this.append(i,t),i.setValue=function(u,p){u&&(s.getValue()!=u[0]&&s.setValue(u[0],!0),a.getValue()!=u[1]&&a.setValue(u[1],p))},i.setRange=function(u,p){s.setRange(u,p),a.setRange(u,p)},this.processElement(i,t),i};L.prototype.addVector3=function(r,n,t){t=this.processOptions(t),t.step||(t.step=.1),n=n||[0,0,0];var e=this;this.values[r]=n;var i=this.createWidget(r,"",t);t.step=t.step||.1,t.tab_index=this.tab_index,t.full=!0,this.tab_index++;var o=new T.Dragger(n[0],t);o.root.style.marginLeft=0,o.root.style.width="calc( 33% - 1px )",i.querySelector(".wcontent").appendChild(o.root),t.tab_index=this.tab_index,this.tab_index++;var s=new T.Dragger(n[1],t);s.root.style.width="calc( 33% - 1px )",i.querySelector(".wcontent").appendChild(s.root),t.tab_index=this.tab_index,this.tab_index++;var a=new T.Dragger(n[2],t);a.root.style.width="calc( 33% - 1px )",i.querySelector(".wcontent").appendChild(a.root),i.draggers=[o,s,a],o.root.addEventListener("start_dragging",l.bind(t)),s.root.addEventListener("start_dragging",l.bind(t)),a.root.addEventListener("start_dragging",l.bind(t));function l(u){this.callback_before&&this.callback_before()}for(var d=i.querySelectorAll("input"),h=0;h<d.length;++h)d[h].addEventListener("change",function(u){for(var p=[],_=d,b=0;b<_.length;b++)p.push(parseFloat(_[b].value));if(T.trigger(i,"wbeforechange",[p]),e.values[r]=p,t.callback){var y=t.callback.call(i,p);if(typeof y=="object"&&y.length>=3){for(var b=0;b<_.length;b++)_[b].value=y[b];p=y}}T.trigger(i,"wchange",[p]),e.onchange&&e.onchange(r,p,i)});return this.append(i,t),i.setValue=function(u,p){u&&(o.setValue(u[0],!0),s.setValue(u[1],!0),a.setValue(u[2],p))},i.setRange=function(u,p){o.setRange(u,p),s.setRange(u,p),a.setRange(u,p)},this.processElement(i,t),i};L.prototype.addVector4=function(r,n,t){t=this.processOptions(t),t.step||(t.step=.1),n=n||[0,0,0];var e=this;this.values[r]=n;var i=this.createWidget(r,"",t);t.step=t.step||.1,t.tab_index=this.tab_index,t.full=!0,this.tab_index++;for(var o=i.draggers=[],s=0;s<4;s++){var a=new T.Dragger(n[s],t);a.root.style.marginLeft=0,a.root.style.width="calc( 25% - 1px )",i.querySelector(".wcontent").appendChild(a.root),t.tab_index=this.tab_index,this.tab_index++,a.root.addEventListener("start_dragging",l.bind(t)),o.push(a)}function l(h){this.callback_before&&this.callback_before()}for(var d=i.querySelectorAll("input"),s=0;s<d.length;++s)d[s].addEventListener("change",function(u){for(var p=[],_=d,b=0;b<_.length;b++)p.push(parseFloat(_[b].value));if(T.trigger(i,"wbeforechange",[p]),e.values[r]=p,t.callback){var y=t.callback.call(i,p);if(typeof y=="object"&&y.length>=4){for(var b=0;b<_.length;b++)_[b].value=y[b];p=y}}T.trigger(i,"wchange",[p]),e.onchange&&e.onchange(r,p,i)});return this.append(i,t),i.setValue=function(h,u){if(h)for(var p=0;p<o.length;p++)o[p].setValue(h[p],u)},i.setRange=function(h,u){for(var p in o)o[p].setRange(h,u)},this.processElement(i,t),i};L.prototype.addPad=function(r,n,t){t=this.processOptions(t),t.step||(t.step=.1),n=n||[0,0];var e=this;this.values[r]=n;var i=this.createWidget(r,"",t);t.step=t.step||.1,t.tab_index=this.tab_index,t.full=!0,this.tab_index++;var o=t.minx||t.min||0,s=t.miny||t.min||0,a=t.maxx||t.max||1,l=t.maxy||t.max||1,d=i.querySelector(".wcontent"),h=document.createElement("div");h.className="litepad",d.appendChild(h),h.style.width="100%",h.style.height="100px",t.background&&(h.style.backgroundImage="url('"+t.background+"')",h.style.backgroundSize="100%",h.style.backgroundRepeat="no-repeat");var u=document.createElement("div");return u.className="litepad-handler",h.appendChild(u),t.tab_index=this.tab_index,this.tab_index++,h._onMouseEvent=function(p){var _=h.getBoundingClientRect();if(p.mousex=p.pageX-_.left,p.mousey=p.pageY-_.top,p.preventDefault(),p.stopPropagation(),p.type=="mousedown")document.body.addEventListener("mousemove",h._onMouseEvent),document.body.addEventListener("mouseup",h._onMouseEvent);else if(p.type=="mousemove"){var b=p.mousex/_.width,y=p.mousey/_.height;b=b*(a-o)+o,y=y*(l-s)+o;var m=[b,y];if(T.trigger(i,"wbeforechange",[m]),i.setValue(m),t.callback){var w=t.callback.call(i,m);if(w&&w.length>=2)for(var A=0;A<elems.length;A++)i.setValue(w)}T.trigger(i,"wchange",[m]),e.onchange&&e.onchange(r,m,i)}else p.type=="mouseup"&&(document.body.removeEventListener("mousemove",h._onMouseEvent),document.body.removeEventListener("mouseup",h._onMouseEvent));return!0},h.addEventListener("mousedown",h._onMouseEvent),i.setValue=function(p,_){if(p!==void 0){var b=h.getBoundingClientRect(),y=(p[0]-o)/(a-o),m=(p[1]-s)/(l-s);y=Math.max(0,Math.min(y,1)),m=Math.max(0,Math.min(m,1));var w=(b.width-10)/b.width*100,A=(b.height-10)/b.height*100;u.style.left=(y*w).toFixed(1)+"%",u.style.top=(m*A).toFixed(1)+"%"}},this.append(i,t),i.setValue(n),this.processElement(i,t),i};L.prototype.addInfo=function(r,n,t){t=this.processOptions(t),n=n??"";var e=null;r!=null?e=this.createWidget(r,n,t):(e=document.createElement("div"),t.className&&(e.className=t.className),n.nodeName!==void 0?(e.innerHTML="<span class='winfo'></span>",e.childNodes[0].appendChild(n)):e.innerHTML="<span class='winfo'>"+n+"</span>");var i=e.querySelector(".winfo")||e.querySelector(".wcontent");t.callback&&e.addEventListener("click",t.callback.bind(e)),e.setValue=function(s){s!==void 0&&i&&(i.innerHTML=s)};var o=e.querySelector("span.info_content");return o||(o=e.querySelector(".winfo")),t.width&&(e.style.width=T.sizeToCSS(t.width),e.style.display="inline-block",r||(i.style.margin="2px")),t.height&&(o.style.height=T.sizeToCSS(t.height),o.style.overflow="auto"),e.scrollToBottom=function(){o.scrollTop=o.offsetTop},e.add=function(s){o.appendChild(s)},this.append(e,t),this.processElement(e,t),e};L.prototype.addSlider=function(r,n,t){t=this.processOptions(t),t.min===void 0&&(t.min=0),t.max===void 0&&(t.max=1),t.step===void 0&&(t.step=.01);var e=this;n==null&&(n=0),this.values[r]=n;var i=this.createWidget(r,"<span class='inputfield full'>				<input tabIndex='"+this.tab_index+"' type='text' class='slider-text fixed liteslider-value' value='' /><span class='slider-container'></span></span>",t),o=i.querySelector(".slider-container"),s=new T.Slider(n,t);o.appendChild(s.root);var a=i.querySelector(".slider-text");return a.value=n,a.addEventListener("change",function(l){var d=parseFloat(this.value);n=d,s.setValue(d),L.onWidgetChange.call(e,i,r,d,t)}),s.onChange=function(l){a.value=l,L.onWidgetChange.call(e,i,r,l,t)},this.append(i,t),i.setValue=function(l,d){l!==void 0&&(n=l,s.setValue(l,d))},i.getValue=function(){return n},this.processElement(i,t),i};L.prototype.addCheckbox=function(r,n,t){t=this.processOptions(t),n=!!n;var e=this;this.values[r]=n;var i=t.label_on||t.label||"on",o=t.label_off||t.label||"off",s=n?i:o,a=this.createWidget(r,"<span class='inputfield'><span tabIndex='"+this.tab_index+"' class='fixed flag checkbox "+(n?"on":"off")+"'>"+s+"</span></span>",t);this.tab_index++;var l=a.querySelector(".wcontent .checkbox");return l.addEventListener("keypress",function(d){d.keyCode==32&&T.trigger(this,"click")}),a.addEventListener("click",function(){n=!n,a.querySelector("span.flag").innerHTML=n?i:o,n?l.classList.add("on"):l.classList.remove("on"),L.onWidgetChange.call(e,a,r,n,t)}),a.getValue=function(){return n},a.setValue=function(d,h){d!==void 0&&(n=d,e.values[r]!=d&&!h&&T.trigger(l,"click"))},this.append(a,t),this.processElement(a,t),a};L.prototype.addFlags=function(r,n,t){var e={};for(var i in r)e[i]=r[i];if(n)for(var i in n)typeof e[i]>"u"&&(e[i]=!!n[i]);for(var i in e){var o={};for(var s in t)o[s]=t[s];o.callback=function(l){return function(d){r[l]=d}}(i),this.addCheckbox(i,e[i],o)}};L.prototype.addCombo=function(r,n,t){t=this.processOptions(t);var e=this;this.values[r]=n,this.tab_index++;var i=this.createWidget(r,"<span class='inputfield full inputcombo "+(t.disabled?"disabled":"")+"'></span>",t);i.options=t;var o=t.values||[];o.constructor===Function&&(o=t.values());var s="<select tabIndex='"+this.tab_index+"' "+(t.disabled?"disabled":"")+" class='"+(t.disabled?"disabled":"")+"'></select>";i.querySelector("span.inputcombo").innerHTML=s,d(o);var a=!1,l=i.querySelector(".wcontent select");l.addEventListener("change",function(h){var u=h.target.value;n=o[u],!a&&L.onWidgetChange.call(e,i,r,n,t)}),i.getValue=function(){return n},i.setValue=function(h,u){if(h!==void 0){n=h;var p=i.querySelector("select"),_=p.querySelectorAll("option"),b=-1;if(o.constructor===Array)b=o.indexOf(h);else{var y=0;for(var m in o)if(o[y]==h){b=y;break}else y++}if(b!=-1){a=u;for(var m in _){var w=_[m];!w||!w.dataset||(parseFloat(w.dataset.index)==b?(w.setAttribute("selected",!0),p.selectedIndex=b):w.removeAttribute("selected"))}a=!1}}};function d(h,u){h||(h=[]),o=h,u&&(n=u);var p="",_=0;for(var b in o){var y=o[b],m=o.constructor===Array?_:b,w=o.constructor===Array?y:b;y&&y.title&&(w=y.title),p+="<option value='"+m+"' "+(y==n?" selected":"")+" data-index='"+m+"'>"+w+"</option>",_++}i.querySelector("select").innerHTML=p}return i.setOptionValues=d,this.append(i,t),this.processElement(i,t),i};L.prototype.addComboButtons=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this;this.values[r]=n;var i="";if(t.values)for(var o in t.values)i+="<button class='wcombobutton "+(n==t.values[o]?"selected":"")+"' data-name='options.values[i]'>"+t.values[o]+"</button>";var s=this.createWidget(r,i,t),a=s.querySelectorAll(".wcontent button");return T.bind(a,"click",function(l){var d=l.target.innerHTML;e.values[r]=d;for(var h=s.querySelectorAll(".selected"),u=0;u<h.length;++u)h[u].classList.remove("selected");this.classList.add("selected"),L.onWidgetChange.call(e,s,r,d,t)}),this.append(s,t),this.processElement(s,t),s};L.prototype.addTags=function(r,n,t){t=this.processOptions(t),n=n||[];var e=this;this.values[r]=n;var i="<select>";if(t.values)for(var o in t.values)i+="<option>"+t.values[o]+"</option>";i+="</select><div class='wtagscontainer inputfield'></div>";var s=this.createWidget(r,"<span class='inputfield full'>"+i+"</span>",t);s.tags={};for(var o in t.value)l(t.value[o]);var a=s.querySelector(".wcontent select");a.addEventListener("change",function(d){l(d.target.value)});function l(d){if(!s.tags[d]){T.trigger(s,"wbeforechange",s.tags),s.tags[d]=!0;var h=document.createElement("div");h.data=d,h.className="wtag",h.innerHTML=d+"<span class='close'>X</span>",h.querySelector(".close").addEventListener("click",function(u){var p=this.parentNode.data;delete s.tags[p],T.remove(this.parentNode),T.trigger(s,"wremoved",p),L.onWidgetChange.call(e,s,r,s.tags,t)}),s.querySelector(".wtagscontainer").appendChild(h),e.values[r]=s.tags,t.callback&&t.callback.call(s,s.tags),T.trigger(s,"wchange",s.tags),T.trigger(s,"wadded",d),e.onchange&&e.onchange(r,s.tags,s)}}return this.append(s,t),this.processElement(s,t),s};L.prototype.addList=function(r,n,t){t=this.processOptions(t);var e=this,i="";t.height&&(i="style='height: 100%; overflow: auto;'");var o="<ul class='lite-list' "+i+" tabIndex='"+this.tab_index+"'><ul>";this.tab_index++;var s=this.createWidget(r,"<span class='inputfield full "+(t.disabled?"disabled":"")+"' style='height: 100%;'>"+o+"</span>",t),a=s.querySelector(".info_content");a.style.height="100%",s.querySelector(".lite-list");var l=s.querySelector(".inputfield");l.style.height="100%",l.style.paddingBottom="0.2em";for(var d=s.querySelectorAll("ul"),h=0;h<d.length;++h){var u=d[h];u.addEventListener("focus",function(){document.addEventListener("keydown",p,!0)}),u.addEventListener("blur",function(){document.removeEventListener("keydown",p,!0)})}function p(m){var w=s.querySelector("li.selected");if(w){if(m.keyCode==13){if(!w)return;var A=n[w.dataset.pos];t.callback_dblclick&&t.callback_dblclick.call(e,A)}else if(m.keyCode==40){var V=w.nextSibling;V&&T.trigger(V,"click"),w.scrollIntoViewIfNeeded&&w.scrollIntoViewIfNeeded({block:"end",behavior:"smooth"})}else if(m.keyCode==38){var H=w.previousSibling;H&&T.trigger(H,"click"),w.scrollIntoViewIfNeeded&&w.scrollIntoViewIfNeeded({block:"end",behavior:"smooth"})}else return;return m.preventDefault(),m.stopPropagation(),!0}}function _(m){if(t.multiselection)this.classList.toggle("selected");else{for(var w=s.querySelectorAll("li"),A=0;A<w.length;++A)w[A].classList.remove("selected");this.classList.add("selected")}var V=n[this.dataset.pos];L.onWidgetChange.call(e,s,r,V,t),T.trigger(s,"wadded",V)}function b(m){var w=n[this.dataset.pos];t.callback_dblclick&&t.callback_dblclick.call(e,w)}s.updateItems=function(m,w){w=w||t.selected,n=m;var A=this.querySelector("ul");if(A.innerHTML="",n)for(var V in n){var H=n[V],Z=y(H,w,V);A.appendChild(Z)}T.bind(A.querySelectorAll("li"),"click",_)};function y(m,w,A){var V=A,H=A;w=!!w;var Z=null,at="";m!=null&&(m.constructor===String||m.constructor===Number||m.constructor===Boolean?H=String(m):m&&(H=m.content||m.title||m.name||A,Z=m.style,m.icon&&(at="<img src='"+m.icon+"' class='icon' /> "),m.selected&&(w=!0)));var bt=H;bt=bt.replace(/<(?:.|\n)*?>/gm,"");var nt=document.createElement("li");return nt.classList.add("item-"+T.safeName(V)),w&&nt.classList.add("selected"),nt.dataset.name=bt,nt.dataset.pos=V,nt.value=m,Z&&nt.setAttribute("style",Z),nt.innerHTML=at+H,nt.addEventListener("click",_),t.callback_dblclick&&nt.addEventListener("dblclick",b),nt}return s.addItem=function(m,w,A){if(n.constructor!==Array){console.error("cannot add item to list of object, only array");return}n.push(m);var V=this.querySelector("ul"),H=y(m,w);V.appendChild(H)},s.removeItem=function(m){for(var w=s.querySelectorAll(".wcontent li"),A=0;A<w.length;A++)w[A].dataset.name==m&&T.remove(w[A])},s.updateItems(n,t.selected),this.append(s,t),s.getSelected=function(){for(var m=[],w=this.querySelectorAll("ul li.selected"),A=0;A<w.length;++A)m.push(w[A].dataset.name);return m},s.getByIndex=function(m){var w=this.querySelectorAll("ul li");return w[m]},s.getIndex=s.getByIndex,s.selectIndex=function(m,w){for(var A=this.querySelectorAll("ul li"),V=0;V<A.length;++V){var H=A[V];V==m?H.classList.add("selected"):w||H.classList.remove("selected")}return A[m]},s.deselectIndex=function(m){var w=this.querySelectorAll("ul li"),A=w[m];return A&&A.classList.remove("selected"),A},s.scrollToIndex=function(m){var w=this.querySelectorAll("ul li"),A=w[m];A&&(this.scrollTop=A.offsetTop)},s.selectAll=function(){for(var m=this.querySelectorAll("ul li"),w=0;w<m.length;++w){var A=m[w];A.classList.contains("selected")||T.trigger(A,"click")}},s.deselectAll=function(){for(var m=this.querySelectorAll("ul li"),w=0;w<m.length;++w){var A=m[w];A.classList.contains("selected")&&T.trigger(A,"click")}},s.setValue=function(m){m!==void 0&&this.updateItems(m)},s.getNumberOfItems=function(){var m=this.querySelectorAll("ul li");return m.length},s.filter=function(m,w){var A=this.querySelectorAll("ul li"),V=!1;if(m&&m.constructor===String){var H=m;w&&H.toLowerCase(),V=!0,m=function(nt){return(w?nt:nt.toLowerCase()).indexOf(H)!=-1}}for(var Z=0;Z<A.length;++Z){var at=A[Z];if(!m){at.style.display="";continue}var bt=at.value;V&&bt!=null&&bt.constructor!==String&&(bt=at.innerHTML),m(bt,at,at.classList.contains("selected"))?at.style.display="":at.style.display="none"}},s.selectByFilter=function(m){for(var w=this.querySelectorAll("ul li"),A=0;A<w.length;++A){var V=w[A],H=m(V.value,V,V.classList.contains("selected"));H===!0?V.classList.add("selected"):H===!1&&V.classList.remove("selected")}},t.height&&(s.scrollTop=0),this.processElement(s,t),s};L.prototype.addButton=function(r,n,t){t=this.processOptions(t),n=t.button_text||n||"";var e=this,i="";r===null&&(i="single"),t.micro&&(i+=" micro");var o="";t.disabled&&(o="disabled='disabled'");var s=t.title||"",a=this.createWidget(r,"<button tabIndex='"+this.tab_index+"' "+o+"></button>",t);this.tab_index++;var l=a.querySelector("button");return l.setAttribute("title",s),l.className="litebutton "+i,l.innerHTML=n,l.addEventListener("click",function(d){L.onWidgetChange.call(e,a,r,this.innerHTML,t,!1,d),T.trigger(l,"wclick",n)}),this.append(a,t),a.wclick=function(d){t.disabled||T.bind(this,"wclick",d)},a.setValue=function(d){d!==void 0&&(l.innerHTML=d)},a.disable=function(){l.disabled=!0},a.enable=function(){l.disabled=!1},this.processElement(a,t),a};L.prototype.addButtons=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this,i="",o="calc( "+(100/n.length).toFixed(3)+"% - 4px )",s="width:"+o+"; width: -moz-"+o+"; width: -webkit-"+o+"; margin: 2px;";if(n&&typeof n=="object")for(var a in n){var l="";t.title&&t.title.constructor===Array&&(l=t.title[a]||""),i+="<button class='litebutton' title='"+l+"' tabIndex='"+this.tab_index+"' style='"+s+"'>"+n[a]+"</button>",this.tab_index++}for(var d=this.createWidget(r,i,t),h=d.querySelectorAll("button"),a=0;a<h.length;++a){var u=h[a];u.addEventListener("click",function(_){L.onWidgetChange.call(e,d,r,this.innerHTML,t,null,_),T.trigger(d,"wclick",this.innerHTML)})}return this.append(d,t),this.processElement(d,t),d};L.prototype.addIcon=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this,i=t.image,o=t.width||t.size||20,s=t.height||t.size||20,a=this.createWidget(r,"<span class='icon' "+(t.title?"title='"+t.title+"'":"")+" tabIndex='"+this.tab_index+"'></span>",t);this.tab_index++;var l=a.querySelector("span.wcontent"),d=a.querySelector("span.icon"),h=t.x||0;t.index&&(h=t.index*-o);var u=n?s:0;return a.style.minWidth=a.style.width=o+"px",a.style.margin="0 2px",a.style.padding="0",l.style.margin="0",l.style.padding="0",d.style.display="inline-block",d.style.cursor="pointer",d.style.width=o+"px",d.style.height=s+"px",d.style.backgroundImage="url('"+i+"')",d.style.backgroundPosition=h+"px "+u+"px",d.addEventListener("mousedown",function(p){p.preventDefault(),n=!n;var _=L.onWidgetChange.call(e,a,r,n,t);T.trigger(a,"wclick",n),_!==void 0&&(n=_);var b=n?s:0;d.style.backgroundPosition=h+"px "+b+"px",t.toggle===!1&&setTimeout(function(){d.style.backgroundPosition=h+"px 0px",n=!1},200)}),this.append(a,t),a.setValue=function(p,_){if(p!==void 0){n=p;var b=n?s:0;d.style.backgroundPosition=h+"px "+b+"px",_||L.onWidgetChange.call(e,a,r,n,t)}},a.getValue=function(){return n},this.processElement(a,t),a};L.prototype.addColor=function(r,n,t){t=this.processOptions(t),n=n||[0,0,0];var e=this;this.values[r]=n;var i="<input tabIndex='"+this.tab_index+"' id='colorpicker-"+r+"' class='color' value='"+(n[0]+","+n[1]+","+n[2])+"' "+(t.disabled?"disabled":"")+"/>";this.tab_index++,t.show_rgb&&(i+="<span class='rgb-color'>"+L.parseColor(n)+"</span>");var o=this.createWidget(r,i,t);this.append(o,t);var s=o.querySelector("input.color"),a=null;if(window.jscolor){if(a=new jscolor.color(s),a.pickerFaceColor="#333",a.pickerBorderColor="black",a.pickerInsetColor="#222",a.rgb_intensity=1,t.disabled&&(a.pickerOnfocus=!1),n.constructor!==String&&n.length&&n.length>2){var l=1;a.fromRGB(n[0]*l,n[1]*l,n[2]*l),a.rgb_intensity=l}s.addEventListener("change",function(h){var u=o.querySelector(".rgb-color");u&&(u.innerHTML=L.parseColor(a.rgb))}),a.onImmediateChange=function(){var h=[a.rgb[0]*a.rgb_intensity,a.rgb[1]*a.rgb_intensity,a.rgb[2]*a.rgb_intensity],u=[h.concat(),a.toString()];T.trigger(o,"wbeforechange",u),e.values[r]=h,t.callback&&t.callback.call(o,h.concat(),"#"+a.toString(),a),T.trigger(o,"wchange",u),e.onchange&&e.onchange(r,h.concat(),o)},t.step=t.step||.01,t.dragger_class="nano";var d=new T.Dragger(1,t);o.querySelector(".wcontent").appendChild(d.root),d.input.addEventListener("change",function(h){var u=parseFloat(this.value);a.rgb_intensity=u,a.onImmediateChange&&a.onImmediateChange()}),o.setValue=function(h,u){a.fromRGB(h[0],h[1],h[2]),u||T.trigger(d.input,"change")},o.getValue=function(){return n}}else s.addEventListener("change",function(h){var u=o.querySelector(".rgb-color");u&&(u.innerHTML=L.parseColor(a.rgb))});return this.processElement(o,t),o};L.prototype.addFile=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this;this.values[r]=n;var i=this.createWidget(r,"<span class='inputfield full whidden' style='width: calc(100% - 26px)'><span class='filename'></span></span><button class='litebutton' style='width:20px; margin-left: 2px;'>...</button><input type='file' size='100' class='file' value='"+n+"'/>",t),o=i.querySelector(".wcontent");o.style.position="relative";var s=i.querySelector(".wcontent input"),a=i.querySelector(".wcontent .filename");return n&&(a.innerText=n.name),s.addEventListener("change",function(l){if(!l.target.files.length){a.innerText="",L.onWidgetChange.call(e,i,r,null,t);return}var d=l.target.files[0];if(d.files=l.target.files,t.generate_url&&(d.url=URL.createObjectURL(l.target.files[0])),a.innerText=d.name,t.read_file){var h=new FileReader;h.onload=function(u){d.data=u.target.result,L.onWidgetChange.call(e,i,r,d,t)},t.read_file=="binary"?h.readAsArrayBuffer(d):t.read_file=="data_url"?h.readAsDataURL(d):h.readAsText(d)}else L.onWidgetChange.call(e,i,r,d,t)}),this.append(i,t),i};L.prototype.addLine=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this;this.values[r]=n;var i=this.createWidget(r,"<span class='line-editor'></span>",t);i.style.width="100%";var o=new T.LineEditor(n,t);return i.querySelector("span.line-editor").appendChild(o.root),T.bind(o,"change",function(s){T.trigger(i,"wbeforechange",[s.target.value]),t.callback&&t.callback.call(i,s.target.value),T.trigger(i,"wchange",[s.target.value]),L.onWidgetChange.call(e,i,r,s.target.value,t)}),this.append(i,t),i};L.prototype.addTree=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this.createWidget(r,"<div class='wtree inputfield full'></div>",t),i=e.querySelector(".wtree");t.height&&(i.style.height=typeof t.height=="number"?t.height+"px":t.height,i.style.overflow="auto");var o=e.tree=new R(n,t.tree_options);return o.onItemSelected=function(s,a){t.callback&&t.callback.call(e,s,a)},i.appendChild(o.root),e.setValue=function(s){o.updateTree(s)},this.append(e,t),this.processElement(e,t),e};L.prototype.addDataTree=function(r,n,t){t=this.processOptions(t),n=n||"";var e=this.createWidget(r,"<div class='wtree'></div>",t),i=e.querySelector(".wtree");o(i,n);function o(s,a){for(var l in a){var d=document.createElement("div");d.className="treenode",typeof a[l]=="object"?(d.innerHTML="<span class='itemname'>"+l+"</span><span class='itemcontent'></span>",o(d.querySelector(".itemcontent"),a[l])):d.innerHTML="<span class='itemname'>"+l+"</span><span class='itemvalue'>"+a[l]+"</span>",s.appendChild(d)}}return this.append(e,t),e};L.prototype.addArray=function(r,n,t){var e=this;if(!n||n.constructor!==Array){console.error("Inspector: Array widget value must be a valid array");return}t=this.processOptions(t);var i=t.data_type||"string",o=t.max_items||100,s=null;this.widgets_per_row=3,this.addInfo(r,null,{name_width:"100%",width:"100% - 160px"});var a=this.addString("length",n.length||"0",{width:100,callback:function(u){var u=parseInt(u);n<0&&(n=0),n.length=u,l.call(s)}});this.addButtons(null,["+","-"],{width:60,callback:function(h){h=="+"?n.length=n.length+1:n.length>0&&(n.length=n.length-1),a.setValue(n.length),l.call(s)}}),this.widgets_per_row=1,s=this.addContainer(r,t),s.value=n,l.call(s);function l(){var h=this,u=h.value,p=Math.min(u.length,o);e.widgets_per_row+=1,h.innerHTML="";for(var _=0;_<p;++_){var b=null;u[_]!==void 0&&(b=u[_]);var y=document.createElement("div");y.className="array-row",y.innerHTML="<span class='row-index'>"+_+"</span><span class='row-cell'></span><button style='width: 30px;' class='litebutton single row-trash'><img src='imgs/mini-icon-trash.png'/></button>",h.appendChild(y);var m=y.querySelector(".row-cell"),w={widget_parent:m,callback:d.bind({value:this.value,index:_})};if(t.data_options)for(var A in t.data_options)w[A]=t.data_options[A];e.add(i,null,b,w)}e.widgets_per_row-=1}function d(h){this.value[this.index]=h,t.callback&&t.callback.call(s,this.value,this.index)}return s.setValue=function(h){this.value=h,l.call(s)},s.getValue=function(){return this.value=v},s};L.prototype.addContainer=function(r,n){r&&r.constructor!==String&&console.warn("Inspector.addContainer first parameter must be a string with the name");var t=this.startContainer(null,n);return this.endContainer(),t};L.prototype.startContainer=function(r,n){n=this.processOptions(n);var t=document.createElement("DIV");return t.className="wcontainer",this.applyOptions(t,n),this.row_number=0,this.append(t),this.pushContainer(t),n.widgets_per_row&&(this.widgets_per_row=n.widgets_per_row),n.height&&(t.style.height=T.sizeToCSS(n.height),t.style.overflow="auto"),t.refresh=function(){t.on_refresh&&t.on_refresh.call(this,t)},t};L.prototype.endContainer=function(r,n){this.popContainer()};L.prototype.addSection=function(r,n){n=this.processOptions(n);var t=this;this.current_section&&this.current_section.end();var e=document.createElement("DIV");e.className="wsection",r||(e.className+=" notitle"),n.className&&(e.className+=" "+n.className),n.collapsed&&(e.className+=" collapsed"),n.id&&(e.id=n.id),n.instance&&(e.instance=n.instance);var i="";return r&&(i+="<div class='wsectiontitle'>"+(n.no_collapse?"":"<span class='switch-section-button'></span>")+r+"</div>"),i+="<div class='wsectioncontent'></div>",e.innerHTML=i,e._last_container_stack=this._current_container_stack.concat(),this.root.appendChild(e),this.sections.push(e),e.sectiontitle=e.querySelector(".wsectiontitle"),r&&e.sectiontitle.addEventListener("click",function(o){if(o.target.localName!="button"){e.classList.toggle("collapsed");var s=e.querySelector(".wsectioncontent");s.style.display=s.style.display==="none"?null:"none",n.callback&&n.callback.call(e,!e.classList.contains("collapsed"))}}),n.collapsed&&(e.querySelector(".wsectioncontent").style.display="none"),this.setCurrentSection(e),n.widgets_per_row&&(this.widgets_per_row=n.widgets_per_row),e.refresh=function(){e.on_refresh&&e.on_refresh.call(this,e)},e.end=function(){if(t.current_section==this){t._current_container_stack=this._last_container_stack,t._current_container=null;var o=this.querySelector(".wsectioncontent");o&&(t.isContainerInStack(o)&&t.popContainer(o),t.current_section=null)}},e};L.prototype.setCurrentSection=function(r){if(this.current_section!=r){this.current_section=r;var n=r.parentNode;this.popContainer(n);var t=r.querySelector(".wsectioncontent");this.pushContainer(t)}};L.prototype.getCurrentSection=function(){for(var r=this._current_container_stack.length-1;r>=0;--r){var n=this._current_container_stack[r];if(n.classList.contains("wsectioncontent"))return n.parentNode}return null};L.prototype.endCurrentSection=function(){this.current_section&&this.current_section.end()};L.prototype.beginGroup=function(r,n){n=this.processOptions(n);var t=document.createElement("DIV");t.className="wgroup",r=r||"",t.innerHTML="<div class='wgroupheader "+(n.title?"wtitle":"")+"'><span class='switch-section-button'></span>"+r+"</div>",t.group=!0;var e=document.createElement("DIV");e.className="wgroupcontent",n.collapsed&&(e.style.display="none"),n.height&&(e.style.height=T.sizeToCSS(n.height)),n.scrollable&&(e.style.overflow="auto"),t.appendChild(e);var i=n.collapsed||!1,o=t.querySelector(".wgroupheader");return i&&o.classList.add("collapsed"),o.addEventListener("click",function(s){var a=t.querySelector(".wgroupcontent").style;a.display=a.display==="none"?"":"none",i=!i,i?o.classList.add("collapsed"):o.classList.remove("collapsed"),s.preventDefault()}),this.append(t,n),this.pushContainer(e),t};L.prototype.endGroup=function(){do this.popContainer();while(this._current_container&&!this._current_container.classList.contains("wgroupcontent"))};L.prototype.addTitle=function(r,n){n=this.processOptions(n);var t=document.createElement("DIV"),e="<span class='wtitle'><span class='text'>"+r+"</span>";return n.help&&(e+="<span class='help'><div class='help-content'>"+n.help+"</div></span>"),e+="</span>",t.innerHTML=e,t.setValue=function(i){this.querySelector(".text").innerHTML=i},this.row_number=0,this.append(t,n),t};L.prototype.scrollTo=function(r){var n=this.root.querySelector("#"+r);if(n){var t=this.root.offsetTop,e=n.offsetTop-t;this.root.parentNode.parentNode.scrollTop=e}};L.prototype.processOptions=function(r){return typeof r=="function"&&(r={callback:r}),r||{}};L.prototype.processElement=function(r,n){n.callback_update&&r.setValue&&(r.on_update=function(){this.setValue(n.callback_update.call(this),!0)})};L.prototype.updateWidgets=function(){for(var r=0;r<this.widgets.length;++r){var n=this.widgets[r];n.on_update&&n.on_update(n)}};L.parseColor=function(r){return"<span style='color: #FAA'>"+r[0].toFixed(2)+"</span>,<span style='color: #AFA'>"+r[1].toFixed(2)+"</span>,<span style='color: #AAF'>"+r[2].toFixed(2)+"</span>"};const Be="http://www.w3.org/2000/svg";class Fr extends Q{constructor(t={}){super();c(this,"root");c(this,"canvas");c(this,"svg");c(this,"nodesLayer");c(this,"selectedId",null);c(this,"nodes",[]);c(this,"links",[]);c(this,"nodeElements",new Map);c(this,"readOnly");c(this,"tempPath",null);c(this,"connecting",null);c(this,"draggingNode",null);c(this,"raf",0);c(this,"onPointerMove",t=>{if(this.draggingNode){const e=this.nodes.find(s=>{var a;return s.id===((a=this.draggingNode)==null?void 0:a.id)}),i=this.draggingNode?this.nodeElements.get(this.draggingNode.id):null;if(!e||!i)return;const o=this.canvas.getBoundingClientRect();e.x=Math.max(0,t.clientX-o.left-this.draggingNode.offsetX),e.y=Math.max(0,t.clientY-o.top-this.draggingNode.offsetY),i.style.left=`${e.x}px`,i.style.top=`${e.y}px`,this.draggingNode.moved=!0,this.scheduleLinks();return}this.connecting&&(this.connecting.x=t.clientX,this.connecting.y=t.clientY,this.updateTempPath(t.clientX,t.clientY))});c(this,"onPointerUp",t=>{if(this.draggingNode){const e=this.draggingNode.moved;this.draggingNode=null,e&&this.emitChange()}if(this.connecting){const e=this.connecting;this.connecting=null,this.removeTempPath();const i=document.elementFromPoint(t.clientX,t.clientY),o=i==null?void 0:i.closest(".lg-node-editor__port");if(o){const s=o.dataset.node,a=o.dataset.port,l=o.dataset.kind;s&&a&&l&&l!==e.kind&&s!==e.nodeId&&(e.kind==="output"?this.addLink({from:e.nodeId,fromPort:e.portId,to:s,toPort:a},!0):this.addLink({from:s,fromPort:a,to:e.nodeId,toPort:e.portId},!0))}}});this.readOnly=t.readOnly||!1,this.root=document.createElement("div"),this.root.className=["lg-node-editor",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),this.root.tabIndex=0,this.canvas=document.createElement("div"),this.canvas.className="lg-node-editor__canvas",this.svg=document.createElementNS(Be,"svg"),this.svg.classList.add("lg-node-editor__links"),this.svg.setAttribute("width","100%"),this.svg.setAttribute("height","100%"),this.nodesLayer=document.createElement("div"),this.nodesLayer.className="lg-node-editor__nodes";const e=document.createElement("div");e.className="lg-node-editor__hint",e.textContent="Drag nodes · Drag a port to connect · Delete: remove selected",this.canvas.append(this.svg,this.nodesLayer,e),this.root.appendChild(this.canvas),this.bindEvents(),this.setGraph(t.nodes||[],t.links||[]),typeof ResizeObserver<"u"&&new ResizeObserver(()=>this.scheduleLinks()).observe(this.root)}bindEvents(){this.root.addEventListener("pointerdown",t=>{const e=t.target;this.readOnly||!e.closest(".lg-node-editor__node")&&!e.closest(".lg-node-editor__port")&&this.select(null)}),window.addEventListener("pointermove",this.onPointerMove),window.addEventListener("pointerup",this.onPointerUp),this.root.addEventListener("keydown",t=>{(t.key==="Delete"||t.key==="Backspace")&&!this.readOnly&&this.selectedId&&(t.preventDefault(),this.removeNode(this.selectedId))})}setGraph(t,e){return this.nodes=t.map(i=>{var o,s;return{...i,inputs:(o=i.inputs)==null?void 0:o.slice(),outputs:(s=i.outputs)==null?void 0:s.slice()}}),this.links=e.filter(i=>this.validLink(i)).map(i=>({...i})),this.selectedId=null,this.render(),this}getGraph(){return{nodes:this.nodes.map(t=>{var e,i;return{...t,inputs:(e=t.inputs)==null?void 0:e.map(o=>({...o})),outputs:(i=t.outputs)==null?void 0:i.map(o=>({...o}))}}),links:this.links.map(t=>({...t}))}}getNodes(){return this.getGraph().nodes}getLinks(){return this.getGraph().links}addNode(t){var e,i;return this.nodes.some(o=>o.id===t.id)?this:(this.nodes.push({...t,inputs:(e=t.inputs)==null?void 0:e.slice(),outputs:(i=t.outputs)==null?void 0:i.slice()}),this.render(),this.emitChange(),this)}removeNode(t){return this.nodes=this.nodes.filter(e=>e.id!==t),this.links=this.links.filter(e=>e.from!==t&&e.to!==t),this.selectedId===t&&(this.selectedId=null),this.render(),this.emitChange(),this}addLink(t,e=!1){return this.validLink(t)?this.links.some(o=>o.from===t.from&&o.fromPort===t.fromPort&&o.to===t.to&&o.toPort===t.toPort)?this:(this.links.push({...t}),this.renderLinks(),e&&this.emitChange(),this):this}removeLink(t){return this.links=this.links.filter(e=>!(e.from===t.from&&e.fromPort===t.fromPort&&e.to===t.to&&e.toPort===t.toPort)),this.renderLinks(),this.emitChange(),this}select(t){this.selectedId=t;for(const[e,i]of this.nodeElements)i.classList.toggle("lg-node-editor__node--selected",e===t);return this.emit("select",t),this}getSelected(){return this.selectedId}validLink(t){var o,s;const e=this.nodes.find(a=>a.id===t.from),i=this.nodes.find(a=>a.id===t.to);return!(!e||!i||!((o=e.outputs)!=null&&o.some(a=>a.id===t.fromPort))||!((s=i.inputs)!=null&&s.some(a=>a.id===t.toPort)))}render(){this.nodesLayer.innerHTML="",this.nodeElements.clear();for(const t of this.nodes)this.nodesLayer.appendChild(this.createNodeElement(t));this.renderLinks()}createNodeElement(t){const e=document.createElement("div");e.className="lg-node-editor__node",e.dataset.nodeId=t.id,e.style.left=`${t.x}px`,e.style.top=`${t.y}px`,t.width&&(e.style.width=`${t.width}px`),t.color&&e.style.setProperty("--lg-node-color",t.color),t.id===this.selectedId&&e.classList.add("lg-node-editor__node--selected");const i=document.createElement("div");i.className="lg-node-editor__node-header",i.innerHTML=`<span class="lg-node-editor__node-title">${t.title}</span><span class="lg-node-editor__node-dot"></span>`,i.addEventListener("pointerdown",d=>this.beginNodeDrag(d,t,e)),i.addEventListener("click",()=>{this.select(t.id),this.root.focus({preventScroll:!0})});const o=document.createElement("div");o.className="lg-node-editor__node-body";const s=document.createElement("div");s.className="lg-node-editor__ports";const a=document.createElement("div");a.className="lg-node-editor__port-col";for(const d of t.inputs||[])a.appendChild(this.createPortElement(t,d,"input"));const l=document.createElement("div");l.className="lg-node-editor__port-col lg-node-editor__port-col--output";for(const d of t.outputs||[])l.appendChild(this.createPortElement(t,d,"output"));return s.append(a,l),o.appendChild(s),e.append(i,o),e.addEventListener("click",()=>this.select(t.id)),this.nodeElements.set(t.id,e),e}createPortElement(t,e,i){const o=document.createElement("div");o.className=`lg-node-editor__port lg-node-editor__port--${i}`,o.dataset.node=t.id,o.dataset.port=e.id,o.dataset.kind=i,this.links.some(l=>i==="input"?l.to===t.id&&l.toPort===e.id:l.from===t.id&&l.fromPort===e.id)&&o.classList.add("lg-node-editor__port--linked");const s=document.createElement("span");s.className="lg-node-editor__dot";const a=document.createElement("span");return a.className="lg-node-editor__port-name",a.textContent=e.name,i==="input"?o.append(s,a):o.append(a,s),o.addEventListener("pointerdown",l=>{this.readOnly||l.button===0&&(l.preventDefault(),l.stopPropagation(),this.select(t.id),this.connecting={nodeId:t.id,portId:e.id,kind:i,x:l.clientX,y:l.clientY},this.createTempPath(),this.updateTempPath(l.clientX,l.clientY))}),o}beginNodeDrag(t,e,i){if(this.readOnly||t.button!==0||t.target.closest(".lg-node-editor__port"))return;t.preventDefault(),this.select(e.id),this.root.focus({preventScroll:!0});const o=i.getBoundingClientRect();this.draggingNode={id:e.id,offsetX:t.clientX-o.left,offsetY:t.clientY-o.top,moved:!1}}renderLinks(){for(;this.svg.firstChild;)this.svg.removeChild(this.svg.firstChild);for(const t of this.links){const e=this.buildLinkPath(t);if(!e)continue;const i=document.createElementNS(Be,"path");i.setAttribute("d",e),i.classList.add("lg-node-editor__link"),this.svg.appendChild(i)}this.tempPath&&this.svg.appendChild(this.tempPath)}buildLinkPath(t){const e=this.portCenter(t.from,t.fromPort,"output"),i=this.portCenter(t.to,t.toPort,"input");return!e||!i?"":this.curve(e,i)}portCenter(t,e,i){const o=this.nodesLayer.querySelector(`.lg-node-editor__port[data-node="${t}"][data-port="${e}"][data-kind="${i}"]`);if(!o)return null;const a=(o.querySelector(".lg-node-editor__dot")||o).getBoundingClientRect(),l=this.canvas.getBoundingClientRect();return{x:a.left-l.left+a.width/2,y:a.top-l.top+a.height/2}}curve(t,e){const i=Math.max(36,Math.abs(e.x-t.x)*.5);return`M ${t.x} ${t.y} C ${t.x+i} ${t.y}, ${e.x-i} ${e.y}, ${e.x} ${e.y}`}createTempPath(){this.tempPath=document.createElementNS(Be,"path"),this.tempPath.classList.add("lg-node-editor__link","lg-node-editor__link--temp"),this.svg.appendChild(this.tempPath)}removeTempPath(){var t;(t=this.tempPath)==null||t.remove(),this.tempPath=null}updateTempPath(t,e){if(!this.tempPath||!this.connecting)return;const i=this.canvas.getBoundingClientRect(),o={x:t-i.left,y:e-i.top},s=this.portCenter(this.connecting.nodeId,this.connecting.portId,this.connecting.kind);s&&this.tempPath.setAttribute("d",this.connecting.kind==="output"?this.curve(s,o):this.curve(o,s))}emitChange(){this.emit("change",this.getGraph())}scheduleLinks(){this.raf||(this.raf=requestAnimationFrame(()=>{this.raf=0,this.renderLinks()}))}refresh(){return this.renderLinks(),this}appendTo(t){return t.appendChild(this.root),this}}class jr extends Q{constructor(t={}){super();c(this,"root");c(this,"leftElement");c(this,"rightElement");this.root=document.createElement("footer"),this.root.className=["lg-status-bar",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),this.leftElement=document.createElement("div"),this.leftElement.className="lg-status-bar__left",this.rightElement=document.createElement("div"),this.rightElement.className="lg-status-bar__right",this.root.append(this.leftElement,this.rightElement),t.left&&this.setLeft(t.left),t.right&&t.right.forEach(e=>this.addRight(e)),t.accent&&this.addAccent(t.accent)}setLeft(t){return this.leftElement.textContent=t,this}getLeft(){return this.leftElement.textContent||""}setRight(t){return this.rightElement.innerHTML="",t.forEach(e=>this.addRight(e)),this}addRight(t){if(typeof t=="string"){const e=document.createElement("span");return e.className="lg-status-bar__item",e.textContent=t,this.rightElement.appendChild(e),this}return this.rightElement.appendChild(t),this}setRightText(t){return this.rightElement.innerHTML="",this.addRight(t)}addAccent(t){const e=document.createElement("span");return e.className="lg-status-bar__item lg-status-bar__accent",e.textContent=t,this.rightElement.appendChild(e),this}appendTo(t){return t.appendChild(this.root),this}}class Wr extends Q{constructor(t={}){var i,o;super();c(this,"root");c(this,"tabsElement");c(this,"body");c(this,"gutter");c(this,"textarea");c(this,"footer");c(this,"statusElement");c(this,"language");c(this,"encoding");c(this,"tabs");c(this,"activeTabId");c(this,"tabValues",new Map);c(this,"tabButtons",new Map);c(this,"readOnly",!1);this.language=t.language||"Python",this.encoding=t.encoding||"UTF-8",this.tabs=(i=t.tabs)!=null&&i.length?t.tabs:[{id:"text",label:t.title||"Text",value:t.value||""}],this.activeTabId=t.activeTab||this.tabs[0].id,this.readOnly=t.readOnly||!1;for(const s of this.tabs)this.tabValues.set(s.id,s.value||"");if(this.root=document.createElement("div"),this.root.className=["lg-text-editor",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),this.tabsElement=document.createElement("div"),this.tabsElement.className="lg-text-editor__tabs",this.root.appendChild(this.tabsElement),t.showTabs!==!1&&this.tabs.length){for(const a of this.tabs){const l=document.createElement("button");l.type="button",l.className="lg-text-editor__tab",l.dataset.tab=a.id,l.textContent=a.label,l.addEventListener("click",()=>this.setTab(a.id,!0)),this.tabsElement.appendChild(l),this.tabButtons.set(a.id,l)}const s=document.createElement("span");s.className="lg-text-editor__meta",s.textContent=`${this.language}`,this.tabsElement.appendChild(s)}else{const s=document.createElement("span");s.className="lg-text-editor__meta",s.textContent=t.title||`${this.language} · 示例`,this.tabsElement.appendChild(s)}this.body=document.createElement("div"),this.body.className="lg-text-editor__body",this.gutter=document.createElement("div"),this.gutter.className="lg-text-editor__gutter",this.gutter.setAttribute("aria-hidden","true"),this.textarea=document.createElement("textarea"),this.textarea.className="lg-text-editor__textarea",this.textarea.spellcheck=!1,this.textarea.wrap="off",this.textarea.setAttribute("aria-label",t.title||"Text editor"),this.body.append(this.gutter,this.textarea),this.root.appendChild(this.body),this.footer=document.createElement("div"),this.footer.className="lg-text-editor__footer",this.statusElement=document.createElement("span"),this.statusElement.className="lg-text-editor__status",this.footer.appendChild(this.statusElement);const e=document.createElement("span");e.className="lg-text-editor__meta",e.textContent=`${this.language} · ${this.encoding}`,this.footer.appendChild(e),t.showFooter!==!1&&this.root.appendChild(this.footer),this.textarea.value=this.tabValues.get(this.activeTabId)||"",this.textarea.readOnly=this.readOnly||!!((o=this.tabs.find(s=>s.id===this.activeTabId))!=null&&o.readOnly),this.bindEvents(),this.setTab(this.activeTabId,!1),this.updateGutter(),this.textarea.setSelectionRange(0,0),this.updateStatus(),typeof ResizeObserver<"u"&&new ResizeObserver(()=>this.updateGutter()).observe(this.textarea)}bindEvents(){this.textarea.addEventListener("input",()=>{this.tabValues.set(this.activeTabId,this.textarea.value),this.updateGutter(),this.updateStatus(),this.emit("change",{tab:this.activeTabId,value:this.textarea.value})}),this.textarea.addEventListener("scroll",()=>{this.gutter.scrollTop=this.textarea.scrollTop}),this.textarea.addEventListener("keyup",()=>this.updateStatus()),this.textarea.addEventListener("click",()=>this.updateStatus()),this.textarea.addEventListener("keydown",t=>{if(t.key==="Tab"){t.preventDefault();const e=this.textarea.selectionStart,i=this.textarea.selectionEnd,o=this.textarea.value;this.textarea.value=`${o.slice(0,e)}    ${o.slice(i)}`,this.textarea.selectionStart=this.textarea.selectionEnd=e+4,this.tabValues.set(this.activeTabId,this.textarea.value),this.updateGutter(),this.updateStatus(),this.emit("change",{tab:this.activeTabId,value:this.textarea.value})}else t.key==="Enter"&&(t.ctrlKey||t.metaKey)&&this.emit("run",this.textarea.value)})}updateGutter(){const t=this.textarea.value.split(`
`).length,e=[];for(let i=1;i<=Math.max(t,1);i+=1)e.push(String(i));this.gutter.textContent=e.join(`
`),this.gutter.scrollTop=this.textarea.scrollTop}updateStatus(){const t=this.textarea.value,e=this.textarea.selectionStart||0,i=t.slice(0,e),o=i.split(`
`).length,s=e-i.lastIndexOf(`
`);this.statusElement.textContent=`Ln ${o}, Col ${s}`,this.emit("cursor",{line:o,column:s})}setTab(t,e=!0){const i=this.tabs.find(o=>o.id===t);if(!i)return this;this.tabValues.set(this.activeTabId,this.textarea.value),this.activeTabId=t,this.textarea.value=this.tabValues.get(t)||i.value||"",this.textarea.readOnly=this.readOnly||!!i.readOnly;for(const[o,s]of this.tabButtons)s.classList.toggle("lg-text-editor__tab--active",o===t);return this.updateGutter(),this.updateStatus(),e&&this.emit("tab",t),this}getActiveTab(){return this.activeTabId}setValue(t){return this.tabValues.set(this.activeTabId,t),this.textarea.value=t,this.updateGutter(),this.updateStatus(),this}getValue(){return this.textarea.value}getTabValue(t){return t===this.activeTabId?this.textarea.value:this.tabValues.get(t)||""}setTabValue(t,e){return this.tabValues.set(t,e),t===this.activeTabId&&(this.textarea.value=e,this.updateGutter(),this.updateStatus()),this}appendTabLine(t,e){const i=this.getTabValue(t);return this.setTabValue(t,i?`${i}
${e}`:e),this}setReadOnly(t){return this.readOnly=t,this.textarea.readOnly=t,this}focus(){return this.textarea.focus(),this}appendLine(t){const e=this.textarea.value?`${this.textarea.value}
${t}`:t;return this.setValue(e),this.textarea.scrollTop=this.textarea.scrollHeight,this}appendTo(t){return t.appendChild(this.root),this}}const De={start:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h2v12H4zM14 2L6 8l8 6z"/></svg>',prev:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 2L3 8l8 6z"/></svg>',play:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l9 6-9 6z"/></svg>',pause:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h3v12H4zM9 2h3v12H9z"/></svg>',next:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 2l8 6-8 6z"/></svg>',end:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 2h2v12h-2zM2 2l8 6-8 6z"/></svg>'};class qr extends Q{constructor(t={}){super();c(this,"root");c(this,"header");c(this,"menus");c(this,"controls");c(this,"body");c(this,"canvas");c(this,"frameInput");c(this,"startInput");c(this,"endInput");c(this,"start");c(this,"end");c(this,"frame");c(this,"fps");c(this,"playing",!1);c(this,"keyframes",new Set);c(this,"playButton");c(this,"playTimer",0);c(this,"dragging",!1);c(this,"resizeObserver",null);c(this,"ctx",null);c(this,"raf",0);c(this,"onFrameChange");c(this,"onPlayChange");c(this,"onRangeChange");c(this,"onPointerMove",t=>{this.dragging&&this.setFrameFromEvent(t)});c(this,"onPointerUp",()=>{this.dragging=!1});this.start=Math.round(t.start??1),this.end=Math.max(this.start+1,Math.round(t.end??250)),this.frame=Math.min(this.end,Math.max(this.start,Math.round(t.frame??1))),this.fps=t.fps??24,this.onFrameChange=t.onFrameChange,this.onPlayChange=t.onPlayChange,this.onRangeChange=t.onRangeChange,(t.keyframes||[]).forEach(i=>this.keyframes.add(i)),this.root=document.createElement("section"),this.root.className=["lg-timeline",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),t.height!==void 0&&(this.root.style.height=typeof t.height=="number"?`${t.height}px`:t.height),this.header=document.createElement("div"),this.header.className="lg-timeline__header",this.menus=document.createElement("div"),this.menus.className="lg-timeline__menus",this.header.appendChild(this.menus);const e=document.createElement("div");e.className="lg-timeline__spacer",this.header.appendChild(e),this.controls=document.createElement("div"),this.controls.className="lg-timeline__controls",this.header.appendChild(this.controls),this.playButton=this.createIconButton("play","Play (Space)",()=>this.togglePlay()),this.controls.appendChild(this.createIconButton("start","Jump to Start",()=>this.setFrame(this.start))),this.controls.appendChild(this.createIconButton("prev","Previous Keyframe",()=>this.stepKeyframe(-1))),this.controls.appendChild(this.playButton),this.controls.appendChild(this.createIconButton("next","Next Keyframe",()=>this.stepKeyframe(1))),this.controls.appendChild(this.createIconButton("end","Jump to End",()=>this.setFrame(this.end))),this.frameInput=this.createNumberField("frame",t.frameInputId,String(this.frame)),this.controls.appendChild(this.wrapFrameBox(this.frameInput,"Frame")),this.startInput=this.createNumberField("start",t.startInputId,String(this.start)),this.controls.appendChild(this.wrapFrameBox(this.startInput,"Start")),this.endInput=this.createNumberField("end",t.endInputId,String(this.end)),this.controls.appendChild(this.wrapFrameBox(this.endInput,"End")),t.showHeader===!1&&(this.header.style.display="none"),this.root.appendChild(this.header),this.body=document.createElement("div"),this.body.className="lg-timeline__body",this.canvas=document.createElement("canvas"),this.canvas.className="lg-timeline__canvas",t.canvasId&&(this.canvas.id=t.canvasId),this.body.appendChild(this.canvas),this.root.appendChild(this.body),this.ctx=this.canvas.getContext("2d"),this.bindEvents(),this.updatePlayButton(),typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>this.scheduleDraw()),this.resizeObserver.observe(this.body)),this.scheduleDraw()}createIconButton(t,e,i){const o=document.createElement("button");return o.type="button",o.className="lg-timeline__icon-btn",o.dataset.action=t,o.title=e,o.setAttribute("aria-label",e),o.innerHTML=De[t],o.addEventListener("click",i),o}createNumberField(t,e,i){const o=document.createElement("input");return o.type="number",o.className="lg-timeline__number",o.dataset.role=t,e&&(o.id=e),o.value=i,o}wrapFrameBox(t,e){const i=document.createElement("div");i.className="lg-timeline__frame-box",i.appendChild(t);const o=document.createElement("span");return o.className="lg-timeline__label",o.textContent=e,i.appendChild(o),i}addMenuButton(t,e){const i=document.createElement("button");return i.type="button",i.className="lg-timeline__menu",i.textContent=t,i.addEventListener("click",()=>e(i)),this.menus.appendChild(i),i}bindEvents(){this.frameInput.addEventListener("change",()=>this.setFrame(Number(this.frameInput.value))),this.frameInput.addEventListener("keydown",t=>{t.key==="Enter"&&this.setFrame(Number(this.frameInput.value))}),this.startInput.addEventListener("change",()=>this.setRange(Number(this.startInput.value),this.end)),this.endInput.addEventListener("change",()=>this.setRange(this.start,Number(this.endInput.value))),this.canvas.addEventListener("pointerdown",t=>{t.button===0&&(t.preventDefault(),this.dragging=!0,this.setFrameFromEvent(t))}),this.canvas.addEventListener("dblclick",t=>{const e=this.frameFromEvent(t);this.insertKeyframe(e)}),window.addEventListener("pointermove",this.onPointerMove),window.addEventListener("pointerup",this.onPointerUp)}frameFromEvent(t){const e=this.canvas.getBoundingClientRect(),i=Math.max(0,Math.min(1,(t.clientX-e.left)/Math.max(1,e.width)));return Math.round(this.start+i*(this.end-this.start))}setFrameFromEvent(t){this.setFrame(this.frameFromEvent(t))}setFrame(t,e=!0){var i;return Number.isFinite(t)?(this.frame=Math.max(this.start,Math.min(this.end,Math.round(t))),document.activeElement!==this.frameInput&&(this.frameInput.value=String(this.frame)),this.scheduleDraw(),e&&((i=this.onFrameChange)==null||i.call(this,this.frame),this.emit("frame",this.frame)),this):this}getFrame(){return this.frame}setRange(t,e,i=!0){var a;let o=Math.round(Number.isFinite(t)?t:this.start),s=Math.round(Number.isFinite(e)?e:this.end);return o=Math.max(1,o),s=Math.max(o+1,s),this.start=o,this.end=s,this.startInput.value=String(o),this.endInput.value=String(s),this.setFrame(this.frame,!1),this.scheduleDraw(),i&&((a=this.onRangeChange)==null||a.call(this,this.start,this.end),this.emit("range",{start:this.start,end:this.end})),this}getRange(){return{start:this.start,end:this.end}}setFps(t){return this.fps=Math.max(1,Math.round(t)),this}getFps(){return this.fps}setKeyframes(t){return this.keyframes=new Set(t),this.scheduleDraw(),this}getKeyframes(){return Array.from(this.keyframes).sort((t,e)=>t-e)}insertKeyframe(t=this.frame){return this.keyframes.add(Math.round(t)),this.scheduleDraw(),this.emit("keyframe",t),this}removeKeyframe(t=this.frame){return this.keyframes.delete(Math.round(t)),this.scheduleDraw(),this}stepKeyframe(t){const e=this.getKeyframes();if(!e.length){this.setFrame(this.frame+t*10);return}const i=t>0?e.find(o=>o>this.frame)??e[0]:[...e].reverse().find(o=>o<this.frame)??e[e.length-1];this.setFrame(i)}togglePlay(){return this.playing?this.pause():this.play(),this}play(){var t;return this.playing?this:(this.playing=!0,this.updatePlayButton(),(t=this.onPlayChange)==null||t.call(this,!0),this.emit("play",!0),this.playTimer=window.setInterval(()=>{const e=this.frame>=this.end?this.start:this.frame+1;this.setFrame(e)},Math.max(10,Math.round(1e3/this.fps))),this)}pause(){var t;return this.playing?(this.playing=!1,window.clearInterval(this.playTimer),this.playTimer=0,this.updatePlayButton(),(t=this.onPlayChange)==null||t.call(this,!1),this.emit("play",!1),this):this}setPlaying(t){return t?this.play():this.pause(),this}isPlaying(){return this.playing}updatePlayButton(){this.playButton.innerHTML=this.playing?De.pause:De.play,this.playButton.title=this.playing?"Pause (Space)":"Play (Space)",this.playButton.classList.toggle("lg-timeline__icon-btn--active",this.playing)}setHeight(t){return this.root.style.height=typeof t=="number"?`${t}px`:t,this.scheduleDraw(),this}scheduleDraw(){this.raf||(this.raf=requestAnimationFrame(()=>{this.raf=0,this.draw()}))}draw(){const t=this.ctx;if(!t)return;const e=this.body.getBoundingClientRect();if(e.width<1||e.height<1)return;const i=window.devicePixelRatio||1,o=e.width,s=e.height;this.canvas.width=Math.floor(o*i),this.canvas.height=Math.floor(s*i),this.canvas.style.width=`${o}px`,this.canvas.style.height=`${s}px`,t.setTransform(i,0,0,i,0,0),t.clearRect(0,0,o,s);const a=getComputedStyle(this.root),l=a.getPropertyValue("--lg-timeline-bg").trim()||"#282828",d=a.getPropertyValue("--lg-timeline-ruler").trim()||"#1d1d1d",h=a.getPropertyValue("--lg-timeline-line").trim()||"#3d3d3d",u=a.getPropertyValue("--lg-timeline-text").trim()||"#9a9a9a",p=a.getPropertyValue("--lg-color-accent").trim()||"#4772b3",_=a.getPropertyValue("--lg-timeline-key").trim()||"#d8b04a";t.fillStyle=l,t.fillRect(0,0,o,s);const b=20;t.fillStyle=d,t.fillRect(0,0,o,b),t.strokeStyle=h,t.beginPath(),t.moveTo(0,b+.5),t.lineTo(o,b+.5),t.stroke();const y=H=>(H-this.start)/Math.max(1,this.end-this.start)*o,m=this.pickStep(o);t.font="10px Inter, sans-serif",t.textBaseline="alphabetic";for(let H=Math.ceil(this.start/m)*m;H<=this.end;H+=m){const Z=Math.round(y(H))+.5;t.strokeStyle=h,t.beginPath(),t.moveTo(Z,12),t.lineTo(Z,s),t.stroke(),t.fillStyle=u,t.fillText(String(H),Z+3,13)}const w=Math.max(4,Math.min(6,Math.round(s/10))),A=Math.max(b+12,s-12);for(const H of this.getKeyframes()){if(H<this.start||H>this.end)continue;const Z=y(H);t.fillStyle=_,t.beginPath(),t.moveTo(Z,A-w),t.lineTo(Z+w,A),t.lineTo(Z,A+w),t.lineTo(Z-w,A),t.closePath(),t.fill()}const V=Math.round(y(this.frame))+.5;t.strokeStyle=p,t.lineWidth=1.5,t.beginPath(),t.moveTo(V,0),t.lineTo(V,s),t.stroke(),t.lineWidth=1,t.fillStyle=p,t.beginPath(),t.moveTo(V-5,0),t.lineTo(V+5,0),t.lineTo(V,7),t.closePath(),t.fill()}pickStep(t){const e=Math.max(1,this.end-this.start),o=Math.max(1,Math.floor(e*82/Math.max(1,t))),s=[1,2,5,10,20,25,50,100,200,500,1e3,2e3,5e3];return s.find(a=>a>=o)??s[s.length-1]}destroy(){this.pause(),this.resizeObserver&&this.resizeObserver.disconnect(),window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerup",this.onPointerUp),this.raf&&cancelAnimationFrame(this.raf),this.root.remove()}appendTo(t){return t.appendChild(this.root),this}}class Yr extends Q{constructor(t={}){super();c(this,"root");c(this,"toolsElement");c(this,"active",null);c(this,"tools",[]);c(this,"buttons",new Map);c(this,"titleElement",null);const e=t.orientation||"vertical";this.root=document.createElement("div"),this.root.className=["lg-toolbar",e==="horizontal"?"lg-toolbar--horizontal":"lg-toolbar--vertical",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),t.title&&this.setTitle(t.title),this.toolsElement=document.createElement("div"),this.toolsElement.className="lg-toolbar__tools",this.root.appendChild(this.toolsElement),this.setTools(t.tools||[]),t.active!==void 0&&this.setActive(t.active)}setTitle(t){return this.titleElement||(this.titleElement=document.createElement("div"),this.titleElement.className="lg-toolbar__title",this.root.prepend(this.titleElement)),this.titleElement.textContent=t,this}setTools(t){this.tools=t,this.buttons.clear(),this.toolsElement.innerHTML="";for(const e of t){const i=document.createElement("button");if(i.type="button",i.className="lg-toolbar__tool",i.dataset.tool=e.id,i.title=e.label?e.shortcut?`${e.label} (${e.shortcut})`:e.label:e.id,i.setAttribute("aria-label",e.label||e.id),e.icon){const o=document.createElement("span");o.className="lg-toolbar__icon",o.innerHTML=e.icon,i.appendChild(o)}else i.textContent=e.label||e.id;if(e.shortcut){const o=document.createElement("span");o.className="lg-toolbar__shortcut",o.textContent=e.shortcut,i.appendChild(o)}i.addEventListener("click",()=>this.setActive(e.id,!0)),this.toolsElement.appendChild(i),this.buttons.set(e.id,i)}return this.active&&!this.buttons.has(this.active)&&(this.active=null),this.renderActive(),this}getTools(){return this.tools.slice()}setActive(t,e=!1){return t&&!this.buttons.has(t)?this:(this.active=t,this.renderActive(),e&&this.emit("change",t),this)}getActive(){return this.active}renderActive(){for(const[t,e]of this.buttons){const i=t===this.active;e.classList.toggle("lg-toolbar__tool--active",i),e.setAttribute("aria-pressed",i?"true":"false")}}appendTo(t){return t.appendChild(this.root),this}}const Kn={bgSolid:"#484848",bgWire:"#2c2c2c",grid:"#565656",gridAxis:"#666666",axisX:"#a04a4a",axisY:"#4a8a4a",gizmoX:"#c85a5a",gizmoY:"#61a861",gizmoZ:"#5f8fc8",selection:"#f0a030",selectionSoft:"rgba(240, 160, 48, 0.55)",camera:"#d8d8d8",light:"#e0d080",brush:"rgba(240, 160, 48, 0.9)",brushFill:"rgba(240, 160, 48, 0.10)",outline:"#3c3c3c",edit:"#ffb84d",editSoft:"rgba(255, 184, 77, 0.55)",editFill:"rgba(255, 184, 77, 0.18)",face1:"#9d9d9d",face2:"#c4c4c4",face3:"#b4b4b4",face4:"#8c8c8c",face5:"#a8a8a8",face6:"#bdbdbd"},Qn=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],ti=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];function Xr(r,n){return[r[0]+n[0],r[1]+n[1],r[2]+n[2]]}function Zr(r,n){let[t,e,i]=r;const o=Math.cos(n[0]),s=Math.sin(n[0]);[e,i]=[e*o-i*s,e*s+i*o];const a=Math.cos(n[1]),l=Math.sin(n[1]);[t,i]=[t*a+i*l,-t*l+i*a];const d=Math.cos(n[2]),h=Math.sin(n[2]);return[t,e]=[t*d-e*h,t*h+e*d],[t,e,i]}class Ur extends Q{constructor(t={}){super();c(this,"root");c(this,"canvas");c(this,"info");c(this,"ctx");c(this,"objects");c(this,"selectedId");c(this,"dirty",!0);c(this,"width",0);c(this,"height",0);c(this,"dpr",1);c(this,"yaw",-.72);c(this,"pitch",.5);c(this,"distance",16.5);c(this,"target",[0,0,.9]);c(this,"orbiting",!1);c(this,"panning",!1);c(this,"lastX",0);c(this,"lastY",0);c(this,"transform",null);c(this,"transformStart",null);c(this,"overlays");c(this,"sidebarOpen");c(this,"shading");c(this,"editMode");c(this,"editElement");c(this,"brush");c(this,"pointerX",0);c(this,"pointerY",0);c(this,"hasPointer",!1);c(this,"palette",{...Kn});c(this,"resizeObserver",null);c(this,"raf",0);c(this,"disposed",!1);c(this,"onMouseDown",t=>{if(this.canvas.focus(),t.button===1){t.preventDefault(),t.shiftKey?this.panning=!0:this.orbiting=!0,this.lastX=t.clientX,this.lastY=t.clientY;return}t.button===0&&!this.transform&&this.selectAt(t.offsetX,t.offsetY)});c(this,"onWindowMove",t=>{this.pointerX=t.clientX,this.pointerY=t.clientY,this.hasPointer=!0,this.brush&&this.invalidate(),!this.orbiting&&!this.panning&&!this.transform&&(this.lastX=t.clientX,this.lastY=t.clientY),this.onMouseMove(t)});c(this,"onMouseMove",t=>{if(this.transform&&this.transformStart){const e=t.clientX-this.transformStart.x,i=t.clientY-this.transformStart.y,o=this.objects.find(s=>s.id===this.selectedId);if(!o)return;if(this.transform==="translate")o.loc=[this.transformStart.loc[0]+e*.018,this.transformStart.loc[1]-i*.018,this.transformStart.loc[2]];else if(this.transform==="rotate")o.rot=[this.transformStart.rot[0],this.transformStart.rot[1],this.transformStart.rot[2]+e*.012];else{const s=Math.max(.05,1+e*.006);o.scale=[this.transformStart.scale[0]*s,this.transformStart.scale[1]*s,this.transformStart.scale[2]*s]}this.emit("change"),this.invalidate();return}if(this.orbiting)this.yaw+=(t.clientX-this.lastX)*.008,this.pitch=Math.max(-.2,Math.min(1.35,this.pitch+(t.clientY-this.lastY)*.006)),this.lastX=t.clientX,this.lastY=t.clientY,this.invalidate();else if(this.panning){const e=this.distance*.0016;this.target=[this.target[0]-(t.clientX-this.lastX)*e*Math.cos(this.yaw),this.target[1]-(t.clientX-this.lastX)*e*Math.sin(this.yaw),this.target[2]+(t.clientY-this.lastY)*e],this.lastX=t.clientX,this.lastY=t.clientY,this.invalidate()}});c(this,"onWindowUp",()=>{this.orbiting=!1,this.panning=!1});c(this,"onWheel",t=>{t.preventDefault(),this.zoom(t.deltaY)});c(this,"onContextMenu",t=>{if(t.preventDefault(),this.transform){this.cancelTransform();return}this.emit("context-menu",{x:t.clientX,y:t.clientY})});c(this,"onClick",()=>{this.transform?this.confirmTransform():this.canvas.focus()});this.objects=t.objects??[],this.selectedId=t.selected??null,this.overlays=t.overlays??!1,this.sidebarOpen=t.sidebarOpen??!1,this.shading=t.shading??"solid",this.editMode=t.editMode??!1,this.editElement=t.editElement??"vertex",this.brush=t.brush??null,this.root=document.createElement("div"),this.root.className=["lg-viewport",t.className||""].filter(Boolean).join(" "),t.id&&(this.root.id=t.id),this.root.tabIndex=-1,this.canvas=document.createElement("canvas"),this.canvas.className="lg-viewport__canvas",this.canvas.tabIndex=0,this.root.appendChild(this.canvas),this.info=document.createElement("div"),this.info.className="lg-viewport__info",this.root.appendChild(this.info);const e=this.canvas.getContext("2d");if(!e)throw new Error("canvas 2d unavailable");this.ctx=e,typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.root)),this.resize(),this.canvas.addEventListener("mousedown",this.onMouseDown),this.canvas.addEventListener("wheel",this.onWheel,{passive:!1}),this.canvas.addEventListener("contextmenu",this.onContextMenu),this.canvas.addEventListener("click",this.onClick),window.addEventListener("mousemove",this.onWindowMove),window.addEventListener("mouseup",this.onWindowUp),this.startLoop()}getObjects(){return this.objects}setObjects(t){this.objects=t,this.invalidate()}getSelected(){return this.selectedId}setSelected(t){this.selectedId!==t&&(this.selectedId=t,this.invalidate())}setOverlays(t){this.overlays=t,this.invalidate()}getOverlays(){return this.overlays}setSidebarOpen(t){this.sidebarOpen=t,this.invalidate()}getSidebarOpen(){return this.sidebarOpen}setShading(t){this.shading=t,this.invalidate()}getShading(){return this.shading}setEditMode(t){this.editMode=t,this.invalidate()}getEditMode(){return this.editMode}setEditElementMode(t){this.editElement=t,this.invalidate()}getEditElementMode(){return this.editElement}setBrush(t){this.brush=t,this.invalidate()}getBrush(){return this.brush}setView(t,e,i=this.distance){this.yaw=t,this.pitch=e,this.distance=i,this.invalidate()}snapshot(){return this.canvas.toDataURL("image/png")}resize(){const t=this.root.getBoundingClientRect();this.dpr=window.devicePixelRatio||1,this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.canvas.width=Math.floor(this.width*this.dpr),this.canvas.height=Math.floor(this.height*this.dpr),this.invalidate()}invalidate(){this.dirty=!0}focusSelection(){const t=this.objects.find(e=>e.id===this.selectedId);t&&(this.target=[...t.loc],this.distance=10,this.invalidate())}frameAll(){this.target=[0,0,.9],this.distance=16.5,this.yaw=-.72,this.pitch=.5,this.invalidate()}zoom(t){this.distance=Math.max(2.5,Math.min(60,this.distance*Math.exp(t*.0015))),this.invalidate()}beginTransform(t){const e=this.canvas.getBoundingClientRect();this.hasPointer?(this.lastX=this.pointerX,this.lastY=this.pointerY):this.lastX||(this.lastX=e.left+e.width/2,this.lastY=e.top+e.height/2);const i=this.objects.find(o=>o.id===this.selectedId);return i?(this.transform=t,this.transformStart={loc:[...i.loc],rot:[...i.rot],scale:[...i.scale],x:this.lastX,y:this.lastY},this.emit("transform",{kind:t,phase:"start"}),this.emit("status",t==="translate"?"Move: 移动鼠标，左键/Enter 确认，右键/Esc 取消":t==="rotate"?"Rotate: 移动鼠标，左键/Enter 确认，右键/Esc 取消":"Scale: 移动鼠标，左键/Enter 确认，右键/Esc 取消"),!0):(this.emit("status","No active object to transform"),!1)}confirmTransform(){if(!this.transform)return;const t=this.transform;this.transform=null,this.transformStart=null,this.emit("transform",{kind:t,phase:"confirm"}),this.emit("status","Transform applied"),this.emit("change"),this.invalidate()}cancelTransform(){if(!this.transform||!this.transformStart)return;const t=this.transform,e=this.objects.find(i=>i.id===this.selectedId);e&&(e.loc=[...this.transformStart.loc],e.rot=[...this.transformStart.rot],e.scale=[...this.transformStart.scale]),this.transform=null,this.transformStart=null,this.emit("transform",{kind:t,phase:"cancel"}),this.emit("status","Transform cancelled"),this.emit("change"),this.invalidate()}dispose(){var t;this.disposed||(this.disposed=!0,this.raf&&cancelAnimationFrame(this.raf),this.raf=0,(t=this.resizeObserver)==null||t.disconnect(),this.resizeObserver=null,window.removeEventListener("mousemove",this.onWindowMove),window.removeEventListener("mouseup",this.onWindowUp),this.canvas.removeEventListener("mousedown",this.onMouseDown),this.canvas.removeEventListener("wheel",this.onWheel),this.canvas.removeEventListener("contextmenu",this.onContextMenu),this.canvas.removeEventListener("click",this.onClick),this.root.remove(),this.removeAllListeners())}selectAt(t,e){let i=null,o=1/0;for(const s of this.objects){if(!s.visible||!s.selectable)continue;const a=this.project(s.loc);let l=Math.hypot(a[0]-t,a[1]-e)<22;if(s.type==="mesh"){let d=1/0,h=-1/0,u=1/0,p=-1/0;for(const _ of ti){const b=this.project(this.worldPoint(s,_));d=Math.min(d,b[0]),h=Math.max(h,b[0]),u=Math.min(u,b[1]),p=Math.max(p,b[1])}l=t>=d-4&&t<=h+4&&e>=u-4&&e<=p+4}l&&a[2]<o&&(i=s.id,o=a[2])}this.selectedId=i,this.emit("select",i),this.invalidate()}startLoop(){const t=()=>{this.disposed||(this.raf=requestAnimationFrame(t),this.dirty&&(this.dirty=!1,this.draw()))};this.raf=requestAnimationFrame(t)}project(t){const e=[t[0]-this.target[0],t[1]-this.target[1],t[2]-this.target[2]],i=Math.cos(this.yaw),o=Math.sin(this.yaw),s=e[0]*i-e[1]*o,a=e[0]*o+e[1]*i,l=Math.cos(this.pitch),d=Math.sin(this.pitch),h=a*l-e[2]*d,u=a*d+e[2]*l,p=Math.max(.1,u+this.distance),_=Math.min(this.width,this.height)*1.15;return[this.width/2+s*_/p,this.height/2-h*_/p,p]}worldPoint(t,e){const i=[e[0]*t.scale[0],e[1]*t.scale[1],e[2]*t.scale[2]];return Xr(Zr(i,t.rot),t.loc)}color(t,e){return typeof getComputedStyle!="function"?e:getComputedStyle(this.root).getPropertyValue(t).trim()||e}refreshPalette(){const t=Kn;this.palette={bgSolid:this.color("--lg-viewport-bg",t.bgSolid),bgWire:this.color("--lg-viewport-bg-wire",t.bgWire),grid:this.color("--lg-viewport-grid",t.grid),gridAxis:this.color("--lg-viewport-grid-axis",t.gridAxis),axisX:this.color("--lg-viewport-axis-x",t.axisX),axisY:this.color("--lg-viewport-axis-y",t.axisY),gizmoX:this.color("--lg-viewport-gizmo-x",t.gizmoX),gizmoY:this.color("--lg-viewport-gizmo-y",t.gizmoY),gizmoZ:this.color("--lg-viewport-gizmo-z",t.gizmoZ),selection:this.color("--lg-viewport-selection",t.selection),selectionSoft:this.color("--lg-viewport-selection-soft",t.selectionSoft),camera:this.color("--lg-viewport-camera",t.camera),light:this.color("--lg-viewport-light",t.light),brush:this.color("--lg-viewport-brush",t.brush),brushFill:this.color("--lg-viewport-brush-fill",t.brushFill),outline:this.color("--lg-viewport-outline",t.outline),edit:this.color("--lg-viewport-edit",t.edit),editSoft:this.color("--lg-viewport-edit-soft",t.editSoft),editFill:this.color("--lg-viewport-edit-fill",t.editFill),face1:this.color("--lg-viewport-face-1",t.face1),face2:this.color("--lg-viewport-face-2",t.face2),face3:this.color("--lg-viewport-face-3",t.face3),face4:this.color("--lg-viewport-face-4",t.face4),face5:this.color("--lg-viewport-face-5",t.face5),face6:this.color("--lg-viewport-face-6",t.face6)}}updateInfo(){const t=document.createElement("span");t.className="lg-viewport__muted",t.textContent=`(1) Collection | ${this.selectedId??"Scene"}`,this.info.replaceChildren("User Perspective",document.createElement("br"),t)}draw(){this.refreshPalette(),this.updateInfo();const t=this.ctx,e=this.width,i=this.height;t.setTransform(this.dpr,0,0,this.dpr,0,0),t.clearRect(0,0,e,i),t.fillStyle=this.shading==="wireframe"?this.palette.bgWire:this.palette.bgSolid,t.fillRect(0,0,e,i),this.drawGrid(),this.drawObjects(),this.overlays&&(this.drawGizmo(),this.drawAxisWidget()),this.drawBrushCursor()}drawBrushCursor(){if(!this.brush||!this.hasPointer)return;const t=this.canvas.getBoundingClientRect(),e=this.pointerX-t.left,i=this.pointerY-t.top;if(e<0||i<0||e>t.width||i>t.height)return;const o=this.ctx;o.save(),o.strokeStyle=this.palette.brush,o.fillStyle=this.palette.brushFill,o.lineWidth=1.4,o.beginPath(),o.arc(e,i,20,0,Math.PI*2),o.fill(),o.stroke(),o.beginPath(),o.arc(e,i,2,0,Math.PI*2),o.fillStyle=this.palette.brush,o.fill(),o.restore()}drawGrid(){const t=this.ctx;t.lineWidth=1;for(let s=-10;s<=10;s+=1){t.strokeStyle=s===0?this.palette.gridAxis:this.palette.grid,t.beginPath();const a=this.project([s,-10,0]),l=this.project([s,10,0]);t.moveTo(a[0],a[1]),t.lineTo(l[0],l[1]),t.stroke(),t.beginPath();const d=this.project([-10,s,0]),h=this.project([10,s,0]);t.moveTo(d[0],d[1]),t.lineTo(h[0],h[1]),t.stroke()}const e=this.project([0,0,0]),i=this.project([10,0,0]),o=this.project([0,10,0]);t.lineWidth=1.4,t.strokeStyle=this.palette.axisX,t.beginPath(),t.moveTo(e[0],e[1]),t.lineTo(i[0],i[1]),t.stroke(),t.strokeStyle=this.palette.axisY,t.beginPath(),t.moveTo(e[0],e[1]),t.lineTo(o[0],o[1]),t.stroke()}drawObjects(){const t=this.objects.filter(e=>e.visible);t.sort((e,i)=>this.project(i.loc)[2]-this.project(e.loc)[2]);for(const e of t)e.type==="mesh"?this.drawCube(e):e.type==="camera"?this.drawCamera(e):this.drawLight(e)}drawCube(t){const e=this.ctx,i=t.id===this.selectedId,o=ti.map(l=>this.project(this.worldPoint(t,l))),s=Qn.map(l=>({points:l.map(d=>o[d]),depth:l.reduce((d,h)=>d+o[h][2],0)/l.length})).sort((l,d)=>d.depth-l.depth),a=this.shading==="wireframe"?["rgba(40,40,40,0.35)","rgba(60,60,60,0.35)","rgba(50,50,50,0.35)","rgba(70,70,70,0.35)","rgba(55,55,55,0.35)","rgba(65,65,65,0.35)"]:[this.palette.face1,this.palette.face2,this.palette.face3,this.palette.face4,this.palette.face5,this.palette.face6];if(s.forEach((l,d)=>{e.beginPath(),l.points.forEach((h,u)=>{u===0?e.moveTo(h[0],h[1]):e.lineTo(h[0],h[1])}),e.closePath(),e.fillStyle=a[d%a.length],e.fill(),e.strokeStyle=i?this.palette.selection:this.palette.outline,e.lineWidth=i?1.4:1,e.stroke()}),i){const l=this.project(t.loc);e.strokeStyle=this.palette.selectionSoft,e.lineWidth=1,e.beginPath(),e.arc(l[0],l[1],16,0,Math.PI*2),e.stroke()}if(this.editMode&&i){e.strokeStyle=this.editElement==="edge"?this.palette.edit:this.palette.editSoft,e.lineWidth=this.editElement==="edge"?2:1.2;for(const d of Qn)e.beginPath(),d.forEach((h,u)=>{const p=o[h];u===0?e.moveTo(p[0],p[1]):e.lineTo(p[0],p[1])}),e.closePath(),this.editElement==="face"&&(e.fillStyle=this.palette.editFill,e.fill()),e.stroke();if(this.editElement==="vertex"||this.editElement==="edge"){e.fillStyle=this.palette.edit;for(const d of o)e.beginPath(),e.arc(d[0],d[1],this.editElement==="vertex"?3.5:2,0,Math.PI*2),e.fill()}}}drawCamera(t){const e=this.ctx,i=this.project(t.loc),o=t.id===this.selectedId;e.strokeStyle=o?this.palette.selection:this.palette.camera,e.lineWidth=1.2,e.beginPath(),e.moveTo(i[0],i[1]-9),e.lineTo(i[0]+8,i[1]+6),e.lineTo(i[0]-8,i[1]+6),e.closePath(),e.stroke(),e.fillStyle="rgba(40,40,40,0.7)",e.fill()}drawLight(t){const e=this.ctx,i=this.project(t.loc),o=t.id===this.selectedId;e.strokeStyle=o?this.palette.selection:this.palette.light,e.lineWidth=1.2,e.beginPath(),e.arc(i[0],i[1],6,0,Math.PI*2),e.stroke();for(let s=0;s<8;s+=1){const a=s/8*Math.PI*2;e.beginPath(),e.moveTo(i[0]+Math.cos(a)*9,i[1]+Math.sin(a)*9),e.lineTo(i[0]+Math.cos(a)*13,i[1]+Math.sin(a)*13),e.stroke()}}drawGizmo(){const t=this.objects.find(a=>a.id===this.selectedId);if(!t)return;const e=t.loc,i=[{end:[e[0]+1.7,e[1],e[2]],color:this.palette.gizmoX,label:"X"},{end:[e[0],e[1]+1.7,e[2]],color:this.palette.gizmoY,label:"Y"},{end:[e[0],e[1],e[2]+1.7],color:this.palette.gizmoZ,label:"Z"}],o=this.ctx,s=this.project(e);for(const a of i){const l=this.project(a.end);o.strokeStyle=a.color,o.fillStyle=a.color,o.lineWidth=1.6,o.beginPath(),o.moveTo(s[0],s[1]),o.lineTo(l[0],l[1]),o.stroke();const d=Math.atan2(l[1]-s[1],l[0]-s[0]);o.beginPath(),o.moveTo(l[0],l[1]),o.lineTo(l[0]-Math.cos(d-.4)*8,l[1]-Math.sin(d-.4)*8),o.lineTo(l[0]-Math.cos(d+.4)*8,l[1]-Math.sin(d+.4)*8),o.closePath(),o.fill(),o.font=`11px ${getComputedStyle(this.root).fontFamily||"sans-serif"}`,o.fillText(a.label,l[0]+5,l[1]-5)}o.fillStyle=this.palette.selection,o.beginPath(),o.arc(s[0],s[1],2.5,0,Math.PI*2),o.fill()}drawAxisWidget(){const t=this.ctx,e=this.width-(this.sidebarOpen?264:46),i=44,o=26,s=[{dir:[1,0,0],color:this.palette.gizmoX,label:"X"},{dir:[0,1,0],color:this.palette.gizmoY,label:"Y"},{dir:[0,0,1],color:this.palette.gizmoZ,label:"Z"}];t.lineWidth=1.4;for(const a of s){const l=this.project([a.dir[0]*3,a.dir[1]*3,a.dir[2]*3]),d=l[0]-this.width/2,h=l[1]-this.height/2,u=Math.hypot(d,h)||1,p=e+d/u*o,_=i+h/u*o;t.strokeStyle=a.color,t.fillStyle=a.color,t.beginPath(),t.moveTo(e,i),t.lineTo(p,_),t.stroke(),t.font=`11px ${getComputedStyle(this.root).fontFamily||"sans-serif"}`,t.fillText(a.label,p+d/u*6-3,_+h/u*6+3)}t.strokeStyle=this.palette.gridAxis,t.beginPath(),t.arc(e,i,3,0,Math.PI*2),t.stroke()}}const Jr=z({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(r){return(n,t)=>(f(),k("span",{class:G(["VPBadge",r.type])},[E(n.$slots,"default",{},()=>[Jt(q(r.text),1)])],2))}}),Gr={key:0,class:"VPBackdrop"},Kr=z({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(r){return(n,t)=>(f(),N(In,{name:"fade"},{default:C(()=>[r.show?(f(),k("div",Gr)):M("",!0)]),_:1}))}}),Qr=$(Kr,[["__scopeId","data-v-ef181cd9"]]),F=ii;function to(r,n){let t,e=!1;return()=>{t&&clearTimeout(t),e?t=setTimeout(r,n):(r(),(e=!0)&&setTimeout(()=>e=!1,n))}}function Xe(r){return r.startsWith("/")?r:`/${r}`}function Rn(r){const{pathname:n,search:t,hash:e,protocol:i}=new URL(r,"http://a.com");if(qi(r)||r.startsWith("#")||!i.startsWith("http")||!Yi(n))return r;const{site:o}=F(),s=n.endsWith("/")||n.endsWith(".html")?r:r.replace(/(?:(^\.+)\/)?.*$/,`$1${n.replace(/(\.md)?$/,o.value.cleanUrls?"":".html")}${t}${e}`);return Te(s)}function fe({correspondingLink:r=!1}={}){const{site:n,localeIndex:t,page:e,theme:i,hash:o}=F(),s=O(()=>{var l,d;return{label:(l=n.value.locales[t.value])==null?void 0:l.label,link:((d=n.value.locales[t.value])==null?void 0:d.link)||(t.value==="root"?"/":`/${t.value}/`)}});return{localeLinks:O(()=>Object.entries(n.value.locales).flatMap(([l,d])=>s.value.label===d.label?[]:{text:d.label,link:eo(d.link||(l==="root"?"/":`/${l}/`),i.value.i18nRouting!==!1&&r,e.value.relativePath.slice(s.value.link.length-1),!n.value.cleanUrls)+o.value})),currentLang:s}}function eo(r,n,t,e){return n?r.replace(/\/$/,"")+Xe(t.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,e?".html":"")):r}const no={class:"NotFound"},io={class:"code"},ro={class:"title"},oo={class:"quote"},so={class:"action"},ao=["href","aria-label"],lo=z({__name:"NotFound",setup(r){const{theme:n}=F(),{currentLang:t}=fe();return(e,i)=>{var o,s,a,l,d;return f(),k("div",no,[S("p",io,q(((o=x(n).notFound)==null?void 0:o.code)??"404"),1),S("h1",ro,q(((s=x(n).notFound)==null?void 0:s.title)??"PAGE NOT FOUND"),1),i[0]||(i[0]=S("div",{class:"divider"},null,-1)),S("blockquote",oo,q(((a=x(n).notFound)==null?void 0:a.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),S("div",so,[S("a",{class:"link",href:x(Te)(x(t).link),"aria-label":((l=x(n).notFound)==null?void 0:l.linkLabel)??"go to home"},q(((d=x(n).notFound)==null?void 0:d.linkText)??"Take me home"),9,ao)])])}}}),co=$(lo,[["__scopeId","data-v-c58a3fd9"]]);function Si(r,n){if(Array.isArray(r))return be(r);if(r==null)return[];n=Xe(n);const t=Object.keys(r).sort((i,o)=>o.split("/").length-i.split("/").length).find(i=>n.startsWith(Xe(i))),e=t?r[t]:[];return Array.isArray(e)?be(e):be(e.items,e.base)}function ho(r){const n=[];let t=0;for(const e in r){const i=r[e];if(i.items){t=n.push(i);continue}n[t]||n.push({items:[]}),n[t].items.push(i)}return n}function uo(r){const n=[];function t(e){for(const i of e)i.text&&i.link&&n.push({text:i.text,link:i.link,docFooterText:i.docFooterText}),i.items&&t(i.items)}return t(r),n}function Ze(r,n){return Array.isArray(n)?n.some(t=>Ze(r,t)):Gt(r,n.link)?!0:n.items?Ze(r,n.items):!1}function be(r,n){return[...r].map(t=>{const e={...t},i=e.base||n;return i&&e.link&&(e.link=i+e.link),e.items&&(e.items=be(e.items,i)),e})}function Dt(){const{frontmatter:r,page:n,theme:t}=F(),e=He("(min-width: 960px)"),i=Y(!1),o=O(()=>{const y=t.value.sidebar,m=n.value.relativePath;return y?Si(y,m):[]}),s=Y(o.value);It(o,(y,m)=>{JSON.stringify(y)!==JSON.stringify(m)&&(s.value=o.value)});const a=O(()=>r.value.sidebar!==!1&&s.value.length>0&&r.value.layout!=="home"),l=O(()=>d?r.value.aside==null?t.value.aside==="left":r.value.aside==="left":!1),d=O(()=>r.value.layout==="home"?!1:r.value.aside!=null?!!r.value.aside:t.value.aside!==!1),h=O(()=>a.value&&e.value),u=O(()=>a.value?ho(s.value):[]);function p(){i.value=!0}function _(){i.value=!1}function b(){i.value?_():p()}return{isOpen:i,sidebar:s,sidebarGroups:u,hasSidebar:a,hasAside:d,leftAside:l,isSidebarEnabled:h,open:p,close:_,toggle:b}}function go(r,n){let t;Me(()=>{t=r.value?document.activeElement:void 0}),Bt(()=>{window.addEventListener("keyup",e)}),Nn(()=>{window.removeEventListener("keyup",e)});function e(i){i.key==="Escape"&&r.value&&(n(),t==null||t.focus())}}function po(r){const{page:n,hash:t}=F(),e=Y(!1),i=O(()=>r.value.collapsed!=null),o=O(()=>!!r.value.link),s=Y(!1),a=()=>{s.value=Gt(n.value.relativePath,r.value.link)};It([n,r,t],a),Bt(a);const l=O(()=>s.value?!0:r.value.items?Ze(n.value.relativePath,r.value.items):!1),d=O(()=>!!(r.value.items&&r.value.items.length));Me(()=>{e.value=!!(i.value&&r.value.collapsed)}),Pn(()=>{(s.value||l.value)&&(e.value=!1)});function h(){i.value&&(e.value=!e.value)}return{collapsed:e,collapsible:i,isLink:o,isActiveLink:s,hasActiveLink:l,hasChildren:d,toggle:h}}function mo(){const{hasSidebar:r}=Dt(),n=He("(min-width: 960px)"),t=He("(min-width: 1280px)");return{isAsideEnabled:O(()=>!t.value&&!n.value?!1:r.value?t.value:n.value)}}const fo=/\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/,Ue=[];function Ci(r){return typeof r.outline=="object"&&!Array.isArray(r.outline)&&r.outline.label||r.outlineTitle||"On this page"}function Fn(r){const n=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(t=>t.id&&t.hasChildNodes()).map(t=>{const e=Number(t.tagName[1]);return{element:t,title:bo(t),link:"#"+t.id,level:e}});return vo(n,r)}function bo(r){let n="";for(const t of r.childNodes)if(t.nodeType===1){if(fo.test(t.className))continue;n+=t.textContent}else t.nodeType===3&&(n+=t.textContent);return n.trim()}function vo(r,n){if(n===!1)return[];const t=(typeof n=="object"&&!Array.isArray(n)?n.level:n)||2,[e,i]=typeof t=="number"?[t,t]:t==="deep"?[2,6]:t;return yo(r,e,i)}function xo(r,n){const{isAsideEnabled:t}=mo(),e=to(o,100);let i=null;Bt(()=>{requestAnimationFrame(o),window.addEventListener("scroll",e)}),Xi(()=>{s(location.hash)}),Nn(()=>{window.removeEventListener("scroll",e)});function o(){if(!t.value)return;const a=window.scrollY,l=window.innerHeight,d=document.body.offsetHeight,h=Math.abs(a+l-d)<1,u=Ue.map(({element:_,link:b})=>({link:b,top:_o(_)})).filter(({top:_})=>!Number.isNaN(_)).sort((_,b)=>_.top-b.top);if(!u.length){s(null);return}if(a<1){s(null);return}if(h){s(u[u.length-1].link);return}let p=null;for(const{link:_,top:b}of u){if(b>a+Zi()+4)break;p=_}s(p)}function s(a){i&&i.classList.remove("active"),a==null?i=null:i=r.value.querySelector(`a[href="${decodeURIComponent(a)}"]`);const l=i;l?(l.classList.add("active"),n.value.style.top=l.offsetTop+39+"px",n.value.style.opacity="1"):(n.value.style.top="33px",n.value.style.opacity="0")}}function _o(r){let n=0;for(;r!==document.body;){if(r===null)return NaN;n+=r.offsetTop,r=r.offsetParent}return n}function yo(r,n,t){Ue.length=0;const e=[],i=[];return r.forEach(o=>{const s={...o,children:[]};let a=i[i.length-1];for(;a&&a.level>=s.level;)i.pop(),a=i[i.length-1];if(s.element.classList.contains("ignore-header")||a&&"shouldIgnore"in a){i.push({level:s.level,shouldIgnore:!0});return}s.level>t||s.level<n||(Ue.push({element:s.element,link:s.link}),a?a.children.push(s):e.push(s),i.push(s))}),e}const wo=["href","title"],ko=z({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(r){function n({target:t}){const e=t.href.split("#")[1],i=document.getElementById(decodeURIComponent(e));i==null||i.focus({preventScroll:!0})}return(t,e)=>{const i=qt("VPDocOutlineItem",!0);return f(),k("ul",{class:G(["VPDocOutlineItem",r.root?"root":"nested"])},[(f(!0),k(K,null,rt(r.headers,({children:o,link:s,title:a})=>(f(),k("li",null,[S("a",{class:"outline-link",href:s,onClick:n,title:a},q(a),9,wo),o!=null&&o.length?(f(),N(i,{key:0,headers:o},null,8,["headers"])):M("",!0)]))),256))],2)}}}),Li=$(ko,[["__scopeId","data-v-d9b05f78"]]),Eo={class:"content"},So={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},Co=z({__name:"VPDocAsideOutline",setup(r){const{frontmatter:n,theme:t}=F(),e=$n([]);ze(()=>{e.value=Fn(n.value.outline??t.value.outline)});const i=Y(),o=Y();return xo(i,o),(s,a)=>(f(),k("nav",{"aria-labelledby":"doc-outline-aria-label",class:G(["VPDocAsideOutline",{"has-outline":e.value.length>0}]),ref_key:"container",ref:i},[S("div",Eo,[S("div",{class:"outline-marker",ref_key:"marker",ref:o},null,512),S("div",So,q(x(Ci)(x(t))),1),I(Li,{headers:e.value,root:!0},null,8,["headers"])])],2))}}),Lo=$(Co,[["__scopeId","data-v-ef81648a"]]),Ao={class:"VPDocAsideCarbonAds"},To=z({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(r){const n=()=>null;return(t,e)=>(f(),k("div",Ao,[I(x(n),{"carbon-ads":r.carbonAds},null,8,["carbon-ads"])]))}}),Mo={class:"VPDocAside"},zo=z({__name:"VPDocAside",setup(r){const{theme:n}=F();return(t,e)=>(f(),k("div",Mo,[E(t.$slots,"aside-top",{},void 0,!0),E(t.$slots,"aside-outline-before",{},void 0,!0),I(Lo),E(t.$slots,"aside-outline-after",{},void 0,!0),e[0]||(e[0]=S("div",{class:"spacer"},null,-1)),E(t.$slots,"aside-ads-before",{},void 0,!0),x(n).carbonAds?(f(),N(To,{key:0,"carbon-ads":x(n).carbonAds},null,8,["carbon-ads"])):M("",!0),E(t.$slots,"aside-ads-after",{},void 0,!0),E(t.$slots,"aside-bottom",{},void 0,!0)]))}}),Io=$(zo,[["__scopeId","data-v-b17c4c3f"]]);function No(){const{theme:r,page:n}=F();return O(()=>{const{text:t="Edit this page",pattern:e=""}=r.value.editLink||{};let i;return typeof e=="function"?i=e(n.value):i=e.replace(/:path/g,n.value.filePath),{url:i,text:t}})}function Po(){const{page:r,theme:n,frontmatter:t}=F();return O(()=>{var d,h,u,p,_,b,y,m;const e=Si(n.value.sidebar,r.value.relativePath),i=uo(e),o=$o(i,w=>w.link.replace(/[?#].*$/,"")),s=o.findIndex(w=>Gt(r.value.relativePath,w.link)),a=((d=n.value.docFooter)==null?void 0:d.prev)===!1&&!t.value.prev||t.value.prev===!1,l=((h=n.value.docFooter)==null?void 0:h.next)===!1&&!t.value.next||t.value.next===!1;return{prev:a?void 0:{text:(typeof t.value.prev=="string"?t.value.prev:typeof t.value.prev=="object"?t.value.prev.text:void 0)??((u=o[s-1])==null?void 0:u.docFooterText)??((p=o[s-1])==null?void 0:p.text),link:(typeof t.value.prev=="object"?t.value.prev.link:void 0)??((_=o[s-1])==null?void 0:_.link)},next:l?void 0:{text:(typeof t.value.next=="string"?t.value.next:typeof t.value.next=="object"?t.value.next.text:void 0)??((b=o[s+1])==null?void 0:b.docFooterText)??((y=o[s+1])==null?void 0:y.text),link:(typeof t.value.next=="object"?t.value.next.link:void 0)??((m=o[s+1])==null?void 0:m.link)}}})}function $o(r,n){const t=new Set;return r.filter(e=>{const i=n(e);return t.has(i)?!1:t.add(i)})}const zt=z({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(r){const n=r,t=O(()=>n.tag??(n.href?"a":"span")),e=O(()=>n.href&&ri.test(n.href)||n.target==="_blank");return(i,o)=>(f(),N(yt(t.value),{class:G(["VPLink",{link:r.href,"vp-external-link-icon":e.value,"no-icon":r.noIcon}]),href:r.href?x(Rn)(r.href):void 0,target:r.target??(e.value?"_blank":void 0),rel:r.rel??(e.value?"noreferrer":void 0)},{default:C(()=>[E(i.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Vo={class:"VPLastUpdated"},Bo=["datetime"],Do=z({__name:"VPDocFooterLastUpdated",setup(r){const{theme:n,page:t,lang:e}=F(),i=O(()=>new Date(t.value.lastUpdated)),o=O(()=>i.value.toISOString()),s=Y("");return Bt(()=>{Me(()=>{var a,l,d;s.value=new Intl.DateTimeFormat((l=(a=n.value.lastUpdated)==null?void 0:a.formatOptions)!=null&&l.forceLocale?e.value:void 0,((d=n.value.lastUpdated)==null?void 0:d.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(i.value)})}),(a,l)=>{var d;return f(),k("p",Vo,[Jt(q(((d=x(n).lastUpdated)==null?void 0:d.text)||x(n).lastUpdatedText||"Last updated")+": ",1),S("time",{datetime:o.value},q(s.value),9,Bo)])}}}),Oo=$(Do,[["__scopeId","data-v-3d65346f"]]),Ho={key:0,class:"VPDocFooter"},Ro={key:0,class:"edit-info"},Fo={key:0,class:"edit-link"},jo={key:1,class:"last-updated"},Wo={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},qo={class:"pager"},Yo=["innerHTML"],Xo=["innerHTML"],Zo={class:"pager"},Uo=["innerHTML"],Jo=["innerHTML"],Go=z({__name:"VPDocFooter",setup(r){const{theme:n,page:t,frontmatter:e}=F(),i=No(),o=Po(),s=O(()=>n.value.editLink&&e.value.editLink!==!1),a=O(()=>t.value.lastUpdated),l=O(()=>s.value||a.value||o.value.prev||o.value.next);return(d,h)=>{var u,p,_,b;return l.value?(f(),k("footer",Ho,[E(d.$slots,"doc-footer-before",{},void 0,!0),s.value||a.value?(f(),k("div",Ro,[s.value?(f(),k("div",Fo,[I(zt,{class:"edit-link-button",href:x(i).url,"no-icon":!0},{default:C(()=>[h[0]||(h[0]=S("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Jt(" "+q(x(i).text),1)]),_:1},8,["href"])])):M("",!0),a.value?(f(),k("div",jo,[I(Oo)])):M("",!0)])):M("",!0),(u=x(o).prev)!=null&&u.link||(p=x(o).next)!=null&&p.link?(f(),k("nav",Wo,[h[1]||(h[1]=S("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),S("div",qo,[(_=x(o).prev)!=null&&_.link?(f(),N(zt,{key:0,class:"pager-link prev",href:x(o).prev.link},{default:C(()=>{var y;return[S("span",{class:"desc",innerHTML:((y=x(n).docFooter)==null?void 0:y.prev)||"Previous page"},null,8,Yo),S("span",{class:"title",innerHTML:x(o).prev.text},null,8,Xo)]}),_:1},8,["href"])):M("",!0)]),S("div",Zo,[(b=x(o).next)!=null&&b.link?(f(),N(zt,{key:0,class:"pager-link next",href:x(o).next.link},{default:C(()=>{var y;return[S("span",{class:"desc",innerHTML:((y=x(n).docFooter)==null?void 0:y.next)||"Next page"},null,8,Uo),S("span",{class:"title",innerHTML:x(o).next.text},null,8,Jo)]}),_:1},8,["href"])):M("",!0)])])):M("",!0)])):M("",!0)}}}),Ko=$(Go,[["__scopeId","data-v-ade57acb"]]),Qo={class:"container"},ts={class:"aside-container"},es={class:"aside-content"},ns={class:"content"},is={class:"content-container"},rs={class:"main"},os=z({__name:"VPDoc",setup(r){const{theme:n}=F(),t=Ie(),{hasSidebar:e,hasAside:i,leftAside:o}=Dt(),s=O(()=>t.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(a,l)=>{const d=qt("Content");return f(),k("div",{class:G(["VPDoc",{"has-sidebar":x(e),"has-aside":x(i)}])},[E(a.$slots,"doc-top",{},void 0,!0),S("div",Qo,[x(i)?(f(),k("div",{key:0,class:G(["aside",{"left-aside":x(o)}])},[l[0]||(l[0]=S("div",{class:"aside-curtain"},null,-1)),S("div",ts,[S("div",es,[I(Io,null,{"aside-top":C(()=>[E(a.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":C(()=>[E(a.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":C(()=>[E(a.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[E(a.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[E(a.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[E(a.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):M("",!0),S("div",ns,[S("div",is,[E(a.$slots,"doc-before",{},void 0,!0),S("main",rs,[I(d,{class:G(["vp-doc",[s.value,x(n).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),I(Ko,null,{"doc-footer-before":C(()=>[E(a.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),E(a.$slots,"doc-after",{},void 0,!0)])])]),E(a.$slots,"doc-bottom",{},void 0,!0)],2)}}}),ss=$(os,[["__scopeId","data-v-e20505ed"]]),as=z({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(r){const n=r,t=O(()=>n.href&&ri.test(n.href)),e=O(()=>n.tag||(n.href?"a":"button"));return(i,o)=>(f(),N(yt(e.value),{class:G(["VPButton",[r.size,r.theme]]),href:r.href?x(Rn)(r.href):void 0,target:n.target??(t.value?"_blank":void 0),rel:n.rel??(t.value?"noreferrer":void 0)},{default:C(()=>[Jt(q(r.text),1)]),_:1},8,["class","href","target","rel"]))}}),ls=$(as,[["__scopeId","data-v-0862c9fc"]]),cs=["src","alt"],ds=z({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(r){return(n,t)=>{const e=qt("VPImage",!0);return r.image?(f(),k(K,{key:0},[typeof r.image=="string"||"src"in r.image?(f(),k("img",jt({key:0,class:"VPImage"},typeof r.image=="string"?n.$attrs:{...r.image,...n.$attrs},{src:x(Te)(typeof r.image=="string"?r.image:r.image.src),alt:r.alt??(typeof r.image=="string"?"":r.image.alt||"")}),null,16,cs)):(f(),k(K,{key:1},[I(e,jt({class:"dark",image:r.image.dark,alt:r.image.alt},n.$attrs),null,16,["image","alt"]),I(e,jt({class:"light",image:r.image.light,alt:r.image.alt},n.$attrs),null,16,["image","alt"])],64))],64)):M("",!0)}}}),Ce=$(ds,[["__scopeId","data-v-e3474743"]]),hs={class:"container"},us={class:"main"},gs={class:"heading"},ps=["innerHTML"],ms=["innerHTML"],fs=["innerHTML"],bs={key:0,class:"actions"},vs={key:0,class:"image"},xs={class:"image-container"},_s=z({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(r){const n=Ne("hero-image-slot-exists");return(t,e)=>(f(),k("div",{class:G(["VPHero",{"has-image":r.image||x(n)}])},[S("div",hs,[S("div",us,[E(t.$slots,"home-hero-info-before",{},void 0,!0),E(t.$slots,"home-hero-info",{},()=>[S("h1",gs,[r.name?(f(),k("span",{key:0,innerHTML:r.name,class:"name clip"},null,8,ps)):M("",!0),r.text?(f(),k("span",{key:1,innerHTML:r.text,class:"text"},null,8,ms)):M("",!0)]),r.tagline?(f(),k("p",{key:0,innerHTML:r.tagline,class:"tagline"},null,8,fs)):M("",!0)],!0),E(t.$slots,"home-hero-info-after",{},void 0,!0),r.actions?(f(),k("div",bs,[(f(!0),k(K,null,rt(r.actions,i=>(f(),k("div",{key:i.link,class:"action"},[I(ls,{tag:"a",size:"medium",theme:i.theme,text:i.text,href:i.link,target:i.target,rel:i.rel},null,8,["theme","text","href","target","rel"])]))),128))])):M("",!0),E(t.$slots,"home-hero-actions-after",{},void 0,!0)]),r.image||x(n)?(f(),k("div",vs,[S("div",xs,[e[0]||(e[0]=S("div",{class:"image-bg"},null,-1)),E(t.$slots,"home-hero-image",{},()=>[r.image?(f(),N(Ce,{key:0,class:"image-src",image:r.image},null,8,["image"])):M("",!0)],!0)])])):M("",!0)])],2))}}),ys=$(_s,[["__scopeId","data-v-0c191713"]]),ws=z({__name:"VPHomeHero",setup(r){const{frontmatter:n}=F();return(t,e)=>x(n).hero?(f(),N(ys,{key:0,class:"VPHomeHero",name:x(n).hero.name,text:x(n).hero.text,tagline:x(n).hero.tagline,image:x(n).hero.image,actions:x(n).hero.actions},{"home-hero-info-before":C(()=>[E(t.$slots,"home-hero-info-before")]),"home-hero-info":C(()=>[E(t.$slots,"home-hero-info")]),"home-hero-info-after":C(()=>[E(t.$slots,"home-hero-info-after")]),"home-hero-actions-after":C(()=>[E(t.$slots,"home-hero-actions-after")]),"home-hero-image":C(()=>[E(t.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):M("",!0)}}),ks={class:"box"},Es={key:0,class:"icon"},Ss=["innerHTML"],Cs=["innerHTML"],Ls=["innerHTML"],As={key:4,class:"link-text"},Ts={class:"link-text-value"},Ms=z({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(r){return(n,t)=>(f(),N(zt,{class:"VPFeature",href:r.link,rel:r.rel,target:r.target,"no-icon":!0,tag:r.link?"a":"div"},{default:C(()=>[S("article",ks,[typeof r.icon=="object"&&r.icon.wrap?(f(),k("div",Es,[I(Ce,{image:r.icon,alt:r.icon.alt,height:r.icon.height||48,width:r.icon.width||48},null,8,["image","alt","height","width"])])):typeof r.icon=="object"?(f(),N(Ce,{key:1,image:r.icon,alt:r.icon.alt,height:r.icon.height||48,width:r.icon.width||48},null,8,["image","alt","height","width"])):r.icon?(f(),k("div",{key:2,class:"icon",innerHTML:r.icon},null,8,Ss)):M("",!0),S("h2",{class:"title",innerHTML:r.title},null,8,Cs),r.details?(f(),k("p",{key:3,class:"details",innerHTML:r.details},null,8,Ls)):M("",!0),r.linkText?(f(),k("div",As,[S("p",Ts,[Jt(q(r.linkText)+" ",1),t[0]||(t[0]=S("span",{class:"vpi-arrow-right link-text-icon"},null,-1))])])):M("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),zs=$(Ms,[["__scopeId","data-v-ec79f101"]]),Is={key:0,class:"VPFeatures"},Ns={class:"container"},Ps={class:"items"},$s=z({__name:"VPFeatures",props:{features:{}},setup(r){const n=r,t=O(()=>{const e=n.features.length;if(e){if(e===2)return"grid-2";if(e===3)return"grid-3";if(e%3===0)return"grid-6";if(e>3)return"grid-4"}else return});return(e,i)=>r.features?(f(),k("div",Is,[S("div",Ns,[S("div",Ps,[(f(!0),k(K,null,rt(r.features,o=>(f(),k("div",{key:o.title,class:G(["item",[t.value]])},[I(zs,{icon:o.icon,title:o.title,details:o.details,link:o.link,"link-text":o.linkText,rel:o.rel,target:o.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):M("",!0)}}),Vs=$($s,[["__scopeId","data-v-2688857f"]]),Bs=z({__name:"VPHomeFeatures",setup(r){const{frontmatter:n}=F();return(t,e)=>x(n).features?(f(),N(Vs,{key:0,class:"VPHomeFeatures",features:x(n).features},null,8,["features"])):M("",!0)}}),Ds=z({__name:"VPHomeContent",setup(r){const{width:n}=Ui({initialWidth:0,includeScrollbar:!1});return(t,e)=>(f(),k("div",{class:"vp-doc container",style:Vn(x(n)?{"--vp-offset":`calc(50% - ${x(n)/2}px)`}:{})},[E(t.$slots,"default",{},void 0,!0)],4))}}),Os=$(Ds,[["__scopeId","data-v-69cd18ab"]]),Hs=z({__name:"VPHome",setup(r){const{frontmatter:n,theme:t}=F();return(e,i)=>{const o=qt("Content");return f(),k("div",{class:G(["VPHome",{"external-link-icon-enabled":x(t).externalLinkIcon}])},[E(e.$slots,"home-hero-before",{},void 0,!0),I(ws,null,{"home-hero-info-before":C(()=>[E(e.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[E(e.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[E(e.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[E(e.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[E(e.$slots,"home-hero-image",{},void 0,!0)]),_:3}),E(e.$slots,"home-hero-after",{},void 0,!0),E(e.$slots,"home-features-before",{},void 0,!0),I(Bs),E(e.$slots,"home-features-after",{},void 0,!0),x(n).markdownStyles!==!1?(f(),N(Os,{key:0},{default:C(()=>[I(o)]),_:1})):(f(),N(o,{key:1}))],2)}}}),Rs=$(Hs,[["__scopeId","data-v-1d4174a3"]]),Fs={},js={class:"VPPage"};function Ws(r,n){const t=qt("Content");return f(),k("div",js,[E(r.$slots,"page-top"),I(t),E(r.$slots,"page-bottom")])}const qs=$(Fs,[["render",Ws]]),Ys=z({__name:"VPContent",setup(r){const{page:n,frontmatter:t}=F(),{hasSidebar:e}=Dt();return(i,o)=>(f(),k("div",{class:G(["VPContent",{"has-sidebar":x(e),"is-home":x(t).layout==="home"}]),id:"VPContent"},[x(n).isNotFound?E(i.$slots,"not-found",{},()=>[I(co)],!0,0):x(t).layout==="page"?(f(),N(qs,{key:1},{"page-top":C(()=>[E(i.$slots,"page-top",{},void 0,!0)]),"page-bottom":C(()=>[E(i.$slots,"page-bottom",{},void 0,!0)]),_:3})):x(t).layout==="home"?(f(),N(Rs,{key:2},{"home-hero-before":C(()=>[E(i.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":C(()=>[E(i.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[E(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[E(i.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[E(i.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[E(i.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":C(()=>[E(i.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":C(()=>[E(i.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":C(()=>[E(i.$slots,"home-features-after",{},void 0,!0)]),_:3})):x(t).layout&&x(t).layout!=="doc"?(f(),N(yt(x(t).layout),{key:3})):(f(),N(ss,{key:4},{"doc-top":C(()=>[E(i.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":C(()=>[E(i.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":C(()=>[E(i.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":C(()=>[E(i.$slots,"doc-before",{},void 0,!0)]),"doc-after":C(()=>[E(i.$slots,"doc-after",{},void 0,!0)]),"aside-top":C(()=>[E(i.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":C(()=>[E(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[E(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[E(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[E(i.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":C(()=>[E(i.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Xs=$(Ys,[["__scopeId","data-v-d135c50d"]]),Zs={class:"container"},Us=["innerHTML"],Js=["innerHTML"],Gs=z({__name:"VPFooter",setup(r){const{theme:n,frontmatter:t}=F(),{hasSidebar:e}=Dt();return(i,o)=>x(n).footer&&x(t).footer!==!1?(f(),k("footer",{key:0,class:G(["VPFooter",{"has-sidebar":x(e)}])},[S("div",Zs,[x(n).footer.message?(f(),k("p",{key:0,class:"message",innerHTML:x(n).footer.message},null,8,Us)):M("",!0),x(n).footer.copyright?(f(),k("p",{key:1,class:"copyright",innerHTML:x(n).footer.copyright},null,8,Js)):M("",!0)])],2)):M("",!0)}}),Ks=$(Gs,[["__scopeId","data-v-914e3c0d"]]);function Qs(){const{theme:r,frontmatter:n}=F(),t=$n([]),e=O(()=>t.value.length>0);return ze(()=>{t.value=Fn(n.value.outline??r.value.outline)}),{headers:t,hasLocalNav:e}}const ta={class:"menu-text"},ea={class:"header"},na={class:"outline"},ia=z({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(r){const n=r,{theme:t}=F(),e=Y(!1),i=Y(0),o=Y(),s=Y();function a(u){var p;(p=o.value)!=null&&p.contains(u.target)||(e.value=!1)}It(e,u=>{if(u){document.addEventListener("click",a);return}document.removeEventListener("click",a)}),Re("Escape",()=>{e.value=!1}),ze(()=>{e.value=!1});function l(){e.value=!e.value,i.value=window.innerHeight+Math.min(window.scrollY-n.navHeight,0)}function d(u){u.target.classList.contains("outline-link")&&(s.value&&(s.value.style.transition="none"),oi(()=>{e.value=!1}))}function h(){e.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(u,p)=>(f(),k("div",{class:"VPLocalNavOutlineDropdown",style:Vn({"--vp-vh":i.value+"px"}),ref_key:"main",ref:o},[r.headers.length>0?(f(),k("button",{key:0,onClick:l,class:G({open:e.value})},[S("span",ta,q(x(Ci)(x(t))),1),p[0]||(p[0]=S("span",{class:"vpi-chevron-right icon"},null,-1))],2)):(f(),k("button",{key:1,onClick:h},q(x(t).returnToTopLabel||"Return to top"),1)),I(In,{name:"flyout"},{default:C(()=>[e.value?(f(),k("div",{key:0,ref_key:"items",ref:s,class:"items",onClick:d},[S("div",ea,[S("a",{class:"top-link",href:"#",onClick:h},q(x(t).returnToTopLabel||"Return to top"),1)]),S("div",na,[I(Li,{headers:r.headers},null,8,["headers"])])],512)):M("",!0)]),_:1})],4))}}),ra=$(ia,[["__scopeId","data-v-da46a7e3"]]),oa={class:"container"},sa=["aria-expanded"],aa={class:"menu-text"},la=z({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(r){const{theme:n,frontmatter:t}=F(),{hasSidebar:e}=Dt(),{headers:i}=Qs(),{y:o}=si(),s=Y(0);Bt(()=>{s.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),ze(()=>{i.value=Fn(t.value.outline??n.value.outline)});const a=O(()=>i.value.length===0),l=O(()=>a.value&&!e.value),d=O(()=>({VPLocalNav:!0,"has-sidebar":e.value,empty:a.value,fixed:l.value}));return(h,u)=>x(t).layout!=="home"&&(!l.value||x(o)>=s.value)?(f(),k("div",{key:0,class:G(d.value)},[S("div",oa,[x(e)?(f(),k("button",{key:0,class:"menu","aria-expanded":r.open,"aria-controls":"VPSidebarNav",onClick:u[0]||(u[0]=p=>h.$emit("open-menu"))},[u[1]||(u[1]=S("span",{class:"vpi-align-left menu-icon"},null,-1)),S("span",aa,q(x(n).sidebarMenuLabel||"Menu"),1)],8,sa)):M("",!0),I(ra,{headers:x(i),navHeight:s.value},null,8,["headers","navHeight"])])],2)):M("",!0)}}),ca=$(la,[["__scopeId","data-v-4e250188"]]);function da(){const r=Y(!1);function n(){r.value=!0,window.addEventListener("resize",i)}function t(){r.value=!1,window.removeEventListener("resize",i)}function e(){r.value?t():n()}function i(){window.outerWidth>=768&&t()}const o=Ie();return It(()=>o.path,t),{isScreenOpen:r,openScreen:n,closeScreen:t,toggleScreen:e}}const ha={},ua={class:"VPSwitch",type:"button",role:"switch"},ga={class:"check"},pa={key:0,class:"icon"};function ma(r,n){return f(),k("button",ua,[S("span",ga,[r.$slots.default?(f(),k("span",pa,[E(r.$slots,"default",{},void 0,!0)])):M("",!0)])])}const fa=$(ha,[["render",ma],["__scopeId","data-v-28d70d9b"]]),ba=z({__name:"VPSwitchAppearance",setup(r){const{isDark:n,theme:t}=F(),e=Ne("toggle-appearance",()=>{n.value=!n.value}),i=Y("");return Pn(()=>{i.value=n.value?t.value.lightModeSwitchTitle||"Switch to light theme":t.value.darkModeSwitchTitle||"Switch to dark theme"}),(o,s)=>(f(),N(fa,{title:i.value,class:"VPSwitchAppearance","aria-checked":x(n),onClick:x(e)},{default:C(()=>[...s[0]||(s[0]=[S("span",{class:"vpi-sun sun"},null,-1),S("span",{class:"vpi-moon moon"},null,-1)])]),_:1},8,["title","aria-checked","onClick"]))}}),jn=$(ba,[["__scopeId","data-v-26a2a893"]]),va={key:0,class:"VPNavBarAppearance"},xa=z({__name:"VPNavBarAppearance",setup(r){const{site:n}=F();return(t,e)=>x(n).appearance&&x(n).appearance!=="force-dark"&&x(n).appearance!=="force-auto"?(f(),k("div",va,[I(jn)])):M("",!0)}}),_a=$(xa,[["__scopeId","data-v-211668fc"]]),Wn=Y();let Ai=!1,Oe=0;function ya(r){const n=Y(!1);if(Pe){!Ai&&wa(),Oe++;const t=It(Wn,e=>{var i,o,s;e===r.el.value||(i=r.el.value)!=null&&i.contains(e)?(n.value=!0,(o=r.onFocus)==null||o.call(r)):(n.value=!1,(s=r.onBlur)==null||s.call(r))});Nn(()=>{t(),Oe--,Oe||ka()})}return Ji(n)}function wa(){document.addEventListener("focusin",Ti),Ai=!0,Wn.value=document.activeElement}function ka(){document.removeEventListener("focusin",Ti)}function Ti(){Wn.value=document.activeElement}const Ea={class:"VPMenuLink"},Sa=["innerHTML"],Ca=z({__name:"VPMenuLink",props:{item:{}},setup(r){const{page:n}=F();return(t,e)=>(f(),k("div",Ea,[I(zt,{class:G({active:x(Gt)(x(n).relativePath,r.item.activeMatch||r.item.link,!!r.item.activeMatch)}),href:r.item.link,target:r.item.target,rel:r.item.rel,"no-icon":r.item.noIcon},{default:C(()=>[S("span",{innerHTML:r.item.text},null,8,Sa)]),_:1},8,["class","href","target","rel","no-icon"])]))}}),$e=$(Ca,[["__scopeId","data-v-33f799ca"]]),La={class:"VPMenuGroup"},Aa={key:0,class:"title"},Ta=z({__name:"VPMenuGroup",props:{text:{},items:{}},setup(r){return(n,t)=>(f(),k("div",La,[r.text?(f(),k("p",Aa,q(r.text),1)):M("",!0),(f(!0),k(K,null,rt(r.items,e=>(f(),k(K,null,["link"in e?(f(),N($e,{key:0,item:e},null,8,["item"])):M("",!0)],64))),256))]))}}),Ma=$(Ta,[["__scopeId","data-v-22912907"]]),za={class:"VPMenu"},Ia={key:0,class:"items"},Na=z({__name:"VPMenu",props:{items:{}},setup(r){return(n,t)=>(f(),k("div",za,[r.items?(f(),k("div",Ia,[(f(!0),k(K,null,rt(r.items,e=>(f(),k(K,{key:JSON.stringify(e)},["link"in e?(f(),N($e,{key:0,item:e},null,8,["item"])):"component"in e?(f(),N(yt(e.component),jt({key:1,ref_for:!0},e.props),null,16)):(f(),N(Ma,{key:2,text:e.text,items:e.items},null,8,["text","items"]))],64))),128))])):M("",!0),E(n.$slots,"default",{},void 0,!0)]))}}),Pa=$(Na,[["__scopeId","data-v-aebd34a3"]]),$a=["aria-expanded","aria-label"],Va={key:0,class:"text"},Ba=["innerHTML"],Da={key:1,class:"vpi-more-horizontal icon"},Oa={class:"menu"},Ha=z({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(r){const n=Y(!1),t=Y();ya({el:t,onBlur:e});function e(){n.value=!1}return(i,o)=>(f(),k("div",{class:"VPFlyout",ref_key:"el",ref:t,onMouseenter:o[1]||(o[1]=s=>n.value=!0),onMouseleave:o[2]||(o[2]=s=>n.value=!1)},[S("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":n.value,"aria-label":r.label,onClick:o[0]||(o[0]=s=>n.value=!n.value)},[r.button||r.icon?(f(),k("span",Va,[r.icon?(f(),k("span",{key:0,class:G([r.icon,"option-icon"])},null,2)):M("",!0),r.button?(f(),k("span",{key:1,innerHTML:r.button},null,8,Ba)):M("",!0),o[3]||(o[3]=S("span",{class:"vpi-chevron-down text-icon"},null,-1))])):(f(),k("span",Da))],8,$a),S("div",Oa,[I(Pa,{items:r.items},{default:C(()=>[E(i.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),qn=$(Ha,[["__scopeId","data-v-1ef90f37"]]),Ra=["href","aria-label","innerHTML"],Fa=z({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(r){const n=r,t=Y();Bt(async()=>{var o;await oi();const i=(o=t.value)==null?void 0:o.children[0];i instanceof HTMLElement&&i.className.startsWith("vpi-social-")&&(getComputedStyle(i).maskImage||getComputedStyle(i).webkitMaskImage)==="none"&&i.style.setProperty("--icon",`url('https://api.iconify.design/simple-icons/${n.icon}.svg')`)});const e=O(()=>typeof n.icon=="object"?n.icon.svg:`<span class="vpi-social-${n.icon}"></span>`);return(i,o)=>(f(),k("a",{ref_key:"el",ref:t,class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:e.value},null,8,Ra))}}),ja=$(Fa,[["__scopeId","data-v-0d09c99c"]]),Wa={class:"VPSocialLinks"},qa=z({__name:"VPSocialLinks",props:{links:{}},setup(r){return(n,t)=>(f(),k("div",Wa,[(f(!0),k(K,null,rt(r.links,({link:e,icon:i,ariaLabel:o})=>(f(),N(ja,{key:e,icon:i,link:e,ariaLabel:o},null,8,["icon","link","ariaLabel"]))),128))]))}}),Yn=$(qa,[["__scopeId","data-v-0de55cf5"]]),Ya={key:0,class:"group translations"},Xa={class:"trans-title"},Za={key:1,class:"group"},Ua={class:"item appearance"},Ja={class:"label"},Ga={class:"appearance-action"},Ka={key:2,class:"group"},Qa={class:"item social-links"},tl=z({__name:"VPNavBarExtra",setup(r){const{site:n,theme:t}=F(),{localeLinks:e,currentLang:i}=fe({correspondingLink:!0}),o=O(()=>e.value.length&&i.value.label||n.value.appearance||t.value.socialLinks);return(s,a)=>o.value?(f(),N(qn,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:C(()=>[x(e).length&&x(i).label?(f(),k("div",Ya,[S("p",Xa,q(x(i).label),1),(f(!0),k(K,null,rt(x(e),l=>(f(),N($e,{key:l.link,item:l},null,8,["item"]))),128))])):M("",!0),x(n).appearance&&x(n).appearance!=="force-dark"&&x(n).appearance!=="force-auto"?(f(),k("div",Za,[S("div",Ua,[S("p",Ja,q(x(t).darkModeSwitchLabel||"Appearance"),1),S("div",Ga,[I(jn)])])])):M("",!0),x(t).socialLinks?(f(),k("div",Ka,[S("div",Qa,[I(Yn,{class:"social-links-list",links:x(t).socialLinks},null,8,["links"])])])):M("",!0)]),_:1})):M("",!0)}}),el=$(tl,[["__scopeId","data-v-641c24d0"]]),nl=["aria-expanded"],il=z({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(r){return(n,t)=>(f(),k("button",{type:"button",class:G(["VPNavBarHamburger",{active:r.active}]),"aria-label":"mobile navigation","aria-expanded":r.active,"aria-controls":"VPNavScreen",onClick:t[0]||(t[0]=e=>n.$emit("click"))},[...t[1]||(t[1]=[S("span",{class:"container"},[S("span",{class:"top"}),S("span",{class:"middle"}),S("span",{class:"bottom"})],-1)])],10,nl))}}),rl=$(il,[["__scopeId","data-v-69e904a0"]]),ol=["innerHTML"],sl=z({__name:"VPNavBarMenuLink",props:{item:{}},setup(r){const{page:n}=F();return(t,e)=>(f(),N(zt,{class:G({VPNavBarMenuLink:!0,active:x(Gt)(x(n).relativePath,r.item.activeMatch||r.item.link,!!r.item.activeMatch)}),href:r.item.link,target:r.item.target,rel:r.item.rel,"no-icon":r.item.noIcon,tabindex:"0"},{default:C(()=>[S("span",{innerHTML:r.item.text},null,8,ol)]),_:1},8,["class","href","target","rel","no-icon"]))}}),al=$(sl,[["__scopeId","data-v-830e2a72"]]),ll=z({__name:"VPNavBarMenuGroup",props:{item:{}},setup(r){const n=r,{page:t}=F(),e=o=>"component"in o?!1:"link"in o?Gt(t.value.relativePath,o.link,!!n.item.activeMatch):o.items.some(e),i=O(()=>e(n.item));return(o,s)=>(f(),N(qn,{class:G({VPNavBarMenuGroup:!0,active:x(Gt)(x(t).relativePath,r.item.activeMatch,!!r.item.activeMatch)||i.value}),button:r.item.text,items:r.item.items},null,8,["class","button","items"]))}}),cl={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},dl=z({__name:"VPNavBarMenu",setup(r){const{theme:n}=F();return(t,e)=>x(n).nav?(f(),k("nav",cl,[e[0]||(e[0]=S("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),(f(!0),k(K,null,rt(x(n).nav,i=>(f(),k(K,{key:JSON.stringify(i)},["link"in i?(f(),N(al,{key:0,item:i},null,8,["item"])):"component"in i?(f(),N(yt(i.component),jt({key:1,ref_for:!0},i.props),null,16)):(f(),N(ll,{key:2,item:i},null,8,["item"]))],64))),128))])):M("",!0)}}),hl=$(dl,[["__scopeId","data-v-057bb6ba"]]);function ul(r){const{localeIndex:n,theme:t}=F();function e(i){var b,y,m;const o=i.split("."),s=(b=t.value.search)==null?void 0:b.options,a=s&&typeof s=="object",l=a&&((m=(y=s.locales)==null?void 0:y[n.value])==null?void 0:m.translations)||null,d=a&&s.translations||null;let h=l,u=d,p=r;const _=o.pop();for(const w of o){let A=null;const V=p==null?void 0:p[w];V&&(A=p=V);const H=u==null?void 0:u[w];H&&(A=u=H);const Z=h==null?void 0:h[w];Z&&(A=h=Z),V||(p=A),H||(u=A),Z||(h=A)}return(h==null?void 0:h[_])??(u==null?void 0:u[_])??(p==null?void 0:p[_])??""}return e}const gl=["aria-label"],pl={class:"DocSearch-Button-Container"},ml={class:"DocSearch-Button-Placeholder"},ei=z({__name:"VPNavBarSearchButton",setup(r){const t=ul({button:{buttonText:"Search",buttonAriaLabel:"Search"}});return(e,i)=>(f(),k("button",{type:"button",class:"DocSearch DocSearch-Button","aria-label":x(t)("button.buttonAriaLabel")},[S("span",pl,[i[0]||(i[0]=S("span",{class:"vp-icon DocSearch-Search-Icon"},null,-1)),S("span",ml,q(x(t)("button.buttonText")),1)]),i[1]||(i[1]=S("span",{class:"DocSearch-Button-Keys"},[S("kbd",{class:"DocSearch-Button-Key"}),S("kbd",{class:"DocSearch-Button-Key"},"K")],-1))],8,gl))}}),fl={class:"VPNavBarSearch"},bl={id:"local-search"},vl={key:1,id:"docsearch"},xl=z({__name:"VPNavBarSearch",setup(r){const n=Gi(()=>tt(()=>import("./VPLocalSearchBox.CQsC00rG.js"),__vite__mapDeps([0,1]))),t=()=>null,{theme:e}=F(),i=Y(!1),o=Y(!1);Bt(()=>{});function s(){i.value||(i.value=!0,setTimeout(a,16))}function a(){const u=new Event("keydown");u.key="k",u.metaKey=!0,window.dispatchEvent(u),setTimeout(()=>{document.querySelector(".DocSearch-Modal")||a()},16)}function l(u){const p=u.target,_=p.tagName;return p.isContentEditable||_==="INPUT"||_==="SELECT"||_==="TEXTAREA"}const d=Y(!1);Re("k",u=>{(u.ctrlKey||u.metaKey)&&(u.preventDefault(),d.value=!0)}),Re("/",u=>{l(u)||(u.preventDefault(),d.value=!0)});const h="local";return(u,p)=>{var _;return f(),k("div",fl,[x(h)==="local"?(f(),k(K,{key:0},[d.value?(f(),N(x(n),{key:0,onClose:p[0]||(p[0]=b=>d.value=!1)})):M("",!0),S("div",bl,[I(ei,{onClick:p[1]||(p[1]=b=>d.value=!0)})])],64)):x(h)==="algolia"?(f(),k(K,{key:1},[i.value?(f(),N(x(t),{key:0,algolia:((_=x(e).search)==null?void 0:_.options)??x(e).algolia,onVnodeBeforeMount:p[2]||(p[2]=b=>o.value=!0)},null,8,["algolia"])):M("",!0),o.value?M("",!0):(f(),k("div",vl,[I(ei,{onClick:s})]))],64)):M("",!0)])}}}),_l=z({__name:"VPNavBarSocialLinks",setup(r){const{theme:n}=F();return(t,e)=>x(n).socialLinks?(f(),N(Yn,{key:0,class:"VPNavBarSocialLinks",links:x(n).socialLinks},null,8,["links"])):M("",!0)}}),yl=$(_l,[["__scopeId","data-v-af0cd4d4"]]),wl=["href","rel","target"],kl=["innerHTML"],El={key:2},Sl=z({__name:"VPNavBarTitle",setup(r){const{site:n,theme:t}=F(),{hasSidebar:e}=Dt(),{currentLang:i}=fe(),o=O(()=>{var l;return typeof t.value.logoLink=="string"?t.value.logoLink:(l=t.value.logoLink)==null?void 0:l.link}),s=O(()=>{var l;return typeof t.value.logoLink=="string"||(l=t.value.logoLink)==null?void 0:l.rel}),a=O(()=>{var l;return typeof t.value.logoLink=="string"||(l=t.value.logoLink)==null?void 0:l.target});return(l,d)=>(f(),k("div",{class:G(["VPNavBarTitle",{"has-sidebar":x(e)}])},[S("a",{class:"title",href:o.value??x(Rn)(x(i).link),rel:s.value,target:a.value},[E(l.$slots,"nav-bar-title-before",{},void 0,!0),x(t).logo?(f(),N(Ce,{key:0,class:"logo",image:x(t).logo},null,8,["image"])):M("",!0),x(t).siteTitle?(f(),k("span",{key:1,innerHTML:x(t).siteTitle},null,8,kl)):x(t).siteTitle===void 0?(f(),k("span",El,q(x(n).title),1)):M("",!0),E(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,wl)],2))}}),Cl=$(Sl,[["__scopeId","data-v-876f81e0"]]),Ll={class:"items"},Al={class:"title"},Tl=z({__name:"VPNavBarTranslations",setup(r){const{theme:n}=F(),{localeLinks:t,currentLang:e}=fe({correspondingLink:!0});return(i,o)=>x(t).length&&x(e).label?(f(),N(qn,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:x(n).langMenuLabel||"Change language"},{default:C(()=>[S("div",Ll,[S("p",Al,q(x(e).label),1),(f(!0),k(K,null,rt(x(t),s=>(f(),N($e,{key:s.link,item:s},null,8,["item"]))),128))])]),_:1},8,["label"])):M("",!0)}}),Ml=$(Tl,[["__scopeId","data-v-4cc0766b"]]),zl={class:"wrapper"},Il={class:"container"},Nl={class:"title"},Pl={class:"content"},$l={class:"content-body"},Vl=z({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(r){const n=r,{y:t}=si(),{hasSidebar:e}=Dt(),{frontmatter:i}=F(),o=Y({});return Pn(()=>{o.value={"has-sidebar":e.value,home:i.value.layout==="home",top:t.value===0,"screen-open":n.isScreenOpen}}),(s,a)=>(f(),k("div",{class:G(["VPNavBar",o.value])},[S("div",zl,[S("div",Il,[S("div",Nl,[I(Cl,null,{"nav-bar-title-before":C(()=>[E(s.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[E(s.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),S("div",Pl,[S("div",$l,[E(s.$slots,"nav-bar-content-before",{},void 0,!0),I(xl,{class:"search"}),I(hl,{class:"menu"}),I(Ml,{class:"translations"}),I(_a,{class:"appearance"}),I(yl,{class:"social-links"}),I(el,{class:"extra"}),E(s.$slots,"nav-bar-content-after",{},void 0,!0),I(rl,{class:"hamburger",active:r.isScreenOpen,onClick:a[0]||(a[0]=l=>s.$emit("toggle-screen"))},null,8,["active"])])])])]),a[1]||(a[1]=S("div",{class:"divider"},[S("div",{class:"divider-line"})],-1))],2))}}),Bl=$(Vl,[["__scopeId","data-v-330c170d"]]),Dl={key:0,class:"VPNavScreenAppearance"},Ol={class:"text"},Hl=z({__name:"VPNavScreenAppearance",setup(r){const{site:n,theme:t}=F();return(e,i)=>x(n).appearance&&x(n).appearance!=="force-dark"&&x(n).appearance!=="force-auto"?(f(),k("div",Dl,[S("p",Ol,q(x(t).darkModeSwitchLabel||"Appearance"),1),I(jn)])):M("",!0)}}),Rl=$(Hl,[["__scopeId","data-v-553742de"]]),Fl=["innerHTML"],jl=z({__name:"VPNavScreenMenuLink",props:{item:{}},setup(r){const n=Ne("close-screen");return(t,e)=>(f(),N(zt,{class:"VPNavScreenMenuLink",href:r.item.link,target:r.item.target,rel:r.item.rel,"no-icon":r.item.noIcon,onClick:x(n)},{default:C(()=>[S("span",{innerHTML:r.item.text},null,8,Fl)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),Wl=$(jl,[["__scopeId","data-v-a1d948fc"]]),ql=["innerHTML"],Yl=z({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(r){const n=Ne("close-screen");return(t,e)=>(f(),N(zt,{class:"VPNavScreenMenuGroupLink",href:r.item.link,target:r.item.target,rel:r.item.rel,"no-icon":r.item.noIcon,onClick:x(n)},{default:C(()=>[S("span",{innerHTML:r.item.text},null,8,ql)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),Mi=$(Yl,[["__scopeId","data-v-a39fdb5a"]]),Xl={class:"VPNavScreenMenuGroupSection"},Zl={key:0,class:"title"},Ul=z({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(r){return(n,t)=>(f(),k("div",Xl,[r.text?(f(),k("p",Zl,q(r.text),1)):M("",!0),(f(!0),k(K,null,rt(r.items,e=>(f(),N(Mi,{key:e.text,item:e},null,8,["item"]))),128))]))}}),Jl=$(Ul,[["__scopeId","data-v-23510ca3"]]),Gl=["aria-controls","aria-expanded"],Kl=["innerHTML"],Ql=["id"],tc={key:0,class:"item"},ec={key:1,class:"item"},nc={key:2,class:"group"},ic=z({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(r){const n=r,t=Y(!1),e=O(()=>`NavScreenGroup-${n.text.replace(" ","-").toLowerCase()}`);function i(){t.value=!t.value}return(o,s)=>(f(),k("div",{class:G(["VPNavScreenMenuGroup",{open:t.value}])},[S("button",{class:"button","aria-controls":e.value,"aria-expanded":t.value,onClick:i},[S("span",{class:"button-text",innerHTML:r.text},null,8,Kl),s[0]||(s[0]=S("span",{class:"vpi-plus button-icon"},null,-1))],8,Gl),S("div",{id:e.value,class:"items"},[(f(!0),k(K,null,rt(r.items,a=>(f(),k(K,{key:JSON.stringify(a)},["link"in a?(f(),k("div",tc,[I(Mi,{item:a},null,8,["item"])])):"component"in a?(f(),k("div",ec,[(f(),N(yt(a.component),jt({ref_for:!0},a.props,{"screen-menu":""}),null,16))])):(f(),k("div",nc,[I(Jl,{text:a.text,items:a.items},null,8,["text","items"])]))],64))),128))],8,Ql)],2))}}),rc=$(ic,[["__scopeId","data-v-cba3c3e1"]]),oc={key:0,class:"VPNavScreenMenu"},sc=z({__name:"VPNavScreenMenu",setup(r){const{theme:n}=F();return(t,e)=>x(n).nav?(f(),k("nav",oc,[(f(!0),k(K,null,rt(x(n).nav,i=>(f(),k(K,{key:JSON.stringify(i)},["link"in i?(f(),N(Wl,{key:0,item:i},null,8,["item"])):"component"in i?(f(),N(yt(i.component),jt({key:1,ref_for:!0},i.props,{"screen-menu":""}),null,16)):(f(),N(rc,{key:2,text:i.text||"",items:i.items},null,8,["text","items"]))],64))),128))])):M("",!0)}}),ac=z({__name:"VPNavScreenSocialLinks",setup(r){const{theme:n}=F();return(t,e)=>x(n).socialLinks?(f(),N(Yn,{key:0,class:"VPNavScreenSocialLinks",links:x(n).socialLinks},null,8,["links"])):M("",!0)}}),lc={class:"list"},cc=z({__name:"VPNavScreenTranslations",setup(r){const{localeLinks:n,currentLang:t}=fe({correspondingLink:!0}),e=Y(!1);function i(){e.value=!e.value}return(o,s)=>x(n).length&&x(t).label?(f(),k("div",{key:0,class:G(["VPNavScreenTranslations",{open:e.value}])},[S("button",{class:"title",onClick:i},[s[0]||(s[0]=S("span",{class:"vpi-languages icon lang"},null,-1)),Jt(" "+q(x(t).label)+" ",1),s[1]||(s[1]=S("span",{class:"vpi-chevron-down icon chevron"},null,-1))]),S("ul",lc,[(f(!0),k(K,null,rt(x(n),a=>(f(),k("li",{key:a.link,class:"item"},[I(zt,{class:"link",href:a.link},{default:C(()=>[Jt(q(a.text),1)]),_:2},1032,["href"])]))),128))])],2)):M("",!0)}}),dc=$(cc,[["__scopeId","data-v-850db724"]]),hc={class:"container"},uc=z({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(r){const n=Y(null),t=ai(Pe?document.body:null);return(e,i)=>(f(),N(In,{name:"fade",onEnter:i[0]||(i[0]=o=>t.value=!0),onAfterLeave:i[1]||(i[1]=o=>t.value=!1)},{default:C(()=>[r.open?(f(),k("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:n,id:"VPNavScreen"},[S("div",hc,[E(e.$slots,"nav-screen-content-before",{},void 0,!0),I(sc,{class:"menu"}),I(dc,{class:"translations"}),I(Rl,{class:"appearance"}),I(ac,{class:"social-links"}),E(e.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):M("",!0)]),_:3}))}}),gc=$(uc,[["__scopeId","data-v-33ab8a32"]]),pc={key:0,class:"VPNav"},mc=z({__name:"VPNav",setup(r){const{isScreenOpen:n,closeScreen:t,toggleScreen:e}=da(),{frontmatter:i}=F(),o=O(()=>i.value.navbar!==!1);return li("close-screen",t),Me(()=>{Pe&&document.documentElement.classList.toggle("hide-nav",!o.value)}),(s,a)=>o.value?(f(),k("header",pc,[I(Bl,{"is-screen-open":x(n),onToggleScreen:x(e)},{"nav-bar-title-before":C(()=>[E(s.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[E(s.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":C(()=>[E(s.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":C(()=>[E(s.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),I(gc,{open:x(n)},{"nav-screen-content-before":C(()=>[E(s.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":C(()=>[E(s.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):M("",!0)}}),fc=$(mc,[["__scopeId","data-v-466096ac"]]),bc=["role","tabindex"],vc={key:1,class:"items"},xc=z({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(r){const n=r,{collapsed:t,collapsible:e,isLink:i,isActiveLink:o,hasActiveLink:s,hasChildren:a,toggle:l}=po(O(()=>n.item)),d=O(()=>a.value?"section":"div"),h=O(()=>i.value?"a":"div"),u=O(()=>a.value?n.depth+2===7?"p":`h${n.depth+2}`:"p"),p=O(()=>i.value?void 0:"button"),_=O(()=>[[`level-${n.depth}`],{collapsible:e.value},{collapsed:t.value},{"is-link":i.value},{"is-active":o.value},{"has-active":s.value}]);function b(m){"key"in m&&m.key!=="Enter"||!n.item.link&&l()}function y(){n.item.link&&l()}return(m,w)=>{const A=qt("VPSidebarItem",!0);return f(),N(yt(d.value),{class:G(["VPSidebarItem",_.value])},{default:C(()=>[r.item.text?(f(),k("div",jt({key:0,class:"item",role:p.value},Ki(r.item.items?{click:b,keydown:b}:{},!0),{tabindex:r.item.items&&0}),[w[1]||(w[1]=S("div",{class:"indicator"},null,-1)),r.item.link?(f(),N(zt,{key:0,tag:h.value,class:"link",href:r.item.link,rel:r.item.rel,target:r.item.target},{default:C(()=>[(f(),N(yt(u.value),{class:"text",innerHTML:r.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(f(),N(yt(u.value),{key:1,class:"text",innerHTML:r.item.text},null,8,["innerHTML"])),r.item.collapsed!=null&&r.item.items&&r.item.items.length?(f(),k("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:y,onKeydown:Qi(y,["enter"]),tabindex:"0"},[...w[0]||(w[0]=[S("span",{class:"vpi-chevron-right caret-icon"},null,-1)])],32)):M("",!0)],16,bc)):M("",!0),r.item.items&&r.item.items.length?(f(),k("div",vc,[r.depth<5?(f(!0),k(K,{key:0},rt(r.item.items,V=>(f(),N(A,{key:V.text,item:V,depth:r.depth+1},null,8,["item","depth"]))),128)):M("",!0)])):M("",!0)]),_:1},8,["class"])}}}),_c=$(xc,[["__scopeId","data-v-2745cb03"]]),yc=z({__name:"VPSidebarGroup",props:{items:{}},setup(r){const n=Y(!0);let t=null;return Bt(()=>{t=setTimeout(()=>{t=null,n.value=!1},300)}),tr(()=>{t!=null&&(clearTimeout(t),t=null)}),(e,i)=>(f(!0),k(K,null,rt(r.items,o=>(f(),k("div",{key:o.text,class:G(["group",{"no-transition":n.value}])},[I(_c,{item:o,depth:0},null,8,["item"])],2))),128))}}),wc=$(yc,[["__scopeId","data-v-229ab745"]]),kc={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},Ec=z({__name:"VPSidebar",props:{open:{type:Boolean}},setup(r){const{sidebarGroups:n,hasSidebar:t}=Dt(),e=r,i=Y(null),o=ai(Pe?document.body:null);It([e,i],()=>{var a;e.open?(o.value=!0,(a=i.value)==null||a.focus()):o.value=!1},{immediate:!0,flush:"post"});const s=Y(0);return It(n,()=>{s.value+=1},{deep:!0}),(a,l)=>x(t)?(f(),k("aside",{key:0,class:G(["VPSidebar",{open:r.open}]),ref_key:"navEl",ref:i,onClick:l[0]||(l[0]=er(()=>{},["stop"]))},[l[2]||(l[2]=S("div",{class:"curtain"},null,-1)),S("nav",kc,[l[1]||(l[1]=S("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),E(a.$slots,"sidebar-nav-before",{},void 0,!0),(f(),N(wc,{items:x(n),key:s.value},null,8,["items"])),E(a.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):M("",!0)}}),Sc=$(Ec,[["__scopeId","data-v-ef4717f1"]]),Cc=z({__name:"VPSkipLink",setup(r){const{theme:n}=F(),t=Ie(),e=Y();It(()=>t.path,()=>e.value.focus());function i({target:o}){const s=document.getElementById(decodeURIComponent(o.hash).slice(1));if(s){const a=()=>{s.removeAttribute("tabindex"),s.removeEventListener("blur",a)};s.setAttribute("tabindex","-1"),s.addEventListener("blur",a),s.focus(),window.scrollTo(0,0)}}return(o,s)=>(f(),k(K,null,[S("span",{ref_key:"backToTop",ref:e,tabindex:"-1"},null,512),S("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:i},q(x(n).skipToContentLabel||"Skip to content"),1)],64))}}),Lc=$(Cc,[["__scopeId","data-v-9971ad74"]]),Ac=z({__name:"Layout",setup(r){const{isOpen:n,open:t,close:e}=Dt(),i=Ie();It(()=>i.path,e),go(n,e);const{frontmatter:o}=F(),s=nr(),a=O(()=>!!s["home-hero-image"]);return li("hero-image-slot-exists",a),(l,d)=>{const h=qt("Content");return x(o).layout!==!1?(f(),k("div",{key:0,class:G(["Layout",x(o).pageClass])},[E(l.$slots,"layout-top",{},void 0,!0),I(Lc),I(Qr,{class:"backdrop",show:x(n),onClick:x(e)},null,8,["show","onClick"]),I(fc,null,{"nav-bar-title-before":C(()=>[E(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[E(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":C(()=>[E(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":C(()=>[E(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":C(()=>[E(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":C(()=>[E(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),I(ca,{open:x(n),onOpenMenu:x(t)},null,8,["open","onOpenMenu"]),I(Sc,{open:x(n)},{"sidebar-nav-before":C(()=>[E(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":C(()=>[E(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),I(Xs,null,{"page-top":C(()=>[E(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":C(()=>[E(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":C(()=>[E(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":C(()=>[E(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":C(()=>[E(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[E(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[E(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[E(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[E(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":C(()=>[E(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":C(()=>[E(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":C(()=>[E(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":C(()=>[E(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":C(()=>[E(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":C(()=>[E(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":C(()=>[E(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":C(()=>[E(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":C(()=>[E(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":C(()=>[E(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":C(()=>[E(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[E(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[E(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[E(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),I(Ks),E(l.$slots,"layout-bottom",{},void 0,!0)],2)):(f(),N(h,{key:1}))}}}),Tc=$(Ac,[["__scopeId","data-v-7ac02370"]]),Mc={Layout:Tc,enhanceApp:({app:r})=>{r.component("Badge",Jr)}},zc={class:"lg-demo-block"},Ic={key:0,class:"lg-demo-title"},Nc={key:1,class:"lg-demo-error"},Pc={key:2,class:"lg-demo-loading"},$c=z({__name:"ComponentDemo",props:{name:{},title:{},height:{default:"220px"}},setup(r){const n=r,{isDark:t}=ii(),e=$n(null),i=Y(""),o=Object.assign({"../../../demos/area/basic.vue":()=>tt(()=>import("./basic.BPqrfo4-.js"),__vite__mapDeps([2,1])),"../../../demos/box/basic.vue":()=>tt(()=>import("./basic.B-zoXXbS.js"),__vite__mapDeps([3,1])),"../../../demos/button/basic.vue":()=>tt(()=>import("./basic.Bm9E4Cdp.js"),__vite__mapDeps([4,1])),"../../../demos/checkbox/basic.vue":()=>tt(()=>import("./basic.DiXG1mAY.js"),__vite__mapDeps([5,1])),"../../../demos/complex-list/basic.vue":()=>tt(()=>import("./basic.ClBGREY_.js"),__vite__mapDeps([6,1])),"../../../demos/console/basic.vue":()=>tt(()=>import("./basic.CbojscF6.js"),__vite__mapDeps([7,1])),"../../../demos/context-menu/basic.vue":()=>tt(()=>import("./basic.Db-HioNj.js"),__vite__mapDeps([8,1])),"../../../demos/dialog/basic.vue":()=>tt(()=>import("./basic.CN0yDhPk.js"),__vite__mapDeps([9,1])),"../../../demos/dragger/basic.vue":()=>tt(()=>import("./basic.CEYRVe2N.js"),__vite__mapDeps([10,1])),"../../../demos/line-editor/basic.vue":()=>tt(()=>import("./basic.B6USPduq.js"),__vite__mapDeps([11,1])),"../../../demos/list/basic.vue":()=>tt(()=>import("./basic.D8VHk0gq.js"),__vite__mapDeps([12,1])),"../../../demos/menu/basic.vue":()=>tt(()=>import("./basic.C1Zy1dUL.js"),__vite__mapDeps([13,1])),"../../../demos/panel/basic.vue":()=>tt(()=>import("./basic.CB-uqJJt.js"),__vite__mapDeps([14,1])),"../../../demos/searchbox/basic.vue":()=>tt(()=>import("./basic.DxmhBZbC.js"),__vite__mapDeps([15,1])),"../../../demos/slider/basic.vue":()=>tt(()=>import("./basic.CKpI8PV7.js"),__vite__mapDeps([16,1])),"../../../demos/split/basic.vue":()=>tt(()=>import("./basic.Cm2pAqlW.js"),__vite__mapDeps([17,1])),"../../../demos/table/basic.vue":()=>tt(()=>import("./basic.tjERq7T0.js"),__vite__mapDeps([18,1])),"../../../demos/tabs/basic.vue":()=>tt(()=>import("./basic.BTRvsrBO.js"),__vite__mapDeps([19,1])),"../../../demos/viewport/basic.vue":()=>tt(()=>import("./basic.C2WSwf0Q.js"),__vite__mapDeps([20,1]))});async function s(){const l=`../../../demos/${n.name}.vue`,d=o[l];if(!d){i.value=`未找到 demo：docs/demos/${n.name}.vue`;return}try{const h=await d();e.value=h.default}catch(h){i.value=h instanceof Error?h.message:String(h)}}function a(){typeof document>"u"||(document.documentElement.dataset.lgTheme=t.value?"dark":"light")}return Bt(()=>{a(),s()}),It(t,a),ir(l=>(i.value=l instanceof Error?l.message:String(l),!1)),(l,d)=>{const h=qt("ClientOnly");return f(),k("div",zc,[r.title?(f(),k("div",Ic,q(r.title),1)):M("",!0),S("div",{class:"lg-demo",style:Vn({minHeight:r.height})},[I(h,null,{default:C(()=>[e.value?(f(),N(yt(e.value),{key:0})):i.value?(f(),k("p",Nc,"示例加载失败："+q(i.value),1)):(f(),k("p",Pc,"示例加载中…"))]),_:1})],4)])}}}),Vc={class:"component-gallery"},Bc={class:"component-grid"},Dc=["href"],Oc=z({__name:"ComponentGallery",setup(r){const n=[{title:"布局",items:[{name:"Area",slug:"area",desc:"可分割、可拖拽的布局容器"},{name:"Box",slug:"box",desc:"极简 div 容器"},{name:"Panel",slug:"panel",desc:"带标题与关闭按钮的面板"},{name:"Split",slug:"split",desc:"固定比例分栏"},{name:"Tabs",slug:"tabs",desc:"标签页"}]},{title:"浮层",items:[{name:"Dialog",slug:"dialog",desc:"浮动 / 模态对话框"},{name:"Menu",slug:"menu",desc:"菜单栏与多级子菜单"},{name:"ContextMenu",slug:"context-menu",desc:"右键菜单"}]},{title:"表单",items:[{name:"Button",slug:"button",desc:"按钮"},{name:"Checkbox",slug:"checkbox",desc:"复选框"},{name:"Slider",slug:"slider",desc:"滑块"},{name:"SearchBox",slug:"searchbox",desc:"搜索输入框"},{name:"Dragger",slug:"dragger",desc:"可拖拽数值输入"},{name:"LineEditor",slug:"line-editor",desc:"曲线 / 关键点编辑器"}]},{title:"数据",items:[{name:"List",slug:"list",desc:"列表"},{name:"ComplexList",slug:"complex-list",desc:"带标题、勾选与删除的列表"},{name:"Table",slug:"table",desc:"数据表格"},{name:"Console",slug:"console",desc:"控制台输出"}]}];return(t,e)=>(f(),k("div",Vc,[(f(),k(K,null,rt(n,i=>S("section",{key:i.title,class:"component-group"},[S("h2",null,q(i.title),1),S("div",Bc,[(f(!0),k(K,null,rt(i.items,o=>(f(),k("a",{key:o.slug,class:"component-card",href:x(Te)(`/components/${o.slug}`)},[S("strong",null,q(o.name),1),S("span",null,q(o.desc),1)],8,Dc))),128))])])),64))]))}}),zi=`/* 由 scripts/build-elements-css.mjs 生成，请勿手改。 */
@charset "UTF-8";
/**** LiteArea ***/
.lg-area {
  vertical-align: top;
  position: relative;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
}

.lg-area__splitbar {
  background-color: #222;
  display: inline-block;
}

.lg-area__splitbar:hover {
  background-color: #888;
  transition: all 0.5s;
  transition-delay: 0.3s;
}

.lg-area__splitbar--horizontal {
  cursor: e-resize;
  width: 2px;
  height: 100%;
}

.lg-area__splitbar--vertical {
  cursor: n-resize;
  width: 100%;
  height: 2px;
}

button.lg-button__control {
  background: -webkit-linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  background: -moz-linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  background: linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  border: 0 none;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0 1px 0 #5b5957 inset, 0 -1px 0 black, 0 1px 0 black, -1px 0 0 black, 1px 0 0 black, 0 1px 1px #111111;
  color: #ccc;
  display: inline-block;
  margin: 2px;
  padding: 2px;
  text-shadow: 0 1px 1px black;
  vertical-align: top;
}

button.lg-button__control--flat {
  background: #32302d;
  box-shadow: 0 0 0 transparent;
  border: 0;
}

button.lg-button__control:hover:not(:disabled) {
  background: #aab !important;
}

button.lg-button__control:active:not(:disabled) {
  background: #fff !important;
}

button.lg-button__control:focus:not(:disabled) {
  outline: 1px solid #777;
}

button.lg-button__control:disabled {
  opacity: 0.5;
}

button.lg-button__control--close {
  background-size: 100% auto;
}

/**** LiteContextMenu ***/
.lg-context-menu {
  position: fixed;
  top: 100px;
  left: 100px;
  min-width: 100px;
  color: #aaf;
  padding: 0;
  box-shadow: 0 0 10px black !important;
  background-color: #2e2e2e !important;
}

.lg-context-menu .lg-context-menu__title img {
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 4px;
}

.lg-context-menu .lg-context-menu__item {
  margin: 2px;
  padding: 2px;
}

.lg-context-menu .lg-context-menu__item.lg-context-menu__item--has-submenu {
  background-color: #2e2e2e !important;
}

/**** LiteCheckbox ***/
.lg-checkbox {
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

.lg-checkbox--on {
  background-color: #5af;
  color: black;
}

.lg-checkbox__flag {
  display: block;
  width: 100%;
  height: 100%;
  border: 2px solid black;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
}

/**** LiteDialog ***/
.lg-dialog {
  position: absolute;
  z-index: 10;
  background-color: #444;
  background-image: linear-gradient(top, #444444, #333333);
  color: #888;
  box-sizing: border-box;
  overflow: hidden;
}

.lg-dialog .lg-dialog__header {
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

.lg-dialog .lg-dialog__header button {
  margin-top: 0;
  background-image: none;
  border: 0;
  box-shadow: 0 0 0 transparent;
  background-color: #333;
}

.lg-dialog--alert {
  font-size: 1.6em;
}

.lg-dialog.ui-draggable .lg-dialog__header {
  cursor: move;
}

.lg-dialog .lg-dialog__footer {
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

.lg-dialog .lg-dialog__footer--resizable {
  cursor: s-resize;
}

.lg-dialog .lg-dialog__resize-handle {
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

.lg-dialog .lg-dialog__footer button {
  font-size: inherit;
  padding: 0.1em 0.6em;
}

.lg-dialog .lg-dialog__buttons {
  position: absolute;
  top: 2px;
  right: 2px;
}

.lg-dialog .lg-dialog__content p {
  padding: 0.2em;
  margin: 0.2em;
}

/**** LiteComplexList ***/
/********************/
.lg-complex-list {
  background-color: black;
  padding: 4px;
  overflow: auto;
}

.lg-complex-list__item {
  border-radius: 2px;
  margin: 2px;
  padding: 2px;
  background-color: #2a2a2a;
  cursor: pointer;
  line-height: 2em;
}

.lg-complex-list__item:hover {
  background-color: #363636;
}

.lg-complex-list__item.lg-is-selected {
  background-color: #354a5f;
}

.lg-complex-list__title {
  margin: 4px;
  margin-top: 10px;
  font-size: 1.2em;
  color: #aaa;
}

.lg-complex-list__item .lg-complex-list__item-title {
  color: #8e96a7;
  width: calc(100% - 60px);
  display: inline-block;
  padding-left: 10px;
  font-size: 1.2em;
  vertical-align: middle;
}

.lg-complex-list__item .lg-complex-list__tick {
  cursor: pointer;
  text-align: center;
  width: 24px;
  height: 24px;
  display: inline-block;
  margin: 4px;
  color: #afa;
  vertical-align: top;
  background-color: black;
  border-radius: 2px;
}

.lg-complex-list__item .lg-complex-list__tick span {
  transform: translate(0, 0px);
  display: inline-block;
}

.lg-complex-list__item:not(.lg-is-enabled) .lg-complex-list__tick {
  color: black;
}

.lg-complex-list__item button {
  border: 0;
  background-color: #363636;
  border-radius: 4px;
  color: #9c9c9c;
  vertical-align: middle;
  margin-bottom: 0;
}

.lg-complex-list__text {
  cursor: pointer;
  text-align: center;
}

/**** LiteConsole ***/
.lg-console {
  width: 100%;
  height: 100%;
  background-color: black;
  border: 1px solid #222;
}

.lg-console__log {
  width: 100%;
  height: calc(100% - 26px);
  overflow: auto;
  color: #aaa;
  padding: 4px;
}

.lg-console__message {
  white-space: pre-wrap;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.lg-console__message--me {
  color: white;
}

.lg-console__message--log {
  color: #aaa;
}

.lg-console__message--warn {
  color: #ffa;
}

.lg-console__message--error {
  color: #faa;
}

.lg-console__message--good {
  color: #afa;
}

.lg-console__footer {
  width: 100%;
  height: 24px;
  color: #111;
}

.lg-console__footer input {
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

.lg-console__footer input:focus {
  outline: none;
}

/* HeaderBar — application top bar and editor area headers.
 * BEM: .lg-header-bar, --topbar/--area, __left/__center/__right/__title/__button/__tab
 */
.lg-header-bar {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 0;
  height: var(--lg-header-height, 30px);
  padding: 0 4px;
  background: var(--lg-color-bg);
  border-bottom: 1px solid var(--lg-color-border);
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  overflow: hidden;
  user-select: none;
}

.lg-header-bar--topbar {
  height: 32px;
  padding: 0;
  background: var(--lg-color-bg);
}

.lg-header-bar--area {
  height: 30px;
  padding: 0 4px;
  background: var(--lg-color-header);
}

.lg-header-bar__left, .lg-header-bar__center, .lg-header-bar__right {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
}

.lg-header-bar__left {
  flex: 0 0 auto;
}

.lg-header-bar__center {
  flex: 1 1 auto;
  overflow: hidden;
}

.lg-header-bar__right {
  flex: 0 0 auto;
  margin-left: auto;
  gap: 3px;
  padding-right: 4px;
}

.lg-header-bar__text {
  white-space: nowrap;
}

.lg-header-bar__brand {
  display: grid;
  place-items: center;
  width: 42px;
  height: 32px;
  flex: 0 0 42px;
  color: var(--lg-color-text-strong);
}

.lg-header-bar__brand svg {
  width: 18px;
  height: 18px;
}

.lg-header-bar__title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 4px;
  color: var(--lg-color-text-muted);
  white-space: nowrap;
  flex: 0 0 auto;
}

.lg-header-bar__title-text {
  color: var(--lg-color-text);
}

.lg-header-bar__icon {
  display: inline-grid;
  place-items: center;
  width: 15px;
  height: 15px;
  color: var(--lg-color-text-muted);
}

.lg-header-bar__icon svg {
  width: 15px;
  height: 15px;
  display: block;
}

.lg-header-bar__spacer {
  flex: 1 1 auto;
  min-width: 8px;
}

.lg-header-bar__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--lg-color-accent);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.65);
  flex: 0 0 6px;
}

.lg-header-bar__tabs {
  display: flex;
  align-items: stretch;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

.lg-header-bar__tab {
  height: 100%;
  padding: 0 7px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--lg-color-text-muted);
  font-family: var(--lg-font);
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  flex: 0 0 auto;
}

.lg-header-bar__tab:hover {
  background: var(--lg-color-header-2);
  color: var(--lg-color-text);
}

.lg-header-bar__tab--active {
  background: var(--lg-color-bg-alt);
  border-bottom-color: var(--lg-color-accent);
  color: var(--lg-color-text-strong);
}

.lg-header-bar__button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 5px;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  white-space: nowrap;
  cursor: pointer;
  flex: 0 0 auto;
}

.lg-header-bar__button:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
}

.lg-header-bar__button--active, .lg-header-bar__button.active {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.lg-header-bar__icon-button {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: var(--lg-color-text);
  cursor: pointer;
  flex: 0 0 auto;
}

.lg-header-bar__icon-button:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
}

.lg-header-bar__icon-button--active, .lg-header-bar__icon-button.active {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.lg-header-bar__icon-button svg {
  width: 13px;
  height: 13px;
  display: block;
}

/* ImageEditor — image canvas with pan, zoom, fit and 1:1.
 * BEM: .lg-image-editor, __header/__title/__subtitle/__zoom/__btn/__viewport/__stage/__image/__empty
 */
.lg-image-editor {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background: #1a1a1a;
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  overflow: hidden;
}

.lg-image-editor__header {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  min-height: 30px;
  padding: 0 6px;
  background: var(--lg-color-header);
  border-bottom: 1px solid var(--lg-color-border);
}

.lg-image-editor__title {
  color: var(--lg-color-text);
  white-space: nowrap;
}

.lg-image-editor__subtitle {
  color: var(--lg-color-text-muted);
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lg-image-editor__spacer {
  flex: 1 1 auto;
}

.lg-image-editor__btn {
  height: 22px;
  min-width: 24px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  cursor: pointer;
}

.lg-image-editor__btn:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
}

.lg-image-editor__zoom {
  min-width: 44px;
  text-align: center;
  color: var(--lg-color-text);
  font-size: 11px;
}

.lg-image-editor__viewport {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
  background-color: #2a2a2a;
  background-image: linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%);
  background-size: 18px 18px;
  background-position: 0 0, 0 9px, 9px -9px, -9px 0;
  cursor: grab;
  touch-action: none;
}

.lg-image-editor:not(.lg-image-editor--checkerboard) .lg-image-editor__viewport {
  background-image: none;
  background-color: #232323;
}

.lg-image-editor__viewport--dragging {
  cursor: grabbing;
}

.lg-image-editor__stage {
  transform-origin: center center;
  will-change: transform;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.lg-image-editor__image {
  display: block;
  max-width: none;
  max-height: none;
  border: 1px solid #3d3d3d;
  image-rendering: auto;
  user-select: none;
  -webkit-user-drag: none;
}

.lg-image-editor__image:not(.lg-image-editor__image--loaded) {
  display: none;
}

.lg-image-editor__empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #777;
  font-size: 12px;
  pointer-events: none;
}

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

.inspector .wtitle, .inspector .wsectiontitle {
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
  color: #bbc;
  font-size: 1.2em;
}

.inspector .wsectioncontent {
  padding: 4px 4px;
  background-color: #3a3a3a;
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

.inspector .wcontent .inputfield input:focus, .inspector .wcontent .inputfield textarea:focus {
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

.inspector .inputfield.disabled input, .inspector .inputfield.disabled textarea {
  color: #aaa;
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

.inspector .wcontent input, .inspector .wcontent textarea {
  color: #5af;
  border: 0;
  background-color: transparent;
}

.inspector .wcontent input:focus, .inspector .wcontent textarea:focus {
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
  background-color: #5af;
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
  color: #5af;
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
  background: -webkit-linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  background: -moz-linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  background: linear-gradient(#32302d, #4b4947) repeat scroll 0 0 transparent;
  border: 0 none;
  border-radius: 2px 2px 2px 2px;
  box-shadow: 0 1px 0 #5b5957 inset, 0 -1px 0 black, 0 1px 0 black, -1px 0 0 black, 1px 0 0 black, 0 1px 1px #111111;
  color: #ccc;
  display: inline-block;
  margin: 0 4px 0 0;
  padding: 0;
  text-shadow: 0 1px 1px black;
  vertical-align: top;
  width: -moz-calc(100% - 6px);
  width: -webkit-calc(100% - 6px);
  width: calc(100% - 6px);
}

.inspector .widget.big button, .lg-panel button.big {
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
  color: #5af;
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
  color: #5af;
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
  color: #88c;
}

button.wcombobutton {
  width: auto !important;
  margin: 0 2px !important;
  padding: 2px 4px 2px 4px !important;
  border-radius: 0 !important;
}

button.wcombobutton.selected {
  background: #aaa;
}

.inspector .wtag {
  display: inline-block;
  border-radius: 2px;
  padding: 2px;
  margin: 1px;
  background-color: #aaf;
  color: black;
}

.inspector .wtag .close {
  display: inline-block;
  background-color: #222;
  color: #aaf;
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

.inspector .row-index, .inspector .row-cell, .inspector .row-trash {
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

/* legacy inspector widgets (moved from widgets.scss) */
.widget .wcontent .inputfield {
  display: flex;
  height: 100%;
  align-items: center;
}

.slider-container {
  padding: 0 2px;
  flex: 1;
}

.lg-slider {
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

/* litepad (moved from style.scss) */
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
  border: 2px solid #aaf;
  border-radius: 10px;
  top: 0;
  left: 0;
  pointer-events: none;
}

/**** LiteList ***/
ul.lg-list {
  height: 100%;
  width: 100%;
  background-color: #111;
  margin: 0;
  padding: 0;
}

ul.lg-list li {
  margin: 0;
  padding: 2px;
  padding-left: 10px;
  list-style-type: none;
  cursor: pointer;
}

ul.lg-list li:hover {
  background-color: #333;
}

ul.lg-list li.lg-is-selected {
  color: #eee;
  background-color: #48a;
}

ul.lg-list li.lg-is-selected {
  position: relative;
  background: #88b7d5;
  border: 1px solid #c2e1f5;
}

ul.lg-list li.lg-is-selected:after, ul.lg-list li.lg-is-selected:before {
  left: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

ul.lg-list li.lg-is-selected:after {
  border-color: rgba(136, 183, 213, 0);
  border-left-color: #88b7d5;
  border-width: 10px;
  top: 50%;
  margin-top: -10px;
}

ul.lg-list li.lg-is-selected:before {
  border-color: rgba(194, 225, 245, 0);
  border-left-color: #c2e1f5;
  border-width: 11px;
  top: 50%;
  margin-top: -11px;
}

.lg-menu__list {
  font-family: Tahoma, sans-serif;
  margin: 0;
  padding: 2px 0;
  height: 2em;
  display: flex;
  align-items: center;
  background-color: #232323;
}

.lg-menu__item {
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

.lg-menu__item:hover {
  color: #eee;
  background-color: #343740;
}

.lg-menu__panel {
  /* 用视口坐标定位，菜单面板由 getRoot() 挂载，避免受 offsetParent 影响 */
  position: fixed;
  z-index: 10;
  min-width: 200px;
  padding: 4px 0;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 3px black;
  background-color: #212121;
}

.lg-menu__panel-item {
  font-size: 14px;
  color: #aaa;
  padding: 0 12px;
  /* 平直深色下拉：条目铺满整行，hover 不内缩（与 Blender 菜单一致） */
  margin: 0;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.lg-menu__panel-item .lg-menu__icon {
  display: inline-block;
  flex: 0 0 auto;
  width: 12px;
  height: 12px;
  margin: 0;
  vertical-align: top;
}

/* 没有图标（也没有勾选标记）时不要占位，让文字和 Blender 一样靠左 */
.lg-menu__panel-item .lg-menu__icon:empty {
  display: none;
}

.lg-menu__panel-item .lg-menu__name {
  flex: 1;
}

.lg-menu__panel-item .lg-menu__shortcut {
  flex: 0 0 auto;
  margin-left: 16px;
  color: var(--lg-color-text-muted);
  font-size: 11px;
  letter-spacing: 0.02em;
  opacity: 0.9;
}

.lg-menu__panel-item:hover .lg-menu__shortcut {
  color: #fff;
  opacity: 1;
}

.lg-menu__panel-item--checked .lg-menu__icon {
  background-color: #aaf;
}

.lg-menu__panel-item .lg-menu__more {
  flex: 0 0 auto;
  margin-left: auto;
  padding-right: 5px;
}

.lg-menu__panel-item--disabled {
  opacity: 0.5;
  cursor: default;
}

.lg-menu__panel-item--separator {
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

.lg-menu__panel-item--has-submenu {
  border-right: 2px solid cyan;
}

.lg-context-menu__title {
  color: #dde;
  background-color: #111;
  margin: 0;
  padding: 2px;
  cursor: default;
}

.lg-menu__panel-item:hover:not(.lg-menu__panel-item--disabled):not(.lg-menu__panel-item--separator) {
  background-color: #555;
  color: #eee;
}

/* NodeEditor — node graph canvas with draggable nodes and links.
 * BEM: .lg-node-editor, __canvas/__links/__nodes/__node/__port/__link/__hint
 */
.lg-node-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background: #2b2b2b;
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  overflow: hidden;
  outline: 0;
  user-select: none;
}

.lg-node-editor__canvas {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  background-color: #2b2b2b;
  background-image: linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 80px 80px, 80px 80px, 20px 20px, 20px 20px;
  cursor: default;
  touch-action: none;
}

.lg-node-editor__links {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.lg-node-editor__link {
  fill: none;
  stroke: #a8b4c4;
  stroke-width: 1.5;
  stroke-linecap: round;
  opacity: 0.85;
  pointer-events: none;
}

.lg-node-editor__link--temp {
  stroke: var(--lg-color-accent);
  stroke-dasharray: 5 4;
  opacity: 0.9;
}

.lg-node-editor__nodes {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.lg-node-editor__node {
  position: absolute;
  width: 172px;
  background: #2e2e2e;
  border: 1px solid #1b1b1b;
  border-radius: 4px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.42);
  overflow: hidden;
  cursor: default;
}

.lg-node-editor__node--selected {
  border-color: #f0a030;
  box-shadow: 0 0 0 1px #f0a030, 0 4px 16px rgba(0, 0, 0, 0.5);
}

.lg-node-editor__node-header {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  background: var(--lg-node-color, #5b7d5b);
  color: #f2f2f2;
  cursor: grab;
}

.lg-node-editor__node-header:active {
  cursor: grabbing;
}

.lg-node-editor__node-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.lg-node-editor__node-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  flex: 0 0 7px;
}

.lg-node-editor__node-body {
  padding: 6px;
  background: #2e2e2e;
}

.lg-node-editor__ports {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.lg-node-editor__port-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.lg-node-editor__port-col--output {
  align-items: flex-end;
}

.lg-node-editor__port {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 18px;
  min-width: 0;
  color: #c8c8c8;
  cursor: crosshair;
}

.lg-node-editor__port-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 92px;
  font-size: 11px;
}

.lg-node-editor__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3d3d3d;
  border: 1px solid #c8c8c8;
  flex: 0 0 8px;
  transition: background 0.1s ease;
}

.lg-node-editor__port:hover .lg-node-editor__dot, .lg-node-editor__port--linked .lg-node-editor__dot {
  background: var(--lg-color-accent);
  border-color: #dce6f5;
}

.lg-node-editor__hint {
  position: absolute;
  right: 10px;
  bottom: 8px;
  z-index: 3;
  color: #8e8e8e;
  font-size: 10px;
  pointer-events: none;
  text-shadow: 0 1px 1px #000;
}

/**** LitePanel ***/
.lg-panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #444;
  background-image: linear-gradient(top, #444444, #333333);
  color: #888;
  overflow: hidden;
}

.lg-panel .lg-panel__header {
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

.lg-panel .lg-panel__header button {
  margin-top: 0;
  background-image: none;
  border: 0;
  box-shadow: 0 0 0 transparent;
  background-color: #333;
}

.lg-panel .lg-panel__content {
  height: calc(100% - 20px);
  overflow-y: auto;
}

.lg-panel .lg-panel__footer {
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

/**** LiteSearchBox ***/
.lg-searchbox {
  padding: 2px;
  opacity: 0.5;
  transition: all 0.5s;
  width: 100%;
}

.lg-searchbox__input {
  padding: 2px 4px;
  outline: 0;
  width: 100%;
}

.lg-searchbox__input:focus {
  outline: 0;
}

.lg-searchbox:hover {
  opacity: 1;
}

/**** LiteSlider ***/
.lg-slider {
  display: inline-block;
  position: relative;
  width: calc(100% - 50px);
  height: 1.2em;
  cursor: pointer;
}

.lg-slider__value {
  width: 42px;
  padding-left: 5px;
}

/**** LiteSplit ***/
.lg-split {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.lg-split .lg-split__section {
  display: inline-block;
  vertical-align: top;
  margin: 0;
  padding: 0;
  height: 100%;
}

/* StatusBar — bottom status line.
 * BEM: .lg-status-bar, __left/__right/__item/__accent
 */
.lg-status-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 26px;
  min-height: 26px;
  padding: 0 8px;
  background: var(--lg-color-bg);
  border-top: 1px solid var(--lg-color-border);
  color: var(--lg-color-text-muted);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  overflow: hidden;
  user-select: none;
}

.lg-status-bar__left {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-status-bar__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
  white-space: nowrap;
}

.lg-status-bar__item {
  color: var(--lg-color-text-muted);
}

.lg-status-bar__accent {
  color: var(--lg-color-accent-hover, var(--lg-color-accent));
}

table.lg-table {
  width: 100%;
  height: 100%;
  display: block;
}

table.lg-table tr {
  display: block;
  width: 100%;
}

table.lg-table th, table.lg-table td {
  display: inline-block;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

table.lg-table th {
  color: #6c7ba7;
  background: #272a30;
  font-weight: bold;
  /*
     background: -webkit-linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
     background: -moz-linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
     background: linear-gradient(#4B4947,#32302D) repeat scroll 0 0 transparent;
  */
}

table.lg-table td {
  padding: 2px 4px;
}

table.lg-table tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.1);
}

.lg-tabs {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.lg-tabs--vertical {
  height: 100%;
}

.lg-tabs .lg-tabs__list {
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

.lg-tabs--vertical > .lg-tabs__list {
  vertical-align: top;
  padding-left: 0;
  border-bottom: 0;
  height: 100%;
  display: inline-block;
}

.lg-tabs .lg-tabs__tab {
  color: #aaa;
  text-align: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  transition: all 0.3s;
}

.lg-tabs .lg-tabs__tab .lg-tabs__tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-tabs--horizontal > .lg-tabs__list > .lg-tabs__tab {
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

.lg-tabs--vertical > .lg-tabs__list > .lg-tabs__tab {
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

.lg-tabs--vertical > .lg-tabs__list > .lg-tabs__tab .lg-tabs__tab-icon {
  opacity: 0.5;
}

.lg-tabs .lg-tabs__tab--autoswitch * {
  pointer-events: none;
}

.lg-tabs .lg-tabs__tab--selected {
  color: #eee !important;
  background-color: #777;
  /*border: 1px solid #888;*/
  border-bottom: 0;
  /*box-shadow: 0 -2px 2px rgba(0,0,0,0.5);*/
}

.lg-tabs .lg-tabs__tab--button {
  color: #eee;
  background-color: #333;
  border-bottom: 2px;
}

.lg-tabs .lg-tabs__tab:hover:not(.lg-tabs__tab--selected) {
  background-color: #555;
  color: #ddd;
}

.lg-tabs .lg-tabs__tab--selected .lg-tabs__tab-icon, .lg-tabs .lg-tabs__tab:hover .lg-tabs__tab-icon {
  opacity: 1;
}

.lg-tabs--vertical > .lg-tabs__list > .lg-tabs__tab .lg-tabs__tab-title {
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  text-align: center;
  overflow: hidden;
}

.lg-tabs .lg-tabs__list .lg-tabs__tab .lg-tabs__tab-close {
  margin-left: 6px;
  margin-right: -6px;
  border-radius: 2px;
  opacity: 0.2;
  transition: all 0.3s;
  padding: 2px;
}

.lg-tabs .lg-tabs__list .lg-tabs__tab:hover .lg-tabs__tab-close {
  opacity: 0.5;
}

.lg-tabs .lg-tabs__list .lg-tabs__tab .lg-tabs__tab-close:hover {
  color: white;
  background-color: #333;
  opacity: 1;
}

.lg-tabs .lg-tabs__panel {
  position: relative;
  background-color: #333;
  display: inline-block;
}

.lg-tabs--horizontal > .lg-tabs__panel {
  padding-left: 2px;
  padding-right: 2px;
}

.lg-tabs--vertical > .lg-tabs__panel {
  padding: 0;
  height: 100%;
}

/* TextEditor — text/code editor with line numbers, tabs and Ln/Col footer.
 * BEM: .lg-text-editor, __tabs/__tab/__body/__gutter/__textarea/__footer
 */
.lg-text-editor {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  height: 100%;
  background: #1e1e1e;
  color: #d8d8d8;
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  overflow: hidden;
}

.lg-text-editor__tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  min-height: 30px;
  padding: 0 6px;
  background: var(--lg-color-header);
  border-bottom: 1px solid var(--lg-color-border);
}

.lg-text-editor__tab {
  height: 24px;
  padding: 0 10px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--lg-color-text-muted);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  cursor: pointer;
}

.lg-text-editor__tab:hover {
  color: var(--lg-color-text);
}

.lg-text-editor__tab--active {
  color: var(--lg-color-text-strong);
  border-bottom-color: var(--lg-color-accent);
}

.lg-text-editor__meta {
  margin-left: auto;
  padding: 0 4px;
  color: var(--lg-color-text-muted);
  font-size: 11px;
  white-space: nowrap;
}

.lg-text-editor__body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  background: #1e1e1e;
}

.lg-text-editor__gutter {
  width: 46px;
  flex: 0 0 46px;
  padding: 8px 8px 8px 0;
  text-align: right;
  color: #5a5a5a;
  background: #252525;
  border-right: 1px solid #333;
  font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  white-space: pre;
  overflow: hidden;
  user-select: none;
}

.lg-text-editor__textarea {
  flex: 1 1 auto;
  min-width: 0;
  padding: 8px 12px;
  border: 0;
  outline: 0;
  resize: none;
  background: #1e1e1e;
  color: #d8d8d8;
  font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  tab-size: 4;
  white-space: pre;
  overflow: auto;
  user-select: text;
}

.lg-text-editor__textarea::selection {
  background: rgba(71, 114, 179, 0.55);
}

.lg-text-editor__footer {
  display: flex;
  align-items: center;
  height: 24px;
  min-height: 24px;
  padding: 0 8px;
  background: #252525;
  border-top: 1px solid #333;
  color: #8a8a8a;
  font-size: 11px;
}

.lg-text-editor__status {
  color: #b8b8b8;
}

/* Timeline — ruler, playhead, keyframes and playback controls.
 * BEM: .lg-timeline, __header/__menus/__controls/__icon-btn/__frame-box/__body/__canvas
 */
.lg-timeline {
  --lg-timeline-bg: var(--lg-color-bg-alt, #282828);
  --lg-timeline-ruler: #1d1d1d;
  --lg-timeline-line: #3d3d3d;
  --lg-timeline-text: #9a9a9a;
  --lg-timeline-key: #d8b04a;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--lg-color-bg);
  border-top: 1px solid var(--lg-color-border);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  color: var(--lg-color-text);
  user-select: none;
}

.lg-timeline__header {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  min-height: 30px;
  padding: 0 4px;
  background: var(--lg-color-header);
  border-bottom: 1px solid var(--lg-color-border);
  overflow: hidden;
}

.lg-timeline__menus {
  display: flex;
  align-items: center;
  gap: 1px;
  flex: 0 0 auto;
}

.lg-timeline__menu {
  height: 22px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  white-space: nowrap;
  cursor: pointer;
}

.lg-timeline__menu:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
}

.lg-timeline__menu.active {
  background: var(--lg-color-header-2);
}

.lg-timeline__spacer {
  flex: 1 1 auto;
  min-width: 6px;
}

.lg-timeline__controls {
  display: flex;
  align-items: center;
  gap: 1px;
  flex: 0 1 auto;
  min-width: 0;
}

.lg-timeline__icon-btn {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: var(--lg-color-text);
  cursor: pointer;
  flex: 0 0 auto;
}

.lg-timeline__icon-btn:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
}

.lg-timeline__icon-btn--active {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.lg-timeline__icon-btn svg {
  width: 11px;
  height: 11px;
  display: block;
}

.lg-timeline__frame-box {
  display: inline-flex;
  align-items: center;
  height: 22px;
  margin: 0 2px;
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius, 2px);
  background: #1d1d1d;
  overflow: hidden;
  flex: 0 0 auto;
}

.lg-timeline__number {
  width: 42px;
  height: 100%;
  padding: 0 2px;
  border: 0;
  outline: 0;
  background: #1d1d1d;
  color: #e6e6e6;
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  text-align: center;
  appearance: textfield;
  -moz-appearance: textfield;
}

.lg-timeline__number::-webkit-inner-spin-button, .lg-timeline__number::-webkit-outer-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

.lg-timeline__label {
  display: grid;
  place-items: center;
  height: 100%;
  padding: 0 3px;
  border-left: 1px solid var(--lg-color-border);
  color: var(--lg-color-text-muted);
  font-size: 10px;
  cursor: ew-resize;
}

.lg-timeline__body {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  background: var(--lg-timeline-bg);
}

.lg-timeline__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  cursor: ew-resize;
  touch-action: none;
}

/* Toolbar — vertical/horizontal tool strip.
 * BEM: .lg-toolbar, --vertical/--horizontal, __tools/__tool/__tool--active/__icon
 */
.lg-toolbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 34px;
  padding: 2px;
  background: var(--lg-color-header);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius, 2px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
  user-select: none;
}

.lg-toolbar--horizontal {
  flex-direction: row;
  width: auto;
  height: 34px;
}

.lg-toolbar__title {
  width: 100%;
  height: 20px;
  display: grid;
  place-items: center;
  color: var(--lg-color-text-muted);
  font-family: var(--lg-font);
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
}

.lg-toolbar__tools {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.lg-toolbar--horizontal .lg-toolbar__tools {
  flex-direction: row;
  width: auto;
}

.lg-toolbar__tool {
  position: relative;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: var(--lg-radius, 2px);
  background: transparent;
  color: #c8c8c8;
  cursor: pointer;
}

.lg-toolbar--horizontal .lg-toolbar__tool {
  width: 30px;
  height: 30px;
}

.lg-toolbar__tool:hover {
  background: var(--lg-color-header-2);
  color: var(--lg-color-text-strong);
}

.lg-toolbar__tool--active {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.lg-toolbar__tool--active:hover {
  background: var(--lg-color-accent-hover, var(--lg-color-accent));
}

.lg-toolbar__icon {
  display: grid;
  place-items: center;
  width: 15px;
  height: 15px;
}

.lg-toolbar__icon svg {
  width: 15px;
  height: 15px;
  display: block;
}

.lg-toolbar__shortcut {
  display: none;
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
  color: #aaa;
  min-width: 100px;
  white-space: nowrap;
}

li.ltreeitem div.ltreeitemtitle .incontent:hover {
  color: white;
}

li.ltreeitem.selected div.ltreeitemtitle .incontent {
  color: #ec6;
}

li.ltreeitem.semiselected div.ltreeitemtitle .incontent {
  color: #a96;
}

li.ltreeitem div.ltreeitemtitle.dragover .incontent {
  background-color: #ec6;
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

li.ltreeitem.hidden, li.ltreeitem.filtered {
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
  color: #79a;
}

.listbox.empty {
  margin-left: 2px;
  width: 0.4em;
  height: 0.4em;
  color: #36a;
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

/* Viewport — 3D scene canvas with orbit / pan / zoom and object picking.
 * BEM: .lg-viewport, __canvas/__info/__muted
 *
 * The canvas paints itself; these custom properties are read by the component
 * at draw time so themes can restyle the 3D scene without touching TS.
 */
.lg-viewport {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--lg-viewport-bg);
  outline: 0;
  user-select: none;
}

.lg-viewport__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  outline: 0;
  cursor: default;
}

.lg-viewport__info {
  position: absolute;
  top: 8px;
  left: 12px;
  z-index: 2;
  color: var(--lg-viewport-info-color);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm, 12px);
  line-height: 1.35;
  pointer-events: none;
}

.lg-viewport:focus-visible, .lg-viewport__canvas:focus-visible {
  outline: 1px solid var(--lg-color-accent);
  outline-offset: -1px;
}

.lg-viewport__muted {
  color: var(--lg-viewport-info-muted);
  font-size: 11px;
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
  border: 1px solid #eee;
}

ul.file-list li.file-item:hover button {
  display: block;
}

ul.file-list li.file-item:hover {
  color: white;
  background-color: #888;
}

ul.file-list li.file-item.selected {
  outline: 1px dashed #eee;
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

/* Here goes all the CSS related to layout the web (panels, windows, bars, etc) */
div {
  margin: 0;
  padding: 0;
}

.lg-app__wrap {
  width: 1000px;
  height: 600px;
  margin: auto;
  background-color: #333;
}

.lg-app__wrap.lg-app--fullscreen {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lg-app__main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #181818;
}

.lg-modal-backdrop {
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
article, aside, details, figcaption, figure, footer, header, hgroup, nav, section, summary {
  display: block;
}

/*
 * Corrects \`inline-block\` display not defined in IE 8/9.
 */
audio, canvas, video {
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

/*
 * Removes default margin.
 */

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
a:active, a:hover {
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
b, strong {
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
code, kbd, pre, samp {
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
  quotes: "“" "”" "‘" "’";
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
sub, sup {
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
button, input, select, textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 2 */
  margin: 0; /* 3 */
}

/*
 * Addresses Firefox 4+ setting \`line-height\` on \`input\` using \`!important\` in
 * the UA stylesheet.
 */
button, input {
  line-height: normal;
}

/*
 * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native \`audio\`
 *    and \`video\` controls.
 * 2. Corrects inability to style clickable \`input\` types in iOS.
 * 3. Improves usability and consistency of cursor style between image-type
 *    \`input\` and others.
 */
button, input[type=reset], input[type=submit] {
  -webkit-appearance: button; /* 2 */
  cursor: pointer; /* 3 */
}

/*
 * Re-set default cursor for disabled elements.
 */
button[disabled], input[disabled] {
  cursor: default;
}

/*
 * 1. Addresses box sizing set to \`content-box\` in IE 8/9.
 * 2. Removes excess padding in IE 8/9.
 */
input[type=checkbox], input[type=radio] {
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
input[type=search]::-webkit-search-cancel-button, input[type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
 * Removes inner padding and border in Firefox 4+.
 */
button::-moz-focus-inner, input::-moz-focus-inner {
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

/****** litegui css/style.css */
*, *:before, *:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/* Here goes the css related to look and feel (buttons, lists, titles) */

h1, h2, h3 {
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
  background-color: #3d3d3d;
}

.lg-dialog .lg-dialog__content button.lg-button__control {
  vertical-align: initial;
}

.lg-dialog button.lg-button__control--mini {
  margin: 2px 2px 0 0;
  line-height: 0;
  padding: 0;
  width: 1.1em;
  height: 1.1em;
  box-shadow: 0 0 0;
  border: 1px solid #222;
}

input {
  color: #55aaff;
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
  color: #55aaff;
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
  background-color: #33ff99;
  opacity: 1;
}

.ellipsis {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* LiteGUI theme tokens
 * Dark is the default. Set data-lg-theme="light" on <html> for the light theme.
 */
/* 基础 token 的兜底值，与 blender.scss 保持一致。
 * blender.scss 在其后加载，会补充组件级 token 并覆盖同名值。
 */

/* Blender Light（scripts/presets/interface_theme/Blender_Light.xml） */

.lg-app__wrap, .lg-app__main {
  background-color: var(--lg-color-bg);
}

.lg-panel, .lg-dialog {
  background-color: var(--lg-color-panel);
  background-image: none;
  color: var(--lg-color-text);
}

.lg-panel .lg-panel__header, .lg-dialog .lg-dialog__header {
  background-color: var(--lg-color-header);
  background-image: none;
  color: var(--lg-color-text-strong);
}

.lg-panel .lg-panel__header button, .lg-dialog .lg-dialog__header button {
  background-color: var(--lg-color-header-2);
  color: var(--lg-color-text-strong);
}

.lg-panel .lg-panel__footer, .lg-dialog .lg-dialog__footer {
  color: var(--lg-color-text-muted);
}

button.lg-button__control {
  background: var(--lg-color-button);
  border-radius: var(--lg-radius);
  color: var(--lg-color-button-text);
  text-shadow: none;
}

button.lg-button__control:hover:not(:disabled), button.lg-button__control:active:not(:disabled) {
  background: var(--lg-color-button-hover) !important;
  color: var(--lg-color-text-strong);
}

button.lg-button__control:focus-visible {
  outline: 2px solid var(--lg-color-accent);
  outline-offset: 1px;
}

.lg-modal-backdrop {
  background-color: var(--lg-color-overlay);
}

.lg-slider {
  background-color: var(--lg-color-panel-2);
}

.lg-table th {
  color: var(--lg-color-accent);
  background: var(--lg-color-panel-2);
}

a {
  color: var(--lg-color-accent);
}

/* Blender-inspired default theme
 * 默认主题：Blender 4.5 的深色（Blender Dark）。
 * 浅色主题：data-lg-theme="light"，对齐面板预设 Blender_Light.xml
 * （wcol_regular / ThemeSpaceGeneric / ThemeView3D）。
 *
 * 尺寸按 Web 可读性放大：基础 13px、控件/行高 26px，不追求 Blender 的 11px 像素级密度。
 *
 * 选择器约定（重要）：
 * - 主题变量写在 :root 与 :root[data-lg-theme="light"]，保持全局；
 * - 组件样式使用不带 :root 前缀的普通选择器，方便文档站构建脚本给选择器加
 *   .lg-demo 作用域（scripts/build-demo-css.mjs 会丢弃/破坏 :root 祖先选择器）。
 * - 暗色是默认值，亮色只在 :root[data-lg-theme="light"] 下覆盖，互不污染。
 */
/* ==========================================================================
   1. Design Tokens
   ========================================================================== */

/* Blender Light（reference: scripts/presets/interface_theme/Blender_Light.xml）
 * 关键取值：ThemeSpaceGeneric back #6b6b6b / header #adadad；panel_back #cccccc；
 * wcol_regular outline #4d4d4d / inner #dbdbdb / inner_sel #668ccc；
 * wcol_menu_back inner #c0c0c0；wcol_menu_item inner_sel #5680c2e6；
 * wcol_tooltip inner #19191a / text #e6e6e6。
 */

/* ==========================================================================
   2. Base / typography baseline
   ========================================================================== */

/* 文档站的 .lg-demo 容器不会继承 body 字号，因此组件根节点显式给出 13px 基线。 */
.lg-app, .lg-app__wrap, .lg-app__main, .lg-area, .lg-box, .lg-panel, .lg-dialog, .lg-menu, .lg-tabs, .lg-list, .lg-table, .lg-console, .lg-complex-list, .lg-searchbox, .lg-checkbox, .lg-input, .lg-button, .lg-context-menu, .lg-dragger, .lg-slider, .inspector, .litetree {
  font-family: var(--lg-font);
  font-size: var(--lg-font-size);
  color: var(--lg-color-text);
}

.lg-app, .lg-app__wrap, .lg-app__main {
  background-color: var(--lg-color-bg);
}

/* ---------- scrollbars ---------- */
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: var(--lg-color-scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--lg-color-scrollbar-thumb);
  border-radius: 8px;
}

::-webkit-scrollbar-corner {
  background: var(--lg-color-scrollbar-track);
}

/* ==========================================================================
   3. Panels / dialogs
   ========================================================================== */
.lg-panel, .lg-dialog {
  background: var(--lg-color-panel);
  background-image: none;
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius);
  box-shadow: var(--lg-shadow-panel);
  color: var(--lg-color-text);
  box-sizing: border-box;
}

.lg-panel {
  display: flex;
  flex-direction: column;
}

/* 这里必须带上 .lg-panel/.lg-dialog 祖先，才能压过 layout.scss 里的
 * \`.lg-panel .lg-panel__header\` 等选择器（旧 footer 是 absolute，会撑破页面）。 */
.lg-panel .lg-panel__header, .lg-dialog .lg-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: var(--lg-header-height);
  padding: 0 8px;
  background: var(--lg-color-header);
  background-image: none;
  border-bottom: 1px solid var(--lg-color-border);
  color: var(--lg-color-text-strong);
  font-size: var(--lg-font-size);
  font-weight: 500;
  line-height: 1;
  box-sizing: border-box;
  user-select: none;
}

.lg-panel .lg-panel__title, .lg-dialog .lg-dialog__title {
  font-size: var(--lg-font-size);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--lg-color-text-strong);
}

.lg-panel .lg-panel__content, .lg-dialog .lg-dialog__content {
  background: var(--lg-color-panel);
  color: var(--lg-color-text);
  padding: 8px;
  box-sizing: border-box;
}

.lg-panel .lg-panel__content {
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
  overflow: auto;
}

.lg-panel .lg-panel__footer, .lg-dialog .lg-dialog__footer {
  background: var(--lg-color-header);
  border-top: 1px solid var(--lg-color-border);
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size-sm);
  min-height: var(--lg-row-height);
  box-sizing: border-box;
}

.lg-panel .lg-panel__footer {
  position: static;
  width: auto;
  margin: 0;
  padding: 3px 8px;
  flex: 0 0 auto;
  text-align: right;
}

/* 组件总会创建 footer；没有内容时不要留一条空操作栏。 */
.lg-panel .lg-panel__footer:empty, .lg-dialog .lg-dialog__footer:empty {
  display: none;
}

.lg-panel .lg-panel__header .lg-panel__close, .lg-dialog .lg-dialog__buttons .lg-button__control, .lg-dialog .lg-dialog__button, .lg-dialog .lg-dialog__button--close {
  width: 24px;
  height: 22px;
  min-height: 22px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  background: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text-muted);
  box-shadow: none;
  text-shadow: none;
}

.lg-panel .lg-panel__header .lg-panel__close:hover, .lg-dialog .lg-dialog__buttons .lg-button__control:hover, .lg-dialog .lg-dialog__button:hover {
  background: var(--lg-color-header-2);
  border-color: var(--lg-color-border);
  color: var(--lg-color-text-strong);
}

.lg-dialog {
  position: absolute;
  z-index: 10;
  min-width: 280px;
  max-width: calc(100vw - 24px);
}

.lg-dialog .lg-dialog__header {
  padding-right: 72px;
}

.lg-dialog .lg-dialog__buttons {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: 0;
}

.lg-dialog .lg-dialog__content {
  padding: 10px 12px 42px;
}

.lg-dialog .lg-dialog__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  margin: 0;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  text-align: right;
  background: var(--lg-color-panel);
  border-top: 1px solid var(--lg-color-border);
}

.lg-dialog__footer .lg-button__control {
  min-width: 72px;
}

.lg-dialog__footer--resizable {
  cursor: s-resize;
}

.lg-modal-backdrop {
  background-color: var(--lg-color-overlay);
}

/* ==========================================================================
   4. Buttons
   ========================================================================== */
.lg-button {
  display: inline-block;
  min-height: var(--lg-control-height);
  vertical-align: top;
}

button.lg-button__control {
  min-height: var(--lg-control-height);
  padding: 0 12px;
  background: var(--lg-color-button) !important;
  background-image: none !important;
  border: 1px solid var(--lg-color-border-strong);
  border-radius: var(--lg-radius);
  color: var(--lg-color-button-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size);
  line-height: 1;
  box-shadow: none !important;
  text-shadow: none !important;
  vertical-align: top;
}

button.lg-button__control:hover:not(:disabled) {
  background: var(--lg-color-button-hover) !important;
  border-color: var(--lg-color-accent);
  color: var(--lg-color-text-strong);
}

button.lg-button__control:active:not(:disabled), button.lg-button__control.active {
  background: var(--lg-color-accent) !important;
  border-color: var(--lg-color-accent);
  color: #fff !important;
}

button.lg-button__control:focus-visible {
  outline: 2px solid var(--lg-color-accent);
  outline-offset: 1px;
}

button.lg-button__control:disabled {
  opacity: 0.45;
}

button.lg-button__control.lg-button__control--mini {
  min-width: 22px;
  min-height: 20px;
  padding: 0 5px;
  font-size: var(--lg-font-size-sm);
}

button.lg-button__control.lg-button__control--close {
  background: transparent !important;
  border-color: transparent;
  min-width: 24px;
  padding: 0 6px;
}

.lg-button--small .lg-button__control, button.lg-button__control--small {
  min-height: 22px;
  padding: 0 8px;
  font-size: var(--lg-font-size-sm);
}

.lg-button--mini .lg-button__control {
  min-height: 20px;
  padding: 0 6px;
  font-size: var(--lg-font-size-sm);
}

/* ==========================================================================
   5. Inputs / checkbox / searchbox
   ========================================================================== */
.lg-input, .lg-searchbox {
  min-height: var(--lg-control-height);
  background: var(--lg-color-input-bg);
  border: 1px solid var(--lg-color-input-border);
  border-radius: var(--lg-radius);
  box-sizing: border-box;
}

.lg-input {
  display: inline-flex;
  align-items: center;
}

.lg-input__field, .lg-searchbox__input, input.lg-input__field {
  width: 100%;
  height: var(--lg-control-height);
  min-width: 0;
  padding: 0 8px;
  background: transparent;
  border: 0;
  color: var(--lg-color-input-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size);
  outline: 0;
  box-sizing: border-box;
}

.lg-input__field::placeholder, .lg-searchbox__input::placeholder {
  color: var(--lg-color-placeholder);
}

.lg-input:focus-within, .lg-searchbox:focus-within {
  border-color: var(--lg-color-accent);
  box-shadow: 0 0 0 1px var(--lg-color-focus-ring);
}

.lg-input.lg-is-disabled, .lg-input--disabled {
  opacity: 0.55;
}

.lg-searchbox {
  padding: 0;
  opacity: 1;
  transition: none;
}

.lg-searchbox:hover {
  opacity: 1;
}

.lg-dragger {
  display: inline-flex;
  align-items: center;
}

.lg-dragger__widget {
  width: 7px;
  min-width: 7px;
  align-self: stretch;
  background: var(--lg-color-header-2);
  cursor: n-resize;
}

/* Checkbox: .lg-checkbox--on 在 flag 上，而不是 root 上。 */
.lg-checkbox, .lg-checkbox.lg-input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  margin: 0 4px 0 0;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--lg-radius);
  box-shadow: none;
  line-height: 1;
  vertical-align: middle;
  cursor: pointer;
}

.lg-checkbox__flag {
  display: inline-grid;
  place-items: center;
  width: 16px;
  height: 16px;
  background: var(--lg-color-checkbox-bg);
  border: 1px solid var(--lg-color-checkbox-border);
  border-radius: var(--lg-radius-sm);
  color: #fff;
  box-sizing: border-box;
}

.lg-checkbox__flag.lg-checkbox--on {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
}

.lg-checkbox__flag.lg-checkbox--on::after {
  content: "";
  width: 3px;
  height: 7px;
  margin-top: -1px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.lg-checkbox:focus-visible {
  outline: 2px solid var(--lg-color-accent);
  outline-offset: 1px;
}

/* ==========================================================================
   6. Menus / context menus
   ========================================================================== */
.lg-menu {
  background: transparent;
}

.lg-menu__list {
  min-height: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin: 0;
  background: var(--lg-color-header);
  border-bottom: 1px solid var(--lg-color-border);
  font-family: var(--lg-font);
}

.lg-menu__item {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  min-width: 50px;
  color: var(--lg-color-text);
  font-size: var(--lg-font-size);
  border-radius: var(--lg-radius-sm);
}

.lg-menu__item:hover, .lg-menu__item.lg-menu__item--active {
  background: var(--lg-color-header-2);
  color: var(--lg-color-text-strong);
}

.lg-menu__panel {
  background: var(--lg-color-menu-bg);
  border: 1px solid var(--lg-color-menu-border);
  border-radius: var(--lg-radius);
  box-shadow: var(--lg-shadow-menu);
  padding: 4px 0;
  max-width: calc(100vw - 16px);
  min-width: 180px;
  color: var(--lg-color-menu-text);
}

.lg-menu__panel-item {
  height: var(--lg-row-height);
  min-height: var(--lg-row-height);
  margin: 0;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--lg-color-menu-text);
  font-size: var(--lg-font-size);
  border-radius: 0;
}

.lg-menu__panel-item:hover:not(.lg-menu__panel-item--disabled):not(.lg-menu__panel-item--separator), .lg-menu__panel-item.lg-menu__panel-item--active {
  background: var(--lg-color-menu-hover);
  color: #fff;
}

.lg-menu__panel-item.lg-menu__panel-item--disabled {
  opacity: 0.5;
}

.lg-menu__panel-item.lg-menu__panel-item--separator {
  height: 1px;
  min-height: 1px;
  margin: 4px 0;
  padding: 0;
  background: var(--lg-color-border);
  border: 0;
}

.lg-menu__panel-item.lg-menu__panel-item--has-submenu {
  border-right: 2px solid var(--lg-color-accent);
}

.lg-menu__panel-item--checked .lg-menu__icon {
  background-color: var(--lg-color-accent);
}

.lg-menu__icon {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
}

.lg-menu__name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-menu__more {
  flex: 0 0 auto;
  margin-left: auto;
  padding-right: 2px;
  color: var(--lg-color-text-muted);
}

.lg-context-menu {
  background-color: var(--lg-color-menu-bg) !important;
  border: 1px solid var(--lg-color-menu-border);
  border-radius: var(--lg-radius);
  box-shadow: var(--lg-shadow-menu) !important;
  color: var(--lg-color-menu-text);
  padding: 4px 0;
  max-width: calc(100vw - 16px);
}

.lg-context-menu__title {
  background: var(--lg-color-header);
  color: var(--lg-color-text-strong);
  padding: 4px 10px;
  border-bottom: 1px solid var(--lg-color-border);
}

.lg-context-menu__item {
  min-height: var(--lg-row-height);
  padding: 3px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--lg-color-menu-text);
  border-radius: 0;
}

.lg-context-menu__item:hover:not(.lg-context-menu__item--disabled):not(.lg-context-menu__item--separator) {
  background: var(--lg-color-menu-hover);
  color: #fff;
}

.lg-context-menu__item--separator {
  height: 1px;
  min-height: 1px;
  padding: 0;
  margin: 4px 0;
  background: var(--lg-color-border);
}

.lg-context-menu__item--disabled {
  opacity: 0.5;
}

/* ==========================================================================
   7. Tabs
   ========================================================================== */
.lg-tabs {
  background: var(--lg-color-panel);
}

.lg-tabs .lg-tabs__list {
  min-height: 30px;
  padding: 0 0 0 4px;
  background: var(--lg-color-header);
  border-bottom: 1px solid var(--lg-color-border);
}

.lg-tabs .lg-tabs__tab, .lg-tabs--horizontal > .lg-tabs__list > .lg-tabs__tab {
  height: 30px;
  min-height: 30px;
  min-width: 64px;
  margin: 0 2px 0 0;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size);
  border-right: 1px solid transparent;
  border-radius: var(--lg-radius-sm) var(--lg-radius-sm) 0 0;
  transition: none;
}

.lg-tabs .lg-tabs__tab:hover:not(.lg-tabs__tab--selected) {
  background: var(--lg-color-header-2);
  color: var(--lg-color-text);
}

.lg-tabs .lg-tabs__tab--selected {
  color: var(--lg-color-text-strong) !important;
  background: var(--lg-color-panel);
  border-bottom: 2px solid var(--lg-color-accent);
}

.lg-tabs .lg-tabs__tab--button {
  background: var(--lg-color-button);
  color: var(--lg-color-button-text);
}

.lg-tabs .lg-tabs__panel {
  background: var(--lg-color-panel);
  color: var(--lg-color-text);
  padding: 4px;
}

.lg-tabs .lg-tabs__tab-close {
  color: var(--lg-color-text-muted);
  opacity: 0.7;
}

.lg-tabs .lg-tabs__tab-close:hover {
  color: var(--lg-color-text-strong);
  background: var(--lg-color-header-2);
}

.lg-tabs--vertical > .lg-tabs__list {
  background: var(--lg-color-header);
  border-right: 1px solid var(--lg-color-border);
  border-bottom: 0;
}

.lg-tabs--vertical > .lg-tabs__list > .lg-tabs__tab {
  min-height: 64px;
  height: 64px;
  margin: 0 0 2px;
  padding: 0 6px;
  border-radius: var(--lg-radius) 0 0 var(--lg-radius);
  border-bottom: 1px solid transparent;
}

.lg-tabs--vertical > .lg-tabs__list > .lg-tabs__tab--selected {
  border-bottom-color: transparent;
  border-left: 2px solid var(--lg-color-accent);
}

/* ==========================================================================
   8. Lists / complex lists
   ========================================================================== */
ul.lg-list {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 2px 0;
  overflow: auto;
  list-style: none;
  background: var(--lg-color-bg-alt);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  box-sizing: border-box;
}

ul.lg-list li.lg-list__item {
  min-height: var(--lg-row-height);
  margin: 0 2px;
  padding: 3px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  color: var(--lg-color-text);
  font-size: var(--lg-font-size);
  border-radius: var(--lg-radius-sm);
  cursor: pointer;
}

ul.lg-list li.lg-list__item:hover {
  background: var(--lg-color-row-hover);
}

ul.lg-list li.lg-is-selected {
  position: static;
  background: var(--lg-color-row-selected);
  border: 0;
  color: #fff;
}

ul.lg-list li.lg-is-selected::after, ul.lg-list li.lg-is-selected::before {
  display: none;
  content: none;
  border: 0;
}

ul.lg-list .lg-list__arrow {
  flex: 0 0 auto;
  color: var(--lg-color-text-muted);
}

.lg-list__item.lg-is-selected .lg-list__arrow {
  color: #fff;
}

.lg-complex-list {
  background: var(--lg-color-bg-alt);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius);
  color: var(--lg-color-text);
  padding: 4px;
  overflow: auto;
  box-sizing: border-box;
}

.lg-complex-list__title {
  margin: 6px 4px 2px;
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size-sm);
  font-weight: 500;
}

.lg-complex-list__item {
  min-height: 30px;
  margin: 3px 2px;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--lg-color-panel);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text);
  line-height: 1.5;
  box-sizing: border-box;
}

.lg-complex-list__item:hover {
  background: var(--lg-color-header-2);
}

.lg-complex-list__item.lg-is-selected {
  background: var(--lg-color-row-selected);
  border-color: var(--lg-color-row-selected);
  color: #fff;
}

/* ComplexList 的 addItem 会把 lg-is-selected / lg-is-enabled 加在
 * createListItem 返回的外层 span 上，因此两种层级都要兼容。 */
.lg-complex-list > span {
  display: block;
}

.lg-complex-list > span.lg-is-selected .lg-complex-list__item {
  background: var(--lg-color-row-selected);
  border-color: var(--lg-color-row-selected);
  color: #fff;
}

.lg-complex-list > span.lg-is-selected .lg-complex-list__item-title {
  color: #fff;
}

.lg-complex-list > span.lg-is-enabled .lg-complex-list__tick {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.lg-complex-list__item .lg-complex-list__item-title {
  flex: 1 1 auto;
  min-width: 0;
  width: auto;
  padding-left: 4px;
  color: var(--lg-color-text);
  font-size: var(--lg-font-size);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-complex-list__item.lg-is-selected .lg-complex-list__item-title {
  color: #fff;
}

.lg-complex-list__item .lg-complex-list__tick {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--lg-color-checkbox-bg);
  border: 1px solid var(--lg-color-checkbox-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size-xs);
  line-height: 1;
  vertical-align: middle;
}

.lg-complex-list__item.lg-is-enabled .lg-complex-list__tick {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

/* 默认 item_code 里 tick 内含文本 "Tick"，隐藏文字用对勾代替。 */
.lg-complex-list__tick > span {
  font-size: 0;
  line-height: 0;
}

.lg-complex-list__item.lg-is-enabled .lg-complex-list__tick > span::after, .lg-complex-list > span.lg-is-enabled .lg-complex-list__tick > span::after {
  content: "✓";
  font-size: 11px;
  line-height: 1;
  color: #fff;
}

.lg-complex-list__item.lg-is-selected .lg-complex-list__tick {
  border-color: rgba(255, 255, 255, 0.7);
}

.lg-complex-list__item button {
  background: var(--lg-color-button);
  border: 1px solid var(--lg-color-border-strong);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-button-text);
  margin: 0;
  padding: 1px 6px;
}

.lg-complex-list__item button:hover {
  background: var(--lg-color-button-hover);
}

/* ==========================================================================
   9. Tables
   ========================================================================== */
/* 旧样式把 table/tr/th/td 改成 block/inline-block，导致列宽错位；
 * 这里恢复真正的表格布局，并用 table-layout:fixed 防止窄屏被长内容撑开。 */
table.lg-table {
  display: table;
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 0;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  background: var(--lg-color-bg-alt);
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm);
  box-sizing: border-box;
}

table.lg-table tr {
  display: table-row;
  width: auto;
  background: var(--lg-color-bg-alt);
  border: 0;
}

table.lg-table th, table.lg-table td {
  display: table-cell;
  vertical-align: middle;
  padding: 5px 8px;
  border-top: 0;
  border-left: 0;
  border-right: 1px solid var(--lg-color-table-border);
  border-bottom: 1px solid var(--lg-color-table-border);
  color: var(--lg-color-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm);
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

table.lg-table th:last-child, table.lg-table td:last-child {
  border-right: 0;
}

table.lg-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--lg-color-table-head);
  color: var(--lg-color-text);
  font-weight: 500;
  text-align: left;
}

table.lg-table td {
  color: var(--lg-color-text);
}

table.lg-table tr:nth-child(even) {
  background: var(--lg-color-row-alt);
}

table.lg-table tr:hover {
  background: var(--lg-color-row-hover);
}

table.lg-table tr:hover td {
  color: var(--lg-color-text-strong);
}

/* ==========================================================================
   10. Tree / Outliner
   ========================================================================== */
.litetree {
  height: 100%;
  padding: 2px 0;
  overflow: auto;
  background: var(--lg-color-bg-alt);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text);
  box-sizing: border-box;
}

.litetree ul.ltreeitemchildren {
  margin: 0;
  padding: 0;
  list-style: none;
}

li.ltreeitem {
  list-style: none;
  min-height: var(--lg-row-height);
  margin: 0 2px;
  padding: 0;
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text);
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

li.ltreeitem:nth-child(even) {
  background: var(--lg-color-row-alt);
}

li.ltreeitem:hover {
  background: var(--lg-color-row-hover);
}

li.ltreeitem.selected {
  background: var(--lg-color-row-selected);
  color: #fff;
}

li.ltreeitem.semiselected {
  background: var(--lg-color-row-semiselected);
}

li.ltreeitem.hidden, li.ltreeitem.filtered {
  display: none;
}

li.ltreeitem div.ltreeitemtitle {
  min-height: var(--lg-row-height);
  padding: 0 6px;
  display: flex;
  align-items: center;
  color: inherit;
  white-space: nowrap;
  box-sizing: border-box;
}

li.ltreeitem div.ltreeitemtitle .precontent, li.ltreeitem div.ltreeitemtitle .indentblock, li.ltreeitem div.ltreeitemtitle .collapsebox, li.ltreeitem div.ltreeitemtitle .postcontent {
  flex: 0 0 auto;
}

li.ltreeitem div.ltreeitemtitle .incontent {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
}

li.ltreeitem div.ltreeitemtitle .incontent:hover {
  color: var(--lg-color-text-strong);
}

li.ltreeitem.selected div.ltreeitemtitle .incontent, li.ltreeitem.selected div.ltreeitemtitle .incontent:hover {
  color: #fff;
}

li.ltreeitem.semiselected div.ltreeitemtitle .incontent {
  color: var(--lg-color-text-strong);
}

li.ltreeitem div.ltreeitemtitle.dragover .incontent {
  background: var(--lg-color-accent);
  color: #fff;
  padding: 1px 4px;
  border-radius: var(--lg-radius-sm);
  font-size: var(--lg-font-size);
}

li.ltreeitem .ltreeitemtitle .precontent {
  margin-right: 4px;
}

li.ltreeitem .ltreeitemtitle .postcontent {
  margin-left: 4px;
}

.listbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin: 0 6px 0 0;
  padding: 0;
  color: var(--lg-color-text-muted);
  font-size: 10px;
  line-height: 1;
  text-align: center;
  border-radius: var(--lg-radius-sm);
  vertical-align: middle;
}

.listbox:hover {
  color: var(--lg-color-text-strong);
  background: var(--lg-color-header-2);
}

.listbox.empty {
  width: 6px;
  height: 6px;
  margin: 0 6px 0 4px;
  color: transparent;
  background: var(--lg-color-border-strong);
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
}

/* ==========================================================================
   11. Inspector / Properties
   ========================================================================== */
.inspector {
  width: 100%;
  max-width: 100%;
  padding: 2px 6px;
  color: var(--lg-color-text);
  font-size: var(--lg-font-size);
  line-height: 1.45;
  overflow-x: hidden;
  box-sizing: border-box;
}

.inspector.one_line {
  margin-bottom: 0;
  overflow: hidden;
  white-space: nowrap;
}

.inspector .widget {
  min-height: var(--lg-row-height);
  padding: 1px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--lg-radius-sm);
  box-sizing: border-box;
}

.inspector:not(.one_line) .widget {
  flex-wrap: nowrap;
}

.inspector .widget:hover {
  background-color: var(--lg-color-row-hover) !important;
}

.inspector .widget.even {
  background-color: var(--lg-color-row-alt);
}

.inspector.one_line .widget {
  min-width: 100px;
  display: inline-flex;
}

.inspector .wname {
  flex: 0 0 auto;
  width: 96px;
  max-width: 50%;
  padding: 0 8px 0 2px;
  color: var(--lg-color-text-muted);
  font-weight: 400;
  line-height: var(--lg-row-height);
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  user-select: none;
}

.inspector.one_line .wname {
  width: auto;
}

.inspector .wname .filling {
  color: var(--lg-color-text-muted);
  opacity: 0.6;
  margin-left: 5px;
}

.inspector .wcontent, .inspector .info_content {
  flex: 1 1 auto;
  min-width: 0;
  width: auto;
  max-width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
}

.inspector .wcontent.full, .inspector .info_content.full {
  width: 100%;
  padding-left: 0;
}

.inspector.proportionalnamesize .wname {
  width: 30%;
  max-width: 30%;
}

.inspector.proportionalnamesize .wcontent, .inspector.proportionalnamesize .info_content {
  width: 70%;
}

.inspector .inputfield {
  flex: 1 1 auto;
  min-width: 0;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  background: var(--lg-color-input-bg);
  border: 1px solid var(--lg-color-input-border);
  border-radius: var(--lg-radius-sm);
  overflow: hidden;
  box-sizing: border-box;
}

.inspector .inputfield.full, .inspector .wcontent .inputfield, .inspector .wcontent .inputfield.full {
  width: 100%;
  max-width: 100%;
}

.inspector .inputfield input, .inspector .inputfield textarea {
  width: 100%;
  height: 22px;
  min-width: 0;
  padding: 0 6px;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: var(--lg-color-input-text);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm);
  line-height: 1.4;
  outline: none;
  box-sizing: border-box;
}

.inspector .inputfield input:focus, .inspector .inputfield textarea:focus {
  outline: none;
  background: var(--lg-color-input-bg);
  box-shadow: inset 0 0 0 1px var(--lg-color-accent);
}

.inspector .inputfield.disabled {
  background: var(--lg-color-panel-2);
  opacity: 0.6;
}

.inspector .inputfield.disabled input, .inspector .inputfield.disabled textarea {
  color: var(--lg-color-text-muted);
}

.inspector .inputfield.textarea, .inspector .wcontent .inputfield.textarea {
  height: auto;
  min-height: 52px;
  display: block;
  width: 100%;
}

.inspector .inputfield.textarea textarea, .inspector .wcontent .inputfield textarea {
  height: 48px;
  padding: 4px 6px;
  resize: vertical;
}

.inspector .inputfield.button, .inspector .wcontent .inputfield.button {
  width: auto;
  flex: 1 1 auto;
}

/* 旧样式把 Inspector 输入文字设成蓝色 #5af；亮/暗主题都改为 token 文本色。 */
.inspector .wcontent input, .inspector .wcontent textarea {
  color: var(--lg-color-input-text);
  border: 0;
  background-color: transparent;
}

.inspector .wcontent input.number {
  color: var(--lg-color-number);
  text-align: center;
}

.inspector input::placeholder, .inspector input::-webkit-input-placeholder {
  color: var(--lg-color-placeholder);
}

.inspector .wcontent select {
  width: 100%;
  max-width: 100%;
  height: 24px;
  padding: 0 4px;
  color: var(--lg-color-input-text);
  background: var(--lg-color-input-bg);
  border: 1px solid var(--lg-color-input-border);
  border-radius: var(--lg-radius-sm);
  font-family: var(--lg-font);
  font-size: var(--lg-font-size-sm);
  box-sizing: border-box;
}

.inspector .wcontent select.disabled {
  background: var(--lg-color-panel-2);
  color: var(--lg-color-text-muted);
}

/* 旧样式 \`.inspector .wcontent .inputcombo select\` 会把下拉框刷成近黑色。 */
.inspector .wcontent .inputcombo select, .inspector .wcontent .inputcombo {
  background: var(--lg-color-input-bg);
  color: var(--lg-color-input-text);
  border-color: var(--lg-color-input-border);
}

.inspector .itemvalue {
  color: var(--lg-color-number);
}

.inspector .winfo {
  display: block;
  width: auto;
  margin: 8px 6px;
  color: var(--lg-color-text-muted);
}

/* Inspector 内部的旧 checkbox（span.flag.checkbox.on） */
.inspector .wcontent .checkbox {
  width: auto;
  min-width: 44px;
  max-width: 100%;
  height: 22px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--lg-color-input-bg);
  border: 1px solid var(--lg-color-input-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size-xs);
  line-height: 1;
  text-align: center;
  margin: 0 !important;
  cursor: pointer;
}

.inspector .wcontent .checkbox.on {
  background: var(--lg-color-accent);
  border-color: var(--lg-color-accent);
  color: #fff;
}

.inspector .wcontent .flag {
  color: var(--lg-color-text-muted);
  font-size: var(--lg-font-size-xs);
  margin-left: 5px;
}

.inspector .wtitle, .inspector .wsectiontitle {
  position: relative;
  min-height: var(--lg-row-height);
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--lg-color-header-2);
  color: var(--lg-color-text-strong);
  font-size: var(--lg-font-size-sm);
  font-weight: 500;
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  box-shadow: none;
  overflow: hidden;
  box-sizing: border-box;
}

.inspector .wtitle {
  margin-top: 6px;
  color: var(--lg-color-text-muted);
  background: var(--lg-color-header);
}

.inspector.dark .wtitle {
  background: var(--lg-color-header);
}

.inspector .wsectiontitle {
  margin-top: 0;
  border-bottom: 0;
  border-radius: var(--lg-radius-sm) var(--lg-radius-sm) 0 0;
}

.inspector .wsectiontitle .buttons {
  position: absolute;
  top: 3px;
  right: 4px;
  display: flex;
  gap: 2px;
}

.inspector .wsectiontitle button {
  font-size: var(--lg-font-size-xs);
  background: var(--lg-color-button);
  border: 1px solid var(--lg-color-border-strong);
  color: var(--lg-color-button-text);
  box-shadow: none;
  padding: 0 4px;
  margin: 0 0 0 2px;
}

.inspector .wsectioncontent {
  padding: 4px 6px 6px;
  background: var(--lg-color-panel-2);
  border: 1px solid var(--lg-color-border);
  border-top: 0;
  border-radius: 0 0 var(--lg-radius-sm) var(--lg-radius-sm);
  transition: none;
}

.inspector .wsection {
  margin-bottom: 8px;
}

.inspector .wsection.selected .wsectiontitle {
  background: var(--lg-color-accent);
  color: #fff;
}

.inspector .wsection.selected .wsectioncontent {
  border: 1px solid var(--lg-color-accent);
  border-top: 0;
}

.inspector .wsection.collapsed {
  margin-bottom: 0;
  padding-bottom: 0;
}

.inspector .wsection.collapsed .wsectiontitle {
  border-bottom: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
}

.inspector .wsection.notitle {
  margin: 0;
  padding: 0;
}

.inspector .separator {
  width: 100%;
  margin: 6px 0;
  border-top: 1px solid var(--lg-color-border);
  border-bottom: 0;
}

.inspector.one_line .separator {
  display: inline-block;
  width: auto;
  height: 1em;
  margin: 2px 5px 0;
  border-top: 0;
  border-left: 1px solid var(--lg-color-border);
  border-right: 0;
}

.inspector .wgroup {
  width: 100%;
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

.inspector .wgrouptoggle {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 4px 0 2px;
  color: var(--lg-color-text-muted);
  font-size: 12px;
  line-height: 8px;
}

.inspector .switch-section-button {
  display: inline-block;
  margin: 0 2px 0 0;
  border-top: 6px solid var(--lg-color-text-muted);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

.inspector .collapsed .switch-section-button {
  margin: 0 2px 0 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 6px solid var(--lg-color-text-muted);
  border-right: 5px solid transparent;
}

.inspector .wgroupheader:not(.collapsed) .switch-section-button {
  border-top-color: var(--lg-color-text);
  border-left-color: transparent;
}

.inspector .wgroupheader.collapsed .switch-section-button {
  border-left-color: var(--lg-color-text);
  border-top-color: transparent;
}

.inspector .wcontent button, .inspector button.litebutton, .inspector button.wcombobutton {
  background: var(--lg-color-button);
  background-image: none;
  border: 1px solid var(--lg-color-border-strong);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-button-text);
  box-shadow: none;
  text-shadow: none;
}

.inspector .wcontent button:hover, .inspector button.litebutton:hover, .inspector button.wcombobutton:hover {
  background: var(--lg-color-button-hover);
}

.inspector .wcontent button.micro {
  width: 22px;
  margin: 0 0 0 4px;
  padding: 0;
}

button.wcombobutton.selected {
  background: var(--lg-color-accent) !important;
  border-color: var(--lg-color-accent) !important;
  color: #fff !important;
}

.inspector .wtag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 4px;
  margin: 1px;
  background: var(--lg-color-header-2);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-text);
}

.inspector .wtag .close {
  background: var(--lg-color-button);
  color: var(--lg-color-text-muted);
  padding: 0 3px;
  border-radius: var(--lg-radius-sm);
  cursor: pointer;
}

.inspector .wtag .close:hover {
  background: var(--lg-color-error);
  color: #fff;
}

.inspector ul.lite-list {
  margin: 2px;
  padding: 0;
  list-style: none;
  min-height: 2em;
}

.inspector ul.lite-list li {
  margin: 1px 0;
  padding: 2px 6px;
  border-radius: var(--lg-radius-sm);
  cursor: pointer;
}

.inspector ul.lite-list li.selected {
  background: var(--lg-color-row-selected);
  color: #fff;
}

.inspector ul.lite-list li:hover {
  background: var(--lg-color-row-hover);
  color: var(--lg-color-text-strong);
}

.inspector .row-index {
  width: 30px;
  text-align: center;
  color: var(--lg-color-text-muted);
}

.inspector .row-cell {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
}

.inspector .array-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 26px;
}

.inspector .array-row .row-trash {
  width: 26px;
  flex: 0 0 auto;
}

/* ==========================================================================
   12. Console
   ========================================================================== */
.lg-console {
  width: 100%;
  height: 100%;
  background: var(--lg-color-console-bg);
  border: 1px solid var(--lg-color-border);
  border-radius: var(--lg-radius-sm);
  color: var(--lg-color-console-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: var(--lg-font-size-sm);
  line-height: 1.55;
  box-sizing: border-box;
}

.lg-console__log {
  background: transparent;
  color: inherit;
  padding: 6px 8px;
  box-sizing: border-box;
}

.lg-console__footer {
  background: var(--lg-color-panel-2);
  border-top: 1px solid var(--lg-color-border);
  height: 26px;
  box-sizing: border-box;
}

.lg-console__footer input {
  width: 100%;
  height: 25px;
  padding: 0 8px;
  background: transparent;
  border: 0;
  color: var(--lg-color-console-text);
  font-family: inherit;
  font-size: var(--lg-font-size-sm);
  outline: none;
}

.lg-console__message--warn {
  color: var(--lg-color-warn);
}

.lg-console__message--error {
  color: #ff6b6b;
}

.lg-console__message--good {
  color: #8bd88b;
}

.lg-console__message--me {
  color: #8fb4e8;
}

.lg-console__message--log {
  color: var(--lg-color-console-text);
}

/* ==========================================================================
   13. Tooltips
   ========================================================================== */
.lg-tooltip, [role=tooltip].lg-tooltip {
  background: var(--lg-color-tooltip-bg);
  color: var(--lg-color-tooltip-text);
  border: 1px solid var(--lg-color-border-strong);
  border-radius: var(--lg-radius-sm);
  padding: 4px 8px;
  font-size: var(--lg-font-size-sm);
  box-shadow: var(--lg-shadow-menu);
}

/* ==========================================================================
   14. Areas / split / misc
   ========================================================================== */
.lg-area {
  background: var(--lg-color-bg);
}

.lg-area__content {
  background: var(--lg-color-bg);
}

.lg-area__splitbar, .lg-split__splitbar {
  background: var(--lg-color-border-strong);
}

.lg-area__splitbar:hover, .lg-split__splitbar:hover {
  background: var(--lg-color-accent);
  transition: none;
}

.lg-split__section {
  box-sizing: border-box;
}

.lg-colorpicker-window, .colorpicker-window {
  background: var(--lg-color-panel);
  border: 1px solid var(--lg-color-border);
  color: var(--lg-color-text);
}

/* ==========================================================================
   15. Narrow screens: keep controls shrinkable, avoid horizontal overflow
   ========================================================================== */
@media (max-width: 480px) {
  .lg-panel .lg-panel__content, .lg-dialog .lg-dialog__content {
    padding: 6px;
  }
  .lg-dialog .lg-dialog__content {
    padding-bottom: 38px;
  }
  .lg-dialog {
    min-width: 0;
    width: calc(100vw - 16px);
    max-width: calc(100vw - 16px);
  }
  .lg-menu__panel, .lg-context-menu {
    min-width: 0;
    max-width: calc(100vw - 12px);
  }
  .inspector .wname {
    width: 82px;
  }
  table.lg-table th, table.lg-table td {
    padding: 4px 5px;
    font-size: var(--lg-font-size-xs);
  }
  .lg-tabs .lg-tabs__tab {
    min-width: 48px;
    padding: 0 8px;
  }
}
/* ------------------------------------------------------------------ */
/* Blender Light: workspace components added after the first theme pass */
/* Palette from Blender_Light.xml: bg #6b6b6b, panel #cccccc, header    */
/* #adadad, control #dbdbdb, border #4d4d4d, accent #5680c2.            */
/* ------------------------------------------------------------------ */

.lg-viewport {
  --lg-viewport-bg: #484848;
  --lg-viewport-bg-wire: #2c2c2c;
  --lg-viewport-grid: #565656;
  --lg-viewport-grid-axis: #666666;
  --lg-viewport-axis-x: #a04a4a;
  --lg-viewport-axis-y: #4a8a4a;
  --lg-viewport-gizmo-x: #c85a5a;
  --lg-viewport-gizmo-y: #61a861;
  --lg-viewport-gizmo-z: #5f8fc8;
  --lg-viewport-selection: #f0a030;
  --lg-viewport-selection-soft: rgba(240, 160, 48, 0.55);
  --lg-viewport-camera: #d8d8d8;
  --lg-viewport-light: #e0d080;
  --lg-viewport-brush: rgba(240, 160, 48, 0.9);
  --lg-viewport-brush-fill: rgba(240, 160, 48, 0.1);
  --lg-viewport-outline: #3c3c3c;
  --lg-viewport-edit: #ffb84d;
  --lg-viewport-edit-soft: rgba(255, 184, 77, 0.55);
  --lg-viewport-edit-fill: rgba(255, 184, 77, 0.18);
  --lg-viewport-face-1: #9d9d9d;
  --lg-viewport-face-2: #c4c4c4;
  --lg-viewport-face-3: #b4b4b4;
  --lg-viewport-face-4: #8c8c8c;
  --lg-viewport-face-5: #a8a8a8;
  --lg-viewport-face-6: #bdbdbd;
  --lg-viewport-info-color: #d8d8d8;
  --lg-viewport-info-muted: #aaaaaa;
}
`,Ii=typeof HTMLElement>"u"?class{}:HTMLElement;let ee;const ni=new Map;function Hc(){if(ee!==void 0)return ee;if(typeof CSSStyleSheet>"u"||typeof document>"u")return ee=null,null;try{const r=new CSSStyleSheet;r.replaceSync(zi),ee=r}catch{ee=null}return ee}function Rc(r){const n=ni.get(r);if(n)return n;if(typeof CSSStyleSheet>"u")return null;try{const t=new CSSStyleSheet;return t.replaceSync(r),ni.set(r,t),t}catch{return null}}class X extends Ii{constructor(){super();c(this,"mountPoint");c(this,"_component",null);c(this,"_rendered",!1);const t=this.attachShadow({mode:"open"}),e=`${this.constructor.hostStyles}
:host([hidden]) { display: none; }`,i=Hc(),o=Rc(e);if(i&&o&&"adoptedStyleSheets"in t)t.adoptedStyleSheets=[i,o];else{const s=document.createElement("style");s.textContent=`${zi}
${e}`,t.appendChild(s)}this.mountPoint=document.createElement("div"),this.mountPoint.setAttribute("part","mount"),t.appendChild(this.mountPoint)}connectedCallback(){var t;this._rendered?(t=this.onReconnect)==null||t.call(this):(this._rendered=!0,this.render())}disconnectedCallback(){var t;(t=this.onDisconnect)==null||t.call(this)}attributeChangedCallback(t,e,i){var o;e!==i&&((o=this.onAttributeChanged)==null||o.call(this,t,e,i))}get component(){return this._component}setComponent(t){this._component=t,this.mountPoint.replaceChildren(t.root)}emit(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}stringAttr(t,e=""){return this.getAttribute(t)??e}numberAttr(t,e){const i=this.getAttribute(t);if(i===null||i.trim()==="")return e;const o=Number(i);return Number.isFinite(o)?o:e}optionalNumberAttr(t){const e=this.getAttribute(t);if(e===null||e.trim()==="")return;const i=Number(e);return Number.isFinite(i)?i:void 0}jsonAttr(t,e){const i=this.getAttribute(t);if(!i)return e;try{return JSON.parse(i)}catch{return e}}boolAttr(t){return this.hasAttribute(t)}reflect(t,e){e===!1||e===null||e===void 0||e===""?this.removeAttribute(t):this.setAttribute(t,e===!0?"":String(e))}}c(X,"observedAttributes",[]),c(X,"hostStyles","");var Yt,Kt,Ge,Ni;class Je extends X{constructor(){super(...arguments);B(this,Kt);B(this,Yt,null)}render(){this.mountPoint.style.height="100%",W(this,Kt,Ge).call(this)}onAttributeChanged(t){g(this,Yt)&&(t==="sections"||t==="direction")&&W(this,Kt,Ge).call(this)}get sections(){return Math.max(1,Math.round(this.numberAttr("sections",1)))}set sections(t){this.reflect("sections",t)}get direction(){return this.stringAttr("direction","horizontal")==="vertical"?"vertical":"horizontal"}set direction(t){this.reflect("direction",t)}}Yt=new WeakMap,Kt=new WeakSet,Ge=function(){const t=new we({width:"100%",height:"100%"});D(this,Yt,t),this.setComponent(t),t.content.appendChild(document.createElement("slot"));const e=()=>{var i;this.emit("litegui-resize",{sections:((i=g(this,Yt))==null?void 0:i.sections.length)??0})};t.addEventListener("split_moved",e),t.root.addEventListener("mouseup",e),W(this,Kt,Ni).call(this,this.sections)},Ni=function(t){const e=g(this,Yt);if(!e||t<2)return;e.split(this.direction,["50%",null],!0);const i=e.sections[1];if(i&&t>2){i.split(this.direction,["50%",null],!0);let o=i.sections[1];for(let s=3;s<t&&o;s+=1)o.split(this.direction,["50%",null],!0),o=o.sections[1]}},c(Je,"observedAttributes",["sections","direction"]),c(Je,"hostStyles",":host { display: block; height: 240px; min-height: 120px; }");var Nt;class Pi extends X{constructor(){super(...arguments);B(this,Nt,null)}render(){D(this,Nt,new Ye),g(this,Nt).root.appendChild(document.createElement("slot")),this.setComponent(g(this,Nt))}get stopPropagation(){var t;return((t=g(this,Nt))==null?void 0:t.stopPropagation)??!1}set stopPropagation(t){g(this,Nt)&&(g(this,Nt).stopPropagation=t)}}Nt=new WeakMap,c(Pi,"hostStyles",":host { display: block; min-height: 20px; }");var vt;class Ke extends X{constructor(){super(...arguments);B(this,vt,null)}render(){D(this,vt,new Dn(this.label,{size:this.size,callback:()=>{this.disabled||this.emit("litegui-click",{label:this.label})}})),g(this,vt).content.disabled=this.disabled,this.setComponent(g(this,vt))}onAttributeChanged(t){g(this,vt)&&(t==="label"&&(g(this,vt).content.textContent=this.label),t==="size"&&(g(this,vt).root.classList.remove("small","mini"),this.size!=="default"&&g(this,vt).root.classList.add(this.size)),t==="disabled"&&(g(this,vt).content.disabled=this.disabled))}get label(){return this.stringAttr("label")}set label(t){this.reflect("label",t)}get size(){const t=this.stringAttr("size","default");return t==="small"||t==="mini"?t:"default"}set size(t){this.reflect("size",t)}get disabled(){return this.boolAttr("disabled")}set disabled(t){this.reflect("disabled",t)}}vt=new WeakMap,c(Ke,"observedAttributes",["label","size","disabled"]),c(Ke,"hostStyles",":host { display: inline-block; }");var kt;class Qe extends X{constructor(){super(...arguments);B(this,kt,null)}render(){D(this,kt,new pi(this.checked,{onChange:t=>{this.toggleAttribute("checked",t),this.emit("litegui-change",{checked:t})}})),this.setComponent(g(this,kt)),this.applyDisabled()}onAttributeChanged(t){g(this,kt)&&(t==="checked"&&g(this,kt).setValue(this.checked),t==="disabled"&&this.applyDisabled())}applyDisabled(){if(!g(this,kt))return;const t=this.disabled;g(this,kt).root.setAttribute("aria-disabled",String(t)),g(this,kt).root.style.pointerEvents=t?"none":""}get checked(){return this.boolAttr("checked")}set checked(t){this.reflect("checked",t)}get disabled(){return this.boolAttr("disabled")}set disabled(t){this.reflect("disabled",t)}}kt=new WeakMap,c(Qe,"observedAttributes",["checked","disabled"]),c(Qe,"hostStyles",":host { display: inline-block; }");var ht,$t,en,ve;class tn extends X{constructor(){super(...arguments);B(this,$t);B(this,ht,null)}render(){D(this,ht,new mi({height:this.optionalNumberAttr("height")})),g(this,ht).onItemSelected=t=>{this.emit("litegui-select",{value:W(this,$t,ve).call(this,t),item:t})},g(this,ht).onItemToggled=(t,e)=>{const i=e.classList.contains("lg-is-enabled");this.emit("litegui-toggle",{value:W(this,$t,ve).call(this,t),enabled:i,item:t})},g(this,ht).onItemRemoved=t=>{this.emit("litegui-remove",{value:W(this,$t,ve).call(this,t),item:t})},this.setComponent(g(this,ht)),W(this,$t,en).call(this)}onAttributeChanged(t){if(g(this,ht)&&(t==="items"&&W(this,$t,en).call(this),t==="height")){const e=this.optionalNumberAttr("height");g(this,ht).root.style.height=e===void 0?"":`${e}px`}}get items(){return this.jsonAttr("items",[])}set items(t){this.reflect("items",JSON.stringify(t))}get height(){return this.optionalNumberAttr("height")}set height(t){this.reflect("height",t)}}ht=new WeakMap,$t=new WeakSet,en=function(){if(g(this,ht)){g(this,ht).clear();for(const t of this.items){const e=t.name??t.content??t.id??"";g(this,ht).addItem(t,e,t.enabled,t.removable!==!1)}}},ve=function(t){return t?String(t.id??t.name??t.content??""):""},c(tn,"observedAttributes",["items","height"]),c(tn,"hostStyles",":host { display: block; min-height: 80px; }");var pt;class nn extends X{constructor(){super(...arguments);B(this,pt,null)}render(){this.mountPoint.style.height="100%",D(this,pt,new fi({prompt:this.prompt})),g(this,pt).onProcessCommand=t=>{this.emit("litegui-command",{command:t})},this.setComponent(g(this,pt))}onAttributeChanged(t){!g(this,pt)||t!=="prompt"||(g(this,pt)._prompt=this.prompt)}get prompt(){return this.stringAttr("prompt","]")}set prompt(t){this.reflect("prompt",t)}log(...t){var e;return(e=g(this,pt))==null||e.log(...t),this}warn(...t){var e;return(e=g(this,pt))==null||e.warn(...t),this}error(...t){var e;return(e=g(this,pt))==null||e.error(...t),this}clear(){var t;return(t=g(this,pt))==null||t.clear(),this}}pt=new WeakMap,c(nn,"observedAttributes",["prompt"]),c(nn,"hostStyles",":host { display: block; height: 220px; min-height: 120px; }");var Et;class rn extends X{constructor(){super(...arguments);B(this,Et,null)}render(){this.mountPoint.style.position="relative",this.mountPoint.style.minHeight="100px",this.syncOpen()}onAttributeChanged(t,e,i){if(this.isConnected){if(t==="items"){g(this,Et)&&(this.destroyMenu(),this.syncOpen());return}t==="open"&&(i===null?this.destroyMenu():this.syncOpen())}}show(){return this.setAttribute("open",""),this}hide(){return this.removeAttribute("open"),this}syncOpen(){if(!this.hasAttribute("open")||g(this,Et))return;const t=this.items.map(e=>e.separator?null:{title:e.title??e.label??e.value??"",value:e.value??e.title??e.label??"",disabled:!!e.disabled});D(this,Et,new ae(t,{container:this.mountPoint,left:0,top:0,callback:e=>{this.removeAttribute("open"),e&&this.emit("litegui-select",{value:e.value??e.title??"",item:e})}})),g(this,Et).root.style.position="absolute"}destroyMenu(){g(this,Et)&&(g(this,Et).close(),D(this,Et,null))}get items(){return this.jsonAttr("items",[])}set items(t){this.reflect("items",JSON.stringify(t))}get open(){return this.hasAttribute("open")}set open(t){this.reflect("open",t)}}Et=new WeakMap,c(rn,"observedAttributes",["items","open"]),c(rn,"hostStyles",":host { display: block; position: relative; min-height: 40px; }");var it;class on extends X{constructor(){super(...arguments);B(this,it,null)}render(){const t=this.numberAttr("height",200);this.mountPoint.style.height=`${t+40}px`,D(this,it,new le({parent:this.mountPoint,title:this.heading,width:this.numberAttr("width",320),height:t,close:this.boolAttr("closable"),draggable:!0,resizable:!0}));const e=document.createElement("slot");g(this,it).content.appendChild(e),g(this,it).on("closed",()=>{this.removeAttribute("open"),this.emit("litegui-close",{})}),this.setComponent(g(this,it)),this.syncOpen()}onAttributeChanged(t){if(g(this,it)&&(t==="open"&&this.syncOpen(),t==="width"&&(g(this,it).root.style.width=`${this.numberAttr("width",320)}px`),t==="height")){const e=this.numberAttr("height",200);g(this,it).root.style.height=`${e}px`,this.mountPoint.style.height=`${e+40}px`,g(this,it).center()}}syncOpen(){if(!g(this,it))return;if(this.boolAttr("open")){if(!g(this,it).root.isConnected){this.render();return}g(this,it).show(),g(this,it).center();return}g(this,it).root.isConnected&&g(this,it).hide()}get heading(){return this.stringAttr("heading")}set heading(t){this.reflect("heading",t)}get open(){return this.boolAttr("open")}set open(t){this.reflect("open",t)}}it=new WeakMap,c(on,"observedAttributes",["heading","width","height","open"]),c(on,"hostStyles",":host { display: block; position: relative; min-height: 260px; }");var lt,ne;class sn extends X{constructor(){super(...arguments);B(this,lt,null);B(this,ne,!1)}render(){D(this,lt,new bi(this.value,{min:this.optionalNumberAttr("min"),max:this.optionalNumberAttr("max"),step:this.optionalNumberAttr("step"),precision:this.optionalNumberAttr("precision"),linear:this.boolAttr("linear")})),g(this,lt).input.addEventListener("change",()=>{if(!g(this,lt)||g(this,ne))return;const t=Number.parseFloat(g(this,lt).input.value),e=Number.isFinite(t)?t:g(this,lt).getValue();this.reflect("value",e),this.emit("litegui-change",{value:e})}),this.setComponent(g(this,lt)),g(this,lt).setValue(this.value,!0)}onAttributeChanged(t){if(!g(this,lt))return;const e=g(this,lt).options;switch(t){case"value":D(this,ne,!0),g(this,lt).setValue(this.value,!0),D(this,ne,!1);break;case"min":case"max":e.min=this.optionalNumberAttr("min"),e.max=this.optionalNumberAttr("max");break;case"step":e.step=this.optionalNumberAttr("step");break;case"precision":{const i=this.optionalNumberAttr("precision");e.precision=i,g(this,lt).precision=i??3;break}case"linear":e.linear=this.boolAttr("linear");break}}get value(){return this.numberAttr("value",0)}set value(t){this.reflect("value",t)}get min(){return this.optionalNumberAttr("min")}set min(t){this.reflect("min",t)}get max(){return this.optionalNumberAttr("max")}set max(t){this.reflect("max",t)}get step(){return this.optionalNumberAttr("step")}set step(t){this.reflect("step",t)}get precision(){return this.optionalNumberAttr("precision")}set precision(t){this.reflect("precision",t)}}lt=new WeakMap,ne=new WeakMap,c(sn,"observedAttributes",["value","min","max","step","precision","linear"]),c(sn,"hostStyles",":host { display: inline-block; min-width: 90px; }");var et,ce,wt,$i,ln,Vi,Bi;class an extends X{constructor(){super(...arguments);B(this,wt);B(this,et,null);B(this,ce,{})}render(){D(this,et,new mr({variant:this.variant,title:this.title||void 0,height:this.optionalNumberAttr("height")})),this.setComponent(g(this,et)),["left","center","right"].forEach(t=>W(this,wt,ln).call(this,t))}onAttributeChanged(t){if(g(this,et))switch(t){case"variant":g(this,et).root.classList.toggle("lg-header-bar--area",this.variant==="area"),g(this,et).root.classList.toggle("lg-header-bar--topbar",this.variant!=="area");break;case"title":this.title?g(this,et).setTitle(this.title):g(this,et).titleElement&&(g(this,et).titleElement.remove(),g(this,et).titleElement=null);break;case"height":{const e=this.optionalNumberAttr("height");g(this,et).root.style.height=e===void 0?"":`${e}px`;break}case"left":case"center":case"right":W(this,wt,ln).call(this,t);break}}get variant(){return this.stringAttr("variant","topbar")==="area"?"area":"topbar"}set variant(t){this.reflect("variant",t)}get height(){return this.optionalNumberAttr("height")}set height(t){this.reflect("height",t)}get left(){return this.stringAttr("left")}set left(t){this.reflect("left",t)}get center(){return this.stringAttr("center")}set center(t){this.reflect("center",t)}get right(){return this.stringAttr("right")}set right(t){this.reflect("right",t)}}et=new WeakMap,ce=new WeakMap,wt=new WeakSet,$i=function(t){return g(this,et)?t==="left"?g(this,et).left:t==="center"?g(this,et).center:g(this,et).right:null},ln=function(t){const e=W(this,wt,$i).call(this,t);if(!e)return;const i=W(this,wt,Vi).call(this,t);if(i!==null){t==="left"?g(this,et).setLeft(i):t==="center"?g(this,et).setCenter(i):g(this,et).setRight(i);return}let o=g(this,ce)[t];o||(o=document.createElement("slot"),o.name=t,g(this,ce)[t]=o),e.contains(o)||e.appendChild(o)},Vi=function(t){return this.hasAttribute(t)?W(this,wt,Bi).call(this,this.getAttribute(t)??""):null},Bi=function(t){try{const e=JSON.parse(t);if(typeof e=="string")return e;if(Array.isArray(e))return e.filter(i=>typeof i=="string")}catch{}return t},c(an,"observedAttributes",["variant","title","height","left","center","right"]),c(an,"hostStyles",":host { display: block; }");var mt;class cn extends X{constructor(){super(...arguments);B(this,mt,null)}render(){this.mountPoint.style.height="100%";const t=this.getAttribute("src")??"";D(this,mt,new fr({src:t||void 0,title:this.title||"Image",zoom:this.zoom})),g(this,mt).on("zoom",e=>{const i=Number(e);this.reflect("zoom",i),this.emit("litegui-zoom",{zoom:i})}),this.setComponent(g(this,mt))}onAttributeChanged(t){if(g(this,mt))switch(t){case"src":g(this,mt).setSource(this.getAttribute("src")??"");break;case"title":g(this,mt).setTitle(this.title||"Image");break;case"zoom":g(this,mt).setZoom(this.zoom,!1);break}}get src(){return this.stringAttr("src")}set src(t){this.reflect("src",t)}get zoom(){return this.numberAttr("zoom",1)}set zoom(t){this.reflect("zoom",t)}fit(){var t;return(t=g(this,mt))==null||t.fit(!0),this}resetView(){var t;return(t=g(this,mt))==null||t.resetView(!0),this}}mt=new WeakMap,c(cn,"observedAttributes",["src","title","zoom"]),c(cn,"hostStyles",":host { display: block; height: 300px; min-height: 180px; }");var Ot,de,hn;class dn extends X{constructor(){super(...arguments);B(this,de);B(this,Ot,null)}render(){D(this,Ot,new L({full:!0,onchange:(t,e)=>{this.emit("litegui-change",{name:t,value:e})}})),this.setComponent(g(this,Ot)),W(this,de,hn).call(this)}onAttributeChanged(t){!g(this,Ot)||t!=="items"||W(this,de,hn).call(this)}get items(){return this.jsonAttr("items",[])}set items(t){this.reflect("items",JSON.stringify(t))}getValues(){var t,e;return((e=(t=g(this,Ot))==null?void 0:t.getValues)==null?void 0:e.call(t))??{}}}Ot=new WeakMap,de=new WeakSet,hn=function(){const t=g(this,Ot);if(t){t.clear();for(const e of this.items){if(e.type==="separator"){t.addSeparator();continue}if(e.type==="title"){t.addTitle(e.name??"");continue}t.add(e.type,e.name??"",e.value,e.options)}}},c(dn,"observedAttributes",["items"]),c(dn,"hostStyles",":host { display: block; min-width: 220px; min-height: 80px; }");var ct,ie,he,gn;class un extends X{constructor(){super(...arguments);B(this,he);B(this,ct,null);B(this,ie,!1)}render(){D(this,ct,new xi(this.value,{width:this.numberAttr("width",200),height:this.numberAttr("height",80),callback:t=>{g(this,ie)||(this.reflect("value",JSON.stringify(t)),this.emit("litegui-change",{value:t}))}})),this.setComponent(g(this,ct)),W(this,he,gn).call(this),g(this,ct).redraw()}onAttributeChanged(t){g(this,ct)&&(t==="value"?(D(this,ie,!0),g(this,ct).value=this.value,g(this,ct).redraw(),D(this,ie,!1)):(t==="width"||t==="height")&&(W(this,he,gn).call(this),g(this,ct).redraw()))}get value(){return this.jsonAttr("value",[])}set value(t){this.reflect("value",JSON.stringify(t))}get width(){return this.numberAttr("width",200)}set width(t){this.reflect("width",t)}get height(){return this.numberAttr("height",80)}set height(t){this.reflect("height",t)}}ct=new WeakMap,ie=new WeakMap,he=new WeakSet,gn=function(){if(!g(this,ct))return;const t=this.numberAttr("width",200),e=this.numberAttr("height",80),i=g(this,ct);g(this,ct).root.style.width=`${t}px`,i.canvas.width=t,i.canvas.height=e,g(this,ct).redraw()},c(un,"observedAttributes",["value","width","height"]),c(un,"hostStyles",":host { display: block; min-height: 60px; }");let Fc=0;var Xt,Qt,mn,Di;class pn extends X{constructor(){super(...arguments);B(this,Qt);B(this,Xt,null)}render(){W(this,Qt,mn).call(this)}onAttributeChanged(t){!g(this,Xt)||t!=="items"||W(this,Qt,mn).call(this)}get items(){return this.jsonAttr("items",[])}set items(t){this.reflect("items",JSON.stringify(t))}get value(){var t;return((t=g(this,Xt))==null?void 0:t.getSelectedValue())??null}}Xt=new WeakMap,Qt=new WeakSet,mn=function(){const t=W(this,Qt,Di).call(this);D(this,Xt,new _i(`lg-list-${++Fc}`,t,{callback:e=>{const i=e.dataset.value??"";this.emit("litegui-select",{value:i})}})),this.setComponent(g(this,Xt))},Di=function(){var i;const t=this.jsonAttr("items",null);if(Array.isArray(t))return t;const e=[];for(const o of Array.from(this.children)){const s=o.getAttribute("value")??((i=o.textContent)==null?void 0:i.trim())??"";if(!s)continue;const a=o.getAttribute("id");e.push(a?{id:a,value:s,label:s}:s)}return e},c(pn,"observedAttributes",["items"]),c(pn,"hostStyles",":host { display: block; min-width: 100px; }");let jc=0;class Wc extends Ii{get label(){return this.getAttribute("label")??""}set label(n){this.setAttribute("label",n)}}var xt;class Oi extends X{constructor(){super(...arguments);B(this,xt,null)}render(){D(this,xt,new Ee(`lg-menu-${++jc}`,{container:this.mountPoint})),this.buildItems(this,""),this.setComponent(g(this,xt))}buildItems(t,e){var i;for(const o of Array.from(t.children)){if(o.localName!=="lg-menu-item")continue;const s=o.getAttribute("label")??"";if(!s)continue;const a=e?`${e}/${s}`:s,l=Array.from(o.children).some(d=>d.localName==="lg-menu-item");(i=g(this,xt))==null||i.add(a,{callback:l?void 0:()=>this.emit("litegui-select",{label:s,path:a})}),this.buildItems(o,a)}}refresh(){g(this,xt)&&(g(this,xt).root.replaceChildren(g(this,xt).content),g(this,xt).menus=[],this.buildItems(this,""),g(this,xt).updateMainMenu())}}xt=new WeakMap,c(Oi,"hostStyles",":host { display: inline-block; }");var ft;class fn extends X{constructor(){super(...arguments);B(this,ft,null)}render(){this.mountPoint.style.height="100%",D(this,ft,new Fr({nodes:this.nodes,links:this.links,readOnly:this.boolAttr("readonly")})),g(this,ft).on("change",t=>{this.emit("litegui-change",t)}),g(this,ft).on("select",t=>{this.emit("litegui-select",{id:t==null?null:String(t)})}),this.setComponent(g(this,ft))}onAttributeChanged(t){g(this,ft)&&(t==="nodes"||t==="links"?g(this,ft).setGraph(this.nodes,this.links):t==="readonly"&&(g(this,ft).readOnly=this.boolAttr("readonly")))}get nodes(){return this.jsonAttr("nodes",[])}set nodes(t){this.reflect("nodes",JSON.stringify(t))}get links(){return this.jsonAttr("links",[])}set links(t){this.reflect("links",JSON.stringify(t))}get selected(){var t;return((t=g(this,ft))==null?void 0:t.getSelected())??null}select(t){var e;return(e=g(this,ft))==null||e.select(t),this}}ft=new WeakMap,c(fn,"observedAttributes",["nodes","links","readonly"]),c(fn,"hostStyles",":host { display: block; height: 320px; min-height: 200px; }");var St;class bn extends X{constructor(){super(...arguments);B(this,St,null)}render(){this.mountPoint.style.height="100%",D(this,St,new Hn({title:this.heading,height:this.numberAttr("height",180),close:this.boolAttr("closable")}));const t=document.createElement("slot");g(this,St).content.appendChild(t),g(this,St).on("closed",()=>{this.hidden=!0,this.emit("litegui-close",{})}),this.setComponent(g(this,St)),this.hidden=!1}onAttributeChanged(t){g(this,St)&&(t==="heading"&&g(this,St).setTitle(this.heading),t==="height"&&(g(this,St).root.style.height=`${this.numberAttr("height",180)}px`))}get heading(){return this.stringAttr("heading")}set heading(t){this.reflect("heading",t)}get height(){return this.numberAttr("height",180)}set height(t){this.reflect("height",t)}}St=new WeakMap,c(bn,"observedAttributes",["heading","height"]),c(bn,"hostStyles",":host { display: block; min-height: 120px; }");var Ct,re;class vn extends X{constructor(){super(...arguments);B(this,Ct,null);B(this,re,!1)}render(){D(this,Ct,new yi(this.value,{placeholder:this.placeholder||"Search",callback:t=>{g(this,re)||(this.reflect("value",t),this.emit("litegui-change",{value:t}))}})),this.setComponent(g(this,Ct)),g(this,Ct).input.value=this.value}onAttributeChanged(t){if(g(this,Ct)){if(t==="value"){D(this,re,!0),g(this,Ct).setValue(this.value),D(this,re,!1);return}if(t==="placeholder"){const e=this.placeholder||"Search";g(this,Ct).input.placeholder=e,g(this,Ct).input.setAttribute("aria-label",e)}}}get value(){return this.stringAttr("value")}set value(t){this.reflect("value",t)}get placeholder(){return this.stringAttr("placeholder")}set placeholder(t){this.reflect("placeholder",t)}}Ct=new WeakMap,re=new WeakMap,c(vn,"observedAttributes",["value","placeholder"]),c(vn,"hostStyles",":host { display: inline-block; min-width: 120px; }");var Lt,Ht,Rt;class xn extends X{constructor(){super(...arguments);B(this,Lt,null);B(this,Ht,null);B(this,Rt,!1)}render(){const t={min:this.min,max:this.max,step:this.optionalNumberAttr("step")};D(this,Ht,t),D(this,Lt,new wi(this.value,t)),g(this,Lt).onChange=e=>{g(this,Rt)||(this.reflect("value",e),this.emit("litegui-change",{value:e}))},this.setComponent(g(this,Lt)),g(this,Lt).setValue(this.value,!0)}onAttributeChanged(t){if(!(!g(this,Lt)||!g(this,Ht))){if(t==="value"){D(this,Rt,!0),g(this,Lt).setValue(this.value,!0),D(this,Rt,!1);return}if(t==="min"||t==="max"){g(this,Ht).min=this.min,g(this,Ht).max=this.max,D(this,Rt,!0),g(this,Lt).setRange(this.min,this.max),D(this,Rt,!1);return}t==="step"&&(g(this,Ht).step=this.optionalNumberAttr("step"))}}get value(){return this.numberAttr("value",0)}set value(t){this.reflect("value",t)}get min(){return this.numberAttr("min",0)}set min(t){this.reflect("min",t)}get max(){return this.numberAttr("max",1)}set max(t){this.reflect("max",t)}get step(){return this.optionalNumberAttr("step")}set step(t){this.reflect("step",t)}}Lt=new WeakMap,Ht=new WeakMap,Rt=new WeakMap,c(xn,"observedAttributes",["value","min","max","step"]),c(xn,"hostStyles",":host { display: block; min-width: 80px; padding: 2px 0; }");var ue,te,yn,Hi;class _n extends X{constructor(){super(...arguments);B(this,te);B(this,ue,null)}render(){this.mountPoint.style.height="100%",W(this,te,yn).call(this)}onAttributeChanged(t){g(this,ue)&&(t==="sections"||t==="vertical")&&W(this,te,yn).call(this)}get sections(){return Math.max(1,Math.round(this.numberAttr("sections",2)))}set sections(t){this.reflect("sections",t)}get vertical(){return this.boolAttr("vertical")}set vertical(t){this.reflect("vertical",t)}}ue=new WeakMap,te=new WeakSet,yn=function(){const t=this.sections,e=Array.from({length:t},()=>100/t),i=new ki(e,{vertical:this.vertical});D(this,ue,i);const o=new Set;i.sections.forEach((s,a)=>{const l=`section-${a}`;o.add(l);const d=document.createElement("slot");d.name=l,s.element.appendChild(d)}),this.setComponent(i),W(this,te,Hi).call(this,o,t)},Hi=function(t,e){let i=0;for(const o of Array.from(this.children)){const s=o.getAttribute("slot");(!s||!t.has(s))&&o.setAttribute("slot",`section-${i%e}`),i+=1}},c(_n,"observedAttributes",["sections","vertical"]),c(_n,"hostStyles",":host { display: block; height: 160px; min-height: 120px; }");var Zt,ge,Wt,xe,Ri;class wn extends X{constructor(){super(...arguments);B(this,Wt);B(this,Zt,null);B(this,ge,{})}render(){D(this,Zt,new jr),this.setComponent(g(this,Zt)),W(this,Wt,xe).call(this,"left"),W(this,Wt,xe).call(this,"right")}onAttributeChanged(t){g(this,Zt)&&(t==="left"||t==="right")&&W(this,Wt,xe).call(this,t)}get left(){return this.stringAttr("left")}set left(t){this.reflect("left",t)}get right(){return this.stringAttr("right")}set right(t){this.reflect("right",t)}}Zt=new WeakMap,ge=new WeakMap,Wt=new WeakSet,xe=function(t){const e=g(this,Zt);if(!e)return;const i=t==="left"?e.leftElement:e.rightElement;if(this.hasAttribute(t)){const s=this.getAttribute(t)??"";t==="left"?e.setLeft(s):e.setRight(W(this,Wt,Ri).call(this,s));return}let o=g(this,ge)[t];o||(o=document.createElement("slot"),o.name=t,g(this,ge)[t]=o),i.contains(o)||i.appendChild(o)},Ri=function(t){try{const e=JSON.parse(t);if(Array.isArray(e))return e.map(i=>typeof i=="string"?i:String(i))}catch{}return t.split(",").map(e=>e.trim()).filter(Boolean)},c(wn,"observedAttributes",["left","right"]),c(wn,"hostStyles",":host { display: block; }");var At;class kn extends X{constructor(){super(...arguments);B(this,At,null)}render(){D(this,At,new Ei({columns:this.columns,rows:this.rows,height:this.optionalNumberAttr("height"),scrollable:this.boolAttr("scrollable")})),this.setComponent(g(this,At)),this.mountPoint.appendChild(document.createElement("slot"))}onAttributeChanged(t){if(g(this,At))switch(t){case"columns":g(this,At).setColumns(this.columns);break;case"rows":g(this,At).setRows(this.rows);break;case"height":{const e=this.optionalNumberAttr("height");g(this,At).root.style.height=e===void 0?"":`${e}px`;break}case"scrollable":g(this,At).root.style.overflow=this.boolAttr("scrollable")?"auto":"";break}}get columns(){return this.jsonAttr("columns",[])}set columns(t){this.reflect("columns",JSON.stringify(t))}get rows(){return this.jsonAttr("rows",[])}set rows(t){this.reflect("rows",JSON.stringify(t))}get height(){return this.optionalNumberAttr("height")}set height(t){this.reflect("height",t)}get scrollable(){return this.boolAttr("scrollable")}set scrollable(t){this.reflect("scrollable",t)}}At=new WeakMap,c(kn,"observedAttributes",["columns","rows","height","scrollable"]),c(kn,"hostStyles",":host { display: block; min-height: 80px; }");let qc=0;var Tt,pe,Sn;class En extends X{constructor(){super(...arguments);B(this,pe);B(this,Tt,null)}render(){const t=new Se({id:`lg-tabs-${++qc}`,mode:this.mode,callback:e=>{this.emit("litegui-change",{id:e})}});D(this,Tt,t),this.setComponent(t),W(this,pe,Sn).call(this)}onAttributeChanged(t){g(this,Tt)&&(t==="tabs"?(g(this,Tt).clear(),W(this,pe,Sn).call(this)):t==="mode"&&(g(this,Tt).root.className=`lg-tabs lg-tabs--${this.mode}`))}get tabs(){return this.jsonAttr("tabs",[])}set tabs(t){this.reflect("tabs",JSON.stringify(t))}get mode(){return this.stringAttr("mode","horizontal")==="vertical"?"vertical":"horizontal"}set mode(t){this.reflect("mode",t)}get value(){var t;return((t=g(this,Tt))==null?void 0:t.getCurrentTabId())??null}selectTab(t){var e;return(e=g(this,Tt))==null||e.selectTab(t),this}}Tt=new WeakMap,pe=new WeakSet,Sn=function(){const t=g(this,Tt);if(!t)return;const e=this.jsonAttr("tabs",null);if(Array.isArray(e)){e.forEach((i,o)=>{const s=i.id||`tab-${o}`;t.addTab(s,{title:i.title??s,content:i.content,skip_callbacks:!0})});return}Array.from(this.children).forEach((i,o)=>{var d;const s=i.getAttribute("data-id")||i.id||`tab-${o}`,a=i.getAttribute("label")||i.getAttribute("title")||((d=i.textContent)==null?void 0:d.trim())||s;t.addTab(s,{title:a,skip_callbacks:!0}).content.appendChild(i)})},c(En,"observedAttributes",["tabs","mode"]),c(En,"hostStyles",":host { display: block; min-height: 140px; }");var st,Ut,Ae,Fi;class Cn extends X{constructor(){super(...arguments);B(this,Ae);B(this,st,null);B(this,Ut,!1)}render(){this.mountPoint.style.height="100%",D(this,st,new Wr({value:this.stringAttr("value"),language:this.language,readOnly:this.boolAttr("readonly")})),g(this,st).on("change",t=>{var i;if(g(this,Ut))return;const e=(t==null?void 0:t.value)??((i=g(this,st))==null?void 0:i.getValue())??"";this.emit("litegui-change",{value:e})}),g(this,st).on("cursor",t=>{if(g(this,Ut))return;const e=t;this.emit("litegui-cursor",{line:(e==null?void 0:e.line)??1,column:(e==null?void 0:e.column)??1})}),this.setComponent(g(this,st))}onAttributeChanged(t){if(g(this,st))switch(t){case"value":D(this,Ut,!0),g(this,st).setValue(this.stringAttr("value")),D(this,Ut,!1);break;case"language":W(this,Ae,Fi).call(this);break;case"readonly":g(this,st).setReadOnly(this.boolAttr("readonly"));break}}get value(){return g(this,st)?g(this,st).getValue():this.stringAttr("value")}set value(t){this.reflect("value",t)}get language(){return this.stringAttr("language","TypeScript")}set language(t){this.reflect("language",t)}get readonly(){return this.boolAttr("readonly")}set readonly(t){this.reflect("readonly",t)}focus(){var t;return(t=g(this,st))==null||t.focus(),this}}st=new WeakMap,Ut=new WeakMap,Ae=new WeakSet,Fi=function(){const t=g(this,st);if(!t)return;const e=t.language;t.language=this.language,t.root.querySelectorAll(".lg-text-editor__meta").forEach(i=>{var o;(o=i.textContent)!=null&&o.includes(e)&&(i.textContent=i.textContent.replace(e,this.language))})},c(Cn,"observedAttributes",["value","language","readonly"]),c(Cn,"hostStyles",":host { display: block; height: 280px; min-height: 160px; }");var dt,Ft;class Ln extends X{constructor(){super(...arguments);B(this,dt,null);B(this,Ft,!1)}render(){this.mountPoint.style.height="100%",D(this,dt,new qr({start:this.start,end:this.end,frame:this.frame,fps:this.fps,keyframes:this.keyframes}));const t=g(this,dt);t.on("frame",e=>{if(g(this,Ft))return;const i=Number(e);this.reflect("frame",i),this.emit("litegui-frame",{frame:t.getFrame()})}),t.on("play",e=>{this.emit("litegui-play",{playing:!!e})}),t.on("range",e=>{const i=e;this.reflect("start",i.start),this.reflect("end",i.end),this.emit("litegui-range",{start:i.start,end:i.end})}),this.setComponent(t)}onAttributeChanged(t){if(g(this,dt))switch(t){case"start":case"end":D(this,Ft,!0),g(this,dt).setRange(this.start,this.end,!1),D(this,Ft,!1);break;case"frame":D(this,Ft,!0),g(this,dt).setFrame(this.frame,!1),D(this,Ft,!1);break;case"fps":g(this,dt).setFps(this.fps);break;case"keyframes":g(this,dt).setKeyframes(this.keyframes);break}}get start(){return this.numberAttr("start",1)}set start(t){this.reflect("start",t)}get end(){return this.numberAttr("end",250)}set end(t){this.reflect("end",t)}get frame(){return this.numberAttr("frame",1)}set frame(t){this.reflect("frame",t)}get fps(){return this.numberAttr("fps",24)}set fps(t){this.reflect("fps",t)}get keyframes(){return this.jsonAttr("keyframes",[])}set keyframes(t){this.reflect("keyframes",JSON.stringify(t))}get currentFrame(){var t;return((t=g(this,dt))==null?void 0:t.getFrame())??this.frame}play(){var t;return(t=g(this,dt))==null||t.play(),this}onDisconnect(){var t;(t=g(this,dt))==null||t.pause()}pause(){var t;return(t=g(this,dt))==null||t.pause(),this}}dt=new WeakMap,Ft=new WeakMap,c(Ln,"observedAttributes",["start","end","frame","fps","keyframes"]),c(Ln,"hostStyles",":host { display: block; height: 160px; min-height: 120px; }");var Pt;class An extends X{constructor(){super(...arguments);B(this,Pt,null)}render(){D(this,Pt,new Yr({tools:this.tools,active:this.active})),g(this,Pt).on("change",t=>{const e=t==null?null:String(t);e&&this.reflect("active",e),this.emit("litegui-change",{id:e})}),this.setComponent(g(this,Pt))}onAttributeChanged(t){g(this,Pt)&&(t==="tools"&&g(this,Pt).setTools(this.tools),t==="active"&&g(this,Pt).setActive(this.active))}get tools(){return this.jsonAttr("tools",[])}set tools(t){this.reflect("tools",JSON.stringify(t))}get active(){return this.hasAttribute("active")?this.getAttribute("active"):null}set active(t){this.reflect("active",t)}}Pt=new WeakMap,c(An,"observedAttributes",["tools","active"]),c(An,"hostStyles",":host { display: inline-block; }");const Yc={id:"root",content:""};var _t,Vt,_e,Mn;class Tn extends X{constructor(){super(...arguments);B(this,Vt);B(this,_t,null)}render(){D(this,_t,new R(W(this,Vt,_e).call(this),{height:this.optionalNumberAttr("height"),allow_rename:this.boolAttr("allow-rename")})),g(this,_t).root.addEventListener("item_selected",t=>{var o;const e=t.detail,i=((o=e==null?void 0:e.data)==null?void 0:o.id)??"";this.emit("litegui-select",{id:i})}),this.setComponent(g(this,_t)),W(this,Vt,Mn).call(this)}onAttributeChanged(t){g(this,_t)&&(t==="data"?g(this,_t).updateTree(W(this,Vt,_e).call(this)):t==="height"?W(this,Vt,Mn).call(this):t==="allow-rename"&&(g(this,_t).options.allow_rename=this.boolAttr("allow-rename")))}get data(){return W(this,Vt,_e).call(this)}set data(t){this.reflect("data",JSON.stringify(t))}get height(){return this.optionalNumberAttr("height")}set height(t){this.reflect("height",t)}get allowRename(){return this.boolAttr("allow-rename")}set allowRename(t){this.reflect("allow-rename",t)}}_t=new WeakMap,Vt=new WeakSet,_e=function(){const t=this.jsonAttr("data",null);return Array.isArray(t)?{id:"root",content:"",children:t}:t??Yc},Mn=function(){if(!g(this,_t))return;const t=this.optionalNumberAttr("height");g(this,_t).root.style.height=t===void 0?"":`${t}px`},c(Tn,"observedAttributes",["data","height","allow-rename"]),c(Tn,"hostStyles",":host { display: block; min-height: 120px; }");var J;class zn extends X{constructor(){super(...arguments);B(this,J,null)}render(){this.mountPoint.style.height="100%",D(this,J,new Ur({objects:this.objects,selected:this.getAttribute("selected"),overlays:this.boolAttr("overlays"),sidebarOpen:this.boolAttr("sidebar-open"),shading:this.shading,editMode:this.boolAttr("edit-mode"),editElement:this.editElement,brush:this.getAttribute("brush")})),g(this,J).on("select",t=>{const e=t==null?null:String(t);this.reflect("selected",e),this.emit("litegui-select",{id:e})}),g(this,J).on("status",t=>{this.emit("litegui-status",{text:String(t??"")})}),g(this,J).on("context-menu",t=>{this.emit("litegui-contextmenu",t)}),g(this,J).on("change",()=>{var t;this.emit("litegui-change",{objects:((t=g(this,J))==null?void 0:t.getObjects())??[]})}),g(this,J).on("transform",t=>{this.emit("litegui-transform",t)}),this.setComponent(g(this,J))}onDisconnect(){var t;(t=g(this,J))==null||t.dispose(),D(this,J,null)}onReconnect(){this.render()}onAttributeChanged(t){if(g(this,J))switch(t){case"objects":g(this,J).setObjects(this.objects);break;case"selected":g(this,J).setSelected(this.getAttribute("selected"));break;case"overlays":g(this,J).setOverlays(this.boolAttr("overlays"));break;case"sidebar-open":g(this,J).setSidebarOpen(this.boolAttr("sidebar-open"));break;case"shading":g(this,J).setShading(this.shading);break;case"edit-mode":g(this,J).setEditMode(this.boolAttr("edit-mode"));break;case"edit-element":g(this,J).setEditElementMode(this.editElement);break;case"brush":{const e=this.getAttribute("brush");g(this,J).setBrush(e);break}}}get objects(){return this.jsonAttr("objects",[])}set objects(t){this.reflect("objects",JSON.stringify(t))}get selected(){return this.getAttribute("selected")}set selected(t){this.reflect("selected",t)}get overlays(){return this.boolAttr("overlays")}set overlays(t){this.reflect("overlays",t)}get sidebarOpen(){return this.boolAttr("sidebar-open")}set sidebarOpen(t){this.reflect("sidebar-open",t)}get shading(){return this.getAttribute("shading")||"solid"}set shading(t){this.reflect("shading",t)}get editMode(){return this.boolAttr("edit-mode")}set editMode(t){this.reflect("edit-mode",t)}get editElement(){return this.getAttribute("edit-element")||"vertex"}set editElement(t){this.reflect("edit-element",t)}select(t){var e;return this.reflect("selected",t),(e=g(this,J))==null||e.setSelected(t),this}frameAll(){var t;return(t=g(this,J))==null||t.frameAll(),this}focusSelection(){var t;return(t=g(this,J))==null||t.focusSelection(),this}setView(t,e,i){var o;return(o=g(this,J))==null||o.setView(t,e,i),this}zoom(t){var e;return(e=g(this,J))==null||e.zoom(t),this}snapshot(){var t;return((t=g(this,J))==null?void 0:t.snapshot())??""}}J=new WeakMap,c(zn,"observedAttributes",["objects","selected","overlays","sidebar-open","shading","edit-mode","edit-element","brush"]),c(zn,"hostStyles",":host { display: block; position: relative; height: 320px; min-height: 200px; }");const Xc={"lg-button":Ke,"lg-checkbox":Qe,"lg-slider":xn,"lg-searchbox":vn,"lg-dragger":sn,"lg-tabs":En,"lg-list":pn,"lg-table":kn,"lg-console":nn,"lg-complex-list":tn,"lg-tree":Tn,"lg-inspector":dn,"lg-line-editor":un,"lg-area":Je,"lg-split":_n,"lg-box":Pi,"lg-context-menu":rn,"lg-panel":bn,"lg-dialog":on,"lg-menu":Oi,"lg-menu-item":Wc,"lg-header-bar":an,"lg-status-bar":wn,"lg-timeline":Ln,"lg-toolbar":An,"lg-node-editor":fn,"lg-text-editor":Cn,"lg-image-editor":cn,"lg-viewport":zn};function Zc(r){const n=typeof customElements<"u"?customElements:null;if(n)for(const[t,e]of Object.entries(Xc))n.get(t)||n.define(t,e)}typeof customElements<"u"&&Zc();if(typeof document<"u"){const r=()=>{document.documentElement.dataset.lgTheme=document.documentElement.classList.contains("dark")?"dark":"light"};r(),new MutationObserver(r).observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}const Gc={extends:Mc,enhanceApp({app:r}){r.component("ComponentDemo",$c),r.component("ComponentGallery",Oc)}};export{we as A,Dn as B,pi as C,le as D,mr as H,Ye as L,Ee as M,Hn as P,Gc as R,yi as S,Ei as T,Ur as V,fi as a,bi as b,_i as c,wi as d,ki as e,jr as f,Se as g,Yr as h,ul as i,mi as j,ae as k,xi as l,F as u};
