const   assert      = require('assert'),

        //Library - Rewire  : This lets you dig into private functions
        //          Reason  : I dont like exporting modules for tests

        rewire      = require('rewire'),
        server      = rewire("../server"),

        //Library - Request : Simple abstraction of http.get
        //          Reason  : It cleans things up

        request     = require("request"),
        chai        = require("chai"),
        expect      = chai.expect;

        //chai-json-schema  : JSON schema validator
        //          Reason  : This was not really needed but sped things up a little

        chai.use(require('chai-json-schema'));

describe('validation_functions', function() {

    describe('validate_description()', function(done) {
        
        const validation = server.__get__('validate_description')

        it('should return an ERROR string if the input is not a string', function(done) {

            const input = 443;
            expect(validation(input)).to.equal("Error - for validate_description(): "+input+" is not a string")
            done()

        });

        it('should return an ERROR string if the string is empty', function(done) {

            expect(validation(" ")).to.equal("Error - for validate_description(): is an empty string")
            done()

        });

        it('should return an ERROR string if the string is longer than 256 characters', function(done) {
            
            const long_string = "....................................................................................................\
            ....................................................................................................\
            ................................." //257 dots

            expect(long_string).to.have.length.above(256)
            expect(validation(long_string)).to.equal("Error - for validate_description(): string is too long")
            done()

        });

    });

    describe('validate_uri()', function(done) {
        
        const validation = server.__get__('validate_uri')

        it('should return with an error if the type is wrong', function(done) {
            
            const test_number = 1337;
            expect(validation(test_number)).to.equal("Error - for validate_uri(): "+test_number+" is not a string")
            done()

        });

        it('should return with the original URL if its valid', function(done) {
            
            //I did it this way for readable 
            const   url_1 = "https://news.ycombinator.com/show",
                    url_2 = "https://gist.github.com/jmoy/4dda9b8b8e2b3eb27666bd6ebe208ea3",
                    url_3 = "https://www.nature.com/articles/s41586-018-0102-6",
                    url_4 = "https://arxiv.org/abs/1608.08225",
                    url_5 = "https://docs.truelayer.com/#asynchronous-requests-and-webhooks",
                    url_6 = "http://codex99.com/design/the-hp35.html";

            expect(validation(url_1)).to.equal(url_1)
            expect(validation(url_2)).to.equal(url_2)
            expect(validation(url_3)).to.equal(url_3)
            expect(validation(url_4)).to.equal(url_4)
            expect(validation(url_5)).to.equal(url_5)
            expect(validation(url_6)).to.equal(url_6)
            done()

        });

        it('should return with NO URL if the URL is not valid', function(done) {
            
            //I did it this way for readable 
            const   test_1 = " ",
                    test_2 = 0,
                    test_3 = "https:",
                    test_4 = "http:",
                    test_5 = "/fe/we/few/we",
                    test_6 = "httpsss://www.google.co.uk/";

            expect(validation(test_2)).to.equal("Error - for validate_uri(): "+test_2+" is not a string")
            expect(validation(test_1)).to.equal("Error - for validate_uri(): "+test_1+" is not a valid URL")
            expect(validation(test_3)).to.equal("Error - for validate_uri(): "+test_3+" is not a valid URL")
            expect(validation(test_4)).to.equal("Error - for validate_uri(): "+test_4+" is not a valid URL")
            expect(validation(test_5)).to.equal("Error - for validate_uri(): "+test_5+" is not a valid URL")
            expect(validation(test_6)).to.equal("Error - for validate_uri(): "+test_6+" is not a valid URL")
            done()

        });
    });

    describe('validate_numerals()', function(done) {
        
        const validation = server.__get__('validate_numerals')

        it('should return with ERROR: negative number if the number is negative', function(done) {
            
            const   test_1 = -99869,
                    test_2 = -1,
                    test_3 = 0.1,
                    test_4 = -0.1,
                    test_5 = "im a string",
                    test_6 = undefined

            expect(validation(test_1)).to.equal("Error - for validate_numerals(): "+test_1+" is less then 0")
            expect(validation(test_2)).to.equal("Error - for validate_numerals(): "+test_2+" is less then 0")
            expect(validation(test_3)).to.equal("Error - for validate_numerals(): "+test_3+" is not an interger")
            expect(validation(test_4)).to.equal("Error - for validate_numerals(): "+test_4+" is not an interger")
            expect(validation(test_5)).to.equal("Error - for validate_numerals(): "+test_5+" is not an interger")
            expect(validation(test_6)).to.equal(0)
            done()

        });
    });
});

xdescribe('input checker', function() {

    const terminal_inputs = server.__get__('terminal_inputs')
    const stories_to_return = server.__get__('stories_to_return')

    it('should return the number of stories the user specified in terminal from hackernews --posts n', function(done) {
        
        console.log(stories_to_return)
        done()
    })
})

describe('hacker news api calls', function() {
    
    const get_top_stories = server.__get__('get_top_stories')

    const get_hackernews_stories = server.__get__('get_hackernews_stories')

    const test_url = "https://hacker-news.firebaseio.com/v0/topstories.json"
        
    describe('get_top_stories()', function(done) {
    
        it ('Should pass back an array', function(done) {
            
            get_top_stories(test_url).then(res=> {
                
                expect(res).to.be.an('array')
                done()

            }, rej => {
                
                expect(rej).to.be("Error - for get_top_stories(): "+test_url+" is not valid");
                done();
            })
        });

        it ('Should reject on if an invalid url is passed in', function(done) {
            
            const invalid_url = "fwefw"
            expect(()=>get_top_stories(invalid_url)).to.throw("Error - for get_top_stories(): "+invalid_url+" is not valid");
            done()

        });

    });

    describe('get_hackernews_stories()', function(done) {

        const hacker_schema = {
            title: 'hacker news checker',
            type: 'object',
            required: ['title', 'uri', 'author','points','comments','rank'],
            properties: {
                title: {
                    type: 'string'
                },
                uri: {
                    type: 'string'
                },
                author: {
                    type: 'string'
                },
                points: {
                    type: 'number',
                    minimum: 0
                },
                rank: {
                    type: 'number',
                    minimum: 0
                }
            }
        };

        it ('check that everything returned conforms to the schema', function(done) {

            get_hackernews_stories("https://hacker-news.firebaseio.com/v0/topstories.json").then(story_id=>{

                Promise.all(story_id).then((all_stories)=>{

                    all_stories.forEach(story=>{

                        expect(story).to.be.jsonSchema(hacker_schema)

                    })

                    done()
                })
            })
        })
    });
});
