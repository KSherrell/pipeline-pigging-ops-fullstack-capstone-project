const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect();

//start and close server imported from ../server.js
//const {
//    app,
//    runServer,
//    closeServer
//} = require('../server');


//import TEST_DATABASE_URL from.. / config
//const {
//    DATABASE_URL,
//    TEST_DATABASE_URL
//} = require('../config');


const server = require('../server.js');
const config = require('../config.js');



chai.use(chaiHttp);

describe('Pigging Ops', function () {
    before(function () {
        return server.runServer(config.TEST_DATABASE_URL);
    });
    after(function () {
        return server.closeServer();
    });

    it('should list pipelines on GET', function () {
        return chai.request(server.app)
            .get('/pipelines')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(
                        'RCName', 'systemName', 'pipelineName', 'launcherName', 'receiverName', 'pipelineSize', 'product', 'acceptablePigs', 'closure', 'piggingFrequency', 'dateAdded', 'pipelineActive')
                });
            });
    });

    it('should list users on GET', function () {
        return chai.request(server.app)
            .get('/users/requests')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.above(0);
                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(
                        'fname', 'lname', 'email')
                });
            });
    });

    it('should create a pipeline on CREATE', function () {
        return chai.request(server.app)

            .post('/pipelines/create')
            .send({
                RCName: "RC Test Name",
                systemName: "System Test Name",
                pipelineName: "Pipeline Test Name",
                launcherName: "Launcher Test Name",
                receiverName: "Receiver Test Name",
                pipelineSize: "6",
                product: "Gas",
                acceptablePigs: "cup",
                closure: "Test Closure",
                piggingFrequency: "15",
                dateAdded: "01-18-2018",
                pipelineActive: "1"

            })
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                    'RCName', 'systemName', 'pipelineName');
            });
    });

    it('should delete a pipeline on DELETE', function () {
        return chai.request(server.app)

            .delete('/pipelines/create')
            .send({
            RCName: "RC Test Name",
            systemName: "System Test Name",
            pipelineName: "Pipeline Test Name",
            launcherName: "Launcher Test Name",
            receiverName: "Receiver Test Name",
            pipelineSize: "6",
            product: "Gas",
            acceptablePigs: "cup",
            closure: "Test Closure",
            piggingFrequency: "15",
            dateAdded: "01-18-2018",
            pipelineActive: "1"

        })
            .then(function (res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
                'RCName', 'systemName', 'pipelineName');
        });
    });


});
