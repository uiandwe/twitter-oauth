# Passport-Me2day

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [me2day](http://me2day.net/).

This module lets you authenticate using me2day in your Node.js applications.
By plugging into Passport, me2day authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-me2day

## Usage

#### Configure Strategy

The BrowserID authentication strategy authenticates users using an assertion of
email address ownership, obtained via the BrowserID JavaScript API.  The
strategy requires a `validate` callback, which accepts an email address and calls
`done` providing a user.

The me2day authentication strategy authenticates users using a me2day account,
userKey and nonce. The strategy requires a `verify` callback, which receives
the userKey, as well as `profile` which contains the authenticated user's
me2day profile. The `verify` callback must call `done` providing a user
to complete authentication.

In order to identify your application to me2day, specify the userKey,
nonce, and callback URL within `options`.  The user key is
obtained by [requesting an application key](http://me2day.net/me2/app/get_appkey) at
[me2day](https://me2day.net/) site.

    passport.use(new Me2dayStrategy({
        userKey: '--insert-me2day-user-key-here--'
        , nonce: '--insert-me2day-nonce-here--'
        , callbackURL: "http://127.0.0.1:3000/auth/me2day/callback"
      },
      function(userKey, profile, done) {
        User.findOrCreate(profile, function (err, user) {
          done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'me2day'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/twitter',
      passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signin example](https://github.com/outsideris/passport-me2day/tree/master/examples/signin).

## Credits

  - [JeongHoon Byun](http://github.com/outsideris)

## Licens

e

(The MIT License)

Copyright (c) 2012 JeongHoon Byun <outsideris@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
