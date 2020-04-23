// client-side js
// run by the browser each time your view template is loaded

(async function(d) {
  
  const req = await fetch('/pies')
  const resp = await req.json()
  
  console.log(resp)
  
  
  
})(document);