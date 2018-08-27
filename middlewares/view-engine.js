const exphbs = require('express-handlebars');
const swag = require('swag');

module.exports = (app) => {
  const hbs = exphbs.create({ defaultLayout: 'main' });

  //Register swag extend helper
  hbs.handlebars.registerHelper(swag.helpers);

  // Custom helpers
  hbs.handlebars.registerHelper('snippet', function (snippet) {
    return eval(snippet);
  });

  hbs.handlebars.registerHelper('stringify', function (json) {
    return JSON.stringify(json);
  });

  hbs.handlebars.registerHelper('objecIsEmpty', function (obj, options) {
    if (Object.keys(obj).length === 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  hbs.handlebars.registerHelper('negate', function (value, options) {
    if (!value) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  // Setting the view engine
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
};
