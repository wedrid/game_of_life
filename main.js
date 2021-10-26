//Here after, I try to improve my js.. the first trial was pretty bad code
//Some js initialization 
// Find the latest version by visiting https://cdn.skypack.dev/three.
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


class Model{
  constructor(width, height) {
    //the gol-world will be represented as a 2x2 matrix of which states are 0 - dead or 1 - alive
    this.width = width;
    this.height = height;
    this.world_model = Array.from(Array(this.width), _ => Array(this.height).fill(0)) //initialized as empty world
  }

  //for convention, the matrix is represented as (x,y)=(0,0) in the top left corner, increasing coordinates will
  //go towards the left or downwards
  //setAlive and setDead seem to work, however in the console it seems that if I print the array, it only shows the final states in all console outs
  setAlive(x, y){ //aka give birth
    if(x > this.width || y > this.height){
      throw 'Tried to set alive an invalid coordinate';
    }
  
    this.world_model[x][y] = 1;
    //console.log(this.world_model);
  }

  setDead(x, y){ //aka kill
    if(x > this.width || y > this.height){
      throw 'Tried to set dead an invalid coordinate';
    }
    this.world_model[x][y] = 0;
    //console.log(this.world_model);
  }

  calculateNextEpoch(){
    //nextState <= newarray
    const nextState = Array.from(Array(this.width), _ => Array(this.height).fill(0)); //hopefully js has some sort of garbage collection mechanism..
    for(var i = 0; i < this.width; i++){
      for(var j = 0; j < this.height; j++){
        //if border, leave untouched.. quickfix for now...
        if(i == 0 || i == this.height - 1 || j == 0 || j == this.width){
          nextState[i][j] = this.world_model[i][j];
        } else {
          //else, if not on border, check g.o.l. rules..
          //Necessary to count the number of neighbors
          /*   Quick check..            i = 5, j = 5 //principio di induzione dell'ingegnere
          [i-1][j-1] [i-1][j] [i-1][j+1]  --> 4,4  4,5  4,6
          [i][j-1]   [i][j]   [i][j+1]        5,4  5,5  5,6
          [i+1][j-1] [i+1][j] [i+1][j+1]      6,4  6,5  6,6
          */ 
          var numNeighbors = this.world_model[i-1][j-1] + this.world_model[i-1][j] + this.world_model[i-1][j+1] + this.world_model[i][j-1] + this.world_model[i][j+1] + this.world_model[i+1][j-1] + this.world_model[i+1][j] + this.world_model[i+1][j+1];
          
          if(this.world_model[i][j] == 1 && (numNeighbors == 3 || numNeighbors == 4)){
            nextState[i][j] = 1;
          } 
          if(this.world_model[i][j] == 0 && numNeighbors == 3){
            nextState[i][j] = 1;
          }
          //gli altri casi sono considerati dal fatto che la matrice è inizializzata a zero
          }
        }                               
      }
      this.world_model = nextState;
      //console.log(nextState);
    }
  }


class View{
  constructor()
  {
    /*
      this.camera = camera;
      this.scene = scene;
      this.controls = controls;
      this.renderer = renderer;
      this.fov = fov;*/
  }

  initScene() {
    
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 1, 1000);
    this.camera.position.z = 50;

    //this.controls = new THREE.TrackballControls( this.camera );
    //this.controls.addEventListener('change', this.renderScene);

    //specify a canvas which is already created in the HTML file and tagged by an id        //aliasing enabled
    this.canvas = document.querySelector('canvas.webgl')
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    })    
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    var orbit = new OrbitControls(this.camera, this.renderer.domElement)
    let light = new THREE.DirectionalLight( 0xffffff , 1)
    light.position.set(0, 0, 1)
    this.scene.add(light);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.initGrid()

  }

  initGrid(){
    var hCount = 10,
    vCount = 10,
    spacing = 1.5;
    this.gui_grid = new THREE.Object3D(); 
    for (var h=0; h<hCount; h+=1) {
        for (var v=0; v<vCount; v+=1) {
            var box_geometry = new THREE.BoxGeometry(1,1,1)
            var box = new THREE.Mesh(box_geometry,
                          new THREE.MeshBasicMaterial({ color: 0x0000ff, }));
            box.position.x = (h-hCount/2) * spacing;
            box.position.y = (v-vCount/2) * spacing;
            this.gui_grid.add(box);
        }
    }
    this.scene.add(this.gui_grid);
    this.scene.updateMatrixWorld(); //this is to fix the issue where raycaster selected everything before I could do anything
  }

  animate(){
    requestAnimationFrame( this.animate.bind(this) );
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects( this.gui_grid.children );
    for ( let i = 0; i < intersects.length; i++ ) {
  
      intersects[ i ].object.material.color.set( 0xff0000 );
      //console.log(intersects[i].object)
    }

    this.render(this.scene, this.camera);
    //this.controls.update();
  }

  render(){
      this.renderer.render( this.scene, this.camera );
  }
}


class Controller{
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const model = new Model(10, 10);
const view = new View(45);
const application = new Controller(model, view);

view.initScene();
view.animate();

console.log(view.scene.children);


addEventListener('click', () => {
  view.mouse.x = (event.clientX / innerWidth) * 2 - 1
  view.mouse.y = -(event.clientY / innerHeight) * 2 + 1

  console.log(view.mouse)
})

/** 

//TODO: move next two functions in some utils file
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  console.log(g)
  return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}







// the gui_grid world is represented by an integers matrix (world representation) of which dimensions are specified by the height and width attributes
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente.. probabilmente boolean saranno simulati come integers) 


gui.add(world.gui_grid, 'color').onChange(() => { //FIXME:
  //refactor.. per ora fa un po' cagare, codice super ripetuto.....
  console.log(gui_grid.children)
})










//console.log(scene)
//console.log(camera)
//console.log(renderer)



//scene.add(light)



//FIXME: click isn't good enough, serve qualche guardia.. altrimenti se si clicca e tiene premuto fa casino
addEventListener('click', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1

  console.log(mouse)
})
*/
//orbit.enabled = false; //to disable orbit control if in edit mode
//function 
