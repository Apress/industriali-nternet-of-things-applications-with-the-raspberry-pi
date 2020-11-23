run:
	ln -s /usr/lib/node_modules node_modules
	electron-rebuild --module-dir=node_modules/onoff
	xinit /usr/bin/electron main.js --no-sandbox -- -nocursor