// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error! Please provide query parameters for year and genre.` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }
    // Loop through the movies information, for each one:
    for (let i=0; i < moviesFromCsv.length; i++) {
      // Store each movie info in memory
      let movieInfo = moviesFromCsv[i]

      // Only pick user-picked year and genre
      // Also, ignore any results with no genre or movies with no runtime
      if (movieInfo.startYear.includes(year) && movieInfo.genres.includes(genre) && movieInfo.runtimeMinutes != `\\N`) {

        // Create a new object containing the pertinent fields
        let movieSelected = {
          primaryTitle: movieInfo.primaryTitle,
          yearReleased: movieInfo.startYear,
          movieGenres: movieInfo.genre
        }

        // Add (push) the new object to the Array
        returnValue.movies.push(movieSelected)
        returnValue.numResults = returnValue.numResults + 1
      }
  
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}