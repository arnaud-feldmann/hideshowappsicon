const Main = imports.ui.main;
const dash = Main.overview.dash;
const showAppsIcon = dash._showAppsIcon;
const { GLib, Gio } = imports.gi;
let dash_height_event = null;
let source_timer_wait = null; 
let source_timer_block = null;
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
	source_timer_wait = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
		if (n > 3) throw GLib.Error.new_literal(Gio.io_error_quark(), Gio.IOErrorEnum.TIMEOUT, "Incohesive timer"); 
		n++;
		if (too_early) return GLib.SOURCE_CONTINUE;
		reinit();
		source_timer_wait = null;
		return GLib.SOURCE_REMOVE;
	});
}

function reinit() {
	if (too_early) wait_for_reinit();
	else {
		too_early = true;
		showIcon();
		hideIcon();
		source_timer_block = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 2, () => {
			source_timer_block = null;
			too_early = false;
			return GLib.SOURCE_REMOVE;
		});
	}
	return undefined;
}


function enable() {
	hideIcon();
	dash_height_event = dash.connect("notify::height", reinit);
}

function disable() {
	showIcon();
	dash.disconnect(dash_height_event);
	dash_height_event = null;
	if (source_timer_wait !== null) GLib.Source.remove(source_timer_wait);
	source_timer_wait = null;
	if (source_timer_block !== null) GLib.Source.remove(source_timer_block);
	source_timer_block = null;
}

