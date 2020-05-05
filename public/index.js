// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  const { total, claimed, pies } = await fetchPies();

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
    const map = document.querySelector(".map-svg");

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    pies.forEach(pie => {
      const pieRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      pieRect.classList.add("pie");
      pieRect.setAttribute("height", "1");
      pieRect.setAttribute("width", "1");
      pieRect.setAttribute("x", pie.x);
      pieRect.setAttribute("y", pie.y);
      pieRect.id = pie.id;
      if (pie.isClaimed) {
        pieRect.style.fill = "blue";
        pieRect.style.stroke = "blue";
      } else {
        pieRect.style.stroke = "red";
      }
      group.appendChild(pieRect);
    });

    group.setAttribute("transform", "scale(1)");
    map.appendChild(group);
  }

  let modalBtn = document.getElementById("modal-btn");
  let modal = document.querySelector(".modal");
  let closeBtn = document.querySelector(".close-btn");
  d.addEventListener("click", function(e) {
    if (e.target.dataset.toggle == "modal") {
      let modal = document.querySelector(e.target.dataset.toggle);
    }
  });
})(document);
