const request = require('request');
const rp = require('request-promise');

/**
 * Base http service
 *
 * @class HttpService
 */
class HttpService {

  /**
   * Creates an instance of HttpService.
   *
   * @param {String} baseUrl url of service
   * @param {String} auth basic authorization data for service, format 'username:password'
   * @memberOf HttpService
   */
  constructor(baseUrl, auth, options) {
    if (!baseUrl) {
      throw new Error('baseUrl should be defined');
    }
    this.baseUrl = baseUrl;
    if (auth) {
      const lp = auth.split(':');
      this.auth = { user: lp[0], pass: lp[1] };
    }
    this._options = options;
  }

  /**
   * GET method, expects JSON in response
   * 
   * @param {string} [path=''] query path
   * @param {any} queryStringParams 
   * @returns 
   * @memberof HttpService
   */
  getAndReturnJsonPromise(path = '', queryStringParams) {
    const requestOptions = {
      method: 'GET',
      baseUrl: this.baseUrl,
      uri: encodeURI(path),
      json: true,
      auth: this.auth,
      qs: queryStringParams
    };
    Object.assign(requestOptions, this._options);
    return rp(requestOptions);
  }
}

module.exports = HttpService;
