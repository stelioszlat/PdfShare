const express = require('express');
const elasticsearch = require('elasticsearch');
const { json } = require('body-parser');

const host = "http://192.168.1.9:9200";
const client = new elasticsearch.Client(host, () => {
    console.log("Running elasticsearch cluster on " + host);
});

exports.getInfo = async (req, res, next) => {
    client.cluster.health({}, function (err, resp, status) {
        if (resp) {
            console.log("Cluster health: ", resp);
            res.status(status).json(resp);
        }
        console.log(err);
        return next(resp);
    });
}

exports.addIndex = async (req, res, next) => {
    const {indexName, owner } = req.body;

    client.indices.create(
        {
            index: indexname,
        },
        function (err, resp, status) {
            if (err) {
                console.log(err);
                res.status(400).json({ err });
            }
            else {
                console.log("Created ", resp);
            }
        }
    );

    try {
        const { result } = await client.index(
            {
                index: indexName,
                owner: owner,
                keywords: [
                    {
                        keyword: "keyword1",
                        appeared: 10,
                    },
                    {
                        keyword: "keyword2",
                        appeared: 13,
                    },
                ],
            },
            function (err, resp, status) {
                if (err) {
                    console.log(resp);
                    res.status(400).json({ err });
                }
                else {
                    res.status(200).json({ message: "Created index", resp});
                }
            }
        );
    } catch (err) {
        return next(err);
    }
}

exports.deleteIndex = async (req, res, next) => {
    const { indexName } = req.body;

    client.indices.delete(
        {
            index: indexName,
        },
        function (err, resp, status) {
            if (err) {
                console.log(err);
                res.status(404).json({ err });
            } else {
                console.log("Deleted", resp);
                res.status(200).json({ message: "Deleted index ", resp});
            }
        }
    );
}

exports.searchIndex = async (req, res, next) => {
    const { indexName, owner } = req.body;

    try {
        const { result } = await client.search({
            index: indexName,
            body: {},
        });
        res.status(200).json({ message: "Successfull query", result});
    } catch (err) {
        return next(err);
    }
}
