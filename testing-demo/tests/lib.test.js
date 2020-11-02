const lib = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
    
    it('should return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it('should return 0 when input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return a greeting message', () => {
        const result = lib.greet('Karthik');
        expect(result).toMatch(/Karthik/);
        expect(result).toContain('Karthik');
    });
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();
        // Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // Too specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');

        expect(result.length).toBe(3);

        // Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'AUD']));
    });
});

describe('getProduct', () => {
    it('should return product with the given ID', () => {
        const result = lib.getProduct(1);

        // The toBe matcher fails here because it compares the references to the objects (expected and received)
        // which are stored in different locations in memory
        // expect(result).toBe({ id: 1, price: 10});

        // The toEqual matcher checks for object equality and hence it passes
        // Here, both the expected and received should have exact same properties and it's values (no more, no less)
        expect(result).toEqual({ id: 1, price: 10});

        // To not be way too general or too specific, we can go with the below approaches

        // The toMatchObject matcher passes as long as the expected properties are present with the expected values
        expect(result).toMatchObject({ id: 1, price: 10});

        // Test passes if it contains the property mentioned
        expect(result).toHaveProperty('id', 1);
    });
});

describe('registerUser', () => {
    it('should throw an exception if username is falsy', () => {
        // We say it is falsy in JavaScript when it takes one of the following values
        // Null, undefined, NaN, '', 0, false
        // Instead of looping through the array, we can use the jest-each pakage 
        // which supports parameterized tests
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(a => {
            expect(() => { lib.registerUser(null) }).toThrow();
        })
        
    });

    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('Karthik');
        expect(result).toMatchObject({username: 'Karthik'});
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        
        // Mocking the actual call to db.js
        db.getCustomerSync = function(customerId) {
            console.log('Fake reading customer...');
            return { id: customerId, points: 20 };
        }

        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {
        
        // Instead of manually mocking the function, we can use the jest.fn()
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
        mail.send = jest.fn();
        
        lib.notifyCustomer({ customerId: 1 });

        // Check if the mock was called
        expect(mail.send).toHaveBeenCalled();
        // Validate the parameters
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
        
    });
});