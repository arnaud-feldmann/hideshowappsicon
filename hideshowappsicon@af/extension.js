const Main = imports.ui.main;
const dash = Main.overview.dash;
const showAppsIcon = dash._showAppsIcon;
let dashHeightEvent = null;

function enable() {
	disable();
	showAppsIcon.visible = false;
	dashHeightEvent = dash.connect('notify::height', enable);
}

function disable() {
	dash.disconnect(dashHeightEvent);
	showAppsIcon.visible = true;
	showAppsIcon.show(true);
}

