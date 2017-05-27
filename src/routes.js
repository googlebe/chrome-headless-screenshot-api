const _ = require('lodash');
const capture = require('./capture');
const params = require('./params');

function error(text) { return { error: text }; }

function index(config) {
    return (req, res) => {
        const query = req.query || {};
        const body = req.body || {};
        req.data = _.defaults(query, body);
        const reqParams = params.parse(req.data, params.getSchema(config));
        capture.screenshot(config, reqParams, {
            'success': function(response) { 
              res.writeHead(200, {
                'Content-Type': 'image/' + reqParams.format,
                'Content-Length': response.buffer.length
              });
              res.end(response.buffer);
            },
            'error': function(response) {
                res.status(500).json(error(response.message || 'Unknown error.'));
                res.end();
            }
      });
    };
}

module.exports = {
    index: index
};