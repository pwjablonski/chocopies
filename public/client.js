// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  
  const pies = await fetchPies();
  displayPies(pies)
  
  async function fetchPies(){
    const req = await fetch('/pies')
    const resp = await req.json()
    return resp
  }
  
  function displayPies(pies){
    const map = document.querySelector(".map");
    pies.forEach(pie => {
      const pieDiv = document.createElement("div");
      map.appendChild(pieDiv)
    })
  }
  
  
  
})(document);