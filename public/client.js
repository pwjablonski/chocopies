// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3, k) {

  
  const pies = await fetchPies();
  const pixels = await fetchPixels();
  
  drawMap(pixels, pies)
  
  
  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    return resp;
  }
  
  async function fetchPixels() {
    const req = await fetch("korea.json");
    const resp = await req.json();
    return resp;
  }
  
  function drawMap(pixels, pies) {
    const map = document.querySelector(".map-svg");
    pixels.data.forEach((pixel, i) => {
      const y = Math.floor(i / pixels.width)
      const x = i % pixels.width
      const pixelRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      pixelRect.classList.add("pie")
      pixelRect.setAttribute("height", "5");
      pixelRect.setAttribute("width", "5")
      pixelRect.setAttribute("x", 5 * x)
      pixelRect.setAttribute("y", 5 * y)
      if(pixel){
        pixelRect.style.fill = "red"
        pixelRect.dataset.id = i
      } else{
        pixelRect.style.fill = "white"
      }
      map.appendChild(pixelRect)
    })
    
    pies.forEach((pie)=> {
      console.log(pie.fields)
    })
  }
  
})(document);
