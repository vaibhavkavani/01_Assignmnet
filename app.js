var Chatbot = require('./chatbot');  
var readline = require('readline');

var r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

r1.setPrompt("You ==> ");
r1.prompt();
r1.on('line', function(message) {
    let botReply = Chatbot.ChatbotReply(message);
    console.log('Bot ==> ' + botReply);
    r1.prompt();
});
r1.on('close', function() {
    console.log("Exiting Chatbot... Goodbye!");
    process.exit(0);
});
