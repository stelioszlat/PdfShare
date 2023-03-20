const amqp = require('amqplib');

let channel, connection;

const QUEUE_HOST = process.env.QUEUE_HOST;

exports.connectQueue = async () => {
    try {
        connection = await amqp.connect(QUEUE_HOST);
        channel = await connection.createChannel();

        await channel.assertQueue('metadata-queue');

        console.log(`Connected to message queue on ${QUEUE_HOST}`);
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

exports.consume = async () => {
    try {
        await channel.consume('metadata-queue', data => {
            console.log('Consumed data from metadata-queue ' + data.content);
            channel.ack(data);
        });
    } catch (err) {
        console.log(err);
    }
}

exports.channel = channel;
exports.connection = connection;