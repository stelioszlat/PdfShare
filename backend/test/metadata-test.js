const expect = require('chai').expect;

const meta = require('../controllers/meta-controller');

describe('Metadata tests', () => {
    it('should throw an error when trying to find a file without an id param', () => {
        const req = {
            get: () => {
                return null
            }
        }

        expect(meta.deleteMetadataById.bind(this, req, {}, () => {})).to.throw();
    });

    it('should throw an error when trying to update a file name', () => {
        const req = {
            put: () => {
                return null
            }
        }

        expect(meta.updateMetadataById.bind(this, req, {}, () => {})).to.throw();
    });

});