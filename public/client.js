// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3, k) {
  const pies = await fetchPies();
  displayPies(pies);

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

  function displayPies(pies) {
    // const map = document.querySelector(".map-svg");
    // pies.forEach(pie => {
    //   const pieRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    //   pieRect.dataset.id = pie.id
    //   pieRect.classList.add("pie")
    //   pieRect.setAttribute("height", "10");
    //   pieRect.setAttribute("width", "10")
    //   pieRect.style.fill = "red"
    //   map.appendChild(pieRect)
    // })
  }
  
  function drawMap(response) {
    const map = document.querySelector(".map-svg");
    response.pixels.forEach((pixel, i) => {
      const pixelRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      pixelRect.classList.add("pie")
      pixelRect.setAttribute("height", "5");
      pixelRect.setAttribute("width", "5")
      if(pixel){
        pixelRect.style.fill = "red"
      }
      pixelRect.setAttribute("x", 5 * pixel.x)
      pixelRect.setAttribute("y", 5 * pixel.y)
      pixelRect.dataset.x = pixel.x
      pixelRect.dataset.y = pixel.y
      map.appendChild(pixelRect)
    })
  }
  
  const response = await fetchPixels();
  drawMap(response)
  
})(document);
