var subDlgs = { create: 'shopList.create', modify: '', del: '' };
var actions = { cancelCreate: 'action.shopList.cancelCreate'}
var shopListGreeting = "Hello... I'm the Shopping List ChatBot.";

module.exports = function (builder, bot, rootDlg) 
{
	// Add root menu dialog
	bot.dialog(rootDlg, [
		function (session) {
			session.send(shopListGreeting);
			builder.Prompts.choice(session, "Choose an option:", 'Create List|Modify List|Delete List|Quit');
		},
		function (session, results) {
			switch (results.response.index) {
				case 0:
					session.beginDialog(subDlgs.create);
					break;
				case 1:
					session.beginDialog(subDlgs.modify);
					break;
				case 2:
					session.beginDialog(subDlgs.del);
					break;
				default:
					session.endDialog();
					break;
			}
		},
		function (session) {
			// Reload menu
			session.replaceDialog(rootDlg);
		}
	]).reloadAction(rootDlg, null, { matches: /^(shopping list|shop list)/i });

	bot.dialog(subDlgs.create, [
		function (session) {
			builder.Prompts.text(session, "What's the new Shopping List name?");
		},
		function (session, results) {
			session.send('New Shopping List: \'%s\' is created, please input the items: (\'done\' for ending input.)', results.response);
		},
		function (session, results) {
			for(var i=0; i<10; i++) builder.Prompts.text(session);
		}
	])
	.cancelAction(actions.cancelCreate, 'Ok, complete the creation.', {
		matches: /done/i
	})
	.cancelAction(actions.cancelCreate, 'Ok, cancel the creation.', {
		matches: 'Cancel'
	});
		
		
		
}