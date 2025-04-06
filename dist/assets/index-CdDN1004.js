(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const o=document.getElementById("section");let s=1;const l=["What kind of product are you looking for today"],p=`<button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>`;document.body.addEventListener("click",async r=>{switch(r.target.id){case"enter":const i=document.querySelector("input");i.value&&f(i);break;case"go-back":await(await fetch("/del")).json(),o.removeChild(document.getElementById(`${s}`)),s--,document.getElementById(`${s}`).innerHTML=`
    <h2>${l[s-1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container" ${s>1?'style="justify-content: center;"':""}/>  
        ${s>1?p:'<button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>'}
        </div> 

    `;break;case"start-over":await(await fetch("/startOver")).json(),window.location.reload()}});window.addEventListener("load",async r=>{await fetch("/startOver")});document.body.addEventListener("keydown",async r=>{const i=document.querySelector("input");r.key==="Enter"&&i.value&&f(i)});async function f(r){document.getElementById(`${s}`).innerHTML=`
  <h2 class="newRes">${l[s-1]}</h2>
 <div class="msg"><p>You: ${r.value}</p></div>
  `,s++,o.innerHTML+=`
   <div class="input-container" id=${s}>
        <h2>Thinking...</h2>
    </div>
  `;const n=(await(await fetch(`/api?q=${r.value}`)).json()).response.split("|");if(n.length>1){const e=document.getElementById(`${s}`);if(l.push(n[1]),n[2].toUpperCase()!=="FALSE"){const t=JSON.parse(n[2].split("/~")[1]),a={title:t.best.title,link:t.best.product_link,pic:t.best.thumbnail,source:t.best.source,price:t.best.price,rating:t.best.rating},d={title:t.cheapest.title,link:t.cheapest.product_link,pic:t.cheapest.thumbnail,source:t.cheapest.source,price:t.cheapest.price,rating:t.cheapest.rating};if(n[0].toUpperCase()==="FALSE"){e.innerHTML=`
     ${u([a,d])}
      <h2>${n[1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
     `;return}else{e.innerHTML=`
      <h2>${n[1]}</h2>
     ${u([a,d])}
       <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        </div> 
     `;return}}e.innerHTML=`
   <h2>${n[1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
  
  `}else{o.removeChild(document.getElementById(`${s}`)),s--;const e=n[0];document.getElementById(`${s}`).innerHTML=`
   <h2>${e}</h2>
        <input type="text" id="input"/>
        
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
  `}b()}function u([r,i]){return`<div class="matches-container">
        <h3>Possible Matches</h3>
        <div class="matches">
         
        <div class="match">
       <a href="${r.link}" target="_blank">
        <h4>Best Match:</h4>
        <div id="img"><img src="${r.pic}"></div>
        
        <p class="match-title">Title: ${r.title}</p>
        <p>Price: ${r.price}</p>
        <p>Source: ${r.source}</p>
        ${r.rating?`<p>Rating: ${r.rating} <i class="fa-solid fa-star"></i></p>`:""} 
       </a>
        </div>
        
        
        <div class="match">
        <a href="${i.link}" target="_blank">
        <h4>Cheapest Match:</h4>
        <div id="img"><img src="${i.pic}"></div>
        <p class="match-title">Title: ${i.title}</p>
        <p>Price: ${i.price}</p>
        <p>Source: ${i.source}</p>
        ${i.rating?`<p>Rating: ${i.rating} <i class="fa-solid fa-star"></i></p>`:""} 
        </a>
        </div>
        
        </div>
        </div> `}function b(){requestAnimationFrame(()=>{o.scrollTo({top:o.scrollHeight,behavior:"smooth"})})}
