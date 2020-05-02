// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  const pies = await fetchPies();

  drawMap(pies);

  async function fetchPies() {
    const req = await fetch("korea.json");
    const resp = await req.json();
    return resp;
  }

  function drawMap(pies) {
    const map = document.querySelector(".map-svg");

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // pies.data.forEach((pie, i) => {
    //     const y = Math.floor(i / pixels.width);
    //     const x = i % pixels.width;
    //     const pixelRect = document.createElementNS(
    //       "http://www.w3.org/2000/svg",
    //       "rect"
    //     );
    //     pixelRect.classList.add("pie");
    //     pixelRect.setAttribute("height", "1");
    //     pixelRect.setAttribute("width", "1");
    //     pixelRect.setAttribute("x", 1 * x);
    //     pixelRect.setAttribute("y", 1 * y);
    //     pixelRect.style.stroke = "red";
    //     pixelRect.id = i;
    //     group.appendChild(pixelRect);
    // });

    group.setAttribute("transform", "scale(1)");
    map.appendChild(group);

    // pies.forEach(pie => {
    //   const pixelRect = document.getElementById(`${pie.fields.location}`);
    //   if (pixelRect) {
    //     pixelRect.style.fill = "blue";
    //     pixelRect.style.stroke = "blue";
    //   }
    // });
  }
})(document);
