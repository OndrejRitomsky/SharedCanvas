/**
 * CanvasController
 *
 * @description :: Server-side logic for managing canvas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  'new': function(req, res){
    res.view('canvas/start');
  },
  
  'draw': function(req, res){
    res.locals.layout = 'canvasLayout';
    res.view('canvas/draw');    
  }
};

