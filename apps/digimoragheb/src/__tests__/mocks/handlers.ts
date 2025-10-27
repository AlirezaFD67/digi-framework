import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    });
  }),

  http.post('/api/auth/otp', () => {
    return HttpResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  }),

  http.post('/api/auth/verify-otp', () => {
    return HttpResponse.json({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    });
  }),

  // User profile endpoints
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    });
  }),

  // Dashboard data endpoints
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalUsers: 150,
      activeUsers: 120,
      totalRevenue: 50000,
      growthRate: 15.5,
    });
  }),

  // Error endpoints for testing error handling
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }),
];
