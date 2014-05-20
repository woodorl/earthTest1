/////////////////////////////////////////////////////////////////////////////
///////////////////////three.js scene setting////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry   = new THREE.SphereGeometry(1, 32, 32)
var material  = new THREE.MeshPhongMaterial();
var earthMesh = new THREE.Mesh(geometry, material);
var bumpValue = 1;
var earthDiffuse = 'images/earthmap1k.jpg';
var earthBump = 'images/earthbump1k.jpg';
var marsDiffuse = 'images/mars_1k_color.jpg';
var marsBump = 'images/marsbump1k.jpg'

scene.add(earthMesh)    

material.map    = THREE.ImageUtils.loadTexture(earthDiffuse);
material.bumpMap    = THREE.ImageUtils.loadTexture(earthBump);
material.bumpScale = bumpValue * 0.1;
material.specularMap    = THREE.ImageUtils.loadTexture('images/earthspec1k.jpg');
material.specular  = new THREE.Color('grey');

var canvasCloud = [];
var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
var material  = new THREE.MeshPhongMaterial({
map     : new THREE.Texture(canvasCloud),
side        : THREE.DoubleSide,
opacity     : 0.2,
transparent : true,
depthWrite  : false,
})
var cloudMesh = new THREE.Mesh(geometry, material)
earthMesh.add(cloudMesh)

var onRenderFcts= [];
onRenderFcts.push(function(delta, now){
   earthMesh.rotation.y  += 1/32 * delta
})

camera.position.z = 2;

var light = new THREE.DirectionalLight( 0xcccccc, 1 );
light.position.set(5,3,5);
scene.add(light);

var light2 = new THREE.DirectionalLight( 0xcccccc, 0.2 );
light2.position.set(-5,-3,-5);
scene.add(light2);

var mouse = {x : 0, y : 0}
document.addEventListener('mousemove', function(event){
mouse.x = (event.clientX / window.innerWidth ) - 0.5
mouse.y = (event.clientY / window.innerHeight) - 0.5
}, false)
onRenderFcts.push(function(delta, now){
camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
camera.lookAt( scene.position )
})

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();

var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec  = nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
})

/////////////////////////////////////////////////////////////////////////////
////////////////////////control panel setting////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

var btnLeft = document.querySelector('#btn_left');
var btnRight = document.querySelector('#btn_right');
var bumpInfo = document.querySelector('#bump');
var btnEarth = document.querySelector('#btn_earth');
var btnMars = document.querySelector('#btn_mars');
var mousePos = document.querySelector('#mousePos');
var lightText = document.querySelector('#btn_light');
var lightStat = 0;
bumpInfo.innerHTML = bumpValue;

btnLeft.onclick = function() {
  console.log(bumpValue);
  if (bumpValue > -9) {
      bumpValue--;
  }else{
      bumpValue = -9;
  }
  bumpInfo.innerHTML = bumpValue;
  earthMesh.material.bumpScale = bumpValue * 0.1;
  earthMesh.material.needsUpdate = true;
}
btnRight.onclick = function() {
  console.log(bumpValue);
  if (bumpValue < 9) {
      bumpValue++;
  }else{
      bumpValue = 9;
  } 
  bumpInfo.innerHTML = bumpValue;
  earthMesh.material.bumpScale = bumpValue * 0.1;
  earthMesh.material.needsUpdate = true;
}

btnEarth.onclick = function() {
  earthMesh.material.map = THREE.ImageUtils.loadTexture(earthDiffuse);
  earthMesh.material.bumpMap = THREE.ImageUtils.loadTexture(earthBump);
  earthMesh.material.needsUpdate = true;
}

btnMars.onclick = function() {
  earthMesh.material.map = THREE.ImageUtils.loadTexture(marsDiffuse);
  earthMesh.material.bumpMap = THREE.ImageUtils.loadTexture(marsBump);
  earthMesh.material.needsUpdate = true;
}

onmouseup = function mouseXY(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  console.log(mouseX + ', ' + mouseY)
  
  mousePos.innerHTML = mouseX + ', ' + mouseY
  randomGraph();
}



