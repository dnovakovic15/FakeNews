var exphbs = require("express-handlebars");

function route(app){
    // Set Handlebars as the default templating engine.
    app.engine("handlebars", exphbs({ defaultLayout: "home" }));
    app.set("view engine", "handlebars");


    app.get("/home", function(req, res) {
        res.render("index", {
        // burgers: result,
    });

    });

    app.post("/saved", function(req, res) {

    });

    // app.post("/devourBurger", function(req, res) {

    // });
}

// function cb(result, res){
//     console.log(result[0].burger_name);
//     res.render("index", {
//         burgers: result,
//     });
// }

module.exports = route;