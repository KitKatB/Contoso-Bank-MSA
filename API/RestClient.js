var request = require('request');
var math = require('mathjs')

exports.getAccountInformation = function getAccountData(url, session, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}},
     function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
    });
}

exports.sendNewAccountInformation = function sendNewAccountData(url,session,accname){

    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "owner":  session.conversationData["custName"],
            "accountNumber": math.floor(math.random() * (999999 - 100000 + 1) +100000),
            "accountName": accname,
            "balance": "0",
            "customerNumber": session.conversationData["custnum"],
            "currency": "nzd"
        }
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            
        }
        else{
            console.log(error);
        }
      });
}
