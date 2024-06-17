const bcrypt = require('bcrypt');

const printPass = async e => {
    console.log(await (bcrypt.hash('admin', 10)))
};

printPass();