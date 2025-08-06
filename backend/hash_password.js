   // hash_password.js
    const bcrypt = require('bcryptjs');

    // 💡 IMPORTANT: Change 'adminpass' to the password you want to hash.
    // You'll run this script once for each user role (admin, teacher, student)
    // to get their respective hashed passwords.
    const passwordToHash = 'prof123'; // <-- CHANGE THIS PASSWORD FOR EACH HASH!

    console.log(`Hashing password for: '${passwordToHash}'...`);

    bcrypt.hash(passwordToHash, 10)
      .then(hash => {
        console.log(`\n🔑 Hashed password for '${passwordToHash}':`);
        console.log(`👉 ${hash}\n`);
        console.log('Copy this hash and paste it into your MySQL INSERT statement for the users table.');
        console.log('Remember to generate a new hash for each user (admin, teacher, student) with their respective passwords.');
      })
      .catch(err => {
        console.error('\n❌ Error hashing password. This usually means bcryptjs is not installed or there is a problem with Node.js.');
        console.error('Error details:', err.message);
      });