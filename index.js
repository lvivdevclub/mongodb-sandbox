const mongoose = require('mongoose');
const crypto = require('crypto');
var randomstring = require("randomstring");

const md5 = function (string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

mongoose.set('debug', true);

mongoose.connect(`mongodb://mongo1:27017,mongo2:27017,mongo3:27017/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false
}).catch(err => console.log(`Connect error: ${err}`));

const Hash = mongoose.model('hash', {
    password: {type: String, unique: true, index: true},
    md5: String
});

async function save(password) {
    const res = await Hash.create([{password: password, md5: md5(password)}]);
    console.log(`Save ${res}`);
    return res;
}

(async function () {
    try {
        while (true) {
            await save(randomstring.generate());
        }
    } catch (e) {
        console.error(`error: ${e}`);
    }
})();
