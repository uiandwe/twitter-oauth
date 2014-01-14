module.exports = init;
function init(app) {
  var pkginfo = require('./package');
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  
  var TwitterStrategy = require('passport-twitter').Strategy;
  
   passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
    passport.use(new TwitterStrategy({
    consumerKey: pkginfo.oauth.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: pkginfo.oauth.twitter.TWITTER_CONSUMER_SECRET,
    callbackURL: pkginfo.oauth.twitter.callbackURL
  }, function(token, tokenSecret, profile, done) {
    //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // req.session.passport 정보를 저장하는 단계이다.
    // done 메소드에 전달된 정보가 세션에 저장된다.
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //
    return done(null, profile);
  }));
  
  
  app.get('/auth/twitter', passport.authenticate('twitter'));
  //
  // redirect 실패/성공의 주소를 기입한다.
  //
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/'
  }));
  app.get('/logout', function(req, res){
    //
    // passport 에서 지원하는 logout 메소드이다.
    // req.session.passport 의 정보를 삭제한다.
    //
    req.logout();
    res.redirect('/');
  });
}