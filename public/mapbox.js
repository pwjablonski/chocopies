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
    zoom: 4.45,
    attributionControl: false
  });

  //   map.on("load", function() {
  //     // Add GeoJSON data
  //     map.addSource("source", {
  //       type: "image",
  //       url:
  //         "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-04-30%20at%209.40.37%20AM.png?v=1588257676068",
  //       coordinates: [[128, 38], [127, 38],[127, 37], [128, 37],]
  //     });

  //     // Load an image to use as the pattern
  //     map.addLayer({
  //       id: "pattern-layer",
  //       type: "raster",
  //       source: "source",
  //       paint: { "raster-opacity": 0.85 }
  //     });
  //   });

  map.on("load", function() {
    map.addSource("maine", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [[[128, 38], [127, 38], [127, 37], [128, 37]]]
        }
      }
    });
    map.addLayer({
      id: "maine",
      type: "raster",
      source: "maine",
      // layout: {},
      // paint: {
      //   "fill-color": "#088",
      //   "fill-opacity": 0.8
      // }
    });
    // map.loadImage(
    //   "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-04-30%20at%209.40.37%20AM.png?v=1588257676068",
    //   function(error, image) {
    //     if (error) throw error;
    //     map.addImage("cat", image);
    //     map.addSource("pies", {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: [
    //           {
    //             type: "Feature",
    //             geometry: {
    //               type: "Polygon",
    //               coordinates: [[128, 38], [127, 38], [127, 37], [128, 37]]
    //             }
    //           }
    //         ]
    //       }
    //     });
    //     // map.addLayer({
    //     //   id: "points",
    //     //   type: "raster",
    //     //   source: "point",
    //     // });
    //     map.addLayer({
    //       id: "maine",
    //       type: "fill",
    //       source: "pies",
    //       layout: {},
    //       paint: {
    //         "fill-color": "#088",
    //         "fill-opacity": 0.8
    //       }
    //     });
    //   }
    // );

    //         // Add GeoJSON data
    //     map.addSource("source", {
    //       type: "image",
    //       url:
    //         "https://cdn.glitch.com/1fa742a9-ec9d-49fb-8d8b-1aaa0efe3e2c%2FScreen%20Shot%202020-04-30%20at%209.40.37%20AM.png?v=1588257676068",
    //       coordinates: [[128, 38], [127, 38],[127, 37], [128, 37],]
    //     });

    //     // Load an image to use as the pattern
    //     map.addLayer({
    //       id: "pattern-layer",
    //       type: "raster",
    //       source: "source",
    //       paint: { "raster-opacity": 0.85 }
    //     });
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
