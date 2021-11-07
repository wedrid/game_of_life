import * as dat from 'dat.gui';


export default class Controller{
  
    constructor(model, view) {
      model.subscribe(view);
      this.model = model;
      this.view = view;
      //this.dat_gui = new dat.GUI();
      this.configureDatGui();
      this.view.setController(this);
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
      }).name("Epoch time (ms)").min(10);
      this.dat_gui.add(this.gui_controls, "Random_config").name("Random configuration");
      this.dat_gui.open();
    }
    
  }