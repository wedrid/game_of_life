//TODO: per fare l'interazione con l'utente => tramite raycaster!!

//Here after, I try to improve my js.. the first trial was pretty bad code
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
    constructor() {
  
    }
  }
  class Controller{
    constructor(model, view) {
      this.model = model;
      this.view = view;
    }
  }
  
  const model = new Model(10, 10);
  const view = new View();
  const application = new Controller(model, view);
  
  
  
  /** 
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
  
  renderer.setSize(innerWidth, innerHeight) //
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
  
  
  
  */