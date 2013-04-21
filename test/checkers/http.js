var bag = require('bagofholding'),
  buster = require('buster'),
  http = require('../../lib/checkers/http');

buster.testCase('health - check', {
  'should have FAIL status when an error occurs while sending the request': function (done) {
    function mockRequest(method, url, opts, cb) {
      cb(new Error('some error'));
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost' };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'FAIL');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'some error');
      done();
    }
    http.check(setup, cb);
  },
  'should have OK status when request is successful and there is no checking involved': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost' };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'OK');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, undefined);
      done();
    }
    http.check(setup, cb);
  },
  'should have OK status when request is successful and status code matches': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', statusCodes: [ 200, 301 ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'OK');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Status code 200 as expected');
      done();
    }
    http.check(setup, cb);
  },
  'should have OK status when request is successful and texts exist in request body': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200', body: 'foobar blah' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', texts: [ 'foo', 'blah' ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'OK');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Text foo, blah exists in response body');
      done();
    }
    http.check(setup, cb);
  },
  'should have OK status when request is successful, status code matches, and texts exist in request body': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200', body: 'foobar blah' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', statusCodes: [ 200, 301 ], texts: [ 'foo', 'blah' ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'OK');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Text foo, blah exists in response body');
      done();
    }
    http.check(setup, cb);
  },
  'should have FAIL status when status code does not match': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '400' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', statusCodes: [ 200, 301 ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'FAIL');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Status code 400 does not match the expected 200, 301');
      done();
    }
    http.check(setup, cb);
  },
  'should have FAIL status when text does not exist in response body': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200', body: 'foobar blah' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', texts: [ 'xyz' ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'FAIL');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Text xyz does not exist in response body');
      done();
    }
    http.check(setup, cb); 
  },
  'should have FAIL status when one text exists and another one does not': function (done) {
    function mockRequest(method, url, opts, cb) {
      opts.handlers.xxx({ statusCode: '200', body: 'foobar blah' }, cb);
    }
    this.stub(bag, 'http', { request: mockRequest });
    var setup = { uri: 'http://somehost', texts: [ 'foobar', 'xyz' ] };
    function cb(err, result) {
      assert.isNull(err);
      assert.equals(result.status, 'FAIL');
      assert.equals(result.uri, 'http://somehost');
      assert.equals(result.desc, 'Text xyz does not exist in response body');
      done();
    }
    http.check(setup, cb); 
  }
});