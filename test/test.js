"use strict";



const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');

const should = chai.should();
//const expect = chai.expect();

const server = require('../server.js');
const config = require('../config.js');

let pipeID = "";

chai.use(chaiHttp);

//This test will create, retreive, update and delete a pipeline.
//At the end of this test, there should be zero pipelines in the testing database -- confirm w/ RoboMongo

describe('Pigging Ops', function () {
    before(function () {
        return server.runServer(config.TEST_DATABASE_URL);
    });
    after(function () {
        return server.closeServer();
    });

    //creating a pipeline and assigning a value to pipeID

    it('should create a pipeline on POST', function () {
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
                pipeID = res.body._id;
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys(
                    '_id', 'RCName', 'systemName', 'pipelineName');
            });
    });

    // confirms that a pipeline was created

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

    //updates the closure type in the pipeline object and confirms that the type of closure was updated

    it('should update pipeline on PUT', function () {
        return chai.request(server.app)
            .put('/pipelines/update/' + pipeID)
            .send({
                closure: "Update Closure"
            })
            .then(function (res) {
                res.should.have.status(204);
                return chai.request(server.app)
                    .get('/pipelines')
                    .then(function (res) {
                        res.body[0].closure.should.be.a('string');
                        res.body[0].closure.should.equal('Update Closure');
                    })
            });
    });

    //deletes the pipeline that was created and confirms that it has been deleted by finding zero pipelines in the database

    it('should delete a pipeline on DELETE', function () {
        return chai.request(server.app)
            .delete('/pipelines/delete/' + pipeID)
            .then(function (res) {
                res.should.have.status(204);
                return chai.request(server.app)
                    .get('/pipelines')
                    .then(function (res) {
                        // console.log(res.body);
                        res.body.length.should.equal(0);
                        //res.should.have.status(401);
                    });
            });
    })

});
