(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{141:function(e,t,a){e.exports=a.p+"static/media/flexchatlogo.ad21ba20.png"},146:function(e,t,a){e.exports=a(262)},199:function(e,t,a){},255:function(e,t,a){},260:function(e,t,a){},262:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(12),l=a.n(c),o=a(31),s=a(22),i=a(49),u=a.n(i);function d(e,t){try{var a=window.localStorage.getItem(e);return a?JSON.parse(a):t}catch(n){return console.log(n),t}}function p(e,t){try{window.localStorage.setItem(e,JSON.stringify(t))}catch(a){console.log(a)}}var m=Object(n.createContext)(),f=function(e,t){var a=t.type;if(a===b){var n=t.payload,r=t.pk,c=Object(s.a)(Object(s.a)({},e),{},{jwtToken:n,pk:r});return Object(i.UpdateWithSideEffect)(c,(function(e,t){p("jwtToken",n)}))}if(a===h){var l=Object(s.a)(Object(s.a)({},e),{},{jwtToken:""});return Object(i.UpdateWithSideEffect)(l,(function(e,t){p("jwtToken","")}))}if(a===g){var o=t.payload,u=Object(s.a)(Object(s.a)({},e),{},{group:o});return Object(i.Update)(u)}if(a===y){var d=Object(s.a)(Object(s.a)({},e),{},{group:""});return Object(i.Update)(d)}if(a===j){var m=t.payload,f=Object(s.a)(Object(s.a)({},e),{},{total_user:m});return Object(i.Update)(f)}if(a===O){var v=t.payload,E=Object(s.a)(Object(s.a)({},e),{},{is_match:v});return Object(i.Update)(E)}if(a===x){var k=t.payload,w=Object(s.a)(Object(s.a)({},e),{},{is_login:k});return Object(i.Update)(w)}return e},v=function(e){var t=e.children,a=d("jwtToken",""),n=u()(f,{jwtToken:a,pk:-1,group:"",total_user:"Loading...",is_match:!1,is_loing:!1}),c=Object(o.a)(n,2),l=c[0],s=c[1];return r.a.createElement(m.Provider,{value:{store:l,dispatch:s}},t)},E=function(){return Object(n.useContext)(m)},b="APP/SET_TOKEN",h="APP/DELETE_TOKEN",g="APP/SET_GROUP",y="APP/DELETE_GROUP",j="APP/SET_TOTALUSER",O="APP/SET_ISMATCH",x="APP/SET_ISLOGIN",k=function(){return{type:y}},w=function(e){return{type:j,payload:e}},S=function(e){return{type:O,payload:e}},T=function(e){return{type:x,payload:e}},N=a(94),_=a(24),A=a(46),C=a.n(A),P=a(59),z=a(269),U=a(266),B=a(270),L=a(271),R=a(66),I=a.n(R),W="https://dry-dawn-35150.herokuapp.com",J=I.a.create({baseURL:W});function G(e){var t=e.chatClose,a=e.setWaiters,n=E(),c=n.store,l=c.pk,o=c.jwtToken,s=c.is_match,i=n.dispatch,u={Authorization:"JWT ".concat(o)},d=function(){var e=Object(P.a)(C.a.mark((function e(){var n;return C.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t(),o){e.next=4;break}return i(T(!1)),e.abrupt("return",null);case 4:return i(S(!0)),e.prev=5,console.log(s),e.next=9,J.get("/chat/match/".concat(l,"/"),{headers:u});case 9:n=e.sent,i((c=n.data.group,{type:g,payload:c})),a(0),z.a.open({message:"\uc0c1\ub300\ubc29\uacfc \uc5f0\uacb0\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",description:"\uc778\uc0ac\ub97c \uac74\ub124\ubcf4\uc138\uc694 :)",icon:r.a.createElement(B.a,{style:{color:"#43d5d2"}})}),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(5),console.error(e.t0);case 18:case"end":return e.stop()}var c}),e,null,[[5,15]])})));return function(){return e.apply(this,arguments)}}();return r.a.createElement("div",null,r.a.createElement(U.a,{type:"primary",shape:"round",onClick:d,size:"large",style:{border:"2px solid white"}},r.a.createElement(L.a,null),"\xa0\ucc44\ud305\uc2dc\uc791"))}var F=a(137),M=a.n(F),V=a(272),D=a(273),K=a(274),q=a(275),H=a(276),Q=a(277),X=a(265),Y=a(263);a(199);function Z(e,t){var a=Object(n.useRef)();Object(n.useEffect)((function(){a.current=e}),[e]),Object(n.useEffect)((function(){if(null!==t){var e=setInterval((function(){a.current()}),t);return function(){clearInterval(e)}}}),[e,t])}function $(e){var t=e.chatSocket,a=e.setChatSocket,c=E(),l=c.store,s=l.group,i=l.pk,u=l.jwtToken,d=l.is_match,p=c.dispatch,m=Object(n.useState)(""),f=Object(o.a)(m,2),v=f[0],b=f[1],h=Object(n.useState)(1),g=Object(o.a)(h,2),y=g[0],j=g[1],O=Object(n.useState)(0),x=Object(o.a)(O,2),T=x[0],N=x[1],_=Object(n.useRef)(null),A=Object(n.useState)([r.a.createElement("div",{key:"0",ref:_})]),C=Object(o.a)(A,2),P=C[0],U=C[1],B={Authorization:"JWT ".concat(u)};Z((function(){if(u&&d&&!s)try{var e=J.get("/chat/users_count/"),t=J.get("/chat/group/".concat(i,"/"),{headers:B});I.a.all([e,t]).then(I.a.spread((function(){var e=arguments.length<=0?void 0:arguments[0],t=arguments.length<=1?void 0:arguments[1];console.log("response : ",e.data),console.log("response2 : ",t.data),p(w(e.data.count)),N(t.data.waiters_count)}))).catch((function(e){console.error(e)}))}catch(a){console.log(a)}}),5e3),t.onmessage=function(e){var t=JSON.parse(e.data);if(i===t.pk){var a=P.pop();P.push(r.a.createElement("div",{key:y,className:"bubble"},t.message)),P.push(a),U(P)}else{var n=P.pop();"M"===t.gender?P.push(r.a.createElement("div",{key:y,className:"another"},r.a.createElement("div",{className:"another-user"},r.a.createElement(X.a,{icon:r.a.createElement(V.a,null),style:{marginLeft:"10px",backgroundColor:"skyblue"}}),r.a.createElement("div",{className:"another-bubble"},t.message)))):P.push(r.a.createElement("div",{key:y,className:"another"},r.a.createElement("div",{className:"another-user"},r.a.createElement(X.a,{icon:r.a.createElement(D.a,null),style:{marginLeft:"10px",backgroundColor:"hotpink"}}),r.a.createElement("div",{className:"another-bubble"},t.message)))),P.push(n),U(P)}j((function(e){return e+1}))},t.onclose=function(e){U([r.a.createElement("div",{key:"0",ref:_})]),p(k()),a({}),p(S(!1)),z.a.open({message:"\ucc44\ud305\uc774 \uc885\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",description:"\uc0c8\ub85c\uc6b4 \ucc44\ud305\uc744 \uc2dc\uc791\ud558\uc138\uc694",icon:r.a.createElement(K.a,{style:{color:"red"}})})};return Object(n.useEffect)((function(){_.current.scrollIntoView({behavior:"smooth"})}),[y]),r.a.createElement("div",{className:"chat-content"},r.a.createElement("div",{className:"chat-log-window"},d?s?P:r.a.createElement("div",{className:"flex-center"},r.a.createElement(Y.a,{size:"large",tip:T?r.a.createElement("div",null,"\ub0b4 \uc55e\uc758 \ub300\uae30\uc790 \uc218 : ",T):r.a.createElement("span",null,"\uc7a0\uc2dc\ud6c4 \ub9e4\uce6d\ub429\ub2c8\ub2e4!"),style:{color:"white"},indicator:r.a.createElement(q.a,{style:{fontSize:36},spin:!0})})):r.a.createElement("div",{className:"flex-center"},r.a.createElement(G,{chatClose:function(){if(!t.close)return null;t.close()},setWaiters:N}),P)),r.a.createElement("div",null,r.a.createElement(M.a,{placeholder:s?"\uba54\uc138\uc9c0\ub97c \ubcf4\ub0b4\uc138\uc694!":"\ucc44\ud305\uc2dc\uc791 \ubc84\ud2bc\uc744 \ud074\ub9ad\ud558\uc138\uc694!",enterButton:r.a.createElement(H.a,null),prefix:r.a.createElement(Q.a,null),size:"large",value:v,disabled:!s,allowClear:!0,maxLength:"100",onChange:function(e){return b(e.target.value)},onSearch:function(){if(!v)return null;t.send(JSON.stringify({message:v})),b("")}})))}var ee=a(264);function te(){var e=E(),t=e.store.total_user,a=e.dispatch;return Z(function(){var e=Object(P.a)(C.a.mark((function e(){var t;return C.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,J.get("/chat/users_count/");case 3:t=e.sent,a(w(t.data.count)),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}(),5e3),r.a.createElement(ee.a,{hoverable:!0,title:r.a.createElement("div",{style:{textAlign:"center",wordBreak:"break-all"}},"\uc9c0\uae08 \uba87\uba85?"),bordered:!0},r.a.createElement("h1",{style:{textAlign:"center",color:"#43d5d2"}},t))}a(255);var ae=a(141),ne=a.n(ae);function re(e){var t=e.children,a=e.right_sidebar,n=e.user_info;return r.a.createElement("div",{className:"app"},r.a.createElement("div",{className:"header"},r.a.createElement("div",{className:"logo"},r.a.createElement("img",{src:ne.a,alt:"Flex Chat"})),r.a.createElement("div",{className:"topnav"},n)),r.a.createElement("div",{className:"contents"},t),r.a.createElement("div",{className:"left-sidebar"}),r.a.createElement("div",{className:"right-sidebar"},a),r.a.createElement("div",{className:"footer"},"\xa9 2020. flexchat"))}var ce=a(278);function le(e){var t=e.chatSocket,a=E().store.group;return r.a.createElement("div",null,a?r.a.createElement(U.a,{type:"danger",danger:!0,block:!0,shape:"round",icon:r.a.createElement(ce.a,null),size:"large",onClick:function(){if(!t.close)return null;t.close()},style:{marginTop:"10px"}},"\ucc44\ud305 \uadf8\ub9cc\ud558\uae30"):null)}var oe=a(268),se=a(267),ie=a(279),ue=a(280),de=a(281),pe=a(282);function me(e){e.signal;var t=E(),a=t.store,c=a.jwtToken,l=a.is_login,i=t.dispatch,u=Object(n.useState)({gender:"",want_match:""}),d=Object(o.a)(u,2),p=d[0],m=d[1],f=Object(n.useState)(!1),v=Object(o.a)(f,2),h=v[0],g=v[1],y=Object(n.useState)(!1),j=Object(o.a)(y,2),O=j[0],x=j[1],k=function(){var e=Object(P.a)(C.a.mark((function e(){var t,a,n;return C.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,x(!0),!p.pk){e.next=13;break}return i(S(!1)),t={Authorization:"JWT ".concat(c)},e.next=7,J.put("/accounts/users/".concat(p.pk,"/"),Object(s.a)({},p),{headers:t});case 7:a=e.sent,m(a.data),x(!1),N(),e.next=21;break;case 13:return e.next=15,J.post("/accounts/users/",Object(s.a)({},p));case 15:n=e.sent,m(n.data),i((l=n.data.token,o=n.data.pk,{type:b,payload:l,pk:o})),x(!1),N(),i(T(!0));case 21:z.a.open({message:"\uc131\uacf5\uc801\uc73c\ub85c \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",description:"\uc774\uc81c \ucc44\ud305\uc744 \uc2dc\uc791\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4!",icon:r.a.createElement(ie.a,{style:{color:"green"}})}),e.next=27;break;case 24:e.prev=24,e.t0=e.catch(0),console.error(e.t0);case 27:case"end":return e.stop()}var l,o}),e,null,[[0,24]])})));return function(){return e.apply(this,arguments)}}(),w=function(){g(!0)},N=function(){g(!1)};return Object(n.useEffect)((function(){l||(w(),i(T(!0)))}),[l,i]),r.a.createElement("div",null,r.a.createElement(r.a.Fragment,null,c?r.a.createElement(ue.a,{onClick:w,style:{fontSize:"40px",color:"#43d5d2"}}):r.a.createElement(de.a,{onClick:w,style:{fontSize:"40px",color:"#43d5d2"}}),r.a.createElement(oe.a,{maskStyle:{backgroundColor:"transparent"},placement:"left",closable:!0,onClose:N,visible:h,style:{boxShadow:"0 8px 16px 0 rgba(0, 0, 0, 1)"}},r.a.createElement("div",null,r.a.createElement("p",{style:{marginBottom:24,textAlign:"center"}},r.a.createElement(de.a,null),"\xa0SETTING"),r.a.createElement("hr",{style:fe}),r.a.createElement("div",{style:{marginTop:"30px",fontWeight:"bold",fontSize:"20px",color:"skyblue"}},"\uc800\ub294"),r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(se.a.Group,{onChange:function(e){return m((function(t){return Object(s.a)(Object(s.a)({},t),{},{gender:e.target.value})}))},buttonStyle:"solid",size:"large",style:{margin:"10px 0 10px 0",borderRadius:"12px"}},r.a.createElement(se.a.Button,{style:ve,value:"M"},r.a.createElement(V.a,null),"\xa0\ub0a8\uc790"),r.a.createElement(se.a.Button,{style:ve,value:"F"},r.a.createElement(D.a,null),"\xa0\uc5ec\uc790"))),r.a.createElement("div",{style:{textAlign:"right",marginBottom:"30px"}},"\uc785\ub2c8\ub2e4."),r.a.createElement("hr",{style:fe}),r.a.createElement("div",{style:{marginTop:"30px",fontWeight:"bold",fontSize:"20px",color:"hotpink"}},"\uc0c1\ub300\ubc29\uc740 \xa0"),r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(se.a.Group,{onChange:function(e){return m((function(t){return Object(s.a)(Object(s.a)({},t),{},{want_match:e.target.value})}))},buttonStyle:"solid",style:{margin:"10px 0 10px 0",borderRadius:"12px"},size:"large"},r.a.createElement(se.a.Button,{style:ve,value:"M"},r.a.createElement(V.a,null),"\xa0\ub0a8\uc790"),r.a.createElement(se.a.Button,{style:ve,value:"F"},r.a.createElement(D.a,null),"\xa0\uc5ec\uc790"),r.a.createElement(se.a.Button,{style:ve,value:"A"},r.a.createElement(pe.a,null),"\xa0\uc544\ubb34\ub098"))),r.a.createElement("div",{style:{textAlign:"right",marginBottom:"30px"}},"\uac00 \uc88b\uaca0\uc5b4\uc694."),r.a.createElement("hr",{style:fe}),r.a.createElement("div",{style:{textAlign:"center",marginTop:"30px"}},r.a.createElement(U.a,{style:{borderRadius:"8px",boxShadow:"0 2px 4px 0 gray"},block:!0,type:"primary",loading:O,disabled:!p.gender||!p.want_match,size:"large",onClick:k},"\uc800\uc7a5"))))))}var fe={borderTop:"1px solid #eaeaea"},ve={borderRadius:"8px",border:"2px solid #43d5d2",margin:"3px 3px 0 3px",boxShadow:"0 2px 3px 0 gray"};var Ee=function(){var e=E().store,t=e.jwtToken,a=e.group,c=Object(n.useState)({}),l=Object(o.a)(c,2),s=l[0],i=l[1];Object(n.useEffect)((function(){if(t&&a){var e=new WebSocket("wss://dry-dawn-35150.herokuapp.com/ws/chat/?token=".concat(t));i(e)}}),[t,a]);var u=r.a.createElement(r.a.Fragment,null,r.a.createElement(te,null),r.a.createElement(le,{chatSocket:s}));return r.a.createElement("div",null,r.a.createElement(re,{right_sidebar:u,user_info:r.a.createElement(me,null)},r.a.createElement($,{chatSocket:s,setChatSocket:i})))},be=a(52),he=a.n(be),ge=a(144),ye=function(e){return function(e){void 0===e&&(e=function(){});var t=Object(ge.a)(e);Object(n.useEffect)((function(){var e=function(e){var a=t.current(e);if(e.defaultPrevented&&(e.returnValue=""),"string"===typeof a)return e.returnValue=a,a};return window.addEventListener("unload",e),function(){window.removeEventListener("unload",e)}}),[t])}(e.onUnload),e.children};ye.defaultProps={children:null},ye.propTypes={children:he.a.any,onUnload:he.a.func.isRequired};var je=function(){var e=E(),t=e.store.pk,a=e.dispatch,n=function(){a({type:h}),a(k());try{navigator.sendBeacon("".concat("https://dry-dawn-35150.herokuapp.com","/accounts/delete/").concat(t,"/"))}catch(e){console.error(e)}};return r.a.createElement(ye,{onUnload:function(){return n()}},r.a.createElement(_.a,{path:"/",component:Ee}))};a(259),a(260);l.a.render(r.a.createElement(N.a,{basename:""},r.a.createElement(v,null,r.a.createElement(je,null))),document.getElementById("root"))}},[[146,1,2]]]);
//# sourceMappingURL=main.972043dc.chunk.js.map