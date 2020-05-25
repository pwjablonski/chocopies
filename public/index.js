// client-side js
// run by the browser each time your view template is loaded

(async function(d, L) {
  const EAT =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590353733200";
  const UNITE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590357736162";
  const SHARE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590357768554";
  const PEACE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590357805566";
  const LOVE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590357838973";

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

  mymap.getPane("mapPane").style.zIndex = 0;

  var zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 134]],
    maxZoom: 11,
    minZoom: 11
  }).setView([38, 127], 11);
  
//   var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
//   var osmAttrib='Map data &copy; OpenStreetMap contributors';
		
//   //Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
//   var osm2 = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 4, attribution: osmAttrib });
//   var miniMap = new L.Control.MiniMap(osm2, {zoomLevelFixed: 6, toggleDisplay: true}).addTo(zoommap);

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

      if (pie.isClaimed) {
        var svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("viewBox", "0 0 150 100");
        svgElement.innerHTML = `<rect width=150 height=100 style="fill:#0013ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">TEXT</text>`;
        L.svgOverlay(svgElement, imageBounds).addTo(mymap);
        var svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("viewBox", "0 0 150 100");
        svgElement.innerHTML = `<rect width=150 height=100 style="fill:#0013ff"/> <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="fill:#FFF">TEXT</text>`;
        L.svgOverlay(svgElement, imageBounds).addTo(zoommap);
      } else {
        let imageUrl;
        const idModFive = pie.id % 5;

        if (idModFive === 0) {
          imageUrl = EAT;
        } else if (idModFive == 1) {
          imageUrl = UNITE;
        } else if (idModFive === 2) {
          imageUrl = PEACE;
        } else if (idModFive === 3) {
          imageUrl = SHARE;
        } else if (idModFive === 4) {
          imageUrl = LOVE;
        }

        //       L.imageOverlay(imageUrl, imageBounds, {
        //         className: "pie map-svg-pie"
        //       }).addTo(mymap);

        //       L.imageOverlay(imageUrl, imageBounds, {
        //         className: "pie map-svg-pie", id: pie.id
        //       }).addTo(zoommap);

        var svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("id", pie.id);
        svgElement.setAttribute("viewBox", "0 0 150 100");
        svgElement.innerHTML = `<image id=${pie.id} href=${imageUrl} width="150" height="100"/>`;
        L.svgOverlay(svgElement, imageBounds).addTo(mymap);

        var svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("id", pie.id);
        svgElement.setAttribute("viewBox", "0 0 150 100");
        svgElement.innerHTML = `<image id=${pie.id} href=${imageUrl} width="150" height="100"/>`;
        var el = L.svgOverlay(svgElement, imageBounds, {
          interactive: true
        }).addTo(zoommap);
        el.on("click", function(e) {
          let modal = document.querySelector("#sendPie");
          modal.style.display = "block";
          selectedPieId = pie.id;
          let pieImgSend = document.querySelector(".share_choco");
          let pieImgShare = document.querySelector(".send_choco");

          const idModFive = selectedPieId % 5;
          if (idModFive === 0) {
            pieImgSend.src = EAT;
            pieImgShare.src = EAT;
          } else if (idModFive == 1) {
            pieImgSend.src = UNITE;
            pieImgShare.src = UNITE;
          } else if (idModFive === 2) {
            pieImgSend.src = PEACE;
            pieImgShare.src = PEACE;
          } else if (idModFive === 3) {
            pieImgSend.src = SHARE;
            pieImgShare.src = SHARE;
          } else if (idModFive === 4) {
            pieImgSend.src = LOVE;
            pieImgShare.src = LOVE;
          }
        });
      }
    });
  }

  mymap.on("click", function(e) {
    zoommap.panTo(e.latlng);
    let modal = document.querySelector("#viewPies");
    modal.style.display = "block";
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
})(document, L);
