// ==================================================================
// ENVIRONMENT CONFIGURATION TESTS
// ==================================================================

import { ENVIRONMENT, getApiUrl } from '../../../src/shared/config/environment';

describe('Environment Configuration', () => {
  describe('ENVIRONMENT object', () => {
    it('should have all required environment properties', () => {
      expect(ENVIRONMENT).toBeDefined();
      expect(ENVIRONMENT.API_BASE_URL).toBeDefined();
      expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeDefined();
      expect(ENVIRONMENT.DEFAULT_HEADERS).toBeDefined();
    });

    it('should have valid API base URL', () => {
      expect(typeof ENVIRONMENT.API_BASE_URL).toBe('string');
      expect(ENVIRONMENT.API_BASE_URL.length).toBeGreaterThan(0);
      expect(ENVIRONMENT.API_BASE_URL).toMatch(/^https?:\/\//);
    });

    it('should have valid request timeout', () => {
      expect(typeof ENVIRONMENT.REQUEST_TIMEOUT).toBe('number');
      expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeGreaterThan(0);
      expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeLessThanOrEqual(60000); // Max 60 seconds
    });

    it('should have valid default headers', () => {
      expect(ENVIRONMENT.DEFAULT_HEADERS).toBeDefined();
      expect(typeof ENVIRONMENT.DEFAULT_HEADERS).toBe('object');
      expect(ENVIRONMENT.DEFAULT_HEADERS['Content-Type']).toBeDefined();
      expect(ENVIRONMENT.DEFAULT_HEADERS['Accept']).toBeDefined();
    });

    it('should have correct content type header', () => {
      expect(ENVIRONMENT.DEFAULT_HEADERS['Content-Type']).toBe('application/json');
    });

    it('should have correct accept header', () => {
      expect(ENVIRONMENT.DEFAULT_HEADERS['Accept']).toBe('application/json');
    });
  });

  describe('getApiUrl function', () => {
    it('should return correct URL for products endpoint', () => {
      const url = getApiUrl('products');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/products`);
    });

    it('should return correct URL for transactions endpoint', () => {
      const url = getApiUrl('transactions');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/transactions`);
    });

    it('should return correct URL for health endpoint', () => {
      const url = getApiUrl('health');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/health`);
    });

    it('should return correct URL for cart endpoint', () => {
      const url = getApiUrl('cart');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/cart`);
    });

    it('should handle empty endpoint parameter', () => {
      const url = getApiUrl('');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/`);
    });

    it('should handle undefined endpoint parameter', () => {
      expect(() => getApiUrl(undefined as any)).toThrow();
    });

    it('should handle null endpoint parameter', () => {
      expect(() => getApiUrl(null as any)).toThrow();
    });

    it('should handle special characters in endpoint', () => {
      const url = getApiUrl('test-endpoint_123');
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/test-endpoint_123`);
    });

    it('should handle very long endpoint names', () => {
      const longEndpoint = 'a'.repeat(100);
      const url = getApiUrl(longEndpoint);
      expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/${longEndpoint}`);
    });

    it('should maintain URL structure consistency', () => {
      const endpoints = ['users', 'orders', 'payments', 'notifications'];
      endpoints.forEach(endpoint => {
        const url = getApiUrl(endpoint);
        expect(url).toBe(`${ENVIRONMENT.API_BASE_URL}/${endpoint}`);
        expect(url).toMatch(/^https?:\/\/.+\/.+$/);
      });
    });
  });

  describe('Environment Integration', () => {
    it('should work with fetch API', () => {
      const url = getApiUrl('test');
      expect(url).toMatch(/^https?:\/\/.+\/test$/);
      
      // Verify URL can be used with fetch (without actually calling it)
      expect(() => new URL(url)).not.toThrow();
    });

    it('should have consistent timeout across all endpoints', () => {
      const endpoints = ['products', 'transactions', 'health'];
      endpoints.forEach(endpoint => {
        const url = getApiUrl(endpoint);
        expect(url).toBeDefined();
        expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeGreaterThan(0);
      });
    });

    it('should have valid headers for all endpoints', () => {
      const endpoints = ['products', 'transactions', 'health'];
      endpoints.forEach(endpoint => {
        const url = getApiUrl(endpoint);
        expect(url).toBeDefined();
        expect(ENVIRONMENT.DEFAULT_HEADERS['Content-Type']).toBe('application/json');
        expect(ENVIRONMENT.DEFAULT_HEADERS['Accept']).toBe('application/json');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed API base URL gracefully', () => {
      // This test verifies that the environment is properly configured
      // and doesn't have malformed URLs
      expect(ENVIRONMENT.API_BASE_URL).toMatch(/^https?:\/\/[^\/]+(\/.*)?$/);
    });

    it('should have reasonable timeout values', () => {
      expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeGreaterThanOrEqual(1000); // Min 1 second
      expect(ENVIRONMENT.REQUEST_TIMEOUT).toBeLessThanOrEqual(60000); // Max 60 seconds
    });

    it('should have secure headers configuration', () => {
      expect(ENVIRONMENT.DEFAULT_HEADERS['Content-Type']).toBe('application/json');
      expect(ENVIRONMENT.DEFAULT_HEADERS['Accept']).toBe('application/json');
    });
  });
});
