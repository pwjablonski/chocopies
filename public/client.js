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
    const map = document.querySelector(".map");
    pies.forEach(pie => {
      const pieDiv = document.createElement("div");
      pieDiv.dataset.id = pie.id
      pieDiv.classList.add("pie")
      pieDiv.style.height = "10px";
      pieDiv.style.width = "10px";
      pieDiv.style.background = "red"
      pieDiv.style.border = "1px solid black"
      map.appendChild(pieDiv)
    })
  }
  
  
  
})(document);