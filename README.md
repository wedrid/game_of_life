# A THREE.js implementation of Conway's "Game of Life"
This implementation creates a visualization of Conway's GOL in a grid that lives in a "3D space". 
At the opening of the page, the game starts with a random configuration (a cell is either alive or dead with 0.5 probability).
Commands include: 
- Play: if in "pause mode" it allows the simulation to continue.
- Pause: if the simulation is playing, it pauses it. The background, from black, becomes grey, to indicate that the simulation is paused.
- Clear: sets the world and the visualization to a state in which all the cells are dead.
- Edit: ticking the checkbox allows the user to edit the world in which the automata live in. Changing the world - in the simulation - is as simple as pointing your mouse cursor and clicking the cell that you want to change the state of. If the cell is alive, it becomes dead, and viceversa.
- Change the epoch time: the default epoch time is 1s (1000 ms). The minimum value is set to be 10ms, a maximum value is not specified. 
- Random: generates a random configuration of the world. 

Though it would be nice if the site deployed in https://wedrid.github.io/game_of_life/ if the site isn't available the steps to execute the program can be the following.

# Try the code
vitejs [https://vitejs.dev/] was used for some front end toolings. 
vitejs was installed through the npm package manager [https://nodejs.org/en/] through the command npm install vite
Just clicking index.html typicall does not work due to some CORS issues. 

If the whole repo is cloned, it is probably enough to simply type the command 'npm run dev' to take a look to the code in "developer mode" (which, in this case, is the same as the deployed code).

# Requirements: 
- A working visual simulation: OK
- Start/pause/clear: OK
- Variable framerate: OK
- Drawing/editing of state: OK

Additional functionality: panning and zooming, thanks to the three.js library.

# Some implementations details
The project was implemented, from the software engineering point of view, with the MVC paradigm in mind. 
This implementation was made through the use of three classes: 
- Model: it is the logical model of the simulated world. It exposes methods to change cell states, to reset the world and generate a random configuration. The model is an 'observable' as it implements a 'notifyObservers()' method, which notifies all observers (in this case, just the view class). 
- View: it is the visualization of the model. In this case, the view, was implemented using THREE.js. View is an observer of the Model and updates the view each time the Model sends a notify. View also interacts with the Controller class to change the state of the cells. 
- Controller: does most of the interactions between the model and the view. Through DAT.gui it also implements most of the controlling functionality: play, pause, clear, random and epoch time.

The implementation leverages three.js to have a 3D visualization of the model, in the view, dat.gui that allows to have a small user controller (which needs wiring), gsap for smooth animations between states. 
Note that this implementation was done before the existence of 2023's LLMs. 

--------- 
The logic is completely contained in the js folder, the index.html simply contains the canvas in which everything will be rendered. 
In the following sections, the four files contained in the js folder are briefly described.
## main.js
The responsibility of the main file is to simply instantiate the model, the view and the controller. Because the controller is the intermediary between the model and the view, the main.js file also performs the dependency injection of the model and view, inside the controller.

## model.js
This file contains the logic the data and the logic that governs the dynamics of the game of life. This class is thought as an observable class, of which the observer will be the view.
The model contains the state of the world (is a cell alive? dead?) and the time of the world (how long does one iteration last? is the world's time frozen?)
- constructor() initializes all the variables, the matrix that represents the world in which the single cell lives.
- subscribe() is a method that allows an observer to be subscribed to the observable, which is the model itself. In this case, there is only one view, but the model's code is  agnostic from the implementation of the view, and there can potentially be more than one view subscribed to the model.
- notifyObservers() is the method that notifies all the observers that a change has occurred in the model. In this case, the notify method is implemented in a push fashion. 
- setEpochTime() allows to set the time between a step i and i+1, in milliseconds.
- randomConfiguration() is a method that simply reinitializes the world, with a random configuration. At the current state of the application, a random configuration simply populates the world with a cell that is alive or dead with 0.5 probability. At the end of the method, as it is for any update of the model, the notifyObserver method is called.
- clearModel() kills all the cells of the world
- play/pauseTrigger(): start and stop the time of the world (the model contains the time)
- setAlive(i,j), setDead(i,j) these methods alives and unalives a cell respectively, given the cell's coordinate. These methods do not call the notify method, as it is called buy the changeState(i,j) wrapper method.
- changeState(i,j), wraps the setAlive, setDead methods. If a cell is alive, it calls setDead, and viceversa. This method notifies the observers at the end of the block.
- sleep(ms) this method stops the execution of "ms"ms, is represents the speed at which the simulation evolves.
- calculateNextEpoch() implements the rules of Conway's Game of Life, as classicaly defined [https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life]

## controller.js
This is the controller in the "model-view-controller" paradigm. 
The controller has a reference to both the view and the model. 
This module uses the dat.gui module [https://sbcode.net/threejs/dat-gui/] which is a common way to provide a controller in a three.js application. This allows to have a small controller that mediates between the view and the model. dat.gui can actually be considered as a small view+controller for all the user controls that are not the "aliving" and "unaliving" of a cell, but it acts as a proper intermediary between the view and the model, for example: when the simulation is paused, it changes the background color (which is not an intrinsic property of the model) and it stops the time in the model, which would not otherwise be possible to recognize by the view, as the stopped model would be just the time between iterations.
- changeState(i,j) is the main method of this file. In its simplicity, given the coordinates of the world to change, it changes the state of the model. This method is called by the view, but its effect is seen on the model first; once the model is changed, the change is mirrored in the view. 
- configDatGui() allows to configure the dat.gui controller, as an intermediary between the actual view and the model. This could be considered as a small view itself for the controls, BUT it links the view with the model in terms of time, play/pause mode. A small window is simply needed to have access to the controls. It still works as an intermediary between the view and the model, as when a command is performed, it updates the model which, itself, notifies the view, which will reflect the state of the model.


## view.js
This file contains all the necessary modules that allow a (possible) correct visualization of the world. 
In this case, three.js was used as a library, this library allows to render 3D objects in a supported browser. 
- constructor(rows, cols), sets up the grid of "rows" rows, "cols" columns
- setController(controller), allows to inject the controller class as a dependency.
- notify(newState) is the method that the observable (the model) calls in order to update the view. As previously mentioned, the observer pattern is implemented in it's "push" variant.
- initScene() is a method that sets up all the 3D components (space, cubes, etc.) that allow the visualization. Note that calling this would not be sufficient to have a functional program. This method sets up the raycaster (needed to understand which cell was selected by the mouse), the light position, the size, etc.
At the end of the scene setup, the initGrid method is called.
-  initGrid(), given the size of the world, it initializes an empty grid, which is not yet populated with life (it's a grid of visually dead cells). The grid comes alive at the first call of the notify method, by the view.
-  play/pauseMode: called by the controller, sets the world to a state in which it is understandable that the simulation is paused or is playing. In pause mode, the background becomes grey as a hint to the user, this is done by the view. 
- editModel: this method is reachable by the user, and uses the controller as intermediary between view and model. This method understand which cell the user is clicking through three.js raycasting functionality, and tells the controller to update the model in the cell of interest.
- animate() is the animation loop of three.js
- setCellAlive/Dead allows to update the visualization of the world. These methods are only called by the notify method, when a change is detected. The code inside the methods, allows to have a smooth animation between the alive and dead state, using GSAP [https://gsap.com/docs/v3/]

