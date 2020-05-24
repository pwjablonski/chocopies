// client-side js
// run by the browser each time your view template is loaded

(async function(d, sPZ) {
  let pieData = await fetchPies();
  let claimed = pieData.claimed;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;

  drawData(total, claimed);
  drawMap(pies, "map-svg");
  drawMap(pies, "zoom-map-svg");
  // drawMap(pies, "thumb-map-svg");

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

  function drawMap(pies, selector) {
    const map = document.querySelector(`.${selector}`);

    const mapgroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    pies.forEach(pie => {
      const pieRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      const pieGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );

      pieRect.classList.add("pie");
      pieRect.classList.add(`${selector}-pie`);
      pieRect.setAttribute("height", "1");
      pieRect.setAttribute("width", "1.25");
      pieRect.setAttribute("x", 1.5 * pie.x);
      pieRect.setAttribute("y", 1 * pie.y);
      pieRect.id = pie.id;
      pieGroup.appendChild(pieRect);
      mapgroup.appendChild(pieGroup);

      const idModFive = pie.id % 5;

      if (idModFive === 0) {
        pieRect.classList.add("eat");
      } else if (idModFive == 1) {
        pieRect.classList.add("unite");
      } else if (idModFive === 2) {
        pieRect.classList.add("love");
      } else if (idModFive === 3) {
        pieRect.classList.add("peace");
      } else if (idModFive === 4) {
        pieRect.classList.add("share");
      }

      if (pie.isClaimed) {
        drawClaimedPie(pieRect);
      } else {
        // pieRect.dataset.toggle = "modal";
        // pieRect.dataset.target = "#sendPie";
      }
    });

    map.appendChild(mapgroup);
  }

  function drawClaimedPie(pieRect) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const title = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    const name = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    const date = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    title.textContent = "SHARED BY";
    name.textContent = "PETER";
    date.textContent = "4-20-20";

    title.setAttribute("dy", "0em");
    title.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);
    name.setAttribute("dy", "2em");
    name.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);
    date.setAttribute("dy", "2em");
    date.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);

    text.style.fill = "white";
    text.setAttribute("x", 1 * pieRect.getAttribute("y"));
    text.setAttribute("y", 1 * pieRect.getAttribute("y") + 0.3);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "0.005em");

    text.appendChild(title);
    text.appendChild(name);
    text.appendChild(date);

    pieRect.style.filter = "none";
    pieRect.style.fill = "#0080ff";
    pieRect.parentElement.appendChild(text);
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

    // if (e.target.classList.contains("zoom-map-svg-pie")) {
    //   let modal = document.querySelector("#sendPie");
    //   modal.style.display = "block";
    //   selectedPieId = e.target.id;
    // }

    if (e.target.classList.contains("map-svg-pie")) {
      let modal = document.querySelector("#viewPies");
      modal.style.display = "block";
      const panZoomInstance = sPZ(".zoom-map-svg", {
        maxZoom: 40,
        zoomEnabled: false
      });

      const sizes = panZoomInstance.getSizes();
      const zoomX = sizes.width * (e.target.getAttribute("x") / 100);
      const zoomY = sizes.height * (e.target.getAttribute("y") / 125);

      panZoomInstance.zoomAtPoint(15, { x: zoomX + 15, y: zoomY +15});
    }
  });

  d.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("zoom-map-svg-pie")) {
      let modal = document.querySelector("#sendPie");
      modal.style.display = "block";
      selectedPieId = e.target.id;
      let pieImgSend = document.querySelector(".share_choco");
      let pieImgShare = document.querySelector(".send_choco");

      const idModFive = selectedPieId % 5;
      if (idModFive === 0) {
        pieImgSend.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590350234801";
        pieImgShare.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.08%20PM.png?v=1590350234801";
      } else if (idModFive == 1) {
        pieImgSend.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590350235533";
        pieImgShare.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.56.35%20PM.png?v=1590350235533";
      } else if (idModFive === 2) {
        pieImgSend.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590350237318";
        pieImgShare.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.03%20PM.png?v=1590350237318";
      } else if (idModFive === 3) {
        pieImgSend.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590350242771";
        pieImgShare.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.36%20PM.png?v=1590350242771";
      } else if (idModFive === 4) {
        pieImgSend.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590350247939";
        pieImgShare.src =
          "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-05-24%20at%202.55.48%20PM.png?v=1590350247939";
      }
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
    drawClaimedPie(pieRect);
    let modal = document.querySelector("#confirmation");
    modal.style.display = "block";
  });
})(document, svgPanZoom);
