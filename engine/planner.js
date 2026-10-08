export function makePlan({minutes=120,due=[],weak=[],newTopics=[],mockDay=false,daysToExam=999}){
 let budget=Math.max(30,minutes),out=[];
 const add=(type,mins,items)=>{if(budget<=0)return;const m=Math.min(budget,Math.max(1,mins));out.push({type,minutes:m,items});budget-=m};
 if(daysToExam<21){
   add('REVISION / ERROR REVIEW',Math.round(minutes*.2),due);
   add('WEAK TOPICS',Math.round(minutes*.2),weak.slice(0,2));
   add('MOCK / ERROR REVIEW',budget,[]);
   return out;
 }
 add('REVISION',Math.round(minutes*.4),due);
 add('WEAK TOPICS',Math.round(minutes*.35),weak.slice(0,2));
 add('NEW SYLLABUS',Math.round(minutes*.15),newTopics.slice(0,1));
 if(mockDay)add('MOCK / ERROR REVIEW',budget,[]);else if(budget>0)add('BUFFER / PYQ',budget,[]);
 return out.filter(x=>x.minutes>0);
}