/**
 * Automated End-to-End API Test Suite for Piro Woody Concepts Backend
 */
const BASE_URL = 'http://localhost:8080';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE BACKEND API TESTS ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || data.message !== 'Piro Woody API is running') {
      throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Public Services
  let serviceId = null;
  await test('GET /api/services', async () => {
    const res = await fetch(`${BASE_URL}/api/services`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to retrieve services: ${JSON.stringify(data)}`);
    }
    serviceId = data.data[0].id;
    console.log(`       Retrieved ${data.data.length} services (First: "${data.data[0].name}")`);
  });

  // 3. Public Projects
  await test('GET /api/projects', async () => {
    const res = await fetch(`${BASE_URL}/api/projects`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to retrieve projects: ${JSON.stringify(data)}`);
    }
    console.log(`       Retrieved ${data.data.length} projects (First: "${data.data[0].title}")`);
  });

  // 4. Public Business Information
  await test('GET /api/business', async () => {
    const res = await fetch(`${BASE_URL}/api/business`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || data.data.businessName !== 'Piro Woody Concepts') {
      throw new Error(`Invalid business info: ${JSON.stringify(data)}`);
    }
    console.log(`       Business Name: "${data.data.businessName}", Phone: "${data.data.phone}"`);
  });

  // 5. Public Social Links
  await test('GET /api/social-links', async () => {
    const res = await fetch(`${BASE_URL}/api/social-links`);
    const data = await res.json();
    if (res.status !== 200 || !data.success || !Array.isArray(data.data)) {
      throw new Error(`Invalid social links: ${JSON.stringify(data)}`);
    }
    console.log(`       Retrieved ${data.data.length} social links`);
  });

  // 6. Public Customer Inquiry Submission
  let inquiryId = null;
  await test('POST /api/inquiries (Valid payload)', async () => {
    const payload = {
      fullName: 'Chidi Okonkwo',
      phone: '08031234567',
      email: 'chidi.okonkwo@example.com',
      location: 'Enugu, Nigeria',
      serviceId: serviceId,
      budgetRange: '₦3,000,000 - ₦5,000,000',
      description: 'Looking to remodel our luxury duplex open-plan kitchen with modern island cabinetry.',
    };

    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status !== 201 || !data.success || !data.data.id) {
      throw new Error(`Inquiry creation failed: ${JSON.stringify(data)}`);
    }
    inquiryId = data.data.id;
    console.log(`       Created inquiry ID: ${inquiryId}`);
  });

  // 7. Customer Inquiry Validation (Reject invalid input)
  await test('POST /api/inquiries (Rejects invalid email/missing fields)', async () => {
    const invalidPayload = {
      fullName: 'C',
      email: 'not-an-email',
      phone: '123',
    };

    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const data = await res.json();
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400 validation error, got: ${res.status}`);
    }
  });

  // 8. Contact Message Submission
  await test('POST /api/contact', async () => {
    const payload = {
      name: 'Ngozi Eze',
      email: 'ngozi.eze@example.com',
      phone: '08123456789',
      message: 'Hello, do you handle custom walk-in closet installations in Abuja?',
    };

    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status !== 201 || !data.success || !data.data.id) {
      throw new Error(`Contact message creation failed: ${JSON.stringify(data)}`);
    }
  });

  // 9. Admin Login & JWT Authentication
  let adminToken = null;
  await test('POST /api/admin/auth/login (Valid credentials)', async () => {
    const payload = {
      username: 'admin',
      password: 'AdminPassword2026!',
    };

    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.data.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(data)}`);
    }
    adminToken = data.data.token;
    console.log(`       Authenticated admin: ${data.data.user.username} (${data.data.user.role})`);
  });

  // 10. Admin Protected Routes Guard
  await test('GET /api/admin/dashboard (Rejects unauthenticated request)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`);
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, received ${res.status}`);
    }
  });

  // 11. Admin Dashboard Metrics
  await test('GET /api/admin/dashboard (Authenticated)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success || !data.data.inquiries) {
      throw new Error(`Dashboard fetch failed: ${JSON.stringify(data)}`);
    }
    console.log('       Metrics:', {
      inquiriesTotal: data.data.inquiries.total,
      projectsTotal: data.data.projects.total,
      servicesTotal: data.data.services.total,
      messagesTotal: data.data.contactMessages.total,
    });
  });

  // 12. Admin Inquiries List & Status Update
  await test('PATCH /api/admin/inquiries/:id (Update status to CONTACTED)', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/inquiries/${inquiryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'CONTACTED' }),
    });

    const data = await res.json();
    if (res.status !== 200 || !data.success || data.data.status !== 'CONTACTED') {
      throw new Error(`Inquiry status update failed: ${JSON.stringify(data)}`);
    }
  });

  // 13. Static Frontend Delivery
  await test('GET / (Serves index.html with 200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    if (res.status !== 200 || !html.includes('Piro Woody Concepts')) {
      throw new Error(`Frontend delivery issue: ${res.status}`);
    }
  });

  console.log('--------------------------------------------------');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('--------------------------------------------------');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
