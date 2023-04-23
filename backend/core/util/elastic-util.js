const express = require('express');
const { Client } = require('elasticsearch');
const json = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    node: process.env.ELASTIC_CLUSTER_TEST
});

exports.getInfo = async () => {
    client.cluster.health({}, function (err, resp, status) {
        if (err) {
            console.log(err);
        }
        if (resp) {
            console.log("Connected to elasticsearch cluster on " + process.env.ELASTIC_CLUSTER_TEST);
            console.log("Elasticsearch cluster status: " + status)
        }
    });
}

exports.createIndex = async (index) => {
    try {
        client.indices.create({ index: index }, (err, resp, status) => {
            console.log(resp);
        })
    } catch (err) {
        console.log(err);
    }
}

exports.index = async (req, res, next) => {
    const {fileName, author, uploader, keywords} = req.query;

    if (!fileName) {
        return res.status(400).json({ message: 'File name is required to create an index'});
    }

    try {
        client.index(
            {
                index: 'metadata',
                document: {
                    author: author,
                    uploader: uploader,
                    keywords: keywords
                }
            },
            function (err, resp, status) {
                if (err) {
                    return next(err);
                }
                else {
                    console.log(resp);
                }
                next();
            }
        );
    } catch (err) {
        return next(err);
    }
}

exports.delete = async (req, res, next) => {
    const { fileName } = req.body;

    try {
        client.delete({
            index: 'metadata',
            document: {
                fileName: fileName
            }
        }, (err, resp, status) => {
            if (err) {
                return next(err);
            } else {
                console.log(resp);
            }
        });
    } catch (err) {
        return next(err);
    }
}

exports.searchIndex = async (req, res, next) => {
    const { fileName, author, uploader } = req.query;
    const { keywords } = req.body;

    try {
        const result = await client.search({
            index: 'metadata',
            fileName: fileName,
            author: author,
            uploader: uploader,
            keywords: keywords
        });

        if (!result) {
            return next();
        }

        req.body.result = result
        next();
    } catch (err) {
        return next(err);
    }
}
