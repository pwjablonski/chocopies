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

  let zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 134]],
    maxZoom: 11,
    minZoom: 11
  }).setView([38, 127], 8);

  drawData(total, claimed);
  drawMainMap(pies);
  let zoomOverlay;

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

  function zoomPieClicked(e) {
    let modal = document.querySelector("#sendPie");
    modal.classList.add("is-active");
    selectedPieId = e.id;
    let pieImgSend = document.querySelector(".share_choco");
    let pieImgShare = document.querySelector(".send_choco");
    pieImgSend.src = idToImageURL(e.id);
    pieImgShare.src = idToImageURL(e.id);
    zoomOverlay.remove();
  }

  function mainPieClicked(e) {
    console.log(e);
    let modal = document.querySelector("#viewPies");
    modal.classList.add("is-active");
    zoommap.invalidateSize();
    zoommap.panTo([e.lat, e.lng]);
    zoomOverlay = d3Map(pies, zoommap, "zoom-map", zoomPieClicked);
  }

  function drawMainMap() {
    
    const svg = d3.select("#main-map")
      .select("svg")
      .select("g")
    
    const pieRects = svg.selectAll(".pie")
      .data(pies)
      .enter()
    
    pieRects.append("image")
      .filter(function(d){return !d.isClaimed })
        .attr("id", d => d.id)
        .attr("href", function(d) {
          return idToImageURL(d.id);
        })
        .attr("width", "1")
        .attr("height", "1")
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        })
        .on("click", mainPieClicked);
    
    pieRects.append("rect")
      .filter(function(d){return d.isClaimed })
        .attr("id", d => d.id)
        .attr("width", "1")
        .attr("height", "1")
        .attr("x", function(d) {
          return d.x;
        })
        .attr("y", function(d) {
          return d.y;
        })

  }

  function d3Map(pies, map, mapname, onPieClick) {
    const svg = L.svg().addTo(map);

    d3.selectAll("svg").attr("pointer-events", "all");

    const pieRects = d3.select(`#${mapname}`)
      .select("svg")
      .select("g")
      .selectAll('.pie')
      .data(pies)
      .enter()
    
    
    pieRects.append("image")
      .filter(function(d){return !d.isClaimed })
        .attr("id", d => d.id)
        .attr("href", function(d) {
          return idToImageURL(d.id);
        })
        .attr("width", function(d) {
          return (
            map.latLngToLayerPoint([d.lat - 0.08, d.lng + 0.105]).x -
            map.latLngToLayerPoint([d.lat, d.lng]).x
          );
        })
        .attr("height", function(d) {
          return (
            map.latLngToLayerPoint([d.lat - 0.08, d.lng + 0.105]).y -
            map.latLngToLayerPoint([d.lat, d.lng]).y
          );
        })
        .attr("x", function(d) {
          return map.latLngToLayerPoint([d.lat, d.lng]).x;
        })
        .attr("y", function(d) {
          return map.latLngToLayerPoint([d.lat, d.lng]).y;
        })
        .on("dblclick", function(e) {
          onPieClick(e);
        });
    
    pieRects.append("rect")
      .filter(function(d){return d.isClaimed })
          .attr("id", d => d.id)
          .attr("width", function(d) {
            return (
              map.latLngToLayerPoint([d.lat - 0.08, d.lng + 0.105]).x -
              map.latLngToLayerPoint([d.lat, d.lng]).x
            );
          })
          .attr("height", function(d) {
            return (
              map.latLngToLayerPoint([d.lat - 0.08, d.lng + 0.105]).y -
              map.latLngToLayerPoint([d.lat, d.lng]).y
            );
          })
          .attr("x", function(d) {
            return map.latLngToLayerPoint([d.lat, d.lng]).x;
          })
          .attr("y", function(d) {
            return map.latLngToLayerPoint([d.lat, d.lng]).y;
          })

    return svg;
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
      if (zoomOverlay) {
        zoomOverlay.remove();
      }
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
    
    // d3.select(`#${selectedPieId}`)
    //   .append("rect")
    //   .attr("x", "inherit")
    //   .attr("y", "inherit")
    
    
    claimed += 1;
    drawData(total, claimed);
    let modal = document.querySelector("#confirmation");
    modal.classList.add("is-active");
  });
})(document, L, d3);
