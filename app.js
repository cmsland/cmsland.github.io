var restify = require('restify');
var builder = require('botbuilder');
var rootDlg = require('./root');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

//var featureDlgs = { shoppingList: 'shopList.root'};

const greetings = "Hey, this is your shopping assistant.";

var bot = new builder.UniversalBot(connector, function (session) {
	if(session.message.text.match(/^hi$/i)) {
		session.beginDialog(rootDlg.name);
	} else {
    	session.send("Robot said: %s", session.message.text);
    }
    //session.beginDialog(featureDlgs.shoppingList);
});

bot.set('storage', new builder.MemoryBotStorage());

bot.dialog('firstRun', function (session) {
console.log(session.userData.firstRun);
    session.userData.firstRun = true;
    session.endDialog(greetings);
    session.beginDialog(rootDlg.name);
}).triggerAction({
    onFindAction: function (context, callback) {
        // Only trigger if we've never seen user before
        if (!context.userData.firstRun) {
            // Return a score of 1.1 to ensure the first run dialog wins
            callback(null, 1.1);
        } else {
            callback(null, 0.0);
        }
    }
});

rootDlg.bind(builder, bot);

var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);
/*
bot.dialog('GreetingDialog',
    (session) => {
        session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
})

bot.dialog('HelpDialog',
    (session) => {
        session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
})

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
})
*/
bot.dialog('EmptyCartDialog',
    (session) => {
        session.send('EmptyCart');
        session.endDialog();
    }
).triggerAction({
    matches: 'EmptyCart'
});

bot.on("event", function (event) {
    var msg = new builder.Message().address(event.address);
    msg.data.textLocale = "en-us";
    if (event.name === "listCreated") {
        msg.data.text = event.value;
    }
    bot.send(msg);
    event.routing.replaceDialog(rootDlg.name);
});


