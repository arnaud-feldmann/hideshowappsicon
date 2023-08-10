const Main = imports.ui.main;
const dash = Main.overview.dash;
const showAppsIcon = dash._showAppsIcon;
const { GLib, Gio } = imports.gi;
let dashHeightEvent = null;
let too_early = false;

function hideIcon() {
	showIcon();
	showAppsIcon.visible = false;
}

function showIcon() {
	showAppsIcon.visible = true;
	showAppsIcon.show(true);
}

function wait_for_reinit() {
	let n = 0;
	GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
		if (n > 3) throw GLib.Error.new_literal(Gio.io_error_quark(), Gio.IOErrorEnum.TIMEOUT, "Incohesive timer"); 
		n++;
		if (too_early) return GLib.SOURCE_CONTINUE;
		reinit();
		return GLib.SOURCE_REMOVE;
	});
}

function reinit() {
	if (too_early) wait_for_reinit();
	else {
		too_early = true;
		showIcon();
		hideIcon();
		GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
			too_early = false;
			return GLib.SOURCE_REMOVE;
		});
	}
	return undefined;
}


function enable() {
	hideIcon();
	dashHeightEvent = dash.connect("notify::height", reinit);
}

function disable() {
	showIcon();
	dash.disconnect(dashHeightEvent);
}

