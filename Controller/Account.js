var rest = require('../API/Restclient');
var builder = require('botbuilder');

exports.getAccounts = function getAccountsData(custnum,session){
    var url = "http://contosokb.azurewebsites.net/tables/contosoAccounts";
    rest.getAccountInformation(url, session, handleDisplayAccountsResponse)
};

function handleDisplayAccountsResponse(message, session){
    
    var accounts = JSON.parse(message);
    var attachment = [];
    for (var index in accounts) {
        var customerNumber = accounts[index].customerNumber;
        var accountNumber = accounts[index].accountNumber;
        var accountName = accounts[index].accountName;
        var balance = accounts[index].balance;

        var card = new builder.HeroCard(session)
            .title(accountName)
            .subtitle("Account Number: "+ accountNumber)
            .text("Balance: $"+balance);
        console.log(customerNumber);
        if(customerNumber ===  session.conversationData["custnum"]){
            attachment.push(card);
        }
        else{}
    }

    var message = new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments(attachment);
    session.send(message);
}

exports.openAccount = function openAccount(accname,session){
    var url = "http://contosokb.azurewebsites.net/tables/contosoAccounts";
    rest.sendNewAccountInformation(url,session,accname);
}
