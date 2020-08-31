const mongoose = require('mongoose');
const crypto = require('crypto');
var randomstring = require("randomstring");

const md5 = function (string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

// mongoose.set('debug', true);

const connection = mongoose.connect(`mongodb://mongo1:27017,mongo2:27017,mongo3:27017/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
}).catch(err => console.log(`Connect error: ${err}`));

const Hash = mongoose.model('hash', {
    password: {type: String/*, unique: true, index: true*/},
    md5: String,
    key: String
});

Hash.watch([{$match: {'fullDocument.key': 'A'}}]).on('change', data => console.log(new Date(), data));

async function save(password, key) {
    if (key == 'A') {
        console.log(password, key);
    }
    await Hash.create([{password: password, md5: md5(password), key}]);
}

(async function () {
    try {
        while (true) {
            await save(randomstring.generate(), randomstring.generate({length: 1}));
        }
    } catch (e) {
        console.error(`error: ${e}`);
        connection.disconnect();
    }
})();
