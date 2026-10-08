export function makePlan({minutes=120,due=[],weak=[],newTopics=[],mockDay=false,daysToExam=999}){
 let budget=Math.max(30,minutes),out=[];
 const add=(type,mins,items)=>{if(budget<=0)return;const m=Math.min(budget,Math.max(1,mins));out.push({type,minutes:m,items});budget-=m};
 add('REVISION',Math.min(budget,Math.round(minutes*.4)),due);
 add('WEAK TOPICS',Math.min(budget,Math.round(minutes*.35)),weak.slice(0,2));
 if(daysToExam>=21)add('NEW SYLLABUS',Math.min(budget,Math.round(minutes*.15)),newTopics.slice(0,1));
 if(mockDay||daysToExam<21)add('MOCK / ERROR REVIEW',budget,[]);
 else if(budget>0)add('BUFFER / PYQ',budget,[]);
 if(daysToExam<21)out=out.map(x=>x.type==='NEW SYLLABUS'?{...x,minutes:0,items:[]}:x);
 return out.filter(x=>x.minutes>0);
}