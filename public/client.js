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
  
  
  async function drawMap(){
    let width = "100%"
    let height = "100%"
    
    const data = d3.json("https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson")
    
    var albersProjection = d3.geoAlbers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );
    
    var geoPath = d3.geoPath()
    .projection( albersProjection );
    
    
    let svg = d3
        .select(".map")
        .append("svg")
        .style("width", width)
        .style("height", height);
    
    let g = svg.append( "g" );
    
    g.selectAll( "path" )
      .data( neighborhoods_json.features )
      .enter()
      .append( "path" )
      .attr( "fill", "#ccc" )
      .attr( "stroke", "#333")
      .attr( "d", geoPath ); 
  }
  
})(document, d3);
