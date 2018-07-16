require("dotenv").config();

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var file = require('file-system');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var arg = process.argv[2];
var arg2 = process.argv[3];

processRequest(arg, arg2);

function processRequest(arg, arg2) {
    switch (arg) {
        case "my-tweets":
            var params = {
                screen_name: 'StrumpfWoof'
            };
            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < tweets.length && i < 20; i++) {
                        console.log("\n***** TWEET: " + tweets[i].text)
                        console.log("***** CREATED AT: " + tweets[i].user.created_at);
                    }
                }
            });
            break;
        case "spotify-this-song": 
            // If no song is given, Ace of Base "The Sign"
            if (process.argv.length === 3) {
                arg2 = "Ace of Base The Sign";
            }
            spotify.search({
                type: 'track',
                query: arg2,
                limit: 1
            }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                } else
                    console.log("\n***** Artists: " + data.tracks.items[0].album.artists[0].name);
                    console.log("***** Song Title: " + data.tracks.items[0].name);
                    console.log("***** Preview Link: " + data.tracks.items[0].preview_url);
                    console.log("***** Album: " + data.tracks.items[0].album.name);
            });
            break;
        case "movie-this":
            // if no movie is given, default to "Mr. Nobody"
            if (process.argv.length === 3) {
                arg2 = "Mr. Nobody";
            }
            var queryUrl = "http://www.omdbapi.com/?t=" + arg2 + "=&plot=short&apikey=trilogy";
            request(queryUrl, function (error, response, data) {
                if (!error && response.statusCode === 200) {
                    console.log("\n***** Movie: " + JSON.parse(data).Title)
                    console.log("***** Year Released: " + JSON.parse(data).Year)
                    console.log("***** Rated: " + JSON.parse(data).Rated)
                    console.log("***** Rotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value)
                    console.log("***** Country: " + JSON.parse(data).Country)
                    console.log("***** Languages: " + JSON.parse(data).Language)
                    console.log("***** Plot: " + JSON.parse(data).Plot)
                    console.log("***** Actors: " + JSON.parse(data).Actors)
                }
            })
            break;
        case 'do-what-it-says':
            fs.readFile('random.txt', "utf8", function (err, data) {
                if (err) {
                    return console.log("error" + err)
                } else {
                    var newArray = data.split(",");
                    arg = newArray[0];
                    arg2 = newArray[1];
                    processRequest(arg, arg2);
                }

            });
            break;
        default:
            console.log("Wrong argument!")
    }
}
/*
fs.appendFile('log.txt', ", " + process.argv[3], (err) => {
    if (err){
        return console.log("error")
    }
})
*/