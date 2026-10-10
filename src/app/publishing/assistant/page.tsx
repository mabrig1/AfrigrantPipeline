'use client'
import {useState} from 'react'
import Link from 'next/link'
import {Bot,Send,BookOpen} from 'lucide-react'
type Item={role:'assistant'|'user',text:string}
export default function PublishingAssistant(){
 const [messages,setMessages]=useState<Item[]>([{role:'assistant',text:'Welcome to AfriPublish. I can help prepare a manuscript draft, list your submissions, and explain the editorial process. Publication requires separate owner approval.'}])
 const [title,setTitle]=useState(''),[author,setAuthor]=useState(''),[abstract,setAbstract]=useState(''),[body,setBody]=useState('')
 const [busy,setBusy]=useState(false)
 const [question,setQuestion]=useState('')
 const [records,setRecords]=useState<{_id:string,title:string,status:string}[]>([])
 async function askAI(){
  const prompt=question.trim()
  if(!prompt||busy)return
  const history=messages.slice(-10).map(m=>({role:m.role,content:m.text}))
  setQuestion('')
  setMessages(old=>[...old,{role:'user',text:prompt}])
  setBusy(true)
  try{
   const r=await fetch('/api/publishing/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...history,{role:'user',content:prompt}]})})
   const j=await r.json()
   setMessages(old=>[...old,{role:'assistant',text:r.ok?j.reply:j.error||'AI assistant unavailable'}])
  }catch{setMessages(old=>[...old,{role:'assistant',text:'Connection failed'}])}
  finally{setBusy(false)}
 }
 async function run(action:'help'|'list_drafts'|'create_draft'){
  if(busy)return
  setBusy(true)
  setMessages(old=>[...old,{role:'user',text:action==='create_draft'?'Save this manuscript as a draft':action==='list_drafts'?'Show my manuscripts':'How does publication work?'}])
  try{
   const payload=action==='create_draft'?{action,confirm:true,manuscript:{title,author,abstract,body}}:{action}
   const response=await fetch('/api/publishing/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
   const result=await response.json()
   setMessages(old=>[...old,{role:'assistant',text:response.ok?result.reply:(result.error||'Request failed. Check your input and sign-in status.')}])
   if(result.submissions)setRecords(result.submissions)
   if(response.ok&&action==='create_draft'){setTitle('');setAuthor('');setAbstract('');setBody('')}
  }catch{setMessages(old=>[...old,{role:'assistant',text:'Unable to connect to the publishing API.'}])}
  finally{setBusy(false)}
 }
 return <main className="min-h-screen bg-background text-foreground"><div className="mx-auto max-w-4xl px-5 py-12">
  <Link href="/publishing/workspace" className="text-sm text-primary">← Publishing workspace</Link>
  <div className="mt-8 flex items-center gap-3"><Bot size={30} className="text-primary"/><div><h1 className="text-3xl font-bold">Publishing assistant</h1><p className="mt-1 text-sm text-muted-foreground">Guided automation · no autonomous publication</p></div></div>
  <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-5" aria-live="polite">{messages.map((m,i)=><div key={i} className={`max-w-[90%] rounded-xl p-4 text-sm leading-6 ${m.role==='user'?'ml-auto bg-primary text-primary-foreground':'bg-background'}`}>{m.text}</div>)}</div>
  <div className="mt-4 flex gap-2"><input aria-label="Ask the AI publishing assistant" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void askAI()}} placeholder="Ask about citations or publication..." className="min-w-0 flex-1 rounded-lg border border-border bg-background p-3"/><button disabled={busy||!question.trim()} onClick={askAI} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Ask AI</button></div><div className="mt-4 flex flex-wrap gap-3"><button disabled={busy} onClick={()=>run('help')} className="rounded-lg border border-border px-4 py-2 text-sm">Publishing guidance</button><button disabled={busy} onClick={()=>run('list_drafts')} className="rounded-lg border border-border px-4 py-2 text-sm">List my submissions</button></div>
  {records.length>0&&<section className="mt-6 rounded-xl border border-border p-5"><h2 className="font-semibold">Recent submissions</h2>{records.map(r=><p key={r._id} className="mt-3 text-sm">{r.title} · <span className="text-muted-foreground">{r.status}</span></p>)}</section>}
  <section className="mt-8 rounded-2xl border border-border bg-card p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><BookOpen size={21}/> Create a manuscript draft</h2><p className="mt-2 text-sm text-muted-foreground">Enter the complete text. The assistant saves a private draft only after you press the confirmation button.</p>
  <div className="mt-5 grid gap-3"><input aria-label="Article title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Article title" className="rounded-lg border border-border bg-background p-3"/><input aria-label="Author name" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author name" className="rounded-lg border border-border bg-background p-3"/><textarea aria-label="Abstract" rows={4} value={abstract} onChange={e=>setAbstract(e.target.value)} placeholder="Abstract (100+ characters)" className="rounded-lg border border-border bg-background p-3"/><textarea aria-label="Full manuscript" rows={10} value={body} onChange={e=>setBody(e.target.value)} placeholder="Full manuscript (200+ characters)" className="rounded-lg border border-border bg-background p-3"/><button disabled={busy} onClick={()=>run('create_draft')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50"><Send size={17}/> Confirm and save draft</button></div></section>
  <p className="mt-6 text-xs text-muted-foreground">AI guidance requires server-side OPENAI_API_KEY. Chat cannot publish, certify peer review, or register DOIs. Draft creation requires separate confirmation.</p>
 </div></main>
}
