
// -- kriskowal Kris Kowal Copyright (C) 2009-2010 MIT License
// -- Hannes Walln?fer

var system = require("system");
var fs = require("file");
var args = require("args");
var util = require("util");
var json = require( "json" );
var tusk = require('narwhal/tusk');
var parser = exports.parser = new args.Parser();

parser.help('CKEditor/CKFinder plugins manager.' );

parser.command( 'setup', function()
{
	var catalog = tusk.readCatalog(),
		packages = catalog.packages;

	// Check package descriptor existence, otherwise
	// create it from analysing the plugin file.
	function checkDescriptor( dir, cleanup )
	{
		var descriptor = dir.join( 'package.json' ),
			pluginFile;

		if ( cleanup )
		{
			descriptor.isFile() && descriptor.remove();
			return;
		}
		
		if ( !descriptor.isFile() )
		{
			complete = 0;
			parser.print( "Adding missing descriptor in: " + dir );

			if ( dir.join( 'plugins' ).isDirectory() )
			{
				descriptor.write(
						json.encode( {
							name : "core",
							author : "CKSource",
							description: "CKEditor runtime",
							packages : [ "plugins" ]
						}, null, 4 ),
						{charset: 'utf-8'} );
			}
			else if ( ( pluginFile = dir.join( 'plugin.js' ) ).isFile() )
			{
				var name, deps = [], desc = "";

				var content = pluginFile.read( {charset: 'utf-8'} );

				content.replace( /@file(?:Overview)?(.*?)\./i, function ( match, g1 ) { desc = g1; } );
				content.replace( /CKEDITOR\.plugins\.add\(\s*['"](.*?)['"]/, function ( match, g1 ) { name = g1; } );
				content.replace( /requires\s*:\s*(.*?])/, function ( match, g1 ) { deps = deps.concat(eval(g1)); } );

				descriptor.write(
						json.encode( {
							name : name,
							author : "CKSource",
							description: desc,
							dependencies : deps
						}, null, 4 ),
						{charset: 'utf-8'} );
			}
		}

		descriptor = json.decode(descriptor.read( {charset: 'utf-8'} ));
		if ( !packages[ descriptor.name ] )
			packages[ descriptor.name ] = descriptor;
	}

	var sourceDir = fs.path(system.packages),
			pluginsDir = sourceDir.join( 'plugins' );
	checkDescriptor( sourceDir );
	pluginsDir.list().forEach( function( name )
	{
		if ( name == '.svn' )
			return;
		checkDescriptor( pluginsDir.join( name ) );
	});

	tusk.writeCatalog( catalog );

	parser.print( 'All local plugins indexed, check them with "plugin list".' );
}).help( 'Indexes local plugins that have no description file into catalog.' );

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

