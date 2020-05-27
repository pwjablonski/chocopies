// client-side js
// run by the browser each time your view template is loaded

(async function(d, L, d3) {
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

  const mainPiesLayerGroup = L.featureGroup();
  const zoomPiesLayerGroup = L.layerGroup();

  let mymap = L.map("main-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 130]],
    maxZoom: 6,
    minZoom: 6,
    dragging: false
  }).setView([38, 127], 6);

  let zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 134]],
    maxZoom: 11,
    minZoom: 11
  }).setView([38, 127], 11);

  mymap.getPane("mapPane").style.zIndex = 0;

  mainPiesLayerGroup.addTo(mymap);
  mainPiesLayerGroup.on("click", function(e) {
    console.log(e);
  });

  zoomPiesLayerGroup.addTo(zoommap);

  drawData(total, claimed);
  // addPiesToGroup(pies, mainPiesLayerGroup);
  // drawMap(pies)
  d3Map(pies)

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

  function xyToLatLng(x, y) {
    const yOff = 0.08;
    const xOff = 0.105;
    return [
      [43 - y * yOff, 124 + x * xOff],
      [43 - y * yOff - yOff, 124 + x * xOff + xOff]
    ];
  }

  function idToImageURL(id) {
    let imageURL;
    const idModFive = id % 5;

    if (idModFive === 0) {
      imageURL = EAT;
    } else if (idModFive == 1) {
      imageURL = UNITE;
    } else if (idModFive === 2) {
      imageURL = PEACE;
    } else if (idModFive === 3) {
      imageURL = SHARE;
    } else if (idModFive === 4) {
      imageURL = LOVE;
    }
    return imageURL;
  }

  
  function d3Map(pies) {
      console.log(d3)
  }
  
  
  
  function addPiesToGroup(pies, mainPiesLayerGroup) {
    pies.forEach(pie => {
      const imageBounds = xyToLatLng(pie.x, pie.y);
      const imageURL = idToImageURL(pie.id);
      // var svgElement = document.createElementNS(
      //   "http://www.w3.org/2000/svg",
      //   "svg"
      // );
      // svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      // svgElement.setAttribute("id", pie.id);
      // svgElement.setAttribute("viewBox", "0 0 150 100");
      // svgElement.innerHTML = `<image id=${pie.id} href=${imageURL} width="150" height="100"/>`;
      // var elMain = L.svgOverlay(svgElement, imageBounds, {
      //   interactive: true
      // }).addTo(mainPiesLayerGroup);
      const imageOverlay = L.imageOverlay(imageURL, imageBounds, {
        className: "pie map-svg-pie",
        interactive: true
      }).addTo(mainPiesLayerGroup);
    });
  }
  
  function drawMap(pies) {
    pies.forEach(pie => {
      let imageBounds = xyToLatLng(pie.x, pie.y);

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
        var elMain = L.svgOverlay(svgElement, imageBounds, {
          interactive: true
        }).addTo(mainPiesLayerGroup);

        elMain.on("click", function(e) {
          zoommap.panTo([e.latlng.lat + 0.1, e.latlng.lng - 0.3]);
          let modal = document.querySelector("#viewPies");
          modal.classList.add("is-active");
        });
        var svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("id", pie.id);
        svgElement.setAttribute("viewBox", "0 0 150 100");
        svgElement.innerHTML = `<image id=${pie.id} href=${imageUrl} width="150" height="100"/>`;
        var elZoom = L.svgOverlay(svgElement, imageBounds, {
          interactive: true
        }).addTo(zoommap);
        elZoom.on("click", function(e) {
          console.log(e);
          let modal = document.querySelector("#sendPie");
          modal.classList.add("is-active");
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

  d.addEventListener("click", function(e) {
    if (e.target.classList.contains("navbar-burger")) {
      console.log(e.target);
      let dropdown = document.querySelector(`#${e.target.dataset.target}`);
      if (e.target.classList.contains("is-active")) {
        e.target.classList.remove("is-active");
        dropdown.classList.remove("is-active");
      } else {
        e.target.classList.add("is-active");
        dropdown.classList.add("is-active");
      }
    }
    if (e.target.dataset.toggle == "modal") {
      let modal = document.querySelector(e.target.dataset.target);
      modal.classList.add("is-active");
    }
    if (e.target.classList.contains("modal-close")) {
      let modals = document.querySelectorAll(".modal");
      modals.forEach(function(modal) {
        modal.classList.remove("is-active");
      });
    }
    if (e.target.classList.contains("modal-background")) {
      e.target.classList.remove("is-active");
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
    modal.classList.add("is-active");
  });
})(document, L, d3);
