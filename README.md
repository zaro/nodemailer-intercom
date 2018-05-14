# nodemailer-intercom
Intercom plugin for nodemailer, based on nodemailer-simple-intercom-transport

# Install 

    npm install nodemailer-intercom


# Usage 

    const intercom = require('nodemailer-intercom');
    const transport = intercom({
        auth: {
            token: 'XXXXXX',
        },
        adminId: <admin_id>, // Intercom teammate id, to be used for from
    });

