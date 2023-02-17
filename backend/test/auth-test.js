const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const { authenticate, isAdmin } = require('../core/util/auth-util');

describe('Authentication tests', () => {

    it('should throw an error with no authentication header', () => {
        const req = {
            get: () => {
                return null;
            }
        }

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        expect(req).to.have.property('isAdmin');
        jwt.verify.restore();
    });
})