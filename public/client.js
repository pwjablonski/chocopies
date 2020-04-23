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
      pieRect.height = "10";
      pieRect.width = "10";
      pieRect.style.fill = "red"
      map.appendChild(pieRect)
    })
  }
  
  
  
})(document);