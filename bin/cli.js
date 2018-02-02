#!/usr/bin/env node
'use strict';
const meow = require('meow');
const cli = meow(`
    Usage:
        $ azc [command] [options]
    Commands:
        init
        config
        env      
    Options:
        --help         # Output usage information
        --version      # Output the version number
    Examples:
        $ azc config update
`);

if (!cli.input.length) cli.showHelp();

let command = require('../dist')[cli.input.shift()];
if (!command) cli.showHelp();

command.apply(null, cli.input.concat(cli.flags));
