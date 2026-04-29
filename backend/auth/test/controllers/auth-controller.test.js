const authController = require('../../controllers/auth-controller');
const User = require('../../models/user-model');
const bcrypt = require('bcryptjs');
const util = require('../../util/util');

jest.mock('../../models/user-model');
jest.mock('../../util/util');
jest.mock('bcryptjs');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return 400 if username is missing', async () => {
            req.body = { password: 'test123' };

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter a username.' });
        });

        it('should return 400 if password is missing', async () => {
            req.body = { username: 'testuser' };

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter a password.' });
        });

        it('should return 404 if user not found', async () => {
            req.body = { username: 'testuser', password: 'test123' };
            User.findOne.mockResolvedValue(null);

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Could not find user.' });
        });

        it('should return 409 if password is incorrect', async () => {
            req.body = { username: 'testuser', password: 'wrongpass' };
            const mockUser = {
                _id: '123',
                username: 'testuser',
                password: 'hashedpass',
                isAdmin: false
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect password' });
        });

        it('should return 200 and token on successful login', async () => {
            req.body = { username: 'testuser', password: 'correctpass' };
            const mockUser = {
                _id: '123',
                username: 'testuser',
                password: 'hashedpass',
                isAdmin: false
            };
            const mockToken = 'mock.jwt.token';
            
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            util.signToken.mockReturnValue(mockToken);
            User.findByIdAndUpdate.mockResolvedValue(mockUser);

            await authController.login(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                access_token: mockToken,
                isAdmin: false,
                userId: '123'
            });
        });

        it('should call next with error on exception', async () => {
            req.body = { username: 'testuser', password: 'test123' };
            const error = new Error('Database error');
            User.findOne.mockRejectedValue(error);

            await authController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('logout', () => {
        it('should return 400 if username is missing', async () => {
            req.body = {};

            await authController.logout(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter a username' });
        });

        it('should return 404 if user not found', async () => {
            req.body = { username: 'testuser' };
            User.findOne.mockResolvedValue(null);

            await authController.logout(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Could not find user.' });
        });

        it('should return 200 on successful logout', async () => {
            req.body = { username: 'testuser' };
            const mockUser = { _id: '123', username: 'testuser' };
            User.findOne.mockResolvedValue(mockUser);
            util.delete.mockResolvedValue(true);

            await authController.logout(req, res, next);

            expect(util.delete).toHaveBeenCalledWith('123');
            expect(util.delete).toHaveBeenCalledWith('testuser');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User is logged out.' });
        });
    });

    describe('register', () => {
        it('should return 409 if email is missing', async () => {
            req.body = { username: 'test', password: 'pass', rePassword: 'pass' };

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter email' });
        });

        it('should return 409 if passwords do not match', async () => {
            req.body = {
                email: 'test@test.com',
                username: 'test',
                password: 'pass1',
                rePassword: 'pass2'
            };

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Re-entered password does not match' });
        });

        it('should create user and return token on success', async () => {
            req.body = {
                email: 'test@test.com',
                username: 'testuser',
                password: 'pass123',
                rePassword: 'pass123'
            };
            const mockToken = 'mock.jwt.token';
            const mockUser = { _id: '123', username: 'testuser', save: jest.fn() };
            
            bcrypt.hash.mockResolvedValue('hashedpass');
            util.signToken.mockReturnValue(mockToken);
            mockUser.save.mockResolvedValue(mockUser);
            User.mockImplementation(() => mockUser);
            util.set.mockResolvedValue(true);

            await authController.register(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                access_token: mockToken,
                userId: '123'
            });
        });
    });

    describe('reset', () => {
        it('should return 400 if email is missing', async () => {
            req.body = { oldPassword: 'old', newPassword: 'new' };

            await authController.reset(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter an email' });
        });

        it('should successfully reset password', async () => {
            req.body = {
                email: 'test@test.com',
                oldPassword: 'oldpass',
                newPassword: 'newpass'
            };
            const mockUser = { id: '123', password: 'hashedoldpass' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashednewpass');
            User.findByIdAndUpdate.mockResolvedValue(mockUser);

            await authController.reset(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Your password has been changed' });
        });
    });

    describe('userExists', () => {
        it('should return 409 if username is missing', async () => {
            req.body = { email: 'test@test.com' };

            await authController.userExists(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'You need to enter a username' });
        });

        it('should return 409 if user exists in cache', async () => {
            req.body = { username: 'testuser', email: 'test@test.com' };
            util.get.mockResolvedValue({ username: 'testuser' });

            await authController.userExists(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists. (cached)' });
        });

        it('should return 409 if user exists in database', async () => {
            req.body = { username: 'testuser', email: 'test@test.com' };
            util.get.mockResolvedValue(null);
            User.find.mockResolvedValue([{ username: 'testuser' }]);

            await authController.userExists(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists.' });
        });

        it('should call next if user does not exist', async () => {
            req.body = { username: 'newuser', email: 'new@test.com' };
            util.get.mockResolvedValue(null);
            User.find.mockResolvedValue([]);

            await authController.userExists(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});