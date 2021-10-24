// Find the latest version by visiting https://cdn.skypack.dev/three.
  
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
  
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const world = {
  grid: {
    height: 10,
    width: 10,
    spacing: 1.5
  }
}

// the grid world is represented by an integers matrix of which dimensions are specified in the "world" class (height and width)
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente) 

gui.add(world.grid, 'width', 1, 50).onChange(() => {
  //refactor.. per ora fa un po' cagare, codice super ripetuto.....
  scene.remove(grid)
    var hCount = world.grid.width,
      vCount = world.grid.height,
      spacing = world.grid.spacing;
  grid = new THREE.Object3D(); 
  for (var h=0; h<hCount; h+=1) {
      for (var v=0; v<vCount; v+=1) {
          var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),
                        new THREE.MeshBasicMaterial());
          box.position.x = (h-hCount/2) * spacing;
          box.position.y = (v-vCount/2) * spacing;
          grid.add(box);
      }
  }
  scene.add(grid);
})

gui.add(world.grid, 'height', 1, 50).onChange(() => {
  scene.remove(grid)
    var hCount = world.grid.width,
      vCount = world.grid.height,
      spacing = world.grid.spacing;
  grid = new THREE.Object3D(); 
  for (var h=0; h<hCount; h+=1) {
      for (var v=0; v<vCount; v+=1) {
          var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),
                        new THREE.MeshBasicMaterial());
          box.position.x = (h-hCount/2) * spacing;
          box.position.y = (v-vCount/2) * spacing;
          grid.add(box);
      }
  }
  scene.add(grid);
})


const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)



const renderer = new THREE.WebGLRenderer(

)

//console.log(scene)
//console.log(camera)
//console.log(renderer)

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio) //could make rendering slower (?)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50
const light = new THREE.DirectionalLight( 0xffffff , 1)
light.position.set(0, 0, 1)
scene.add(light)

var hCount = world.grid.width,
    vCount = world.grid.height,
    spacing = world.grid.spacing;
var grid = new THREE.Object3D(); 
for (var h=0; h<hCount; h+=1) {
    for (var v=0; v<vCount; v+=1) {
        var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),
                      new THREE.MeshBasicMaterial({ color: 0x00ff10, }));
        box.position.x = (h-hCount/2) * spacing;
        box.position.y = (v-vCount/2) * spacing;
        grid.add(box);
    }
}
scene.add(grid);

const mouse = {
  x: undefined, 
  y: undefined
}

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(grid)
  console.log(intersects)
}


animate()



addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = (event.clientY / innerHeight) * 2 + 1

  console.log(mouse)
})