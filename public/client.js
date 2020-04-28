// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3, k) {
  const pies = await fetchPies();
  displayPies(pies);

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    console.log(resp);
    return resp;
  }

  function displayPies(pies) {
    // const map = document.querySelector(".map-svg");
    // pies.forEach(pie => {
    //   const pieRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    //   pieRect.dataset.id = pie.id
    //   pieRect.classList.add("pie")
    //   pieRect.setAttribute("height", "10");
    //   pieRect.setAttribute("width", "10")
    //   pieRect.style.fill = "red"
    //   map.appendChild(pieRect)
    // })
  }

  d3.queue()
    .defer(d3.json, "korea.json")
    .await(drawMap);

  async function drawMap(error, countries) {
    // var url =
    //   "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";
    // const bb = await d3.json(url);

    var width = 400;
    var height = 500;

    var svg = d3
      .select(".map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)


    var g = svg.append("g");

    function zoomed() {
      console.log("test");
    }

    var albersProjection = d3.geoAlbers()
      .scale(2750)
      .rotate([232.5])
      .center([0, 38])
      .translate([width / 2, height / 2]);

    var geoPath = d3.geoPath(albersProjection);


    g.selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("fill", "red")
      .attr("stroke", "#333")
      .attr("d", geoPath)
      .call(d3.zoom().on("zoom", function () {
        g.attr("transform", d3.event.transform)
      }))

  }
})(document, d3);
