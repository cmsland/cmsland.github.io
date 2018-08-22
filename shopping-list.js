const actions = { cancelCreate: 'action.shopList.cancelCreate'}
const shopListGreeting = "Choose an option to manage your Shopping list:";

module.exports = function (builder, bot, namedDlgs) 
{
	const subDlgs = namedDlgs.shoppingList;
	const createEvent = (eventName, value, address) => {
		var msg = new builder.Message().address(address);
		msg.data.type = "event";
		msg.data.name = eventName;
		msg.data.value = value;
		return msg;
	}
	// Add root menu dialog
	bot.dialog(subDlgs.menu, [
		function (session) {
			session.send(shopListGreeting);
			builder.Prompts.choice(session, shopListGreeting, 'Create List|Modify List|Delete List|Quit');
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
		function (session, results) {
			if (results && results.processing) return;
			// Reload menu
			session.replaceDialog(namedDlgs.rootMenu);
		}
	]);

	bot.dialog(subDlgs.create, [
		function (session, args, next) {
			var prompt = "What's the new Shopping List name?";
			if (args) {
				if (args.lastItem) prompt = '[' + args.lastItem + '] added to list.'
				else prompt = 'Please input the items(\'done\' for ending input): '
			}
			builder.Prompts.text(session, prompt);
		},
		function (session, results) {
			var item = '';
			if (session.userData.newList) {
				item = results.response;
				if (item.match(/done/i)) {
					//var items = JSON.stringify(session.userData.newList.items).replace(/\"/g, '');
					var reply = createEvent("listCreating", JSON.stringify(session.userData.newList), 
						session.message.address);
        			session.send(reply);
        			session.endDialogWithResult({ processing: true });
					//session.endDialog('New list \'%s\' is created: %s', session.userData.newList.name, items);
					return;
				}
				session.userData.newList.items.push(item);
			}
			else {
				session.userData.newList = {name: results.response, items: []};
			}
			session.replaceDialog(subDlgs.create, { lastItem: item });
		}
	])
	.cancelAction(actions.cancelCreate, 'Ok, cancel the list creation.', {
		matches: /cancel/i
	});
		
		
		
}