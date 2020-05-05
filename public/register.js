(async function(d) {
//   const pieId = window.location.pathname.split("/")[2];

//   async function sendPie(pieId) {
//     const req = await fetch("/pies", {
//       method: "post",
//       body: JSON.stringify({ pieId }),
//       headers: { "Content-Type": "application/json" }
//     });
//     const resp = await req.json();
//     return resp;
//   }
  
  console.log(window.location.search)

  document.addEventListener("submit", function(e) {
    const name = e.target[0].value
    const email = e.target[0].value
    const signUp = e.target[0].checked
    
    // window.location.href = `/chocopie/${e.target.id}`;
    e.preventDefault();
  });
})(document);