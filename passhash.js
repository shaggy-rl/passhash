/*
 * passhash
 *
 * password hashing using sha512 and random salt
 *
 * Author: Alexander Shagla-McKotch <shagla@gmai.com>
 *
 * Contributor: Dave Eddy <dave@daveeddy.com> github.com/bahamas10
 *
 * License: MIT
*/

// initial variables and requires
var prom = require('prompt'),
    crypto = require('crypto'),
    getopt = require('posix-getopt')
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
    'Easily and securily hash passwords with a variable amount of iterations of SHA512.',
    '',
    'Takes in an optional username and number of iterations and then propmts for a password.',
    '',
    'If a username or number of iterations is not provided it will prompt for them.',
    '',
    '-i, --iterations <number>        number of SHA512 iterations (default is set to 1)',
    '-b, --bits <number>              number of bits to use for crypto random salt, must be >= 128 (default 128)',
    '-h, --help                       print this message and exit',
    '-u, --username <name>            username to use for entry',
    '-U, --updates                    check for available updates',
    '-f, --format                     change format of output',
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
      description: 'Number of iterations (default 1)'.magenta,
      pattern: /^[0-9]+$/,
      message: 'Must be a number',
      default: 1,
    }
  }
};

// get command line arguments
var options = [
  'f:(format)',
  'b:(bits)',
  'i:(iterations)',
  'h(help)',
  'u:(username)',
  'U(updates)',
  'v(version)'
].join('');
var parser = new getopt.BasicParser(options, process.argv);
var iterations = 1;
var username;
var bits = 128;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'f': format = option.optarg; break;
    case 'b': bits = option.optarg; if (+bits < 128) {
                console.log('ERROR: Number of bits must be larger than 128.');
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

  // if username was not provided on command line set username from prompt
  if (result.username) username = result.username;

  // if iterations is not provided on command line set iterations from prompt
  if (result.iterations) iterations = result.iterations;

  // check for password mismatch and exits on mismatch
  if (result.password !== result.repeat_password) {
    console.log('ERROR: Password mismatch.');
    process.exit(1);
  }

  /* generate 128 bit crypto random bytes
   * save the byte buffer as a base64 encoded salt
   * using the salt and password create a salted sha512 hash
   * output the username, salt, and salted hash ':' delimited
   */
  crypto.randomBytes(+bits, function(err, buf) {
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
});
