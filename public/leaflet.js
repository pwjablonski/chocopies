// client-side js
// run by the browser each time your view template is loaded

(async function(d, sPZ, L) {
  let pieData = await fetchPies();
  let claimed = pieData.claimed;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;

  var mymap = L.map("mapid", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 130]],
    maxZoom: 6,
    minZoom: 6,
    dragging: false
  }).setView([38, 127], 6);
  
  var zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 130]],
    maxZoom: 6,
    minZoom: 6,
  }).setView([38, 127], 6);

  // L.tileLayer(
  //   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  //   {
  //     attribution:
  //       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //     maxZoom: 18,
  //     id: "mapbox/streets-v11",
  //     tileSize: 512,
  //     zoomOffset: -1,
  //     accessToken:
  //       "pk.eyJ1IjoicHdqYWJsb25za2kiLCJhIjoiY2s5dW5wdnh0MDBzYTNtbHFtZWRtbmw3YSJ9.eHxCyVJuJmXzblybi0S9_w"
  //   }
  // ).addTo(mymap);

  drawData(total, claimed);
  drawMap(pies);

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

  function drawMap(pies) {
    //     var svgElement = document.createElementNS(
    //       "http://www.w3.org/2000/svg",
    //       "svg"
    //     );

    //     const mapgroup = document.createElementNS(
    //       "http://www.w3.org/2000/svg",
    //       "g"
    //     );

    pies.forEach(pie => {
      let yOff = 0.08;
      let xOff = 0.105;

      let imageBounds = [
        [43 - pie.y * yOff, 124 + pie.x * xOff],
        [43 - pie.y * yOff - yOff, 124 + pie.x * xOff + xOff]
      ];
      let imageUrl;
      const idModFive = pie.id % 5;

      if (idModFive === 0) {
        imageUrl =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590353733200";
      } else if (idModFive == 1) {
        imageUrl =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590357736162";
      } else if (idModFive === 2) {
        imageUrl =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590357805566";
      } else if (idModFive === 3) {
        imageUrl =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590357768554";
      } else if (idModFive === 4) {
        imageUrl =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590357838973";
      }

      L.imageOverlay(imageUrl, imageBounds, {
        className: "pie map-svg-pie"
      }).addTo(mymap);
      
      L.imageOverlay(imageUrl, imageBounds, {
        className: "pie map-svg-pie"
      }).addTo(zoommap);
    });
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

    if (e.target.id === "mapid") {
      console.log('test')
      let modal = document.querySelector("#viewPies");
      modal.style.display = "block";
    }
    console.log(e.target.id)
  });

  d.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("zoom-map-svg-pie")) {
      let modal = document.querySelector("#sendPie");
      modal.style.display = "block";
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
    // drawClaimedPie(pieRect);
    let modal = document.querySelector("#confirmation");
    modal.style.display = "block";
  });
})(document, svgPanZoom, L);
