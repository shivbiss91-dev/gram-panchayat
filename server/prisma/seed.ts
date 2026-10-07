import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Gram Panchayat Database Seeding...');

  // Clean existing records in sequence
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.complaintStatusHistory.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const citizenPasswordHash = await bcrypt.hash('Citizen@123', 10);

  // 1. Create Admin Officer
  const admin = await prisma.user.create({
    data: {
      name: 'Panchayat Officer Rajesh Shinde',
      email: 'admin@grampanchayat.gov.in',
      mobile: '9876543210',
      passwordHash,
      address: 'Gram Panchayat Bhavan, Main Road, Ward 1',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Created Admin user: ${admin.email}`);

  // 2. Create Citizens
  const citizensData = [
    {
      name: 'Ramesh Patil',
      email: 'ramesh.patil@example.com',
      mobile: '9812345678',
      passwordHash: citizenPasswordHash,
      address: 'House No. 42, North Lane, Ward 3',
      role: 'CITIZEN',
    },
    {
      name: 'Sunita Sharma',
      email: 'sunita.sharma@example.com',
      mobile: '9823456789',
      passwordHash: citizenPasswordHash,
      address: 'Plot 15, Near Gandhi Chowk, Ward 2',
      role: 'CITIZEN',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      mobile: '9834567890',
      passwordHash: citizenPasswordHash,
      address: 'Market Yard Road, Ward 5',
      role: 'CITIZEN',
    },
    {
      name: 'Priya Kadam',
      email: 'priya.kadam@example.com',
      mobile: '9845678901',
      passwordHash: citizenPasswordHash,
      address: 'Near Zilla Parishad Primary School, Ward 4',
      role: 'CITIZEN',
    },
    {
      name: 'Anand Deshmukh',
      email: 'anand.deshmukh@example.com',
      mobile: '9856789012',
      passwordHash: citizenPasswordHash,
      address: 'Temple Street, Ward 1',
      role: 'CITIZEN',
    },
  ];

  const createdCitizens = [];
  for (const c of citizensData) {
    const user = await prisma.user.create({ data: c });
    createdCitizens.push(user);
    console.log(`✅ Created Citizen: ${user.name} (${user.email})`);
  }

  // 3. Create Demo Complaints
  const now = new Date();
  const daysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };

  const complaintsList = [
    {
      complaintNumber: 'GP-2026-0001',
      userIndex: 0,
      category: 'Road Issues',
      title: 'Deep potholes on main market connecting road',
      description: 'Multiple deep potholes have formed right after the recent rainfall near the vegetable market entrance. Two two-wheelers skidded yesterday. Urgent asphalt patch repair is needed.',
      location: 'Near Vegetable Market, Ward 3 Main Road',
      latitude: 18.5204,
      longitude: 73.8567,
      status: 'RESOLVED',
      assignedDepartment: 'Road Maintenance',
      assignedStaff: 'Mahesh Jadhav (Junior Engineer)',
      submittedAt: daysAgo(12),
      resolvedAt: daysAgo(2),
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted by citizen via Digital Portal.', changedBy: 'Ramesh Patil', createdAt: daysAgo(12) },
        { status: 'UNDER_REVIEW', remarks: 'Verified by Panchayat Inspector. Site inspection scheduled.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(11) },
        { status: 'ASSIGNED', remarks: 'Assigned to Road Maintenance team with high priority.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(10) },
        { status: 'IN_PROGRESS', remarks: 'Asphalt cold mix and bitumen gravel work underway.', changedBy: 'Mahesh Jadhav', createdAt: daysAgo(6) },
        { status: 'RESOLVED', remarks: 'Potholes fully filled and road leveling completed and certified.', changedBy: 'Mahesh Jadhav', createdAt: daysAgo(2) },
      ],
      feedback: {
        rating: 5,
        comment: 'Very fast and clean work. The road is safe for motorcycles and auto-rickshaws now. Thank you!',
      },
    },
    {
      complaintNumber: 'GP-2026-0002',
      userIndex: 1,
      category: 'Street Light Problems',
      title: 'Flickering solar street lights outside Primary Health Center',
      description: 'Three consecutive street lights outside the PHC hospital gate have been flickering or completely blacked out for the past 4 nights. Patients arriving at night face severe visibility issues.',
      location: 'Primary Health Center Gate, Gandhi Chowk, Ward 2',
      latitude: 18.5245,
      longitude: 73.8512,
      status: 'RESOLVED',
      assignedDepartment: 'Street Lighting',
      assignedStaff: 'Suresh Patil (Electrical Line Worker)',
      submittedAt: daysAgo(14),
      resolvedAt: daysAgo(5),
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted by citizen.', changedBy: 'Sunita Sharma', createdAt: daysAgo(14) },
        { status: 'UNDER_REVIEW', remarks: 'Checked with electrical maintenance log.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(13) },
        { status: 'ASSIGNED', remarks: 'Line worker Suresh Patil assigned with replacement battery modules.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(12) },
        { status: 'IN_PROGRESS', remarks: 'Batteries and LED fixture driver being replaced.', changedBy: 'Suresh Patil', createdAt: daysAgo(8) },
        { status: 'RESOLVED', remarks: 'Solar batteries replaced and new 60W LED fixtures tested successfully.', changedBy: 'Suresh Patil', createdAt: daysAgo(5) },
      ],
      feedback: {
        rating: 4,
        comment: 'Lights are working very brightly now. Safe for night commuters.',
      },
    },
    {
      complaintNumber: 'GP-2026-0003',
      userIndex: 2,
      category: 'Water Supply Issues',
      title: 'Underground drinking water pipeline fracture & leakage',
      description: 'The main 4-inch drinking water feeder pipeline has fractured near house #18. Clean water is bubbling onto the street for 2 hours during morning supply hours, causing low pressure downstream.',
      location: 'Lane 4, Market Yard, Ward 5',
      latitude: 18.519,
      longitude: 73.862,
      status: 'IN_PROGRESS',
      assignedDepartment: 'Water Supply',
      assignedStaff: 'Kishore Bhende (Water Works Supervisor)',
      submittedAt: daysAgo(5),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint registered by citizen.', changedBy: 'Vikram Singh', createdAt: daysAgo(5) },
        { status: 'UNDER_REVIEW', remarks: 'Water works dept notified immediately to halt morning pump cycle.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(5) },
        { status: 'ASSIGNED', remarks: 'Assigned to emergency repair squad.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(4) },
        { status: 'IN_PROGRESS', remarks: 'Excavation completed, pipe replacement collar clamp installation underway.', changedBy: 'Kishore Bhende', createdAt: daysAgo(2) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0004',
      userIndex: 3,
      category: 'Drainage & Sanitation',
      title: 'Overflowing storm drainage canal near Zilla Parishad school',
      description: 'The open storm drain near the primary school boundary wall is choked with plastic and silt. Foul smell and water spilling onto the pedestrian walkway where school children walk daily.',
      location: 'Boundary Wall, Zilla Parishad Primary School, Ward 4',
      latitude: 18.528,
      longitude: 73.859,
      status: 'IN_PROGRESS',
      assignedDepartment: 'Sanitation',
      assignedStaff: 'Deepak Kale (Sanitation Inspector)',
      submittedAt: daysAgo(7),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint lodged by citizen.', changedBy: 'Priya Kadam', createdAt: daysAgo(7) },
        { status: 'UNDER_REVIEW', remarks: 'Health hazard near school campus flagged as priority.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(6) },
        { status: 'ASSIGNED', remarks: 'Sanitation team deployed with suction machine and silt desilting crew.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(5) },
        { status: 'IN_PROGRESS', remarks: 'Desilting 120 meters of drain in progress. 60% silt removed.', changedBy: 'Deepak Kale', createdAt: daysAgo(2) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0005',
      userIndex: 4,
      category: 'Waste Management',
      title: 'Weekly market garbage accumulation left uncollected',
      description: 'The weekly farmers market was held on Saturday and huge piles of vegetable waste and packing boxes were dumped near the ancient temple banyan tree. Stray cattle and dogs are scattering waste.',
      location: 'Behind Maruti Temple, Ward 1',
      latitude: 18.514,
      longitude: 73.854,
      status: 'ASSIGNED',
      assignedDepartment: 'Waste Management',
      assignedStaff: 'Santosh Gaikwad (Sanitation Supervisor)',
      submittedAt: daysAgo(3),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted by citizen.', changedBy: 'Anand Deshmukh', createdAt: daysAgo(3) },
        { status: 'UNDER_REVIEW', remarks: 'Inspected by sanitary supervisor.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(2) },
        { status: 'ASSIGNED', remarks: 'Tractor trailer scheduled for morning pickup.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(1) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0006',
      userIndex: 0,
      category: 'Public Facilities',
      title: 'Broken handpump cylinder handle causing injury hazard',
      description: 'The public community handpump near the community hall has a cracked cast-iron handle that slipped off while a villager was pumping water. Needs urgent replacement of mechanical assembly.',
      location: 'Community Hall Courtyard, Ward 3',
      latitude: 18.522,
      longitude: 73.858,
      status: 'UNDER_REVIEW',
      assignedDepartment: null,
      assignedStaff: null,
      submittedAt: daysAgo(2),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint registered.', changedBy: 'Ramesh Patil', createdAt: daysAgo(2) },
        { status: 'UNDER_REVIEW', remarks: 'Estimating cost of new standard Mark-II handpump handle.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(1) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0007',
      userIndex: 1,
      category: 'Water Supply Issues',
      title: 'Contaminated tap water supply with muddy sedimentation',
      description: 'For the last 2 days the piped tap supply between 6 AM and 8 AM is coming out yellow and muddy. Multiple households in Ward 2 reported stomach upsets. Requesting immediate water testing and chlorination.',
      location: 'Ward 2 Residential Area, Gandhi Chowk East',
      latitude: 18.525,
      longitude: 73.853,
      status: 'SUBMITTED',
      assignedDepartment: null,
      assignedStaff: null,
      submittedAt: daysAgo(1),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Urgent complaint registered by citizen.', changedBy: 'Sunita Sharma', createdAt: daysAgo(1) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0008',
      userIndex: 2,
      category: 'Street Light Problems',
      title: 'Damaged electric post leaning dangerously over footpath',
      description: 'An old cement electric pole was hit by a tractor during sugarcane loading. It is leaning at an acute angle and live wires are hanging within 7 feet of the ground. Extreme safety hazard!',
      location: 'Sugarcane Weighing Center Junction, Ward 5',
      latitude: 18.518,
      longitude: 73.865,
      status: 'IN_PROGRESS',
      assignedDepartment: 'Street Lighting',
      assignedStaff: 'Suresh Patil (Electrical Line Worker)',
      submittedAt: daysAgo(4),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Emergency hazard reported.', changedBy: 'Vikram Singh', createdAt: daysAgo(4) },
        { status: 'UNDER_REVIEW', remarks: 'Coordinated with MSEDCL electricity board substation.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(4) },
        { status: 'ASSIGNED', remarks: 'Joint repair crew dispatched with crane.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(3) },
        { status: 'IN_PROGRESS', remarks: 'Power turned off in sector, new pole erection work in progress.', changedBy: 'Suresh Patil', createdAt: daysAgo(1) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0009',
      userIndex: 3,
      category: 'Road Issues',
      title: 'Erosion of bridge shoulder wall on irrigation canal crossing',
      description: 'The stone masonry retaining wall of the small culvert canal bridge has eroded during flash floods. The road width has narrowed from 18 feet to 10 feet. Vehicles risk falling into the irrigation canal.',
      location: 'Minor Canal Culvert, Ward 4 to Village Outer Link',
      latitude: 18.531,
      longitude: 73.861,
      status: 'ASSIGNED',
      assignedDepartment: 'Road Maintenance',
      assignedStaff: 'Mahesh Jadhav (Junior Engineer)',
      submittedAt: daysAgo(8),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted.', changedBy: 'Priya Kadam', createdAt: daysAgo(8) },
        { status: 'UNDER_REVIEW', remarks: 'Surveyed by Panchayat civil engineer.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(6) },
        { status: 'ASSIGNED', remarks: 'Tender work order issued to masonry contractor.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(3) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0010',
      userIndex: 4,
      category: 'Drainage & Sanitation',
      title: 'Stagnant wastewater pooling behind Panchayat Anganwadi center',
      description: 'Wastewater from neighboring houses collects in a low-lying ditch right behind the Anganwadi children play area. Dense mosquito breeding and high risk of dengue. Needs lime powder and pipe diversion.',
      location: 'Anganwadi Center 2, Ward 1 South',
      latitude: 18.513,
      longitude: 73.856,
      status: 'RESOLVED',
      assignedDepartment: 'Sanitation',
      assignedStaff: 'Deepak Kale (Sanitation Inspector)',
      submittedAt: daysAgo(18),
      resolvedAt: daysAgo(9),
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint registered by citizen.', changedBy: 'Anand Deshmukh', createdAt: daysAgo(18) },
        { status: 'UNDER_REVIEW', remarks: 'Anganwadi worker confirmed the complaint.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(17) },
        { status: 'ASSIGNED', remarks: 'Sanitation crew dispatched for drain laying and spraying.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(15) },
        { status: 'IN_PROGRESS', remarks: 'Laying 40-meter PVC outflow pipe and filling ditch with soil.', changedBy: 'Deepak Kale', createdAt: daysAgo(12) },
        { status: 'RESOLVED', remarks: 'Ditch filled, pipe connected to main drain, malathion mosquito fogging completed.', changedBy: 'Deepak Kale', createdAt: daysAgo(9) },
      ],
      feedback: {
        rating: 5,
        comment: 'Excellent prompt action! The Anganwadi children can now play safely outdoors.',
      },
    },
    {
      complaintNumber: 'GP-2026-0011',
      userIndex: 0,
      category: 'Other',
      title: 'Stray cattle causing traffic blockade near Panchayat bus stop',
      description: 'More than 15 unclaimed stray cows and bulls sit across the narrow main road near the bus stop during peak evening hours, causing frequent traffic jams and minor accidents.',
      location: 'Central Bus Stand, Ward 3',
      latitude: 18.521,
      longitude: 73.855,
      status: 'UNDER_REVIEW',
      assignedDepartment: null,
      assignedStaff: null,
      submittedAt: daysAgo(4),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint received.', changedBy: 'Ramesh Patil', createdAt: daysAgo(4) },
        { status: 'UNDER_REVIEW', remarks: 'Notice served to local cattle owners and coordinating with Gaushala.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(2) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0012',
      userIndex: 1,
      category: 'Waste Management',
      title: 'Non-functioning garbage collection vehicle in sector B',
      description: 'The door-to-door waste collection vehicle has not visited Ward 2 for past 6 days. Residents are piling garbage bags at street corners which stray dogs are pulling apart.',
      location: 'Ward 2, Lane 3 & 4',
      latitude: 18.526,
      longitude: 73.852,
      status: 'RESOLVED',
      assignedDepartment: 'Waste Management',
      assignedStaff: 'Santosh Gaikwad (Sanitation Supervisor)',
      submittedAt: daysAgo(16),
      resolvedAt: daysAgo(11),
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted.', changedBy: 'Sunita Sharma', createdAt: daysAgo(16) },
        { status: 'UNDER_REVIEW', remarks: 'Investigated garbage vehicle breakdown status.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(15) },
        { status: 'ASSIGNED', remarks: 'Backup e-rickshaw garbage collector rerouted to Ward 2.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(14) },
        { status: 'IN_PROGRESS', remarks: 'Cleaning street corners and resuming morning round.', changedBy: 'Santosh Gaikwad', createdAt: daysAgo(12) },
        { status: 'RESOLVED', remarks: 'Ward 2 cleared and regular daily collection schedule restored.', changedBy: 'Santosh Gaikwad', createdAt: daysAgo(11) },
      ],
      feedback: {
        rating: 4,
        comment: 'Daily collection restarted. Please ensure vehicles are serviced regularly.',
      },
    },
    {
      complaintNumber: 'GP-2026-0013',
      userIndex: 2,
      category: 'Public Facilities',
      title: 'Broken boundary gate and vandalized benches in Gram Panchayat garden',
      description: 'The iron gate of the public children park has fallen off its hinges and 2 concrete benches are broken. Stray animals enter during nights.',
      location: 'Gram Panchayat Public Garden, Ward 5',
      latitude: 18.517,
      longitude: 73.863,
      status: 'REJECTED',
      assignedDepartment: 'Public Facilities',
      assignedStaff: 'Rajesh Shinde',
      submittedAt: daysAgo(20),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted.', changedBy: 'Vikram Singh', createdAt: daysAgo(20) },
        { status: 'UNDER_REVIEW', remarks: 'Site inspection conducted.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(19) },
        { status: 'REJECTED', remarks: 'This garden is under the Zilla Parishad Forest Division jurisdiction, not Gram Panchayat property. Official complaint forwarded to Zilla Parishad forest officer.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(18) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0014',
      userIndex: 3,
      category: 'Water Supply Issues',
      title: 'Low water pressure at terminal end of pipeline',
      description: 'The houses located at the tail end of Ward 4 get less than 15 minutes of trickling water because valves in middle wards are opened excessively.',
      location: 'Tail-end Sector, Ward 4',
      latitude: 18.529,
      longitude: 73.864,
      status: 'ASSIGNED',
      assignedDepartment: 'Water Supply',
      assignedStaff: 'Kishore Bhende (Water Works Supervisor)',
      submittedAt: daysAgo(6),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Complaint submitted.', changedBy: 'Priya Kadam', createdAt: daysAgo(6) },
        { status: 'UNDER_REVIEW', remarks: 'Water valve regulation timings being re-evaluated.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(5) },
        { status: 'ASSIGNED', remarks: 'Water operator assigned to balance distribution line valves.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(3) },
      ],
      feedback: null,
    },
    {
      complaintNumber: 'GP-2026-0015',
      userIndex: 4,
      category: 'Road Issues',
      title: 'Fallen tree branch blocking village link road after thunderstorm',
      description: 'A heavy branch from an old neem tree broke during yesterday storm and is blocking 80% of the village connecting link road.',
      location: 'Village Outer Link Road, Ward 1 North',
      latitude: 18.511,
      longitude: 73.851,
      status: 'RESOLVED',
      assignedDepartment: 'Road Maintenance',
      assignedStaff: 'Mahesh Jadhav (Junior Engineer)',
      submittedAt: daysAgo(10),
      resolvedAt: daysAgo(8),
      histories: [
        { status: 'SUBMITTED', remarks: 'Emergency road obstruction reported.', changedBy: 'Anand Deshmukh', createdAt: daysAgo(10) },
        { status: 'UNDER_REVIEW', remarks: 'Chainsaw and JCB loader dispatched.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(10) },
        { status: 'ASSIGNED', remarks: 'Road clearance team assigned.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(9) },
        { status: 'IN_PROGRESS', remarks: 'Cutting branch and hauling wood away from traffic lane.', changedBy: 'Mahesh Jadhav', createdAt: daysAgo(9) },
        { status: 'RESOLVED', remarks: 'Branch removed, road completely swept and traffic restored.', changedBy: 'Mahesh Jadhav', createdAt: daysAgo(8) },
      ],
      feedback: {
        rating: 5,
        comment: 'Cleared within 24 hours of thunderstorm. Very quick response!',
      },
    },
    {
      complaintNumber: 'GP-2026-0016',
      userIndex: 0,
      category: 'Street Light Problems',
      title: 'Dark corner at girls high school junction',
      description: 'No street light exists at the three-way junction near the Girls High School. Students returning from evening tuition classes feel insecure. Requesting installation of a solar LED pole.',
      location: 'Girls High School Junction, Ward 3',
      latitude: 18.523,
      longitude: 73.859,
      status: 'IN_PROGRESS',
      assignedDepartment: 'Street Lighting',
      assignedStaff: 'Suresh Patil (Electrical Line Worker)',
      submittedAt: daysAgo(9),
      resolvedAt: null,
      histories: [
        { status: 'SUBMITTED', remarks: 'Citizen submitted lighting request.', changedBy: 'Ramesh Patil', createdAt: daysAgo(9) },
        { status: 'UNDER_REVIEW', remarks: 'Inspected with school principal.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(7) },
        { status: 'ASSIGNED', remarks: 'Approved under Panchayat women safety infrastructure fund.', changedBy: 'Rajesh Shinde', createdAt: daysAgo(5) },
        { status: 'IN_PROGRESS', remarks: 'Foundation footing for pole completed, electrical pole being erected.', changedBy: 'Suresh Patil', createdAt: daysAgo(2) },
      ],
      feedback: null,
    },
  ];

  for (const c of complaintsList) {
    const citizen = createdCitizens[c.userIndex];
    const createdComplaint = await prisma.complaint.create({
      data: {
        complaintNumber: c.complaintNumber,
        userId: citizen.id,
        category: c.category,
        title: c.title,
        description: c.description,
        location: c.location,
        latitude: c.latitude,
        longitude: c.longitude,
        status: c.status,
        assignedDepartment: c.assignedDepartment,
        assignedStaff: c.assignedStaff,
        submittedAt: c.submittedAt,
        resolvedAt: c.resolvedAt,
      },
    });

    // Create history records
    for (const h of c.histories) {
      await prisma.complaintStatusHistory.create({
        data: {
          complaintId: createdComplaint.id,
          status: h.status,
          remarks: h.remarks,
          changedBy: h.changedBy,
          createdAt: h.createdAt,
        },
      });
    }

    // Create Feedback if resolved and present
    if (c.feedback) {
      await prisma.feedback.create({
        data: {
          complaintId: createdComplaint.id,
          userId: citizen.id,
          rating: c.feedback.rating,
          comment: c.feedback.comment,
          createdAt: c.resolvedAt || new Date(),
        },
      });
    }

    // Create Notifications for citizen
    await prisma.notification.create({
      data: {
        userId: citizen.id,
        complaintId: createdComplaint.id,
        title: `Complaint Update: ${c.complaintNumber}`,
        message: `Your complaint for "${c.title}" is currently marked as ${c.status.replace('_', ' ')}.`,
        read: c.status === 'RESOLVED',
        createdAt: c.submittedAt,
      },
    });

    console.log(`✅ Seeded complaint ${c.complaintNumber} (${c.category} - ${c.status})`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
