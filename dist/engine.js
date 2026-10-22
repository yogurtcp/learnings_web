export const DAY=86400000;
export const KEY='packet-path-v1';
export function fresh(){return {schema:1,completed:{},cards:{},sessions:{},drafts:{},reading:{},activity:[],notes:{},settings:{reviewLimit:10}};}
export function gradeCard(previous,grade,now=Date.now()){
 if(!['again','hard','good','easy'].includes(grade))throw new Error('Invalid rating');
 const old=previous?.interval||0;
 const interval=grade==='again'?10/1440:grade==='hard'?Math.max(.5,old*1.2):grade==='good'?Math.max(1,old*2.4):Math.max(4,old*3.2);
 return {seen:(previous?.seen||0)+1,interval:Math.min(365,interval),due:now+Math.min(365,interval)*DAY,last:now,lastGrade:grade};
}
export function dueQuestions(state,questions,now=Date.now()){
 return questions.filter(q=>state.completed[q.lessonId]&&state.cards[q.id]&&state.cards[q.id].due<=now).sort((a,b)=>state.cards[a.id].due-state.cards[b.id].due);
}
export function nextLesson(state,lessons){return lessons.find(l=>!state.completed[l.id]);}
export function makeSession(mode,items,state,lessonId=null){return {mode,lessonId,index:0,revealed:false,items:items.map(q=>({id:q.id,variant:(state.cards[q.id]?.seen||0)%q.prompts.length})),grades:[],created:Date.now()};}
export function recordGrade(state,session,question,grade,now=Date.now()){
 if(!session.revealed)throw new Error('Reveal the answer before rating');
 if(session.items[session.index]?.id!==question.id)throw new Error('Question mismatch');
 state.cards[question.id]=gradeCard(state.cards[question.id],grade,now);
 state.activity.push({at:now,questionId:question.id,grade});
 session.grades.push(grade);session.index++;session.revealed=false;
 return session.index>=session.items.length;
}
export function localDay(time){const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function streak(activity,now=Date.now()){
 const days=new Set(activity.map(a=>localDay(a.at)));const date=new Date(now);let count=0;
 if(!days.has(localDay(date)))date.setDate(date.getDate()-1);
 while(days.has(localDay(date))){count++;date.setDate(date.getDate()-1);}return count;
}
export function validateState(value,lessons,questions){
 const valid=value&&typeof value==='object'&&value.schema===1;
 if(!valid)throw new Error('This is not a Packet Path progress backup (version 1).');
 const out=fresh(), lids=new Set(lessons.map(l=>l.id)),qids=new Set(questions.map(q=>q.id));
 const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const timestamp=v=>Number.isFinite(v)&&v>=0&&v<1e15;
 for(const k of ['completed','cards','sessions','drafts','reading','notes'])if(!obj(value[k]))throw new Error(`Invalid backup: ${k}.`);
 for(const [id,t]of Object.entries(value.completed)){if(!lids.has(id)||!timestamp(t))throw new Error('Invalid lesson completion.');out.completed[id]=t;}
 for(const [id,c]of Object.entries(value.cards)){
  if(!qids.has(id)||!obj(c)||!Number.isInteger(c.seen)||c.seen<1||!Number.isFinite(c.interval)||c.interval<=0||c.interval>365||!timestamp(c.due)||!timestamp(c.last)||!['again','hard','good','easy'].includes(c.lastGrade))throw new Error('Invalid review record.');
  out.cards[id]={seen:c.seen,interval:c.interval,due:c.due,last:c.last,lastGrade:c.lastGrade};
 }
 if(!Array.isArray(value.activity)||value.activity.some(a=>!obj(a)||!timestamp(a.at)||!qids.has(a.questionId)||!['again','hard','good','easy'].includes(a.grade)))throw new Error('Invalid activity history.');
 out.activity=value.activity.map(a=>({at:a.at,questionId:a.questionId,grade:a.grade}));
 for(const [key,s]of Object.entries(value.sessions)){
  if(!['review',...lessons.map(l=>'lesson:'+l.id)].includes(key)||!obj(s)||!['review','lesson'].includes(s.mode)||!Array.isArray(s.items)||!s.items.length||s.items.length>questions.length||!Number.isInteger(s.index)||s.index<0||s.index>s.items.length||typeof s.revealed!=='boolean'||!Array.isArray(s.grades)||s.grades.length!==s.index||s.grades.some(g=>!['again','hard','good','easy'].includes(g))||!timestamp(s.created))throw new Error('Invalid saved session.');
  if(s.mode==='lesson'&&(!lids.has(s.lessonId)||key!=='lesson:'+s.lessonId))throw new Error('Invalid lesson session.');
  if(s.mode==='review'&&(key!=='review'||s.lessonId!==null))throw new Error('Invalid review session.');
  if(s.items.some(i=>!obj(i)||!qids.has(i.id)||!Number.isInteger(i.variant)||i.variant<0||i.variant>=questions.find(q=>q.id===i.id).prompts.length||(s.mode==='lesson'&&questions.find(q=>q.id===i.id).lessonId!==s.lessonId)))throw new Error('Invalid session question.');
  out.sessions[key]={mode:s.mode,lessonId:s.lessonId,index:s.index,revealed:s.revealed,items:s.items.map(i=>({id:i.id,variant:i.variant})),grades:[...s.grades],created:s.created};
 }
 for(const k of ['drafts','notes'])for(const[id,t]of Object.entries(value[k])){if(!(k==='notes'?lids:qids).has(id)||typeof t!=='string'||t.length>50000)throw new Error('Invalid saved text.');out[k][id]=t;}
 for(const[id,p]of Object.entries(value.reading)){if(!lids.has(id)||!Number.isInteger(p)||p<0||p>100)throw new Error('Invalid reading position.');out.reading[id]=p;}
 const limit=value.settings?.reviewLimit;if(!Number.isInteger(limit)||limit<3||limit>30)throw new Error('Invalid review limit.');out.settings.reviewLimit=limit;
 return out;
}
