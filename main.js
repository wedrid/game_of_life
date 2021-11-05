//Here after, I try to improve my js.. the first trial was pretty bad code
//Some js initialization 
// Find the latest version by visiting https://cdn.skypack.dev/three.
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import { gsap } from 'gsap';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


class Model{
  //to make more efficient, it is probably a good idea, when calculating the dead and alive cells, to calculate the ones that changed status, instead of updating the whole graphical cells
  constructor(rows, cols, epoch_time) {
    //the gol-world will be represented as a 2x2 matrix of which states are 0 - dead or 1 - alive
    this.epoch_time = epoch_time
    this.rows = rows; //aka num of columns //width is now rows
    this.cols = cols; //aka num of rows //height is now cols
    //this.world_model = Array.from(Array(this.height), _ => Array(this.width).fill(0)); //initialized as empty world
    this.world_model = Array(rows).fill().map(() => Array(cols).fill(0));
    
    console.log(this.world_model);
    
    this.editMode = false;
    this.observers = [];
  }

  notifyObservers(){
    for(let i = 0; i < this.observers.length; i++){
      console.log("HI")
      console.log(this.world_model);
      this.observers[i].notify(this.world_model); //TODO: pull, push? etc. 
    }
  }

  subscribe(view){
    this.observers.push(view); //forse un po' overkill, ma solo perchè c'è una sola view
    //console.log(this.observers.length);
  }

  startEditMode(){
    this.editMode = true;
  }

  stopEditMode(){
    this.editMode = false;
  }

  //for convention, the matrix is represented as (x,y)=(0,0) in the top left corner, increasing coordinates will
  //go towards the left or downwards
  //setAlive and setDead seem to work, however in the console it seems that if I print the array, it only shows the final states in all console outs
  setAlive(i, j){ //aka give birth
    if(i >= this.rows || j >= this.cols){
      throw 'Tried to set alive an invalid coordinate';
    }
  
    this.world_model[i][j] = 1;
    //console.log(this.world_model);
    //this.notifyObservers();
  }

  setDead(i, j){ //aka kill
    if(i >= this.rows || j >= this.cols){
      throw 'Tried to set dead an invalid coordinate';
    }
    this.world_model[i][j] = 0;
    //console.log(this.world_model);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async startProgressLoop(){
    while(true){
      if(!this.editMode){
        this.calculateNextEpoch();
      }
      await this.sleep(this.epoch_time);
    }
  }

  calculateNextEpoch(){
    //nextState <= newarray
    var nextState = Array(this.rows).fill().map(() => Array(this.cols).fill(0)); //hopefully js has some sort of garbage collection mechanism..
    for(var i = 0; i < this.rows; i++){ //height = rows
      for(var j = 0; j < this.cols; j++){ //width = cols
        //if border, leave untouched.. quickfix for now...
        if(i == 0 || i == this.rows - 1 || j == 0 || j == this.cols){
          nextState[i][j] = this.world_model[i][j];
        } else {
          //else, if not on border, check g.o.l. rules..
          //Necessary to count the number of neighbors
          /*   Quick check..            i = 5, j = 5 //principio di induzione dell'ingegnere
          [i-1][j-1] [i-1][j] [i-1][j+1]  --> 4,4  4,5  4,6
          [i][j-1]   [i][j]   [i][j+1]        5,4  5,5  5,6
          [i+1][j-1] [i+1][j] [i+1][j+1]      6,4  6,5  6,6
          */ 
          //console.log(this.world_model);
          var numNeighbors = this.world_model[i-1][j-1] + this.world_model[i-1][j] + this.world_model[i-1][j+1] + this.world_model[i][j-1] + this.world_model[i][j+1] + this.world_model[i+1][j-1] + this.world_model[i+1][j] + this.world_model[i+1][j+1];
          //console.log(numNeighbors);
          
          if(this.world_model[i][j] == 1 && (numNeighbors == 2 || numNeighbors == 3)){
            //console.log("")
            nextState[i][j] = 1;
            //TODO: if nextState[i,j] != worldModel[i,j] THEN => NOTIFY observers
          } 
          if(this.world_model[i][j] == 0 && numNeighbors == 3){
            nextState[i][j] = 1; //TODO: same as previous if statement
          }
          //gli altri casi sono considerati dal fatto che la matrice è inizializzata a zero
          }
        }                               
      }
      
      this.world_model = nextState;
      
      console.log(nextState);
      this.notifyObservers(); 
  }
}


class View{
  
