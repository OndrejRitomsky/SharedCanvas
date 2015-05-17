/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'static/index'
    
  },

  // currently blueprints.js actions == true !!! -> autorutes
  '/user/view': {
    controller: 'UserController',
    action: 'view'
  },
  '/user/registration': {
    controller: 'UserController',
    action: 'registration'
  },
  '/user/create': {
    controller: 'UserController',
    action: 'create'
  },
  
  '/session/create': {
    controller: 'SessionController',
    action: 'create'
  },
  
  '/session/destroy': {
    controller: 'SessionController',
    action: 'destroy'
  },
  '/session/login': {
    controller: 'SessionController',
    action: 'login'
  }, 
  '/session/new': {
    controller: 'SessionController',
    action: 'new'
  }, 
  '/picture/save': {
    controller: 'PictureController',
    action: 'save'
  },
  '/picture/like': {
    controller: 'PictureController',
    action: 'like'
  },
  '/picture/unlike': {
    controller: 'PictureController',
    action: 'unlike'
  },
  '/picture/mydelete': {
    controller: 'PictureController',
    action: 'mydelete'
  },
  '/picture/gallery': {
    controller: 'PictureController',
    action: 'gallery'
  },
  '/picture/galleryToogle': {
    controller: 'PictureController',
    action: 'galleryToogle'
  },
  '/canvas/start': {
    controller: 'CanvasController',
    action: 'start'
  },
  '/canvas/sync': {
    controller: 'CanvasController',
    action: 'sync'
  },
  '/canvas/update': {
    controller: 'CanvasController',
    action: 'update'
  },
  '/canvas/decline': {
    controller: 'CanvasController',
    action: 'decline'
  },
  '/canvas/decline/:id': {
    controller: 'CanvasController',
    action: 'decline'
  },
  '/canvas/subscribe': {
    controller: 'CanvasController',
    action: 'subscribe'
  },
  '/canvas/invite': {
    controller: 'CanvasController',
    action: 'invite'
  },
  '/canvas/draw': {
    controller: 'CanvasController',
    action: 'draw'
  },
  '/canvas/draw/:id': {
    controller: 'CanvasController',
    action: 'draw'
  }
  
 
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
