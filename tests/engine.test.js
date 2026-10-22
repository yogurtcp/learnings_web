import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,gradeCard,dueQuestions,nextLesson,makeSession,recordGrade,validateState,DAY,localDay,streak} from '../dist/engine.js';
import {lessons,questions,glossary,chapters} from '../dist/content.js';
test('curriculum has complete explanations, unique cards, two prompts and defined terms',()=>{
 assert.equal(lessons.length,24);assert.equal(questions.length,72);assert.equal(chapters.length,6);assert.equal(new Set(questions.map(q=>q.id)).size,72);
 for(const l of lessons){assert.equal(l.sections.length,4);assert.ok(l.sections.every(s=>s.text.length>100));assert.ok(l.trace&&l.example.length>=4&&l.trap);assert.equal(l.questions.length,3);for(const t of l.terms)assert.ok(glossary[t],t);for(const q of l.questions){assert.equal(q.prompts.length,2);assert.ok(q.answer.length>100);assert.equal(q.checks.length,3);assert.equal(q.options,undefined);}}
});
test('ratings schedule actual due dates, cap intervals and bring forgotten ideas back soon',()=>{
 const now=100000000;assert.equal(gradeCard(null,'again',now).due,now+600000);assert.equal(gradeCard(null,'hard',now).interval,.5);assert.equal(gradeCard(null,'good',now).interval,1);assert.equal(gradeCard(null,'easy',now).interval,4);
 assert.equal(gradeCard({interval:10,seen:3},'good',now).interval,24);assert.equal(gradeCard({interval:300,seen:1},'easy',now).interval,365);assert.throws(()=>gradeCard(null,'unknown'));
});
test('reviews exclude unseen and incomplete lessons, sort by due date, next lesson follows completion',()=>{
 const s=fresh(),now=100000000,q=questions[0];s.cards[q.id]=gradeCard(null,'again',now);assert.equal(dueQuestions(s,questions,now+DAY).length,0);s.completed[q.lessonId]=now;assert.equal(dueQuestions(s,questions,now).length,0);assert.equal(dueQuestions(s,questions,now+DAY).length,1);assert.equal(nextLesson(s,lessons).id,lessons[1].id);
});
test('questions require reveal, advance once, alternate prompts and retain a backup-safe session',()=>{
 const s=fresh(),q=questions[0],session=makeSession('lesson',[q],s,q.lessonId);s.sessions['lesson:'+q.lessonId]=session;assert.throws(()=>recordGrade(s,session,q,'good'));session.revealed=true;assert.equal(recordGrade(s,session,q,'good'),true);assert.equal(s.activity.length,1);assert.equal(session.index,1);assert.equal(session.revealed,false);assert.equal(makeSession('lesson',[q],s,q.lessonId).items[0].variant,1);assert.deepEqual(validateState(JSON.parse(JSON.stringify(s)),lessons,questions),s);
});
test('backup rejects malformed cards, sessions and text without changing current state',()=>{
 const s=fresh();assert.throws(()=>validateState({schema:22},lessons,questions));for(const bad of [{...s,cards:{'layers-1':{}}},{...s,notes:{layers:4}},{...s,sessions:{review:{}}},{...s,completed:{'not-a-lesson':1}},{...s,settings:{reviewLimit:1000}}])assert.throws(()=>validateState(bad,lessons,questions));assert.deepEqual(s,fresh());
});
test('streak handles local calendar days and yesterday when today has no session',()=>{
 const d=new Date(2026,9,22,12);const y=new Date(d);y.setDate(y.getDate()-1);const before=new Date(y);before.setDate(before.getDate()-1);assert.equal(streak([{at:+y},{at:+before}],+d),2);assert.equal(streak([{at:+d},{at:+y}],+d),2);assert.equal(localDay(d),'2026-10-22');
});
