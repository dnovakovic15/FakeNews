
let request = require('request');
let cheerio = require('cheerio');

var exports = module.exports = {};

exports.getNews = function(callback, resolve){


    url = 'https://www.nytimes.com/search/Fake%20News?action=click&contentCollection&region=TopBar&WT.nav=searchWidget&module=SearchSubmit&pgtype=Homepage';

    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            let $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            let links = [];
            let headlines = [];
            let summaries = [];
            let articles = [];

            let simpleStats = [];
            // let json = { usage : "", rebounds : "", assists : "", minutes :  ""};

            $('a', '.Item-wrapper--2ba8L').filter(function(index, value){
                let link = $(value).attr('href');

                if(link.indexOf('www.nytimes.com/') < 0){
                    link = 'http://www.nytimes.com/' + link;
                }

                links.push(link);
            });

            $('.Item-headline--3WqlT').filter(function(index, value){
                let headline = $(value).text();
                headlines.push(headline);
            });

            $('.Item-summary--3nKWX').filter(function(index, value){
                let summarie = $(value).text();
                summaries.push(summarie);
            });

            articles.push(links);
            articles.push(headlines);
            articles.push(summaries);

            callback(articles);
        }
    })
}