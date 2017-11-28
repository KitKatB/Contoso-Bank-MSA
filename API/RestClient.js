var request = require('request');

exports.getAccountInformation = function getAccountData(url, session, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}},
     function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
        console.log("ABBBBBBBBBBBBBBB");
    });
}