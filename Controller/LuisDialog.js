var builder = require('botbuilder');
var account = require('./Account');
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
                session.send("Hi! Would you like to manage your accounts or bills?")
            }
        }

    ]).triggerAction({matches: 'WelcomeIntent'});

    bot.dialog('ManageAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                session.beginDialog("Verify")          
            } else {
                builder.Prompts.text(session,"Here are your current accounts. You can either transfer money between accounts, open a new account or pay someone with their account number.")
            }
        },
        function(session, results, next){
            account.getAccounts(session.conversationData["custnum"],session);
        }
    ]).triggerAction({matches: 'ManageAccount'});

    bot.dialog('Verify', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["custnum"]) {
                builder.Prompts.text(session, "Hi! Before we can start, please enter your customer number.");          
            } else {
                next(); // Skip if we already have this info.
            }
        },

        function (session, results, next) {
            //if(!isAttachment(session)){
                if (results.response) {
                    session.conversationData["custnum"] = results.response;
                }
            //}
            session.send(session.conversationData["custnum"]);
        },

    ])


}