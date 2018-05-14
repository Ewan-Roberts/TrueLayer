"use strict";

//Makes api requests a little cleaner
const request = require("request");

//This take the third arguments in terminal from the input "$ node server.js hackernews --posts n"
const terminal_inputs = process.argv.slice(2);

//Extracts the third argument, if it doesnt exists make it 10
const stories_to_return = terminal_inputs[2] || 10

//Makes sure the string isn't empty, too long or is not a string
const validate_description = str =>{
    
    if(typeof str !== "string") return "Error - for validate_description(): "+str+" is not a string"

    if(str.length > 256) return "Error - for validate_description(): string is too long"

    if(str === " ") return "Error - for validate_description(): is an empty string"

    return str;

}

//Regex checks the URL is valid and if its a string
const validate_uri = str =>{

    //*NOTE* This is not my regex statement, I copied this online
    const uri_validation_checker = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

    if(typeof str !== "string") return "Error - for validate_uri(): "+str+" is not a string";
    
    // If i wanted this to be really good i would also hit the url and look for a 200
    if(!uri_validation_checker.test(str)) return "Error - for validate_uri(): "+str+" is not a valid URL";

    return str;

}

//Validates if the input is an int and returns an error if its less then 0
const validate_numerals = int =>{

    if(int === undefined) return 0;

    if(!Number.isInteger(int)) return "Error - for validate_numerals(): "+int+" is not an interger"

    if(int < 0) return "Error - for validate_numerals(): "+int+" is less then 0"

    return int;

}

//Makes an API call based on input URL and validates its a URL 
const get_top_stories = url =>{ 

    //This would be better if my validation functions returned bools
    if(validate_uri(url) !== url) throw new Error("Error - for get_top_stories(): "+url+" is not valid");

    return new Promise((resolve,reject)=>{

        request(url, (err,res,html) => {
            
            if(err) reject("Error - for get_top_stories(): "+err)

            if(res.statusCode !== 200) reject("Error - for get_top_stories(): status is "+res.status)

            if(!err && res.statusCode == 200){
                
                let body_parse = JSON.parse(html)

                resolve(body_parse)

            }
        })
    })
}

//This produces an array of story Promises
const get_hackernews_stories = url =>{

    return new Promise((resolve,reject)=>{
        
        //Get an array of ids from the service
        get_top_stories(url).then(story_id=>{

            const promise_array = [];

            //Number of stories pulled from your terminal input
            for(let i=0;i<stories_to_return;i++){

                //I push each promise to an array to manage synconioustly later 
                promise_array.push(new Promise((resolve,reject)=>{

                    request("https://hacker-news.firebaseio.com/v0/item/"+story_id[i]+".json", (err,res,html)=>{
                            
                            if(err) reject("Error - for get_hackernews_stories(): "+err)

                            const parsed_response = JSON.parse(html)
                            
                            resolve({
                                title:      validate_description(parsed_response.title),
                                uri:        validate_uri(parsed_response.url),
                                author:     validate_description(parsed_response.by),
                                points:     validate_numerals(parsed_response.score),
                                comments:   validate_numerals(parsed_response.descendants),
                                rank:       i+1
                            })
                        })
                    })
                )
            }

            resolve(promise_array)

        })
    })
}

get_hackernews_stories("https://hacker-news.firebaseio.com/v0/topstories.json").then(story_array=>{

    //Execute the requests synconoloudtly and log the result
    Promise.all(story_array).then((test_output)=>{
                
        console.log(test_output)

    })  
})

