//TODO: per fare l'interazione con l'utente => tramite raycaster!!


// Find the latest version by visiting https://cdn.skypack.dev/three.
  
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
  
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

const world = {
  grid: {
    height: 20,
    width: 20,
    spacing: 1.5
  },
  world_representation: undefined,
}


world.world_representation = Array.from(Array(world.grid.width), _ => Array(world.grid.height).fill(0))
console.log(world.world_representation)

// the grid world is represented by an integers matrix (world representation) of which dimensions are specified by the height and width attributes
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente.. probabilmente boolean saranno simulati come integers) 


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



const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
}
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
  const intersects = raycaster.intersectObject(grid) //TODO: qui permette di fare la selezione di un cubetto. qui per poter permettere all'utente di selezionare la configurazione iniziale
  //console.log(intersects)
}


animate()



addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = (event.clientY / innerHeight) * 2 + 1

  console.log(mouse)
})