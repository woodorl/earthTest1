var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var geometry   = new THREE.SphereGeometry(1, 32, 32)
var material  = new THREE.MeshPhongMaterial();
var earthMesh = new THREE.Mesh(geometry, material);
var bumpValue = 0;

scene.add(earthMesh)    

// material.map    = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
material.bumpMap    = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
material.bumpScale = bumpValue;
// material.specularMap    = THREE.ImageUtils.loadTexture('images/earthspec1k.jpg');
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

var light = new THREE.DirectionalLight( 0xcccccc, 1 )
light.position.set(5,3,5)
scene.add( light )

var light2 = new THREE.DirectionalLight( 0xcccccc, 0.2 )
light2.position.set(-5,-3,-5)
scene.add( light2 )

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





var btnLeft = document.querySelector('#btn_left');
var btnRight = document.querySelector('#btn_right');
var bumpInfo = document.querySelector('#bump');
         
btnLeft.onclick = function() {
  console.log(bumpValue);
  if (bumpValue > -9) {
      bumpValue--;
  }else{
      bumpValue = -9;
  }
  bumpInfo.innerHTML = bumpValue;
  material.bumpScale = bumpValue * 0.01;
}
btnRight.onclick = function() {
  console.log(bumpValue);
  if (bumpValue < 9) {
      bumpValue++;
  }else{
      bumpValue = 9;
  } 
  bumpInfo.innerHTML = bumpValue;
  material.bumpScale = bumpValue * 0.01;
}



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
