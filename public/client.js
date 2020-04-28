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
  
  function drawMap(pixels) {
    const map = document.querySelector(".map-svg");
    pixels.forEach(pixel => {
      const pixelRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      pixelRect.classList.add("pie")
      pixelRect.setAttribute("height", "10");
      pixelRect.setAttribute("width", "10")
      pixelRect.style.fill = `rgb(${pixel.r},${pixel.g},${pixel.b})`
      pixelRect.setAttribute("x", 10 * pixel.x)
      pixelRect.setAttribute("y", 10 * pixel.y)

      map.appendChild(pixelRect)
    })
  }
  
  const pixels = await fetchPixels();
  drawMap(pixels.data)
  
})(document);
