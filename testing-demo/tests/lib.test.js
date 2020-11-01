const lib = require('../lib');

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