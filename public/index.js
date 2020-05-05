// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  let pieData = await fetchPies();
  let selectedPieId = null;

  drawData(pieData.total, pieData.claimed);
  drawMap(pieData.pies);

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
    const map = document.querySelector(".map-svg");

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
      pieRect.setAttribute("height", "0.98");
      pieRect.setAttribute("width", "0.98");
      pieRect.setAttribute("x", 1 * pie.x);
      pieRect.setAttribute("y", 1 * pie.y);
      pieRect.id = pie.id;
      pieGroup.appendChild(pieRect);
      mapgroup.appendChild(pieGroup);

      if (pie.isClaimed) {
        // pixelRect.style.fill = "blue"
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
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
        title.setAttribute("x", 1 * pie.x + 0.5);
        name.setAttribute("dy", "2em");
        name.setAttribute("x", 1 * pie.x + 0.5);
        date.setAttribute("dy", "2em");
        date.setAttribute("x", 1 * pie.x + 0.5);

        text.style.fill = "white";
        text.setAttribute("x", 1 * pie.x);
        text.setAttribute("y", 1 * pie.y + 0.3);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "0.005em");

        text.appendChild(title);
        text.appendChild(name);
        text.appendChild(date);

        pieRect.style.fill = "#0080ff";
        pieRect.parentElement.appendChild(text);
      } else {
        pieRect.dataset.toggle = "modal";
        pieRect.dataset.target = "#sendPie";
      }
    });

    mapgroup.setAttribute("transform", "scale(1)");
    map.appendChild(mapgroup);
  }

  d.addEventListener("click", function(e) {
    console.log(e);
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

  async function sendPie(pieId) {
    const req = await fetch("/pies", {
      method: "post",
      body: JSON.stringify({ pieId }),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await req.json();
    return resp;
  }

  document.addEventListener("submit", async function(e) {
    e.preventDefault();

    const pie = await sendPie(selectedPieId);
    console.log(pie)
    console.log(pie)
    let pieRect = document.querySelectorAll(`#${selectedPieId}`);
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
    title.setAttribute("x", 1 * pie.x + 0.5);
    name.setAttribute("dy", "2em");
    name.setAttribute("x", 1 * pie.x + 0.5);
    date.setAttribute("dy", "2em");
    date.setAttribute("x", 1 * pie.x + 0.5);

    text.style.fill = "white";
    text.setAttribute("x", 1 * pie.x);
    text.setAttribute("y", 1 * pie.y + 0.3);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "0.005em");

    text.appendChild(title);
    text.appendChild(name);
    text.appendChild(date);

    pieRect.style.fill = "#0080ff";
    pieRect.parentElement.appendChild(text);
  });
})(document);
