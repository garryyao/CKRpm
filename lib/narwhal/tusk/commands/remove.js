
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License

var tusk = require("../../tusk");
var util = require("util");
var args = require("args");
var packages = require("packages");
var parser = exports.parser = new args.Parser();

parser.help('removes the local copy of package');

parser.action(function (options) {
    var names = options.args,
			catalog = packages.catalog;
	names.map(function (name) {

		if ( name in catalog )
		{
			var pkg = 	catalog[	 name ];
			this.print('Removing package "'+pkg.name+'" from directory: ' + pkg.directory);
			pkg.directory.rmtree();
		}
	});

});

exports.remove = function () {
};

