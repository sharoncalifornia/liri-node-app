require("dotenv").config();


var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var a = process.argv[2];
var b = process.argv[3];
var txt_a = "";
var txt_b = "";



// ... concert-this
//var artist_queryUrl="";
//var artistName = "";
//... movie-this
//var movieName = ""; //"Cinderella";
//var movie_queryUrl="";
//...spotify-this-song
//var songName="";


function Concert_this(b){
    var artistName = b;
    var artist_queryUrl;
    //console.log("artistName  :",artistName);
    artist_queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=34a78c3ad94130e03398fd5adf0ea844";

    request(artist_queryUrl, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
          var jsonData = JSON.parse(body);
          //console.log(jsonData[0]);
          console.log("concert-this       -----------------------------------------          ", artistName); 
          console.log("Name of Venue:   "+jsonData[0].venue.name);
          console.log("Venue location:  "+ jsonData[0].venue.city+", "+jsonData[0].venue.region)
          console.log("Date of event:   "+ jsonData[0].datetime);
          console.log("=================================================================================");
          // Parse the body of the site and recover just the imdbRating
          // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
          //console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
          //console.log("The movie's year is: " + JSON.parse(body).Year);
          //console.log(response);

          var showData = [
            "concert-this:      "+artistName,
            "Name of Venue:     "+jsonData[0].venue.name,
            "Venue location:    "+jsonData[0].venue.city+", "+jsonData[0].venue.region,
            "Date of event:     "+jsonData[0].datetime
          ].join("\n");

          fs.appendFile("log.txt", showData + "----------------------\n", function(err) {
            if (err) throw err;
            //console.log(showData);
          });

        }
      });
}

function Movie_this(b){
    var movieName=b;
    //console.log("artistName  :",movieName);
    // Then run a request to the OMDB API with the movie specified
    var movie_queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // Then create a request to the queryUrl
    // ...
    request(movie_queryUrl, function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
        var jsonData= JSON.parse(body);
      //  console.log(jsonData);
      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log("movie-this       -----------------------------------------          ", movieName); 
      console.log("The movie Title is:          "+jsonData.Title);
      console.log("The movie Year is:           "+jsonData.Year);
      console.log("The movie IMDB Rating is:    "+jsonData.imdbRating);
      console.log("Rotten Tomatoes Ratings:     "+jsonData.Ratings[1]);
      console.log("Country of the movie:        "+jsonData.Country);
      console.log("The movie's language:        "+jsonData.Language);
      console.log("Plot of the movie:           "+jsonData.Plot);
      console.log("Actors in the Movie:         "+jsonData.Actors);
      
      console.log("=================================================================================");
      //console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
      //console.log("The movie's year is: " + JSON.parse(body).Year);
      //console.log(response);

      var showData = [
        "movie-this:                  "+movieName,  
        "The movie Title is:          "+jsonData.Title,
        "The movie Year is:           "+jsonData.Year,
        "The movie IMDB Rating is:    "+jsonData.imdbRating,
        "Rotten Tomatoes Ratings:     "+jsonData.Ratings[1],
        "Country of the movie:        "+jsonData.Country,
        "The movie's language:        "+jsonData.Language,
        "Plot of the movie:           "+jsonData.Plot,
        "Actors in the Movie:         "+jsonData.Actors
      ].join("\n");

      fs.appendFile("log.txt", showData + "----------------------\n", function(err) {
        if (err) throw err;
        //console.log(showData);
      });
    }
  });
}

function Spotify_this_song(b){
    var songName=b;
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
     
      console.log("spotify-this-song -----------------------------------------              ", songName);  
      console.log("Artist(s) Name:      ", data.tracks.items[0].artists[0].name);
      console.log("Song Name:           ",data.tracks.items[0].name);
      console.log("Preview link:        ",data.tracks.items[0].external_urls);
      console.log("Album of the song:   ", data.tracks.items[0].album.name);
      console.log("=====================================================================================");
   
      var showData = [
        "spotify-this-song:   "+songName,  
        "Artist(s) Name:      "+data.tracks.items[0].artists[0].name,
        "Song Name:           "+data.tracks.items[0].name,
        "Preview link:        "+data.tracks.items[0].external_urls,
        "Album of the song:   "+data.tracks.items[0].album.name
      ].join("\n");

      fs.appendFile("log.txt", showData + "----------------------\n", function(err) {
        if (err) throw err;
        //console.log(showData);
      });

      });
}

//do-what-it-says
function Do_what_it_says(){

    // fs = require('fs-js');
     fs.readFile("random.txt", "utf8", function(error, data){
         if (error) {
           return console.log(error);
         }
 
     console.log(data);
     var dataArr = data.split(",");
     //console.log(dataArr);
     txt_a=dataArr[0];
     txt_b=dataArr[1];
 
     //console.log("argument 1  ",txt_a);
     //console.log("argument 2  ",txt_b);
 
     if (txt_a==="concert-this")
         Concert_this(txt_b);
     if (txt_a==="movie-this")
         Movie_this(txt_b);
     if (txt_a=== "spotify-this-song" )
         Spotify_this_song(txt_b);
 
 });
 }

//"concert-this"
if (a==="concert-this")
{
    Concert_this(b);
}

//movie-this
if (a==="movie-this")
{
    Movie_this(b);
}

//"spotify-this-song"
if(a==="spotify-this-song")
{
    Spotify_this_song(b);
}

if (a==="do-what-it-says")
{
    Do_what_it_says();   
}

