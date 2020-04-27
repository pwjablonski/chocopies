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

  async function drawMap() {
    var url =
      "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";
    const bb = await d3.json(url);

    console.log(bb.features)
    
    var width = "100%";
    var height = "100%";
    // Create SVG
    var svg = d3.select( ".map" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

    // Append empty placeholder g element to the SVG
    // g will contain geometry elements
    var g = svg.append( "g" );
    
    
    var albersProjection = d3.geoAlbers()
      .scale( 190000 )
      .rotate( [71.057,0] )
      .center( [0, 42.313] )
      .translate( [width/2,height/2] );
    
    var geoPath = d3.geoPath()
      .projection( albersProjection );
    
    g.selectAll( "path" )
      .data( bb.features )
      .enter()
      .append( "path" )
      .attr( "fill", "#ccc" )
      .attr( "stroke", "#333")
      .attr( "d", geoPath );
    
    // var projection = d3.geoEqualEarth();
    // projection.fitExtent([[20, 20], [width, height]], bb);
    // var geoGenerator = d3.geoPath().projection(projection);
    // var svg = d3
    //   .select(".map")
    //   .append("svg")
    //   .style("width", "100%")
    //   .style("height", "100%");
    // svg
    //   .append("g")
    //   .selectAll("path")
    //   .data(bb.features)
    //   .enter()
    //   .append("path")
    //   .attr("d", geoGenerator)
    //   .attr("fill", "#088")
    //   .attr("stroke", "#000");
  }

  drawMap();
})(document, d3);
