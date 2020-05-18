// client-side js
// run by the browser each time your view template is loaded

(async function(d, sPZ, L) {
  let pieData = await fetchPies();
  let claimed = pieData.claimed;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;

  var mymap = L.map("mapid").setView([38, 127], 5);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoicHdqYWJsb25za2kiLCJhIjoiY2s5dW5wdnh0MDBzYTNtbHFtZWRtbmw3YSJ9.eHxCyVJuJmXzblybi0S9_w"
    }
  ).addTo(mymap);

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
    var svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    const mapgroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    pies.forEach(pie => {
      
      var imageUrl = 'https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fchocopie-small.png?v=1588725461413',
      imageBounds = [[42- (pie.y * 0.5), 123+ (pie.x * 0.5)], [42- (pie.y * 0.5)- 0.5, 123 + (pie.x * 0.5)+0.5]];
      L.imageOverlay(imageUrl, imageBounds).addTo(mymap);
//       const pieRect = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "rect"
//       );

//       const pieGroup = document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         "g"
//       );

//       pieRect.classList.add("pie");
//       pieRect.setAttribute("height", "0.98");
//       pieRect.setAttribute("width", "0.98");
//       pieRect.setAttribute("x", 1 * pie.x);
//       pieRect.setAttribute("y", 1 * pie.y);
//       pieRect.setAttribute("filter", "url(#image)");
//       pieRect.id = pie.id;
//       pieGroup.appendChild(pieRect);
//       mapgroup.appendChild(pieGroup);

//       if (pie.isClaimed) {
//         // drawClaimedPie(pieRect);
//       } else {
//         // pieRect.dataset.toggle = "modal";
//         // pieRect.dataset.target = "#sendPie";
//       }
    });

    
//     var imageUrl = 'https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2Fchocopie-small.png?v=1588725461413',
//     imageBounds = [[42, 123], [34, 131]];
//     L.imageOverlay(imageUrl, imageBounds).addTo(mymap);
    
    
    // svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    // svgElement.setAttribute("viewBox", "0 0 200 200");
    // svgElement.appendChild(mapgroup);
    // var svgElementBounds = [[42, 123], [34, 131]];
    // L.svgOverlay(svgElement, svgElementBounds).addTo(mymap);
  }

  //   function drawClaimedPie(pieRect) {
  //     const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  //     const title = document.createElementNS(
  //       "http://www.w3.org/2000/svg",
  //       "tspan"
  //     );
  //     const name = document.createElementNS(
  //       "http://www.w3.org/2000/svg",
  //       "tspan"
  //     );
  //     const date = document.createElementNS(
  //       "http://www.w3.org/2000/svg",
  //       "tspan"
  //     );
  //     title.textContent = "SHARED BY";
  //     name.textContent = "PETER";
  //     date.textContent = "4-20-20";

  //     title.setAttribute("dy", "0em");
  //     title.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);
  //     name.setAttribute("dy", "2em");
  //     name.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);
  //     date.setAttribute("dy", "2em");
  //     date.setAttribute("x", 1 * pieRect.getAttribute("x") + 0.5);

  //     text.style.fill = "white";
  //     text.setAttribute("x", 1 * pieRect.getAttribute("y"));
  //     text.setAttribute("y", 1 * pieRect.getAttribute("y") + 0.3);
  //     text.setAttribute("text-anchor", "middle");
  //     text.setAttribute("font-size", "0.005em");

  //     text.appendChild(title);
  //     text.appendChild(name);
  //     text.appendChild(date);

  //     pieRect.style.filter = "none";
  //     pieRect.style.fill = "#0080ff";
  //     pieRect.parentElement.appendChild(text);
  //   }

  //   d.addEventListener("click", function(e) {
  //     if (e.target.dataset.toggle == "modal") {
  //       let modal = document.querySelector(e.target.dataset.target);
  //       modal.style.display = "block";
  //     }
  //     if (e.target.dataset.dismiss == "modal") {
  //       let modals = document.querySelectorAll(".modal");
  //       modals.forEach(function(modal) {
  //         modal.style.display = "none";
  //       });
  //     }
  //     if (e.target.classList.contains("modal")) {
  //       e.target.style.display = "none";
  //     }

  //     // if (e.target.classList.contains("zoom-map-svg-pie")) {
  //     //   let modal = document.querySelector("#sendPie");
  //     //   modal.style.display = "block";
  //     //   selectedPieId = e.target.id;
  //     // }

  //     if (e.target.classList.contains("map-svg-pie")) {
  //       let modal = document.querySelector("#viewPies");
  //       modal.style.display = "block";
  //       console.log(e.target.getAttribute("x"), e.target.getAttribute("y"));
  //       const panZoomInstance = sPZ(".zoom-map-svg", {
  //         maxZoom: 30,
  //         zoomEnabled: false,
  //       });

  //       panZoomInstance.zoom(20);
  //       // const sizes = panZoomInstance.getSizes()
  //       // const zoomX = (sizes.width / sizes.viewBox.width) * e.target.getAttribute('x')
  //       // const zoomY = (sizes.height / sizes.viewBox.height) * e.target.getAttribute('y')
  //       // panZoomInstance.zoomAtPoint(20, {x: zoomX, y: zoomY});
  //     }
  //   });

  d.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("zoom-map-svg-pie")) {
      let modal = document.querySelector("#sendPie");
      modal.style.display = "block";
      selectedPieId = e.target.id;
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
