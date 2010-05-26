
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- Hannes Walln?fer

var system = require("system");
var fs = require("file");
var args = require("args");
var util = require("util");
var tusk = require('narwhal/tusk');
var parser = exports.parser = new args.Parser();

parser.help('CKEditor/CKFinder plugins manager.' );

parser.command( 'list', function()
{
	tusk.main( [ 'tusk', 'list', '-i' ].concat( arguments[ 0 ].args ) );
}).help( 'lists all installed plugins' );

parser.command( 'install', function()
{
	var installDir = fs.path(system.packages).join( 'plugins' );
	var args = [ 'tusk', 'install', '-p', installDir ].concat( arguments[ 0 ].args );
	tusk.main( args );
}).help( 'Install the named plugin(s). It will \
attempt a local installation and if that fails, \
it will attempt to download and install the \
most recent version of the plugin you want.' );

parser.command( 'uninstall', function()
{
	tusk.main( [ 'tusk', 'remove' ].concat( arguments[ 0 ].args ) );
}).help( 'Remove a locally installed plugin' );

parser.command( 'search', function()
{
	tusk.main( [ 'tusk', 'search' ].concat( arguments[ 0 ].args ) );
}).help( 'List or query the availability of the named plugin(s)' );

parser.helpful();

// run it

exports.main = function (args) {
    var options = parser.parse(args);
    if (!options.acted)
        parser.printHelp(options);
};

if (module.id == require.main)
    exports.main(system.args);

