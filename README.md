passhash
========

Easily and securely hash passwords with a variable amount of iterations of SHA512.

Takes in an optional username and number of iterations and then prompts for a password.

If a username or number of iterations is not provided it will prompt for them.

Installation
------------

    npm install -g passhash

Usage
-----

    -i, --iterations <number>        number of SHA512 iterations (default is set to 1)
    -b, --bytes <number>             number of bytes to use for crypto random salt, must be >= 128 (default 128)
    -h, --help                       print this message and exit
    -u, --username <name>            username to use for entry
    -U, --updates                    check for available updates
    -f, --format                     change format of output
    -v, --version                    print the version number and exit

Default Output
--------------

    username:salt:hash:iterations

    test:0V6lfASr44DcJexA0FawChE0ZGo+xM9zBjJMC3S5vp0RH0SdhpS/LIYPI7tP/gms5JVZ2fcnShClgmQif84rdxFQ3A88vZFzIpSBGMSzMabyqPlvzm2BwpS7WLqMbJlXdtSNriQ+PfkKmFj2+oeOS9BNHl2MgSUk8iXu5LB7LXGSinO4k2AsJqB+eslJSL1uzCpA5Ww2weHt47aU+vKWDiuodyPFlL3ahbYAt3nqlkbtr7E0X15nKiEOIWTtdRENCVFyIUf0PLSRYLLZwdnQ5sl414QN8NFcPtDSXEoAblJlcTCa+VJgXx2T2RKdg1RC360GyGsaHtZN9mY8y4Puermp4LWyg1reM9gkXXae63h3pzYjaQc5emSdK+0ljIMKI4aR/wkkLrbnS4/hbeqaE6L1+/X1QPHR0u9BQWAUsUqED6IiStDlSdidn9jBBOAdTIcXPHm6r0fBjoYx2mWmXCdMubF04ojjhsiCY/rcwYZZpjBRYtH8v5H1FWr1QUpzjKETLZml3c3bNAriX9e1GsX8wQqcfDpu/5pKSorfF5qmoIthr5uLsAavfO0XJ9D8C97G3sw91hVazGnvA6ER+PoUx4FZPJYxOFC3dfkOo8CSzOuTgQQaXmlEHJ6TcsVQ6kBMApUaUqqulaxZkZKtZEUu1zlW5CvbIf/kV5z5GtQ=:2a0293e90184f6a9d569a794bd7cc8b46d38e4c4faae54e2f8221463c99ee4ebe46805f629d8189c8c64227833130d5d9f7caea1d9c0a5c5f7e238a0e9f4a149:1444

Change Output Format
--------------------

`passhash` allows the user to define the output. For output to be useful it should include at least the username, the salt, and the hash. 

Changing the format is easy. `passhash` has built in keywords: `{username}` `{salt}` `{hash}` and `{iterations}`. By default they are printed out `:` delimited.
For example if you didn't want to output the number of iterations:

    node passhash.js -f '{username}<<>>{salt}<<>>{hash}'

This would output:

    test<<>>0V6lfASr44DcJexA0FawChE0ZGo+xM9zBjJMC3S5vp0RH0SdhpS/LIYPI7tP/gms5JVZ2fcnShClgmQif84rdxFQ3A88vZFzIpSBGMSzMabyqPlvzm2BwpS7WLqMbJlXdtSNriQ+PfkKmFj2+oeOS9BNHl2MgSUk8iXu5LB7LXGSinO4k2AsJqB+eslJSL1uzCpA5Ww2weHt47aU+vKWDiuodyPFlL3ahbYAt3nqlkbtr7E0X15nKiEOIWTtdRENCVFyIUf0PLSRYLLZwdnQ5sl414QN8NFcPtDSXEoAblJlcTCa+VJgXx2T2RKdg1RC360GyGsaHtZN9mY8y4Puermp4LWyg1reM9gkXXae63h3pzYjaQc5emSdK+0ljIMKI4aR/wkkLrbnS4/hbeqaE6L1+/X1QPHR0u9BQWAUsUqED6IiStDlSdidn9jBBOAdTIcXPHm6r0fBjoYx2mWmXCdMubF04ojjhsiCY/rcwYZZpjBRYtH8v5H1FWr1QUpzjKETLZml3c3bNAriX9e1GsX8wQqcfDpu/5pKSorfF5qmoIthr5uLsAavfO0XJ9D8C97G3sw91hVazGnvA6ER+PoUx4FZPJYxOFC3dfkOo8CSzOuTgQQaXmlEHJ6TcsVQ6kBMApUaUqqulaxZkZKtZEUu1zlW5CvbIf/kV5z5GtQ=<<>>2a0293e90184f6a9d569a794bd7cc8b46d38e4c4faae54e2f8221463c99ee4ebe46805f629d8189c8c64227833130d5d9f7caea1d9c0a5c5f7e238a0e9f4a149

Example Prompt
--------------

    alex @ [ kovas :: (Darwin) ] ~/Projects/passhash $ node passhash.js 
    passhash: username:  test
    passhash: Please enter a password:  
    passhash: Please re-enter your password:  
    passhash: Number of iterations (default 1):  (1) 
    test:1N1SnR2+aqJPLgtdBZ3Bip4epRzLNAazg/cdqAOIDx65yxiifsf50DE/vXbHFoXtrM2ZbP3N2hq+d20LwkzwLDks//4E726se8iz8cwSgZjnKIYfzGUD6SPtZr7GQuR60TpC7qL9D9tXVHGjz+XS0E1AqaF7sdVna+2FmzQbgLc=:a9901ced04776219b0c59468aba567d16252ad17463ca8d7933206dde70e11b5e914be33d1611dde03e772ddc1dbfd70d5ef6368d9d7e7112ef77d6a539d1d3a:1

Why?
----

I personally dislike how people do authentication on the web. `htpasswd` can easily be broken. `passhash` allows for a more robust password storage system.
Now you can store the output of `passhash` into a file and code your node server to use it for auth, eliminating the need for htaccess/htpasswd.
For added security you can choose a number of iterations and not store it in the file, using it only in your server code for the password validation.
Each user could also have a different number of iterations. Is this still somewhat insecure? Yes, someone could take a line from the file and
if the user choose a weak password and the attacker knew the number of iterations and the salt they could still use brute force.
You can't protect against stupid users. 

License
-------

MIT

