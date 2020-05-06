// client-side js
// run by the browser each time your view template is loaded

(async function(d, mbGL) {
  let pieData = await fetchPies();
  let claimed = pieData.claimed;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;

  mbGL.accessToken =
    "pk.eyJ1IjoicHdqYWJsb25za2kiLCJhIjoiY2s5dW5wdnh0MDBzYTNtbHFtZWRtbmw3YSJ9.eHxCyVJuJmXzblybi0S9_w";
  
  const map = new mbGL.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [127, 38],
    zoom: 4.45,
  });
  
  map.addSource('some id', {
   type: 'image',
   url: 'https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fchocopie-small.png?v=1588725461413',
   coordinates: [
       [127, 38],
       [128, 38],
       [127, 37],
       [128, 37]
   ]
});


  drawData(total, claimed);

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    return resp;
  }

  function drawData(total, claimed) {
    const totalDiv = document.querySelector("#totalPies");
    const claimedDiv = document.querySelector("#piesClaimed");
    const moneyDiv = document.querySelector("#moneyRaised");
    totalDiv.innerHTML = total;
    claimedDiv.innerHTML = claimed;
    moneyDiv.innerHTML = `$ ${claimed}`;
  }

  d.addEventListener("click", function(e) {
    if (e.target.dataset.toggle == "modal") {
      let modal = document.querySelector(e.target.dataset.target);
      modal.style.display = "block";
    }
    if (e.target.dataset.dismiss == "modal") {
      let modals = document.querySelectorAll(".modal");
      modals.forEach(function(modal) {
        modal.style.display = "none";
      });
    }
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
    if (e.target.classList.contains("pie")) {
      selectedPieId = e.target.id;
    }
  });

  async function sendPie(pieId, data) {
    const req = await fetch("/pies", {
      method: "post",
      body: JSON.stringify({ pieId, data }),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await req.json();
    return resp;
  }

  document.addEventListener("submit", async function(e) {
    e.preventDefault();
    const data = {};
    data.senderName = e.target[0].value;
    data.senderEmail = e.target[1].value;
    data.recipientName = e.target[2].value;
    data.recipientEmail = e.target[3].value;
    data.message = e.target[4].value;
    data.signUp = e.target[5].checked;

    await sendPie(selectedPieId, data);
    let pieRect = document.getElementById(selectedPieId);
    claimed += 1;
    drawData(total, claimed);
  });
})(document, mapboxgl);
