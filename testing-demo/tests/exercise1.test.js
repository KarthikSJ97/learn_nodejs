const exercise = require('../exercise1');

describe('fizzBuzz', () => {
    it('should throw an exception if input is not a number', () => {
        expect(() => {exercise.fizzBuzz('a')}).toThrow();
        expect(() => {exercise.fizzBuzz(null)}).toThrow();
        expect(() => {exercise.fizzBuzz(undefined)}).toThrow();
        expect(() => {exercise.fizzBuzz({})}).toThrow();
    });

    it('should return "FizzBuzz" if input is divisible by both 3 and 5', () => {
        const result = exercise.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('should return "Fizz" if input is divisible by 3 only', () => {
        const result = exercise.fizzBuzz(3);
        expect(result).toBe('Fizz');
    });

    it('should return "Buzz" if input is divisible by 5 only', () => {
        const result = exercise.fizzBuzz(5);
        expect(result).toBe('Buzz');
    });

    it('should return the number itself if not divisible by 3 or 5', () => {
        const result = exercise.fizzBuzz(19);
        expect(result).toBe(19);
    });
});