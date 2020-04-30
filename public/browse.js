// client-side js
// run by the browser each time your view template is loaded

(async function(d,) {

  
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
    const map = document.querySelector(".map-svg")
    
    const mapgroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    pixels.data.forEach((pixel, i) => {
      const y = Math.floor(i / pixels.width)
      const x = i % pixels.width
      const pixelRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      const pixelGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      const pixelLink = document.createElementNS("http://www.w3.org/2000/svg", 'a');
      
      pixelLink.
      pixelRect.classList.add("pie")
      pixelRect.setAttribute("height", "0.98");
      pixelRect.setAttribute("width", "0.98")
      pixelRect.setAttribute("x", 1 * x)
      pixelRect.setAttribute("y", 1 * y)
      if(pixel){
        // pixelRect.style.fill = "red"
        // pixelRect.style.stroke = "red"
        pixelRect.id = i
      } else{
        // pixelRect.style.fill = "white"
        pixelRect.style.stroke = "white"
      }
      pixelGroup.appendChild(pixelRect)
      mapgroup.appendChild(pixelGroup)
    })
    
    mapgroup.setAttribute("transform", "scale(1)")
    map.appendChild(mapgroup)
    
    pies.forEach((pie)=> {
      const pixelRect = document.getElementById(`${pie.fields.location}`);
      const y = Math.floor(pie.fields.location / pixels.width)
      const x = pie.fields.location % pixels.width
      if(pixelRect){
        // pixelRect.style.fill = "blue"
        const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        const title = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        const name = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        const date = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        title.textContent = "SHARED BY"
        name.textContent = "PETER"
        date.textContent ="4-20-20"
        
        title.setAttribute("dy", "0em")
        title.setAttribute("x", (1 * x) + 0.5)
        name.setAttribute("dy", "2em")
        name.setAttribute("x", (1 * x) + 0.5)
        date.setAttribute("dy", "2em")
        date.setAttribute("x", (1 * x) + 0.5)

        text.style.fill = "white"
        text.setAttribute("x", (1 * x))
        text.setAttribute("y", (1 * y) + 0.3)
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("font-size", "0.005em")
        
        text.appendChild(title)
        text.appendChild(name)
        text.appendChild(date)
        
        pixelRect.style.fill = "#0080ff"
        pixelRect.parentElement.appendChild(text)
      }
    })
  }
  
})(document);
