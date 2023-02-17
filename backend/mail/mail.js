const express = require('express');
const dotenv = require('dotenv');
const sendGrid = require('@sendgrid/mail');

const apiLogger = require('./util/util');

dotenv.config();
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeMessage = {
    to: 'steliosdj6@gmail.com',
    from: 'stelioszl@outlook.com',
    subject: 'Welcome to PdfShare',
    text: 'Welcome to PdfShare',
    html: 'Click <a href="localhost:8090">here</a> to discover more'
};

const getHtmlFromType = (type) => {
    switch (type) {
        case 'welcome': {
            return 'Click <a href="localhost:8090">here</a> to discover more'
        }
    }
};

const app = express();

app.use(apiLogger);

app.post('/api/mail', async (req, res, next) => {
    const { to, subject, text, type } = req.mail;

    const message = {
        to,
        from: process.env.FROM,
        subject,
        text,
        html: getHtmlFromType(type)
    }

    try {
        await sendGrid.send(message);
    } catch (err) {
        console.error(err);

        if (err.response) {
            console.error(err.response.body);
        }

        return res.status(400).json({ message: err.response.body });
    }

    return res.status(200).json({ message: 'Email sent' });
});

app.listen(8085, () => {
    console.log("Running mail service on localhost:8085");
});