(self.webpackChunkcaitou_admin=self.webpackChunkcaitou_admin||[]).push([[733],{82592:function(){},23981:function(){},63945:function(ae,j,r){"use strict";r.d(j,{Z:function(){return Pe}});var v=r(31727),h=r(36752),l=r(39003),g=r(59301),Q=r(4944),z=r(87721),S=r(19868),D=r(53670),ce=r(96867),de=r(84636),J=r(89191),V=r(85696),O=r(90239),H=r(87670),pe=r(12208),K=r.n(pe),oe=r(37019),Ae=r(57127),we=r(63962),je=r(15409),ge=r(98853),Ke=r(81210),Ue=function(k){(0,ge.Z)(Z,k);var y=(0,Ke.Z)(Z);function Z(){var m;return(0,we.Z)(this,Z),m=y.apply(this,arguments),m.state={error:void 0,info:{componentStack:""}},m}return(0,je.Z)(Z,[{key:"componentDidCatch",value:function(I,Y){this.setState({error:I,info:Y})}},{key:"render",value:function(){var I=this.props,Y=I.message,re=I.description,ue=I.children,fe=this.state,ie=fe.error,le=fe.info,Ee=le&&le.componentStack?le.componentStack:null,Ce=typeof Y=="undefined"?(ie||"").toString():Y,xe=typeof re=="undefined"?Ee:re;return ie?g.createElement(Pe,{type:"error",message:Ce,description:g.createElement("pre",null,xe)}):ue}}]),Z}(g.Component),$e=r(36152),Be=function(k,y){var Z={};for(var m in k)Object.prototype.hasOwnProperty.call(k,m)&&y.indexOf(m)<0&&(Z[m]=k[m]);if(k!=null&&typeof Object.getOwnPropertySymbols=="function")for(var I=0,m=Object.getOwnPropertySymbols(k);I<m.length;I++)y.indexOf(m[I])<0&&Object.prototype.propertyIsEnumerable.call(k,m[I])&&(Z[m[I]]=k[m[I]]);return Z},ke={success:de.Z,info:V.Z,error:O.Z,warning:J.Z},ze={success:z.Z,info:D.Z,error:ce.Z,warning:S.Z},Te=function(y){var Z,m=y.description,I=y.prefixCls,Y=y.message,re=y.banner,ue=y.className,fe=ue===void 0?"":ue,ie=y.style,le=y.onMouseEnter,Ee=y.onMouseLeave,Ce=y.onClick,xe=y.afterClose,ve=y.showIcon,He=y.closable,be=y.closeText,Re=y.action,E=Be(y,["description","prefixCls","message","banner","className","style","onMouseEnter","onMouseLeave","onClick","afterClose","showIcon","closable","closeText","action"]),Oe=g.useState(!1),ye=(0,l.Z)(Oe,2),Le=ye[0],We=ye[1],De=g.useRef(),Ie=g.useContext(oe.E_),Fe=Ie.getPrefixCls,Ge=Ie.direction,T=Fe("alert",I),Ve=function(M){var _;We(!0),(_=E.onClose)===null||_===void 0||_.call(E,M)},Xe=function(){var M=E.type;return M!==void 0?M:re?"warning":"info"},me=be?!0:He,Se=Xe(),Ze=function(){var M=E.icon,_=(m?ze:ke)[Se]||null;return M?(0,$e.wm)(M,g.createElement("span",{className:"".concat(T,"-icon")},M),function(){return{className:K()("".concat(T,"-icon"),(0,h.Z)({},M.props.className,M.props.className))}}):g.createElement(_,{className:"".concat(T,"-icon")})},he=function(){return me?g.createElement("button",{type:"button",onClick:Ve,className:"".concat(T,"-close-icon"),tabIndex:0},be?g.createElement("span",{className:"".concat(T,"-close-text")},be):g.createElement(Q.Z,null)):null},Me=re&&ve===void 0?!0:ve,Qe=K()(T,"".concat(T,"-").concat(Se),(Z={},(0,h.Z)(Z,"".concat(T,"-with-description"),!!m),(0,h.Z)(Z,"".concat(T,"-no-icon"),!Me),(0,h.Z)(Z,"".concat(T,"-banner"),!!re),(0,h.Z)(Z,"".concat(T,"-rtl"),Ge==="rtl"),Z),fe),Je=(0,Ae.Z)(E);return g.createElement(H.Z,{visible:!Le,motionName:"".concat(T,"-motion"),motionAppear:!1,motionEnter:!1,onLeaveStart:function(M){return{maxHeight:M.offsetHeight}},onLeaveEnd:xe},function(q){var M=q.className,_=q.style;return g.createElement("div",(0,v.Z)({ref:De,"data-show":!Le,className:K()(Qe,M),style:(0,v.Z)((0,v.Z)({},ie),_),onMouseEnter:le,onMouseLeave:Ee,onClick:Ce,role:"alert"},Je),Me?Ze():null,g.createElement("div",{className:"".concat(T,"-content")},g.createElement("div",{className:"".concat(T,"-message")},Y),g.createElement("div",{className:"".concat(T,"-description")},m)),Re?g.createElement("div",{className:"".concat(T,"-action")},Re):null,he())})};Te.ErrorBoundary=Ue;var Pe=Te},7284:function(ae,j,r){"use strict";var v=r(92481),h=r.n(v),l=r(82592),g=r.n(l)},51274:function(ae,j,r){"use strict";r.d(j,{Z:function(){return st}});var v=r(31727),h=r(36752),l=r(59301),g=r(12208),Q=r.n(g),z=r(90591),S=r(37019),D=r(77524),ce=function(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(n);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(n,e[t])&&(o[e[t]]=n[e[t]]);return o},de=function(a,o){var e=a.prefixCls,t=a.component,i=t===void 0?"article":t,s=a.className,d=a["aria-label"],c=a.setContentRef,p=a.children,f=ce(a,["prefixCls","component","className","aria-label","setContentRef","children"]),u=o;return c&&((0,D.Z)(!1,"Typography","`setContentRef` is deprecated. Please use `ref` instead."),u=(0,z.sQ)(o,c)),l.createElement(S.C,null,function(x){var P=x.getPrefixCls,W=x.direction,U=i,R=P("typography",e),X=Q()(R,(0,h.Z)({},"".concat(R,"-rtl"),W==="rtl"),s);return l.createElement(U,(0,v.Z)({className:X,"aria-label":d,ref:u},f),p)})},J=l.forwardRef(de);J.displayName="Typography";var V=J,O=V,H=r(78363),pe=r(31163),K=r(76673),oe=r(63962),Ae=r(15409),we=r(98853),je=r(81210),ge=r(56506),Ke=r(95351),Ue=r.n(Ke),$e=r(67318),Be=r(41472),ke=r(97519),ze=r(3513),Te=r(71954),Pe=r(63089),k=r(14557),y=r(86371),Z=r(95568),m=r(51176),I=r(39003),Y=r(54844),re={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z"}}]},name:"enter",theme:"outlined"},ue=re,fe=r(26796),ie=function(a,o){return l.createElement(fe.Z,Object.assign({},a,{ref:o,icon:ue}))};ie.displayName="EnterOutlined";var le=l.forwardRef(ie),Ee=r(72408),Ce=function(a){var o=a.prefixCls,e=a["aria-label"],t=a.className,i=a.style,s=a.direction,d=a.maxLength,c=a.autoSize,p=c===void 0?!0:c,f=a.value,u=a.onSave,x=a.onCancel,P=a.onEnd,W=l.useRef(),U=l.useRef(!1),R=l.useRef(),X=l.useState(f),ee=(0,I.Z)(X,2),$=ee[0],se=ee[1];l.useEffect(function(){se(f)},[f]),l.useEffect(function(){if(W.current&&W.current.resizableTextArea){var N=W.current.resizableTextArea.textArea;N.focus();var L=N.value.length;N.setSelectionRange(L,L)}},[]);var C=function(L){var w=L.target;se(w.value.replace(/[\n\r]/g,""))},b=function(){U.current=!0},B=function(){U.current=!1},A=function(L){var w=L.keyCode;U.current||(R.current=w)},F=function(){u($.trim())},te=function(L){var w=L.keyCode,Ye=L.ctrlKey,qe=L.altKey,_e=L.metaKey,et=L.shiftKey;R.current===w&&!U.current&&!Ye&&!qe&&!_e&&!et&&(w===Y.Z.ENTER?(F(),P==null||P()):w===Y.Z.ESC&&x())},G=function(){F()},ne=Q()(o,"".concat(o,"-edit-content"),(0,h.Z)({},"".concat(o,"-rtl"),s==="rtl"),t);return l.createElement("div",{className:ne,style:i},l.createElement(Ee.Z,{ref:W,maxLength:d,value:$,onChange:C,onKeyDown:A,onKeyUp:te,onCompositionStart:b,onCompositionEnd:B,onBlur:G,"aria-label":e,autoSize:p}),l.createElement(le,{className:"".concat(o,"-edit-content-confirm")}))},xe=Ce,ve=r(5672),He=1,be=3,Re=8,E,Oe={padding:0,margin:0,display:"inline",lineHeight:"inherit"};function ye(n){if(!n)return 0;var a=n.match(/^\d*(\.\d*)?/);return a?Number(a[0]):0}function Le(n){var a=Array.prototype.slice.apply(n);return a.map(function(o){return"".concat(o,": ").concat(n.getPropertyValue(o),";")}).join("")}function We(n){var a=[];return n.forEach(function(o){var e=a[a.length-1];typeof o=="string"&&typeof e=="string"?a[a.length-1]+=o:a.push(o)}),a}function De(n,a){n.setAttribute("aria-hidden","true");var o=window.getComputedStyle(a),e=Le(o);n.setAttribute("style",e),n.style.position="fixed",n.style.left="0",n.style.height="auto",n.style.minHeight="auto",n.style.maxHeight="auto",n.style.top="-999999px",n.style.zIndex="-1000",n.style.textOverflow="clip",n.style.whiteSpace="normal",n.style.webkitLineClamp="none"}function Ie(n){var a=document.createElement("div");De(a,n),a.appendChild(document.createTextNode("text")),document.body.appendChild(a);var o=a.offsetHeight,e=ye(window.getComputedStyle(n).lineHeight);return document.body.removeChild(a),o>e?o:e}var Fe=function(n,a,o,e,t){E||(E=document.createElement("div"),E.setAttribute("aria-hidden","true")),E.parentNode||document.body.appendChild(E);var i=a.rows,s=a.suffix,d=s===void 0?"":s,c=window.getComputedStyle(n),p=Ie(n),f=Math.floor(p)*(i+1)+ye(c.paddingTop)+ye(c.paddingBottom);De(E,n);var u=We((0,ge.Z)(o));(0,ve.render)(l.createElement("div",{style:Oe},l.createElement("span",{style:Oe},u,d),l.createElement("span",{style:Oe},e)),E);function x(){return Math.ceil(E.getBoundingClientRect().height)<f}if(x())return(0,ve.unmountComponentAtNode)(E),{content:o,text:E.innerHTML,ellipsis:!1};var P=Array.prototype.slice.apply(E.childNodes[0].childNodes[0].cloneNode(!0).childNodes).filter(function(C){var b=C.nodeType;return b!==Re}),W=Array.prototype.slice.apply(E.childNodes[0].childNodes[1].cloneNode(!0).childNodes);(0,ve.unmountComponentAtNode)(E);var U=[];E.innerHTML="";var R=document.createElement("span");E.appendChild(R);var X=document.createTextNode(t+d);R.appendChild(X),W.forEach(function(C){E.appendChild(C)});function ee(C){R.insertBefore(C,X)}function $(C,b){var B=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,A=arguments.length>3&&arguments[3]!==void 0?arguments[3]:b.length,F=arguments.length>4&&arguments[4]!==void 0?arguments[4]:0,te=Math.floor((B+A)/2),G=b.slice(0,te);if(C.textContent=G,B>=A-1)for(var ne=A;ne>=B;ne-=1){var N=b.slice(0,ne);if(C.textContent=N,x()||!N)return ne===b.length?{finished:!1,reactNode:b}:{finished:!0,reactNode:N}}return x()?$(C,b,te,A,te):$(C,b,B,te,F)}function se(C,b){var B=C.nodeType;if(B===He)return ee(C),x()?{finished:!1,reactNode:u[b]}:(R.removeChild(C),{finished:!0,reactNode:null});if(B===be){var A=C.textContent||"",F=document.createTextNode(A);return ee(F),$(F,A)}return{finished:!1,reactNode:null}}return P.some(function(C,b){var B=se(C,b),A=B.finished,F=B.reactNode;return F&&U.push(F),A}),{content:U,text:E.innerHTML,ellipsis:!0}},Ge=function(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(n);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(n,e[t])&&(o[e[t]]=n[e[t]]);return o},T=(0,Z.GL)("webkitLineClamp"),Ve=(0,Z.GL)("textOverflow");function Xe(n,a){var o=n.mark,e=n.code,t=n.underline,i=n.delete,s=n.strong,d=n.keyboard,c=n.italic,p=a;function f(u,x){!u||(p=l.createElement(x,{},p))}return f(s,"strong"),f(t,"u"),f(i,"del"),f(e,"code"),f(o,"mark"),f(d,"kbd"),f(c,"i"),p}function me(n,a,o){return n===!0||n===void 0?a:n||o&&a}var Se="...",Ze=function(n){(0,we.Z)(o,n);var a=(0,je.Z)(o);function o(){var e;return(0,oe.Z)(this,o),e=a.apply(this,arguments),e.contentRef=l.createRef(),e.state={edit:!1,copied:!1,ellipsisText:"",ellipsisContent:null,isEllipsis:!1,expanded:!1,clientRendered:!1},e.getPrefixCls=function(){var t=e.props.prefixCls,i=e.context.getPrefixCls;return i("typography",t)},e.onExpandClick=function(t){var i,s=e.getEllipsis(),d=s.onExpand;e.setState({expanded:!0}),(i=d)===null||i===void 0||i(t)},e.onEditClick=function(t){t.preventDefault(),e.triggerEdit(!0)},e.onEditChange=function(t){var i=e.getEditable(),s=i.onChange;s==null||s(t),e.triggerEdit(!1)},e.onEditCancel=function(){var t,i;(i=(t=e.getEditable()).onCancel)===null||i===void 0||i.call(t),e.triggerEdit(!1)},e.onCopyClick=function(t){t.preventDefault();var i=e.props,s=i.children,d=i.copyable,c=(0,v.Z)({},(0,H.Z)(d)==="object"?d:null);c.text===void 0&&(c.text=String(s)),Ue()(c.text||""),e.setState({copied:!0},function(){c.onCopy&&c.onCopy(),e.copyId=window.setTimeout(function(){e.setState({copied:!1})},3e3)})},e.setEditRef=function(t){e.editIcon=t},e.triggerEdit=function(t){var i=e.getEditable(),s=i.onStart;t&&s&&s(),e.setState({edit:t},function(){!t&&e.editIcon&&e.editIcon.focus()})},e.resizeOnNextFrame=function(){y.Z.cancel(e.rafId),e.rafId=(0,y.Z)(function(){e.syncEllipsis()})},e}return(0,Ae.Z)(o,[{key:"componentDidMount",value:function(){this.setState({clientRendered:!0}),this.resizeOnNextFrame()}},{key:"componentDidUpdate",value:function(t){var i=this.props.children,s=this.getEllipsis(),d=this.getEllipsis(t);(i!==t.children||s.rows!==d.rows)&&this.resizeOnNextFrame()}},{key:"componentWillUnmount",value:function(){window.clearTimeout(this.copyId),y.Z.cancel(this.rafId)}},{key:"getEditable",value:function(t){var i=this.state.edit,s=t||this.props,d=s.editable;return d?(0,v.Z)({editing:i},(0,H.Z)(d)==="object"?d:null):{editing:i}}},{key:"getEllipsis",value:function(t){var i=t||this.props,s=i.ellipsis;return s?(0,v.Z)({rows:1,expandable:!1},(0,H.Z)(s)==="object"?s:null):{}}},{key:"canUseCSSEllipsis",value:function(){var t=this.state.clientRendered,i=this.props,s=i.editable,d=i.copyable,c=this.getEllipsis(),p=c.rows,f=c.expandable,u=c.suffix,x=c.onEllipsis,P=c.tooltip;return u||P||s||d||f||!t||x?!1:p===1?Ve:T}},{key:"syncEllipsis",value:function(){var t=this.state,i=t.ellipsisText,s=t.isEllipsis,d=t.expanded,c=this.getEllipsis(),p=c.rows,f=c.suffix,u=c.onEllipsis,x=this.props.children;if(!(!p||p<0||!this.contentRef.current||d)&&!this.canUseCSSEllipsis()){(0,D.Z)((0,ge.Z)(x).every(function(X){return typeof X=="string"}),"Typography","`ellipsis` should use string as children only.");var P=Fe(this.contentRef.current,{rows:p,suffix:f},x,this.renderOperations(!0),Se),W=P.content,U=P.text,R=P.ellipsis;(i!==U||s!==R)&&(this.setState({ellipsisText:U,ellipsisContent:W,isEllipsis:R}),s!==R&&u&&u(R))}}},{key:"renderExpand",value:function(t){var i=this.getEllipsis(),s=i.expandable,d=i.symbol,c=this.state,p=c.expanded,f=c.isEllipsis;if(!s||!t&&(p||!f))return null;var u;return d?u=d:u=this.expandStr,l.createElement("a",{key:"expand",className:"".concat(this.getPrefixCls(),"-expand"),onClick:this.onExpandClick,"aria-label":this.expandStr},u)}},{key:"renderEdit",value:function(){var t=this.props.editable;if(!!t){var i=t.icon,s=t.tooltip,d=(0,ge.Z)(s)[0]||this.editStr,c=typeof d=="string"?d:"";return l.createElement(m.Z,{key:"edit",title:s===!1?"":d},l.createElement(k.Z,{ref:this.setEditRef,className:"".concat(this.getPrefixCls(),"-edit"),onClick:this.onEditClick,"aria-label":c},i||l.createElement($e.Z,{role:"button"})))}}},{key:"renderCopy",value:function(){var t=this.state.copied,i=this.props.copyable;if(!!i){var s=this.getPrefixCls(),d=i.tooltips,c=i.icon,p=Array.isArray(d)?d:[d],f=Array.isArray(c)?c:[c],u=t?me(p[1],this.copiedStr):me(p[0],this.copyStr),x=t?this.copiedStr:this.copyStr,P=typeof u=="string"?u:x;return l.createElement(m.Z,{key:"copy",title:u},l.createElement(k.Z,{className:Q()("".concat(s,"-copy"),t&&"".concat(s,"-copy-success")),onClick:this.onCopyClick,"aria-label":P},t?me(f[1],l.createElement(Be.Z,null),!0):me(f[0],l.createElement(ke.Z,null),!0)))}}},{key:"renderEditInput",value:function(){var t=this.props,i=t.children,s=t.className,d=t.style,c=this.context.direction,p=this.getEditable(),f=p.maxLength,u=p.autoSize,x=p.onEnd;return l.createElement(xe,{value:typeof i=="string"?i:"",onSave:this.onEditChange,onCancel:this.onEditCancel,onEnd:x,prefixCls:this.getPrefixCls(),className:s,style:d,direction:c,maxLength:f,autoSize:u})}},{key:"renderOperations",value:function(t){return[this.renderExpand(t),this.renderEdit(),this.renderCopy()].filter(function(i){return i})}},{key:"renderContent",value:function(){var t=this,i=this.state,s=i.ellipsisContent,d=i.isEllipsis,c=i.expanded,p=this.props,f=p.component,u=p.children,x=p.className,P=p.type,W=p.disabled,U=p.style,R=Ge(p,["component","children","className","type","disabled","style"]),X=this.context.direction,ee=this.getEllipsis(),$=ee.rows,se=ee.suffix,C=ee.tooltip,b=this.getPrefixCls(),B=(0,pe.Z)(R,["prefixCls","editable","copyable","ellipsis","mark","code","delete","underline","strong","keyboard","italic"].concat((0,K.Z)(Te.nf))),A=this.canUseCSSEllipsis(),F=$===1&&A,te=$&&$>1&&A,G=u;if($&&d&&!c&&!A){var ne=R.title,N=ne||"";!ne&&(typeof u=="string"||typeof u=="number")&&(N=String(u)),N=N.slice(String(s||"").length),G=l.createElement(l.Fragment,null,s,l.createElement("span",{title:N,"aria-hidden":"true"},Se),se),C&&(G=l.createElement(m.Z,{title:C===!0?u:C},l.createElement("span",null,G)))}else G=l.createElement(l.Fragment,null,u,se);return G=Xe(this.props,G),l.createElement(Pe.Z,{componentName:"Text"},function(L){var w,Ye=L.edit,qe=L.copy,_e=L.copied,et=L.expand;return t.editStr=Ye,t.copyStr=qe,t.copiedStr=_e,t.expandStr=et,l.createElement(ze.Z,{onResize:t.resizeOnNextFrame,disabled:A},l.createElement(O,(0,v.Z)({className:Q()((w={},(0,h.Z)(w,"".concat(b,"-").concat(P),P),(0,h.Z)(w,"".concat(b,"-disabled"),W),(0,h.Z)(w,"".concat(b,"-ellipsis"),$),(0,h.Z)(w,"".concat(b,"-single-line"),$===1),(0,h.Z)(w,"".concat(b,"-ellipsis-single-line"),F),(0,h.Z)(w,"".concat(b,"-ellipsis-multiple-line"),te),w),x),style:(0,v.Z)((0,v.Z)({},U),{WebkitLineClamp:te?$:void 0}),component:f,ref:t.contentRef,direction:X},B),G,t.renderOperations()))})}},{key:"render",value:function(){var t=this.getEditable(),i=t.editing;return i?this.renderEditInput():this.renderContent()}}],[{key:"getDerivedStateFromProps",value:function(t){var i=t.children,s=t.editable;return(0,D.Z)(!s||typeof i=="string","Typography","When `editable` is enabled, the `children` should use string."),{}}}]),o}(l.Component);Ze.contextType=S.E_,Ze.defaultProps={children:""};var he=Ze,Me=function(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(n);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(n,e[t])&&(o[e[t]]=n[e[t]]);return o},Qe=function(a){var o=a.ellipsis,e=Me(a,["ellipsis"]),t=l.useMemo(function(){return o&&(0,H.Z)(o)==="object"?(0,pe.Z)(o,["expandable","rows"]):o},[o]);return(0,D.Z)((0,H.Z)(o)!=="object"||!o||!("expandable"in o)&&!("rows"in o),"Typography.Text","`ellipsis` do not support `expandable` or `rows` props."),l.createElement(he,(0,v.Z)({},e,{ellipsis:t,component:"span"}))},Je=Qe,q=function(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(n);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(n,e[t])&&(o[e[t]]=n[e[t]]);return o},M=function(a,o){var e=a.ellipsis,t=a.rel,i=q(a,["ellipsis","rel"]);(0,D.Z)((0,H.Z)(e)!=="object","Typography.Link","`ellipsis` only supports boolean value.");var s=l.useRef(null);l.useImperativeHandle(o,function(){var c;return(c=s.current)===null||c===void 0?void 0:c.contentRef.current});var d=(0,v.Z)((0,v.Z)({},i),{rel:t===void 0&&i.target==="_blank"?"noopener noreferrer":t});return delete d.navigate,l.createElement(he,(0,v.Z)({},d,{ref:s,ellipsis:!!e,component:"a"}))},_=l.forwardRef(M),tt=r(55422),nt=function(n,a){var o={};for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&a.indexOf(e)<0&&(o[e]=n[e]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(n);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(n,e[t])&&(o[e[t]]=n[e[t]]);return o},rt=(0,tt.a)(1,2,3,4,5),at=function(a){var o=a.level,e=o===void 0?1:o,t=nt(a,["level"]),i;return rt.indexOf(e)!==-1?i="h".concat(e):((0,D.Z)(!1,"Typography.Title","Title only accept `1 | 2 | 3 | 4 | 5` as `level` value. And `5` need 4.6.0+ version."),i="h1"),l.createElement(he,(0,v.Z)({},t,{component:i}))},ot=at,it=function(a){return l.createElement(he,(0,v.Z)({},a,{component:"div"}))},lt=it,Ne=O;Ne.Text=Je,Ne.Link=_,Ne.Title=ot,Ne.Paragraph=lt;var st=Ne},34400:function(ae,j,r){"use strict";var v=r(92481),h=r.n(v),l=r(23981),g=r.n(l),Q=r(88908),z=r(35801)},95351:function(ae,j,r){"use strict";var v=r(64077),h={"text/plain":"Text","text/html":"Url",default:"Text"},l="Copy to clipboard: #{key}, Enter";function g(z){var S=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return z.replace(/#{\s*key\s*}/g,S)}function Q(z,S){var D,ce,de,J,V,O,H=!1;S||(S={}),D=S.debug||!1;try{de=v(),J=document.createRange(),V=document.getSelection(),O=document.createElement("span"),O.textContent=z,O.style.all="unset",O.style.position="fixed",O.style.top=0,O.style.clip="rect(0, 0, 0, 0)",O.style.whiteSpace="pre",O.style.webkitUserSelect="text",O.style.MozUserSelect="text",O.style.msUserSelect="text",O.style.userSelect="text",O.addEventListener("copy",function(K){if(K.stopPropagation(),S.format)if(K.preventDefault(),typeof K.clipboardData=="undefined"){D&&console.warn("unable to use e.clipboardData"),D&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var oe=h[S.format]||h.default;window.clipboardData.setData(oe,z)}else K.clipboardData.clearData(),K.clipboardData.setData(S.format,z);S.onCopy&&(K.preventDefault(),S.onCopy(K.clipboardData))}),document.body.appendChild(O),J.selectNodeContents(O),V.addRange(J);var pe=document.execCommand("copy");if(!pe)throw new Error("copy command was unsuccessful");H=!0}catch(K){D&&console.error("unable to copy using execCommand: ",K),D&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(S.format||"text",z),S.onCopy&&S.onCopy(window.clipboardData),H=!0}catch(oe){D&&console.error("unable to copy using clipboardData: ",oe),D&&console.error("falling back to prompt"),ce=g("message"in S?S.message:l),window.prompt(ce,z)}}finally{V&&(typeof V.removeRange=="function"?V.removeRange(J):V.removeAllRanges()),O&&document.body.removeChild(O),de()}return H}ae.exports=Q},64077:function(ae){ae.exports=function(){var j=document.getSelection();if(!j.rangeCount)return function(){};for(var r=document.activeElement,v=[],h=0;h<j.rangeCount;h++)v.push(j.getRangeAt(h));switch(r.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":r.blur();break;default:r=null;break}return j.removeAllRanges(),function(){j.type==="Caret"&&j.removeAllRanges(),j.rangeCount||v.forEach(function(l){j.addRange(l)}),r&&r.focus()}}}}]);