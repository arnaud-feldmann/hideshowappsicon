const Main = imports.ui.main;
const dash = Main.overview.dash;
const showAppsIcon = dash._showAppsIcon;
let dashHeightEvent = null;

function hideShowAppsIcon() {
	dash.disconnect(dashHeightEvent);
	showAppsIcon.visible = false;
}

function enable() {
	if (Main.layoutManager._startingUp) {
		dashHeightEvent = dash.connect('notify::height', hideShowAppsIcon);
		return;
	}
	hideShowAppsIcon();
}

function disable() {
	dash.disconnect(dashHeightEvent);
	showAppsIcon.visible = true;
	showAppsIcon.show(true);
}

