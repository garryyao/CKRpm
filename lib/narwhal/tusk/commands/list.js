
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License

var tusk = require("../../tusk");
var util = require("util");
var args = require("args");
var fs = require('file');
var packages = require("packages");

var parser = exports.parser = new args.Parser();
parser.option('-i', '--ignoresystem', 'ignoreSystem')
    .bool()
    .help('don\'t print system packages');

parser.help('lists all installed packages');
parser.helpful();

parser.action(function (options) {
    var self = this;
    Object.keys(packages.catalog).forEach(function (name) {
		var pkg = packages.catalog[name];

		if ( options.ignoreSystem
			&& pkg.directory.canonical().indexOf(
				fs.path( system.prefixes ).canonical() ) != -1 )
			return;

        self.print(
            name + ' - \0magenta(' +
            pkg.description + '\0)'
        );
    });
});

