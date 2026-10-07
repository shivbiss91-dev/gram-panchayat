process.env.NODE_ENV = 'test';

import http from 'http';
import app from './index';

async function runTests() {
  console.log('🧪 Starting Full-Stack End-to-End API Integration Verification...\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5001, () => resolve()));
  const baseUrl = 'http://localhost:5001/api';

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`).then((r) => r.json());
    assert(healthRes.status === 'healthy', 'Health check returns healthy');

    // 2. Public stats
    const statsRes = await fetch(`${baseUrl}/public/stats`).then((r) => r.json());
    assert(statsRes.success === true && statsRes.data.totalComplaints >= 10, 'Public stats endpoint returns live database data');

    // 3. Public track complaint
    const trackRes = await fetch(`${baseUrl}/public/track/GP-2026-0001`).then((r) => r.json());
    assert(trackRes.success === true && trackRes.data.complaintNumber === 'GP-2026-0001', 'Public complaint tracking retrieves GP-2026-0001 without citizen PII');
    assert(trackRes.data.statusHistory.length > 0, 'Public tracking returns complete status history timeline');

    // 4. Public track complaint not found
    const trackNotFound = await fetch(`${baseUrl}/public/track/GP-9999-9999`).then((r) => r.json());
    assert(trackNotFound.success === false, 'Invalid complaint ID returns appropriate error message');

    // 5. Admin Login
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@grampanchayat.gov.in', password: 'Admin@123' }),
    }).then((r) => r.json());

    assert(adminLoginRes.success === true && adminLoginRes.user.role === 'ADMIN', 'Admin authentication returns valid JWT token and ADMIN role');
    const adminToken = adminLoginRes.token;

    // 6. Citizen Login
    const citizenLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'ramesh.patil@example.com', password: 'Citizen@123' }),
    }).then((r) => r.json());

    assert(citizenLoginRes.success === true && citizenLoginRes.user.role === 'CITIZEN', 'Citizen authentication returns valid token and CITIZEN role');
    const citizenToken = citizenLoginRes.token;

    // 7. Invalid password check
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin@grampanchayat.gov.in', password: 'WrongPassword' }),
    }).then((r) => r.json());
    assert(badLoginRes.success === false, 'Invalid password rejected with 401 response');

    // 8. Citizen registration duplicate email check
    const dupEmailRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Test',
        email: 'ramesh.patil@example.com',
        mobile: '9123456789',
        address: 'Ward 1',
        password: 'Password@123',
      }),
    }).then((r) => r.json());
    assert(dupEmailRes.success === false, 'Duplicate email registration rejected');

    // 9. Citizen registration duplicate mobile check
    const dupMobileRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Test',
        email: 'unique.test@example.com',
        mobile: '9812345678', // already exists for Ramesh
        address: 'Ward 1',
        password: 'Password@123',
      }),
    }).then((r) => r.json());
    assert(dupMobileRes.success === false, 'Duplicate mobile registration rejected');

    // 10. Role authorization: Citizen trying to access Admin dashboard
    const citizenAccessAdminRes = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    }).then((r) => r.json());
    assert(citizenAccessAdminRes.success === false, 'Citizen role forbidden from accessing /api/admin/* (403)');

    // 11. Admin accessing Admin dashboard
    const adminDashboardRes = await fetch(`${baseUrl}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(adminDashboardRes.success === true && adminDashboardRes.data.totalComplaints > 0, 'Admin can view dashboard statistics and recent queue');

    // 12. Submit new complaint by citizen
    const newComplaintRes = await fetch(`${baseUrl}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        category: 'Road Issues',
        title: 'Broken culvert stone slab near west farmland canal',
        description: 'Heavy tractor cracked the side slab of the small irrigation bridge. Needs stone masonry repair before harvest season.',
        location: 'West Farmland Canal Road, Ward 3',
        latitude: 18.5211,
        longitude: 73.8572,
      }),
    }).then((r) => r.json());

    assert(
      newComplaintRes.success === true &&
        newComplaintRes.data.complaintNumber.startsWith('GP-') &&
        newComplaintRes.data.status === 'SUBMITTED',
      'Citizen can submit complaint: unique GP-YYYY-XXXX generated and status is SUBMITTED'
    );
    const createdComplaintId = newComplaintRes.data.id;

    // 13. Check that initial history and notification were auto-created
    const complaintDetailRes = await fetch(`${baseUrl}/complaints/${createdComplaintId}`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    }).then((r) => r.json());
    assert(
      complaintDetailRes.data.statusHistory.length === 1 &&
        complaintDetailRes.data.statusHistory[0].status === 'SUBMITTED',
      'Initial ComplaintStatusHistory record created automatically on submission'
    );

    // 14. Admin assignment
    const assignRes = await fetch(`${baseUrl}/admin/complaints/${createdComplaintId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        assignedDepartment: 'Road Maintenance',
        assignedStaff: 'Mahesh Jadhav (Junior Engineer)',
        remarks: 'Assigned for immediate stone slab casting and site clearing.',
      }),
    }).then((r) => r.json());
    assert(
      assignRes.success === true &&
        assignRes.data.assignedDepartment === 'Road Maintenance' &&
        assignRes.data.status === 'ASSIGNED',
      'Admin can assign department & staff: status transitions to ASSIGNED and records history'
    );

    // 15. Admin status update to IN_PROGRESS
    const inProgressRes = await fetch(`${baseUrl}/admin/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'IN_PROGRESS',
        remarks: 'Excavation and cement masonry work commenced on site.',
      }),
    }).then((r) => r.json());
    assert(
      inProgressRes.success === true && inProgressRes.data.status === 'IN_PROGRESS',
      'Admin can update status to IN_PROGRESS with official remarks'
    );

    // 16. Admin status update to RESOLVED
    const resolvedRes = await fetch(`${baseUrl}/admin/complaints/${createdComplaintId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'RESOLVED',
        remarks: 'New reinforced concrete slab installed and canal bridge cleared for vehicle passage.',
      }),
    }).then((r) => r.json());
    assert(
      resolvedRes.success === true &&
        resolvedRes.data.status === 'RESOLVED' &&
        resolvedRes.data.resolvedAt !== null,
      'Admin resolves complaint: status set to RESOLVED and resolvedAt timestamp populated'
    );

    // 17. Citizen feedback on resolved complaint
    const feedbackRes = await fetch(`${baseUrl}/complaints/${createdComplaintId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'Very solid concrete repair done in record time. Bridge is safe now!',
      }),
    }).then((r) => r.json());
    assert(
      feedbackRes.success === true && feedbackRes.data.rating === 5,
      'Citizen can submit 1-5 star feedback with review comment on resolved grievance'
    );

    // 18. Admin analytics
    const analyticsRes = await fetch(`${baseUrl}/admin/analytics?timeRange=30d`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(
      analyticsRes.success === true &&
        analyticsRes.data.categoryData.length > 0 &&
        analyticsRes.data.statusData.length > 0,
      'Admin analytics endpoint returns real category, status, and trend data'
    );

    // 19. Admin CSV export
    const csvRes = await fetch(`${baseUrl}/admin/reports/export`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const csvText = await csvRes.text();
    assert(
      csvRes.status === 200 &&
        csvText.includes('Complaint ID') &&
        csvText.includes('Road Issues'),
      'Admin CSV export produces valid CSV headers and records'
    );

    // 20. Notifications check
    const notifRes = await fetch(`${baseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    }).then((r) => r.json());
    assert(
      notifRes.success === true && notifRes.data.length > 0,
      'Citizen receives automated in-app notifications for registered, assigned, and resolved complaint'
    );

    console.log(`\n=======================================================`);
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`=======================================================\n`);
  } catch (error) {
    console.error('Test execution failed:', error);
    failed++;
  } finally {
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runTests();
