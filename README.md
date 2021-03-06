# TrueLayer

This is the response to the TrueLayer development challenge

## How to Run

Firstly, install node here: https://nodejs.org/en/download/

### To run the server open terminal, go to the root folder and run:
```
npm install
node server.js hackernews --posts n
```

### To run the tests open terminal, go to the root folder and run:  
This project has **94.34%** code coverage
```
npm test
mocha
```

## Libraries used and why 

### Development:

* **Request**           : An abstraction of http.get etc from vanilla node, makes api requests a little cleaner

### Testing: 

* **Rewire**            : Library for exporting private functions, tests should not touch/impact code
* **Chai-json-schema**  : Speeds up the validation of JSON schemas
* **Chai/Mocha**        : Extremely useful testing framework to unit test within an established framework/syntax
* **Nyc**               : Library for checking code coverage


## Notes to Consider:

- The code strongly favoured readability over concise code, especially in the tests
- I opted for loose error handling, my preference for something like this is to provide data with the same structure with errors 
- I should have stubbed the server calls
- I really tried to keep it simple, minimal fancy things like ternary operators etc 
- Normally I like to handle errors through an event handler with proper errors but this is small scale enough this would have over complicated it

**________________________________________________________________________________________________________________________**
**________________________________________________________________________________________________________________________**

TrueLayer Dev Challenge below taken from : https://gist.github.com/lucamartinetti/01b2d3b05cd19a42e2d494202a951175

# Hacker News Scraper

At TrueLayer we love to stay up to date with what is hot in technology and we read [Hacker News](https://news.ycombinator.com/) every day.

In order to make it more fun to read for robots (and easier to integrate in our workflow) we would like to write a simple command line application that would output to `STDOUT` the top posts in `JSON`

### Output format
```json
[
    {
        "title": "Web Scraping in 2016",
        "uri": "https://franciskim.co/2016/08/24/dont-need-no-stinking-api-web-scraping-2016-beyond/",
        "author": "franciskim",
        "points": 133,
        "comments": 80,
        "rank": 1
    },
    {
        "title": "Instapaper is joining Pinterest",
        "uri": "http://blog.instapaper.com/post/149374303661",
        "author": "ropiku",
        "points": 182,
        "comments": 99,
        "rank": 2
    }
]
```

### Input arguments
We expect the application to take these arguments:
```
hackernews --posts n
```

- `--posts` how many posts to print. A positive integer <= 100.

### Please also ensure that:

- `title` and `author` are non empty strings not longer than 256 characters.
- `uri` is a [valid URI](https://tools.ietf.org/html/rfc3986)
- `points`, `comments` and `rank` are integers >= 0.

Feel free to use any language framework and library you want. Make it concise, readable and correct.

### Please describe in `README.md`:
- how to run it (don't assume anything already installed)
- what libraries you used and why

### Bonus points for:
- unit tests
- robust input checking
- good comments
- Dockerfile

Have fun, take your time and when you are done please send a link to your public Github repo at [join@truelayer.com](mailto:join@truelayer.com) 
