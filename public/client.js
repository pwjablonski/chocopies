// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  
  const pies = await fetchPies();
  displayPies(pies)
  
  async function fetchPies(){
    const req = await fetch('/pies')
    const resp = await req.json()
    console.log(resp)
    return resp
  }
  
  function displayPies(pies){
    const map = document.querySelector(".map-svg");
    pies.forEach(pie => {
      const pieRect = document.createElement("rect");
      pieRect.dataset.id = pie.id
      pieRect.classList.add("pie")
      pieRect.style.height = "10px";
      pieRect.style.width = "10px";
      pieRect.style.fill = "red"
      pieRect.style.border = "1px solid black"
      map.appendChild(pieRect)
    })
  }
  
  
  
})(document);