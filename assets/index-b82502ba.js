import{r as $,i as E,a as N,u as T,b as l,c as m,j as g,d as e,C as I,A as D,I as q,e as U,f as j,g as O,h as f,s as R,k as A,l as B,m as M,n as w}from"./index-ec30539c.js";const V="_container_1yedc_107",z="_fieldLabel_1yedc_114",P="_fieldErrorText_1yedc_130",Q="_input_1yedc_146",k={container:V,fieldLabel:z,fieldErrorText:P,input:Q},F="_container_ucgxe_107",G="_fieldLabel_ucgxe_114",H="_fieldErrorText_ucgxe_130",J="_input_ucgxe_146",K="_UsersSearch_ucgxe_175",W="_title_ucgxe_178",s={container:F,fieldLabel:G,fieldErrorText:H,input:J,UsersSearch:K,title:W};var h={},X=E;Object.defineProperty(h,"__esModule",{value:!0});var x=h.default=void 0,Y=X($()),Z=N,ee=(0,Y.default)((0,Z.jsx)("path",{d:"M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"SearchRounded");x=h.default=ee;const te=({})=>{const{control:n,watch:c,handleSubmit:r}=T(),[i,u]=l.useState(!1),[v,b]=l.useState([]),[d,y]=l.useState(""),S=m(),C=(a,o)=>{y(o)},L=a=>{console.log("submit"),p(a.query)},p=async a=>{if(a){u(!0);const o=await U.getUsersByQuery(a);u(!1),o&&b(o.map(t=>({fullName:t.fullName,uid:t.uid})))}};return l.useEffect(()=>{console.log("query changed"),d&&p(d)},[d]),g("div",{className:s.UsersSearch,children:[e("h3",{className:s.title,children:"Знайдіть нових співрозмовників"}),e("form",{className:s.form,onSubmit:r(L),children:e(I,{control:n,name:"query",render:({field:{value:a,onChange:o}})=>e(D,{options:v,className:s.input,inputValue:d,freeSolo:!0,loading:i,loadingText:"Пошук...",isOptionEqualToValue:(t,_)=>t.fullName===_.fullName,getOptionLabel:t=>t.fullName,onChange:(t,_)=>{S(`/account/${_.uid}`)},onInputChange:C,placeholder:"І'мя та прізвище",endDecorator:e(q,{className:s.iconBtn,type:"submit",children:e(x,{className:s.icon})})})})})]})},ae="_container_1yedc_107",se="_fieldLabel_1yedc_114",ne="_fieldErrorText_1yedc_130",ce="_input_1yedc_146",re={container:ae,fieldLabel:se,fieldErrorText:ne,input:ce},oe=({chatsData:n})=>e("div",{className:re.ChatsList,children:n.map(c=>e(j,{data:c},c.contactId))}),le=({})=>{const n=m(),c=O(),r=f(R),i=f(A),u=f(B);return l.useEffect(()=>{c(M())},[r==null?void 0:r.uid]),u||n("/login",{replace:!0}),g("div",{className:w(k.Chats,"container"),children:[e(te,{}),i?e(oe,{chatsData:i}):e("p",{children:"Немає розмов"})]})},ue=le;export{ue as default};