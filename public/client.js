// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3, k) {

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    return resp;
  }
  
  async function fetchPixels() {
    const req = await fetch("/pixels");
    const resp = await req.json();
    return resp;
  }
  
  function drawMap(pixels) {
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
  }
  
  const pies = await fetchPies();
  const pixels = await fetchPixels();
  console.log(pies)
  drawMap(pixels, pies)
  
})(document);
