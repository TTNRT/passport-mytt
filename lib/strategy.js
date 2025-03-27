var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError

/**
 * `Strategy` constructor.
 *
 * The myTT authentication strategy authenticates requests by delegating to
 * myTT using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`     your myTT application's Client ID
 *   - `clientSecret` your myTT application's Client Secret
 *   - `callbackURL`  URL to which myTT will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new myTTStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/mytt/callback',
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 * @param {Object} options
 * @param {Function} verify
 * @api public
 *
 */
function Strategy(options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://my.ttnrtsite.me/oauth/authorize'
  options.tokenURL = options.tokenURL || 'https://my.ttnrtsite.me/oauth/token'
  OAuth2Strategy.call(this, options, verify)
  this._userProfileURL = options.userProfileURL || 'https://my.ttnrtsite.me/oauth/userinfo'
  this._oauth2.useAuthorizationHeaderforGET(true)
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from myTT.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `id`               user ID
 *   - `username`         username
 *   - `email`            email
 *   - `fullname`         full name
 *   - `avatar`           avatar URL (provided by Gravatar)
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */

util.inherits(Strategy, OAuth2Strategy);
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json
    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err))
    }
    try {
      json = JSON.parse(body)
    } catch (ex) {
      return done(new Error('Failed to parse user profile'))
    }
    var profile = Profile.parse(json)
    profile.provider  = 'mytt'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}

module.exports = Strategy;