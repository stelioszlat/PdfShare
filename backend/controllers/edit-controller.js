const Edit = require('../models/edit');
const Metadata = require('../models/metadata');

exports.getEditsByFileId = async (req, res, next) => {
    const fileId = req.params.fid;

    try {
        const metadata = await Metadata.findById(fileId);

        if (!metadata) {
            return next('Could not find a file.');
        }

        const edits = await Edit.findMany({
            _id: fileId
        });

        if (!edits) {
            return next('File has not been edited');
        }

        res.status(200).json(edits);

    } catch (err) {
        return next(err);
    }
}

exports.editByFileId = async (req, res, next) => {
    const fileId = req.params.fid;

    try {
        const file = await Metadata.findById(fileId);

        if (!file) {
            return next('File does not exist.');
        }

        const edit = new Edit({
            ...req.body,
        });

        const result = await edit.save();

        if (!result) {
            return next('Could not edit file.');
        }

        const editId = result._id;
        const editFile = await Metadata.findByIdAndUpdate(fileId,
            { $push: { edits: editId }}
        );

        if (!editFile) {
            return next('Could not edit file.');
        }

        res.status(200).json({message: 'Filed edited', result: result});
    
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
            return next("Could not find file edits.");
        }

        const editors = [];
        edits.array.forEach(element => {
            editors.push(element.editor);
        });

        console.log(editors);
    
        res.status(200).json({message: 'Users edited this file.', editors});
    } catch (err) {
        next(err);
    }

}