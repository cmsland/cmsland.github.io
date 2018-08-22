const digName = 'root';

const namedDlgs = { 
	rootMenu: 'root',
	shoppingList: { menu: 'shopList', create: 'shopList.create', modify: '', del: '' }
};

const actions = { cancelCreate: 'action.shopList.cancelCreate'}
const shoppingList = require('./shopping-list');

module.exports = {
  name: namedDlgs.rootMenu,
  bind: function (builder, bot) {
	// Add root menu dialog
	bot.dialog(namedDlgs.rootMenu, [
		function (session) {
			builder.Prompts.choice(session, "Please choose an option:", 'Shopping List|Cart|Help');
		},
		function (session, results) {
			switch (results.response.index) {
				case 0:
					session.beginDialog(namedDlgs.shoppingList.menu);
					break;
				case 1:
					//session.beginDialog(.modify);
					break;
				case 2:
					//session.beginDialog(.del);
					break;
				default:
					session.endDialog();
					break;
			}
		}
	]);
	// Bind shopping list menu
	shoppingList(builder, bot, namedDlgs);
  }
		
}