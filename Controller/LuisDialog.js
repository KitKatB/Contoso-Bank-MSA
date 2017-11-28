var builder = require('botbuilder');
var account = require('./Account');
var rest = require('../API/Restclient');
// Some sections have been omitted

exports.startDialog = function (bot) {
    
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/fc1fbf3e-8f66-41e3-b6b9-f8f3f9222bf2?subscription-key=d836918e94e54da7adcadbed9185086a&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('WelcomeIntent', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                session.beginDialog("Verify")          
            } else {
                next();
            }
        }
        // function (session, args, next) {
        //     session.send("Hi! Would you like to manage your accounts or bills?");
        // }

    ]).triggerAction({matches: 'WelcomeIntent'});

    bot.dialog('ManageAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                session.beginDialog("Verify")          
            } else {
                next();
            }

        },
        function(session, results, next){
            console.log("CCCCCCCCCCCCCCC");
            builder.Prompts.text(session,"Here are your current accounts. You can either transfer money between accounts, open a new account or pay someone with their account number.")
            account.getAccounts(session.conversationData["custnum"],session);
        }
    ]).triggerAction({matches: 'ManageAccount'});

    bot.dialog('OpenAccount',[
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                session.beginDialog("Verify")          
            } else {
                next();
            }

        },
        function(session, results, next){
            builder.Prompts.text(session,"What would you like to call this account?")
               
        },
        function(session, results, next){
             if (results.response) {
                var accname = results.response;
                account.openAccount(accname,session);
             }
             console.log("TTTTTTTTTTTTT");
        }
    ]).triggerAction({matches: 'OpenAccount'});


    bot.dialog('Verify', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                builder.Prompts.text(session, "Hi! Before we can start, please enter your customer number.");          
            } else {
                next(); 
            }
        },

        function (session, results, next) {
            //if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["custnum"] = results.response;
                }
            //}
            var url = "http://contosokb.azurewebsites.net/tables/contosoAccounts";
            rest.getAccountInformation(url,session,assignOwnerName)
            session.send("Hi! Would you like to manage your accounts or bills?");
            //session.send(session.conversationData["custnum"]);
        },

    ])

    function assignOwnerName(message,session){
        var accounts = JSON.parse(message);
        session.conversationData["custName"] = accounts[1].owner;
        //session.send(session.conversationData["custName"]);
    }

}