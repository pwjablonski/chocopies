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

  // const result = await d3.json("/pies")
  // console.log(result)
  let pieData = await fetchPies();
  let sent = pieData.sent;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;
  let params = new URLSearchParams(document.location.search.substring(1));
  let pieID = params.get("pieID");

  let zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 134]],
    maxZoom: 11,
    minZoom: 11
  }).setView([38, 127], 11);

  // L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //   maxZoom: 18,
  // }).addTo(zoommap);

  d3.json("/pies", function(pies) {
    console.log(pies);
  });

  drawData(total, sent);
  drawMainMap(pies);
  let zoomOverlay;

  if (pieID && pieID <= total && pieID > 0) {
    mainPieClicked(pies[pieID - 1]);
  }

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    return resp;
  }

  function drawData(total, sent) {
    const totalDiv = document.querySelector("#totalPies");
    const sentDiv = document.querySelector("#piesSent");
    const moneyDiv = document.querySelector("#moneyRaised");
    totalDiv.innerHTML = total;
    sentDiv.innerHTML = sent;
    moneyDiv.innerHTML = `$ ${sent}`;
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
    const loading = d3.select(".main-map__loading").style("display", "none");

    const svg = d3
      .select("#main-map")
      .select("svg")
      .select("g");

    const pieRects = svg
      .selectAll("g")
      .data(pies)
      .enter()
      .append("g")
      .attr("id", d => d.id)
      .attr("cursor", "pointer");

    const uneatenPies = pieRects
      .filter(function(d) {
        return !d.sentAt;
      })
      .append("image")
      .attr("id", d => d.id)
      .attr("href", function(d) {
        return idToImageURL(d.id);
      })
      .attr("width", "1")
      .attr("height", ".75")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y * 0.75;
      })
      .on("click", mainPieClicked);

    const eatenPies = pieRects
      .filter(function(d) {
        return d.sentAt;
      })
      .append("svg")
      .attr("id", d => d.id)
      .attr("width", "1")
      .attr("height", "0.75")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y * 0.75;
      })
      .on("click", mainPieClicked);

    eatenPies
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", "10");

    //     const eatPieText = eatenPies
    //       .append("text")
    //       .attr("y", "50%")
    //       .attr("x", "50%")
    //       .attr("dominant-baseline", "middle")
    //       .attr("text-anchor", "middle")
    //       .attr("fill", "white");

    //     eatPieText
    //       .append("tspan")
    //       .attr("x", "50%")
    //       .attr("dy", "-1.5em")
    //       .text("SHARED BY")

    //     eatPieText
    //       .append("tspan")
    //       .attr("x", "50%")
    //       .attr("dy", "1.5em")
  }

  function d3Map(pies, map, mapname, onPieClick) {
    const svg = L.svg().addTo(map);

    d3.selectAll("svg").attr("pointer-events", "all");

    const pieGroup = d3
      .select(`#${mapname}`)
      .select("svg")
      .select("g")
      .selectAll("g")
      .data(pies)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("id", d => d.id)
      .attr("class", "pie-group");

    const uneatenPies = pieGroup.filter(function(d) {
      return !d.sentAt;
    });

    uneatenPies
      .append("rect")
      .attr("class", "pie")
      .attr("height", "90")
      .attr("width", "140")
      .attr("x", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).x;
      })
      .attr("y", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).y;
      })
      .attr("fill", "none")
      // .attr("stroke", "none")
      .attr("stroke-width", "10")
      .attr("class", "pie-rect");

    uneatenPies
      .append("image")
      .attr("class", "pie-image")
      .attr("href", function(d) {
        return idToImageURL(d.id);
      })
      .attr("height", "90")
      .attr("width", "140")
      .attr("x", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).x;
      })
      .attr("y", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).y;
      })
      .on("dblclick", function(e) {
        onPieClick(e);
      })
      .on("touchend", function(e) {
        onPieClick(e);
      });

    const eatenPies = pieGroup
      .filter(function(d) {
        return d.sentAt;
      })
      .append("svg")
      .attr("height", "90")
      .attr("width", "140")
      .attr("x", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).x;
      })
      .attr("y", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).y;
      });

    eatenPies
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", "10");

    const eatPieText = eatenPies
      .append("text")
      .attr("y", "50%")
      .attr("x", "50%")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold");

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "-1.5em")
      .text("SHARED BY");

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "1.5em")
      .text(d => d.senderName);

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "1.5em")
      .text(d => {
        const date = new Date(d.updatedAt);
        return date.toLocaleDateString();
      });

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

    const response = await sendPie(selectedPieId, data);
    console.log(response.error.type);
    if (response.error.type) {
      console.log(response.error.type)
    } else {
      sent += 1;
      drawData(total, sent);
      let modal = document.querySelector("#confirmation");
      modal.classList.add("is-active");
    }
    // d3.select(`${selectedPieId}`)
    //   .html(""
  });
})(document, L, d3);
