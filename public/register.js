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
  

  document.addEventListener("submit", function(e) {
    const name = e.target[0].value
    const email = e.target[0].value
    const signUp = e.target[0].checked
    const pieId = sessionStorage.getItem("pieId");
    window.location.href = `/chocopie/${pieId}`;
    e.preventDefault();
  });
})(document);