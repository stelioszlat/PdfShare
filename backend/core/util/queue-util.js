const amqp = require('amqplib');
const dotenv = require('dotenv');
const { createMetadata } = require('../controllers/meta-controller');

let channel, connection;

const QUEUE_HOST = process.env.QUEUE_HOST;

exports.connectQueue = async () => {
    try {
        connection = await amqp.connect(QUEUE_HOST);
        const channel = await connection.createChannel();

        await channel.assertQueue('metadata-queue');
        
        console.log(`Connected to message queue on ${QUEUE_HOST}`);
        
        await channel.consume('metadata-queue', data => {
            console.log('Consumed data from metadata-queue ' + data.content);
            if (data) {
                createMetadata(JSON.parse(data.content));
                channel.ack(data);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.send = async (data) => {
    try {
    
        await channel.sendToQueue('metadata-queue', Buffer.from(JSON.stringify(data)));
    
    } catch (err) {
        console.log(err);
    }
}

exports.channel = channel;
exports.connection = connection;