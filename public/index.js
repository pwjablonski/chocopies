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
      pieRect.setAttribute("height", "0.98");
      pieRect.setAttribute("width", "0.98");
      pieRect.setAttribute("x", 1 * pie.x);
      pieRect.setAttribute("y", 1 * pie.y);
      pieRect.id = pie.id;
      pieGroup.appendChild(pieRect);
      mapgroup.appendChild(pieGroup);

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
    if (e.target.classList.contains("map-svg-pie")) {
      let modal = document.querySelector("#viewPies");
      modal.style.display = "block";
      selectedPieId = e.target.id;
      console.log(e.target.getAttribute('x'), e.target.getAttribute('y'))
      const panZoomInstance = sPZ(".zoom-map-svg", {
        maxZoom: 30,
      });
      panZoomInstance.fit();
      panZoomInstance.center();
      // panZoomInstance.zoom(30)
      console.log(panZoomInstance.getSizes())
      const sizes = panZoomInstance.getSizes()
      const zoomX = (sizes.width / sizes.viewBox.width) * e.target.getAttribute('x')
      const zoomY = (sizes.height / sizes.viewBox.height) * e.target.getAttribute('y')
      console.log(zoomX, zoomY)
      
      panZoomInstance.zoomAtPoint(20, {x: zoomX, y: zoomY})
      
      console.log(panZoomInstance.getSizes())

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
  });
})(document, svgPanZoom);
