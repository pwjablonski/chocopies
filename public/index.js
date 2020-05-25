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
    maxZoom: 10,
    minZoom: 6,
    dragging: false
  }).setView([38, 127], 6);
  
  console.log(mymap.getPanes())
  mymap.getPane('mapPane').style.zIndex = 0;

  var zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 130]],
    maxZoom: 10,
    minZoom: 10
  }).setView([38, 127], 10);

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
    pies.forEach(pie => {
      let yOff = 0.08;
      let xOff = 0.105;

      let imageBounds = [
        [43 - pie.y * yOff, 124 + pie.x * xOff],
        [43 - pie.y * yOff - yOff, 124 + pie.x * xOff + xOff]
      ];
//       let imageUrl;
//       const idModFive = pie.id % 5;

//       if (idModFive === 0) {
//         imageUrl =
//           "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590353733200";
//       } else if (idModFive == 1) {
//         imageUrl =
//           "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590357736162";
//       } else if (idModFive === 2) {
//         imageUrl =
//           "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590357805566";
//       } else if (idModFive === 3) {
//         imageUrl =
//           "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590357768554";
//       } else if (idModFive === 4) {
//         imageUrl =
//           "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590357838973";
//       }

//       L.imageOverlay(imageUrl, imageBounds, {
//         className: "pie map-svg-pie"
//       }).addTo(mymap);

//       L.imageOverlay(imageUrl, imageBounds, {
//         className: "pie map-svg-pie", id: pie.id
//       }).addTo(zoommap);
      
      var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
      svgElement.setAttribute('viewBox', "0 0 200 200");
      svgElement.innerHTML = '<image href="https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590353733200"/>';
      // var svgElementBounds = [ [ 32, -130 ], [ 13, -100 ] ];
      L.svgOverlay(svgElement, imageBounds).addTo(mymap);
    });
  }

  mymap.on("click", function(e) {
    zoommap.panTo(e.latlng);
    let modal = document.querySelector("#viewPies");
    modal.style.display = "block";
  });

  zoommap.on("dblclick", function(e) {
    console.log(e);
    selectedPieId = e.target.id;

    let modal = document.querySelector("#sendPie");
    modal.style.display = "block";
    selectedPieId = e.target.id;
    let pieImgSend = document.querySelector(".share_choco");
    let pieImgShare = document.querySelector(".send_choco");

    // const idModFive = selectedPieId % 5;
    // if (idModFive === 0) {
    //   pieImgSend.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590350234801";
    //   pieImgShare.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590350234801";
    // } else if (idModFive == 1) {
    //   pieImgSend.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590350235533";
    //   pieImgShare.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590350235533";
    // } else if (idModFive === 2) {
    //   pieImgSend.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590350237318";
    //   pieImgShare.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590350237318";
    // } else if (idModFive === 3) {
    //   pieImgSend.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590350242771";
    //   pieImgShare.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590350242771";
    // } else if (idModFive === 4) {
    //   pieImgSend.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590350247939";
    //   pieImgShare.src =
    //     "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590350247939";
    // }
  });

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
