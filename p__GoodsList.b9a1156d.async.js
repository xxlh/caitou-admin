var vt=(x,W,t)=>new Promise((I,e)=>{var m=c=>{try{y(t.next(c))}catch($){e($)}},i=c=>{try{y(t.throw(c))}catch($){e($)}},y=c=>c.done?I(c.value):Promise.resolve(c.value).then(m,i);y((t=t.apply(x,W)).next())});(self.webpackChunkcaitou_admin=self.webpackChunkcaitou_admin||[]).push([[2559],{5918:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){t.d(W,{y:function(){return m}});const{default:e}=yield t.e(9910).then(t.t.bind(t,9910,23));var m=e.createContext({});I()})},1)},1091:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){t.d(W,{t:function(){return R}});var e=t(5918),m=I([e]);e=(m.then?yield m:m)[0];const{default:i}=yield t.e(3129).then(t.t.bind(t,3129,23)),{useState:y,useEffect:c,useContext:$,useRef:P}=yield t.e(9910).then(t.t.bind(t,9910,23)),{default:C}=yield t.e(6086).then(t.t.bind(t,6086,23));function R(u,D){var l=$(e.y),S=P(D);S.current=D;var j=y(function(){return S.current?S.current(l.data[u]):l.data[u]}),K=i(j,2),N=K[0],U=K[1],p=P(N);p.current=N;var z=P(!1);return c(function(){return z.current=!0,function(){z.current=!1}},[]),c(function(){var v=function(a){if(!z.current)setTimeout(function(){l.data[u]=a,l.update(u)});else if(D&&S.current){var T=S.current(a),o=p.current;C(T,o)||U(T)}else U(a)};try{l.callbacks[u].add(v),l.update(u)}catch(n){l.callbacks[u]=new Set,l.callbacks[u].add(v),l.update(u)}return function(){l.callbacks[u].delete(v)}},[u]),N}I()})},1)},7319:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){var e=t(3948),m=I([e]);e=(m.then?yield m:m)[0];const{default:i}=yield t.e(5845).then(t.t.bind(t,5845,23)),{}=yield t.e(4754).then(t.t.bind(t,4754,23)),{default:y}=yield t.e(7995).then(t.t.bind(t,7995,23)),{default:c}=yield t.e(4853).then(t.t.bind(t,4853,23)),{default:$}=yield t.e(9450).then(t.t.bind(t,9450,23)),{default:P}=yield t.e(9939).then(t.t.bind(t,9939,23)),{default:C}=yield t.e(5684).then(t.t.bind(t,5684,23)),{default:R}=yield t.e(6431).then(t.t.bind(t,6431,23)),{ProFormUploadButton:u}=yield t.e(9909).then(t.t.bind(t,9909,23)),{PlusOutlined:D}=yield t.e(1151).then(t.t.bind(t,1151,23)),{default:l}=yield t.e(9910).then(t.t.bind(t,9910,23)),{jsx:S}=yield t.e(4455).then(t.t.bind(t,4455,23)),{jsxs:j}=yield t.e(4455).then(t.t.bind(t,4455,23)),{Fragment:K}=yield t.e(4455).then(t.t.bind(t,4455,23));function N(p){return new Promise(function(z,v){var n=new FileReader;n.readAsDataURL(p),n.onload=function(){return z(n.result)},n.onerror=function(a){return v(a)}})}var U=function(p){C(v,p);var z=R(v);function v(){var n;$(this,v);for(var a=arguments.length,T=new Array(a),o=0;o<a;o++)T[o]=arguments[o];return n=z.call.apply(z,[this].concat(T)),n.state={previewVisible:!1,previewImage:"",previewTitle:"",url:"",fileList:n.props.fileList||[]},n.handleCancel=function(){return n.setState({previewVisible:!1})},n.handlePreview=function(){var h=c(i.mark(function O(s){return i.wrap(function(B){for(;;)switch(B.prev=B.next){case 0:if(!(!s.url&&!s.preview)){B.next=4;break}return B.next=3,N(s.originFileObj);case 3:s.preview=B.sent;case 4:n.setState({previewImage:s.url||s.preview,previewVisible:!0,previewTitle:s.name||s.url.substring(s.url.lastIndexOf("/")+1)});case 5:case"end":return B.stop()}},O)}));return function(O){return h.apply(this,arguments)}}(),n.handleChange=function(){var h=c(i.mark(function O(s){var Q,B;return i.wrap(function(_){for(;;)switch(_.prev=_.next){case 0:Q=s.file,B=s.fileList,n.setState({fileList:B});case 2:case"end":return _.stop()}},O)}));return function(O){return h.apply(this,arguments)}}(),n}return P(v,[{key:"componentWillReceiveProps",value:function(){this.setState({fileList:this.props.fileList})}},{key:"render",value:function(){var a=this.state,T=a.previewVisible,o=a.previewImage,h=a.fileList,O=a.previewTitle,s=j("div",{children:[S(D,{}),S("div",{style:{marginTop:8},children:"Upload"})]});return j(K,{children:[S(u,{name:"images",label:"\u5546\u54C1\u56FE\u7247",fieldProps:{name:"file",listType:"picture-card",method:"PUT",headers:{"Content-Type":"application/octet-stream"},onPreview:this.handlePreview,customRequest:function(B){var G=B.action,_=B.file,lt=B.headers,at=B.onError,Z=B.onProgress,X=B.onSuccess,k=B.withCredentials;(0,e.Z)({file:_,success:X})}},fileList:h,max:8,onChange:this.handleChange,children:h.length>=8?null:s}),S(y,{visible:T,title:O,footer:null,onCancel:this.handleCancel,children:S("img",{alt:"example",style:{width:"100%"},src:o})})]})}}]),v}(l.Component);W.Z=U,I()})},1)},8216:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){var e=t(5671),m=I([e]);e=(m.then?yield m:m)[0];const{default:i}=yield t.e(5845).then(t.t.bind(t,5845,23)),{default:y}=yield t.e(1317).then(t.t.bind(t,1317,23)),{}=yield t.e(4555).then(t.t.bind(t,4555,23)),{default:c}=yield t.e(7762).then(t.t.bind(t,7762,23)),{default:$}=yield t.e(4853).then(t.t.bind(t,4853,23)),{}=yield t.e(6771).then(t.t.bind(t,6771,23)),{default:P}=yield t.e(7880).then(t.t.bind(t,7880,23)),{default:C}=yield t.e(3129).then(t.t.bind(t,3129,23)),{default:R,useRef:u,useState:D}=yield t.e(9910).then(t.t.bind(t,9910,23)),{default:l,DrawerForm:S}=yield t.e(9909).then(t.t.bind(t,9909,23)),{EditOutlined:j,PlusOutlined:K}=yield t.e(1151).then(t.t.bind(t,1151,23)),{EditableProTable:N}=yield t.e(3663).then(t.t.bind(t,3663,23)),{default:U}=yield t.e(1406).then(t.t.bind(t,1406,23)),{jsx:p}=yield t.e(4455).then(t.t.bind(t,4455,23)),{jsxs:z}=yield t.e(4455).then(t.t.bind(t,4455,23));W.Z=function(v){var n,a=u(),T=D([]),o=C(T,2),h=o[0],O=o[1],s=D(function(){return h.map(function(k){return k.rowKey})}),Q=C(s,2),B=Q[0],G=Q[1],_=D(!1),lt=C(_,2),at=lt[0],Z=lt[1],X=[{title:"\u89C4\u683C\u7C7B\u522B",dataIndex:"key"},{title:"\u89C4\u683C\u540D\u79F0",dataIndex:"name"},{title:"\u7F29\u7565\u56FE",dataIndex:"image",valueType:"avatar"},{title:"\u64CD\u4F5C",valueType:"option"}];return p(S,y(y({title:"\u6DFB\u52A0\u5546\u54C1\u89C4\u683C",formRef:a,trigger:h.length||v!=null&&(n=v.skuData)!==null&&n!==void 0&&n.length?z(P,{children:[p(j,{})," \u7F16\u8F91\u5546\u54C1\u89C4\u683C"]}):z(P,{children:[p(K,{})," \u6DFB\u52A0\u5546\u54C1\u89C4\u683C"]}),drawerProps:{forceRender:!0,destroyOnClose:!0},visible:at,onVisibleChange:function(){var k=$(i.mark(function ut(st){var J,nt,ot;return i.wrap(function(H){for(;;)switch(H.prev=H.next){case 0:if(!st){H.next=16;break}return H.prev=1,H.next=4,(J=v.goodsRef)===null||J===void 0||(nt=J.current)===null||nt===void 0?void 0:nt.validateFields();case 4:if(v.goodsId){H.next=7;break}return H.next=7,v.addEmptyGoods();case 7:h!=null&&h.length||(ot=(v==null?void 0:v.specData)||[],ot=ot.map(function(dt){return dt.rowKey=dt.id||Math.random(),dt}),O(ot),G(ot.map(function(dt){return dt.rowKey}))),at||Z(!0),H.next=14;break;case 11:H.prev=11,H.t0=H.catch(1),at&&Z(!1);case 14:H.next=18;break;case 16:O([]),at&&Z(!1);case 18:case"end":return H.stop()}},ut,null,[[1,11]])}));return function(ut){return k.apply(this,arguments)}}(),onFinish:function(){var k=$(i.mark(function ut(st){var J,nt;return i.wrap(function(tt){for(;;)switch(tt.prev=tt.next){case 0:return J=U.groupBy(U.reject(st.spec,function(H){return!H.key||!H.name}),"key"),tt.next=3,(0,e.fQ)(v.goodsId,J);case 3:return nt=tt.sent,O(nt.specs),v.setSkuData(nt.skus),c.success("\u6DFB\u52A0\u6210\u529F\uFF01\u7EE7\u7EED\u8BBE\u7F6E\u4EF7\u683C\u5E93\u5B58\uFF5E"),tt.abrupt("return",!0);case 8:case"end":return tt.stop()}},ut)}));return function(ut){return k.apply(this,arguments)}}()},v.fieldProps),{},{children:p(l.Item,{name:"spec",initialValue:h,trigger:"onValuesChange",children:p(N,{rowKey:"rowKey",toolBarRender:!1,columns:X,recordCreatorProps:{newRecordType:"dataSource",position:"bottom",record:function(){return{rowKey:Date.now()}}},editable:{type:"multiple",editableKeys:B,onChange:G,actionRender:function(ut,st,J){return[J.delete]}}})})}))},I()})},1)},9512:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){var e=t(5671),m=t(8216),i=t(7319),y=t(3948),c=t(5751),$=I([i,e,m,y,c]);[i,e,m,y,c]=$.then?yield $:$;const{default:P}=yield t.e(5845).then(t.t.bind(t,5845,23)),{}=yield t.e(6771).then(t.t.bind(t,6771,23)),{default:C}=yield t.e(7880).then(t.t.bind(t,7880,23)),{default:R}=yield t.e(1317).then(t.t.bind(t,1317,23)),{}=yield t.e(4555).then(t.t.bind(t,4555,23)),{default:u}=yield t.e(7762).then(t.t.bind(t,7762,23)),{default:D}=yield t.e(4853).then(t.t.bind(t,4853,23)),{default:l}=yield t.e(3129).then(t.t.bind(t,3129,23)),{default:S,forwardRef:j,useImperativeHandle:K,useRef:N,useState:U}=yield t.e(9910).then(t.t.bind(t,9910,23)),{default:p,DrawerForm:z,ProFormText:v,ProFormSelect:n,ProFormDigit:a}=yield t.e(9909).then(t.t.bind(t,9909,23)),{PlusOutlined:T}=yield t.e(1151).then(t.t.bind(t,1151,23)),{default:o}=yield t.e(9813).then(t.t.bind(t,9813,23)),{}=yield t.e(5419).then(t.t.bind(t,5419,23)),{EditableProTable:h}=yield t.e(3663).then(t.t.bind(t,3663,23)),{default:O}=yield t.e(1406).then(t.t.bind(t,1406,23)),{jsx:s}=yield t.e(4455).then(t.t.bind(t,4455,23)),{jsxs:Q}=yield t.e(4455).then(t.t.bind(t,4455,23)),{Fragment:B}=yield t.e(4455).then(t.t.bind(t,4455,23));W.Z=j(function(G,_){var lt,at,Z=N(),X=U(!1),k=l(X,2),ut=k[0],st=k[1],J=(0,c.tT)("@@initialState"),nt=J.initialState,ot=nt||{},tt=ot.currentUser,H=U(o.createEditorState(null)),dt=l(H,2),gt=dt[0],yt=dt[1],St=U(0),Rt=l(St,2),et=Rt[0],Y=Rt[1],A=U({}),M=l(A,2),ct=M[0],it=M[1],zt=U([]),jt=l(zt,2),Et=jt[0],It=jt[1],Xt=U([]),Ut=l(Xt,2),Jt=Ut[0],wt=Ut[1],bt=U([]),Kt=l(bt,2),kt=Kt[0],At=Kt[1],Lt=(0,c.tT)("categories"),qt=Lt.categoriesByid,_t=Lt.getCategories,tn=U([]),Wt=l(tn,2),nn=Wt[0],Vt=Wt[1],en=U([]),xt=l(en,2),an=xt[0],Zt=xt[1],sn=U([]),Ht=l(sn,2),Yt=Ht[0],Pt=Ht[1],on=U([]),Qt=l(on,2),rn=Qt[0],Nt=Qt[1],ln=function(){var w=D(P.mark(function F(E){var d,f,g,L,rt,mt,r,ft,ht,$t,pt,q,Tt,Ot,Dt,Bt,Mt,Gt;return P.wrap(function(V){for(;;)switch(V.prev=V.next){case 0:if(!E){V.next=36;break}if(d=u.loading("\u6B63\u5728\u6DFB\u52A0"),V.prev=2,r=et||G.goodsId,!r){V.next=18;break}return et||Y(G.goodsId||0),V.next=8,(0,e.QO)(r);case 8:return q=V.sent,q.product.description=o.createEditorState(q==null||(ft=q.product)===null||ft===void 0?void 0:ft.description),Z==null||(ht=Z.current)===null||ht===void 0||ht.setFieldsValue(q==null?void 0:q.product),it(q.product),It(q==null||($t=q.skus)===null||$t===void 0?void 0:$t.map(function(b){return typeof b.own_spec=="object"&&(b.own_spec=O.map(b.own_spec,function(Ct,Ft){return"".concat(Ft,": ").concat(Ct)}).join(`
`)),b})),At(q==null?void 0:q.specs),V.next=16,(0,e.Dt)(r);case 16:mt=V.sent,Nt((pt=mt)===null||pt===void 0?void 0:pt.map(function(b){return b.id}));case 18:return V.next=20,_t();case 20:Tt=V.sent,Zt(Tt.map(function(b){return{label:b.name,value:b.id}})),Ot=[],Tt.map(function(b){var Ct;b==null||(Ct=b.children)===null||Ct===void 0||Ct.map(function(Ft){return Ot.push({label:Ft.name,value:Ft.id})})}),Pt(Ot),Dt=((f=mt)===null||f===void 0||(g=f[0])===null||g===void 0?void 0:g.parent_id)||((L=mt)===null||L===void 0||(rt=L[0])===null||rt===void 0?void 0:rt.id),r&&Dt&&(Vt(Dt),Pt((Bt=O.keyBy(Tt,"id")[Dt])===null||Bt===void 0||(Mt=Bt.children)===null||Mt===void 0?void 0:Mt.map(function(b){return{label:b.name,value:b.id}}))),V.next=32;break;case 29:V.prev=29,V.t0=V.catch(2),u.error(V.t0===null||V.t0===void 0||(Gt=V.t0.data)===null||Gt===void 0?void 0:Gt.msg);case 32:st(!0),d(),V.next=45;break;case 36:st(!1),Y(0),it({}),It([]),At([]),Zt([]),Pt([]),Nt([]),yt(o.createEditorState(null));case 45:case"end":return V.stop()}},F,null,[[2,29]])}));return function(E){return w.apply(this,arguments)}}(),un=function(){var w=D(P.mark(function F(E){var d,f,g,L,rt;return P.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if(d=u.loading("\u6B63\u5728\u6DFB\u52A0"),r.prev=1,typeof(E==null?void 0:E.images)=="object"&&(E.images=E==null||(f=E.images)===null||f===void 0?void 0:f.map(function(ft){var ht;return(ft==null?void 0:ft.url)||"http://"+(ft==null||(ht=ft.response)===null||ht===void 0?void 0:ht.Location)})),E.description=(g=E.description)===null||g===void 0?void 0:g.toHTML(),!et){r.next=9;break}return r.next=7,(0,e.e3)(et,R({},E));case 7:r.next=11;break;case 9:return r.next=11,(0,e.Rq)(R({},E));case 11:return d(),u.success("\u6DFB\u52A0\u6210\u529F"),r.abrupt("return",!0);case 16:return r.prev=16,r.t0=r.catch(1),d(),u.error(r.t0!==null&&r.t0!==void 0&&(L=r.t0.data)!==null&&L!==void 0&&L.msg?r.t0===null||r.t0===void 0||(rt=r.t0.data)===null||rt===void 0?void 0:rt.msg:"\u6DFB\u52A0\u5931\u8D25\u8BF7\u91CD\u8BD5\uFF01"),r.abrupt("return",!1);case 21:case"end":return r.stop()}},F,null,[[1,16]])}));return function(E){return w.apply(this,arguments)}}(),dn=function(){var w=D(P.mark(function F(){var E,d;return P.wrap(function(g){for(;;)switch(g.prev=g.next){case 0:if(et){g.next=2;break}return g.abrupt("return",!1);case 2:return g.prev=2,E=gt.toHTML(),g.next=6,(0,e.e3)(et,{description:E});case 6:g.next=11;break;case 8:g.prev=8,g.t0=g.catch(2),u.error(g.t0===null||g.t0===void 0||(d=g.t0.data)===null||d===void 0?void 0:d.msg);case 11:case"end":return g.stop()}},F,null,[[2,8]])}));return function(){return w.apply(this,arguments)}}(),cn=function(F){(0,y.Z)(R(R({path:"".concat(tt==null?void 0:tt.id),hashFilename:!0},F),{},{success:function(d){var f,g;F.success({url:"//".concat(d==null?void 0:d.Location),meta:{id:F.libraryId,title:(f=F.file)===null||f===void 0?void 0:f.name,alt:(g=F.file)===null||g===void 0?void 0:g.name}})}}))},fn=function(){var w=D(P.mark(function F(){var E,d,f;return P.wrap(function(L){for(;;)switch(L.prev=L.next){case 0:return d=Z==null||(E=Z.current)===null||E===void 0?void 0:E.getFieldsValue(),L.next=3,(0,e.Rq)({draft:!0,title:(d==null?void 0:d.title)||" ",price:(d==null?void 0:d.price)||0,stock:(d==null?void 0:d.stock)||0});case 3:if(f=L.sent,!(f!=null&&f.code&&(f==null?void 0:f.code)!=200)){L.next=6;break}throw new Error("Failed to add goods!");case 6:Y(f==null?void 0:f.id);case 7:case"end":return L.stop()}},F)}));return function(){return w.apply(this,arguments)}}();K(_,function(){return{open:function(F){Y(F),st(!0)}}},[]);var vn=[{title:"\u89C4\u683C\u7EC4\u5408",dataIndex:"own_spec",editable:!1},{title:"\u522B\u79F0",dataIndex:"name"},{title:"\u4EF7\u683C",dataIndex:"price",valueType:"money"},{title:"\u5E93\u5B58",dataIndex:"stock",valueType:"digit"},{title:"\u64CD\u4F5C",valueType:"option",render:function(F,E,d,f){return[s("a",{onClick:function(){var L;f==null||(L=f.startEditable)===null||L===void 0||L.call(f,E.id)},children:"\u7F16\u8F91"},"editable")]}}];return Q(z,R(R({title:et?"\u7F16\u8F91\u5546\u54C1":"\u6DFB\u52A0\u5546\u54C1",formRef:Z,trigger:Q(C,{type:"primary",children:[s(T,{}),"\u6DFB\u52A0\u5546\u54C1"]}),drawerProps:{forceRender:!0,destroyOnClose:!0},visible:ut,onVisibleChange:ln,onFinish:un},G.fieldProps),{},{children:[s(p.Group,{children:s(v,{name:"title",width:"xl",label:"\u5546\u54C1\u6807\u9898",tooltip:"\u6700\u957F\u4E3A 24 \u4F4D",placeholder:"\u8BF7\u8F93\u5165\u540D\u79F0",required:!0,rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u5546\u54C1\u6807\u9898\uFF01"}]})}),Q(p.Group,{children:[s(n,{options:an,width:"sm",label:"\u5546\u54C1\u5206\u7C7B",fieldProps:{value:nn,onChange:function(F,E){var d,f;Vt(F),Pt((d=qt[F])===null||d===void 0||(f=d.children)===null||f===void 0?void 0:f.map(function(g){return{label:g.name,value:g.id}}))}}}),(Yt.length>0||(Z==null||(lt=Z.current)===null||lt===void 0||(at=lt.getFieldValue("categories"))===null||at===void 0?void 0:at.length)>0)&&s(n,{options:Yt,width:"sm",name:"categories",label:"\u5B50\u7C7B\u522B",mode:"multiple",fieldProps:{defaultValue:rn}}),Et.length==0&&Q(B,{children:[s(a,{width:"xs",name:"price",label:"\u5546\u54C1\u4EF7\u683C",required:!0,rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u4EF7\u683C\uFF01"}]}),s(a,{width:"xs",name:"stock",label:"\u5546\u54C1\u5E93\u5B58",required:!0,rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u5E93\u5B58\uFF01"}]})]}),s(m.Z,{goodsId:et,goodsRef:Z,addEmptyGoods:fn,skuData:Et,setSkuData:It,specData:kt}),Et.length>0&&s(p.Item,{name:"sku",initialValue:Et,trigger:"onValuesChange",children:s(h,{rowKey:"id",toolBarRender:!1,columns:vn,recordCreatorProps:!1,editable:{type:"multiple",editableKeys:Jt,onChange:wt,actionRender:function(F,E,d){return[d.save,d.cancel]},onSave:function(){var w=D(P.mark(function E(d,f,g){var L,rt;return P.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,(0,e.A9)(et,d,f);case 3:r.next=9;break;case 5:throw r.prev=5,r.t0=r.catch(0),u.error(r.t0===null||r.t0===void 0||(L=r.t0.data)===null||L===void 0?void 0:L.msg),new Error(r.t0===null||r.t0===void 0||(rt=r.t0.data)===null||rt===void 0?void 0:rt.msg);case 9:case"end":return r.stop()}},E,null,[[0,5]])}));function F(E,d,f){return w.apply(this,arguments)}return F}()}})})]}),s(p.Group,{children:s(p.Item,{name:"images",children:s(i.Z,{fileList:(ct.images||[]).map(function(w,F){return{id:F,url:w}})})})}),Q(p.Group,{children:[s(p.Item,{name:"description",children:s(o,{value:gt,onChange:yt,onSave:dn,media:{uploadFn:cn}})}),s("div",{children:gt.toHTML()})]})]}))}),I()})},1)},3904:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){t.r(W);var e=t(5671),m=t(9512),i=t(1091),y=I([e,m,i]);[e,m,i]=y.then?yield y:y;const{default:c}=yield t.e(5845).then(t.t.bind(t,5845,23)),{}=yield t.e(8898).then(t.t.bind(t,8898,23)),{default:$}=yield t.e(5073).then(t.t.bind(t,5073,23)),{}=yield t.e(6771).then(t.t.bind(t,6771,23)),{default:P}=yield t.e(7880).then(t.t.bind(t,7880,23)),{default:C}=yield t.e(1317).then(t.t.bind(t,1317,23)),{default:R}=yield t.e(3129).then(t.t.bind(t,3129,23)),{}=yield t.e(4555).then(t.t.bind(t,4555,23)),{default:u}=yield t.e(7762).then(t.t.bind(t,7762,23)),{default:D}=yield t.e(4853).then(t.t.bind(t,4853,23)),{default:l,useState:S,useRef:j}=yield t.e(9910).then(t.t.bind(t,9910,23)),{PageContainer:K,FooterToolbar:N}=yield t.e(5100).then(t.t.bind(t,5100,23)),{default:U}=yield t.e(3663).then(t.t.bind(t,3663,23)),{default:p}=yield t.e(5770).then(t.t.bind(t,78,23)),{useEffect:z}=yield t.e(9910).then(t.t.bind(t,9910,23)),{default:v}=yield t.e(1406).then(t.t.bind(t,1406,23)),{jsx:n}=yield t.e(4455).then(t.t.bind(t,4455,23)),{jsxs:a}=yield t.e(4455).then(t.t.bind(t,4455,23));var T=function(){var h=D(c.mark(function O(s){var Q;return c.wrap(function(G){for(;;)switch(G.prev=G.next){case 0:if(Q=u.loading("\u6B63\u5728\u5220\u9664"),s){G.next=3;break}return G.abrupt("return",!0);case 3:return G.prev=3,G.next=6,(0,e.yR)({ids:s.map(function(_){return _.id}).join(",")});case 6:return Q(),u.success("\u5220\u9664\u6210\u529F\uFF0C\u5373\u5C06\u5237\u65B0"),G.abrupt("return",!0);case 11:return G.prev=11,G.t0=G.catch(3),Q(),u.error("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"),G.abrupt("return",!1);case 16:case"end":return G.stop()}},O,null,[[3,11]])}));return function(s){return h.apply(this,arguments)}}(),o=function(){var O=S(!1),s=R(O,2),Q=s[0],B=s[1],G=j(),_=j(),lt=j(),at=S(),Z=R(at,2),X=Z[0],k=Z[1],ut=S([]),st=R(ut,2),J=st[0],nt=st[1],ot={},tt=(0,i.t)("categories"),H=tt.categoriesByid,dt=tt.getCategories,gt=S({"":"\u5168\u90E8\u5206\u7C7B"}),yt=R(gt,2),St=yt[0],Rt=yt[1],et=[{title:"\u5546\u54C1\u540D\u79F0",dataIndex:"title",tip:"\u5546\u54C1\u540D\u79F0\u662F\u552F\u4E00\u7684 key",render:function(A,M){return n("a",{onClick:function(){k(M),B(!0)},children:A})}},{title:"\u4EF7\u683C",dataIndex:"price",sorter:!0,hideInSearch:!0,hideInForm:!0,renderText:function(A){return"\xA5".concat(A)}},{title:"\u9500\u91CF",dataIndex:"sold_count",sorter:!0,hideInSearch:!0,hideInForm:!0,renderText:function(A){return"".concat(A)}},{title:"\u8BC4\u4EF7",dataIndex:"rating",sorter:!0,hideInSearch:!0,hideInForm:!0,renderText:function(A){return"".concat(A)}},{title:"\u5206\u7C7B",dataIndex:"category",hideInTable:!0,hideInForm:!0,filters:!0,valueEnum:St},{title:"\u72B6\u6001",dataIndex:"on_sale",hideInForm:!0,filters:!0,valueEnum:{true:{text:"\u5728\u552E",status:!0},false:{text:"\u4E0B\u67B6",status:!1}}},{title:"\u64CD\u4F5C",dataIndex:"option",valueType:"option",render:function(A,M){return[n("a",{onClick:function(it){lt.current.open(M==null?void 0:M.id),k(M)},children:"\u7F16\u8F91"},"config")]}}];return z(function(){D(c.mark(function Y(){var A;return c.wrap(function(ct){for(;;)switch(ct.prev=ct.next){case 0:return ct.next=2,dt();case 2:A=ct.sent,Rt(C(C({},St),v.keyBy(v.map(A,function(it){return{text:it.name,id:it.id}}),"id")));case 4:case"end":return ct.stop()}},Y)}))()},[]),a(K,{children:[n(U,{actionRef:_,formRef:G,rowKey:"id",search:{labelWidth:120},toolbar:{search:{onSearch:function(A){var M;ot.search=A,(M=G.current)===null||M===void 0||M.submit()}}},toolBarRender:function(){return[n(m.Z,{ref:lt})]},params:ot,request:e.lO,columns:et,rowSelection:{onChange:function(A,M){nt(M)}}}),(J==null?void 0:J.length)>0&&n(N,{extra:a("div",{children:["\u5DF2\u9009\u62E9"," ",n("a",{style:{fontWeight:600},children:J.length})," ","\u9879"]}),children:n(P,{onClick:D(c.mark(function Y(){var A,M;return c.wrap(function(it){for(;;)switch(it.prev=it.next){case 0:return it.next=2,T(J);case 2:nt([]),(A=_.current)===null||A===void 0||(M=A.reloadAndRest)===null||M===void 0||M.call(A);case 4:case"end":return it.stop()}},Y)})),children:"\u6279\u91CF\u5220\u9664"})}),n($,{width:600,visible:Q,onClose:function(){k(void 0),B(!1)},closable:!1,children:(X==null?void 0:X.name)&&n(p,{column:2,title:X==null?void 0:X.name,request:D(c.mark(function Y(){return c.wrap(function(M){for(;;)switch(M.prev=M.next){case 0:return M.abrupt("return",{data:X||{}});case 1:case"end":return M.stop()}},Y)})),params:{id:X==null?void 0:X.name},columns:et})})]})};W.default=o,I()})},1)},5671:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){t.d(W,{lO:function(){return c},QO:function(){return P},e3:function(){return R},A9:function(){return D},Rq:function(){return S},fQ:function(){return K},yR:function(){return U},Dt:function(){return z}});var e=t(5751),m=I([e]);e=(m.then?yield m:m)[0];const{default:i}=yield t.e(5845).then(t.t.bind(t,5845,23)),{default:y}=yield t.e(4853).then(t.t.bind(t,4853,23));function c(n,a,T){return $.apply(this,arguments)}function $(){return $=y(i.mark(function n(a,T,o){var h;return i.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,e.WY)("/admin/products",{method:"GET",params:{page:a.current,per_page:a.pageSize,order:Object.keys(T).length?Object.keys(T)[0]+(Object.values(T)[0]=="ascend"?"_asc":"_desc"):null,title:a.title,on_sale:a.on_sale||((h=o.on_sale)===null||h===void 0?void 0:h.join(",")),category_ids:a.category,search:a.search}}));case 1:case"end":return s.stop()}},n)})),$.apply(this,arguments)}function P(n){return C.apply(this,arguments)}function C(){return C=y(i.mark(function n(a){return i.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,e.WY)("/admin/products/".concat(a),{method:"GET"}));case 1:case"end":return o.stop()}},n)})),C.apply(this,arguments)}function R(n,a){return u.apply(this,arguments)}function u(){return u=y(i.mark(function n(a,T){return i.wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.abrupt("return",(0,e.WY)("/admin/products/".concat(a),{method:"PATCH",data:T}));case 1:case"end":return h.stop()}},n)})),u.apply(this,arguments)}function D(n,a,T){return l.apply(this,arguments)}function l(){return l=y(i.mark(function n(a,T,o){return i.wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return O.abrupt("return",(0,e.WY)("/admin/products/".concat(a,"/sku/").concat(T),{method:"PATCH",data:o}));case 1:case"end":return O.stop()}},n)})),l.apply(this,arguments)}function S(n){return j.apply(this,arguments)}function j(){return j=y(i.mark(function n(a){return i.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,e.WY)("/admin/products",{method:"POST",data:a}));case 1:case"end":return o.stop()}},n)})),j.apply(this,arguments)}function K(n,a){return N.apply(this,arguments)}function N(){return N=y(i.mark(function n(a,T){return i.wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.abrupt("return",(0,e.WY)("/admin/products/".concat(a,"/spec"),{method:"POST",data:T}));case 1:case"end":return h.stop()}},n)})),N.apply(this,arguments)}function U(n){return p.apply(this,arguments)}function p(){return p=y(i.mark(function n(a){return i.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,e.WY)("/admin/products",{method:"DELETE",params:a}));case 1:case"end":return o.stop()}},n)})),p.apply(this,arguments)}function z(n){return v.apply(this,arguments)}function v(){return v=y(i.mark(function n(a){return i.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,e.WY)("/admin/products/".concat(a,"/categories"),{method:"GET"}));case 1:case"end":return o.stop()}},n)})),v.apply(this,arguments)}I()})},1)},5888:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){const{default:e}=yield t.e(5845).then(t.t.bind(t,5845,23)),{default:m}=yield t.e(4853).then(t.t.bind(t,4853,23)),{default:i}=yield t.e(1317).then(t.t.bind(t,1317,23)),{default:y}=yield t.e(8530).then(t.t.bind(t,8530,23));var c="caitou-1252187609",$="ap-guangzhou",P=new y({SecretId:"AKID0pOilX1FBrGPGq9H8i01mFRM0NUJswjF",SecretKey:"GFxOXQ1LNIxKQEm7BxTheKktkKdfQuBC"}),C=function(l){return new Promise(function(S,j){P.getObjectUrl(i({Bucket:c,Region:$,Sign:!0},l),function(K,N){if(K)return j(K);S(N.Url)})})},R=null,u=null;W.ZP=P,I()})},1)},3948:function(x,W,t){"use strict";t.a(x,function(I){return vt(this,null,function*(){var e=t(5888),m=I([e]);e=(m.then?yield m:m)[0];const{default:i}=yield t.e(5845).then(t.t.bind(t,5845,23)),{default:y}=yield t.e(4853).then(t.t.bind(t,4853,23));function c($){return Array.from(Array(Number($)||24),function(){return Math.floor(Math.random()*36).toString(36)}).join("")}W.Z=function(){var $=y(i.mark(function P(C){var R,u,D;return i.wrap(function(S){for(;;)switch(S.prev=S.next){case 0:R=C.file,C.hashFilename&&(C.filename=c(16)),C.filename&&C.filename.indexOf(".")==-1&&R.name&&(C.filename+=R.name.substring(R.name.lastIndexOf("."))),u=C.filename||(R!=null&&R.name?R==null?void 0:R.name:""),D=C.path?"/".concat(C.path,"/").concat(u):u,e.ZP.putObject({Bucket:"caitou-1252187609",Region:"ap-guangzhou",Key:D,StorageClass:"STANDARD",Body:C.file,onProgress:function(K){C.progress(K.percent*100)}},function(j,K){!j&&K?C.success(K):C.error({msg:"\u4E0A\u4F20\u5931\u8D25"})});case 6:case"end":return S.stop()}},P)}));return function(P){return $.apply(this,arguments)}}(),I()})},1)}}]);