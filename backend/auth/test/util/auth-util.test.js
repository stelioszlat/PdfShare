const util = require('../../util/util');
const User = require('../../models/user-model');
const jwt = require('jsonwebtoken');

jest.mock('../../models/user-model');
jest.mock('jsonwebtoken');

describe('Auth Util', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            method: 'GET',
            get: jest.fn(),
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
        process.env.SECRET = 'test-secret';
    });

    describe('signToken', () => {
        it('should sign a token with user data', () => {
            const mockUser = {
                username: 'testuser',
                email: 'test@test.com',
                isAdmin: false
            };
            const mockToken = 'mock.jwt.token';
            jwt.sign.mockReturnValue(mockToken);

            const token = util.signToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                {
                    username: 'testuser',
                    email: 'test@test.com',
                    isAdmin: false
                },
                'alksdjfhasdkfhjaskdhf',
                { expiresIn: '1h' }
            );
            expect(token).toBe(mockToken);
        });
    });

    describe('authenticate', () => {
        it('should call next for OPTIONS method', async () => {
            req.method = 'OPTIONS';

            await util.authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 401 if no Authorization header', async () => {
            req.get.mockReturnValue(null);

            await util.authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'No Authorization header found' });
        });

        it('should return 401 if token is invalid', async () => {
            req.get.mockReturnValue('Bearer invalidtoken');
            jwt.decode.mockReturnValue(null);

            await util.authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
        });

        it('should return 401 if token verification fails', async () => {
            req.get.mockReturnValue('Bearer validtoken');
            jwt.decode.mockReturnValue({ username: 'test' });
            jwt.verify.mockReturnValue(null);

            await util.authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not authenticated.' });
        });

        it('should set req.isAdmin and req.username on success', async () => {
            req.get.mockReturnValue('Bearer validtoken');
            const decodedToken = {
                username: 'testuser',
                isAdmin: true
            };
            jwt.decode.mockReturnValue(decodedToken);
            jwt.verify.mockReturnValue(decodedToken);

            await util.authenticate(req, res, next);

            expect(req.isAdmin).toBe(true);
            expect(req.username).toBe('testuser');
            expect(next).toHaveBeenCalled();
        });

        it('should call next with error on exception', async () => {
            req.get.mockReturnValue('Bearer validtoken');
            const error = new Error('JWT error');
            jwt.decode.mockImplementation(() => { throw error; });

            await util.authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('isAdmin', () => {
        it('should return 403 if user is not admin', () => {
            req.isAdmin = false;

            util.isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ 
                message: "You are not authorized to access this resource" 
            });
        });

        it('should call next if user is admin', () => {
            req.isAdmin = true;

            util.isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('userExists', () => {
        it('should return 409 if user exists', async () => {
            req.body.email = 'test@test.com';
            User.find.mockResolvedValue([{ email: 'test@test.com' }]);

            await util.userExists(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists.' });
        });

        it('should call next if user does not exist', async () => {
            req.body.email = 'new@test.com';
            User.find.mockResolvedValue([]);

            await util.userExists(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next with error on exception', async () => {
            req.body.email = 'test@test.com';
            const error = new Error('Database error');
            User.find.mockRejectedValue(error);

            await util.userExists(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('userHasToken', () => {
        it('should return 409 if user not found', async () => {
            req.params.uid = '123';
            User.findById.mockResolvedValue(null);

            await util.userHasToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Could not find user.' });
        });

        it('should return 409 if user already has token', async () => {
            req.params.uid = '123';
            User.findById.mockResolvedValue({ token: 'existing-token' });

            await util.userHasToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'User has already a token.' });
        });

        it('should call next if user has no token', async () => {
            req.params.uid = '123';
            User.findById.mockResolvedValue({ token: null });

            await util.userHasToken(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});