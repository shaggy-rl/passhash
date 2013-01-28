/*
 * password hashing using sha512 and 128 bit crypto random salt
 *
 * Author: Alexander Shagla-McKotch
 *
 * License: MIT
*/

// initial variables and requires
var prom = require('prompt'),
    crypto = require('crypto');

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
      description: 'Number of iteration (default 1)'.magenta,
      pattern: /[0-9]+$/,
      message: 'Must be a number',
      default: 1,
    }
  }
};

prom.message = 'passhash'.cyan;
// start the prompt
prom.start();

// prompt user for input
prom.get(schema, function (err, result) {

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
  crypto.randomBytes(128, function(err, buf) {
    if (err) throw err;
    var salt = buf.toString('base64');
    var hash = result.password;
    for (var i = 0; i<=result.iterations; i++) {
      hash = crypto.createHmac('sha512', salt).update(hash).digest('hex');
    }
    console.log('%s:%s:%s:%s', result.user_name.green, salt.red, hash.blue, result.iterations.magenta);
  });
});
