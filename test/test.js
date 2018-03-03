const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;

// start and close server imported from ../server.js
const {
    app,
    runServer,
    closeServer
} = require('../server');

// import TEST_DATABASE_URL from ../config
const {
    DATABASE_URL,
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

describe('Pigging Ops', function () {
    before(function () {
        return runServer();
    });
    after(funtion() {
        return closeServer();
    });

    it('should list pipelines on GET', function () {
        return chai.request(app)
            .get('/pipelines')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.keys(
                        'RCName', 'systemName', 'pipelineName', 'launcherName', 'receiverName', 'pipelineSize', 'product', 'acceptablePigs', 'closure', 'piggingFrequency', 'dateAdded', 'pipelineActive')
                });
            });
    });


});
