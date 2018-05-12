const   assert      = require('assert'),
        path        = require('path'),
        rewire      = require('rewire'),
        server      = rewire("../server"),
        expect      = require('chai').expect;

describe('validation_functions', function() {
    
    describe('Validate strings for title and author', function(done) {
        
        it('should return an ERROR string if the string is empty', function(done) {
            
            const validation = server.__get__('validate_description')
            
            const checker = validation(" ")

            expect(checker).to.equal("ERROR: empty response")

            done()

        });

        it('should return an ERROR string if the string is longer than 256 characters', function(done) {
            
            const validation = server.__get__('validate_description')
            
            const long_string = "....................................................................................................\
            ....................................................................................................\
            ................................."

            const checker = validation(long_string)

            expect(long_string).to.have.length.above(256)

            expect(checker).to.equal("ERROR: string too long")

            done()

        });

    });

    describe('Validate strings for title and author', function(done) {
        
        it('should return with the original URL if its valid', function(done) {
            
            const validation = server.__get__('validate_uri')

            expect(validation("https://news.ycombinator.com/show")).to.equal("https://news.ycombinator.com/show")
            expect(validation("https://gist.github.com/jmoy/4dda9b8b8e2b3eb27666bd6ebe208ea3")).to.equal("https://gist.github.com/jmoy/4dda9b8b8e2b3eb27666bd6ebe208ea3")
            expect(validation("https://www.nature.com/articles/s41586-018-0102-6")).to.equal("https://www.nature.com/articles/s41586-018-0102-6")
            expect(validation("https://arxiv.org/abs/1608.08225")).to.equal("https://arxiv.org/abs/1608.08225")
            expect(validation("https://www.independent.co.uk/news/world/australasia/james-harrison-man-golden-arm-blood-donor-60-years-millions-babies-a8347896.html")).to.equal("https://www.independent.co.uk/news/world/australasia/james-harrison-man-golden-arm-blood-donor-60-years-millions-babies-a8347896.html")
            expect(validation("http://codex99.com/design/the-hp35.html")).to.equal("http://codex99.com/design/the-hp35.html")
            
            done()

        });

        it('should return with NO URL if the URL is not valid', function(done) {
            
            const validation = server.__get__('validate_uri')
            
            expect(validation(" ")).to.equal("NO URL")
            expect(validation(0)).to.equal("NO URL")
            expect(validation("https:")).to.equal("NO URL")
            expect(validation("http:")).to.equal("NO URL")
            expect(validation("/fe/we/few/we")).to.equal("NO URL")
            expect(validation("httpsss://www.google.co.uk/")).to.equal("NO URL")

            done()

        });

    });

});
