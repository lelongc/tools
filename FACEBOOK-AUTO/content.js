/*! For license information please see content.js.LICENSE.txt */
(()=>{var e={692:function(e,t){var n;!function(t,n){"use strict";"object"==typeof e.exports?e.exports=t.document?n(t,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return n(e)}:n(t)}("undefined"!=typeof window?window:this,function(o,r){"use strict";var i=[],a=Object.getPrototypeOf,s=i.slice,l=i.flat?function(e){return i.flat.call(e)}:function(e){return i.concat.apply([],e)},c=i.push,u=i.indexOf,d={},f=d.toString,p=d.hasOwnProperty,h=p.toString,g=h.call(Object),m={},y=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},v=function(e){return null!=e&&e===e.window},b=o.document,x={type:!0,src:!0,nonce:!0,noModule:!0};function w(e,t,n){var o,r,i=(n=n||b).createElement("script");if(i.text=e,t)for(o in x)(r=t[o]||t.getAttribute&&t.getAttribute(o))&&i.setAttribute(o,r);n.head.appendChild(i).parentNode.removeChild(i)}function T(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?d[f.call(e)]||"object":typeof e}var k="3.7.1",S=/HTML$/i,C=function(e,t){return new C.fn.init(e,t)};function E(e){var t=!!e&&"length"in e&&e.length,n=T(e);return!y(e)&&!v(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}C.fn=C.prototype={jquery:k,constructor:C,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=C.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return C.each(this,e)},map:function(e){return this.pushStack(C.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(C.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(C.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:c,sort:i.sort,splice:i.splice},C.extend=C.fn.extend=function(){var e,t,n,o,r,i,a=arguments[0]||{},s=1,l=arguments.length,c=!1;for("boolean"==typeof a&&(c=a,a=arguments[s]||{},s++),"object"==typeof a||y(a)||(a={}),s===l&&(a=this,s--);s<l;s++)if(null!=(e=arguments[s]))for(t in e)o=e[t],"__proto__"!==t&&a!==o&&(c&&o&&(C.isPlainObject(o)||(r=Array.isArray(o)))?(n=a[t],i=r&&!Array.isArray(n)?[]:r||C.isPlainObject(n)?n:{},r=!1,a[t]=C.extend(c,i,o)):void 0!==o&&(a[t]=o));return a},C.extend({expando:"jQuery"+(k+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==f.call(e)||(t=a(e))&&("function"!=typeof(n=p.call(t,"constructor")&&t.constructor)||h.call(n)!==g))},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){w(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,o=0;if(E(e))for(n=e.length;o<n&&!1!==t.call(e[o],o,e[o]);o++);else for(o in e)if(!1===t.call(e[o],o,e[o]))break;return e},text:function(e){var t,n="",o=0,r=e.nodeType;if(!r)for(;t=e[o++];)n+=C.text(t);return 1===r||11===r?e.textContent:9===r?e.documentElement.textContent:3===r||4===r?e.nodeValue:n},makeArray:function(e,t){var n=t||[];return null!=e&&(E(Object(e))?C.merge(n,"string"==typeof e?[e]:e):c.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},isXMLDoc:function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!S.test(t||n&&n.nodeName||"HTML")},merge:function(e,t){for(var n=+t.length,o=0,r=e.length;o<n;o++)e[r++]=t[o];return e.length=r,e},grep:function(e,t,n){for(var o=[],r=0,i=e.length,a=!n;r<i;r++)!t(e[r],r)!==a&&o.push(e[r]);return o},map:function(e,t,n){var o,r,i=0,a=[];if(E(e))for(o=e.length;i<o;i++)null!=(r=t(e[i],i,n))&&a.push(r);else for(i in e)null!=(r=t(e[i],i,n))&&a.push(r);return l(a)},guid:1,support:m}),"function"==typeof Symbol&&(C.fn[Symbol.iterator]=i[Symbol.iterator]),C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){d["[object "+t+"]"]=t.toLowerCase()});var j=i.pop,D=i.sort,q=i.splice,L="[\\x20\\t\\r\\n\\f]",N=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g");C.contains=function(e,t){var n=t&&t.parentNode;return e===n||!(!n||1!==n.nodeType||!(e.contains?e.contains(n):e.compareDocumentPosition&&16&e.compareDocumentPosition(n)))};var P=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;function O(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e}C.escapeSelector=function(e){return(e+"").replace(P,O)};var H=b,M=c;!function(){var e,t,n,r,a,l,c,d,f,h,g=M,y=C.expando,v=0,b=0,x=ee(),w=ee(),T=ee(),k=ee(),S=function(e,t){return e===t&&(a=!0),0},E="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="(?:\\\\[\\da-fA-F]{1,6}"+L+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",O="\\["+L+"*("+P+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+P+"))|)"+L+"*\\]",$=":("+P+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",_=new RegExp(L+"+","g"),R=new RegExp("^"+L+"*,"+L+"*"),F=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),I=new RegExp(L+"|>"),W=new RegExp($),B=new RegExp("^"+P+"$"),z={ID:new RegExp("^#("+P+")"),CLASS:new RegExp("^\\.("+P+")"),TAG:new RegExp("^("+P+"|[*])"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+$),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+E+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},U=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,V=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,G=/[+~]/,Y=new RegExp("\\\\[\\da-fA-F]{1,6}"+L+"?|\\\\([^\\r\\n\\f])","g"),J=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},Q=function(){le()},K=fe(function(e){return!0===e.disabled&&A(e,"fieldset")},{dir:"parentNode",next:"legend"});try{g.apply(i=s.call(H.childNodes),H.childNodes),i[H.childNodes.length].nodeType}catch(e){g={apply:function(e,t){M.apply(e,s.call(t))},call:function(e){M.apply(e,s.call(arguments,1))}}}function Z(e,t,n,o){var r,i,a,s,c,u,p,h=t&&t.ownerDocument,v=t?t.nodeType:9;if(n=n||[],"string"!=typeof e||!e||1!==v&&9!==v&&11!==v)return n;if(!o&&(le(t),t=t||l,d)){if(11!==v&&(c=V.exec(e)))if(r=c[1]){if(9===v){if(!(a=t.getElementById(r)))return n;if(a.id===r)return g.call(n,a),n}else if(h&&(a=h.getElementById(r))&&Z.contains(t,a)&&a.id===r)return g.call(n,a),n}else{if(c[2])return g.apply(n,t.getElementsByTagName(e)),n;if((r=c[3])&&t.getElementsByClassName)return g.apply(n,t.getElementsByClassName(r)),n}if(!(k[e+" "]||f&&f.test(e))){if(p=e,h=t,1===v&&(I.test(e)||F.test(e))){for((h=G.test(e)&&se(t.parentNode)||t)==t&&m.scope||((s=t.getAttribute("id"))?s=C.escapeSelector(s):t.setAttribute("id",s=y)),i=(u=ue(e)).length;i--;)u[i]=(s?"#"+s:":scope")+" "+de(u[i]);p=u.join(",")}try{return g.apply(n,h.querySelectorAll(p)),n}catch(t){k(e,!0)}finally{s===y&&t.removeAttribute("id")}}}return ve(e.replace(N,"$1"),t,n,o)}function ee(){var e=[];return function n(o,r){return e.push(o+" ")>t.cacheLength&&delete n[e.shift()],n[o+" "]=r}}function te(e){return e[y]=!0,e}function ne(e){var t=l.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function oe(e){return function(t){return A(t,"input")&&t.type===e}}function re(e){return function(t){return(A(t,"input")||A(t,"button"))&&t.type===e}}function ie(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&K(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function ae(e){return te(function(t){return t=+t,te(function(n,o){for(var r,i=e([],n.length,t),a=i.length;a--;)n[r=i[a]]&&(n[r]=!(o[r]=n[r]))})})}function se(e){return e&&void 0!==e.getElementsByTagName&&e}function le(e){var n,o=e?e.ownerDocument||e:H;return o!=l&&9===o.nodeType&&o.documentElement?(c=(l=o).documentElement,d=!C.isXMLDoc(l),h=c.matches||c.webkitMatchesSelector||c.msMatchesSelector,c.msMatchesSelector&&H!=l&&(n=l.defaultView)&&n.top!==n&&n.addEventListener("unload",Q),m.getById=ne(function(e){return c.appendChild(e).id=C.expando,!l.getElementsByName||!l.getElementsByName(C.expando).length}),m.disconnectedMatch=ne(function(e){return h.call(e,"*")}),m.scope=ne(function(){return l.querySelectorAll(":scope")}),m.cssHas=ne(function(){try{return l.querySelector(":has(*,:jqfake)"),!1}catch(e){return!0}}),m.getById?(t.filter.ID=function(e){var t=e.replace(Y,J);return function(e){return e.getAttribute("id")===t}},t.find.ID=function(e,t){if(void 0!==t.getElementById&&d){var n=t.getElementById(e);return n?[n]:[]}}):(t.filter.ID=function(e){var t=e.replace(Y,J);return function(e){var n=void 0!==e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},t.find.ID=function(e,t){if(void 0!==t.getElementById&&d){var n,o,r,i=t.getElementById(e);if(i){if((n=i.getAttributeNode("id"))&&n.value===e)return[i];for(r=t.getElementsByName(e),o=0;i=r[o++];)if((n=i.getAttributeNode("id"))&&n.value===e)return[i]}return[]}}),t.find.TAG=function(e,t){return void 0!==t.getElementsByTagName?t.getElementsByTagName(e):t.querySelectorAll(e)},t.find.CLASS=function(e,t){if(void 0!==t.getElementsByClassName&&d)return t.getElementsByClassName(e)},f=[],ne(function(e){var t;c.appendChild(e).innerHTML="<a id='"+y+"' href='' disabled='disabled'></a><select id='"+y+"-\r\\' disabled='disabled'><option selected=''></option></select>",e.querySelectorAll("[selected]").length||f.push("\\["+L+"*(?:value|"+E+")"),e.querySelectorAll("[id~="+y+"-]").length||f.push("~="),e.querySelectorAll("a#"+y+"+*").length||f.push(".#.+[+~]"),e.querySelectorAll(":checked").length||f.push(":checked"),(t=l.createElement("input")).setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),c.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&f.push(":enabled",":disabled"),(t=l.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||f.push("\\["+L+"*name"+L+"*="+L+"*(?:''|\"\")")}),m.cssHas||f.push(":has"),f=f.length&&new RegExp(f.join("|")),S=function(e,t){if(e===t)return a=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!m.sortDetached&&t.compareDocumentPosition(e)===n?e===l||e.ownerDocument==H&&Z.contains(H,e)?-1:t===l||t.ownerDocument==H&&Z.contains(H,t)?1:r?u.call(r,e)-u.call(r,t):0:4&n?-1:1)},l):l}for(e in Z.matches=function(e,t){return Z(e,null,null,t)},Z.matchesSelector=function(e,t){if(le(e),d&&!k[t+" "]&&(!f||!f.test(t)))try{var n=h.call(e,t);if(n||m.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){k(t,!0)}return Z(t,l,null,[e]).length>0},Z.contains=function(e,t){return(e.ownerDocument||e)!=l&&le(e),C.contains(e,t)},Z.attr=function(e,n){(e.ownerDocument||e)!=l&&le(e);var o=t.attrHandle[n.toLowerCase()],r=o&&p.call(t.attrHandle,n.toLowerCase())?o(e,n,!d):void 0;return void 0!==r?r:e.getAttribute(n)},Z.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},C.uniqueSort=function(e){var t,n=[],o=0,i=0;if(a=!m.sortStable,r=!m.sortStable&&s.call(e,0),D.call(e,S),a){for(;t=e[i++];)t===e[i]&&(o=n.push(i));for(;o--;)q.call(e,n[o],1)}return r=null,e},C.fn.uniqueSort=function(){return this.pushStack(C.uniqueSort(s.apply(this)))},t=C.expr={cacheLength:50,createPseudo:te,match:z,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Y,J),e[3]=(e[3]||e[4]||e[5]||"").replace(Y,J),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||Z.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&Z.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return z.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&W.test(n)&&(t=ue(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Y,J).toLowerCase();return"*"===e?function(){return!0}:function(e){return A(e,t)}},CLASS:function(e){var t=x[e+" "];return t||(t=new RegExp("(^|"+L+")"+e+"("+L+"|$)"))&&x(e,function(e){return t.test("string"==typeof e.className&&e.className||void 0!==e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(o){var r=Z.attr(o,e);return null==r?"!="===t:!t||(r+="","="===t?r===n:"!="===t?r!==n:"^="===t?n&&0===r.indexOf(n):"*="===t?n&&r.indexOf(n)>-1:"$="===t?n&&r.slice(-n.length)===n:"~="===t?(" "+r.replace(_," ")+" ").indexOf(n)>-1:"|="===t&&(r===n||r.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,o,r){var i="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===o&&0===r?function(e){return!!e.parentNode}:function(t,n,l){var c,u,d,f,p,h=i!==a?"nextSibling":"previousSibling",g=t.parentNode,m=s&&t.nodeName.toLowerCase(),b=!l&&!s,x=!1;if(g){if(i){for(;h;){for(d=t;d=d[h];)if(s?A(d,m):1===d.nodeType)return!1;p=h="only"===e&&!p&&"nextSibling"}return!0}if(p=[a?g.firstChild:g.lastChild],a&&b){for(x=(f=(c=(u=g[y]||(g[y]={}))[e]||[])[0]===v&&c[1])&&c[2],d=f&&g.childNodes[f];d=++f&&d&&d[h]||(x=f=0)||p.pop();)if(1===d.nodeType&&++x&&d===t){u[e]=[v,f,x];break}}else if(b&&(x=f=(c=(u=t[y]||(t[y]={}))[e]||[])[0]===v&&c[1]),!1===x)for(;(d=++f&&d&&d[h]||(x=f=0)||p.pop())&&(!(s?A(d,m):1===d.nodeType)||!++x||(b&&((u=d[y]||(d[y]={}))[e]=[v,x]),d!==t)););return(x-=r)===o||x%o===0&&x/o>=0}}},PSEUDO:function(e,n){var o,r=t.pseudos[e]||t.setFilters[e.toLowerCase()]||Z.error("unsupported pseudo: "+e);return r[y]?r(n):r.length>1?(o=[e,e,"",n],t.setFilters.hasOwnProperty(e.toLowerCase())?te(function(e,t){for(var o,i=r(e,n),a=i.length;a--;)e[o=u.call(e,i[a])]=!(t[o]=i[a])}):function(e){return r(e,0,o)}):r}},pseudos:{not:te(function(e){var t=[],n=[],o=ye(e.replace(N,"$1"));return o[y]?te(function(e,t,n,r){for(var i,a=o(e,null,r,[]),s=e.length;s--;)(i=a[s])&&(e[s]=!(t[s]=i))}):function(e,r,i){return t[0]=e,o(t,null,i,n),t[0]=null,!n.pop()}}),has:te(function(e){return function(t){return Z(e,t).length>0}}),contains:te(function(e){return e=e.replace(Y,J),function(t){return(t.textContent||C.text(t)).indexOf(e)>-1}}),lang:te(function(e){return B.test(e||"")||Z.error("unsupported lang: "+e),e=e.replace(Y,J).toLowerCase(),function(t){var n;do{if(n=d?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(e){var t=o.location&&o.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===c},focus:function(e){return e===function(){try{return l.activeElement}catch(e){}}()&&l.hasFocus()&&!!(e.type||e.href||~e.tabIndex)},enabled:ie(!1),disabled:ie(!0),checked:function(e){return A(e,"input")&&!!e.checked||A(e,"option")&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!t.pseudos.empty(e)},header:function(e){return X.test(e.nodeName)},input:function(e){return U.test(e.nodeName)},button:function(e){return A(e,"input")&&"button"===e.type||A(e,"button")},text:function(e){var t;return A(e,"input")&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ae(function(){return[0]}),last:ae(function(e,t){return[t-1]}),eq:ae(function(e,t,n){return[n<0?n+t:n]}),even:ae(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ae(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ae(function(e,t,n){var o;for(o=n<0?n+t:n>t?t:n;--o>=0;)e.push(o);return e}),gt:ae(function(e,t,n){for(var o=n<0?n+t:n;++o<t;)e.push(o);return e})}},t.pseudos.nth=t.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})t.pseudos[e]=oe(e);for(e in{submit:!0,reset:!0})t.pseudos[e]=re(e);function ce(){}function ue(e,n){var o,r,i,a,s,l,c,u=w[e+" "];if(u)return n?0:u.slice(0);for(s=e,l=[],c=t.preFilter;s;){for(a in o&&!(r=R.exec(s))||(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),o=!1,(r=F.exec(s))&&(o=r.shift(),i.push({value:o,type:r[0].replace(N," ")}),s=s.slice(o.length)),t.filter)!(r=z[a].exec(s))||c[a]&&!(r=c[a](r))||(o=r.shift(),i.push({value:o,type:a,matches:r}),s=s.slice(o.length));if(!o)break}return n?s.length:s?Z.error(e):w(e,l).slice(0)}function de(e){for(var t=0,n=e.length,o="";t<n;t++)o+=e[t].value;return o}function fe(e,t,n){var o=t.dir,r=t.next,i=r||o,a=n&&"parentNode"===i,s=b++;return t.first?function(t,n,r){for(;t=t[o];)if(1===t.nodeType||a)return e(t,n,r);return!1}:function(t,n,l){var c,u,d=[v,s];if(l){for(;t=t[o];)if((1===t.nodeType||a)&&e(t,n,l))return!0}else for(;t=t[o];)if(1===t.nodeType||a)if(u=t[y]||(t[y]={}),r&&A(t,r))t=t[o]||t;else{if((c=u[i])&&c[0]===v&&c[1]===s)return d[2]=c[2];if(u[i]=d,d[2]=e(t,n,l))return!0}return!1}}function pe(e){return e.length>1?function(t,n,o){for(var r=e.length;r--;)if(!e[r](t,n,o))return!1;return!0}:e[0]}function he(e,t,n,o,r){for(var i,a=[],s=0,l=e.length,c=null!=t;s<l;s++)(i=e[s])&&(n&&!n(i,o,r)||(a.push(i),c&&t.push(s)));return a}function ge(e,t,n,o,r,i){return o&&!o[y]&&(o=ge(o)),r&&!r[y]&&(r=ge(r,i)),te(function(i,a,s,l){var c,d,f,p,h=[],m=[],y=a.length,v=i||function(e,t,n){for(var o=0,r=t.length;o<r;o++)Z(e,t[o],n);return n}(t||"*",s.nodeType?[s]:s,[]),b=!e||!i&&t?v:he(v,h,e,s,l);if(n?n(b,p=r||(i?e:y||o)?[]:a,s,l):p=b,o)for(c=he(p,m),o(c,[],s,l),d=c.length;d--;)(f=c[d])&&(p[m[d]]=!(b[m[d]]=f));if(i){if(r||e){if(r){for(c=[],d=p.length;d--;)(f=p[d])&&c.push(b[d]=f);r(null,p=[],c,l)}for(d=p.length;d--;)(f=p[d])&&(c=r?u.call(i,f):h[d])>-1&&(i[c]=!(a[c]=f))}}else p=he(p===a?p.splice(y,p.length):p),r?r(null,a,p,l):g.apply(a,p)})}function me(e){for(var o,r,i,a=e.length,s=t.relative[e[0].type],l=s||t.relative[" "],c=s?1:0,d=fe(function(e){return e===o},l,!0),f=fe(function(e){return u.call(o,e)>-1},l,!0),p=[function(e,t,r){var i=!s&&(r||t!=n)||((o=t).nodeType?d(e,t,r):f(e,t,r));return o=null,i}];c<a;c++)if(r=t.relative[e[c].type])p=[fe(pe(p),r)];else{if((r=t.filter[e[c].type].apply(null,e[c].matches))[y]){for(i=++c;i<a&&!t.relative[e[i].type];i++);return ge(c>1&&pe(p),c>1&&de(e.slice(0,c-1).concat({value:" "===e[c-2].type?"*":""})).replace(N,"$1"),r,c<i&&me(e.slice(c,i)),i<a&&me(e=e.slice(i)),i<a&&de(e))}p.push(r)}return pe(p)}function ye(e,o){var r,i=[],a=[],s=T[e+" "];if(!s){for(o||(o=ue(e)),r=o.length;r--;)(s=me(o[r]))[y]?i.push(s):a.push(s);s=T(e,function(e,o){var r=o.length>0,i=e.length>0,a=function(a,s,c,u,f){var p,h,m,y=0,b="0",x=a&&[],w=[],T=n,k=a||i&&t.find.TAG("*",f),S=v+=null==T?1:Math.random()||.1,E=k.length;for(f&&(n=s==l||s||f);b!==E&&null!=(p=k[b]);b++){if(i&&p){for(h=0,s||p.ownerDocument==l||(le(p),c=!d);m=e[h++];)if(m(p,s||l,c)){g.call(u,p);break}f&&(v=S)}r&&((p=!m&&p)&&y--,a&&x.push(p))}if(y+=b,r&&b!==y){for(h=0;m=o[h++];)m(x,w,s,c);if(a){if(y>0)for(;b--;)x[b]||w[b]||(w[b]=j.call(u));w=he(w)}g.apply(u,w),f&&!a&&w.length>0&&y+o.length>1&&C.uniqueSort(u)}return f&&(v=S,n=T),x};return r?te(a):a}(a,i)),s.selector=e}return s}function ve(e,n,o,r){var i,a,s,l,c,u="function"==typeof e&&e,f=!r&&ue(e=u.selector||e);if(o=o||[],1===f.length){if((a=f[0]=f[0].slice(0)).length>2&&"ID"===(s=a[0]).type&&9===n.nodeType&&d&&t.relative[a[1].type]){if(!(n=(t.find.ID(s.matches[0].replace(Y,J),n)||[])[0]))return o;u&&(n=n.parentNode),e=e.slice(a.shift().value.length)}for(i=z.needsContext.test(e)?0:a.length;i--&&(s=a[i],!t.relative[l=s.type]);)if((c=t.find[l])&&(r=c(s.matches[0].replace(Y,J),G.test(a[0].type)&&se(n.parentNode)||n))){if(a.splice(i,1),!(e=r.length&&de(a)))return g.apply(o,r),o;break}}return(u||ye(e,f))(r,n,!d,o,!n||G.test(e)&&se(n.parentNode)||n),o}ce.prototype=t.filters=t.pseudos,t.setFilters=new ce,m.sortStable=y.split("").sort(S).join("")===y,le(),m.sortDetached=ne(function(e){return 1&e.compareDocumentPosition(l.createElement("fieldset"))}),C.find=Z,C.expr[":"]=C.expr.pseudos,C.unique=C.uniqueSort,Z.compile=ye,Z.select=ve,Z.setDocument=le,Z.tokenize=ue,Z.escape=C.escapeSelector,Z.getText=C.text,Z.isXML=C.isXMLDoc,Z.selectors=C.expr,Z.support=C.support,Z.uniqueSort=C.uniqueSort}();var $=function(e,t,n){for(var o=[],r=void 0!==n;(e=e[t])&&9!==e.nodeType;)if(1===e.nodeType){if(r&&C(e).is(n))break;o.push(e)}return o},_=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},R=C.expr.match.needsContext,F=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function I(e,t,n){return y(t)?C.grep(e,function(e,o){return!!t.call(e,o,e)!==n}):t.nodeType?C.grep(e,function(e){return e===t!==n}):"string"!=typeof t?C.grep(e,function(e){return u.call(t,e)>-1!==n}):C.filter(t,e,n)}C.filter=function(e,t,n){var o=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===o.nodeType?C.find.matchesSelector(o,e)?[o]:[]:C.find.matches(e,C.grep(t,function(e){return 1===e.nodeType}))},C.fn.extend({find:function(e){var t,n,o=this.length,r=this;if("string"!=typeof e)return this.pushStack(C(e).filter(function(){for(t=0;t<o;t++)if(C.contains(r[t],this))return!0}));for(n=this.pushStack([]),t=0;t<o;t++)C.find(e,r[t],n);return o>1?C.uniqueSort(n):n},filter:function(e){return this.pushStack(I(this,e||[],!1))},not:function(e){return this.pushStack(I(this,e||[],!0))},is:function(e){return!!I(this,"string"==typeof e&&R.test(e)?C(e):e||[],!1).length}});var W,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(C.fn.init=function(e,t,n){var o,r;if(!e)return this;if(n=n||W,"string"==typeof e){if(!(o="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:B.exec(e))||!o[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(o[1]){if(t=t instanceof C?t[0]:t,C.merge(this,C.parseHTML(o[1],t&&t.nodeType?t.ownerDocument||t:b,!0)),F.test(o[1])&&C.isPlainObject(t))for(o in t)y(this[o])?this[o](t[o]):this.attr(o,t[o]);return this}return(r=b.getElementById(o[2]))&&(this[0]=r,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):y(e)?void 0!==n.ready?n.ready(e):e(C):C.makeArray(e,this)}).prototype=C.fn,W=C(b);var z=/^(?:parents|prev(?:Until|All))/,U={children:!0,contents:!0,next:!0,prev:!0};function X(e,t){for(;(e=e[t])&&1!==e.nodeType;);return e}C.fn.extend({has:function(e){var t=C(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(C.contains(this,t[e]))return!0})},closest:function(e,t){var n,o=0,r=this.length,i=[],a="string"!=typeof e&&C(e);if(!R.test(e))for(;o<r;o++)for(n=this[o];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&C.find.matchesSelector(n,e))){i.push(n);break}return this.pushStack(i.length>1?C.uniqueSort(i):i)},index:function(e){return e?"string"==typeof e?u.call(C(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(C.uniqueSort(C.merge(this.get(),C(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),C.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return $(e,"parentNode")},parentsUntil:function(e,t,n){return $(e,"parentNode",n)},next:function(e){return X(e,"nextSibling")},prev:function(e){return X(e,"previousSibling")},nextAll:function(e){return $(e,"nextSibling")},prevAll:function(e){return $(e,"previousSibling")},nextUntil:function(e,t,n){return $(e,"nextSibling",n)},prevUntil:function(e,t,n){return $(e,"previousSibling",n)},siblings:function(e){return _((e.parentNode||{}).firstChild,e)},children:function(e){return _(e.firstChild)},contents:function(e){return null!=e.contentDocument&&a(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),C.merge([],e.childNodes))}},function(e,t){C.fn[e]=function(n,o){var r=C.map(this,t,n);return"Until"!==e.slice(-5)&&(o=n),o&&"string"==typeof o&&(r=C.filter(o,r)),this.length>1&&(U[e]||C.uniqueSort(r),z.test(e)&&r.reverse()),this.pushStack(r)}});var V=/[^\x20\t\r\n\f]+/g;function G(e){return e}function Y(e){throw e}function J(e,t,n,o){var r;try{e&&y(r=e.promise)?r.call(e).done(t).fail(n):e&&y(r=e.then)?r.call(e,t,n):t.apply(void 0,[e].slice(o))}catch(e){n.apply(void 0,[e])}}C.Callbacks=function(e){e="string"==typeof e?function(e){var t={};return C.each(e.match(V)||[],function(e,n){t[n]=!0}),t}(e):C.extend({},e);var t,n,o,r,i=[],a=[],s=-1,l=function(){for(r=r||e.once,o=t=!0;a.length;s=-1)for(n=a.shift();++s<i.length;)!1===i[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=i.length,n=!1);e.memory||(n=!1),t=!1,r&&(i=n?[]:"")},c={add:function(){return i&&(n&&!t&&(s=i.length-1,a.push(n)),function t(n){C.each(n,function(n,o){y(o)?e.unique&&c.has(o)||i.push(o):o&&o.length&&"string"!==T(o)&&t(o)})}(arguments),n&&!t&&l()),this},remove:function(){return C.each(arguments,function(e,t){for(var n;(n=C.inArray(t,i,n))>-1;)i.splice(n,1),n<=s&&s--}),this},has:function(e){return e?C.inArray(e,i)>-1:i.length>0},empty:function(){return i&&(i=[]),this},disable:function(){return r=a=[],i=n="",this},disabled:function(){return!i},lock:function(){return r=a=[],n||t||(i=n=""),this},locked:function(){return!!r},fireWith:function(e,n){return r||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||l()),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!o}};return c},C.extend({Deferred:function(e){var t=[["notify","progress",C.Callbacks("memory"),C.Callbacks("memory"),2],["resolve","done",C.Callbacks("once memory"),C.Callbacks("once memory"),0,"resolved"],["reject","fail",C.Callbacks("once memory"),C.Callbacks("once memory"),1,"rejected"]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},catch:function(e){return r.then(null,e)},pipe:function(){var e=arguments;return C.Deferred(function(n){C.each(t,function(t,o){var r=y(e[o[4]])&&e[o[4]];i[o[1]](function(){var e=r&&r.apply(this,arguments);e&&y(e.promise)?e.promise().progress(n.notify).done(n.resolve).fail(n.reject):n[o[0]+"With"](this,r?[e]:arguments)})}),e=null}).promise()},then:function(e,n,r){var i=0;function a(e,t,n,r){return function(){var s=this,l=arguments,c=function(){var o,c;if(!(e<i)){if((o=n.apply(s,l))===t.promise())throw new TypeError("Thenable self-resolution");c=o&&("object"==typeof o||"function"==typeof o)&&o.then,y(c)?r?c.call(o,a(i,t,G,r),a(i,t,Y,r)):(i++,c.call(o,a(i,t,G,r),a(i,t,Y,r),a(i,t,G,t.notifyWith))):(n!==G&&(s=void 0,l=[o]),(r||t.resolveWith)(s,l))}},u=r?c:function(){try{c()}catch(o){C.Deferred.exceptionHook&&C.Deferred.exceptionHook(o,u.error),e+1>=i&&(n!==Y&&(s=void 0,l=[o]),t.rejectWith(s,l))}};e?u():(C.Deferred.getErrorHook?u.error=C.Deferred.getErrorHook():C.Deferred.getStackHook&&(u.error=C.Deferred.getStackHook()),o.setTimeout(u))}}return C.Deferred(function(o){t[0][3].add(a(0,o,y(r)?r:G,o.notifyWith)),t[1][3].add(a(0,o,y(e)?e:G)),t[2][3].add(a(0,o,y(n)?n:Y))}).promise()},promise:function(e){return null!=e?C.extend(e,r):r}},i={};return C.each(t,function(e,o){var a=o[2],s=o[5];r[o[1]]=a.add,s&&a.add(function(){n=s},t[3-e][2].disable,t[3-e][3].disable,t[0][2].lock,t[0][3].lock),a.add(o[3].fire),i[o[0]]=function(){return i[o[0]+"With"](this===i?void 0:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=arguments.length,n=t,o=Array(n),r=s.call(arguments),i=C.Deferred(),a=function(e){return function(n){o[e]=this,r[e]=arguments.length>1?s.call(arguments):n,--t||i.resolveWith(o,r)}};if(t<=1&&(J(e,i.done(a(n)).resolve,i.reject,!t),"pending"===i.state()||y(r[n]&&r[n].then)))return i.then();for(;n--;)J(r[n],a(n),i.reject);return i.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;C.Deferred.exceptionHook=function(e,t){o.console&&o.console.warn&&e&&Q.test(e.name)&&o.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},C.readyException=function(e){o.setTimeout(function(){throw e})};var K=C.Deferred();function Z(){b.removeEventListener("DOMContentLoaded",Z),o.removeEventListener("load",Z),C.ready()}C.fn.ready=function(e){return K.then(e).catch(function(e){C.readyException(e)}),this},C.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--C.readyWait:C.isReady)||(C.isReady=!0,!0!==e&&--C.readyWait>0||K.resolveWith(b,[C]))}}),C.ready.then=K.then,"complete"===b.readyState||"loading"!==b.readyState&&!b.documentElement.doScroll?o.setTimeout(C.ready):(b.addEventListener("DOMContentLoaded",Z),o.addEventListener("load",Z));var ee=function(e,t,n,o,r,i,a){var s=0,l=e.length,c=null==n;if("object"===T(n))for(s in r=!0,n)ee(e,t,s,n[s],!0,i,a);else if(void 0!==o&&(r=!0,y(o)||(a=!0),c&&(a?(t.call(e,o),t=null):(c=t,t=function(e,t,n){return c.call(C(e),n)})),t))for(;s<l;s++)t(e[s],n,a?o:o.call(e[s],s,t(e[s],n)));return r?e:c?t.call(e):l?t(e[0],n):i},te=/^-ms-/,ne=/-([a-z])/g;function oe(e,t){return t.toUpperCase()}function re(e){return e.replace(te,"ms-").replace(ne,oe)}var ie=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function ae(){this.expando=C.expando+ae.uid++}ae.uid=1,ae.prototype={cache:function(e){var t=e[this.expando];return t||(t={},ie(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var o,r=this.cache(e);if("string"==typeof t)r[re(t)]=n;else for(o in t)r[re(o)]=t[o];return r},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][re(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,o=e[this.expando];if(void 0!==o){if(void 0!==t){n=(t=Array.isArray(t)?t.map(re):(t=re(t))in o?[t]:t.match(V)||[]).length;for(;n--;)delete o[t[n]]}(void 0===t||C.isEmptyObject(o))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!C.isEmptyObject(t)}};var se=new ae,le=new ae,ce=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ue=/[A-Z]/g;function de(e,t,n){var o;if(void 0===n&&1===e.nodeType)if(o="data-"+t.replace(ue,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(o))){try{n=function(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:ce.test(e)?JSON.parse(e):e)}(n)}catch(e){}le.set(e,t,n)}else n=void 0;return n}C.extend({hasData:function(e){return le.hasData(e)||se.hasData(e)},data:function(e,t,n){return le.access(e,t,n)},removeData:function(e,t){le.remove(e,t)},_data:function(e,t,n){return se.access(e,t,n)},_removeData:function(e,t){se.remove(e,t)}}),C.fn.extend({data:function(e,t){var n,o,r,i=this[0],a=i&&i.attributes;if(void 0===e){if(this.length&&(r=le.get(i),1===i.nodeType&&!se.get(i,"hasDataAttrs"))){for(n=a.length;n--;)a[n]&&0===(o=a[n].name).indexOf("data-")&&(o=re(o.slice(5)),de(i,o,r[o]));se.set(i,"hasDataAttrs",!0)}return r}return"object"==typeof e?this.each(function(){le.set(this,e)}):ee(this,function(t){var n;if(i&&void 0===t)return void 0!==(n=le.get(i,e))||void 0!==(n=de(i,e))?n:void 0;this.each(function(){le.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){le.remove(this,e)})}}),C.extend({queue:function(e,t,n){var o;if(e)return t=(t||"fx")+"queue",o=se.get(e,t),n&&(!o||Array.isArray(n)?o=se.access(e,t,C.makeArray(n)):o.push(n)),o||[]},dequeue:function(e,t){t=t||"fx";var n=C.queue(e,t),o=n.length,r=n.shift(),i=C._queueHooks(e,t);"inprogress"===r&&(r=n.shift(),o--),r&&("fx"===t&&n.unshift("inprogress"),delete i.stop,r.call(e,function(){C.dequeue(e,t)},i)),!o&&i&&i.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return se.get(e,n)||se.access(e,n,{empty:C.Callbacks("once memory").add(function(){se.remove(e,[t+"queue",n])})})}}),C.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?C.queue(this[0],e):void 0===t?this:this.each(function(){var n=C.queue(this,e,t);C._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&C.dequeue(this,e)})},dequeue:function(e){return this.each(function(){C.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,o=1,r=C.Deferred(),i=this,a=this.length,s=function(){--o||r.resolveWith(i,[i])};for("string"!=typeof e&&(t=e,e=void 0),e=e||"fx";a--;)(n=se.get(i[a],e+"queueHooks"))&&n.empty&&(o++,n.empty.add(s));return s(),r.promise(t)}});var fe=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,pe=new RegExp("^(?:([+-])=|)("+fe+")([a-z%]*)$","i"),he=["Top","Right","Bottom","Left"],ge=b.documentElement,me=function(e){return C.contains(e.ownerDocument,e)},ye={composed:!0};ge.getRootNode&&(me=function(e){return C.contains(e.ownerDocument,e)||e.getRootNode(ye)===e.ownerDocument});var ve=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&me(e)&&"none"===C.css(e,"display")};function be(e,t,n,o){var r,i,a=20,s=o?function(){return o.cur()}:function(){return C.css(e,t,"")},l=s(),c=n&&n[3]||(C.cssNumber[t]?"":"px"),u=e.nodeType&&(C.cssNumber[t]||"px"!==c&&+l)&&pe.exec(C.css(e,t));if(u&&u[3]!==c){for(l/=2,c=c||u[3],u=+l||1;a--;)C.style(e,t,u+c),(1-i)*(1-(i=s()/l||.5))<=0&&(a=0),u/=i;u*=2,C.style(e,t,u+c),n=n||[]}return n&&(u=+u||+l||0,r=n[1]?u+(n[1]+1)*n[2]:+n[2],o&&(o.unit=c,o.start=u,o.end=r)),r}var xe={};function we(e){var t,n=e.ownerDocument,o=e.nodeName,r=xe[o];return r||(t=n.body.appendChild(n.createElement(o)),r=C.css(t,"display"),t.parentNode.removeChild(t),"none"===r&&(r="block"),xe[o]=r,r)}function Te(e,t){for(var n,o,r=[],i=0,a=e.length;i<a;i++)(o=e[i]).style&&(n=o.style.display,t?("none"===n&&(r[i]=se.get(o,"display")||null,r[i]||(o.style.display="")),""===o.style.display&&ve(o)&&(r[i]=we(o))):"none"!==n&&(r[i]="none",se.set(o,"display",n)));for(i=0;i<a;i++)null!=r[i]&&(e[i].style.display=r[i]);return e}C.fn.extend({show:function(){return Te(this,!0)},hide:function(){return Te(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ve(this)?C(this).show():C(this).hide()})}});var ke,Se,Ce=/^(?:checkbox|radio)$/i,Ee=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,Ae=/^$|^module$|\/(?:java|ecma)script/i;ke=b.createDocumentFragment().appendChild(b.createElement("div")),(Se=b.createElement("input")).setAttribute("type","radio"),Se.setAttribute("checked","checked"),Se.setAttribute("name","t"),ke.appendChild(Se),m.checkClone=ke.cloneNode(!0).cloneNode(!0).lastChild.checked,ke.innerHTML="<textarea>x</textarea>",m.noCloneChecked=!!ke.cloneNode(!0).lastChild.defaultValue,ke.innerHTML="<option></option>",m.option=!!ke.lastChild;var je={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function De(e,t){var n;return n=void 0!==e.getElementsByTagName?e.getElementsByTagName(t||"*"):void 0!==e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?C.merge([e],n):n}function qe(e,t){for(var n=0,o=e.length;n<o;n++)se.set(e[n],"globalEval",!t||se.get(t[n],"globalEval"))}je.tbody=je.tfoot=je.colgroup=je.caption=je.thead,je.th=je.td,m.option||(je.optgroup=je.option=[1,"<select multiple='multiple'>","</select>"]);var Le=/<|&#?\w+;/;function Ne(e,t,n,o,r){for(var i,a,s,l,c,u,d=t.createDocumentFragment(),f=[],p=0,h=e.length;p<h;p++)if((i=e[p])||0===i)if("object"===T(i))C.merge(f,i.nodeType?[i]:i);else if(Le.test(i)){for(a=a||d.appendChild(t.createElement("div")),s=(Ee.exec(i)||["",""])[1].toLowerCase(),l=je[s]||je._default,a.innerHTML=l[1]+C.htmlPrefilter(i)+l[2],u=l[0];u--;)a=a.lastChild;C.merge(f,a.childNodes),(a=d.firstChild).textContent=""}else f.push(t.createTextNode(i));for(d.textContent="",p=0;i=f[p++];)if(o&&C.inArray(i,o)>-1)r&&r.push(i);else if(c=me(i),a=De(d.appendChild(i),"script"),c&&qe(a),n)for(u=0;i=a[u++];)Ae.test(i.type||"")&&n.push(i);return d}var Pe=/^([^.]*)(?:\.(.+)|)/;function Oe(){return!0}function He(){return!1}function Me(e,t,n,o,r,i){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(o=o||n,n=void 0),t)Me(e,s,n,o,t[s],i);return e}if(null==o&&null==r?(r=n,o=n=void 0):null==r&&("string"==typeof n?(r=o,o=void 0):(r=o,o=n,n=void 0)),!1===r)r=He;else if(!r)return e;return 1===i&&(a=r,r=function(e){return C().off(e),a.apply(this,arguments)},r.guid=a.guid||(a.guid=C.guid++)),e.each(function(){C.event.add(this,t,r,o,n)})}function $e(e,t,n){n?(se.set(e,t,!1),C.event.add(e,t,{namespace:!1,handler:function(e){var n,o=se.get(this,t);if(1&e.isTrigger&&this[t]){if(o)(C.event.special[t]||{}).delegateType&&e.stopPropagation();else if(o=s.call(arguments),se.set(this,t,o),this[t](),n=se.get(this,t),se.set(this,t,!1),o!==n)return e.stopImmediatePropagation(),e.preventDefault(),n}else o&&(se.set(this,t,C.event.trigger(o[0],o.slice(1),this)),e.stopPropagation(),e.isImmediatePropagationStopped=Oe)}})):void 0===se.get(e,t)&&C.event.add(e,t,Oe)}C.event={global:{},add:function(e,t,n,o,r){var i,a,s,l,c,u,d,f,p,h,g,m=se.get(e);if(ie(e))for(n.handler&&(n=(i=n).handler,r=i.selector),r&&C.find.matchesSelector(ge,r),n.guid||(n.guid=C.guid++),(l=m.events)||(l=m.events=Object.create(null)),(a=m.handle)||(a=m.handle=function(t){return void 0!==C&&C.event.triggered!==t.type?C.event.dispatch.apply(e,arguments):void 0}),c=(t=(t||"").match(V)||[""]).length;c--;)p=g=(s=Pe.exec(t[c])||[])[1],h=(s[2]||"").split(".").sort(),p&&(d=C.event.special[p]||{},p=(r?d.delegateType:d.bindType)||p,d=C.event.special[p]||{},u=C.extend({type:p,origType:g,data:o,handler:n,guid:n.guid,selector:r,needsContext:r&&C.expr.match.needsContext.test(r),namespace:h.join(".")},i),(f=l[p])||((f=l[p]=[]).delegateCount=0,d.setup&&!1!==d.setup.call(e,o,h,a)||e.addEventListener&&e.addEventListener(p,a)),d.add&&(d.add.call(e,u),u.handler.guid||(u.handler.guid=n.guid)),r?f.splice(f.delegateCount++,0,u):f.push(u),C.event.global[p]=!0)},remove:function(e,t,n,o,r){var i,a,s,l,c,u,d,f,p,h,g,m=se.hasData(e)&&se.get(e);if(m&&(l=m.events)){for(c=(t=(t||"").match(V)||[""]).length;c--;)if(p=g=(s=Pe.exec(t[c])||[])[1],h=(s[2]||"").split(".").sort(),p){for(d=C.event.special[p]||{},f=l[p=(o?d.delegateType:d.bindType)||p]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=i=f.length;i--;)u=f[i],!r&&g!==u.origType||n&&n.guid!==u.guid||s&&!s.test(u.namespace)||o&&o!==u.selector&&("**"!==o||!u.selector)||(f.splice(i,1),u.selector&&f.delegateCount--,d.remove&&d.remove.call(e,u));a&&!f.length&&(d.teardown&&!1!==d.teardown.call(e,h,m.handle)||C.removeEvent(e,p,m.handle),delete l[p])}else for(p in l)C.event.remove(e,p+t[c],n,o,!0);C.isEmptyObject(l)&&se.remove(e,"handle events")}},dispatch:function(e){var t,n,o,r,i,a,s=new Array(arguments.length),l=C.event.fix(e),c=(se.get(this,"events")||Object.create(null))[l.type]||[],u=C.event.special[l.type]||{};for(s[0]=l,t=1;t<arguments.length;t++)s[t]=arguments[t];if(l.delegateTarget=this,!u.preDispatch||!1!==u.preDispatch.call(this,l)){for(a=C.event.handlers.call(this,l,c),t=0;(r=a[t++])&&!l.isPropagationStopped();)for(l.currentTarget=r.elem,n=0;(i=r.handlers[n++])&&!l.isImmediatePropagationStopped();)l.rnamespace&&!1!==i.namespace&&!l.rnamespace.test(i.namespace)||(l.handleObj=i,l.data=i.data,void 0!==(o=((C.event.special[i.origType]||{}).handle||i.handler).apply(r.elem,s))&&!1===(l.result=o)&&(l.preventDefault(),l.stopPropagation()));return u.postDispatch&&u.postDispatch.call(this,l),l.result}},handlers:function(e,t){var n,o,r,i,a,s=[],l=t.delegateCount,c=e.target;if(l&&c.nodeType&&!("click"===e.type&&e.button>=1))for(;c!==this;c=c.parentNode||this)if(1===c.nodeType&&("click"!==e.type||!0!==c.disabled)){for(i=[],a={},n=0;n<l;n++)void 0===a[r=(o=t[n]).selector+" "]&&(a[r]=o.needsContext?C(r,this).index(c)>-1:C.find(r,this,null,[c]).length),a[r]&&i.push(o);i.length&&s.push({elem:c,handlers:i})}return c=this,l<t.length&&s.push({elem:c,handlers:t.slice(l)}),s},addProp:function(e,t){Object.defineProperty(C.Event.prototype,e,{enumerable:!0,configurable:!0,get:y(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[C.expando]?e:new C.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return Ce.test(t.type)&&t.click&&A(t,"input")&&$e(t,"click",!0),!1},trigger:function(e){var t=this||e;return Ce.test(t.type)&&t.click&&A(t,"input")&&$e(t,"click"),!0},_default:function(e){var t=e.target;return Ce.test(t.type)&&t.click&&A(t,"input")&&se.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},C.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},C.Event=function(e,t){if(!(this instanceof C.Event))return new C.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Oe:He,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&C.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[C.expando]=!0},C.Event.prototype={constructor:C.Event,isDefaultPrevented:He,isPropagationStopped:He,isImmediatePropagationStopped:He,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Oe,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Oe,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Oe,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},C.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},C.event.addProp),C.each({focus:"focusin",blur:"focusout"},function(e,t){function n(e){if(b.documentMode){var n=se.get(this,"handle"),o=C.event.fix(e);o.type="focusin"===e.type?"focus":"blur",o.isSimulated=!0,n(e),o.target===o.currentTarget&&n(o)}else C.event.simulate(t,e.target,C.event.fix(e))}C.event.special[e]={setup:function(){var o;if($e(this,e,!0),!b.documentMode)return!1;(o=se.get(this,t))||this.addEventListener(t,n),se.set(this,t,(o||0)+1)},trigger:function(){return $e(this,e),!0},teardown:function(){var e;if(!b.documentMode)return!1;(e=se.get(this,t)-1)?se.set(this,t,e):(this.removeEventListener(t,n),se.remove(this,t))},_default:function(t){return se.get(t.target,e)},delegateType:t},C.event.special[t]={setup:function(){var o=this.ownerDocument||this.document||this,r=b.documentMode?this:o,i=se.get(r,t);i||(b.documentMode?this.addEventListener(t,n):o.addEventListener(e,n,!0)),se.set(r,t,(i||0)+1)},teardown:function(){var o=this.ownerDocument||this.document||this,r=b.documentMode?this:o,i=se.get(r,t)-1;i?se.set(r,t,i):(b.documentMode?this.removeEventListener(t,n):o.removeEventListener(e,n,!0),se.remove(r,t))}}}),C.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){C.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,o=e.relatedTarget,r=e.handleObj;return o&&(o===this||C.contains(this,o))||(e.type=r.origType,n=r.handler.apply(this,arguments),e.type=t),n}}}),C.fn.extend({on:function(e,t,n,o){return Me(this,e,t,n,o)},one:function(e,t,n,o){return Me(this,e,t,n,o,1)},off:function(e,t,n){var o,r;if(e&&e.preventDefault&&e.handleObj)return o=e.handleObj,C(e.delegateTarget).off(o.namespace?o.origType+"."+o.namespace:o.origType,o.selector,o.handler),this;if("object"==typeof e){for(r in e)this.off(r,t,e[r]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=He),this.each(function(){C.event.remove(this,e,n,t)})}});var _e=/<script|<style|<link/i,Re=/checked\s*(?:[^=]|=\s*.checked.)/i,Fe=/^\s*<!\[CDATA\[|\]\]>\s*$/g;function Ie(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&C(e).children("tbody")[0]||e}function We(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Be(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function ze(e,t){var n,o,r,i,a,s;if(1===t.nodeType){if(se.hasData(e)&&(s=se.get(e).events))for(r in se.remove(t,"handle events"),s)for(n=0,o=s[r].length;n<o;n++)C.event.add(t,r,s[r][n]);le.hasData(e)&&(i=le.access(e),a=C.extend({},i),le.set(t,a))}}function Ue(e,t){var n=t.nodeName.toLowerCase();"input"===n&&Ce.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Xe(e,t,n,o){t=l(t);var r,i,a,s,c,u,d=0,f=e.length,p=f-1,h=t[0],g=y(h);if(g||f>1&&"string"==typeof h&&!m.checkClone&&Re.test(h))return e.each(function(r){var i=e.eq(r);g&&(t[0]=h.call(this,r,i.html())),Xe(i,t,n,o)});if(f&&(i=(r=Ne(t,e[0].ownerDocument,!1,e,o)).firstChild,1===r.childNodes.length&&(r=i),i||o)){for(s=(a=C.map(De(r,"script"),We)).length;d<f;d++)c=r,d!==p&&(c=C.clone(c,!0,!0),s&&C.merge(a,De(c,"script"))),n.call(e[d],c,d);if(s)for(u=a[a.length-1].ownerDocument,C.map(a,Be),d=0;d<s;d++)c=a[d],Ae.test(c.type||"")&&!se.access(c,"globalEval")&&C.contains(u,c)&&(c.src&&"module"!==(c.type||"").toLowerCase()?C._evalUrl&&!c.noModule&&C._evalUrl(c.src,{nonce:c.nonce||c.getAttribute("nonce")},u):w(c.textContent.replace(Fe,""),c,u))}return e}function Ve(e,t,n){for(var o,r=t?C.filter(t,e):e,i=0;null!=(o=r[i]);i++)n||1!==o.nodeType||C.cleanData(De(o)),o.parentNode&&(n&&me(o)&&qe(De(o,"script")),o.parentNode.removeChild(o));return e}C.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var o,r,i,a,s=e.cloneNode(!0),l=me(e);if(!(m.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||C.isXMLDoc(e)))for(a=De(s),o=0,r=(i=De(e)).length;o<r;o++)Ue(i[o],a[o]);if(t)if(n)for(i=i||De(e),a=a||De(s),o=0,r=i.length;o<r;o++)ze(i[o],a[o]);else ze(e,s);return(a=De(s,"script")).length>0&&qe(a,!l&&De(e,"script")),s},cleanData:function(e){for(var t,n,o,r=C.event.special,i=0;void 0!==(n=e[i]);i++)if(ie(n)){if(t=n[se.expando]){if(t.events)for(o in t.events)r[o]?C.event.remove(n,o):C.removeEvent(n,o,t.handle);n[se.expando]=void 0}n[le.expando]&&(n[le.expando]=void 0)}}}),C.fn.extend({detach:function(e){return Ve(this,e,!0)},remove:function(e){return Ve(this,e)},text:function(e){return ee(this,function(e){return void 0===e?C.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Xe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Ie(this,e).appendChild(e)})},prepend:function(){return Xe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Ie(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Xe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Xe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(C.cleanData(De(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return C.clone(this,e,t)})},html:function(e){return ee(this,function(e){var t=this[0]||{},n=0,o=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!_e.test(e)&&!je[(Ee.exec(e)||["",""])[1].toLowerCase()]){e=C.htmlPrefilter(e);try{for(;n<o;n++)1===(t=this[n]||{}).nodeType&&(C.cleanData(De(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Xe(this,arguments,function(t){var n=this.parentNode;C.inArray(this,e)<0&&(C.cleanData(De(this)),n&&n.replaceChild(t,this))},e)}}),C.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){C.fn[e]=function(e){for(var n,o=[],r=C(e),i=r.length-1,a=0;a<=i;a++)n=a===i?this:this.clone(!0),C(r[a])[t](n),c.apply(o,n.get());return this.pushStack(o)}});var Ge=new RegExp("^("+fe+")(?!px)[a-z%]+$","i"),Ye=/^--/,Je=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=o),t.getComputedStyle(e)},Qe=function(e,t,n){var o,r,i={};for(r in t)i[r]=e.style[r],e.style[r]=t[r];for(r in o=n.call(e),t)e.style[r]=i[r];return o},Ke=new RegExp(he.join("|"),"i");function Ze(e,t,n){var o,r,i,a,s=Ye.test(t),l=e.style;return(n=n||Je(e))&&(a=n.getPropertyValue(t)||n[t],s&&a&&(a=a.replace(N,"$1")||void 0),""!==a||me(e)||(a=C.style(e,t)),!m.pixelBoxStyles()&&Ge.test(a)&&Ke.test(t)&&(o=l.width,r=l.minWidth,i=l.maxWidth,l.minWidth=l.maxWidth=l.width=a,a=n.width,l.width=o,l.minWidth=r,l.maxWidth=i)),void 0!==a?a+"":a}function et(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(u){c.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",u.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",ge.appendChild(c).appendChild(u);var e=o.getComputedStyle(u);n="1%"!==e.top,l=12===t(e.marginLeft),u.style.right="60%",a=36===t(e.right),r=36===t(e.width),u.style.position="absolute",i=12===t(u.offsetWidth/3),ge.removeChild(c),u=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,a,s,l,c=b.createElement("div"),u=b.createElement("div");u.style&&(u.style.backgroundClip="content-box",u.cloneNode(!0).style.backgroundClip="",m.clearCloneStyle="content-box"===u.style.backgroundClip,C.extend(m,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),a},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),l},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==s&&(e=b.createElement("table"),t=b.createElement("tr"),n=b.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="box-sizing:content-box;border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",ge.appendChild(e).appendChild(t).appendChild(n),r=o.getComputedStyle(t),s=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,ge.removeChild(e)),s}}))}();var tt=["Webkit","Moz","ms"],nt=b.createElement("div").style,ot={};function rt(e){return C.cssProps[e]||ot[e]||(e in nt?e:ot[e]=function(e){for(var t=e[0].toUpperCase()+e.slice(1),n=tt.length;n--;)if((e=tt[n]+t)in nt)return e}(e)||e)}var it=/^(none|table(?!-c[ea]).+)/,at={position:"absolute",visibility:"hidden",display:"block"},st={letterSpacing:"0",fontWeight:"400"};function lt(e,t,n){var o=pe.exec(t);return o?Math.max(0,o[2]-(n||0))+(o[3]||"px"):t}function ct(e,t,n,o,r,i){var a="width"===t?1:0,s=0,l=0,c=0;if(n===(o?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(c+=C.css(e,n+he[a],!0,r)),o?("content"===n&&(l-=C.css(e,"padding"+he[a],!0,r)),"margin"!==n&&(l-=C.css(e,"border"+he[a]+"Width",!0,r))):(l+=C.css(e,"padding"+he[a],!0,r),"padding"!==n?l+=C.css(e,"border"+he[a]+"Width",!0,r):s+=C.css(e,"border"+he[a]+"Width",!0,r));return!o&&i>=0&&(l+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-i-l-s-.5))||0),l+c}function ut(e,t,n){var o=Je(e),r=(!m.boxSizingReliable()||n)&&"border-box"===C.css(e,"boxSizing",!1,o),i=r,a=Ze(e,t,o),s="offset"+t[0].toUpperCase()+t.slice(1);if(Ge.test(a)){if(!n)return a;a="auto"}return(!m.boxSizingReliable()&&r||!m.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===C.css(e,"display",!1,o))&&e.getClientRects().length&&(r="border-box"===C.css(e,"boxSizing",!1,o),(i=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+ct(e,t,n||(r?"border":"content"),i,o,a)+"px"}function dt(e,t,n,o,r){return new dt.prototype.init(e,t,n,o,r)}C.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Ze(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,aspectRatio:!0,borderImageSlice:!0,columnCount:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,scale:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeMiterlimit:!0,strokeOpacity:!0},cssProps:{},style:function(e,t,n,o){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var r,i,a,s=re(t),l=Ye.test(t),c=e.style;if(l||(t=rt(s)),a=C.cssHooks[t]||C.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(r=a.get(e,!1,o))?r:c[t];"string"==(i=typeof n)&&(r=pe.exec(n))&&r[1]&&(n=be(e,t,r),i="number"),null!=n&&n==n&&("number"!==i||l||(n+=r&&r[3]||(C.cssNumber[s]?"":"px")),m.clearCloneStyle||""!==n||0!==t.indexOf("background")||(c[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,o))||(l?c.setProperty(t,n):c[t]=n))}},css:function(e,t,n,o){var r,i,a,s=re(t);return Ye.test(t)||(t=rt(s)),(a=C.cssHooks[t]||C.cssHooks[s])&&"get"in a&&(r=a.get(e,!0,n)),void 0===r&&(r=Ze(e,t,o)),"normal"===r&&t in st&&(r=st[t]),""===n||n?(i=parseFloat(r),!0===n||isFinite(i)?i||0:r):r}}),C.each(["height","width"],function(e,t){C.cssHooks[t]={get:function(e,n,o){if(n)return!it.test(C.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?ut(e,t,o):Qe(e,at,function(){return ut(e,t,o)})},set:function(e,n,o){var r,i=Je(e),a=!m.scrollboxSize()&&"absolute"===i.position,s=(a||o)&&"border-box"===C.css(e,"boxSizing",!1,i),l=o?ct(e,t,o,s,i):0;return s&&a&&(l-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(i[t])-ct(e,t,"border",!1,i)-.5)),l&&(r=pe.exec(n))&&"px"!==(r[3]||"px")&&(e.style[t]=n,n=C.css(e,t)),lt(0,n,l)}}}),C.cssHooks.marginLeft=et(m.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Ze(e,"marginLeft"))||e.getBoundingClientRect().left-Qe(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),C.each({margin:"",padding:"",border:"Width"},function(e,t){C.cssHooks[e+t]={expand:function(n){for(var o=0,r={},i="string"==typeof n?n.split(" "):[n];o<4;o++)r[e+he[o]+t]=i[o]||i[o-2]||i[0];return r}},"margin"!==e&&(C.cssHooks[e+t].set=lt)}),C.fn.extend({css:function(e,t){return ee(this,function(e,t,n){var o,r,i={},a=0;if(Array.isArray(t)){for(o=Je(e),r=t.length;a<r;a++)i[t[a]]=C.css(e,t[a],!1,o);return i}return void 0!==n?C.style(e,t,n):C.css(e,t)},e,t,arguments.length>1)}}),C.Tween=dt,dt.prototype={constructor:dt,init:function(e,t,n,o,r,i){this.elem=e,this.prop=n,this.easing=r||C.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=o,this.unit=i||(C.cssNumber[n]?"":"px")},cur:function(){var e=dt.propHooks[this.prop];return e&&e.get?e.get(this):dt.propHooks._default.get(this)},run:function(e){var t,n=dt.propHooks[this.prop];return this.options.duration?this.pos=t=C.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):dt.propHooks._default.set(this),this}},dt.prototype.init.prototype=dt.prototype,dt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=C.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){C.fx.step[e.prop]?C.fx.step[e.prop](e):1!==e.elem.nodeType||!C.cssHooks[e.prop]&&null==e.elem.style[rt(e.prop)]?e.elem[e.prop]=e.now:C.style(e.elem,e.prop,e.now+e.unit)}}},dt.propHooks.scrollTop=dt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},C.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},C.fx=dt.prototype.init,C.fx.step={};var ft,pt,ht=/^(?:toggle|show|hide)$/,gt=/queueHooks$/;function mt(){pt&&(!1===b.hidden&&o.requestAnimationFrame?o.requestAnimationFrame(mt):o.setTimeout(mt,C.fx.interval),C.fx.tick())}function yt(){return o.setTimeout(function(){ft=void 0}),ft=Date.now()}function vt(e,t){var n,o=0,r={height:e};for(t=t?1:0;o<4;o+=2-t)r["margin"+(n=he[o])]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function bt(e,t,n){for(var o,r=(xt.tweeners[t]||[]).concat(xt.tweeners["*"]),i=0,a=r.length;i<a;i++)if(o=r[i].call(n,t,e))return o}function xt(e,t,n){var o,r,i=0,a=xt.prefilters.length,s=C.Deferred().always(function(){delete l.elem}),l=function(){if(r)return!1;for(var t=ft||yt(),n=Math.max(0,c.startTime+c.duration-t),o=1-(n/c.duration||0),i=0,a=c.tweens.length;i<a;i++)c.tweens[i].run(o);return s.notifyWith(e,[c,o,n]),o<1&&a?n:(a||s.notifyWith(e,[c,1,0]),s.resolveWith(e,[c]),!1)},c=s.promise({elem:e,props:C.extend({},t),opts:C.extend(!0,{specialEasing:{},easing:C.easing._default},n),originalProperties:t,originalOptions:n,startTime:ft||yt(),duration:n.duration,tweens:[],createTween:function(t,n){var o=C.Tween(e,c.opts,t,n,c.opts.specialEasing[t]||c.opts.easing);return c.tweens.push(o),o},stop:function(t){var n=0,o=t?c.tweens.length:0;if(r)return this;for(r=!0;n<o;n++)c.tweens[n].run(1);return t?(s.notifyWith(e,[c,1,0]),s.resolveWith(e,[c,t])):s.rejectWith(e,[c,t]),this}}),u=c.props;for(function(e,t){var n,o,r,i,a;for(n in e)if(r=t[o=re(n)],i=e[n],Array.isArray(i)&&(r=i[1],i=e[n]=i[0]),n!==o&&(e[o]=i,delete e[n]),(a=C.cssHooks[o])&&"expand"in a)for(n in i=a.expand(i),delete e[o],i)n in e||(e[n]=i[n],t[n]=r);else t[o]=r}(u,c.opts.specialEasing);i<a;i++)if(o=xt.prefilters[i].call(c,e,u,c.opts))return y(o.stop)&&(C._queueHooks(c.elem,c.opts.queue).stop=o.stop.bind(o)),o;return C.map(u,bt,c),y(c.opts.start)&&c.opts.start.call(e,c),c.progress(c.opts.progress).done(c.opts.done,c.opts.complete).fail(c.opts.fail).always(c.opts.always),C.fx.timer(C.extend(l,{elem:e,anim:c,queue:c.opts.queue})),c}C.Animation=C.extend(xt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return be(n.elem,e,pe.exec(t),n),n}]},tweener:function(e,t){y(e)?(t=e,e=["*"]):e=e.match(V);for(var n,o=0,r=e.length;o<r;o++)n=e[o],xt.tweeners[n]=xt.tweeners[n]||[],xt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var o,r,i,a,s,l,c,u,d="width"in t||"height"in t,f=this,p={},h=e.style,g=e.nodeType&&ve(e),m=se.get(e,"fxshow");for(o in n.queue||(null==(a=C._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,f.always(function(){f.always(function(){a.unqueued--,C.queue(e,"fx").length||a.empty.fire()})})),t)if(r=t[o],ht.test(r)){if(delete t[o],i=i||"toggle"===r,r===(g?"hide":"show")){if("show"!==r||!m||void 0===m[o])continue;g=!0}p[o]=m&&m[o]||C.style(e,o)}if((l=!C.isEmptyObject(t))||!C.isEmptyObject(p))for(o in d&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(c=m&&m.display)&&(c=se.get(e,"display")),"none"===(u=C.css(e,"display"))&&(c?u=c:(Te([e],!0),c=e.style.display||c,u=C.css(e,"display"),Te([e]))),("inline"===u||"inline-block"===u&&null!=c)&&"none"===C.css(e,"float")&&(l||(f.done(function(){h.display=c}),null==c&&(u=h.display,c="none"===u?"":u)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",f.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),l=!1,p)l||(m?"hidden"in m&&(g=m.hidden):m=se.access(e,"fxshow",{display:c}),i&&(m.hidden=!g),g&&Te([e],!0),f.done(function(){for(o in g||Te([e]),se.remove(e,"fxshow"),p)C.style(e,o,p[o])})),l=bt(g?m[o]:0,o,f),o in m||(m[o]=l.start,g&&(l.end=l.start,l.start=0))}],prefilter:function(e,t){t?xt.prefilters.unshift(e):xt.prefilters.push(e)}}),C.speed=function(e,t,n){var o=e&&"object"==typeof e?C.extend({},e):{complete:n||!n&&t||y(e)&&e,duration:e,easing:n&&t||t&&!y(t)&&t};return C.fx.off?o.duration=0:"number"!=typeof o.duration&&(o.duration in C.fx.speeds?o.duration=C.fx.speeds[o.duration]:o.duration=C.fx.speeds._default),null!=o.queue&&!0!==o.queue||(o.queue="fx"),o.old=o.complete,o.complete=function(){y(o.old)&&o.old.call(this),o.queue&&C.dequeue(this,o.queue)},o},C.fn.extend({fadeTo:function(e,t,n,o){return this.filter(ve).css("opacity",0).show().end().animate({opacity:t},e,n,o)},animate:function(e,t,n,o){var r=C.isEmptyObject(e),i=C.speed(t,n,o),a=function(){var t=xt(this,C.extend({},e),i);(r||se.get(this,"finish"))&&t.stop(!0)};return a.finish=a,r||!1===i.queue?this.each(a):this.queue(i.queue,a)},stop:function(e,t,n){var o=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&this.queue(e||"fx",[]),this.each(function(){var t=!0,r=null!=e&&e+"queueHooks",i=C.timers,a=se.get(this);if(r)a[r]&&a[r].stop&&o(a[r]);else for(r in a)a[r]&&a[r].stop&&gt.test(r)&&o(a[r]);for(r=i.length;r--;)i[r].elem!==this||null!=e&&i[r].queue!==e||(i[r].anim.stop(n),t=!1,i.splice(r,1));!t&&n||C.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=se.get(this),o=n[e+"queue"],r=n[e+"queueHooks"],i=C.timers,a=o?o.length:0;for(n.finish=!0,C.queue(this,e,[]),r&&r.stop&&r.stop.call(this,!0),t=i.length;t--;)i[t].elem===this&&i[t].queue===e&&(i[t].anim.stop(!0),i.splice(t,1));for(t=0;t<a;t++)o[t]&&o[t].finish&&o[t].finish.call(this);delete n.finish})}}),C.each(["toggle","show","hide"],function(e,t){var n=C.fn[t];C.fn[t]=function(e,o,r){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(vt(t,!0),e,o,r)}}),C.each({slideDown:vt("show"),slideUp:vt("hide"),slideToggle:vt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){C.fn[e]=function(e,n,o){return this.animate(t,e,n,o)}}),C.timers=[],C.fx.tick=function(){var e,t=0,n=C.timers;for(ft=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||C.fx.stop(),ft=void 0},C.fx.timer=function(e){C.timers.push(e),C.fx.start()},C.fx.interval=13,C.fx.start=function(){pt||(pt=!0,mt())},C.fx.stop=function(){pt=null},C.fx.speeds={slow:600,fast:200,_default:400},C.fn.delay=function(e,t){return e=C.fx&&C.fx.speeds[e]||e,t=t||"fx",this.queue(t,function(t,n){var r=o.setTimeout(t,e);n.stop=function(){o.clearTimeout(r)}})},function(){var e=b.createElement("input"),t=b.createElement("select").appendChild(b.createElement("option"));e.type="checkbox",m.checkOn=""!==e.value,m.optSelected=t.selected,(e=b.createElement("input")).value="t",e.type="radio",m.radioValue="t"===e.value}();var wt,Tt=C.expr.attrHandle;C.fn.extend({attr:function(e,t){return ee(this,C.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){C.removeAttr(this,e)})}}),C.extend({attr:function(e,t,n){var o,r,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return void 0===e.getAttribute?C.prop(e,t,n):(1===i&&C.isXMLDoc(e)||(r=C.attrHooks[t.toLowerCase()]||(C.expr.match.bool.test(t)?wt:void 0)),void 0!==n?null===n?void C.removeAttr(e,t):r&&"set"in r&&void 0!==(o=r.set(e,n,t))?o:(e.setAttribute(t,n+""),n):r&&"get"in r&&null!==(o=r.get(e,t))?o:null==(o=C.find.attr(e,t))?void 0:o)},attrHooks:{type:{set:function(e,t){if(!m.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,o=0,r=t&&t.match(V);if(r&&1===e.nodeType)for(;n=r[o++];)e.removeAttribute(n)}}),wt={set:function(e,t,n){return!1===t?C.removeAttr(e,n):e.setAttribute(n,n),n}},C.each(C.expr.match.bool.source.match(/\w+/g),function(e,t){var n=Tt[t]||C.find.attr;Tt[t]=function(e,t,o){var r,i,a=t.toLowerCase();return o||(i=Tt[a],Tt[a]=r,r=null!=n(e,t,o)?a:null,Tt[a]=i),r}});var kt=/^(?:input|select|textarea|button)$/i,St=/^(?:a|area)$/i;function Ct(e){return(e.match(V)||[]).join(" ")}function Et(e){return e.getAttribute&&e.getAttribute("class")||""}function At(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(V)||[]}C.fn.extend({prop:function(e,t){return ee(this,C.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[C.propFix[e]||e]})}}),C.extend({prop:function(e,t,n){var o,r,i=e.nodeType;if(3!==i&&8!==i&&2!==i)return 1===i&&C.isXMLDoc(e)||(t=C.propFix[t]||t,r=C.propHooks[t]),void 0!==n?r&&"set"in r&&void 0!==(o=r.set(e,n,t))?o:e[t]=n:r&&"get"in r&&null!==(o=r.get(e,t))?o:e[t]},propHooks:{tabIndex:{get:function(e){var t=C.find.attr(e,"tabindex");return t?parseInt(t,10):kt.test(e.nodeName)||St.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),m.optSelected||(C.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),C.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){C.propFix[this.toLowerCase()]=this}),C.fn.extend({addClass:function(e){var t,n,o,r,i,a;return y(e)?this.each(function(t){C(this).addClass(e.call(this,t,Et(this)))}):(t=At(e)).length?this.each(function(){if(o=Et(this),n=1===this.nodeType&&" "+Ct(o)+" "){for(i=0;i<t.length;i++)r=t[i],n.indexOf(" "+r+" ")<0&&(n+=r+" ");a=Ct(n),o!==a&&this.setAttribute("class",a)}}):this},removeClass:function(e){var t,n,o,r,i,a;return y(e)?this.each(function(t){C(this).removeClass(e.call(this,t,Et(this)))}):arguments.length?(t=At(e)).length?this.each(function(){if(o=Et(this),n=1===this.nodeType&&" "+Ct(o)+" "){for(i=0;i<t.length;i++)for(r=t[i];n.indexOf(" "+r+" ")>-1;)n=n.replace(" "+r+" "," ");a=Ct(n),o!==a&&this.setAttribute("class",a)}}):this:this.attr("class","")},toggleClass:function(e,t){var n,o,r,i,a=typeof e,s="string"===a||Array.isArray(e);return y(e)?this.each(function(n){C(this).toggleClass(e.call(this,n,Et(this),t),t)}):"boolean"==typeof t&&s?t?this.addClass(e):this.removeClass(e):(n=At(e),this.each(function(){if(s)for(i=C(this),r=0;r<n.length;r++)o=n[r],i.hasClass(o)?i.removeClass(o):i.addClass(o);else void 0!==e&&"boolean"!==a||((o=Et(this))&&se.set(this,"__className__",o),this.setAttribute&&this.setAttribute("class",o||!1===e?"":se.get(this,"__className__")||""))}))},hasClass:function(e){var t,n,o=0;for(t=" "+e+" ";n=this[o++];)if(1===n.nodeType&&(" "+Ct(Et(n))+" ").indexOf(t)>-1)return!0;return!1}});var jt=/\r/g;C.fn.extend({val:function(e){var t,n,o,r=this[0];return arguments.length?(o=y(e),this.each(function(n){var r;1===this.nodeType&&(null==(r=o?e.call(this,n,C(this).val()):e)?r="":"number"==typeof r?r+="":Array.isArray(r)&&(r=C.map(r,function(e){return null==e?"":e+""})),(t=C.valHooks[this.type]||C.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,r,"value")||(this.value=r))})):r?(t=C.valHooks[r.type]||C.valHooks[r.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(r,"value"))?n:"string"==typeof(n=r.value)?n.replace(jt,""):null==n?"":n:void 0}}),C.extend({valHooks:{option:{get:function(e){var t=C.find.attr(e,"value");return null!=t?t:Ct(C.text(e))}},select:{get:function(e){var t,n,o,r=e.options,i=e.selectedIndex,a="select-one"===e.type,s=a?null:[],l=a?i+1:r.length;for(o=i<0?l:a?i:0;o<l;o++)if(((n=r[o]).selected||o===i)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=C(n).val(),a)return t;s.push(t)}return s},set:function(e,t){for(var n,o,r=e.options,i=C.makeArray(t),a=r.length;a--;)((o=r[a]).selected=C.inArray(C.valHooks.option.get(o),i)>-1)&&(n=!0);return n||(e.selectedIndex=-1),i}}}}),C.each(["radio","checkbox"],function(){C.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=C.inArray(C(e).val(),t)>-1}},m.checkOn||(C.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Dt=o.location,qt={guid:Date.now()},Lt=/\?/;C.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new o.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||C.error("Invalid XML: "+(n?C.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Nt=/^(?:focusinfocus|focusoutblur)$/,Pt=function(e){e.stopPropagation()};C.extend(C.event,{trigger:function(e,t,n,r){var i,a,s,l,c,u,d,f,h=[n||b],g=p.call(e,"type")?e.type:e,m=p.call(e,"namespace")?e.namespace.split("."):[];if(a=f=s=n=n||b,3!==n.nodeType&&8!==n.nodeType&&!Nt.test(g+C.event.triggered)&&(g.indexOf(".")>-1&&(m=g.split("."),g=m.shift(),m.sort()),c=g.indexOf(":")<0&&"on"+g,(e=e[C.expando]?e:new C.Event(g,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=m.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:C.makeArray(t,[e]),d=C.event.special[g]||{},r||!d.trigger||!1!==d.trigger.apply(n,t))){if(!r&&!d.noBubble&&!v(n)){for(l=d.delegateType||g,Nt.test(l+g)||(a=a.parentNode);a;a=a.parentNode)h.push(a),s=a;s===(n.ownerDocument||b)&&h.push(s.defaultView||s.parentWindow||o)}for(i=0;(a=h[i++])&&!e.isPropagationStopped();)f=a,e.type=i>1?l:d.bindType||g,(u=(se.get(a,"events")||Object.create(null))[e.type]&&se.get(a,"handle"))&&u.apply(a,t),(u=c&&a[c])&&u.apply&&ie(a)&&(e.result=u.apply(a,t),!1===e.result&&e.preventDefault());return e.type=g,r||e.isDefaultPrevented()||d._default&&!1!==d._default.apply(h.pop(),t)||!ie(n)||c&&y(n[g])&&!v(n)&&((s=n[c])&&(n[c]=null),C.event.triggered=g,e.isPropagationStopped()&&f.addEventListener(g,Pt),n[g](),e.isPropagationStopped()&&f.removeEventListener(g,Pt),C.event.triggered=void 0,s&&(n[c]=s)),e.result}},simulate:function(e,t,n){var o=C.extend(new C.Event,n,{type:e,isSimulated:!0});C.event.trigger(o,null,t)}}),C.fn.extend({trigger:function(e,t){return this.each(function(){C.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return C.event.trigger(e,t,n,!0)}});var Ot=/\[\]$/,Ht=/\r?\n/g,Mt=/^(?:submit|button|image|reset|file)$/i,$t=/^(?:input|select|textarea|keygen)/i;function _t(e,t,n,o){var r;if(Array.isArray(t))C.each(t,function(t,r){n||Ot.test(e)?o(e,r):_t(e+"["+("object"==typeof r&&null!=r?t:"")+"]",r,n,o)});else if(n||"object"!==T(t))o(e,t);else for(r in t)_t(e+"["+r+"]",t[r],n,o)}C.param=function(e,t){var n,o=[],r=function(e,t){var n=y(t)?t():t;o[o.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!C.isPlainObject(e))C.each(e,function(){r(this.name,this.value)});else for(n in e)_t(n,e[n],t,r);return o.join("&")},C.fn.extend({serialize:function(){return C.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=C.prop(this,"elements");return e?C.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!C(this).is(":disabled")&&$t.test(this.nodeName)&&!Mt.test(e)&&(this.checked||!Ce.test(e))}).map(function(e,t){var n=C(this).val();return null==n?null:Array.isArray(n)?C.map(n,function(e){return{name:t.name,value:e.replace(Ht,"\r\n")}}):{name:t.name,value:n.replace(Ht,"\r\n")}}).get()}});var Rt=/%20/g,Ft=/#.*$/,It=/([?&])_=[^&]*/,Wt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Bt=/^(?:GET|HEAD)$/,zt=/^\/\//,Ut={},Xt={},Vt="*/".concat("*"),Gt=b.createElement("a");function Yt(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var o,r=0,i=t.toLowerCase().match(V)||[];if(y(n))for(;o=i[r++];)"+"===o[0]?(o=o.slice(1)||"*",(e[o]=e[o]||[]).unshift(n)):(e[o]=e[o]||[]).push(n)}}function Jt(e,t,n,o){var r={},i=e===Xt;function a(s){var l;return r[s]=!0,C.each(e[s]||[],function(e,s){var c=s(t,n,o);return"string"!=typeof c||i||r[c]?i?!(l=c):void 0:(t.dataTypes.unshift(c),a(c),!1)}),l}return a(t.dataTypes[0])||!r["*"]&&a("*")}function Qt(e,t){var n,o,r=C.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((r[n]?e:o||(o={}))[n]=t[n]);return o&&C.extend(!0,e,o),e}Gt.href=Dt.href,C.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Dt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Dt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Vt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":C.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Qt(Qt(e,C.ajaxSettings),t):Qt(C.ajaxSettings,e)},ajaxPrefilter:Yt(Ut),ajaxTransport:Yt(Xt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var n,r,i,a,s,l,c,u,d,f,p=C.ajaxSetup({},t),h=p.context||p,g=p.context&&(h.nodeType||h.jquery)?C(h):C.event,m=C.Deferred(),y=C.Callbacks("once memory"),v=p.statusCode||{},x={},w={},T="canceled",k={readyState:0,getResponseHeader:function(e){var t;if(c){if(!a)for(a={};t=Wt.exec(i);)a[t[1].toLowerCase()+" "]=(a[t[1].toLowerCase()+" "]||[]).concat(t[2]);t=a[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return c?i:null},setRequestHeader:function(e,t){return null==c&&(e=w[e.toLowerCase()]=w[e.toLowerCase()]||e,x[e]=t),this},overrideMimeType:function(e){return null==c&&(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)k.always(e[k.status]);else for(t in e)v[t]=[v[t],e[t]];return this},abort:function(e){var t=e||T;return n&&n.abort(t),S(0,t),this}};if(m.promise(k),p.url=((e||p.url||Dt.href)+"").replace(zt,Dt.protocol+"//"),p.type=t.method||t.type||p.method||p.type,p.dataTypes=(p.dataType||"*").toLowerCase().match(V)||[""],null==p.crossDomain){l=b.createElement("a");try{l.href=p.url,l.href=l.href,p.crossDomain=Gt.protocol+"//"+Gt.host!=l.protocol+"//"+l.host}catch(e){p.crossDomain=!0}}if(p.data&&p.processData&&"string"!=typeof p.data&&(p.data=C.param(p.data,p.traditional)),Jt(Ut,p,t,k),c)return k;for(d in(u=C.event&&p.global)&&0===C.active++&&C.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Bt.test(p.type),r=p.url.replace(Ft,""),p.hasContent?p.data&&p.processData&&0===(p.contentType||"").indexOf("application/x-www-form-urlencoded")&&(p.data=p.data.replace(Rt,"+")):(f=p.url.slice(r.length),p.data&&(p.processData||"string"==typeof p.data)&&(r+=(Lt.test(r)?"&":"?")+p.data,delete p.data),!1===p.cache&&(r=r.replace(It,"$1"),f=(Lt.test(r)?"&":"?")+"_="+qt.guid+++f),p.url=r+f),p.ifModified&&(C.lastModified[r]&&k.setRequestHeader("If-Modified-Since",C.lastModified[r]),C.etag[r]&&k.setRequestHeader("If-None-Match",C.etag[r])),(p.data&&p.hasContent&&!1!==p.contentType||t.contentType)&&k.setRequestHeader("Content-Type",p.contentType),k.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Vt+"; q=0.01":""):p.accepts["*"]),p.headers)k.setRequestHeader(d,p.headers[d]);if(p.beforeSend&&(!1===p.beforeSend.call(h,k,p)||c))return k.abort();if(T="abort",y.add(p.complete),k.done(p.success),k.fail(p.error),n=Jt(Xt,p,t,k)){if(k.readyState=1,u&&g.trigger("ajaxSend",[k,p]),c)return k;p.async&&p.timeout>0&&(s=o.setTimeout(function(){k.abort("timeout")},p.timeout));try{c=!1,n.send(x,S)}catch(e){if(c)throw e;S(-1,e)}}else S(-1,"No Transport");function S(e,t,a,l){var d,f,b,x,w,T=t;c||(c=!0,s&&o.clearTimeout(s),n=void 0,i=l||"",k.readyState=e>0?4:0,d=e>=200&&e<300||304===e,a&&(x=function(e,t,n){for(var o,r,i,a,s=e.contents,l=e.dataTypes;"*"===l[0];)l.shift(),void 0===o&&(o=e.mimeType||t.getResponseHeader("Content-Type"));if(o)for(r in s)if(s[r]&&s[r].test(o)){l.unshift(r);break}if(l[0]in n)i=l[0];else{for(r in n){if(!l[0]||e.converters[r+" "+l[0]]){i=r;break}a||(a=r)}i=i||a}if(i)return i!==l[0]&&l.unshift(i),n[i]}(p,k,a)),!d&&C.inArray("script",p.dataTypes)>-1&&C.inArray("json",p.dataTypes)<0&&(p.converters["text script"]=function(){}),x=function(e,t,n,o){var r,i,a,s,l,c={},u=e.dataTypes.slice();if(u[1])for(a in e.converters)c[a.toLowerCase()]=e.converters[a];for(i=u.shift();i;)if(e.responseFields[i]&&(n[e.responseFields[i]]=t),!l&&o&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=i,i=u.shift())if("*"===i)i=l;else if("*"!==l&&l!==i){if(!(a=c[l+" "+i]||c["* "+i]))for(r in c)if((s=r.split(" "))[1]===i&&(a=c[l+" "+s[0]]||c["* "+s[0]])){!0===a?a=c[r]:!0!==c[r]&&(i=s[0],u.unshift(s[1]));break}if(!0!==a)if(a&&e.throws)t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+l+" to "+i}}}return{state:"success",data:t}}(p,x,k,d),d?(p.ifModified&&((w=k.getResponseHeader("Last-Modified"))&&(C.lastModified[r]=w),(w=k.getResponseHeader("etag"))&&(C.etag[r]=w)),204===e||"HEAD"===p.type?T="nocontent":304===e?T="notmodified":(T=x.state,f=x.data,d=!(b=x.error))):(b=T,!e&&T||(T="error",e<0&&(e=0))),k.status=e,k.statusText=(t||T)+"",d?m.resolveWith(h,[f,T,k]):m.rejectWith(h,[k,T,b]),k.statusCode(v),v=void 0,u&&g.trigger(d?"ajaxSuccess":"ajaxError",[k,p,d?f:b]),y.fireWith(h,[k,T]),u&&(g.trigger("ajaxComplete",[k,p]),--C.active||C.event.trigger("ajaxStop")))}return k},getJSON:function(e,t,n){return C.get(e,t,n,"json")},getScript:function(e,t){return C.get(e,void 0,t,"script")}}),C.each(["get","post"],function(e,t){C[t]=function(e,n,o,r){return y(n)&&(r=r||o,o=n,n=void 0),C.ajax(C.extend({url:e,type:t,dataType:r,data:n,success:o},C.isPlainObject(e)&&e))}}),C.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),C._evalUrl=function(e,t,n){return C.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){C.globalEval(e,t,n)}})},C.fn.extend({wrapAll:function(e){var t;return this[0]&&(y(e)&&(e=e.call(this[0])),t=C(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return y(e)?this.each(function(t){C(this).wrapInner(e.call(this,t))}):this.each(function(){var t=C(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=y(e);return this.each(function(n){C(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){C(this).replaceWith(this.childNodes)}),this}}),C.expr.pseudos.hidden=function(e){return!C.expr.pseudos.visible(e)},C.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},C.ajaxSettings.xhr=function(){try{return new o.XMLHttpRequest}catch(e){}};var Kt={0:200,1223:204},Zt=C.ajaxSettings.xhr();m.cors=!!Zt&&"withCredentials"in Zt,m.ajax=Zt=!!Zt,C.ajaxTransport(function(e){var t,n;if(m.cors||Zt&&!e.crossDomain)return{send:function(r,i){var a,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(a in e.xhrFields)s[a]=e.xhrFields[a];for(a in e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||r["X-Requested-With"]||(r["X-Requested-With"]="XMLHttpRequest"),r)s.setRequestHeader(a,r[a]);t=function(e){return function(){t&&(t=n=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?i(0,"error"):i(s.status,s.statusText):i(Kt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=t(),n=s.onerror=s.ontimeout=t("error"),void 0!==s.onabort?s.onabort=n:s.onreadystatechange=function(){4===s.readyState&&o.setTimeout(function(){t&&n()})},t=t("abort");try{s.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}}),C.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),C.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return C.globalEval(e),e}}}),C.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),C.ajaxTransport("script",function(e){var t,n;if(e.crossDomain||e.scriptAttrs)return{send:function(o,r){t=C("<script>").attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&r("error"===e.type?404:200,e.type)}),b.head.appendChild(t[0])},abort:function(){n&&n()}}});var en,tn=[],nn=/(=)\?(?=&|$)|\?\?/;C.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=tn.pop()||C.expando+"_"+qt.guid++;return this[e]=!0,e}}),C.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,a,s=!1!==e.jsonp&&(nn.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&nn.test(e.data)&&"data");if(s||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=y(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,s?e[s]=e[s].replace(nn,"$1"+r):!1!==e.jsonp&&(e.url+=(Lt.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return a||C.error(r+" was not called"),a[0]},e.dataTypes[0]="json",i=o[r],o[r]=function(){a=arguments},n.always(function(){void 0===i?C(o).removeProp(r):o[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,tn.push(r)),a&&y(i)&&i(a[0]),a=i=void 0}),"script"}),m.createHTMLDocument=((en=b.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===en.childNodes.length),C.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(m.createHTMLDocument?((o=(t=b.implementation.createHTMLDocument("")).createElement("base")).href=b.location.href,t.head.appendChild(o)):t=b),i=!n&&[],(r=F.exec(e))?[t.createElement(r[1])]:(r=Ne([e],t,i),i&&i.length&&C(i).remove(),C.merge([],r.childNodes)));var o,r,i},C.fn.load=function(e,t,n){var o,r,i,a=this,s=e.indexOf(" ");return s>-1&&(o=Ct(e.slice(s)),e=e.slice(0,s)),y(t)?(n=t,t=void 0):t&&"object"==typeof t&&(r="POST"),a.length>0&&C.ajax({url:e,type:r||"GET",dataType:"html",data:t}).done(function(e){i=arguments,a.html(o?C("<div>").append(C.parseHTML(e)).find(o):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,i||[e.responseText,t,e])})}),this},C.expr.pseudos.animated=function(e){return C.grep(C.timers,function(t){return e===t.elem}).length},C.offset={setOffset:function(e,t,n){var o,r,i,a,s,l,c=C.css(e,"position"),u=C(e),d={};"static"===c&&(e.style.position="relative"),s=u.offset(),i=C.css(e,"top"),l=C.css(e,"left"),("absolute"===c||"fixed"===c)&&(i+l).indexOf("auto")>-1?(a=(o=u.position()).top,r=o.left):(a=parseFloat(i)||0,r=parseFloat(l)||0),y(t)&&(t=t.call(e,n,C.extend({},s))),null!=t.top&&(d.top=t.top-s.top+a),null!=t.left&&(d.left=t.left-s.left+r),"using"in t?t.using.call(e,d):u.css(d)}},C.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){C.offset.setOffset(this,e,t)});var t,n,o=this[0];return o?o.getClientRects().length?(t=o.getBoundingClientRect(),n=o.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,o=this[0],r={top:0,left:0};if("fixed"===C.css(o,"position"))t=o.getBoundingClientRect();else{for(t=this.offset(),n=o.ownerDocument,e=o.offsetParent||n.documentElement;e&&(e===n.body||e===n.documentElement)&&"static"===C.css(e,"position");)e=e.parentNode;e&&e!==o&&1===e.nodeType&&((r=C(e).offset()).top+=C.css(e,"borderTopWidth",!0),r.left+=C.css(e,"borderLeftWidth",!0))}return{top:t.top-r.top-C.css(o,"marginTop",!0),left:t.left-r.left-C.css(o,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&"static"===C.css(e,"position");)e=e.offsetParent;return e||ge})}}),C.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;C.fn[e]=function(o){return ee(this,function(e,o,r){var i;if(v(e)?i=e:9===e.nodeType&&(i=e.defaultView),void 0===r)return i?i[t]:e[o];i?i.scrollTo(n?i.pageXOffset:r,n?r:i.pageYOffset):e[o]=r},e,o,arguments.length)}}),C.each(["top","left"],function(e,t){C.cssHooks[t]=et(m.pixelPosition,function(e,n){if(n)return n=Ze(e,t),Ge.test(n)?C(e).position()[t]+"px":n})}),C.each({Height:"height",Width:"width"},function(e,t){C.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,o){C.fn[o]=function(r,i){var a=arguments.length&&(n||"boolean"!=typeof r),s=n||(!0===r||!0===i?"margin":"border");return ee(this,function(t,n,r){var i;return v(t)?0===o.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):void 0===r?C.css(t,n,s):C.style(t,n,r,s)},t,a?r:void 0,a)}})}),C.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){C.fn[t]=function(e){return this.on(t,e)}}),C.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,o){return this.on(t,e,n,o)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.on("mouseenter",e).on("mouseleave",t||e)}}),C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){C.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}});var on=/^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;C.proxy=function(e,t){var n,o,r;if("string"==typeof t&&(n=e[t],t=e,e=n),y(e))return o=s.call(arguments,2),r=function(){return e.apply(t||this,o.concat(s.call(arguments)))},r.guid=e.guid=e.guid||C.guid++,r},C.holdReady=function(e){e?C.readyWait++:C.ready(!0)},C.isArray=Array.isArray,C.parseJSON=JSON.parse,C.nodeName=A,C.isFunction=y,C.isWindow=v,C.camelCase=re,C.type=T,C.now=Date.now,C.isNumeric=function(e){var t=C.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},C.trim=function(e){return null==e?"":(e+"").replace(on,"$1")},void 0===(n=function(){return C}.apply(t,[]))||(e.exports=n);var rn=o.jQuery,an=o.$;return C.noConflict=function(e){return o.$===C&&(o.$=an),e&&o.jQuery===C&&(o.jQuery=rn),C},void 0===r&&(o.jQuery=o.$=C),C})}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";n(692);let e=!1,t=!1;var o=document.createElement("iframe");o.classList.add("GroupPosting");var r={width:"510px",height:"690px"};function i(){if(!e)return;const t=parseFloat(o.style.width)*r.scale,n=parseFloat(o.style.height)*r.scale,i=parseFloat(o.style.right),a=parseFloat(window.getComputedStyle(o).top),s=window.innerWidth-(t+i),l=document.querySelector('div[style*="cursor: ew-resize"]'),c=document.querySelector('div[style*="cursor: ns-resize"]');l&&c&&(Object.assign(c.style,{width:`${t}px`,height:"7px",left:`${s}px`,top:a+n-7+"px"}),Object.assign(l.style,{height:`${n}px`,width:"7px",left:s-7+"px",top:`${a}px`}))}function a(e,t=2){return parseFloat(parseFloat(e).toFixed(t))}function s(t,n){if(!e)return e||chrome.storage.local.get(["iframeWidth","iframeHeight"],function(t){const n=o.style;n.width=t.iframeWidth||r.width,n.height=t.iframeHeight||r.height,n.right=`-${parseFloat(n.width)*r.scale}px`,document.body.appendChild(o),function(){const e=document.createElement("div"),t=document.createElement("div");[e,t].forEach(e=>{e.style.position="fixed",e.style.background="rgb(255 255 255 / 0%)",e.style.zIndex="9000000000000000001",e.style.display="none"}),e.style.cursor="ew-resize",t.style.cursor="ns-resize",document.body.appendChild(e),document.body.appendChild(t);const n=document.createElement("div");Object.assign(n.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",zIndex:"9000000000000000000",display:"none"}),document.body.appendChild(n);let r={x:0,y:0},a={width:0,height:0};function s(e,t){e.preventDefault(),r.x=e.clientX,r.y=e.clientY,a.width=parseFloat(window.getComputedStyle(o).width),a.height=parseFloat(window.getComputedStyle(o).height),n.style.display="block";const i=t?l:c;window.addEventListener("mousemove",i),window.addEventListener("mouseup",u,{once:!0})}function l(e){const t=e.clientX-r.x,n=Math.min(window.innerWidth,Math.max(300,a.width-t));o.style.width=`${n}px`,i()}function c(e){const t=r.y-e.clientY,n=Math.min(.9*window.innerHeight,Math.max(200,a.height-t));o.style.height=`${n}px`,i()}function u(){window.removeEventListener("mousemove",l),window.removeEventListener("mousemove",c),n.style.display="none",chrome.storage.local.set({iframeWidth:o.style.width,iframeHeight:o.style.height})}e.addEventListener("mousedown",e=>s(e,!0)),t.addEventListener("mousedown",e=>s(e,!1))}(),e=!0,i()}),void setTimeout(()=>{l(t,n)},50);a(parseFloat(o.style.width)*r.scale),"-510px"===o.style.right?l(t,n):(a(parseFloat(o.style.width)*r.scale),o.style.right="-510px",[document.querySelector('div[style*="cursor: ew-resize"]'),document.querySelector('div[style*="cursor: ns-resize"]')].forEach(e=>{e&&(e.style.display="none")}),i())}function l(e,t){o.style.transition="right 0.5s ease-in-out, top 0.5s ease-in-out",o.style.right="13px",[document.querySelector('div[style*="cursor: ew-resize"]'),document.querySelector('div[style*="cursor: ns-resize"]')].forEach(e=>{e&&(e.style.display="block")}),i(),e&&setTimeout(()=>{chrome.runtime.sendMessage(t)},100)}!function(){const e=o.style;e.background="none",e.height=r.height,e.width=r.width,e.position="fixed",e.top="5%",e.right=`-${parseFloat(e.width)*r.scale}px`,e.zIndex="9000000000000000000",e.boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",e.border="none",e.borderRadius="10px",e.transform=`scale(${r.scale})`,e.transformOrigin="top right"}(),-1!==location.href.indexOf("facebook.")&&chrome.storage.local.get(["lastLicenceCheckTime"],function(e){const t=(new Date).getTime();t-(e.lastLicenceCheckTime||0)>=36e5?(chrome.runtime.sendMessage({action:"checkLicenceStatus"}),chrome.storage.local.set({lastLicenceCheckTime:t})):console.log("Licence check skipped. Cache is valid for 1 hour.")}),chrome.runtime.onMessage.addListener(async function(n){if("OpenGroupPostingPopup"===n.action){console.log("Toggling iframe visibility"),t||(t=!0,o.src=chrome.runtime.getURL("popup.html"));a(parseFloat(o.style.width)*r.scale);!e||o.style.right,s()}}),
console.log("GroupPosting content script loaded - waiting for user interaction");

const c = ["post", "publish", "publier", "o publikuj", "publicar", "postar", "veröffentlichen", "надіслати", "نشر", "게시", "投稿", "发布", "publikuj", "odoslať", "kirim", "đăng", "đăng bài", "đăng bài viết", "i-post", "โพสต์", "սր", "postează", "submit"];

function u(e) {
  const t = (e.innerText || e.value || "").toLowerCase(),
    n = (e.getAttribute("aria-label") || "").toLowerCase(),
    o = (e.getAttribute("placeholder") || "").toLowerCase(),
    r = (e.getAttribute("aria-placeholder") || "").toLowerCase();
  let i = 0;
  const a = ["what's on your mind", "write something", "create a public post", "írj", "bejegyzés", "mind", "publier", "something", "bạn viết gì đi", "bạn viết gì đi...", "bạn viết gì đi…", "bạn viết gì đó", "viết gì đó", "tạo bài viết công khai", "bạn nghĩ gì", "bạn nghĩ gì thế", "viết nội dung", "đăng bài", "tạo bài viết"],
    s = e => a.some(t => e.includes(t));
  const isTitle = n.includes("tiêu đề") || n.includes("title") || o.includes("tiêu đề") || o.includes("title");
  return s(t) && (i += 1.5), s(n) && (i += 1), s(o) && (i += 1), s(r) && (i += 2), 
         "textarea" === e.tagName.toLowerCase() && (i += 2), 
         "textbox" === e.getAttribute("role") && (i += .5), 
         "true" === e.getAttribute("contenteditable") && (i += .5), 
         "true" === e.getAttribute("data-lexical-editor") && (i += 1), 
         e.closest('div[role="dialog"]') && (i += 10), 
         ((n.includes("comment") || n.includes("bình luận") || o.includes("comment") || o.includes("bình luận") || (e.closest("form") && !e.closest('div[role="dialog"]'))) ? (i -= 15) : 0), 
         isTitle && (i -= 8), i;
}


window.__fbLogs = window.__fbLogs || [];
const origLog = console.log;
const origWarn = console.warn;
const origError = console.error;

let logSaveTimeout = null;
function saveLogsToStorage() {
  if (logSaveTimeout) clearTimeout(logSaveTimeout);
  logSaveTimeout = setTimeout(() => {
    try {
      chrome.storage.local.set({ lastErrorLog: window.__fbLogs.join('\n') });
    } catch (e) {}
  }, 500);
}

console.log = function(...args) { 
  window.__fbLogs.push('[INFO] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); 
  origLog.apply(console, args); 
  saveLogsToStorage();
};
console.warn = function(...args) { 
  window.__fbLogs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); 
  origWarn.apply(console, args); 
  saveLogsToStorage();
};
console.error = function(...args) { 
  window.__fbLogs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')); 
  origError.apply(console, args); 
  saveLogsToStorage();
};

window.addEventListener('error', (event) => {
  const errorMsg = event.error ? event.error.stack || event.error.message : event.message;
  window.__fbLogs.push('[CRASH] Uncaught Exception: ' + errorMsg);
  saveLogsToStorage();
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason ? event.reason.stack || event.reason.message || event.reason : 'Unknown reason';
  window.__fbLogs.push('[CRASH] Unhandled Promise Rejection: ' + reason);
  saveLogsToStorage();
});

window.addEventListener('unload', () => {
  try {
    chrome.storage.local.set({ lastErrorLog: window.__fbLogs.join('\n') });
  } catch(e) {}
});

function showDebugLog() {
    try {
      chrome.storage.local.set({ lastErrorLog: window.__fbLogs.join('\n') });
    } catch(e) {}
    if (document.getElementById('fb-auto-debug-log')) return;
    let div = document.createElement('div');
    div.id = 'fb-auto-debug-log';
    div.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:80%;background:white;z-index:999999;border:2px solid red;padding:20px;box-shadow:0 0 20px rgba(0,0,0,0.5);display:flex;flex-direction:column;";
    let h2 = document.createElement('h2');
    h2.innerText = "LỖI: KHÔNG THỂ ĐĂNG BÀI - DEBUG LOG";
    h2.style.color = "red";
    let p = document.createElement('p');
    p.innerText = "Hãy copy toàn bộ nội dung bên dưới để gửi cho AI hoặc Developer phân tích:";
    let ta = document.createElement('textarea');
    ta.style.cssText = "flex:1;width:100%;margin-top:10px;font-family:monospace;font-size:12px;";
    ta.value = window.__fbLogs.join('\n');
    let closeBtn = document.createElement('button');
    closeBtn.innerText = "Đóng";
    closeBtn.style.cssText = "margin-top:10px;padding:10px;background:red;color:white;border:none;cursor:pointer;";
    closeBtn.onclick = () => div.remove();
    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(ta);
    div.appendChild(closeBtn);
    document.body.appendChild(div);
}
async function d() {
  const triggerPhrases = ["write something", "what's on your mind", "create a public post", "créer une publication", "à quoi pensez-vous", "qué estás pensando", "beitrag erstellen", "bejegyzés", "írj", "创建帖子", "发布", "بم تفكر", "napisz coś", "Escreva algo", "bạn viết gì đi", "bạn viết gì đi...", "bạn viết gì đi…", "bạn viết gì đó", "viết gì đó", "tạo bài viết công khai", "bạn nghĩ gì", "bạn nghĩ gì thế", "viết nội dung", "nêu ý kiến của bạn", "เขียนอะไรสักหน่อย", "Tulis sesuatu", "כאן כותבים…", "Skryf iets", "কিছু লিখুন", "សរសេរអ្វីម្យ៉ាង", "Exprimez-vous", "اكتب شيئًا", "o czym myślisz", "Escribe algo", "ⴰⵔⴰ ⴽⵔⴰ ⵏ ⵜⵖⴰⵡסⴰ", "Magsulat", "Scrie ceva"];

  for (let attempt = 0; attempt < 15; attempt++) {
    const buttons = Array.from(document.querySelectorAll('div[role="button"], button, div.x1i10hfl, div[role="link"], a'));
    
    const textElements = Array.from(document.querySelectorAll('div, span, p')).filter(el => {
      if (el.children.length > 3) return false;
      const text = (el.textContent || "").toLowerCase().trim();
      if (text.length > 40) return false;
      return triggerPhrases.some(phrase => text.includes(phrase));
    });

    const candidates = [...buttons, ...textElements].reverse();
    console.log(`[FACEBOOK-AUTO] Find post button - Attempt ${attempt + 1}: Found ${candidates.length} candidates.`);

    for (const el of candidates) {
      const article = el.closest('[role="article"]');
      if (article) {
        const isFeedPost = Array.from(article.querySelectorAll('div[role="button"], button')).some(btn => {
          const btnText = (btn.textContent || "").toLowerCase().trim();
          const btnLabel = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
          return ["like", "comment", "share", "thích", "bình luận", "chia sẻ", "lubię to", "skomentuj", "udostępnij"].some(kw => 
            btnText === kw || btnLabel.includes(kw)
          );
        });
        if (isFeedPost) continue;
      }

      const text = (el.textContent || "").toLowerCase().trim();
      const label = (el.getAttribute("aria-label") || "").toLowerCase().trim();

      if (triggerPhrases.some(phrase => text.includes(phrase) || label.includes(phrase))) {
        const rect = el.getBoundingClientRect();
        if (!el.offsetParent && rect.width === 0 && rect.height === 0) continue;
        
        const target = el.closest('div[role="button"]') || el.closest('div.x1i10hfl') || el.closest('button') || el;
        console.log("[FACEBOOK-AUTO] Target post button identified:", target);
        return target;
      }
    }

    try {
      const images = Array.from(document.querySelectorAll("img, svg[role='img']")).filter(img => {
        const w = img.clientWidth || img.getBoundingClientRect().width;
        return w >= 32 && w <= 60;
      });
      for (const img of images) {
        if (img.closest('[role="article"]')) {
          const article = img.closest('[role="article"]');
          const isFeedPost = Array.from(article.querySelectorAll('div[role="button"], button')).some(btn => {
            const btnText = (btn.textContent || "").toLowerCase().trim();
            const btnLabel = (btn.getAttribute("aria-label") || "").toLowerCase().trim();
            return ["like", "comment", "share", "thích", "bình luận", "chia sẻ", "lubię to", "skomentuj", "udostępnij"].some(kw => 
              btnText === kw || btnLabel.includes(kw)
            );
          });
          if (isFeedPost) continue;
        }
        const container = img.closest(".x78zum5");
        if (!container) continue;
        const btn = Array.from(container.querySelectorAll('div[role="button"]')).find(e => !e.contains(img) && !e.querySelector("svg, img, i"));
        if (btn) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 2 * rect.height) {
            console.log("[FACEBOOK-AUTO] Fallback to avatar near composer:", btn);
            return btn;
          }
        }
      }
    } catch (err) {}

    await y(1);
  }
  return null;
}

function f(e) {
  if (!e) return;
  ["pointerover", "pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(t => {
    try {
      let n;
      if (t.startsWith("pointer")) {
        n = new PointerEvent(t, { bubbles: !0, cancelable: !0, view: window, buttons: 1, isPrimary: true });
      } else {
        n = new MouseEvent(t, { bubbles: !0, cancelable: !0, view: window, buttons: 1 });
      }
      e.dispatchEvent(n);
    } catch (err) {}
  });
}
async function p(e = 1, t = 10) {
  function n(e, t) {
    const n = document.querySelectorAll(e);
    return Array.from(n).some(e => e.textContent.toLowerCase().includes(t.toLowerCase()));
  }
  console.log(`Checking post status... attempt ${e}`);
  const isPending = n("span", "Your post is pending") || n("span", "awaiting admin approval") || n("span", "đang chờ duyệt") || n("span", "chờ phê duyệt") || n("span", "chờ quản trị viên") || n("span", "Cảm ơn bạn đã đăng bài") || n("div", "Cảm ơn bạn đã đăng bài") || n("span", "gửi bài viết cho quản trị viên") || n("div", "gửi bài viết cho quản trị viên") || n("span", "quản trị viên nhóm phê duyệt") || n("div", "quản trị viên nhóm phê duyệt") || n("span", "Hệ thống đã gửi bài viết");
  
  // More strict success detection to avoid matching random posts in the feed (removed "phút", "minutes ago")
  const isSuccess = n("div[role='alert']", "đã được đăng") || n("div[role='alert']", "đã chia sẻ") || n("div[role='alert']", "published") || n("div[role='dialog']", "đã được đăng") || n("div[role='dialog']", "đã chia sẻ") || n("div[role='dialog']", "published");
  
  const isRestricted = n("div", "We limit how often you can post") || n("span", "You can try again later") || n("div", "protect the community from spam") || n("span", "thử lại sau") || n("div", "giới hạn") || n("div", "spam");
  
  if (isPending) { console.log("✅ Post went to pending approval (counted as success)."); await y(3); return "success"; }
  if (isSuccess) { console.log("✅ Post successfully published."); await y(3); return "success"; }
  if (isRestricted) return console.log("🚫 Facebook posting temporarily limited."), "restricted";
  if (e < t) {
    await y(2);
    return await p(e + 1, t);
  }
  return console.log("⚠️ Could not determine post status."), "unknown";
}

function h() {
  const dialogs = document.querySelectorAll('div[role="dialog"]');
  const dialog = Array.from(dialogs).find(d => d.offsetParent !== null) || dialogs[dialogs.length - 1];
  const container = dialog || document;
  const e = container.querySelectorAll('div[role="button"], button');
  for (const t of e) {
    const e = t.textContent.trim().toLowerCase(),
      n = (t.getAttribute("aria-label") || "").trim().toLowerCase();
    if (e.includes("ẩn danh") || n.includes("ẩn danh") || e.includes("anonym") || n.includes("anonym") || e.includes("chia sẻ") || n.includes("chia sẻ") || e.includes("schedule") || n.includes("schedule") || e.includes("lên lịch") || n.includes("lên lịch") || e.includes("draft") || n.includes("draft") || e.includes("nháp") || n.includes("nháp") || e.includes("setting") || n.includes("setting") || e.includes("cài đặt") || n.includes("cài đặt") || e.includes("tùy chọn") || n.includes("tùy chọn") || t.getAttribute("role") === "switch") continue;
    if (c.some(t => e === t || n === t || e.startsWith(t) || n.startsWith(t))) {
      if (!e.includes("close") && !n.includes("close") && !e.includes("hủy") && !n.includes("hủy")) return t;
    }
  }
  return null;
}

async function writeText(element, text) {
  if (!element || !text) return;
  try {
    const plainText = text.replace(/<br\s*\/?>/gi, '\n');
    const tagName = element.tagName.toLowerCase();
    const isTextInput = tagName === "textarea" || tagName === "input";
    
    console.log("[FACEBOOK-AUTO] writeText (paste mode) called. Tag:", tagName, "isTextInput:", isTextInput, "Text length:", plainText.length);
    
    // Focus element
    try { element.focus(); } catch(e) {}
    await y(0.2);

    // Clear existing content
    try {
      if (isTextInput) {
        element.value = "";
        element.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      } else {
        const sel = window.getSelection();
        if (sel && sel.rangeCount >= 0) {
          sel.selectAllChildren(element);
          sel.deleteFromDocument();
        } else {
          element.innerHTML = "";
        }
        element.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      }
    } catch(e) {
      console.warn("[FACEBOOK-AUTO] Failed to clear element:", e);
    }
    await y(0.2);

    if (isTextInput) {
      // Dispatch beforeinput for inputs
      try {
        const beforeInputEvent = new InputEvent("beforeinput", {
          inputType: "insertFromPaste",
          data: plainText,
          bubbles: true,
          cancelable: true,
          composed: true
        });
        element.dispatchEvent(beforeInputEvent);
      } catch(e) {}

      element.value = plainText;
      element.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      element.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    } else {
      // Contenteditable (Lexical)
      // Focus selection at end
      try {
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch(e) {}

      // Dispatch simulated ClipboardEvent paste
      try {
        const dt = new DataTransfer();
        dt.setData("text/plain", plainText);
        dt.setData("text/html", plainText.replace(/\n/g, '<br>'));
        const pasteEvent = new ClipboardEvent("paste", {
          clipboardData: dt,
          bubbles: true,
          cancelable: true,
          composed: true
        });
        element.dispatchEvent(pasteEvent);
      } catch(e) {
        console.warn("[FACEBOOK-AUTO] Failed to dispatch ClipboardEvent paste:", e);
      }

      // Wait a tiny bit and check if content was inserted
      await y(0.1);
      const currentContent = element.textContent || element.innerText || "";
      if (currentContent.length === 0) {
        console.warn("[FACEBOOK-AUTO] Paste event did not insert text, trying execCommand fallback...");
        let pasteSuccess = false;
        try {
          const lines = plainText.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i]) {
              document.execCommand('insertText', false, lines[i]);
            }
            if (i < lines.length - 1) {
              document.execCommand('insertLineBreak');
            }
          }
          pasteSuccess = true;
        } catch(e) {
          console.warn("[FACEBOOK-AUTO] execCommand insertText/insertLineBreak failed:", e);
        }

        // Fallback: manually update innerText if execCommand fails
        if (!pasteSuccess) {
          console.warn("[FACEBOOK-AUTO] execCommand failed, using fallback innerText");
          element.innerText = plainText;
        }
      }

      // Dispatch input event (insertFromPaste) to trigger updates
      try {
        const inputEvent = new InputEvent("input", {
          inputType: "insertFromPaste",
          data: plainText,
          bubbles: true,
          composed: true
        });
        element.dispatchEvent(inputEvent);
      } catch(e) {}
    }

    console.log("[FACEBOOK-AUTO] writeText (paste mode) finished successfully.");
  } catch (err) {
    console.error("[FACEBOOK-AUTO] writeText fatal error:", err);
  }
}

async function insertPostText(postText, postTitleText) {
  console.log("[FACEBOOK-AUTO] insertPostText called. text length:", postText?.length, "title:", postTitleText);
  await y(1.5);

  const dialog = document.querySelector('div[role="dialog"]');
  const container = dialog || document;
  
  let bodyElement = null;
  let titleElement = null;
  
  for (let attempt = 0; attempt < 20; attempt++) {
    // Priority 1: Look for contenteditable div (Lexical/modern editor for post body)
    const editables = Array.from(document.querySelectorAll(
      "div[data-lexical-editor='true'], div.notranslate[contenteditable='true'], div[role='textbox'][contenteditable='true']"
    )).filter(e => {
      const rect = e.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && e.offsetParent !== null;
    });
    
    if (editables.length > 0) {
      bodyElement = editables[editables.length - 1]; // Use last element for topmost modal
      console.log("[FACEBOOK-AUTO] Body contentEditable found:", bodyElement);
      
      // If we have contenteditable body, any visible textarea in the dialog is the Title field
      const textareas = Array.from(document.querySelectorAll('textarea')).filter(ta => {
        const rect = ta.getBoundingClientRect();
        return rect.width > 20 && rect.height > 10 && ta.offsetParent !== null;
      });
      
      if (textareas.length > 0) {
        titleElement = textareas[textareas.length - 1];
        console.log("[FACEBOOK-AUTO] Title textarea found (co-exists with body contentEditable):", titleElement.getAttribute("aria-label") || titleElement.getAttribute("placeholder"));
      }
      break;
    }
    
    // Priority 2: Look for visible textarea (fallback for legacy or simplified FB post layout)
    const textareas = Array.from(document.querySelectorAll('textarea')).filter(ta => {
      const label = (ta.getAttribute("aria-label") || "").toLowerCase();
      const placeholder = (ta.getAttribute("placeholder") || "").toLowerCase();
      // Exclude obvious title textareas if we are using textarea as body fallback
      if (label.includes("tiêu đề") || label.includes("title") || placeholder.includes("tiêu đề") || placeholder.includes("title")) return false;
      const rect = ta.getBoundingClientRect();
      return rect.width > 20 && rect.height > 10 && ta.offsetParent !== null;
    });
    
    if (textareas.length > 0) {
      bodyElement = textareas[textareas.length - 1];
      console.log("[FACEBOOK-AUTO] Body textarea found (fallback):", bodyElement.getAttribute("aria-label") || bodyElement.getAttribute("placeholder"));
      break;
    }
    
    console.log("[FACEBOOK-AUTO] No body element found yet, attempt", attempt + 1);
    await y(0.5);
  }

  if (!bodyElement) {
    console.error("[FACEBOOK-AUTO] FATAL: No body element found after 20 attempts");
    return;
  }

  // Write body content
  console.log("[FACEBOOK-AUTO] Writing body text to element:", bodyElement.tagName);
  await writeText(bodyElement, postText);
  await y(1.5);
  
  // Verify body content
  const bodyTag = bodyElement.tagName.toLowerCase();
  const bodyContent = bodyTag === "textarea" || bodyTag === "input" 
    ? bodyElement.value 
    : (bodyElement.textContent || bodyElement.innerText || "");
  console.log("[FACEBOOK-AUTO] Body content after write. Length:", bodyContent.length, "First 50 chars:", bodyContent.substring(0, 50));

  // Write title if title text exists
  if (postTitleText) {
    console.log("[FACEBOOK-AUTO] Writing title text. Title:", postTitleText);
    
    // If titleElement was not found yet, try finding it via common attributes
    if (!titleElement) {
      titleElement = container.querySelector(
        'textarea[aria-label*="tiêu đề"], textarea[placeholder*="tiêu đề"], ' +
        'textarea[aria-label*="Thêm tiêu đề"], textarea[placeholder*="Thêm tiêu đề"], ' +
        'textarea[aria-label*="title" i], textarea[placeholder*="title" i], ' +
        'input[aria-label*="tiêu đề"], input[placeholder*="tiêu đề"]'
      );
    }
    
    if (titleElement && titleElement !== bodyElement) {
      console.log("[FACEBOOK-AUTO] Writing title to element:", titleElement.tagName);
      await writeText(titleElement, postTitleText);
      await y(1.5);
      
      const titleTag = titleElement.tagName.toLowerCase();
      const titleContent = titleTag === "textarea" || titleTag === "input" ? titleElement.value : titleElement.textContent;
      console.log("[FACEBOOK-AUTO] Title after write. Length:", titleContent?.length);
    } else {
      console.warn("[FACEBOOK-AUTO] Title element not found or same as bodyElement. Skipping title.");
    }
  }
  
  console.log("[FACEBOOK-AUTO] insertPostText completed");
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping") {
    sendResponse({status: "alive"});
    return true;
  }
});
console.log("GroupPosting content script loaded - waiting for user interaction");

chrome.runtime.onMessage.addListener(async function (e, t, n) {
  if ("contentcreateQuickPost" === e?.action) {
    const { postKey: t } = e;
    console.log(`Processing post with key: ${t}`);
    chrome.storage.local.get(t, async e => {
      const n = e[t];
      if (!n) {
        console.error(`Post data not found for key: ${t}`);
        showDebugLog();
        chrome.storage.local.set({ operationStatus: 'failed' });
        return;
      }
      console.log("Post data retrieved:", { ...n, images: n.images ? `${n.images.length} images` : "none" });
      const o = n.securityLevel || "2";
      m(n.firstCommentText), await y(1);
      let r = !1;
      const i = n.text ? m(n.text) : "";
      const titleSpinned = n.title ? m(n.title) : "";
      try {
        !function () {
          const e = document.querySelector(".__fb-dark-mode.x14dbnvc.x67yw2k.xamt9zi.x1xb1xrg.xz3gdfk.xbi9o00.x1dbek64.x4666fc.x1n2onr6.xzkaem6");
          if (e) {
            console.log("Dark mode popup detected.");
            const t = e.querySelector('div[aria-label="Close"][role="button"]');
            t ? (console.log("Closing dark mode popup..."), t.click()) : console.log("Close button not found in dark mode popup.");
          } else console.log("No dark mode popup detected.");
        }(), await y(1);
        let e = null;
        if (e = await d(), e || document.querySelector('div[role="dialog"]') || (console.log("Post trigger button not found. Attempting to switch to Discussion tab..."), await async function () {
          console.log("Checking if Discussion tab switch is needed...");
          const e = document.querySelectorAll('a[role="tab"]');
          let t = null;
          for (const n of e)
            if (n.textContent.includes("Discussion") && "true" !== n.getAttribute("aria-selected")) {
              t = n;
              break;
            }
          return t ? (console.log("Found unselected Discussion tab. Switching..."), t.click(), await y(2), !0) : (console.log("Already on Discussion tab or not applicable."), !1);
        }(), await y(2), e = await d()), !e && !document.querySelector('div[role="dialog"]')) {
          console.error("Failed to locate post creation button after all attempts");
          showDebugLog();
          chrome.storage.local.set({ operationStatus: 'failed' });
          return;
        }
        if (e) {
          console.log("Opening post creation modal...");
          b("Opening post creation modal");
          f(e);
          let t = 0;
          for (; !document.querySelector('div[role="dialog"]') && t < 10;) await y(.5), t++;
        }
        if (!document.querySelector('div[role="dialog"]')) {
          console.error("Failed to open post creation modal (dialog not found).");
          b("Modal failed to open - aborting");
          showDebugLog();
          chrome.storage.local.set({ operationStatus: 'failed' });
          return;
        }
        if (await v(o, "pre_text"), n.images?.length) {
          b("Processing media files"), await y(1), console.log("[FACEBOOK-AUTO] Starting media upload. Image count:", n.images.length);
          await w(n.images, "post");
          console.log("[FACEBOOK-AUTO] Media files processed.");
        }
        b("Adding text content");
        console.log("[FACEBOOK-AUTO] About to insert text. Text length:", i.length, "Title:", titleSpinned);
        await insertPostText(i, titleSpinned);
        console.log("Text content inserted successfully.");
        await y(1);
        if (i.length <= 130 && 0 === n.images.length && "#18191A" !== n.color) {
          b("Applying background color");
          await (async function (e) {
            if (e) {
              try {
                const t = 'div[aria-label*="Background"], div[aria-label*="Backgrund"], div[aria-label*="Aa"], div[role="button"][aria-haspopup="true"]:has(i[style*="background-position: 0px -150px"])',
                  n = await x(t, 3e3, !1, !0);
                if (n) {
                  console.log("Clicking Show Background Options button...");
                  const t = new MouseEvent("mousedown", { bubbles: !0 });
                  n.dispatchEvent(t);
                  const o = new FocusEvent("focus", { bubbles: !0 });
                  n.dispatchEvent(o);
                  const r = new MouseEvent("mouseup", { bubbles: !0 });
                  n.dispatchEvent(r), n.click(), await y(2);
                  const i = 'div[aria-label*="Background Option"], div[aria-label*="Hátterm"], div[role="button"]:has(i[style*="background-position: 0px -25px"])',
                    a = await x(i, 3e3, !1, !0);
                  if (await y(.5), a) {
                    console.log("Clicking Background Options button..."), a.click(), await y(1);
                    const t = "div.xb57i2i.x1q594ok.x5lxg6s.x78zum5.xdt5ytf.x6ikm8r.x1ja2u2z.x1pq812k.x1rohswg.xfk6m8.x1yqm8si.xjx87ck.xx8ngbg.xwo3gff.x1n2onr6.x1oyok0e.x1odjw0f.x1e4zzel.x1v3eypb.x1qrby5j, .x1v3eypb",
                      n = await x(t, 3e3, !1, !0);
                    n ? (n.classList.remove("x1v3eypb"), console.log("Class 'x1v3eypb' removed successfully.")) : console.log("Target div not found.");
                    const o = {
                      "#e2013b": { selector: 'div[aria-label="Solid red, background"][role="button"]', position: 1 },
                      "#ff6323": { selector: 'div[aria-label="Solid red, background"][role="button"]', position: 3 },
                      "#c600ff": { selector: 'div[aria-label="Solid purple, background"][role="button"]', position: 0 },
                      "#26927f": { selector: 'div[aria-label="Solid teal, background"][role="button"]', position: 0 },
                      "#f6c7c6": { selector: 'div[aria-label="Pink illustration, background image"][role="button"]', position: 4 },
                      "#2088af": { selector: 'div[aria-label="Solid blue, background"][role="button"]', position: 0 }
                    }[e];
                    if (o) {
                      let t = 0;
                      const n = 3;
                      for (; t < n;) {
                        const r = document.querySelectorAll(o.selector);
                        if (r.length >= o.position) {
                          const t = r[o.position];
                          if (t) {
                            console.log(`Clicking background button for color: ${e}`);
                            const n = new MouseEvent("mousedown", { bubbles: !0 });
                            t.dispatchEvent(n);
                            const o = new FocusEvent("focus", { bubbles: !0 });
                            t.dispatchEvent(o);
                            const r = new MouseEvent("mouseup", { bubbles: !0 });
                            t.dispatchEvent(r), await y(.5), requestAnimationFrame(() => { t.click() }), await y(1), console.log(`Background color set to: ${e}`);
                            break;
                          }
                          console.log(`Background button for color: ${e} not found.`);
                        } else console.log(`No background button found at position: ${o.position} for color: ${e}`);
                        t++, t < n ? (console.log(`Retrying background color for: ${e} (Attempt ${t+1}/${n})`), await y(5)) : console.log(`Failed to set background color for: ${e} after ${n} attempts.`);
                      }
                    } else console.log(`No selector found for color: ${e}`);
                  } else console.log("Background Options button not found, retrying..."), await y(2);
                } else console.log("Show Background Options button not found, retrying..."), await y(2);
              } catch (e) {
                console.error(`Error in background application: ${e.message}`);
              }
            } else {
              console.log("No postColor provided. Exiting background application.");
            }
          })(n.color);
          await y(2);
        }
        await v(o, "pre_submit");
        b("Publishing post");
        await y(1);
        const submitButtonVal = await function (e = 30, t = 1e3) {
          return new Promise(async n => {
            let o = 0;
            for (; o < e;) {
              const btn = h() || document.querySelector('div[aria-label="Post"][role="button"]') || document.querySelector('div[aria-label="Đăng"][role="button"]') || document.querySelector('div[aria-label="Tiếp"][role="button"]');
              if (btn) {
                const isDisabled = btn.getAttribute("aria-disabled") === "true" || btn.disabled || btn.classList.contains("disabled");
                if (!isDisabled) {
                  console.log("Post button found and enabled. Clicking...");
                  g = btn;
                  f(btn);
                  // Optionally try native click as fallback
                  setTimeout(() => { try { btn.click(); } catch(err){} }, 500);
                  return void n(!0);
                } else {
                  console.log("Post button found but disabled. Waiting... (aria-disabled: " + btn.getAttribute("aria-disabled") + ")");
                }
              }
              o++, await y(t / 1e3);
            }
            console.log("Post button still not found or remained disabled after retries.");
            showDebugLog();
            chrome.storage.local.set({ operationStatus: 'failed' });
            n(!1);
          });
        }();
        if (!submitButtonVal) {
          console.error("[FACEBOOK-AUTO] Post button not found or disabled. Aborting.");
          return;
        }
        console.log("Submit button clicked. Immediately checking for success/pending banners...");
        try {
          let status = await p(1, 15); // Check status with 15 attempts (up to 30 seconds total)
          if (status === "pending" || status === "success") {
            console.log("Success or Pending banner detected! Waiting 10 seconds before closing tab...");
            b("Post published successfully, saving data");
            await y(10); // Wait 10 seconds for success status, as requested by user
            chrome.storage.local.set({ operationStatus: "successful" });
          } else if (status === "restricted") {
            chrome.storage.local.set({ operationStatus: "restricted" });
          } else {
            console.log("Unknown status after 30 seconds, assuming failure.");
            showDebugLog();
            chrome.storage.local.set({ operationStatus: "failed" });
          }
        } catch (e) {
          console.error("Error during post verification:", e);
          showDebugLog();
          chrome.storage.local.set({ operationStatus: "failed" });
        }
      } catch (e) {
        console.error("An error occurred during post creation:", e);
        showDebugLog();
        chrome.storage.local.set({ operationStatus: 'failed' });
      }
    });
  }
  return !0;
});

let g = null;

function m(e) {
  if (!e || typeof e !== "string") return "";
  const t = /\{([^{}]+)\}/;
  for (; t.test(e);) e = e.replace(t, (e, t) => {
    const n = t.split("|");
    return m(n[Math.floor(Math.random() * n.length)].trim());
  });
  return e;
}

function y(e) {
  return new Promise(t => {
    try {
      chrome.storage.local.get(['fbAutoMinMicro', 'fbAutoMaxMicro'], function(res) {
        let minM = res.fbAutoMinMicro || 2;
        let maxM = res.fbAutoMaxMicro || 7;
        let randomSec = Math.floor(Math.random() * (maxM - minM + 1)) + minM;
        // add decimal jitter
        let finalDelay = randomSec + Math.random();
        // ensure it's at least as long as the hardcoded delay if the hardcoded delay is larger
        if (e > finalDelay && e > maxM) {
           finalDelay = e; 
        }
        setTimeout(t, 1e3 * finalDelay);
      });
    } catch(err) {
      setTimeout(t, 1e3 * e);
    }
  });
}

async function v(e, t) {
  let n, o;
  const r = {
      1: { pre_text: [.5, 1.5], between_media: [.8, 2], pre_submit: [.5, 1.5] },
      2: { pre_text: [1, 3], between_media: [1.5, 4], pre_submit: [1.2, 3.5] },
      3: { pre_text: [2.5, 5], between_media: [3, 7], pre_submit: [3, 6] }
    },
    i = r[String(e)] || r[2];
  [n, o] = i[t] || [1, 2];
  const a = function (e, t) {
    return Math.random() * (t - e) + e;
  }(n, o);
  console.log(`Security delay (${t}, level ${e}): waiting ${a.toFixed(2)}s`), b(`Humanized pause - Level ${e} (${a.toFixed(1)}s)`), await y(a);
}

function b(e) {
  const t = document.getElementById("gpOverlayInfo");
  t && (t.innerHTML = e);
}

async function x(e, t = 1e4, n = !1, o = !1) {
  const r = Date.now();
  if (n) {
    const t = document.querySelectorAll(e);
    if (t.length > 0) return t[t.length - 1] || t[0];
  } else {
    const t = document.querySelector(e);
    if (t) return t;
  }
  for (; Date.now() - r < t;) {
    if (await new Promise(e => setTimeout(e, 100)), n) {
      const t = document.querySelectorAll(e);
      if (t.length > 0) return t[t.length - 1] || t[0];
    } else {
      const t = document.querySelector(e);
      if (t) return t;
    }
  }
  if (o) return null;
  throw new Error(`Timeout waiting for element: ${e}`);
}

async function w(e, t = "post") {
  await y(1);
  const success = await (async function (e) {
    let t = null;
    const n = document.querySelector("p.xdj266r.x14z9mp.xat24cr.x1lziwak.x16tdsg8");
    const o = n ? n.closest('[contenteditable="true"]') : null;
    if (o) {
      let e = o.parentElement;
      for (; e && e !== document.body; ) {
        const n = e.getAttribute("role");
        const o = e.tagName.toLowerCase();
        if ("dialog" === n || "main" === n || "form" === o) {
          t = e;
          break;
        }
        e = e.parentElement;
      }
    }
    if (!t) {
      for (const e of [
        'div[aria-label*="Create post"]',
        'div[aria-label*="Utwórz post"]',
        'div[aria-label*="anonim"]',
        'div[aria-label*="nonymous"]',
        'form[method="POST"]'
      ]) {
        const n = document.querySelector(e);
        if (n) {
          t = n;
          break;
        }
      }
    }
    if (!t) {
      for (const e of document.querySelectorAll('[role="dialog"]')) {
        if (e.querySelector('[aria-label="Opublikuj"], [aria-label="Post"], [aria-label*="publi"], [aria-label*="Publi"]')) {
          t = e;
          break;
        }
      }
    }
    if (!t) {
      const e = document.querySelector('input[role="switch"][aria-label*="anonim"], input[role="switch"][aria-label*="nonymous"]');
      if (e) {
        let n = e.parentElement;
        for (; n && n !== document.body; ) {
          const e = n.getAttribute("role");
          const o = n.tagName.toLowerCase();
          if ("dialog" === e || "main" === e || "form" === o) {
            t = n;
            break;
          }
          n = n.parentElement;
        }
      }
    }
    if (!t) {
      const e = Array.from(document.querySelectorAll('[role="dialog"]'));
      e.length > 0 && (t = e[e.length - 1]);
    }
    t || (console.warn("Post dialog not found, falling back to document.body"), (t = document.body));
    
    let i = null;
    const mediaKeywords = ["photo", "video", "ảnh", "film", "zdjęci", "foto", "รูปภาพ", "תמונה", "ফটো", "រូបថត", "litrato", "صورة"];
    const allCandidates = Array.from(
      t.querySelectorAll('div[role="button"], div[aria-label], span[aria-label], a[aria-label], div[title], span[title], button')
    );
    for (const el of allCandidates) {
      const label = (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || "").toLowerCase();
      if (mediaKeywords.some((kw) => label.includes(kw))) {
        if (!label.includes("close") && !label.includes("đóng") && !label.includes("hủy") && !label.includes("cancel")) {
          i = el;
          break;
        }
      }
    }
    if (!i) {
      const r = [
        'div[aria-label="Zdjęcie/film"]',
        'div[aria-label="Photo/Video"]',
        'div[aria-label="Dodaj zdjęcia/filmy"]',
        'div[aria-label="Add Photos/Videos"]',
        'div[aria-label*="Photo"]',
        'div[aria-label*="photo"]',
        'div[aria-label*="zdjęci"]',
        'div[aria-label*="film"]',
        'div[aria-label*="video"]',
        'div[aria-label="Foto/vídeo"]',
        'div[aria-label="Ảnh/video"]',
        'div[aria-label="รูปภาพ/วิดีโอ"]',
        'div[aria-label="Foto/video"]',
        'div[aria-label="תמונה או סרטון"]',
        'div[aria-label="ফটো/ভিডিও"]',
        'div[aria-label="រូបថត/វីដេអូ"]',
        'div[aria-label="Litrato/Video"]',
        'div[aria-label="ⵜⴰⵡⵍⴰⴼⵜ/ⴰⴼⵉⴷⵢⵓ"]',
        'div[aria-label="صورة/fيديو"]',
        'div[aria-label*="Video"]'
      ];
      for (const e of r) {
        i = t.querySelector(e);
        if (i) break;
      }
    }
    if (!i) {
      for (const e of t.querySelectorAll('div[role="button"]')) {
        const t = e.textContent.toLowerCase();
        if (t.includes("photo") || t.includes("zdjęcie") || t.includes("film") || t.includes("video")) {
          i = e;
          break;
        }
      }
    }
    if (!i) return console.error("Could not find photo button inside post dialog"), !1;
    
    let f = Array.from(t.querySelectorAll('input[type="file"]'));
    if (0 === f.length) {
      const a = new Set(f);
      let s;
      const l = new Promise((e) => {
          s = e;
        }),
        c = new MutationObserver(() => {
          const e = Array.from(t.querySelectorAll('input[type="file"]')).filter((e) => !a.has(e));
          e.length > 0 && (c.disconnect(), s(e));
        });
      c.observe(document.body, { childList: !0, subtree: !0 });
      const u = new Promise((e) =>
        setTimeout(() => {
          c.disconnect(), e([]);
        }, 4000)
      );
      const preventFilePicker = (e) => {
        if ("input" === e.target.tagName.toLowerCase() && "file" === e.target.type) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener("click", preventFilePicker, true);
      i.click();
      setTimeout(() => {
        document.removeEventListener("click", preventFilePicker, true);
      }, 2000);
      
      await y(0.5);
      let d = await Promise.race([l, u]);
      f = d.length > 0 ? d : Array.from(t.querySelectorAll('input[type="file"]'));
      if (0 === f.length) {
        await y(0.2);
        f = Array.from(t.querySelectorAll('input[type="file"]'));
      }
    }
    if (0 === f.length) return console.error("No file input found in post dialog"), !1;
    
    function dataURLtoBlob(dataurl) {
      try {
        const parts = dataurl.split(',');
        if (parts.length < 2) return null;
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      } catch (e) {
        console.error("[FACEBOOK-AUTO] Error converting dataURL to Blob:", e);
        return null;
      }
    }

    const p = new DataTransfer();
    try {
      const urls = Array.isArray(e) ? e : [e];
      for (let idx = 0; idx < urls.length; idx++) {
        const url = urls[idx];
        if (url && url.startsWith("data:")) {
          console.log(`[FACEBOOK-AUTO] Processing image ${idx + 1}/${urls.length}...`);
          const blob = dataURLtoBlob(url);
          if (blob) {
            const o = new File([blob], `photo_${new Date().getTime()}_${idx}.jpg`, { type: blob.type || "image/jpeg" });
            p.items.add(o);
          }
        } else {
          console.warn("Skipping photo with unexpected URL scheme (base64 log avoided)");
        }
      }
    } catch (t) {
      console.error(`Error processing photos:`, t);
    }
    if (0 === p.files.length) return console.error("No photos could be processed from storage"), !1;
    
    for (const e of f) {
      try {
        e.files = p.files;
        e.dispatchEvent(new Event("change", { bubbles: !0 }));
        e.dispatchEvent(new Event("input", { bubbles: !0 }));
        await y(0.2);
        for (const e of document.querySelectorAll('div[role="button"]')) {
          const t = e.textContent.toLowerCase();
          if ("continue" === t || "next" === t || "kontynuuj" === t || "dalej" === t) {
            e.click();
            break;
          }
        }
        return await y(0.2), !0;
      } catch (e) {
        console.error(`Error triggering upload on input: ${e.message}`);
      }
    }
    return !1;
  })(e);
  if (success) {
    await y("video" === e.type ? 3 : 0.5);
  }
}

chrome.runtime.onMessage.addListener((e,t,n)=>{if("startGroupScrape"===e.action)return(async()=>{try{const e=(()=>{try{const e=document.querySelectorAll("script");for(const t of e)if(t.textContent.includes("DTSGInitialData")){const e=t.textContent.match(/"?token"?\s*:\s*"([^"]+)"/);if(e)return e[1]}}catch(e){console.warn("Could not parse fb_dtsg from DOM",e)}try{const e=sessionStorage.getItem("fbGroupTokens");if(e)return JSON.parse(e).fbDtsg}catch(e){}return null})();if(!e)throw new Error("Authentication tokens not found. Make sure you are logged into Facebook.");const t=async(t,n)=>{const o=new URLSearchParams;o.append("fb_dtsg",e),o.append("doc_id",t),o.append("variables",JSON.stringify(n));const r=await fetch("https://www.facebook.com/api/graphql/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:o.toString()});if(!r.ok)throw new Error(`API request failed with HTTP status: ${r.status}`);const i=await r.text();if(!i)throw new Error("API returned an empty response.");for(const e of i.split("\n")){if(!e.trim())continue;const t=e.startsWith("for (;;);")?e.substring(9):e;try{const e=JSON.parse(t);if(e.errors&&Array.isArray(e.errors)&&e.errors.length>0){const t=e.errors[0].message||"Unknown Facebook API error.";throw new Error(`Facebook API Error: ${t}`)}if(e.data)return e}catch(e){}}throw new Error("Could not find a valid data object in the API response.")};let n=[];const o="7740459739385247",r={ordering:["viewer_added"],scale:1},i=await t(o,r),a=i.data?.viewer?.groups_tab;if(!a)throw new Error("Could not find `data.viewer.groups_tab` in the API response.");a.pinned_groups?.edges&&n.push(...a.pinned_groups.edges.map(e=>`https://www.facebook.com/groups/${e.node.id}`)),a.tab_groups_list?.edges&&n.push(...a.tab_groups_list.edges.map(e=>`https://www.facebook.com/groups/${e.node.id}`));let s=a.tab_groups_list?.page_info?.has_next_page||!1,l=a.tab_groups_list?.page_info?.end_cursor||null;const c="7218669964900608";for(;s;){await new Promise(e=>setTimeout(e,300));const e={count:10,cursor:l,ordering:["viewer_added"],scale:1},o=await t(c,e),r=o.data?.viewer?.groups_tab?.tab_groups_list;r?.edges&&n.push(...r.edges.map(e=>`https://www.facebook.com/groups/${e.node.id}`)),s=r?.page_info?.has_next_page||!1,l=r?.page_info?.end_cursor||null}n=[...new Set(n)],chrome.storage.local.set({LinksArray:n}),console.log("Group extraction successful, saved to LinksArray:",n)}catch(e){console.error("Group extraction failed:",e),chrome.storage.local.set({ExtractError:e.message})}})(),!0})})()})();