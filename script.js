window.CP && (window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 60000);
let body = document.querySelector("body");
let myURL = "https://assets.codepen.io/1197275/worldMapTurq.svg";
var hidden = document.createElement('canvas');
var hiddenX = hidden.getContext('2d');

shuffle.onclick = ()=>{
  inputString.value = [...inputString.value].sort(()=>Math.random()-.5).join("")
  main()
}
darkMode.onclick = (ev) => {
  if(body.classList.contains('dark')) {    
    body.classList.remove("dark")
    ev.target.innerText = "🌛️"
  } else {
    ev.target.innerText = "🌞️"
    body.classList.add("dark")
  }
}
inputString.onchange = main
scale.onchange = main
pSize.onchange = main
image.addEventListener('change', main)
var img
main()

function main(ev) { 
  
  if(!img || image.files[0] != img.src) { 
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      hidden.width = img.naturalWidth
      hidden.height = img.naturalHeight
      hidden.getContext('2d').clearRect(0,0,hidden.width,hidden.height)
      hiddenX.drawImage(img, 0, 0);    
      buildGrid(img);
     }
    img.src = image.files[0] ? URL.createObjectURL(image.files[0]) : myURL;
  } else {
    buildGrid(img)
  }
  
}//end main

function buildGrid(img) {  

  const ROWS = Math.floor(img.naturalHeight / pSize.value);
  const COLS = Math.floor(img.naturalWidth / pSize.value);

  grid.innerHTML = ""
  grid.style.fontSize = Math.floor(parseInt(scale.value))+"px"

  let rez = ""
  let map = inputString.value.replace(/\s/g,"⠀")/*U+2800 invis Braille char works better than regular spaces on the web. (which is crazy, but it seems well supported, YMMV. todo:figure this out)*/
  for (let i = 0; i < ROWS * COLS; i++) {

    let row = Math.floor(i / COLS);
    let col = i % COLS;
    let buffer = hiddenX.getImageData(col * pSize.value, row * pSize.value, pSize.value, pSize.value);

    let blockSize = 4
    let rgb = { "r": 0, "g": 0, "b": 0 };
    let count = 0;let j = -4;
    while ((j += (blockSize)) < buffer.data.length) {
      ++count;
      rgb.r += buffer.data[j];
      rgb.g += buffer.data[j + 1];
      rgb.b += buffer.data[j + 2];
    }

    let aveBright = (rgb.r / count + rgb.g / count + rgb.b / count) / 3;
    let symbol = map[Math.floor(map.length*(aveBright/256))];  
    rez += symbol

  }//end for each pixel
  
  let reg = new RegExp(`.{${COLS}}`, "g");
  let withNewlines = rez.replace(reg,"$&\n");
  grid.innerText = withNewlines
  
}//end buildGrid