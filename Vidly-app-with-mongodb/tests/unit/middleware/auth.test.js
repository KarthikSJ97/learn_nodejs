const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        // Loading a new user to match with req.user
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const token = new User(user).generateAuthToken();
        
        // Mocking req, res, next
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();
        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});