let exphbs = require("express-handlebars");
let news = require("./scraper.js");
let mongoose = require("../config/connection");
var Article = require("../models/Article.js");


function route(app){
    // Set Handlebars as the default templating engine.
    app.engine("handlebars", exphbs({ defaultLayout: "home" }));
    app.set("view engine", "handlebars");


    app.get("/home", function(req, res) {
        news.getNews(callback);

        function callback(fakeNews){
            let parsedNews = parseArticles(fakeNews, sendNews);
            
            function sendNews(parsedNews){
                // storeNews(parsedNews);

                Article.find({}, function(error, doc) {
                    // Log any errors
                    if (error) {
                    console.log(error);
                    }
                    // Or send the doc to the browser as a json object
                    else {
                        res.render("index", {
                            news: doc,
                        });
                    }
                });
            }
        }
    });


    app.get("/saved", function(req, res) {
        // Grab every doc in the Articles array
        Article.find({saved: true}, function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.render("saved", {
                    news: doc,
                });
            }
        });
    });

    app.post("/saved/:id", function(req, res) {
        saveNews(req.params.id);

        function callback(fakeNews){
            let parsedNews = parseArticles(fakeNews, sendNews);

            function sendNews(parsedNews){
                res.render("index", {
                    news: parsedNews,
                });
            }
        }
    });

    // app.post("/devourBurger", function(req, res) {

    // });
}

function parseArticles(news, callback){
    function Aritcle(url, headline, summary){
        this.url = url;
        this.headline = headline;
        this.summary = summary;
    }

    let articles = [];

    for(let i = 0; i < news[0].length; i++){
        let newArticle = new Aritcle(news[0][i], news[1][i], news[2][i]);
        articles.push(newArticle);
    }
    callback(articles);
}

function storeNews(news){
    const db = mongoose.connection;

    // Show any mongoose errors
    db.on("error", function(error) {
        console.log("Mongoose Error: ", error);
    });

    db.once('open', function() {
        console.log('connected');
    });

    news.forEach(function(element) {
        var entry = new Article(element);

        // Now, save that entry to the db
        entry.save(function(err, doc) {
            // Log any errors
            if (err) {
            console.log(err);
            }
            // Or log the doc
            else {
            console.log(doc);
            }
        });
    }, this);
}

function saveNews(id){
    console.log(id);
    Article.update({ "_id": id }, { "saved": true })
        // Execute the above query
        .exec(function(err, doc) {
            console.log(doc);
        });
}

module.exports = route;