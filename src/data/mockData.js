export const initialLeads = [
  {
    id: 'lead-1',
    name: 'Acme Corporation',
    contactName: 'Sarah Jenkins',
    email: 'sarah@acme.co',
    phone: '555-0199',
    status: 'Won',
    source: 'Website',
    value: 24000,
    owner: { name: 'Sarah K.', initials: 'SK', color: 'bg-blue-500' },
    createdAt: '2026-06-01',
    notes: [
      { id: 'n1', author: 'Sarah K.', text: 'Signed contract. Onboarding scheduled for next Tuesday.', date: '2026-06-05' },
      { id: 'n2', author: 'Sarah K.', text: 'Negotiation complete. Final discount was 10%.', date: '2026-06-04' }
    ]
  },
  {
    id: 'lead-2',
    name: 'Initech LLC',
    contactName: 'Mark Davis',
    email: 'm.davis@initech.com',
    phone: '555-0144',
    status: 'Contacted',
    source: 'Cold Call',
    value: 8500,
    owner: { name: 'Mark D.', initials: 'MD', color: 'bg-green-500' },
    createdAt: '2026-06-10',
    notes: [
      { id: 'n3', author: 'Mark D.', text: 'Sent follow-up email. They are interested in a demo.', date: '2026-06-12' }
    ]
  },
  {
    id: 'lead-3',
    name: 'Globex Co',
    contactName: 'Alice Vance',
    email: 'alice@globex.io',
    phone: '555-0177',
    status: 'Proposal Sent',
    source: 'Referral',
    value: 15000,
    owner: { name: 'Sarah K.', initials: 'SK', color: 'bg-blue-500' },
    createdAt: '2026-06-15',
    notes: [
      { id: 'n4', author: 'Sarah K.', text: 'Proposal sent. Awaiting feedback from their CTO.', date: '2026-06-18' }
    ]
  },
  {
    id: 'lead-4',
    name: 'Umbrella Corp',
    contactName: 'John Smith',
    email: 'jsmith@umbrella.org',
    phone: '555-0122',
    status: 'Lost',
    source: 'Email Campaign',
    value: 4200,
    owner: { name: 'John S.', initials: 'JS', color: 'bg-purple-500' },
    createdAt: '2026-05-20',
    notes: [
      { id: 'n5', author: 'John S.', text: 'Lost to competitor. They preferred a localized hosting option.', date: '2026-05-28' }
    ]
  },
  {
    id: 'lead-5',
    name: 'Hooli Inc',
    contactName: 'Gavin Belson',
    email: 'gavin@hooli.xyz',
    phone: '555-0155',
    status: 'Meeting Scheduled',
    source: 'LinkedIn',
    value: 45000,
    owner: { name: 'Sarah K.', initials: 'SK', color: 'bg-blue-500' },
    createdAt: '2026-06-02',
    notes: [
      { id: 'n6', author: 'Sarah K.', text: 'Sent custom contract terms. Legal is reviewing.', date: '2026-06-22' }
    ]
  },
  {
    id: 'lead-6',
    name: 'Soylent Corp',
    contactName: 'Robert Thorn',
    email: 'rthorn@soylent.com',
    phone: '555-0111',
    status: 'New',
    source: 'Website',
    value: 12000,
    owner: { name: 'Mark D.', initials: 'MD', color: 'bg-green-500' },
    createdAt: '2026-06-24',
    notes: []
  },
  {
    id: 'lead-7',
    name: 'Vehement Media',
    contactName: 'Richard Hendricks',
    email: 'richard@vehement.media',
    phone: '555-0188',
    status: 'Proposal Sent',
    source: 'Website',
    value: 28000,
    owner: { name: 'John S.', initials: 'JS', color: 'bg-purple-500' },
    createdAt: '2026-06-18',
    notes: [
      { id: 'n7', author: 'John S.', text: 'Demo completed. Very interested in API integrations.', date: '2026-06-20' }
    ]
  },
  {
    id: 'lead-8',
    name: 'Massive Dynamic',
    contactName: 'Nina Sharp',
    email: 'nsharp@massivedynamic.com',
    phone: '555-0133',
    status: 'Meeting Scheduled',
    source: 'Referral',
    value: 95000,
    owner: { name: 'Sarah K.', initials: 'SK', color: 'bg-blue-500' },
    createdAt: '2026-06-05',
    notes: [
      { id: 'n8', author: 'Sarah K.', text: 'Discussed enterprise SLA agreements.', date: '2026-06-14' }
    ]
  }
];

export const mockActivities = [
  {
    id: 'act-1',
    type: 'won',
    leadName: 'Acme Corporation',
    detail: 'Closed won deal worth $24,000',
    time: '2 hrs ago',
    user: 'SK'
  },
  {
    id: 'act-2',
    type: 'status_change',
    leadName: 'Hooli Inc',
    detail: 'Moved from Proposal Sent to Meeting Scheduled',
    time: '5 hrs ago',
    user: 'SK'
  },
  {
    id: 'act-3',
    type: 'new_lead',
    leadName: 'Soylent Corp',
    detail: 'New lead added via Website',
    time: '1 day ago',
    user: 'MD'
  },
  {
    id: 'act-4',
    type: 'note_added',
    leadName: 'Globex Co',
    detail: 'Sarah K. left a note: "Awaiting feedback from CTO"',
    time: '2 days ago',
    user: 'SK'
  },
  {
    id: 'act-5',
    type: 'won',
    leadName: 'Initech LLC',
    detail: 'Closed won deal worth $8,500',
    time: '3 days ago',
    user: 'MD'
  }
];

export const pipelineHistory = [
  { month: 'Jan', active: 45000, won: 18000 },
  { month: 'Feb', active: 52000, won: 22000 },
  { month: 'Mar', active: 68000, won: 29000 },
  { month: 'Apr', active: 85000, won: 42000 },
  { month: 'May', active: 110000, won: 65000 },
  { month: 'Jun', active: 145000, won: 92000 }
];

export const performanceData = [
  { month: 'Jan', won: 18000, lost: 5000 },
  { month: 'Feb', won: 22000, lost: 8000 },
  { month: 'Mar', won: 29000, lost: 12000 },
  { month: 'Apr', won: 42000, lost: 15000 },
  { month: 'May', won: 65000, lost: 18000 },
  { month: 'Jun', won: 92000, lost: 24000 }
];

export const sourceDistribution = [
  { name: 'Website', value: 42, color: '#2563EB' },
  { name: 'Referral', value: 25, color: '#10B981' },
  { name: 'Cold Call', value: 15, color: '#F59E0B' },
  { name: 'LinkedIn', value: 10, color: '#8B5CF6' },
  { name: 'Other', value: 8, color: '#6B7280' }
];

export const stageVelocity = [
  { stage: 'New', days: 3.2 },
  { stage: 'Contacted', days: 5.4 },
  { stage: 'Meeting Scheduled', days: 12.1 },
  { stage: 'Proposal Sent', days: 8.7 }
];
