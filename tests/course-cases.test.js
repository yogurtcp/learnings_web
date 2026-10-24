import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,questions} from '../dist/content.js';
import {caseLessons} from '../dist/course-cases.js';
import {questionEvidence} from '../dist/course-evidence.js';
import {fresh,validateState} from '../dist/engine.js';
const ids=['layers','ethernet','subnets','arp','dhcp','routing','nat','ipv6','tcp-connect','tcp-stream','udp','dns','dns-trust','tls-identity','tls-handshake','http','http-versions','sessions','edge','firewalls','captures','spoofing','availability','capstone'];
test('worked-case coverage is complete across the original 24 stable lessons',()=>{
 assert.deepEqual(lessons.map(l=>l.id),ids);assert.equal(Object.keys(caseLessons).length,23);assert.equal(Object.keys(questionEvidence).length,23);
 for(const l of lessons){assert.equal(l.reworked,2,l.id);assert.equal(l.sections.length,4);assert.ok(l.sections[0].evidence?.before,l.id+' starts with evidence');assert.ok(l.sections[0].evidence?.code,l.id+' concrete first observation');assert.match(l.sections[0].evidence.caption,/not.*(?:live|capture)/i);for(const s of l.sections){assert.ok(s.evidence?.annotations.length>=2,l.id+' explains fields');assert.ok(s.text.split(/\s+/).length>=65,l.id+' substantial explanation');}if(l.id!=='layers')for(const q of l.questions){assert.ok(q.givens?.length>40,q.id+' necessary scenario inputs');assert.equal(q.options,undefined);}}
});
test('example arithmetic agrees with the numeric claims used in recall',()=>{
 const address='192.168.1.70',prefix=26,octet=Number(address.split('.').at(-1));const block=2**(32-prefix),network=Math.floor(octet/block)*block;assert.equal(block,64);assert.equal(network,64);assert.equal(network+block-1,127);assert.ok(120>=network&&120<network+block);assert.ok(!(130>=network&&130<network+block));assert.match(caseLessons.subnets.questions[0].answer,/.64–.127/);
 assert.equal(300-2*60,180);assert.match(caseLessons.dns.questions[1].answer,/180/);
 assert.equal(20/2,10);assert.match(caseLessons.availability.questions[2].answer,/10 requests/);
 assert.match(caseLessons['tcp-connect'].questions[2].answer,/1001/);assert.match(caseLessons['tcp-stream'].questions[1].answer,/1300/);
});
test('existing all-course progress and drafts still validate after replacing the teaching',()=>{
 const state=fresh();for(const id of ids){state.completed[id]=100;state.notes[id]='existing notes';}for(const id of ids)for(let n=1;n<=3;n++){const key=id+'-'+n;state.cards[key]={seen:2,interval:4,due:1000,last:100,lastGrade:'good'};state.drafts[key]='existing reasoning';}assert.deepEqual(validateState(state,lessons,questions),state);
});
