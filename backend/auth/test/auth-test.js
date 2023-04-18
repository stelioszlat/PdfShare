const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { authenticate } = require('../util/util');
const User = require('../models/user-model');
const authController = require('../controllers/auth-controller');


describe('Authentication middleware tests', () => {

    before(() => {
        sinon.stub(jwt, 'verify');
    });

    after(() => {

    })

    it('should throw an error if there is no Authentication header', () => {
        const req = {
            get: () => {
                return null;
            }
        }; 
    
        expect(authenticate.bind(this, req, {}, () => {})).to.throw();
    });

    it('should return a username when authenticating a user', () => {
        jwt.verify.returns({ username: abc });

        expect(req).to.have.property('username');
        jwt.verify.restore()
    });

    it('should return an isAdmin flag when authenticating a user', () => {
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ isAdmin: false });

        authenticate(req, {}, () => {});
        expect(req).to.have.property('isAdmin');
        jwt.verify.restore();
    });
});

describe('Authentication controller tests', () => {

    before(() => {
        sinon.stub(User, 'findOne');
        sinon.stub(User, 'findByIdAndUpdate');
        sinon.stub(bcrypt, 'compare');
    });
    
    describe('General tests', () => {
        it('should throw a 500 error if accessing the db fails', (done) => {
            User.findOne.throws();

            const req = {
                body: {
                    username: 'admin',
                    password: 'admin123'
                }
            };
            
            User.findOne.restore();
        });
    })

    describe('Login tests', () => {

        it('should login a user with valid credentials', (done) => {
            done();
        });
    });
});