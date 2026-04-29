const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth-routes');
const authController = require('../../controllers/auth-controller');
const util = require('../..//util/util');

jest.mock('../../controllers/auth-controller');
jest.mock('../../util/util');

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should call login controller', async () => {
            authController.login.mockImplementation((req, res) => {
                res.status(200).json({ access_token: 'token' });
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: 'test', password: 'pass' });

            expect(authController.login).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/auth/register', () => {
        it('should call userExists middleware and register controller', async () => {
            util.userExists.mockImplementation((req, res, next) => next());
            authController.register.mockImplementation((req, res) => {
                res.status(200).json({ access_token: 'token' });
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'newuser',
                    email: 'new@test.com',
                    password: 'pass',
                    rePassword: 'pass'
                });

            expect(authController.register).toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/reset', () => {
        it('should call reset controller', async () => {
            authController.reset.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Password reset' });
            });

            const response = await request(app)
                .post('/api/auth/reset')
                .send({
                    email: 'test@test.com',
                    oldPassword: 'old',
                    newPassword: 'new'
                });

            expect(authController.reset).toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should call authenticate, isSelf, and logout controller', async () => {
            util.authenticate.mockImplementation((req, res, next) => next());
            util.isSelf.mockImplementation((req, res, next) => next());
            authController.logout.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Logged out' });
            });

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer token')
                .send({ username: 'test' });

            expect(authController.logout).toHaveBeenCalled();
        });
    });
});