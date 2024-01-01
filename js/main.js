import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
 

const model = new Model(60, 60, 1000);
const view = new View(model);
const application = new Controller(model, view);

model.randomConfiguration();

model.startProgressLoop();
view.animate();


// the gui_grid world is represented by an integers matrix (world representation) of which dimensions are specified by the height and width attributes
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente.. probabilmente boolean saranno simulati come integers) 
