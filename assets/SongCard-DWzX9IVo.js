import{r as i,j as a}from"./index-DOmLqKU3.js";function d({song:e}){var c;const[n,r]=i.useState(!1),[s,l]=i.useState(null);i.useEffect(()=>()=>{s&&(s.pause(),l(null))},[s,e]);const o=()=>{if(!e.preview_url){alert("No preview available for this song.");return}if(n)s.pause(),r(!1);else{const t=new Audio(e.preview_url);t.play(),l(t),r(!0)}};return a.jsxs("div",{className:`section-content-container ${n?"active":""}`,onClick:o,children:[a.jsx("div",{className:"content-image",children:a.jsx("img",{src:(c=e.album.images[0])==null?void 0:c.url,alt:e.name})}),a.jsxs("div",{className:"content-information",children:[a.jsx("div",{className:"content-song",children:e.name}),a.jsx("div",{className:"content-artist",children:e.artists.map(t=>t.name).join(", ")})]})]})}export{d as default};
