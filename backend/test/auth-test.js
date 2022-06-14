const expect = require('chai').expect;
const sinon = require('sinon');

const auth = require('../controllers/auth-controller');

describe('Authentication tests', () => {

    it('should throw an error with no authentication', () => {
        const req = {
            get: () => {
                return 'null';
            }
        }

        expect(auth.authenticate.bind(this, req, {}, () => {})).to.throw();
    });
})