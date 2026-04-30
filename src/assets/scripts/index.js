window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.classList.add('header-fixed');
  } else {
    header.classList.remove('header-fixed');
  }
});
const codeElement = document.getElementById("code");

const codeLines = [
`<span class="comment">// Inicializando XandA</span>\n`,
`<span class="keyword">import</span> { <span class="func">createProject</span> } <span class="keyword">from</span> <span class="string">"xanda"</span>\n\n`,
`<span class="keyword">const</span> app = <span class="func">createProject</span>({\n`,
`  <span class="property">name</span>: <span class="string">"MiWeb"</span>,\n`,
`  <span class="property">ui</span>: <span class="boolean">true</span>,\n`,
`  <span class="property">seo</span>: <span class="boolean">true</span>\n`,
`})\n\n`,
`app.<span class="func">deploy</span>()\n`
];

let fullText = "";
let currentText = "";
let index = 0;
let isDeleting = false;

function typeEffect(){

    // Construimos el texto completo SOLO UNA VEZ
    if(fullText === ""){
        fullText = codeLines.join("");
    }

    if(!isDeleting){
        currentText = fullText.substring(0, index++);
    } else {
        currentText = fullText.substring(0, index--);
    }

    codeElement.innerHTML = currentText;

    // Cuando termina de escribir
    if(index === fullText.length){
        isDeleting = true;
        setTimeout(typeEffect, 1500);
        return;
    }

    // Cuando termina de borrar
    if(index === 0){
        isDeleting = false;
    }

    setTimeout(typeEffect, isDeleting ? 8 : 18);
}

typeEffect();