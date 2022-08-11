import { LiteGUIWidget } from "../types/core";

export function purgeElement(d: LiteGUIWidget) {
  let a = d.attributes
  let i;
  let l;
  let n;

  if (a) {
    for (i = a.length - 1; i >= 0; i -= 1) {
      n = a[i].name;
      if (typeof d[n] === "function") {
        d[n] = null;
      }
    }
  }

  a = d.childNodes;
  if (a) {
    l = a.length;
    for (i = 0; i < l; i += 1) {
      purgeElement(d.childNodes[i]);
    }
  }
}

const RESERVED = [
  "abstract",
  "else",
  "instanceof",
  "super",
  "boolean",
  "enum",
  "int",
  "switch",
  "break",
  "export",
  "interface",
  "synchronized",
  "byte",
  "extends",
  "let",
  "this",
  "case",
  "false",
  "long",
  "throw",
  "catch",
  "final",
  "native",
  "throws",
  "char",
  "finally",
  "new",
  "transient",
  "class",
  "float",
  "null",
  "true",
  "const",
  "for",
  "package",
  "try",
  "continue",
  "function",
  "private",
  "typeof",
  "debugger",
  "goto",
  "protected",
  "var",
  "default",
  "if",
  "public",
  "void",
  "delete",
  "implements",
  "return",
  "volatile",
  "do",
  "import",
  "short",
  "while",
  "double",
  "in",
  "static",
  "with",
]
export function beautifyCode(code: string, reserved: string[], skip_css: boolean) {
  reserved = reserved || RESERVED;

  //reserved words
  code = code.replace(/\b(\w+)\b/g, function (v) {
    if (reserved.indexOf(v) != -1) return "<span class='rsv'>" + v + "</span>";
    return v;
  });

  //numbers
  code = code.replace(/\b([0-9]+)\b/g, function (v) {
    return "<span class='num'>" + v + "</span>";
  });

  //obj.method
  code = code.replace(/(\w+\.\w+)/g, function (v) {
    var t = v.split(".");
    return "<span class='obj'>" + t[0] + "</span>.<span class='prop'>" + t[1] + "</span>";
  });

  //function
  code = code.replace(/(\w+)\(/g, function (v) {
    return "<span class='prop'>" + v.substr(0, v.length - 1) + "</span>(";
  });

  //strings
  code = code.replace(/(\"(\\.|[^\"])*\")/g, function (v) {
    return "<span class='str'>" + v + "</span>";
  });

  //comments
  code = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, function (v) {
    ///(\/\/[a-zA-Z0-9\?\!\(\)_ ]*)/g
    return "<span class='cmnt'>" + v.replace(/<[^>]*>/g, "") + "</span>";
  });

  if (!skip_css)
    code =
      "<style>.obj { color: #79B; } .prop { color: #B97; }	.str,.num { color: #A79; } .cmnt { color: #798; } .rsv { color: #9AB; } </style>" +
      code;

  return code;
}

export function beautifyJSON(code: string, skip_css: boolean) {
  if (typeof code == "object") code = JSON.stringify(code);

  var reserved = ["false", "true", "null"];

  //reserved words
  code = code.replace(/(\w+)/g, function (v) {
    if (reserved.indexOf(v) != -1) return "<span class='rsv'>" + v + "</span>";
    return v;
  });

  //numbers
  code = code.replace(/([0-9]+)/g, function (v) {
    return "<span class='num'>" + v + "</span>";
  });

  //obj.method
  code = code.replace(/(\w+\.\w+)/g, function (v) {
    var t = v.split(".");
    return "<span class='obj'>" + t[0] + "</span>.<span class='prop'>" + t[1] + "</span>";
  });

  //strings
  code = code.replace(/(\"(\\.|[^\"])*\")/g, function (v) {
    return "<span class='str'>" + v + "</span>";
  });

  //comments
  code = code.replace(/(\/\/[a-zA-Z0-9\?\!\(\)_ ]*)/g, function (v) {
    return "<span class='cmnt'>" + v + "</span>";
  });

  if (!skip_css)
    code =
      "<style>.obj { color: #79B; } .prop { color: #B97; }	.str { color: #A79; } .num { color: #B97; } .cmnt { color: #798; } .rsv { color: #9AB; } </style>" +
      code;

  return code;
}

export function dataURItoBlob(dataURI: string): Blob {
  var pos = dataURI.indexOf(",");
  //convert to binary
  var byteString = atob(dataURI.substr(pos + 1));
  //copy from string to array
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  var l = byteString.length;
  for (var i = 0; i < l; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  var mime = dataURI.substr(5, pos - 5);
  mime = mime.substr(0, mime.length - 7); //strip ";base64"
  return new Blob([ab], { type: mime });
}

// low quality templating system

Object.defineProperty(String.prototype, "template", {
  value: function (data: any, eval_code: string) {
    var tpl = this;
    var re = /{{([^}}]+)?}}/g,
      match;
    while ((match = re.exec(tpl))) {
      var str = eval_code
        ? new Function("with(this) { try { return " + match[1] + "} catch(e) { return 'error';} }").call(data)
        : data[match[1]];
      tpl = tpl.replace(match[0], str);
    }
    return tpl;
  },
  enumerable: false,
});
