//TODO: per fare l'interazione con l'utente => tramite raycaster!!


// Find the latest version by visiting https://cdn.skypack.dev/three.
  
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
  
import * as dat from 'dat.gui'

//TODO: move next two functions in some utils file
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  console.log(g)
  return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')

const world = {
  gui_grid: {
    height: 20,
    width: 20,
    spacing: 1.5, 
    color: 0x00ff00
  },
  world_representation: undefined,
}


world.world_representation = Array.from(Array(world.gui_grid.width), _ => Array(world.gui_grid.height).fill(0))
console.log(world.world_representation)

// the gui_grid world is represented by an integers matrix (world representation) of which dimensions are specified by the height and width attributes
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente.. probabilmente boolean saranno simulati come integers) 


gui.add(world.gui_grid, 'color').onChange(() => { //FIXME:
  //refactor.. per ora fa un po' cagare, codice super ripetuto.....
  console.log(gui_grid.children)
})




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000)



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

var orbit = new OrbitControls(camera, renderer.domElement)
camera.position.z = 50
const light = new THREE.DirectionalLight( 0xffffff , 1)
light.position.set(0, 0, 1)
//scene.add(light)

var hCount = world.gui_grid.width,
    vCount = world.gui_grid.height,
    spacing = world.gui_grid.spacing;
var gui_grid = new THREE.Object3D(); 
for (var h=0; h<hCount; h+=1) {
    for (var v=0; v<vCount; v+=1) {
        var box_geometry = new THREE.BoxGeometry(1,1,1)
        var box = new THREE.Mesh(box_geometry,
                      new THREE.MeshBasicMaterial({ color: world.gui_grid.color, }));
        box.position.x = (h-hCount/2) * spacing;
        box.position.y = (v-vCount/2) * spacing;
        gui_grid.add(box);
    }
}
scene.add(gui_grid);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


//FIXME: click isn't good enough, serve qualche guardia.. altrimenti se si clicca e tiene premuto fa casino
addEventListener('click', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  console.log(mouse)
})

//orbit.enabled = false; //to disable orbit control if in edit mode
function animate(){
  requestAnimationFrame(animate)
  //renderer.render(scene, camera)
  raycaster.setFromCamera( mouse, camera );
  const intersects = raycaster.intersectObjects( gui_grid.children );
  //console.log(gui_grid.children)

	for ( let i = 0; i < intersects.length; i++ ) {

		intersects[ i ].object.material.color.set( 0xff0000 );
    //onsole.log(intersects[i])
	}
  //console.log(intersects);
  //gui_grid.rotation.x += 0.001
  
	renderer.render( scene, camera );
}


animate()



