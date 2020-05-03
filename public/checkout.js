(async function(d) {
  const pieId = window.location.pathname.split('/')[2]
  
  async function sendPie(pieId) {
    const req = await fetch("/pies", {method: "post",     body: JSON.stringify({ data: date }),
    headers: { "Content-Type": "application/json" }});
    const resp = await req.json();
    return resp;
  }

  document.addEventListener("submit", function(e) {
    e.preventDefault();
    sendPie(pieId)
  });
  
})(document);