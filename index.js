// Lyric Graph Server
var express = require('express'); // Required to run server
var request = require("request"); //Required to perform Lyric Request
var bodyParser = require("body-parser"); //Required to parse AJAX query
var parseString = require('xml2js').parseString; //Required for Lyric API

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/search', function(req, res)
{
    var url = req.query; //Get qery parameters
    request("http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?song="+encodeURI(url.song) + "&artist="+encodeURI(url.artist), function(error, response, body) {
        if(error)
            res.send(error);
        parseString(body, function (err, result) {
            var lyrics = result.GetLyricResult.Lyric[0]; //Grab lyric from XML
            res.send(lyrics);
        });
    });
});

//When running, page Live at: http://localhost:8080
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
