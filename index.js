const extend = require('extend');
const addressParser = require('addressparser');
const intercom = require('intercom-client');

const packageData = require('./package.json');
const debug = require('debug')('nodemailer-intercom');

function IntercomTransport(options) {
    debug('Initializing with %o', options);
    this.name = 'Intercom';
    this.version = packageData.version;

    options = options || {};

    const auth = options.auth || {};
    this.intercomClient = new intercom.Client(auth);
    this.adminId = options.adminId;
    this.template = options.template || 'plain';
}

IntercomTransport.prototype.send = function (mail, callback) {
    debug('send ->  %o', mail);
    const data = mail.data || {};
    const toAddresses = addressParser(data.to) || [];
    const email = (toAddresses[0] || {}).address;

    const message = {
        message_type: "email",
        subject: data.subject,
        body: data.html || data.text,
        template: this.template,
        from: {
            type: "admin",
            id: this.adminId
        },
        to: {
            type: "user",
            email: (toAddresses[0] || {}).address
        }
    };

    debug('Sending message %o', message);
    this.intercomClient.messages.create(message, function (err, result) {
        if (err) {
            debug('Error %o', err);
            if(err.body && err.body.errors) {
                debug('Error body %o', err.body.errors);
            }
            if (typeof callback === 'function') {
                callback(err);
             }

            return;
        }

        debug('Result %o', err);
        if (typeof callback === 'function') {
            callback(null, result);
        }
    });

};

module.exports = function (options) {
    return new IntercomTransport(options);
};
