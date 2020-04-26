// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3) {
  const pies = await fetchPies();
  displayPies(pies);

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    console.log(resp);
    return resp;
  }

  function displayPies(pies) {
    d3.json("data.geojson").then(function(bb) {
      let width = 200,
        height = 200;
      let projection = d3.geoEqualEarth();
      projection.fitSize([width, height], bb);
      let geoGenerator = d3.geoPath().projection(projection);

      let svg = d3
        .select("body")
        .append("svg")
        .style("width", width)
        .style("height", height);

      svg
        .append("g")
        .selectAll("path")
        .data(bb.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("fill", "#088")
        .attr("stroke", "#000");
    });

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
})(document, d3);
