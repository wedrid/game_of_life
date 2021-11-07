import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import { gsap } from 'gsap';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

export default class View{
  
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
  
        /*.to( cell.material.color, { //FIXME: can't figure out the color transition :(
          duration: 0.5,
          r: 0,
          g: 255,
          b: 0, 
          a: 0,
          ease:"sine",
        }, "<" );*/
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