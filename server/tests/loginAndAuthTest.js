/**
 * Created by pzheng on 14/02/2017.
 */
'use strict';
var URI = require('./spec_helper'); // make sure this is on top
var should = require('should');
var request = require('supertest');
var app = require('../src/server.js');
var UserModel = require('../src/models/userModel.js');
var migration = require('../src/schema/db-migration');
var constants = require('../src/config/constants');
var async = require('async');
var dbsqls = require('../src/schema/dbsql');

var validUser = { username: 'foo',
                  userpass: 'secret',
                  firstname: 'foo',
                  lastname: 'bar',
                  email: 'foobar@example.com',
                  rolegroup: constants.userRoles.admin
                };
var upSQLs = dbsqls.upSQLs;
var downSQLs = dbsqls.downSQLs;
var resetSQLs = dbsqls.resetSQLs;

describe('*************** REGISTRATION WITH AUTH ***************', function() {
  before( function(done) {
    async.series([
      function(callback) {
        UserModel.users = [];  // reset memory
        migration.run(downSQLs, function(err) {
          callback(err);
        });
      },
      function(callback) {
        migration.run(upSQLs, function(err) {
          callback(err);
        });
      }
    ],
    function(err, results) {
      if(err) {
        throw err;
      }
      done();
    });
  });


  // Do not have to drop objects anyway
  // after( function(done) {
  //  migration.run(downSQLs, function(err) {
  //    if(err) {
  //      throw err;
  //    }
  //    done();
  //  });
  // });

  it('should FAIL [422] to create a user without parameters', function(done) {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .expect(422)
      .end(function(err, res) {
        if(err) {done(err);}
        res.body.error.should.be.eql('You must enter an user name.');
        done();
      });
  });

  it('should FAIL [422] to create a user without email address', function(done) {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send({username:'foo'})
      .expect(422)
      .end(function(err, res) {
        if(err) {done(err);}
        res.body.error.should.be.eql('You must enter an email address.');
        done();
      });
  });

  it('should FAIL [422] to create a user without password', function(done) {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send({username:'foo', email: 'bar@example.com', lastname: 'foo', firstname: 'bar'})
      .expect(422)
      .end( function(err, res) {
        if (err)  { done(err); }
        res.body.error.should.be.eql('You must enter a password.');
        done();
      });
  });

  it('should CREATE [201] a valid user', function(done) {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(201)
      .end(function(err, res) {
        if (err) { done(err); }
        res.body.token.should.be.an.instanceOf(String);
        res.body.user.should.be.an.instanceOf(Object);
        done();
      });
    });

  it('should FAIL [422] to create a user with occupied user name', function(done) {
    request(app)
      .post('/api/auth/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(422)
      .end(function(err, res) {
        if(err) { done(err); }
        res.body.error.should.be.eql('That user name is already in use.');
        done();
      });
  });
});

describe('*************** AUTH LOGIN ***************', function() {
  before( function(done) {
    async.series([
        function(callback) {
          UserModel.users = [];  // reset memory
          migration.run(resetSQLs, function(err) {
            callback(err);
          });
        }
      ], function(err, results) {
        if(err) {
          throw err;
        }
        request(app)
          .post('/api/auth/register')
          .set('X-Real-IP', URI)
          .type('form')
          .send(validUser)
          .expect(201)
          .end( function(err) {
            if (err) {
              done(err);
            }
            done();
          });
      }
    );
  });

  after( function(done) {
    migration.run(downSQLs, function(err) {
      if(err) {
        throw err;
      }
      done();
    });
  });

  it('should FAIL [400] to login without parameters', function(done) {
    request(app)
      .post('/api/auth/login')
      .set('X-Real-IP', URI)
      .expect(400, done);
  });

  it('should FAIL [400] to login with bad parameters', function(done) {
    request(app)
    .post('/api/auth/login')
    .set('X-Real-IP', URI)
    .type('form')
    .send({ wrongparam: 'err' })
    .expect(400, done);
  });

  it('should FAIL [401] to login with invalid credentials', function(done) {
    request(app)
    .post('/api/auth/login')
    .set('X-Real-IP', URI)
    .type('form')
    .send({ username: 'err', userpass: '22' })
    .expect(401, done);
  });

  it('should LOGIN [200] with valid credential', function(done) {
    request(app)
    .post('/api/auth/login')
    .set('X-Real-IP', URI)
    .type('form')
    .send(validUser)
    .expect(200)
    .end( function(err, res) {
      if (err) { done(err); }
        res.body.token.should.be.an.instanceOf(String);
        res.body.user.should.be.an.instanceOf(Object);
        done();
      });
  });
});
