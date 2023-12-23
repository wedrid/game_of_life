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

# Some implementations details
The project was implemented, from the software engineering point of view, with the MVC paradigm in mind. 
This implementation was made through the use of three classes: 
- Model: it is the logical model of the simulated world. It exposes methods to change cell states, to reset the world and generate a random configuration. The model is an 'observable' as it implements a 'notifyObservers()' method, which notifies all observers (in this case, just the view class). 
- View: it is the visualization of the model. In this case, the view, was implemented using THREE.js. View is an observer of the Model and updates the view each time a notify is sent by the Model. View also interacts with the Controller class to change the state of the cells. 
- Controller: does most of the interactions between the model and the view. Through DAT.gui it also implements most of the controlling functionality: play, pause, clear, random and epoch time. 