onkeydown = function lightMove(e) {
  if (e.keyCode == 76) {
    if(lightStat == 0) {
      lightStat = 1;
      onmousemove = function lightXY(e) {
        var mouseX = (e.clientX - window.innerWidth/2) * 0.1;
        var mouseY = (window.innerHeight/2 - e.clientY) * 0.1;

        light.position.set(mouseX, mouseY, 5);
        light.position.needsUpdate = true;
        lightText.innerHTML = 'press L to stop Light';
      }
    } else {
      lightStat = 0;
      onmousemove = function lightXY(e) {
        var mouseX = (e.clientX - window.innerWidth/2) * 0.1;
        var mouseY = (window.innerHeight/2 - e.clientY) * 0.1;
        
        light.position.needsUpdate = false;
        light.position.set(3, 3, 5);
        lightText.innerHTML = 'press L to move Light';
      }
    }
  }
  console.log(lightStat);
}
/////////////////////////////////////////////////////////////////////////////
////////////////////////////////d3.js setting////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

var w = 300;
var h = 100;
var month = 1;
var barPadding = 1;
var dataset = [8, 14, 20, 13, 23, 40, 7, 9, 3, 25, 24, 17, 18, 8, 12, 4, 22, 16];

var svg = d3.select("body").append("svg").attr("width",w).attr("height",h);

var yScale = d3.scale.linear()
                   .domain([0, d3.max(dataset)])
                   .range([0, h]);

var xScale = d3.scale.ordinal()
                   .domain(d3.range(dataset.length))
                   .rangeRoundBands([0,w], 0.05);

svg.selectAll("rect")
 .data(dataset)
 .enter()
 .append("rect")
 .attr({
     x: function(d, i) {return xScale(i)},
     y: function(d) {return h - yScale(d)},
     width: xScale.rangeBand(),
     height: function(d) {return yScale(d)},
     fill: function(d) {return "rgb(" + (255 - d * 8) + ", " + (255- d * 8) + ", " + (255- d * 3) + ")";}
 })
svg.selectAll("text")
 .data(dataset)
 .enter()
 .append("text")
 .text(function(d) {
     return d;
 })
 .attr({
     x: function(d, i) {return xScale(i) + xScale.rangeBand() / 2;},
     y: function(d) {return h - yScale(d) + 12;},
     "font-family": "sans-serif",
     "font-size": "11px",
     "fill": "white",
     "text-anchor": "middle",
     "font-weight": "bold",
     "cursor": "default"
  });

d3.select("#btn_left")
.on("click", function(){
      if(bumpValue == -9){
          bumpValue = -9;
      }else{                  
          randomGraph();
      };
});

d3.select("#btn_right")
.on("click", function(){
      if(bumpValue == 9){
          bumpValue = 9;
      }else{
        randomGraph();      
     };
});

function randomGraph() {
          var bars = svg.selectAll("rect")
                         .data(dataset);

           var maxValue = 40;
           var numValues = dataset.length;
           dataset = [];
           for (var i = 0; i < numValues; i++) {
               var newNumber = Math.floor(Math.random() * maxValue);
               dataset.push(newNumber);
           }
           yScale.domain([0, d3.max(dataset)]);

           svg.selectAll("rect")
              .data(dataset)
              .transition()
              .delay(function(d,i){return i / dataset.length * 500})
              .duration(500)
              .ease("circle-in-out")
              .attr({
                  y: function(d){return h - yScale(d)},
                  height: function(d){return yScale(d)},
                  fill: function(d) {return "rgb(" + (255 - d * 8) + ", " + (255- d * 8) + ", " + (255- d * 3) + ")";}
              })

           svg.selectAll("text")
              .data(dataset)
              .transition()
              .delay(function(d,i){return i / dataset.length * 500})
              .duration(500)
              .ease("circle-in-out")
              .text(function(d){return d})
              .attr({
                  y: function(d){return h - yScale(d) + 12}
              })
}