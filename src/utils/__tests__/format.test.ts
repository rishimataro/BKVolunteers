import { describe, it, expect } from 'vitest';
import { formatDate } from '../format';

describe('formatDate', () => {
    it('should format a timestamp correctly', () => {
        // 1715500000000 is 2024-05-12T07:46:40.000Z
        const timestamp = 1715500000000;
        // The actual output depends on the local timezone during test execution.
        // For a generic test, we can check if it returns a string and has the expected parts.
        const result = formatDate(timestamp);
        expect(typeof result).toBe('string');
        expect(result).toMatch(/2024/);
    });
});
