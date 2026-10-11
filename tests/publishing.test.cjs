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

const {NextRequest}=require('next/server')
const id='111111111111111111111111'
function setup(user){
 let filter, mutations=0
 const chain={select(){return this},sort(){return this},limit(){return this},lean:async()=>[]}
 const mocks={
  '@/lib/auth':{auth:async()=>user?{user}:null},
  '@/lib/mongodb':{connectDB:async()=>{}},
  '@/models/PublishingJob':{find(f){filter=f;return chain},findOne(f){filter=f;return {lean:async()=>null}},findOneAndUpdate:async()=>{mutations++;return null},create:async()=>{mutations++;return {_id:id,status:'draft'}}}
 }
 return {list:load('src/app/api/publishing/route.ts',mocks),detail:load('src/app/api/publishing/[id]/route.ts',mocks),decision:load('src/app/api/publishing/decision/route.ts',mocks),filter:()=>filter,mutations:()=>mutations}
}
function request(path='',body,origin='https://app.example.com'){
 return new NextRequest('https://app.example.com/api/publishing'+path,{method:body?'POST':'GET',headers:{origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})})
}
test('anonymous users cannot list manuscripts',async()=>assert.equal((await setup().list.GET(request())).status,401))
test('researchers cannot request the editorial queue',async()=>{
 const s=setup({id,verifiedOwner:false});assert.equal((await s.list.GET(request('?scope=editorial'))).status,403);assert.equal(s.filter(),undefined)
})
test('personal listing is scoped and private; verified editor can list all',async()=>{
 const s=setup({id,verifiedOwner:false});const r=await s.list.GET(request());assert.deepEqual(s.filter(),{ownerId:id});assert.equal(r.headers.get('cache-control'),'private, no-store');assert.equal((await r.json()).canEdit,false)
 const editor=setup({id,verifiedOwner:true});assert.equal((await editor.list.GET(request('?scope=editorial'))).status,200);assert.deepEqual(editor.filter(),{})
})
test('manuscript lookup cannot expose another author private text',async()=>{
 const s=setup({id,verifiedOwner:false});assert.equal((await s.detail.GET(request('/'+id),{params:Promise.resolve({id})})).status,404);assert.deepEqual(s.filter(),{_id:id,ownerId:id})
})
test('non-owner, missing confirmation and cross-origin publication do not mutate records',async()=>{
 const body={id,action:'publish',confirmation:'I APPROVE PUBLICATION'}
 const normal=setup({id,verifiedOwner:false});assert.equal((await normal.decision.POST(request('/decision',body))).status,403);assert.equal(normal.mutations(),0)
 const owner=setup({id,verifiedOwner:true});assert.equal((await owner.decision.POST(request('/decision',{id,action:'publish'}))).status,400)
 assert.equal((await owner.decision.POST(request('/decision',body,'https://evil.example'))).status,403);assert.equal(owner.mutations(),0)
})
test('blank manuscript fields cannot create drafts',async()=>{
 const s=setup({id,verifiedOwner:false});assert.equal((await s.list.POST(request('',{title:' '.repeat(20),author:'Author',abstract:'a'.repeat(100),body:'b'.repeat(200)}))).status,400);assert.equal(s.mutations(),0)
})
test('oversized bodies without Content-Length are rejected',async()=>{
 const {readPublishingBody}=load('src/lib/publishing-request.ts');assert.equal(await readPublishingBody(new Request('https://app.example.com',{method:'POST',body:JSON.stringify({data:'x'.repeat(100)})}),20),null)
})
