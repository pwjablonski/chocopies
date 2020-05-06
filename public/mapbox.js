// client-side js
// run by the browser each time your view template is loaded

(async function(d, mbGL) {
  let pieData = await fetchPies();
  let claimed = pieData.claimed;
  let total = pieData.total;
  let pies = pieData.pies;
  let selectedPieId = null;

  mbGL.accessToken =
    "pk.eyJ1IjoicHdqYWJsb25za2kiLCJhIjoiY2s5dW5wdnh0MDBzYTNtbHFtZWRtbmw3YSJ9.eHxCyVJuJmXzblybi0S9_w";

  const map = new mbGL.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [127, 38],
    zoom: 4.45
  });

  map.on("load", function() {
    // Add GeoJSON data
    map.addSource("source", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[[-30, -25], [-30, 35], [30, 35], [30, -25]]]
        }
      }
    });

    // Load an image to use as the pattern
    map.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cat_silhouette.svg/64px-Cat_silhouette.svg.png",
      function(err, image) {
        // Throw an error if something went wrong
        if (err) throw err;

        // Declare the image
        map.addImage("pattern", image);

        // Use it
        map.addLayer({
          id: "pattern-layer",
          type: "raster",
          source: "source",
          paint: { "raster-opacity": 0.85 }
        });
      }
    );
  });

  drawData(total, claimed);

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
    if (e.target.classList.contains("pie")) {
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
  });
})(document, mapboxgl);
