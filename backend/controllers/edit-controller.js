const Metadata = require('../models/metadata');

exports.getEditsByFileId = async (req, res, next) => {
    const fileId = req.params.fid;

    try {
        const metadata = await Metadata.findById(fileId);

        if (!metadata) {
            res.status(404).json({ message: 'Could not find file.' });
        }

        const edits = await Edit.findMany({
            _id: fileId
        });

        if (!edits) {
            res.status(404).json({ message: 'File has not been edited.' });
        }

        res.status(200).json(edits);

    } catch (err) {
        return next(err);
    }
}

exports.editByFileId = async (req, res, next) => {
    const fileId = req.params.fid;

    try {
        const edit = {
            ...req.body
        };

        const result = await Metadata.findByIdAndUpdate(fileId,
            { 
                $push: {edits: edit},
                $inc: {timesEdited: 1}
            }
        );

        if (!result) {
            return res.status(409).json({ message: 'Could not edit file.' });
        }

        res.status(200).json({ message: 'Edited file.' });
    
    } catch (err) {
        return next(err);
    }
}

exports.getEditorsByFileId = async (req, res, next) => {
    const fileId = req.params.fid;

    try {
        const edits = await Edit.findMany({
            _id: fileId
        });

        if (!edits) {
            res.status(404).json({ message: 'Could not find file edits.' });
        }

        const editors = [];
        edits.array.forEach(element => {
            editors.push(element.editor);
        });
    
        res.status(200).json(editors);

    } catch (err) {
        return next(err);
    }
}