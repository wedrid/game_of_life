import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
 
/*
class Model{
  //to make more efficient, it is probably a good idea, when calculating the dead and alive cells, to calculate the ones that changed status, instead of updating the whole graphical cells
  constructor(rows, cols, epoch_time) {
    //the gol-world will be represented as a 2x2 matrix of which states are 0 - dead or 1 - alive
    this.epoch_time = epoch_time
    this.rows = rows; //aka num of columns //width is now rows
    this.cols = cols; //aka num of rows //height is now cols
    //this.world_model = Array.from(Array(this.height), _ => Array(this.width).fill(0)); //initialized as empty world
    this.world_model = Array(rows).fill().map(() => Array(cols).fill(0));
    
    //console.log(this.world_model);
    
    this.pause = false;
    this.observers = [];
    //this.temp = 1;
  }

  setEpochTime(epochTime){
    this.epoch_time = epochTime;
  }

  randomConfiguration(){
    //console.log(this.world_model);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(Math.random() >= 0.5){
          this.setAlive(i,j);
        } else {
          this.setDead(i,j);
        }
      }
    }
    console.log(this.world_model);
    this.notifyObservers();
  }

  notifyObservers(){
    for(let i = 0; i < this.observers.length; i++){
      //console.log("HI")
      //console.log(this.world_model);
      this.observers[i].notify(this.world_model); //TODO: pull, push? etc. 
    }
  }

  subscribe(view){
    this.observers.push(view); //forse un po' overkill, ma solo perchè c'è una sola view
    //console.log(this.observers.length);
  }

  clearModel(){
    console.log("CLEARING");
    console.log(this.world_model);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        this.setDead(i,j);
      }
    }
    console.log(this.world_model);
    //this.notifyObservers();
  }

  pauseTrigger(){
    console.log("TRYING TO PAUSE");
    //global_pause_controller = true;
    this.pause = true;
    console.log(this.pause)
  }

  playTrigger(){
    //global_pause_controller = false;
    this.pause = false;
    //this.startProgressLoop();
    //console.log("OUT");
    //console.log(this.temp);
  }

  checkPause(){
    return this.pause;
  }

  //for convention, the matrix is represented as (x,y)=(0,0) in the top left corner, increasing coordinates will
  //go towards the left or downwards
  //setAlive and setDead seems to work, however in the console it seems that if I print the array, it only shows the final states in all console outs
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

  changeState(i,j){
    if(i >= this.rows || j >= this.cols){
      throw 'Tried to set dead an invalid coordinate';
    }
    if(this.world_model[i][j] == 0){
      this.setAlive(i,j);
    } else {
      this.setDead(i,j);
    }
    this.notifyObservers();
  }

  sleep(ms) {
    //return new Promise(resolve => setTimeout(resolve, ms));
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
      //resolve();
    });
  }

  
  async startProgressLoop(){
    //global_pause_controller = false;
    //this.pause = true; //FIXME: could the problem be a binding issue? this doesn't, after the first call..
    while(true){
        //if(!global_pause_controller){
        if(!this.pause){
        console.log(this.pause);
        this.calculateNextEpoch();
        //this.temp += 1;
        console.log(this.temp);
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
          //   Quick check..            i = 5, j = 5 //principio di induzione dell'ingegnere
          // [i-1][j-1] [i-1][j] [i-1][j+1]  --> 4,4  4,5  4,6
          // [i][j-1]   [i][j]   [i][j+1]        5,4  5,5  5,6
          // [i+1][j-1] [i+1][j] [i+1][j+1]      6,4  6,5  6,6
          
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
      
      //console.log(nextState);
      this.notifyObservers(); 
  }
}


class View{
  
  constructor(rows, cols, controller)
  { 
    //this.height = height;
    //this.width = width;
    //this.controller = controller;
    this.rows = rows;
    this.cols = cols;
    this.idsMatrix = Array(rows).fill().map(() => Array(cols).fill(0));
    //console.log(this.idsMatrix);
    this.initScene();
    this.editing = false;


    document.addEventListener('mousedown', () => {
      view.mouse.x = (event.clientX / innerWidth) * 2 - 1
      view.mouse.y = -(event.clientY / innerHeight) * 2 + 1
      //console.log(view.mouse)
    })

    
  }

  setController(controller){
    this.controller = controller;
  }

  notify(newState){
    //console.log("HELLO")
    //console.log(newState);
    for( let i = 0; i < this.rows; i++){
      for( let j = 0; j < this.cols; j++){
        //console.log(newState[i][j]);
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
    this.camera.position.z = 27;

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

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement)
    //this.orbit.enabled = true
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

  enableEditMode(){
    this.mouse.x = undefined
    this.mouse.y = undefined
    
    console.log("Enabled editing mode!");
    this.editing = true;
    this.orbit.enabled = false;
  }
  
  disableEditMode(){

    this.editing = false;
    this.orbit.enabled = true;
  }

  cellCoordinate(object_id){
    let index = -1;
    let i = 0;
    const coords = [-1, -1];
    for(i = 0; i < this.idsMatrix.length; i++){
      const arr = this.idsMatrix[i];
      index = arr.indexOf(object_id);
      console.log(index)
      if(index >= 0){
        coords[0] = i;
        coords[1] = index;
        console.log(coords);
      }
    }

    return coords;
  }

  pauseMode(){
    let r = 38, g = 38, b = 38;
    document.body.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    
    //gsap.to()
  }

  playMode(){
    document.body.style.backgroundColor = "black";
  }

  editModel(object_id){
    //calls the controller, which accepts the user input
    //this methods simply reverse searches coordinates, given object id
    const coords = this.cellCoordinate(object_id)
    this.controller.updateModel(coords[0], coords[1]); //TODO: last thing done, dev'essere implementato il controller
  }

  setCellAlive(i, j){ //per qualche ragione, la visualizzazione delle celle è "trasposta", in un certo senso.. ma non è un grosso problema
    
    const cell = this.scene.getObjectById( this.idsMatrix[i][j], true );
    var target = cell;
    var initial = new THREE.Color(cell.material.color.getHex());
    var value = new THREE.Color(0x00ff00);

    gsap.timeline()
      .to( cell.position, {
        duration: 0.5,
        z: 2, 
        ease: "expo"
      } ).to(initial, {     //This syntax is relevant to GSAP's TweenLite, I'll provide a link to the docs
          duration: 0.5,
          r: value.r,
          g: value.g,
          b: value.b,
          ease: "expo",
          onUpdate: function() { target.material.color = initial; },
          
      },
      "<");

      
    //cell.material.color.r = 250;
    //cell.material.color.g = 0;
    //cell.material.color.b = 0;
    //cell.material.color.set( 0x00ff00 );
  }
  
  setCellDead(i, j){
    const cell = this.scene.getObjectById( this.idsMatrix[i][j], true );
    var target = cell;
    var initial = new THREE.Color(cell.material.color.getHex());
    var value = new THREE.Color(0x0000ff);

    gsap.timeline()
      .to( cell.position, {
        duration: 0.5,
        z: 0, 
        ease: "expo"
      } ).to(initial, {     //This syntax is relevant to GSAP's TweenLite, I'll provide a link to the docs
          duration: 0.5,
          r: value.r,
          g: value.g,
          b: value.b,
          ease: "expo",
          onUpdate: function() { target.material.color = initial; },
          
      },
      "<");

    
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
      if(this.editing){
        //intersects[ i ].object.material.color.set( 0x00ff00 );
        this.editModel(intersects[ i ].object.id); //questa funzione farà il seguente: ricerca le coordinate di questo elemento, controlla se è alive o dead e inverte lo stato
        this.mouse.x = undefined; //altrimenti spara id a razzo
        this.mouse.y = undefined;
      }
      
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

  updateModel(i, j){
    this.model.changeState(i,j);
  }

  configureDatGui(){
    this.dat_gui = new dat.GUI({ autoPlace: false });

    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(this.dat_gui.domElement);

    this.gui_controls = {
      //Play: this.model.playTrigger,
      //Pause: this.model.pauseTrigger, 
      Play: () => { this.model.playTrigger();
                    this.view.playMode(); },
      Pause: () => { this.model.pauseTrigger();
                     this.view.pauseMode();    },
      Clear: () => { this.model.clearModel() },
      Edit: false,
      Epoch_time: this.model.epoch_time,
      Random_config: () => { this.model.randomConfiguration() }

    };
    
    this.dat_gui.add(this.gui_controls, "Play");
    this.dat_gui.add(this.gui_controls, "Pause");
    this.dat_gui.add(this.gui_controls, "Clear");
    this.dat_gui.add(this.gui_controls, "Edit").onChange((value) => {
      if(value){
        this.view.enableEditMode();
      } else {
        this.view.disableEditMode();
      }
    });
    this.dat_gui.add(this.gui_controls, "Epoch_time").onChange((newTime) => {
      this.model.setEpochTime(newTime);
    }).name("Epoch time");
    this.dat_gui.add(this.gui_controls, "Random_config").name("Random configuration");
    this.dat_gui.open();
  }
  
}
*/

const view = new View(60, 60);
const model = new Model(60, 60, 1000);
const application = new Controller(model, view);
view.setController(application); //FIXME: there's a much better way but im tired right now REFACTOR

model.randomConfiguration();
/*
model.setAlive(2,3);
model.setAlive(2,4);
model.setAlive(2,5);
model.setAlive(3,3);
model.setAlive(3,4);
model.setAlive(3,5);
model.setAlive(3,6);
model.setAlive(6,4);
model.setAlive(6,5);
model.setAlive(7,5);
model.setAlive(7,6);*/

model.startProgressLoop();
//view.initScene();
view.animate();
//view.pauseMode();
//console.log(view.scene.children);




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
