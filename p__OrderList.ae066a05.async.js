var K=(O,$,t)=>new Promise((G,c)=>{var y=v=>{try{i(t.next(v))}catch(S){c(S)}},u=v=>{try{i(t.throw(v))}catch(S){c(S)}},i=v=>v.done?G(v.value):Promise.resolve(v.value).then(y,u);i((t=t.apply(O,$)).next())});(self.webpackChunkcaitou_admin=self.webpackChunkcaitou_admin||[]).push([[8973],{8009:function(O,$,t){"use strict";t.a(O,function(G){return K(this,null,function*(){t.r($);var c=t(6592),y=t(5751),u=G([c,y]);[c,y]=u.then?yield u:u;const{default:i}=yield t.e(5845).then(t.t.bind(t,5845,23)),{}=yield t.e(8898).then(t.t.bind(t,8898,23)),{default:v}=yield t.e(5073).then(t.t.bind(t,5073,23)),{}=yield t.e(6771).then(t.t.bind(t,6771,23)),{default:S}=yield t.e(7880).then(t.t.bind(t,7880,23)),{default:w}=yield t.e(1317).then(t.t.bind(t,1317,23)),{default:C}=yield t.e(3129).then(t.t.bind(t,3129,23)),{}=yield t.e(4555).then(t.t.bind(t,4555,23)),{default:F}=yield t.e(7762).then(t.t.bind(t,7762,23)),{default:R}=yield t.e(4853).then(t.t.bind(t,4853,23)),{default:X,useState:T,useRef:M}=yield t.e(9910).then(t.t.bind(t,9910,23)),{PageContainer:D,FooterToolbar:H}=yield t.e(5100).then(t.t.bind(t,5100,23)),{default:P}=yield t.e(3663).then(t.t.bind(t,3663,23)),{default:L}=yield t.e(5770).then(t.t.bind(t,78,23)),{useEffect:j}=yield t.e(9910).then(t.t.bind(t,9910,23)),{default:B}=yield t.e(1406).then(t.t.bind(t,1406,23)),{jsx:h}=yield t.e(4455).then(t.t.bind(t,4455,23)),{jsxs:e}=yield t.e(4455).then(t.t.bind(t,4455,23));var a=function(){var n=R(i.mark(function o(f){var p;return i.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:if(p=F.loading("\u6B63\u5728\u5220\u9664"),f){l.next=3;break}return l.abrupt("return",!0);case 3:return l.prev=3,l.next=6,(0,c.yR)({ids:f.map(function(W){return W.id}).join(",")});case 6:return p(),F.success("\u5220\u9664\u6210\u529F\uFF0C\u5373\u5C06\u5237\u65B0"),l.abrupt("return",!0);case 11:return l.prev=11,l.t0=l.catch(3),p(),F.error("\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5"),l.abrupt("return",!1);case 16:case"end":return l.stop()}},o,null,[[3,11]])}));return function(f){return n.apply(this,arguments)}}(),d=function(){var o=T(!1),f=C(o,2),p=f[0],U=f[1],l=M(),W=M(),et=M(),Z=T(),Y=C(Z,2),g=Y[0],x=Y[1],b=T([]),z=C(b,2),A=z[0],J=z[1],N={},k=(0,y.tT)("categories"),q=k.getCategories,_=T({"":"\u5168\u90E8\u5206\u7C7B"}),Q=C(_,2),tt=Q[0],nt=Q[1],V=[{title:"\u8BA2\u5355\u7F16\u53F7",dataIndex:"no",tip:"\u5546\u54C1no\u662F\u552F\u4E00\u7684 key",render:function(s,r){return h("a",{onClick:function(){x(r),U(!0)},children:s})}},{title:"\u5546\u54C1",dataIndex:"ship_data.express_company",hideInSearch:!0,hideInForm:!0},{title:"\u8D2D\u4E70\u7528\u6237",dataIndex:"user_nickname",hideInSearch:!0,hideInForm:!0},{title:"\u603B\u4EF7",dataIndex:"total_amount",sorter:!0,hideInSearch:!0,hideInForm:!0,renderText:function(s){return"\xA5".concat(s)}},{title:"\u72B6\u6001",dataIndex:"status",hideInForm:!0,filters:!0,valueEnum:{unpaid:"\u672A\u652F\u4ED8",undelivered:"\u672A\u53D1\u8D27",unreceived:"\u5F85\u6536\u8D27",unreviewed:"\u5F85\u8BC4\u4EF7",refunding:"\u7533\u8BF7\u9000\u6B3E",canceled:"\u8BA2\u5355\u53D6\u6D88",completed:"\u8BA2\u5355\u5B8C\u6210"},renderText:function(s,r){switch(r.status){case"undelivered":r.type=="intra-city"&&(s="\u5907\u8D27\u4E2D");break;case"unreceived":r.type=="verification"&&(s="\u5DF2\u53D1\u6838\u9500\u7801"),r.type=="intra-city"&&(s="\u9A91\u624B\u53D6\u5355");break;case"unreviewed":r.type=="virtual"&&(s="\u5DF2\u652F\u4ED8"),r.type=="verification"&&(s="\u5DF2\u6838\u9A8C");break}return s}},{title:"\u5907\u6CE8",dataIndex:"note",hideInSearch:!0,hideInForm:!0},{title:"\u64CD\u4F5C",dataIndex:"option",valueType:"option",render:function(s,r){return[h("a",{onClick:function(I){x(r)},children:"\u53D1\u8D27"},"config")]}}];return j(function(){R(i.mark(function m(){var s;return i.wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return E.next=2,q();case 2:s=E.sent,nt(w(w({},tt),B.keyBy(B.map(s,function(I){return{text:I.name,id:I.id}}),"id")));case 4:case"end":return E.stop()}},m)}))()},[]),e(D,{children:[h(P,{actionRef:W,formRef:l,rowKey:"id",search:{labelWidth:120},toolbar:{search:{onSearch:function(s){var r;N.search=s,(r=l.current)===null||r===void 0||r.submit()}}},params:N,request:c.AU,columns:V,rowSelection:{onChange:function(s,r){J(r)}}}),(A==null?void 0:A.length)>0&&h(H,{extra:e("div",{children:["\u5DF2\u9009\u62E9"," ",h("a",{style:{fontWeight:600},children:A.length})," ","\u9879"]}),children:h(S,{onClick:R(i.mark(function m(){var s,r;return i.wrap(function(I){for(;;)switch(I.prev=I.next){case 0:return I.next=2,a(A);case 2:J([]),(s=W.current)===null||s===void 0||(r=s.reloadAndRest)===null||r===void 0||r.call(s);case 4:case"end":return I.stop()}},m)})),children:"\u6279\u91CF\u5220\u9664"})}),h(v,{width:600,visible:p,onClose:function(){x(void 0),U(!1)},closable:!1,children:(g==null?void 0:g.name)&&h(L,{column:2,title:g==null?void 0:g.name,request:R(i.mark(function m(){return i.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.abrupt("return",{data:g||{}});case 1:case"end":return r.stop()}},m)})),params:{id:g==null?void 0:g.name},columns:V})})]})};$.default=d,G()})},1)},6592:function(O,$,t){"use strict";t.a(O,function(G){return K(this,null,function*(){t.d($,{AU:function(){return v},yR:function(){return L}});var c=t(5751),y=G([c]);c=(y.then?yield y:y)[0];const{default:u}=yield t.e(5845).then(t.t.bind(t,5845,23)),{default:i}=yield t.e(4853).then(t.t.bind(t,4853,23));function v(e,a,d){return S.apply(this,arguments)}function S(){return S=i(u.mark(function e(a,d,n){var o;return u.wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",(0,c.WY)("/admin/orders",{method:"GET",params:{page:a.current,per_page:a.pageSize,order:Object.keys(d).length?Object.keys(d)[0]+(Object.values(d)[0]=="ascend"?"_asc":"_desc"):null,title:a.title,on_sale:a.on_sale||((o=n.on_sale)===null||o===void 0?void 0:o.join(",")),category_ids:a.category,search:a.search}}));case 1:case"end":return p.stop()}},e)})),S.apply(this,arguments)}function w(e){return C.apply(this,arguments)}function C(){return C=i(u.mark(function e(a){return u.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("/admin/products/".concat(a),{method:"GET"}));case 1:case"end":return n.stop()}},e)})),C.apply(this,arguments)}function F(e,a){return R.apply(this,arguments)}function R(){return R=i(u.mark(function e(a,d){return u.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",request("/admin/products/".concat(a),{method:"PATCH",data:d}));case 1:case"end":return o.stop()}},e)})),R.apply(this,arguments)}function X(e,a,d){return T.apply(this,arguments)}function T(){return T=i(u.mark(function e(a,d,n){return u.wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return f.abrupt("return",request("/admin/products/".concat(a,"/sku/").concat(d),{method:"PATCH",data:n}));case 1:case"end":return f.stop()}},e)})),T.apply(this,arguments)}function M(e){return D.apply(this,arguments)}function D(){return D=i(u.mark(function e(a){return u.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("/admin/products",{method:"POST",data:a}));case 1:case"end":return n.stop()}},e)})),D.apply(this,arguments)}function H(e,a){return P.apply(this,arguments)}function P(){return P=i(u.mark(function e(a,d){return u.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",request("/admin/products/".concat(a,"/spec"),{method:"POST",data:d}));case 1:case"end":return o.stop()}},e)})),P.apply(this,arguments)}function L(e){return j.apply(this,arguments)}function j(){return j=i(u.mark(function e(a){return u.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,c.WY)("/admin/products",{method:"DELETE",params:a}));case 1:case"end":return n.stop()}},e)})),j.apply(this,arguments)}function B(e){return h.apply(this,arguments)}function h(){return h=i(u.mark(function e(a){return u.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("/admin/products/".concat(a,"/categories"),{method:"GET"}));case 1:case"end":return n.stop()}},e)})),h.apply(this,arguments)}G()})},1)}}]);
