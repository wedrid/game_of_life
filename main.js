import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';
 


const view = new View(60, 60);
const model = new Model(60, 60, 1000);
const application = new Controller(model, view);
view.setController(application); //FIXME: there's a much better way but im tired right now REFACTOR

model.randomConfiguration();

model.startProgressLoop();
view.animate();


// the gui_grid world is represented by an integers matrix (world representation) of which dimensions are specified by the height and width attributes
// the matrix contains boolean data (anche se in js 'boolean' vuol dire tutto e niente.. probabilmente boolean saranno simulati come integers) 
