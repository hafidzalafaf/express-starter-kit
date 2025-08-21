import { hashPassword, comparePassword, generateAccessToken, verifyAccessToken } from '../../src/utils/auth';

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123!';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(password, hash);
      
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123!';
      const wrongPassword = 'wrongPassword123!';
      const hash = await hashPassword(password);
      const isMatch = await comparePassword(wrongPassword, hash);
      
      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Token Operations', () => {
    const mockPayload = {
      userId: 1,
      email: 'test@example.com',
      role: 'user' as const,
    };

    it('should generate and verify access token', () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.jwt.token';
      
      expect(() => {
        verifyAccessToken(invalidToken);
      }).toThrow();
    });
  });
});
