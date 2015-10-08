function routesRouter(express, app) {
  var router = express.Router();

  router.get('/', function(req, res, next) {
    var bases = ['/', '/objects', '/types', '/agents', '/sets'],
        routeMap = {};

    app._router.stack.forEach(function(layer) {
      if (layer.name !== 'router')
        return;

      var path;

      for (var i in bases) {
        if (layer.regexp.test(bases[i])) {
          path = bases[i];
          break;
        }
      }

      routeMap[path] = [];

      layer.handle.stack.forEach(function(stack) {
        Object.keys(stack.route.methods).forEach(function(method) {
          var routeName = method.toUpperCase()+': '+stack.route.path;
          routeMap[path].push(routeName);
        });
      });
    });

    res.status(200)
       .json(routeMap);
  });

  return router;
}

module.exports = routesRouter;
