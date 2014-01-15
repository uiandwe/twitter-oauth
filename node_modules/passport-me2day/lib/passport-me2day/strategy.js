/**
 * Module dependencies.
 */
var passport = require('passport')
  , http = require('http')
  , querystring = require('querystring')
  , util = require('util')
  , crypto = require('crypto')
  , BadRequestError = require('./errors/badrequesterror')
  , VerificationError = require('./errors/verificationerror');


/**
 * `Strategy` constructor.
 *
 * The me2day authentication strategy authenticates requests using
 * me2day authentication process.
 * It's like OAuth but not same.
 *
 * Applications must supply a `verify` callback which accepts a `userKey`,
 * and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `userKey`        identifies client to me2day
 *   - `nonce`          your own 8 digit of HEX code. (ex: '1234ABCD')
 *   - `callbackURL`    URL to which me2day will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new Me2dayStrategy({
 *         userKey: '--insert-me2day-user-key-here--'
 *         , nonce: '--insert-me2day-nonce-here--'
 *         , callbackURL: "http://127.0.0.1:3000/auth/me2day/callback"
 *       },
 *       function(userKey, profile, done) {
 *         User.findOrCreate(profile, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.nonce = options.nonce || '1234ABCD';

  if (!options.userKey) throw new Error('me2day authentication requires an userKey option');
  if (!verify) throw new Error('me2day authentication strategy requires a verify function');
  
  passport.Strategy.call(this, options, verify);
  
  this.name = 'me2day';
  this._verify = verify;
  this._userKey = options.userKey;
  this._key = options.sessionKey || 'me2day';

  var md5 = crypto.createHash('md5');
  this._autenticationKey = options.nonce + md5.update(options.nonce + options.userKey).digest('hex');
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);


/**
 * Authenticate request by delegating to me2day
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  if (!req.session) { return this.error(new Error('me2day authentication requires session support')); }
  
  var self = this;
  
  if (req.query && req.query['token']) {
    // The request being authenticated contains an token parameter in the
    // query portion of the URL.  This indicates that the service provider has
    // redirected the user back to the application, after authenticating the
    // user and obtaining their authorization.
    //
    // if the user reject, result parameter in the query portion of the URL
    // is false
    if (!req.session[self._key]) { return self.error(new Error('failed to find token in session')); }
    if (!req.query['result']) { return self.error(new Error('the user reject authentication')); }
    if (req.session[self._key]['token'] != req.query['token']) { return self.error(new Error('token is not correct')); }

    var token = req.query['token'];
    var userId = req.query['user_id'];
    var userKey = req.query['user_key'];

    delete req.session[self._key]['token'];
    if (Object.keys(req.session[self._key]).length == 0) {
      delete req.session[self._key];
    }
    // load user infomation
    http.get({
      host: 'me2day.net'
      , path: '/api/get_person/' + userId + '.json'
    }, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        var profile = JSON.parse(data);

        self._verify(userKey, profile, function (err, user, info) {
          if (err) { return self.error(err); }
          if (!user) { return self.fail(info); }
          self.success(user, info);
        });
      });
    }).on('error', function(e) {
        return self.error(e);
    });
  } else {
    // request login url to me2day
    // and redirect the user to login URL
    var query = querystring.stringify({ akey: this._userKey});

    http.get({
        host: 'me2day.net'
        , path: '/api/get_auth_url.json?' + query
      }, function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
          var result = JSON.parse(data);
          if (result.url && result.token) {
            if (!req.session[self._key]) { req.session[self._key] = {}; }
            req.session[self._key]['token'] = result.token;

            self.redirect(result.url);
          } else {
            return self.error(result);
          }
        });
    }).on('error', function(e) {
      return self.error(e);
    });
  }
};

/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
