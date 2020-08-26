(async function(d, L, d3) {
  if (location.protocol === "http:") {
    location.replace(window.location.href.replace("http:", "https:"));
  }

  const EAT =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-EAT.png?v=1593119005599";
  const UNITE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-UNITE.png?v=1593119006333";
  const SHARE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-SHARE.png?v=1593119006137";
  const PEACE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-PEACE.png?v=1593119005876";
  const LOVE =
    "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FEat-Chocopie-Together-Mina-Cheon-LOVE.png?v=1593119005767";

  let pieData = await fetchPies();
  let sent = pieData.sent;
  let eaten = pieData.eaten;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;
  let params = new URLSearchParams(document.location.search.substring(1));
  let pieID = params.get("pieID");
  let wasMoved = false;

  let zoommap = L.map("zoom-map", {
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[43, 124], [27, 134]],
    maxZoom: 11,
    minZoom: 11,
    tap: false
  }).setView([38, 127], 11);

  zoommap.on("move", function(e) {
    wasMoved = true;
  });

  zoommap.on("moveend", function(e) {
    wasMoved = false;
  });

  // L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //   maxZoom: 18,
  // }).addTo(zoommap);

  drawData(total, sent, eaten);
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
  

  function drawData(total, sent, eaten) {
    const totalDiv = document.querySelector("#totalPies");
    const sentDiv = document.querySelector("#piesSent");
    const moneyDiv = document.querySelector("#moneyRaised");
    totalDiv.innerHTML = total * 2;
    sentDiv.innerHTML = sent + eaten;
    moneyDiv.innerHTML = `$${sent + eaten}`;
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
    if (!wasMoved) {
      console.log("clicked");
      d3.selectAll(".selected").attr("class", "");
      let modal = document.querySelector("#sendPie");
      modal.classList.add("is-active");
      selectedPieId = e.id;
      let pieImgSend = document.querySelector(".share_choco");
      // let pieImgShare = document.querySelector(".send_choco");
      pieImgSend.src = idToImageURL(e.id);
      // pieImgShare.src = idToImageURL(e.id);
      zoomOverlay.remove();
    }
  }

  function mainPieClicked(e) {
    let modal = document.querySelector("#viewPies");
    modal.classList.add("is-active");
    zoommap.invalidateSize();
    zoommap.panTo([e.lat, e.lng]);
    zoomOverlay = d3Map(pies, zoommap, "zoom-map", zoomPieClicked);
  }

  function drawUneatenPies(uneatenPies) {
    uneatenPies
      .append("rect")
      .attr("class", "pie-rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", "none")
      .attr("stroke-width", "10");

    uneatenPies
      .append("image")
      .attr("class", "pie-image")
      .attr("height", "96%")
      .attr("width", "96%")
      .attr("x", "2%")
      .attr("y", "2%")
      .attr("href", function(d) {
        return idToImageURL(d.id);
      });
  }

  function drawEatenPies(eatenPies) {
    eatenPies
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("fill", "#000033")
      .attr("fill-opacity", "20%");

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
      .text(d => d.senderName);

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "1em")
      .text("&");

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "1em")
      .text(d => d.recipientName);

    eatPieText
      .append("tspan")
      .attr("x", "50%")
      .attr("dy", "1.5em")
      .text(d => {
        const date = new Date(d.updatedAt);
        return date.toLocaleDateString();
      });
  }

  function drawMainMap(pies) {
    const loading = d3.select(".main-map__loading").style("display", "none");

    const svg = d3
      .select("#main-map")
      .select("svg")
      .select("g")
      .html("");

    const pieGroups = svg
      .selectAll("g")
      .data(pies)
      .enter()
      .append("g")
      .attr("id", d => `pie-${d.id}`)
      .append("svg")
      .attr("class", "main-pie")
      .attr("width", "1")
      .attr("height", ".75")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y * 0.75;
      })
      .attr("cursor", "pointer")
      .on("click", mainPieClicked);

    const uneatenPies = pieGroups.filter(function(d) {
      return !d.sentAt;
    });

    const eatenPies = pieGroups.filter(function(d) {
      return d.sentAt;
    });

    drawUneatenPies(uneatenPies);
    drawEatenPies(eatenPies);
    drawIntroAnimation();
  }

  function drawIntroAnimation() {
    let i1 = document.createElement("div");
    let i2 = document.createElement("div");
    let i3 = document.createElement("div");
    i1.setAttribute("id", "div1");
    i2.setAttribute("id", "div2");
    i3.setAttribute("id", "div3");

    var p = document.getElementById("main-map");
    p.appendChild(i1);
    p.appendChild(i2);
    p.appendChild(i3);
  }

  function d3Map(pies, map, mapname, onPieClick) {
    const svg = L.svg().addTo(map);

    d3.selectAll("svg").attr("pointer-events", "all");

    const pieGroups = d3
      .select(`#${mapname}`)
      .select("svg")
      .attr("id", "zoom-map-svg")
      .select("g")
      .selectAll("g")
      .data(pies)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("id", d => `pie-${d.id}`)
      .attr("class", "pie-group")
      .append("svg")
      .attr("height", "90")
      .attr("width", "140")
      .attr("x", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).x;
      })
      .attr("y", function(d) {
        return map.latLngToLayerPoint([d.lat, d.lng]).y;
      });

    const uneatenPies = pieGroups
      .filter(function(d) {
        return !d.sentAt;
      })
      .on("mouseup", onPieClick);

    const eatenPies = pieGroups.filter(function(d) {
      return d.sentAt;
    });

    drawUneatenPies(uneatenPies);
    drawEatenPies(eatenPies);

    return svg;
  }

  d.addEventListener("click", function(e) {
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

  d.addEventListener('invalid', (e)=>{
    
  })
  
  
  const form = d.querySelector(".checkout__form")
  form.addEventListener("submit", async function(e) {
    console.log(e);
    e.preventDefault();
    const data = {};
    data.senderName = e.target[0].value;
    data.senderEmail = e.target[1].value;
    data.recipientName = e.target[2].value;
    data.recipientEmail = e.target[3].value;
    data.message = e.target[4].value;
    data.subscribedSender = e.target[5].checked;
    data.sentAt = new Date();

    e.target[6].disabled = true;
    e.target[6].value = "Sending your Chocopie...";
    // const sendingIcon = d.querySelector(".form__sending-icon");
    // sendingIcon.classList.remove("hidden");

    const response = await sendPie(selectedPieId, data);
    console.log("test");
    e.target[6].disabled = false;
    e.target[6].value = "Send";
    // sendingIcon.classList.add("hidden");

    if (response.error) {
      let senderEmailHelp = document.querySelector(".sender-email .help");
      senderEmailHelp.innerHTML = response.error.message;
    } else {
      sent += 1;
      drawData(total, sent, eaten);
      let modal = document.querySelector("#confirmation");
      modal.classList.add("is-active");

      pies[selectedPieId - 1].senderName = e.target[0].value;
      pies[selectedPieId - 1].senderEmail = e.target[1].value;
      pies[selectedPieId - 1].recipientName = e.target[2].value;
      pies[selectedPieId - 1].recipientEmail = e.target[3].value;
      pies[selectedPieId - 1].message = e.target[4].value;
      pies[selectedPieId - 1].subscribedSender = e.target[5].checked;
      pies[selectedPieId - 1].sentAt = new Date();
      console.log(selectedPieId);
      const mainMapPie = d3
        .select("#main-map")
        .select("svg")
        .select("g")
        .select(`#pie-${selectedPieId}`)
        .select("svg");

      mainMapPie.selectAll("*").remove();

      drawEatenPies(mainMapPie);
    }

    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
    e.target[3].value = "";
    e.target[4].value = "";
    e.target[5].checked = false;
  });
})(document, L, d3);
