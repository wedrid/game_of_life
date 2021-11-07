
export default class Model{
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
      //console.log(this.world_model);
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
      //console.log("CLEARING");
      //console.log(this.world_model);
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.setDead(i,j);
        }
      }
      //console.log(this.world_model);
      this.notifyObservers();
    }
  
    pauseTrigger(){
      //console.log("TRYING TO PAUSE");
      //global_pause_controller = true;
      this.pause = true;
      //console.log(this.pause)
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
          //console.log(this.pause);
          this.calculateNextEpoch();
          //this.temp += 1;
          //console.log(this.temp);
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
        
        //console.log(nextState);
        this.notifyObservers(); 
    }
  }