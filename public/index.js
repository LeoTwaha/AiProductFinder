const section = document.getElementById("section");
let question = 1;

const prompt = ["What kind of product are you looking for today"];
const buttonStr =  `<button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>`;
document.body.addEventListener("click", async(e) => {
  switch(e.target.id){
    case "enter":
      const input = document.querySelector(`input`);
      if(input.value){
      renderResponse(input);
      }
    break;
    case "go-back": 
    const res = await fetch(`/del`);
    const data = await res.json();
  
    section.removeChild(document.getElementById(`${question}`));
    question--;
    document.getElementById(`${question}`).innerHTML = `
    <h2>${prompt[question - 1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container" ${question > 1 ? `style="justify-content: center;"`: ""}/>  
        ${question > 1 ? buttonStr : `<button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>`}
        </div> 

    `
    break;
    case "start-over":
      const req = await fetch(`/startOver`);
      const reqData = await req.json();
      window.location.reload();
  }
});
window.addEventListener("load", async(event) => {
  const req = await fetch(`/startOver`);
 
});
document.body.addEventListener("keydown", async (e) => {
  const input = document.querySelector(`input`);
  if (e.key === "Enter" && input.value) {
    renderResponse(input);
  }
});
async function renderResponse(input){
 
  document.getElementById(`${question}`).innerHTML = `
  <h2 class="newRes">${prompt[question - 1]}</h2>
 <div class="msg"><p>You: ${input.value}</p></div>
  `;
 
question++;

section.innerHTML += `
   <div class="input-container" id=${question}>
        <h2>Thinking...</h2>
    </div>
  `;
const res = await fetch(`/api?q=${input.value}`);
const aiRes = await res.json();
const resArr = aiRes.response.split("|");

if (resArr.length > 1) {
  const lastQuestion = document.getElementById(`${question}`);
  prompt.push(resArr[1]);
 
  if (resArr[2].toUpperCase() !== "FALSE") {
   
    const items = JSON.parse(resArr[2].split("/~")[1]);
    const bestItem = {
      title: items.best.title,
      link: items.best.product_link,
      pic: items.best.thumbnail,
      source: items.best.source,
      price: items.best.price,
      rating: items.best.rating,
    };
    const cheapestItem = {
      title: items.cheapest.title,
      link: items.cheapest.product_link,
      pic: items.cheapest.thumbnail,
      source: items.cheapest.source,
      price: items.cheapest.price,
      rating: items.cheapest.rating,
    };
    if (resArr[0].toUpperCase() === "FALSE") {
      lastQuestion.innerHTML = `
     ${getMatchHtml([bestItem, cheapestItem])}
      <h2>${resArr[1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
     `;
      return;
    } else {
      lastQuestion.innerHTML = `
      <h2>${resArr[1]}</h2>
     ${getMatchHtml([bestItem, cheapestItem])}
       <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        </div> 
     `;
      return;
    }
  }

  lastQuestion.innerHTML = `
   <h2>${resArr[1]}</h2>
        <input type="text" id="input"/>
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
  
  `;
} else {
  section.removeChild(document.getElementById(`${question}`));
  question--;
  const errMsg = resArr[0];

  document.getElementById(`${question}`).innerHTML = `
   <h2>${errMsg}</h2>
        <input type="text" id="input"/>
        
        <div id="btn-container">     
        <button id="go-back" class="btns arrow"><i class="fa-solid fa-arrow-left"></i> Go Back</button>
        <button id="start-over" class="btns"><i class="fa-solid fa-arrow-rotate-left"></i> Start Over</button>
        <button id="enter" class="btns arrow">Enter <i class="fa-solid fa-arrow-right"></i></button>
        </div> 
  `;
}
scrollToBottom();
}
function getMatchHtml([best, cheapest]) {
  return `<div class="matches-container">
        <h3>Possible Matches</h3>
        <div class="matches">
         
        <div class="match">
       <a href="${best.link}" target="_blank">
        <h4>Best Match:</h4>
        <div id="img"><img src="${best.pic}"></div>
        
        <p class="match-title">Title: ${best.title}</p>
        <p>Price: ${best.price}</p>
        <p>Source: ${best.source}</p>
        ${best.rating ?  `<p>Rating: ${best.rating} <i class="fa-solid fa-star"></i></p>` : ""} 
       </a>
        </div>
        
        
        <div class="match">
        <a href="${cheapest.link}" target="_blank">
        <h4>Cheapest Match:</h4>
        <div id="img"><img src="${cheapest.pic}"></div>
        <p class="match-title">Title: ${cheapest.title}</p>
        <p>Price: ${cheapest.price}</p>
        <p>Source: ${cheapest.source}</p>
        ${cheapest.rating ?  `<p>Rating: ${cheapest.rating} <i class="fa-solid fa-star"></i></p>` : ""} 
        </a>
        </div>
        
        </div>
        </div> `;
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        section.scrollTo({
            top: section.scrollHeight,
            behavior: "smooth" // Smooth scrolling for better user experience
        });
    });
}