  constructor(rows, cols)
  { 
    //this.height = height;
    //this.width = width;
    this.rows = rows;
    this.cols = cols;
    this.idsMatrix = Array(rows).fill().map(() => Array(cols).fill(0));
    console.log(this.idsMatrix);
    this.initScene();
    /*
      this.camera = camera;
      this.scene = scene;
      this.controls = controls;
      this.renderer = renderer;
      this.fov = fov;*/
  }

  notify(newState){
    console.log("HELLO")
    console.log(newState);
    for( let i = 0; i < this.rows; i++){
      for( let j = 0; j < this.cols; j++){
        console.log(newState[i][j]);
        if(newState[i][j] == 1){
          this.setCellAlive(i,j);
        }
        else{
          this.setCellDead(i,j);
        }
      }
    }
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
    //var orbit = new OrbitControls(this.camera, document.getElementById('canvas'))
    let light = new THREE.DirectionalLight( 0xffffff , 1)
    light.position.set(0, 0, 1)
    this.scene.add(light);

    this.mouse = new THREE.Vector2();
    this.mouse.x = undefined;
    this.mouse.y = undefined;

    this.raycaster = new THREE.Raycaster();

    this.initGrid()

  }

  setCellAlive(i, j){ //per qualche ragione, la visualizzazione delle celle è "trasposta", in un certo senso.. ma non è un grosso problema
    
    const cell = this.scene.getObjectById( this.idsMatrix[i][j], true );
    gsap.to( cell.position, {
      duration: 1,
      z: 1
    } );
    cell.material.color.set( 0x00ff00 );
  }
  
  setCellDead(i, j){
    const cell = this.scene.getObjectById( this.idsMatrix[i][j], true );
    gsap.to( cell.position, {
      duration: 1,
      z: 0
    } );
    cell.material.color.set( 0x0000ff );
  }

  initGrid(){
    var hCount = this.cols,
    vCount = this.rows,
    spacing = 1.5;
    this.gui_grid = new THREE.Object3D(); 
    for (var h=0; h<vCount; h+=1) {
        for (var v=0; v<hCount; v+=1) {
            var box_geometry = new THREE.BoxGeometry(1,1,1)
            var box = new THREE.Mesh(box_geometry,
                          new THREE.MeshBasicMaterial({ color: 0x0000ff, }));
            
            box.position.x = (h-hCount/2) * spacing;
            box.position.y = (v-vCount/2) * spacing;
            this.gui_grid.add(box);
            this.idsMatrix[h][v] = box.id; 
        }
    }
    //console.log(this.idsMatrix);
    this.scene.add(this.gui_grid);
    this.scene.updateMatrixWorld(); //this is to fix the issue where raycaster selected everything before I could do anything
    //this.setCellAlive(2,2);
    //this.setCellDead(10,15);
  }

  

  animate(){
    requestAnimationFrame( this.animate.bind(this) );
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects( this.gui_grid.children );
    for ( let i = 0; i < intersects.length; i++ ) {
      //console.log(intersects[i].object)
      intersects[ i ].object.material.color.set( 0x00ff00 );
      

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
    model.subscribe(view);
    this.model = model;
    this.view = view;
    //this.dat_gui = new dat.GUI();
    this.configureDatGui();
  }

  configureDatGui(){
    this.dat_gui = new dat.GUI({ autoPlace: false });

    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(this.dat_gui.domElement);

    //TODO: we need to do some wiring
    this.gui_controls = {
      Start: function() { 
            console.log("PIPPO");
        },
      Pause: function() {}, 
      Clear: function() {},
      Edit: false,

    };
    
    this.dat_gui.add(this.gui_controls, "Start");
    this.dat_gui.add(this.gui_controls, "Pause");
    this.dat_gui.add(this.gui_controls, "Clear");
    this.dat_gui.add(this.gui_controls, "Edit");
    this.dat_gui.open();
  }
  
}


const view = new View(20, 20);
const model = new Model(20, 20, 1000);
const application = new Controller(model, view);


model.setAlive(2,3);
model.setAlive(2,4);
model.setAlive(2,5);

model.startProgressLoop();
//view.initScene();
view.animate();

//console.log(view.scene.children);


/*(function myLoop(i) {
  setTimeout(function() {
    console.log('Pippo'); //  your code here                
    //if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
    if (true) myLoop(i);
  }, 1000)
})(10); */

addEventListener('click', () => {
  view.mouse.x = (event.clientX / innerWidth) * 2 - 1
  view.mouse.y = -(event.clientY / innerHeight) * 2 + 1
  //console.log(view.mouse)
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
