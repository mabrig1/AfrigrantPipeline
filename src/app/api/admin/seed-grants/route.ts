import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Grant from '@/models/Grant'

const SEED_GRANTS = [
  {
    title: 'Africa Fellows in Education Program (AFEP) 2026/2027',
    description: 'For young African researchers focused on evidence-based education policy. A fully funded 2-year fellowship supporting research that informs systemic change in African education systems.',
    funder: 'Partnership for Economic Policy (PEP)',
    amount: 0,
    currency: 'USD',
    deadline: new Date('2026-06-30'),
    grantType: 'fellowship',
    eligibility: ['Early-career researchers', 'African nationals', 'Education policy focus'],
    categories: ['Education', 'Policy Research', 'Africa'],
    countries: ['Africa'],
    region: 'Sub-Saharan Africa',
    applicationLink: 'https://www.pep-net.org/',
    status: 'open',
  },
  {
    title: 'Cambridge-Africa ALBORADA Research Fund 2026',
    description: 'Supports collaborative research partnerships between the University of Cambridge and African universities or research institutions across all academic disciplines.',
    funder: 'University of Cambridge',
    amount: 25000,
    currency: 'GBP',
    deadline: new Date('2026-09-03'),
    grantType: 'research',
    eligibility: ['African institutions', 'Cambridge partnership required'],
    categories: ['Collaborative Research', 'All Disciplines'],
    countries: ['Africa'],
    region: 'Africa (all regions)',
    applicationLink: 'https://www.cambridge-africa.cam.ac.uk/',
    status: 'open',
  },
  {
    title: 'TETFund National Research Fund (NRF)',
    description: "Nigeria's flagship research grant for academic staff in public tertiary institutions. Covers multi-disciplinary research in public administration, governance, STEM, and humanities.",
    funder: 'Tertiary Education Trust Fund (TETFund)',
    amount: 50000000,
    currency: 'NGN',
    deadline: new Date('2026-12-31'),
    grantType: 'research',
    eligibility: ['Nigerian public tertiary institution staff', 'Academic researchers'],
    categories: ['Multi-disciplinary', 'STEM', 'Governance', 'Humanities'],
    countries: ['Nigeria'],
    region: 'Nigeria',
    applicationLink: 'https://nrftetfund.gov.ng/',
    status: 'open',
  },
  {
    title: 'NEH Public Scholars Program 2026',
    description: 'Supports independent scholars and writers working on humanities book projects intended for general audiences. No institutional affiliation required — perfect for independent researchers.',
    funder: 'National Endowment for the Humanities (NEH)',
    amount: 60000,
    currency: 'USD',
    deadline: new Date('2026-10-15'),
    grantType: 'research',
    eligibility: ['Independent researchers', 'No institution required', 'Humanities book projects'],
    categories: ['Humanities', 'Book Projects', 'Independent Research'],
    countries: ['Nigeria', 'Africa'],
    region: 'International',
    applicationLink: 'https://www.neh.gov/grants/research/public-scholar-program',
    status: 'open',
  },
  {
    title: 'Fulbright Foreign Student Program (Nigeria)',
    description: 'Full funding for Nigerian PhD candidates to pursue graduate study or research in the United States. Strong track record for public policy, education, and social sciences.',
    funder: 'U.S. Embassy Nigeria / Fulbright Program',
    amount: 0,
    currency: 'USD',
    deadline: new Date('2027-03-01'),
    grantType: 'scholarship',
    eligibility: ['Nigerian nationals', 'PhD candidates (minimum 2 years)'],
    categories: ['Public Policy', 'Education', 'Political Science'],
    countries: ['Nigeria'],
    region: 'Nigeria',
    applicationLink: 'https://ng.usembassy.gov/the-fulbright-foreign-student-program/',
    status: 'open',
  },
  {
    title: 'Nigeria Youth Futures Fund — Youth Leadership Grants',
    description: 'Small grants for individuals and youth-led organizations working on governance, civic participation, and youth development in Nigeria.',
    funder: 'Nigeria Youth Futures Fund',
    amount: 10000,
    currency: 'USD',
    deadline: new Date('2026-08-31'),
    grantType: 'project',
    eligibility: ['Youth-led organizations', 'Individual youth leaders', 'Nigerian nationals'],
    categories: ['Youth Development', 'Governance', 'Civic Participation'],
    countries: ['Nigeria'],
    region: 'Nigeria',
    applicationLink: 'https://www.africagrantmakers.org/',
    status: 'open',
  },
  {
    title: 'APSA Centennial Center Research Grants',
    description: 'Supports political science research with a focus on governance, public administration, and democratic studies. Excellent for Nigerian lecturers without PhD departmental affiliation.',
    funder: 'American Political Science Association (APSA)',
    amount: 10000,
    currency: 'USD',
    deadline: new Date('2027-01-15'),
    grantType: 'research',
    eligibility: ['Political science researchers', 'Governance scholars', 'African academics'],
    categories: ['Political Science', 'Public Administration', 'Governance'],
    countries: ['Nigeria', 'Africa'],
    region: 'Sub-Saharan Africa',
    applicationLink: 'https://connect.apsanet.org/centennialcenter/research-grants/',
    status: 'open',
  },
]

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    if (session.user.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    await connectDB()

    const results = []
    for (const g of SEED_GRANTS) {
      const existing = await Grant.findOne({ title: g.title })
      if (existing) {
        results.push({ title: g.title, status: 'skipped (already exists)' })
        continue
      }
      await Grant.create({ ...g, createdBy: session.user.id })
      results.push({ title: g.title, status: 'created' })
    }

    return NextResponse.json({ message: `Seeded ${results.filter((r) => r.status === 'created').length} grants`, results })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Seed failed' }, { status: 500 })
  }
}
