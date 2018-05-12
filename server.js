
const request = require("request");


let schema = [
    {
        "title": "Web Scraping in 2016",
        "uri": "https://franciskim.co/2016/08/24/dont-need-no-stinking-api-web-scraping-2016-beyond/",
        "author": "franciskim",
        "points": 133,
        "comments": 80,
        "rank": 1
    }
]



const validate_description = str =>{

    if(str.length > 256) return "ERROR: string too long"

    if(str === " ") return "ERROR: empty response"

    return str;

}

const validate_uri = str =>{

    const uri_validation_checker = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

    // If i wanted this to be really good i would also hit the url and look for a 200
    if(!uri_validation_checker.test(str)) return "NO URL";

    return str;

}

const validate_numerals = int =>{

    if(int < 0) throw "negative number?"

    if(!Number.isInteger(int)) return 0

    return int;

}

const promise_array = [];

const get_hackernews_stories = () =>{


    let get_top_stories = new Promise((resolve,reject)=>{

        request("https://hacker-news.firebaseio.com/v0/topstories.json", (err, res,html) => {

            let body_parse = JSON.parse(html)

            resolve(body_parse)

        })

    }).then(id=>{

        for(let i=0;i<20;i++){

            promise_array.push(new Promise((resolve,reject)=>{

                request("https://hacker-news.firebaseio.com/v0/item/"+id[i]+".json", (err,res,html1)=>{
                        
                        const body_parse1 = JSON.parse(html1)
                        console.log(body_parse1)
                        let schema = {
                            title:      validate_description(body_parse1.title),
                            uri:        validate_uri(body_parse1.url),
                            author:     validate_description(body_parse1.by),
                            points:     validate_numerals(body_parse1.score),
                            comments:   validate_numerals(body_parse1.descendants),
                            rank:       i+1
                        }
                        resolve(schema)
                    })
                })
            )
        }

        Promise.all(promise_array).then(res=>{

            console.log(res)

        })  

    })


}






// const   cheerio = require("cheerio"),
//         request = require("request"),
//         Agent   = require('socks5-http-client/lib/Agent'),
//         randomUseragent = require('random-useragent');
        

// // process.argv.forEach((val, index, array) =>{
// //   // console.log(index + ': ' + val);
// //   console.log(val);
// // });

// var args = process.argv.slice(2);

// console.log(args)

// let schema = [
//     {
//         "title": "Web Scraping in 2016",
//         "uri": "https://franciskim.co/2016/08/24/dont-need-no-stinking-api-web-scraping-2016-beyond/",
//         "author": "franciskim",
//         "points": 133,
//         "comments": 80,
//         "rank": 1
//     },
//     {
//         "title": "Instapaper is joining Pinterest",
//         "uri": "http://blog.instapaper.com/post/149374303661",
//         "author": "ropiku",
//         "points": 182,
//         "comments": 99,
//         "rank": 2
//     }
// ]


// request("http://news.ycombinator.com/", (err, res ,html) => {

//     if (err) throw err;

//     $ = cheerio.load(html)  

//     if (res.statusCode === 200){
        
//         // console.log($(".subtext")[0].children[12])


//         const stories = $(".athing .storylink");

//         let stories_array = [];

//         var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

//         for(let i=0;i<args[2];i++){

//             let comments_parsed = 0;

//             if(!$(".subtext")[i].children[11] === undefined){

//                 const comments_string = $(".subtext")[i].children[11].children[0].data

//                 const comments_trimmed = comments_string.split(" ")

//                 comments_parsed = parseInt(comments_trimmed)

//             } 



//             let schema = {
//                 title:      stories[i].children[0].data,
//                 uri:        stories[i].attribs.href,
//                 author:     $(".subtext .hnuser")[i].children[0].data,
//                 points:     parseInt($(".athing")[i].attribs.id),
//                 comments:   comments_parsed,
//                 rank: (i+1)
//             }

//             if((schema.title === "" || schema.title.length >=256) || (schema.author === "" || (schema.author.length >=256))){
//                 throw "error with empty or long"
//             }
//             console.log(schema)

//             if((schema.uri).includes("item?")){
//                 schema.uri = "https://news.ycombinator.com/" +schema.uri
//             }

//             if(!regex.test(schema.uri)) {
//                 console.log(stories[i])

//                 throw "issue"
//             }

//             stories_array.push(schema)

//         }

//         console.log(stories_array)

//     }
// })




// // request({
    
// //     url: 'http://news.ycombinator.com/',
// //     agentClass: Agent,
// //     headers: {
// //         'User-Agent': randomUseragent.getRandom(),
// //         'Content-Type': 'application/x-www-form-urlencoded'
// //     },
// //     agentOptions: {
// //         socksHost: 'localhost', // Defaults to 'localhost'.
// //         socksPort: 9050 // Defaults to 1080.
// //     }

// // }, (err, res, html) => {
// //     console.log(err)
// //     console.log(res.statusCode)  
    
// // });


// // // request("https://news.ycombinator.com/", (error, response, html) => {
    
    
// // //     if(!error){
        
// // //         const article_list = $(".gel-layout__item.murrayfield__item .lakeside__body")
// // //         const link_title = $(article_list).find("h3 a")[0]
// // //         let article_array = [];

// // //         for(let i=0;i<=article_list.length;i++){

// // //             const link_title = $(article_list[i]).find("h3 a")[0]
// // //             if(link_title.attribs.href === undefined){continue}
// // //             const schema = {

// // //                 _id: "",
// // //                 title: $(link_title).find("span")[0].children[0].data,
// // //                 link: link_title.attribs.href,
// // //                 content: "",
// // //                 date: $(article_list[i]).find("time")[0].attribs["data-timestamp"]

// // //             }

// // //             article_array.push(schema)

// // //         }

// // //         console.log(article_array)        

// // //         // // console.log($(link_title).find("span")[0].children[0].data)

// // //         // const schema = {

// // //         //     _id: "",
// // //         //     title: $(link_title).find("span")[0].children[0].data,
// // //         //     link: link_title.attribs.href,
// // //         //     content: article_list,
// // //         //     date: $(article_list).find("time")[0].attribs["data-timestamp"]

// // //         // }

// // //         // console.log(schema)

// // //         // if($('.vertical-navbox').length > 0) {$('.vertical-navbox').remove()}

// // //         // if($('#mw-content-text').find('p').first().children().text().indexOf("this message may") > -1) {console.log('No result for what you search for')
            
// // //         //     global.event.emit('wikiResult', 'No results')
// // //         // }

// // //     }
// // // })
