// client-side js
// run by the browser each time your view template is loaded

(async function(d, d3, n, q, t) {
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


  
  q()
    .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .await(drawMap);
  
  async function drawMap(error, countries) {
    // var url =
    //   "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";
    // const bb = await d3.json(url);

    
    var width = 400;
    var height = 500;

    var svg = d3.select( ".map" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

    var g = svg.append( "g" );
       
    var albersProjection = d3.geo.albers()
      .scale( 100000 )
      .rotate( [71.057,0] )
      .center( [0, 42.313] )
      .translate( [width/2,height/2] );
    
    var geoPath = d3.geo.path()
      .projection( albersProjection );
    
    // g.selectAll( "path" )
    //   .data( n.features )
    //   .enter()
    //   .append( "path" )
    //   .attr( "fill", "#ccc" )
    //   .attr( "stroke", "#333")
    //   .attr( "d", geoPath );
    
    svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(t.feature(countries, us.objects.counties).features) // Bind TopoJSON data elements
    .enter().append("path")
      .attr("d", geoPath)
      .style("fill", "white")
      .style("stroke", "black");
      
  }

})(document, d3, neighborhoods_json, queue, topojson);

    