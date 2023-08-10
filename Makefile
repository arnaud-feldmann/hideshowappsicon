all: hideshowappsicon@af.zip

install: hideshowappsicon@af.zip
	gnome-extensions install --force hideshowappsicon@af.zip

clean:
	rm -f hideshowappsicon@af.zip

uninstall:
	gnome-extensions uninstall --quiet hideshowappsicon@af || true

hideshowappsicon@af.zip: extension.js metadata.json
	zip hideshowappsicon@af.zip extension.js metadata.json

