const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

// Execute real route and policy code with isolated auth/database adapters.
// No live user data or paid providers are used by this suite.
function load(file, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', file)
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const customRequire = (id) => {
    if (id in mocks) return mocks[id]
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`, mocks, cache)
    return require(id)
  }
  new Function('require', 'module', 'exports', code)(
    customRequire,
    module,
    module.exports,
  )
  return module.exports
}
const clientId = '111111111111111111111111'
const creatorId = '222222222222222222222222'
const caseId = '333333333333333333333333'
function setup({
  role = 'student',
  dbRole = role,
  userId = clientId,
  authenticated = true,
  record,
} = {}) {
  let saves = 0
  let listFilter
  let created
  const user = {
    _id: userId,
    role: dbRole,
    email: 'client@example.com',
    name: 'Academic Client',
  }
  const chain = (value) => ({
    select: () => chain(value),
    sort: () => chain(value),
    limit: () => chain(value),
    lean: async () => value,
    then: (yes, no) => Promise.resolve(value).then(yes, no),
  })
  const c = record || {
    _id: caseId,
    clientUserId: clientId,
    quote: {
      amount: 50000,
      scope: 'Proposal drafting and two rounds of review.',
      version: 2,
      status: 'pending',
    },
    stage: 'quoted',
    payments: [],
    documents: [],
    milestones: [],
    partners: [],
    activity: [],
  }
  c.save = async () => {
    saves++
    return c
  }
  const mocks = {
    '@/lib/auth': {
      auth: async () => (authenticated ? { user: { id: userId, role } } : null),
    },
    '@/lib/mongodb': { connectDB: async () => {} },
    '@/models/User': {
      findById: () => chain(user),
      findOne: () => chain(user),
    },
    '@/models/ConsultancyCase': {
      findById: () => chain(c),
      find: (filter) => {
        listFilter = filter
        return chain([])
      },
      countDocuments: async () => 0,
      create: async (body) => {
        created = body
        return { _id: caseId }
      },
    },
    '@/models/Grant': {},
    '@/lib/consultancy/agent': {
      generateDocument: async () => {
        throw new Error('Provider must not run for clients')
      },
      searchEvidence: async () => {
        throw new Error('Provider must not run for clients')
      },
    },
  }
  return {
    route: load('src/app/api/consultancy/cases/[id]/route.ts', mocks),
    list: load('src/app/api/consultancy/cases/route.ts', mocks),
    agent: load('src/app/api/consultancy/cases/[id]/agent/route.ts', mocks),
    c,
    saves: () => saves,
    filter: () => listFilter,
    created: () => created,
  }
}
const params = { params: Promise.resolve({ id: caseId }) }
const request = (body, origin = 'https://app.example.com') =>
  new Request(`https://app.example.com/api/consultancy/cases/${caseId}`, {
    method: 'PATCH',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

test('unauthenticated clients cannot list private cases', async () => {
  const s = setup({ authenticated: false })
  assert.equal((await s.list.GET()).status, 401)
})
test('case list is restricted to the authenticated client ID', async () => {
  const s = setup()
  assert.equal((await s.list.GET()).status, 200)
  assert.deepEqual(s.filter(), { clientUserId: clientId })
})
test('a client cannot read or mutate another client case', async () => {
  const s = setup({ userId: '444444444444444444444444' })
  assert.equal((await s.route.GET(request({}), params)).status, 404)
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'accept_quote', version: 2 }),
        params,
      )
    ).status,
    404,
  )
  assert.equal(s.saves(), 0)
})
test('clients cannot issue quotes, change stages or invoke paid agents', async () => {
  const s = setup()
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'stage', stage: 'awarded' }),
        params,
      )
    ).status,
    403,
  )
  assert.equal(
    (
      await s.agent.POST(
        request({ action: 'generate', kind: 'proposal' }),
        params,
      )
    ).status,
    403,
  )
})
test('stale admin JWT and pre-promotion sessions cannot authorize creator actions', async () => {
  for (const state of [
    { role: 'admin', dbRole: 'student' },
    { role: 'student', dbRole: 'admin' },
  ]) {
    const s = setup(state)
    assert.equal(
      (await s.agent.POST(request({ action: 'discover' }), params)).status,
      403,
    )
  }
})
test('quote acceptance requires the exact current version and can happen once', async () => {
  const s = setup()
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'accept_quote', version: 1 }),
        params,
      )
    ).status,
    409,
  )
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'accept_quote', version: 2 }),
        params,
      )
    ).status,
    200,
  )
  assert.equal(s.c.quote.status, 'accepted')
  assert.equal(s.c.stage, 'active')
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'accept_quote', version: 2 }),
        params,
      )
    ).status,
    409,
  )
  assert.equal(s.saves(), 1)
})
test('creator cannot accept the fee on a client’s behalf', async () => {
  const s = setup({ role: 'admin', userId: creatorId })
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'accept_quote', version: 2 }),
        params,
      )
    ).status,
    409,
  )
})
test('accepted scopes cannot be silently replaced', async () => {
  const s = setup({ role: 'admin' })
  s.c.quote.status = 'accepted'
  assert.equal(
    (
      await s.route.PATCH(
        request({
          action: 'quote',
          version: 2,
          amount: 90000,
          scope: 'New scope that has not been accepted.',
        }),
        params,
      )
    ).status,
    409,
  )
})
test('recorded payments reject duplicates and amounts exceeding the agreed balance', async () => {
  const s = setup({ role: 'admin' })
  s.c.quote.status = 'accepted'
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'payment', amount: 30000, reference: 'TRX-123' }),
        params,
      )
    ).status,
    200,
  )
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'payment', amount: 10000, reference: 'trx-123' }),
        params,
      )
    ).status,
    409,
  )
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'payment', amount: 30000, reference: 'TRX-124' }),
        params,
      )
    ).status,
    400,
  )
})
test('cross-origin mutations are denied', async () => {
  const s = setup({ role: 'admin' })
  assert.equal(
    (
      await s.route.PATCH(
        request({ action: 'stage', stage: 'active' }, 'https://evil.example'),
        params,
      )
    ).status,
    403,
  )
})
test('a new document version is saved as draft without overwriting approved text', async () => {
  const s = setup({ role: 'admin' })
  s.c.documents.push({
    id: 'old',
    kind: 'proposal',
    content: 'Approved original text',
    status: 'approved',
    version: 1,
  })
  assert.equal(
    (
      await s.route.PATCH(
        request({
          action: 'save_document',
          kind: 'proposal',
          content: 'A revised document with additional supported facts.',
        }),
        params,
      )
    ).status,
    200,
  )
  assert.equal(s.c.documents[0].status, 'approved')
  assert.equal(s.c.documents[1].status, 'draft')
  assert.equal(s.c.documents[1].version, 2)
})
test('case intake rejects privilege injection and binds ownership to the session', async () => {
  const s = setup()
  const brief = {
    clientName: 'Other Name',
    clientEmail: 'other@example.com',
    institution: 'University of Nigeria, Nsukka',
    careerStage: 'phd',
    department: 'Public administration',
    topic: 'Local government accountability',
    brief:
      'Research on public accountability and local government service delivery.',
    service: 'proposal',
    consent: true,
  }
  assert.equal(
    (await s.list.POST(request({ ...brief, role: 'admin' }))).status,
    400,
  )
  assert.equal((await s.list.POST(request(brief))).status, 201)
  assert.equal(s.created().clientUserId, clientId)
  assert.equal(s.created().clientEmail, 'client@example.com')
})
test('MoU and partner schemas reject unsafe URLs and arbitrary document kinds', () => {
  const { actionSchema, agentSchema } = load('src/lib/consultancy/contracts.ts')
  assert.equal(
    actionSchema.safeParse({
      action: 'partner',
      name: 'Research Group',
      url: 'javascript:alert(1)',
      role: 'Research collaboration',
      status: 'agreed',
    }).success,
    false,
  )
  assert.equal(
    agentSchema.safeParse({ action: 'generate', kind: 'signed_contract' })
      .success,
    false,
  )
})
