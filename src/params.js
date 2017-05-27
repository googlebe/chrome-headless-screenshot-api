const _ = require('lodash');
const joi = require('joi');

function getSchema(config) {
    const defaultParams = config.api.default_params;
    const schema = {
        url: joi.string().trim().required(),
        delay: joi.number().integer().min(0).max(config.api.max_delay).default(defaultParams.delay),
        format: joi.string().lowercase().trim().valid('jpeg', 'png').default(defaultParams.format),
        width: joi.number().integer().min(1).default(defaultParams.width),
        height: joi.number().integer().min(1).default(defaultParams.height),
        full: joi.boolean().default(defaultParams.full),
        ua: joi.string().default(defaultParams.ua)
    };
    return joi.object().keys(schema);
}

function parseUrl(url) {
    return decodeURI(url);
}

function parse(data, schema) {
    const keys = _.keys(schema.describe().children),
          params = _.pick(data, keys);

    params.url = parseUrl(params.url);
    return _.omitBy(params, (v) => _.isUndefined(v) || _.isNull(v));
}

module.exports = {
    getSchema: getSchema,
    parse: parse
};