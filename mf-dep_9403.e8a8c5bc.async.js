(self.webpackChunkcaitou_admin=self.webpackChunkcaitou_admin||[]).push([["mf-dep_9403"],{65e3:function(j,D,v){j.exports=v(89155)},72838:function(j,D,v){"use strict";v.d(D,{Z:function(){return x}});function w(N,L,A,B,V,c,W){try{var S=N[c](W),R=S.value}catch(K){A(K);return}S.done?L(R):Promise.resolve(R).then(B,V)}function x(N){return function(){var L=this,A=arguments;return new Promise(function(B,V){var c=N.apply(L,A);function W(R){w(c,B,V,W,S,"next",R)}function S(R){w(c,B,V,W,S,"throw",R)}W(void 0)})}}},9403:function(j,D,v){"use strict";v.d(D,{Z:function(){return Pn}});var w=v(92145),x=v(31727),N=v(63962),L=v(15409),A=v(25614),B=v(98853),V=v(87687),c=v(59301),W=v(4676),S=v(80775),R=v(83156),K=v(86014),Q=v(90591),oe=v(58979),yt=v(3556),wt=v(12208),ce=v.n(wt);function bt(e,o,t){return t?e[0]===o[0]:e[0]===o[0]&&e[1]===o[1]}function Pt(e,o,t){var i=e[o]||{};return(0,w.Z)((0,w.Z)({},i),t)}function Tt(e,o,t,i){for(var a=t.points,u=Object.keys(e),n=0;n<u.length;n+=1){var s=u[n];if(bt(e[s].points,a,i))return"".concat(o,"-placement-").concat(s)}return""}var Y=v(39003),Ct=v(69543),Mt=v(32306),ye=v(87670);function Ve(e){var o=e.prefixCls,t=e.motion,i=e.animation,a=e.transitionName;return t||(i?{motionName:"".concat(o,"-").concat(i)}:a?{motionName:a}:null)}function xt(e){var o=e.prefixCls,t=e.visible,i=e.zIndex,a=e.mask,u=e.maskMotion,n=e.maskAnimation,s=e.maskTransitionName;if(!a)return null;var r={};return(u||s||n)&&(r=(0,w.Z)({motionAppear:!0},Ve({motion:u,prefixCls:o,transitionName:s,animation:n}))),c.createElement(ye.Z,(0,x.Z)({},r,{visible:t,removeOnLeave:!0}),function(l){var h=l.className;return c.createElement("div",{style:{zIndex:i},className:ce()("".concat(o,"-mask"),h)})})}var St=v(78363),Et=v(42730);function He(e,o){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);o&&(i=i.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),t.push.apply(t,i)}return t}function Ze(e){for(var o=1;o<arguments.length;o++){var t=arguments[o]!=null?arguments[o]:{};o%2?He(Object(t),!0).forEach(function(i){Ot(e,i,t[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):He(Object(t)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(t,i))})}return e}function fe(e){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?fe=function(t){return typeof t}:fe=function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},fe(e)}function Ot(e,o,t){return o in e?Object.defineProperty(e,o,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[o]=t,e}var ie,Dt={Webkit:"-webkit-",Moz:"-moz-",ms:"-ms-",O:"-o-"};function pe(){if(ie!==void 0)return ie;ie="";var e=document.createElement("p").style,o="Transform";for(var t in Dt)t+o in e&&(ie=t);return ie}function We(){return pe()?"".concat(pe(),"TransitionProperty"):"transitionProperty"}function de(){return pe()?"".concat(pe(),"Transform"):"transform"}function Le(e,o){var t=We();t&&(e.style[t]=o,t!=="transitionProperty"&&(e.style.transitionProperty=o))}function we(e,o){var t=de();t&&(e.style[t]=o,t!=="transform"&&(e.style.transform=o))}function Nt(e){return e.style.transitionProperty||e.style[We()]}function Rt(e){var o=window.getComputedStyle(e,null),t=o.getPropertyValue("transform")||o.getPropertyValue(de());if(t&&t!=="none"){var i=t.replace(/[^0-9\-.,]/g,"").split(",");return{x:parseFloat(i[12]||i[4],0),y:parseFloat(i[13]||i[5],0)}}return{x:0,y:0}}var kt=/matrix\((.*)\)/,At=/matrix3d\((.*)\)/;function Vt(e,o){var t=window.getComputedStyle(e,null),i=t.getPropertyValue("transform")||t.getPropertyValue(de());if(i&&i!=="none"){var a,u=i.match(kt);if(u)u=u[1],a=u.split(",").map(function(s){return parseFloat(s,10)}),a[4]=o.x,a[5]=o.y,we(e,"matrix(".concat(a.join(","),")"));else{var n=i.match(At)[1];a=n.split(",").map(function(s){return parseFloat(s,10)}),a[12]=o.x,a[13]=o.y,we(e,"matrix3d(".concat(a.join(","),")"))}}else we(e,"translateX(".concat(o.x,"px) translateY(").concat(o.y,"px) translateZ(0)"))}var Ht=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,re;function Be(e){var o=e.style.display;e.style.display="none",e.offsetHeight,e.style.display=o}function te(e,o,t){var i=t;if(fe(o)==="object"){for(var a in o)o.hasOwnProperty(a)&&te(e,a,o[a]);return}if(typeof i!="undefined"){typeof i=="number"&&(i="".concat(i,"px")),e.style[o]=i;return}return re(e,o)}function Zt(e){var o,t,i,a=e.ownerDocument,u=a.body,n=a&&a.documentElement;return o=e.getBoundingClientRect(),t=o.left,i=o.top,t-=n.clientLeft||u.clientLeft||0,i-=n.clientTop||u.clientTop||0,{left:t,top:i}}function Ie(e,o){var t=e["page".concat(o?"Y":"X","Offset")],i="scroll".concat(o?"Top":"Left");if(typeof t!="number"){var a=e.document;t=a.documentElement[i],typeof t!="number"&&(t=a.body[i])}return t}function ze(e){return Ie(e)}function Fe(e){return Ie(e,!0)}function ae(e){var o=Zt(e),t=e.ownerDocument,i=t.defaultView||t.parentWindow;return o.left+=ze(i),o.top+=Fe(i),o}function be(e){return e!=null&&e==e.window}function Xe(e){return be(e)?e.document:e.nodeType===9?e:e.ownerDocument}function Wt(e,o,t){var i=t,a="",u=Xe(e);return i=i||u.defaultView.getComputedStyle(e,null),i&&(a=i.getPropertyValue(o)||i[o]),a}var Lt=new RegExp("^(".concat(Ht,")(?!px)[a-z%]+$"),"i"),Bt=/^(top|right|bottom|left)$/,Pe="currentStyle",Te="runtimeStyle",J="left",It="px";function zt(e,o){var t=e[Pe]&&e[Pe][o];if(Lt.test(t)&&!Bt.test(o)){var i=e.style,a=i[J],u=e[Te][J];e[Te][J]=e[Pe][J],i[J]=o==="fontSize"?"1em":t||0,t=i.pixelLeft+It,i[J]=a,e[Te][J]=u}return t===""?"auto":t}typeof window!="undefined"&&(re=window.getComputedStyle?Wt:zt);function ve(e,o){return e==="left"?o.useCssRight?"right":e:o.useCssBottom?"bottom":e}function Ye(e){if(e==="left")return"right";if(e==="right")return"left";if(e==="top")return"bottom";if(e==="bottom")return"top"}function $e(e,o,t){te(e,"position")==="static"&&(e.style.position="relative");var i=-999,a=-999,u=ve("left",t),n=ve("top",t),s=Ye(u),r=Ye(n);u!=="left"&&(i=999),n!=="top"&&(a=999);var l="",h=ae(e);("left"in o||"top"in o)&&(l=Nt(e)||"",Le(e,"none")),"left"in o&&(e.style[s]="",e.style[u]="".concat(i,"px")),"top"in o&&(e.style[r]="",e.style[n]="".concat(a,"px")),Be(e);var m=ae(e),p={};for(var f in o)if(o.hasOwnProperty(f)){var d=ve(f,t),y=f==="left"?i:a,C=h[f]-m[f];d===f?p[d]=y+C:p[d]=y-C}te(e,p),Be(e),("left"in o||"top"in o)&&Le(e,l);var b={};for(var P in o)if(o.hasOwnProperty(P)){var T=ve(P,t),E=o[P]-h[P];P===T?b[T]=p[T]+E:b[T]=p[T]-E}te(e,b)}function Ft(e,o){var t=ae(e),i=Rt(e),a={x:i.x,y:i.y};"left"in o&&(a.x=i.x+o.left-t.left),"top"in o&&(a.y=i.y+o.top-t.top),Vt(e,a)}function Xt(e,o,t){if(t.ignoreShake){var i=ae(e),a=i.left.toFixed(0),u=i.top.toFixed(0),n=o.left.toFixed(0),s=o.top.toFixed(0);if(a===n&&u===s)return}t.useCssRight||t.useCssBottom?$e(e,o,t):t.useCssTransform&&de()in document.body.style?Ft(e,o):$e(e,o,t)}function Ce(e,o){for(var t=0;t<e.length;t++)o(e[t])}function je(e){return re(e,"boxSizing")==="border-box"}var Yt=["margin","border","padding"],Me=-1,$t=2,xe=1,jt=0;function Ut(e,o,t){var i={},a=e.style,u;for(u in o)o.hasOwnProperty(u)&&(i[u]=a[u],a[u]=o[u]);t.call(e);for(u in o)o.hasOwnProperty(u)&&(a[u]=i[u])}function ue(e,o,t){var i=0,a,u,n;for(u=0;u<o.length;u++)if(a=o[u],a)for(n=0;n<t.length;n++){var s=void 0;a==="border"?s="".concat(a).concat(t[n],"Width"):s=a+t[n],i+=parseFloat(re(e,s))||0}return i}var I={getParent:function(o){var t=o;do t.nodeType===11&&t.host?t=t.host:t=t.parentNode;while(t&&t.nodeType!==1&&t.nodeType!==9);return t}};Ce(["Width","Height"],function(e){I["doc".concat(e)]=function(o){var t=o.document;return Math.max(t.documentElement["scroll".concat(e)],t.body["scroll".concat(e)],I["viewport".concat(e)](t))},I["viewport".concat(e)]=function(o){var t="client".concat(e),i=o.document,a=i.body,u=i.documentElement,n=u[t];return i.compatMode==="CSS1Compat"&&n||a&&a[t]||n}});function Ue(e,o,t){var i=t;if(be(e))return o==="width"?I.viewportWidth(e):I.viewportHeight(e);if(e.nodeType===9)return o==="width"?I.docWidth(e):I.docHeight(e);var a=o==="width"?["Left","Right"]:["Top","Bottom"],u=o==="width"?e.getBoundingClientRect().width:e.getBoundingClientRect().height,n=je(e),s=0;(u==null||u<=0)&&(u=void 0,s=re(e,o),(s==null||Number(s)<0)&&(s=e.style[o]||0),s=parseFloat(s)||0),i===void 0&&(i=n?xe:Me);var r=u!==void 0||n,l=u||s;return i===Me?r?l-ue(e,["border","padding"],a):s:r?i===xe?l:l+(i===$t?-ue(e,["border"],a):ue(e,["margin"],a)):s+ue(e,Yt.slice(i),a)}var _t={position:"absolute",visibility:"hidden",display:"block"};function _e(){for(var e=arguments.length,o=new Array(e),t=0;t<e;t++)o[t]=arguments[t];var i,a=o[0];return a.offsetWidth!==0?i=Ue.apply(void 0,o):Ut(a,_t,function(){i=Ue.apply(void 0,o)}),i}Ce(["width","height"],function(e){var o=e.charAt(0).toUpperCase()+e.slice(1);I["outer".concat(o)]=function(i,a){return i&&_e(i,e,a?jt:xe)};var t=e==="width"?["Left","Right"]:["Top","Bottom"];I[e]=function(i,a){var u=a;if(u!==void 0){if(i){var n=je(i);return n&&(u+=ue(i,["padding","border"],t)),te(i,e,u)}return}return i&&_e(i,e,Me)}});function Ge(e,o){for(var t in o)o.hasOwnProperty(t)&&(e[t]=o[t]);return e}var g={getWindow:function(o){if(o&&o.document&&o.setTimeout)return o;var t=o.ownerDocument||o;return t.defaultView||t.parentWindow},getDocument:Xe,offset:function(o,t,i){if(typeof t!="undefined")Xt(o,t,i||{});else return ae(o)},isWindow:be,each:Ce,css:te,clone:function(o){var t,i={};for(t in o)o.hasOwnProperty(t)&&(i[t]=o[t]);var a=o.overflow;if(a)for(t in o)o.hasOwnProperty(t)&&(i.overflow[t]=o.overflow[t]);return i},mix:Ge,getWindowScrollLeft:function(o){return ze(o)},getWindowScrollTop:function(o){return Fe(o)},merge:function(){for(var o={},t=0;t<arguments.length;t++)g.mix(o,t<0||arguments.length<=t?void 0:arguments[t]);return o},viewportWidth:0,viewportHeight:0};Ge(g,I);var Se=g.getParent;function Ee(e){if(g.isWindow(e)||e.nodeType===9)return null;var o=g.getDocument(e),t=o.body,i,a=g.css(e,"position"),u=a==="fixed"||a==="absolute";if(!u)return e.nodeName.toLowerCase()==="html"?null:Se(e);for(i=Se(e);i&&i!==t&&i.nodeType!==9;i=Se(i))if(a=g.css(i,"position"),a!=="static")return i;return null}var Ke=g.getParent;function Gt(e){if(g.isWindow(e)||e.nodeType===9)return!1;var o=g.getDocument(e),t=o.body,i=null;for(i=Ke(e);i&&i!==t&&i!==o;i=Ke(i)){var a=g.css(i,"position");if(a==="fixed")return!0}return!1}function Oe(e,o){for(var t={left:0,right:Infinity,top:0,bottom:Infinity},i=Ee(e),a=g.getDocument(e),u=a.defaultView||a.parentWindow,n=a.body,s=a.documentElement;i;){if((navigator.userAgent.indexOf("MSIE")===-1||i.clientWidth!==0)&&i!==n&&i!==s&&g.css(i,"overflow")!=="visible"){var r=g.offset(i);r.left+=i.clientLeft,r.top+=i.clientTop,t.top=Math.max(t.top,r.top),t.right=Math.min(t.right,r.left+i.clientWidth),t.bottom=Math.min(t.bottom,r.top+i.clientHeight),t.left=Math.max(t.left,r.left)}else if(i===n||i===s)break;i=Ee(i)}var l=null;if(!g.isWindow(e)&&e.nodeType!==9){l=e.style.position;var h=g.css(e,"position");h==="absolute"&&(e.style.position="fixed")}var m=g.getWindowScrollLeft(u),p=g.getWindowScrollTop(u),f=g.viewportWidth(u),d=g.viewportHeight(u),y=s.scrollWidth,C=s.scrollHeight,b=window.getComputedStyle(n);if(b.overflowX==="hidden"&&(y=u.innerWidth),b.overflowY==="hidden"&&(C=u.innerHeight),e.style&&(e.style.position=l),o||Gt(e))t.left=Math.max(t.left,m),t.top=Math.max(t.top,p),t.right=Math.min(t.right,m+f),t.bottom=Math.min(t.bottom,p+d);else{var P=Math.max(y,m+f);t.right=Math.min(t.right,P);var T=Math.max(C,p+d);t.bottom=Math.min(t.bottom,T)}return t.top>=0&&t.left>=0&&t.bottom>t.top&&t.right>t.left?t:null}function Kt(e,o,t,i){var a=g.clone(e),u={width:o.width,height:o.height};return i.adjustX&&a.left<t.left&&(a.left=t.left),i.resizeWidth&&a.left>=t.left&&a.left+u.width>t.right&&(u.width-=a.left+u.width-t.right),i.adjustX&&a.left+u.width>t.right&&(a.left=Math.max(t.right-u.width,t.left)),i.adjustY&&a.top<t.top&&(a.top=t.top),i.resizeHeight&&a.top>=t.top&&a.top+u.height>t.bottom&&(u.height-=a.top+u.height-t.bottom),i.adjustY&&a.top+u.height>t.bottom&&(a.top=Math.max(t.bottom-u.height,t.top)),g.mix(a,u)}function De(e){var o,t,i;if(!g.isWindow(e)&&e.nodeType!==9)o=g.offset(e),t=g.outerWidth(e),i=g.outerHeight(e);else{var a=g.getWindow(e);o={left:g.getWindowScrollLeft(a),top:g.getWindowScrollTop(a)},t=g.viewportWidth(a),i=g.viewportHeight(a)}return o.width=t,o.height=i,o}function Qe(e,o){var t=o.charAt(0),i=o.charAt(1),a=e.width,u=e.height,n=e.left,s=e.top;return t==="c"?s+=u/2:t==="b"&&(s+=u),i==="c"?n+=a/2:i==="r"&&(n+=a),{left:n,top:s}}function he(e,o,t,i,a){var u=Qe(o,t[1]),n=Qe(e,t[0]),s=[n.left-u.left,n.top-u.top];return{left:Math.round(e.left-s[0]+i[0]-a[0]),top:Math.round(e.top-s[1]+i[1]-a[1])}}function Je(e,o,t){return e.left<t.left||e.left+o.width>t.right}function qe(e,o,t){return e.top<t.top||e.top+o.height>t.bottom}function Qt(e,o,t){return e.left>t.right||e.left+o.width<t.left}function Jt(e,o,t){return e.top>t.bottom||e.top+o.height<t.top}function me(e,o,t){var i=[];return g.each(e,function(a){i.push(a.replace(o,function(u){return t[u]}))}),i}function ge(e,o){return e[o]=-e[o],e}function et(e,o){var t;return/%$/.test(e)?t=parseInt(e.substring(0,e.length-1),10)/100*o:t=parseInt(e,10),t||0}function tt(e,o){e[0]=et(e[0],o.width),e[1]=et(e[1],o.height)}function nt(e,o,t,i){var a=t.points,u=t.offset||[0,0],n=t.targetOffset||[0,0],s=t.overflow,r=t.source||e;u=[].concat(u),n=[].concat(n),s=s||{};var l={},h=0,m=!!(s&&s.alwaysByViewport),p=Oe(r,m),f=De(r);tt(u,f),tt(n,o);var d=he(f,o,a,u,n),y=g.merge(f,d);if(p&&(s.adjustX||s.adjustY)&&i){if(s.adjustX&&Je(d,f,p)){var C=me(a,/[lr]/gi,{l:"r",r:"l"}),b=ge(u,0),P=ge(n,0),T=he(f,o,C,b,P);Qt(T,f,p)||(h=1,a=C,u=b,n=P)}if(s.adjustY&&qe(d,f,p)){var E=me(a,/[tb]/gi,{t:"b",b:"t"}),O=ge(u,1),M=ge(n,1),z=he(f,o,E,O,M);Jt(z,f,p)||(h=1,a=E,u=O,n=M)}h&&(d=he(f,o,a,u,n),g.mix(y,d));var H=Je(d,f,p),F=qe(d,f,p);if(H||F){var Z=a;H&&(Z=me(a,/[lr]/gi,{l:"r",r:"l"})),F&&(Z=me(a,/[tb]/gi,{t:"b",b:"t"})),a=Z,u=t.offset||[0,0],n=t.targetOffset||[0,0]}l.adjustX=s.adjustX&&H,l.adjustY=s.adjustY&&F,(l.adjustX||l.adjustY)&&(y=Kt(d,f,p,l))}return y.width!==f.width&&g.css(r,"width",g.width(r)+y.width-f.width),y.height!==f.height&&g.css(r,"height",g.height(r)+y.height-f.height),g.offset(r,{left:y.left,top:y.top},{useCssRight:t.useCssRight,useCssBottom:t.useCssBottom,useCssTransform:t.useCssTransform,ignoreShake:t.ignoreShake}),{points:a,offset:u,targetOffset:n,overflow:l}}function qt(e,o){var t=Oe(e,o),i=De(e);return!t||i.left+i.width<=t.left||i.top+i.height<=t.top||i.left>=t.right||i.top>=t.bottom}function Ne(e,o,t){var i=t.target||o,a=De(i),u=!qt(i,t.overflow&&t.overflow.alwaysByViewport);return nt(e,a,t,u)}Ne.__getOffsetParent=Ee,Ne.__getVisibleRectForElement=Oe;function en(e,o,t){var i,a,u=g.getDocument(e),n=u.defaultView||u.parentWindow,s=g.getWindowScrollLeft(n),r=g.getWindowScrollTop(n),l=g.viewportWidth(n),h=g.viewportHeight(n);"pageX"in o?i=o.pageX:i=s+o.clientX,"pageY"in o?a=o.pageY:a=r+o.clientY;var m={left:i,top:a,width:0,height:0},p=i>=0&&i<=s+l&&a>=0&&a<=r+h,f=[t.points[0],"cc"];return nt(e,m,Ze(Ze({},t),{},{points:f}),p)}var Sn=null,tn=v(2133);function nn(e,o){return e===o?!0:!e||!o?!1:"pageX"in o&&"pageY"in o?e.pageX===o.pageX&&e.pageY===o.pageY:"clientX"in o&&"clientY"in o?e.clientX===o.clientX&&e.clientY===o.clientY:!1}function on(e,o){e!==document.activeElement&&(0,R.Z)(o,e)&&typeof e.focus=="function"&&e.focus()}function ot(e,o){var t=null,i=null;function a(n){var s=(0,Y.Z)(n,1),r=s[0].target;if(!!document.documentElement.contains(r)){var l=r.getBoundingClientRect(),h=l.width,m=l.height,p=Math.floor(h),f=Math.floor(m);(t!==p||i!==f)&&Promise.resolve().then(function(){o({width:p,height:f})}),t=p,i=f}}var u=new tn.Z(a);return e&&u.observe(e),function(){u.disconnect()}}var rn=function(e,o){var t=c.useRef(!1),i=c.useRef(null);function a(){window.clearTimeout(i.current)}function u(n){if(!t.current||n===!0){if(e()===!1)return;t.current=!0,a(),i.current=window.setTimeout(function(){t.current=!1},o)}else a(),i.current=window.setTimeout(function(){t.current=!1,u()},o)}return[u,function(){t.current=!1,a()}]};function it(e){return typeof e!="function"?null:e()}function rt(e){return(0,St.Z)(e)!=="object"||!e?null:e}var an=function(o,t){var i=o.children,a=o.disabled,u=o.target,n=o.align,s=o.onAlign,r=o.monitorWindowResize,l=o.monitorBufferTime,h=l===void 0?0:l,m=c.useRef({}),p=c.useRef(),f=c.Children.only(i),d=c.useRef({});d.current.disabled=a,d.current.target=u,d.current.onAlign=s;var y=rn(function(){var M=d.current,z=M.disabled,H=M.target,F=M.onAlign;if(!z&&H){var Z=p.current,X,U=it(H),q=rt(H);m.current.element=U,m.current.point=q;var se=document,$=se.activeElement;return U&&(0,Et.Z)(U)?X=Ne(Z,U,n):q&&(X=en(Z,q,n)),on($,Z),F&&X&&F(Z,X),!0}return!1},h),C=(0,Y.Z)(y,2),b=C[0],P=C[1],T=c.useRef({cancel:function(){}}),E=c.useRef({cancel:function(){}});c.useEffect(function(){var M=it(u),z=rt(u);p.current!==E.current.element&&(E.current.cancel(),E.current.element=p.current,E.current.cancel=ot(p.current,b)),(m.current.element!==M||!nn(m.current.point,z))&&(b(),T.current.element!==M&&(T.current.cancel(),T.current.element=M,T.current.cancel=ot(M,b)))}),c.useEffect(function(){a?P():b()},[a]);var O=c.useRef(null);return c.useEffect(function(){r?O.current||(O.current=(0,oe.Z)(window,"resize",b)):O.current&&(O.current.remove(),O.current=null)},[r]),c.useEffect(function(){return function(){T.current.cancel(),E.current.cancel(),O.current&&O.current.remove(),P()}},[]),c.useImperativeHandle(t,function(){return{forceAlign:function(){return b(!0)}}}),c.isValidElement(f)&&(f=c.cloneElement(f,{ref:(0,Q.sQ)(f.ref,p)})),f},at=c.forwardRef(an);at.displayName="Align";var un=at,sn=un,ln=v(65e3),ut=v.n(ln),cn=v(72838),st=["measure","align",null,"motion"],fn=function(e,o){var t=(0,c.useState)(null),i=(0,Y.Z)(t,2),a=i[0],u=i[1],n=(0,c.useRef)(),s=(0,c.useRef)(!1);function r(m){s.current||u(m)}function l(){S.Z.cancel(n.current)}function h(m){l(),n.current=(0,S.Z)(function(){r(function(p){switch(a){case"align":return"motion";case"motion":return"stable";default:}return p}),m==null||m()})}return(0,c.useEffect)(function(){r("measure")},[e]),(0,c.useEffect)(function(){switch(a){case"measure":o();break;default:}a&&(n.current=(0,S.Z)((0,cn.Z)(ut().mark(function m(){var p,f;return ut().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:p=st.indexOf(a),f=st[p+1],f&&p!==-1&&r(f);case 3:case"end":return y.stop()}},m)}))))},[a]),(0,c.useEffect)(function(){return function(){s.current=!0,l()}},[]),[a,h]},pn=function(e){var o=c.useState({width:0,height:0}),t=(0,Y.Z)(o,2),i=t[0],a=t[1];function u(s){a({width:s.offsetWidth,height:s.offsetHeight})}var n=c.useMemo(function(){var s={};if(e){var r=i.width,l=i.height;e.indexOf("height")!==-1&&l?s.height=l:e.indexOf("minHeight")!==-1&&l&&(s.minHeight=l),e.indexOf("width")!==-1&&r?s.width=r:e.indexOf("minWidth")!==-1&&r&&(s.minWidth=r)}return s},[e,i]);return[n,u]},lt=c.forwardRef(function(e,o){var t=e.visible,i=e.prefixCls,a=e.className,u=e.style,n=e.children,s=e.zIndex,r=e.stretch,l=e.destroyPopupOnHide,h=e.forceRender,m=e.align,p=e.point,f=e.getRootDomNode,d=e.getClassNameFromAlign,y=e.onAlign,C=e.onMouseEnter,b=e.onMouseLeave,P=e.onMouseDown,T=e.onTouchStart,E=(0,c.useRef)(),O=(0,c.useRef)(),M=(0,c.useState)(),z=(0,Y.Z)(M,2),H=z[0],F=z[1],Z=pn(r),X=(0,Y.Z)(Z,2),U=X[0],q=X[1];function se(){r&&q(f())}var $=fn(t,se),dt=(0,Y.Z)($,2),_=dt[0],ke=dt[1],Ae=(0,c.useRef)();function Tn(){return p||f}function vt(){var k;(k=E.current)===null||k===void 0||k.forceAlign()}function Cn(k,G){if(_==="align"){var ne=d(G);F(ne),H!==ne?Promise.resolve().then(function(){vt()}):ke(function(){var ee;(ee=Ae.current)===null||ee===void 0||ee.call(Ae)}),y==null||y(k,G)}}var le=(0,w.Z)({},Ve(e));["onAppearEnd","onEnterEnd","onLeaveEnd"].forEach(function(k){var G=le[k];le[k]=function(ne,ee){return ke(),G==null?void 0:G(ne,ee)}});function ht(){return new Promise(function(k){Ae.current=k})}c.useEffect(function(){!le.motionName&&_==="motion"&&ke()},[le.motionName,_]),c.useImperativeHandle(o,function(){return{forceAlign:vt,getElement:function(){return O.current}}});var Mn=(0,w.Z)((0,w.Z)({},U),{},{zIndex:s,opacity:_==="motion"||_==="stable"||!t?void 0:0,pointerEvents:_==="stable"?void 0:"none"},u),mt=!0;(m==null?void 0:m.points)&&(_==="align"||_==="stable")&&(mt=!1);var gt=n;return c.Children.count(n)>1&&(gt=c.createElement("div",{className:"".concat(i,"-content")},n)),c.createElement(ye.Z,(0,x.Z)({visible:t,ref:O,leavedClassName:"".concat(i,"-hidden")},le,{onAppearPrepare:ht,onEnterPrepare:ht,removeOnLeave:l,forceRender:h}),function(k,G){var ne=k.className,ee=k.style,xn=ce()(i,a,H,ne);return c.createElement(sn,{target:Tn(),key:"popup",ref:E,monitorWindowResize:!0,disabled:mt,align:m,onAlign:Cn},c.createElement("div",{ref:G,className:xn,onMouseEnter:C,onMouseLeave:b,onMouseDownCapture:P,onTouchStartCapture:T,style:(0,w.Z)((0,w.Z)({},ee),Mn)},gt))})});lt.displayName="PopupInner";var dn=lt,ct=c.forwardRef(function(e,o){var t=e.prefixCls,i=e.visible,a=e.zIndex,u=e.children,n=e.mobile;n=n===void 0?{}:n;var s=n.popupClassName,r=n.popupStyle,l=n.popupMotion,h=l===void 0?{}:l,m=n.popupRender,p=c.useRef();c.useImperativeHandle(o,function(){return{forceAlign:function(){},getElement:function(){return p.current}}});var f=(0,w.Z)({zIndex:a},r),d=u;return c.Children.count(u)>1&&(d=c.createElement("div",{className:"".concat(t,"-content")},u)),m&&(d=m(d)),c.createElement(ye.Z,(0,x.Z)({visible:i,ref:p,removeOnLeave:!0},h),function(y,C){var b=y.className,P=y.style,T=ce()(t,s,b);return c.createElement("div",{ref:C,className:T,style:(0,w.Z)((0,w.Z)({},P),f)},d)})});ct.displayName="MobilePopupInner";var vn=ct,ft=c.forwardRef(function(e,o){var t=e.visible,i=e.mobile,a=(0,Ct.Z)(e,["visible","mobile"]),u=(0,c.useState)(t),n=(0,Y.Z)(u,2),s=n[0],r=n[1],l=(0,c.useState)(!1),h=(0,Y.Z)(l,2),m=h[0],p=h[1],f=(0,w.Z)((0,w.Z)({},a),{},{visible:s});(0,c.useEffect)(function(){r(t),t&&i&&p((0,Mt.Z)())},[t,i]);var d=m?c.createElement(vn,(0,x.Z)({},f,{mobile:i,ref:o})):c.createElement(dn,(0,x.Z)({},f,{ref:o}));return c.createElement("div",null,c.createElement(xt,f),d)});ft.displayName="Popup";var hn=ft,mn=c.createContext(null),pt=mn;function Re(){}function gn(){return""}function yn(e){return e?e.ownerDocument:window.document}var wn=["onClick","onMouseDown","onTouchStart","onMouseEnter","onMouseLeave","onFocus","onBlur","onContextMenu"];function bn(e){var o=function(t){(0,B.Z)(a,t);var i=(0,V.Z)(a);function a(u){var n;(0,N.Z)(this,a),n=i.call(this,u),n.popupRef=c.createRef(),n.triggerRef=c.createRef(),n.onMouseEnter=function(r){var l=n.props.mouseEnterDelay;n.fireEvents("onMouseEnter",r),n.delaySetPopupVisible(!0,l,l?null:r)},n.onMouseMove=function(r){n.fireEvents("onMouseMove",r),n.setPoint(r)},n.onMouseLeave=function(r){n.fireEvents("onMouseLeave",r),n.delaySetPopupVisible(!1,n.props.mouseLeaveDelay)},n.onPopupMouseEnter=function(){n.clearDelayTimer()},n.onPopupMouseLeave=function(r){var l;r.relatedTarget&&!r.relatedTarget.setTimeout&&(0,R.Z)((l=n.popupRef.current)===null||l===void 0?void 0:l.getElement(),r.relatedTarget)||n.delaySetPopupVisible(!1,n.props.mouseLeaveDelay)},n.onFocus=function(r){n.fireEvents("onFocus",r),n.clearDelayTimer(),n.isFocusToShow()&&(n.focusTime=Date.now(),n.delaySetPopupVisible(!0,n.props.focusDelay))},n.onMouseDown=function(r){n.fireEvents("onMouseDown",r),n.preClickTime=Date.now()},n.onTouchStart=function(r){n.fireEvents("onTouchStart",r),n.preTouchTime=Date.now()},n.onBlur=function(r){n.fireEvents("onBlur",r),n.clearDelayTimer(),n.isBlurToHide()&&n.delaySetPopupVisible(!1,n.props.blurDelay)},n.onContextMenu=function(r){r.preventDefault(),n.fireEvents("onContextMenu",r),n.setPopupVisible(!0,r)},n.onContextMenuClose=function(){n.isContextMenuToShow()&&n.close()},n.onClick=function(r){if(n.fireEvents("onClick",r),n.focusTime){var l;if(n.preClickTime&&n.preTouchTime?l=Math.min(n.preClickTime,n.preTouchTime):n.preClickTime?l=n.preClickTime:n.preTouchTime&&(l=n.preTouchTime),Math.abs(l-n.focusTime)<20)return;n.focusTime=0}n.preClickTime=0,n.preTouchTime=0,n.isClickToShow()&&(n.isClickToHide()||n.isBlurToHide())&&r&&r.preventDefault&&r.preventDefault();var h=!n.state.popupVisible;(n.isClickToHide()&&!h||h&&n.isClickToShow())&&n.setPopupVisible(!n.state.popupVisible,r)},n.onPopupMouseDown=function(){if(n.hasPopupMouseDown=!0,clearTimeout(n.mouseDownTimeout),n.mouseDownTimeout=window.setTimeout(function(){n.hasPopupMouseDown=!1},0),n.context){var r;(r=n.context).onPopupMouseDown.apply(r,arguments)}},n.onDocumentClick=function(r){if(!(n.props.mask&&!n.props.maskClosable)){var l=r.target,h=n.getRootDomNode(),m=n.getPopupDomNode();(!(0,R.Z)(h,l)||n.isContextMenuOnly())&&!(0,R.Z)(m,l)&&!n.hasPopupMouseDown&&n.close()}},n.getRootDomNode=function(){var r=n.props.getTriggerDOMNode;if(r)return r(n.triggerRef.current);try{var l=(0,K.Z)(n.triggerRef.current);if(l)return l}catch(h){}return W.findDOMNode((0,A.Z)(n))},n.getPopupClassNameFromAlign=function(r){var l=[],h=n.props,m=h.popupPlacement,p=h.builtinPlacements,f=h.prefixCls,d=h.alignPoint,y=h.getPopupClassNameFromAlign;return m&&p&&l.push(Tt(p,f,r,d)),y&&l.push(y(r)),l.join(" ")},n.getComponent=function(){var r=n.props,l=r.prefixCls,h=r.destroyPopupOnHide,m=r.popupClassName,p=r.onPopupAlign,f=r.popupMotion,d=r.popupAnimation,y=r.popupTransitionName,C=r.popupStyle,b=r.mask,P=r.maskAnimation,T=r.maskTransitionName,E=r.maskMotion,O=r.zIndex,M=r.popup,z=r.stretch,H=r.alignPoint,F=r.mobile,Z=r.forceRender,X=n.state,U=X.popupVisible,q=X.point,se=n.getPopupAlign(),$={};return n.isMouseEnterToShow()&&($.onMouseEnter=n.onPopupMouseEnter),n.isMouseLeaveToHide()&&($.onMouseLeave=n.onPopupMouseLeave),$.onMouseDown=n.onPopupMouseDown,$.onTouchStart=n.onPopupMouseDown,c.createElement(hn,(0,x.Z)({prefixCls:l,destroyPopupOnHide:h,visible:U,point:H&&q,className:m,align:se,onAlign:p,animation:d,getClassNameFromAlign:n.getPopupClassNameFromAlign},$,{stretch:z,getRootDomNode:n.getRootDomNode,style:C,mask:b,zIndex:O,transitionName:y,maskAnimation:P,maskTransitionName:T,maskMotion:E,ref:n.popupRef,motion:f,mobile:F,forceRender:Z}),typeof M=="function"?M():M)},n.attachParent=function(r){S.Z.cancel(n.attachId);var l=n.props,h=l.getPopupContainer,m=l.getDocument,p=n.getRootDomNode(),f;h?(p||h.length===0)&&(f=h(p)):f=m(n.getRootDomNode()).body,f?f.appendChild(r):n.attachId=(0,S.Z)(function(){n.attachParent(r)})},n.getContainer=function(){var r=n.props.getDocument,l=r(n.getRootDomNode()).createElement("div");return l.style.position="absolute",l.style.top="0",l.style.left="0",l.style.width="100%",n.attachParent(l),l},n.setPoint=function(r){var l=n.props.alignPoint;!l||!r||n.setState({point:{pageX:r.pageX,pageY:r.pageY}})},n.handlePortalUpdate=function(){n.state.prevPopupVisible!==n.state.popupVisible&&n.props.afterPopupVisibleChange(n.state.popupVisible)},n.triggerContextValue={onPopupMouseDown:n.onPopupMouseDown};var s;return"popupVisible"in u?s=!!u.popupVisible:s=!!u.defaultPopupVisible,n.state={prevPopupVisible:s,popupVisible:s},wn.forEach(function(r){n["fire".concat(r)]=function(l){n.fireEvents(r,l)}}),n}return(0,L.Z)(a,[{key:"componentDidMount",value:function(){this.componentDidUpdate()}},{key:"componentDidUpdate",value:function(){var n=this.props,s=this.state;if(s.popupVisible){var r;!this.clickOutsideHandler&&(this.isClickToHide()||this.isContextMenuToShow())&&(r=n.getDocument(this.getRootDomNode()),this.clickOutsideHandler=(0,oe.Z)(r,"mousedown",this.onDocumentClick)),this.touchOutsideHandler||(r=r||n.getDocument(this.getRootDomNode()),this.touchOutsideHandler=(0,oe.Z)(r,"touchstart",this.onDocumentClick)),!this.contextMenuOutsideHandler1&&this.isContextMenuToShow()&&(r=r||n.getDocument(this.getRootDomNode()),this.contextMenuOutsideHandler1=(0,oe.Z)(r,"scroll",this.onContextMenuClose)),!this.contextMenuOutsideHandler2&&this.isContextMenuToShow()&&(this.contextMenuOutsideHandler2=(0,oe.Z)(window,"blur",this.onContextMenuClose));return}this.clearOutsideHandler()}},{key:"componentWillUnmount",value:function(){this.clearDelayTimer(),this.clearOutsideHandler(),clearTimeout(this.mouseDownTimeout),S.Z.cancel(this.attachId)}},{key:"getPopupDomNode",value:function(){var n;return((n=this.popupRef.current)===null||n===void 0?void 0:n.getElement())||null}},{key:"getPopupAlign",value:function(){var n=this.props,s=n.popupPlacement,r=n.popupAlign,l=n.builtinPlacements;return s&&l?Pt(l,s,r):r}},{key:"setPopupVisible",value:function(n,s){var r=this.props.alignPoint,l=this.state.popupVisible;this.clearDelayTimer(),l!==n&&("popupVisible"in this.props||this.setState({popupVisible:n,prevPopupVisible:l}),this.props.onPopupVisibleChange(n)),r&&s&&n&&this.setPoint(s)}},{key:"delaySetPopupVisible",value:function(n,s,r){var l=this,h=s*1e3;if(this.clearDelayTimer(),h){var m=r?{pageX:r.pageX,pageY:r.pageY}:null;this.delayTimer=window.setTimeout(function(){l.setPopupVisible(n,m),l.clearDelayTimer()},h)}else this.setPopupVisible(n,r)}},{key:"clearDelayTimer",value:function(){this.delayTimer&&(clearTimeout(this.delayTimer),this.delayTimer=null)}},{key:"clearOutsideHandler",value:function(){this.clickOutsideHandler&&(this.clickOutsideHandler.remove(),this.clickOutsideHandler=null),this.contextMenuOutsideHandler1&&(this.contextMenuOutsideHandler1.remove(),this.contextMenuOutsideHandler1=null),this.contextMenuOutsideHandler2&&(this.contextMenuOutsideHandler2.remove(),this.contextMenuOutsideHandler2=null),this.touchOutsideHandler&&(this.touchOutsideHandler.remove(),this.touchOutsideHandler=null)}},{key:"createTwoChains",value:function(n){var s=this.props.children.props,r=this.props;return s[n]&&r[n]?this["fire".concat(n)]:s[n]||r[n]}},{key:"isClickToShow",value:function(){var n=this.props,s=n.action,r=n.showAction;return s.indexOf("click")!==-1||r.indexOf("click")!==-1}},{key:"isContextMenuOnly",value:function(){var n=this.props.action;return n==="contextMenu"||n.length===1&&n[0]==="contextMenu"}},{key:"isContextMenuToShow",value:function(){var n=this.props,s=n.action,r=n.showAction;return s.indexOf("contextMenu")!==-1||r.indexOf("contextMenu")!==-1}},{key:"isClickToHide",value:function(){var n=this.props,s=n.action,r=n.hideAction;return s.indexOf("click")!==-1||r.indexOf("click")!==-1}},{key:"isMouseEnterToShow",value:function(){var n=this.props,s=n.action,r=n.showAction;return s.indexOf("hover")!==-1||r.indexOf("mouseEnter")!==-1}},{key:"isMouseLeaveToHide",value:function(){var n=this.props,s=n.action,r=n.hideAction;return s.indexOf("hover")!==-1||r.indexOf("mouseLeave")!==-1}},{key:"isFocusToShow",value:function(){var n=this.props,s=n.action,r=n.showAction;return s.indexOf("focus")!==-1||r.indexOf("focus")!==-1}},{key:"isBlurToHide",value:function(){var n=this.props,s=n.action,r=n.hideAction;return s.indexOf("focus")!==-1||r.indexOf("blur")!==-1}},{key:"forcePopupAlign",value:function(){if(this.state.popupVisible){var n;(n=this.popupRef.current)===null||n===void 0||n.forceAlign()}}},{key:"fireEvents",value:function(n,s){var r=this.props.children.props[n];r&&r(s);var l=this.props[n];l&&l(s)}},{key:"close",value:function(){this.setPopupVisible(!1)}},{key:"render",value:function(){var n=this.state.popupVisible,s=this.props,r=s.children,l=s.forceRender,h=s.alignPoint,m=s.className,p=s.autoDestroy,f=c.Children.only(r),d={key:"trigger"};this.isContextMenuToShow()?d.onContextMenu=this.onContextMenu:d.onContextMenu=this.createTwoChains("onContextMenu"),this.isClickToHide()||this.isClickToShow()?(d.onClick=this.onClick,d.onMouseDown=this.onMouseDown,d.onTouchStart=this.onTouchStart):(d.onClick=this.createTwoChains("onClick"),d.onMouseDown=this.createTwoChains("onMouseDown"),d.onTouchStart=this.createTwoChains("onTouchStart")),this.isMouseEnterToShow()?(d.onMouseEnter=this.onMouseEnter,h&&(d.onMouseMove=this.onMouseMove)):d.onMouseEnter=this.createTwoChains("onMouseEnter"),this.isMouseLeaveToHide()?d.onMouseLeave=this.onMouseLeave:d.onMouseLeave=this.createTwoChains("onMouseLeave"),this.isFocusToShow()||this.isBlurToHide()?(d.onFocus=this.onFocus,d.onBlur=this.onBlur):(d.onFocus=this.createTwoChains("onFocus"),d.onBlur=this.createTwoChains("onBlur"));var y=ce()(f&&f.props&&f.props.className,m);y&&(d.className=y);var C=(0,w.Z)({},d);(0,Q.Yr)(f)&&(C.ref=(0,Q.sQ)(this.triggerRef,f.ref));var b=c.cloneElement(f,C),P;return(n||this.popupRef.current||l)&&(P=c.createElement(e,{key:"portal",getContainer:this.getContainer,didUpdate:this.handlePortalUpdate},this.getComponent())),!n&&p&&(P=null),c.createElement(pt.Provider,{value:this.triggerContextValue},b,P)}}],[{key:"getDerivedStateFromProps",value:function(n,s){var r=n.popupVisible,l={};return r!==void 0&&s.popupVisible!==r&&(l.popupVisible=r,l.prevPopupVisible=s.popupVisible),l}}]),a}(c.Component);return o.contextType=pt,o.defaultProps={prefixCls:"rc-trigger-popup",getPopupClassNameFromAlign:gn,getDocument:yn,onPopupVisibleChange:Re,afterPopupVisibleChange:Re,onPopupAlign:Re,popupClassName:"",mouseEnterDelay:0,mouseLeaveDelay:.1,focusDelay:0,blurDelay:.15,popupStyle:{},destroyPopupOnHide:!1,popupAlign:{},defaultPopupVisible:!1,mask:!1,maskClosable:!0,action:[],showAction:[],hideAction:[],autoDestroy:!1},o}var Pn=bn(yt.Z)},58979:function(j,D,v){"use strict";v.d(D,{Z:function(){return x}});var w=v(4676);function x(N,L,A,B){var V=w.unstable_batchedUpdates?function(W){w.unstable_batchedUpdates(A,W)}:A;return N.addEventListener&&N.addEventListener(L,V,B),{remove:function(){N.removeEventListener&&N.removeEventListener(L,V)}}}},83156:function(j,D,v){"use strict";v.d(D,{Z:function(){return w}});function w(x,N){return x?x.contains(N):!1}},42730:function(j,D){"use strict";D.Z=function(v){if(!v)return!1;if(v.offsetParent)return!0;if(v.getBBox){var w=v.getBBox();if(w.width||w.height)return!0}if(v.getBoundingClientRect){var x=v.getBoundingClientRect();if(x.width||x.height)return!0}return!1}},3556:function(j,D,v){"use strict";var w=v(59301),x=v(4676),N=v(19650),L=(0,w.forwardRef)(function(A,B){var V=A.didUpdate,c=A.getContainer,W=A.children,S=(0,w.useRef)();(0,w.useImperativeHandle)(B,function(){return{}});var R=(0,w.useRef)(!1);return!R.current&&(0,N.Z)()&&(S.current=c(),R.current=!0),(0,w.useEffect)(function(){V==null||V(A)}),(0,w.useEffect)(function(){return function(){var K,Q;(K=S.current)===null||K===void 0||(Q=K.parentNode)===null||Q===void 0||Q.removeChild(S.current)}},[]),S.current?x.createPortal(W,S.current):null});D.Z=L},32306:function(j,D){"use strict";D.Z=function(){if(typeof navigator=="undefined"||typeof window=="undefined")return!1;var v=navigator.userAgent||navigator.vendor||window.opera;return!!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(v)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(v==null?void 0:v.substr(0,4)))}}}]);