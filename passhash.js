#!/usr/bin/env node
/*
 * passhash
 *
 * password hashing using sha512 and random salt
 *
 * As of 0.0.7 support for bcrypt
 * Author: Alexander Shagla-McKotch <shagla@gmail.com>
 *
 * Contributor: Dave Eddy <dave@daveeddy.com> github.com/bahamas10
 *
 * License: MIT
*/

// initial variables and requires
var prom = require('prompt'),
    crypto = require('crypto'),
    getopt = require('posix-getopt'),
    bcrypt = require('bcrypt'),
    package = require('./package.json');

var format = '{username}:{salt}:{hash}:{iterations}'

/*
 * Usage statement
 *
 * return the usage statement
 */

function usage() {
  return [
    'Usage: passhash',
    '',
    'Easily and securely hash passwords with a variable amount of iterations of SHA512.',
    '',
    'You can also specify to use bcrypt and the number of rounds to use',
    '',
    'Takes in an optional username and number of iterations and then prompts for a password.',
    '',
    'If a username or number of iterations is not provided it will prompt for them.',
    '',
    '-t --hash-type <number>          1 for SHA512 or 2 for bcrypt',
    '-i, --iterations <number>        number of SHA512 iterations (default is set to 5000)',
    '-r, --rounds <number>            number of rounds for bcrypt',
    '-b, --bytes <number>             number of bytes to use for crypto random salt, must be >= 128 (default 128)',
    '-h, --help                       print this message and exit',
    '-u, --username <name>            username to use for entry',
    '-U, --updates                    check for available updates',
    '-f, --format                     change format of output. Not supported if using bcrypt as hash type.',
    '-v, --version                    print the version number and exit',
    '',
    'Deafault output',
    '',
    'username:salt:hash:iterations',
    '',
    'Example format options',
    '',
    'node passhash.js -u test -i 22 -f \'{username} <<>> {salt} <<>> {hash}\'',
    '',
    'Output',
    '',
    'username <<>> salt <<>> hash'
  ].join('\n');
}

/* schema for prompt
 * checks if the username is only letters and numbers
 * prompts for password twice, hidding input
 */
var schema = {
    properties: {
      hash_type: {
        description: 'Enter 1 for SHA512 or 2 for bcrypt'.magenta,
        pattern: /^1|2$/,
        message: 'Must be either 1 or 2',
        required: true
      },
      user_name: {
        description: 'username'.magenta,
        pattern: /^[a-z0-9\.@_]+$/,
        message: 'Username can only be lower case letters, numbers, periods, underscores and @ signs.',
        required: true
      },
      password: {
        description: 'Please enter a password'.magenta,
        hidden: true,
        required: true
     },
     repeat_password: {
       description: 'Please re-enter your password'.magenta,
       hidden: true,
       required: true
     },
     iterations: {
      description: 'Number of iterations for SHA512 or number of rounds for bcrypt '.magenta,
      pattern: /^[0-9]+$/,
      message: 'Must be a number'
    }
  }
};

// get command line arguments
var options = [
  't:(hash-type)',
  'f:(format)',
  'r:(rounds)',
  'b:(bytes)',
  'i:(iterations)',
  'h(help)',
  'u:(username)',
  'U(updates)',
  'v(version)'
].join('');
var parser = new getopt.BasicParser(options, process.argv);
var iterations = 1;
var rounds = 1;
var username;
var type;
var bytes = 128;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'f': format = option.optarg; break;
    case 't': type = option.optarg; if (type != 1 && type != 2) {
                console.log('ERROR: Hash type must be either 1 or 2.');
                process.exit(1);
              } delete schema.properties.hash_type; break;
    case 'r': rounds = option.optarg; if (+rounds < 0) {
                console.log('ERROR: Number of rounds must be larger than 0.');
                process.exit(1);
              } delete schema.properties.iterations; break;
    case 'b': bytes = option.optarg; if (+bytes < 128) {
                console.log('ERROR: Number of bytes must be larger than 128.');
                process.exit(1);
              } break;
    case 'i': iterations = option.optarg; delete schema.properties.iterations; break;
    case 'h': console.log(usage()); process.exit(0);
    case 'u': username = option.optarg; delete schema.properties.user_name; break;
    case 'U':require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0);
    default: console.error(usage()); process.exit(1); break;
  }
}
var args = process.argv.slice(parser.optind());

prom.message = 'passhash'.cyan;
// start the prompt
prom.start();

// prompt user for input
prom.get(schema, function (err, result) {

  // if hash type was not provided on command line set type from prompt
  if (result.hash_type) type = result.hash_type;

  // if username was not provided on command line set username from prompt
  if (result.user_name) username = result.user_name;

  // if rounds is not provided on command line set rounds from prompt
  // the same prompt is used for rounds and iterations
  if (result.iterations) rounds = result.iterations;

  // if iterations is not provided on command line set iterations from prompt
  if (result.iterations) iterations = result.iterations;

  // check for password mismatch and exits on mismatch
  if (result.password !== result.repeat_password) {
    console.log('ERROR: Password mismatch.');
    process.exit(1);
  }
  if (type == 1) {
    /* generate 128 bit crypto random bytes
     * save the byte buffer as a base64 encoded salt
     * using the salt and password create a salted sha512 hash
     * output the username, salt, and salted hash ':' delimited
     */
    crypto.randomBytes(+bytes, function(err, buf) {
      if (err) throw err;
      var salt = buf.toString('base64');
      var hash = result.password;
      for (var i = 0; i<=iterations; i++) {
        hash = crypto.createHmac('sha512', salt).update(hash).digest('hex');
      }
      var s = format
                .replace('{username}', username)
                .replace('{salt}', salt)
                .replace('{hash}', hash)
                .replace('{iterations}', iterations);
      console.log(s);
    });
  }else{
    var salt = bcrypt.genSaltSync(+rounds);
    var hash = bcrypt.hashSync(result.password, salt);
    console.log('%s:%s', username, hash);
  }
});
