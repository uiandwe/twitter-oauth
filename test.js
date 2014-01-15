var     OAuth = require('oauth').OAuth,
        read = require('read');

var config = {
        requestTokenUrl: "https://apis.daum.net/oauth/requestToken",
        authorizeUrl: "https://apis.daum.net/oauth/authorize",
        accessTokenUrl: "https://apis.daum.net/oauth/accessToken",
        consumerKey: "5amJdyjsuys9UrG9QBQAQw",
        consumerSecret: "8b7quElC039EV9RfZjb7XjsMpJns21X1r4EFAV9Jw",
        callbackUrl: "https://twitter-oauth-c9-uiandwe.c9.io/auth/twitter/callback",
        apiUrl: "https://apis.daum.net"
}



var oauth = new OAuth(config.requestTokenUrl, config.accessTokenUrl,
        config.consumerKey, config.consumerSecret,
        "1.0", config.callbackUrl, "HMAC-SHA1");

// 2. Request Token 요청
oauth.getOAuthRequestToken(function(err, requestToken, requestTokenSecret, results) {
        if (err) {
                console.log(err);
        } else {

                // 3. 사용자 인증(Authentication) 및 권한 위임(Authorization)
                console.log(config.authorizeUrl + "?oauth_token=" + requestToken);
                console.log("웹브라우저에서 위 URL로 가서 인증코드를 얻고 입력하세요.");

                // 4. verifier 입력 받기
                read({prompt: "verifier: "}, function(err, verifier) {
                        if(err) {
                                console.log(err);
                        } else {


                               
                        }
                });
        }
});