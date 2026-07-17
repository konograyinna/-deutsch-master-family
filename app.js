
let DATA=null;
const state={profile:localStorage.getItem("dm_profile")||null,view:"home",course:null,lesson:0,index:0};
const app=document.getElementById("app"),nav=document.getElementById("nav"),who=document.getElementById("who");
const p=()=>DATA.profiles.find(x=>x.id===state.profile);
const key=x=>`dm_${state.profile}_${x}`;
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function updateHeader(){who.textContent=p()?`${p().emoji} ${p().name}`:"Оберіть профіль"}
function showProfiles(){
  state.profile=null;nav.classList.add("hidden");updateHeader();
  app.innerHTML=`<section class="welcome"><h1>Вітаємо 👋</h1><p>Оберіть, хто сьогодні навчається</p></section><div class="profiles">${DATA.profiles.map(x=>`<button class="profile" data-id="${x.id}"><div class="e">${x.emoji}</div><div><h3>${x.name}</h3><p>${x.subtitle}</p></div></button>`).join("")}</div>`;
  document.querySelectorAll(".profile").forEach(b=>b.onclick=()=>{state.profile=b.dataset.id;localStorage.setItem("dm_profile",state.profile);state.view="home";render()});
}
function courseCard(id){
  const c=DATA.courses[id],n=c.lessons.reduce((a,l)=>a+l.words.length,0);
  return `<article class="card course" data-course="${id}"><div class="e">${c.emoji}</div><h3>${c.title}</h3><p>${c.description}</p><small>${c.lessons.length} уроків · ${n} слів</small></article>`;
}
function bindCourses(){document.querySelectorAll("[data-course]").forEach(x=>x.onclick=()=>{state.course=x.dataset.course;state.view="course";render()})}
function home(){app.innerHTML=`<section class="hero"><h1>Привіт, ${p().name}! ${p().emoji}</h1><p>Почнімо з короткого уроку. Прогрес зберігається окремо для кожного профілю.</p></section><div class="title"><h2>Твої курси</h2><span>${p().courses.length} напрямки</span></div><div class="grid">${p().courses.map(courseCard).join("")}</div>`;bindCourses()}
function courses(){app.innerHTML=`<div class="title"><h2>Навчальні курси</h2><span>${p().courses.length}</span></div><div class="grid">${p().courses.map(courseCard).join("")}</div>`;bindCourses()}
function course(){
  const c=DATA.courses[state.course];
  app.innerHTML=`<button class="back" id="back">← Назад</button><section class="hero"><h1>${c.emoji} ${c.title}</h1><p>${c.description}</p></section><div class="title"><h2>Уроки</h2></div>${c.lessons.map((l,i)=>`<button class="lesson" data-lesson="${i}"><div><h3>${i+1}. ${l.title}</h3><p>${l.words.length} слів</p></div><span>›</span></button>`).join("")}`;
  document.getElementById("back").onclick=()=>{state.view="courses";render()};
  document.querySelectorAll("[data-lesson]").forEach(b=>b.onclick=()=>{state.lesson=Number(b.dataset.lesson);state.index=0;state.view="study";render()});
}
function speak(t){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="de-DE";u.rate=.88;speechSynthesis.speak(u)}
function study(){
  const l=DATA.courses[state.course].lessons[state.lesson],w=l.words[state.index];
  if(!w){app.innerHTML=`<div class="card study"><div style="font-size:50px">🎉</div><h2>Урок завершено</h2><button class="primary" id="done">До курсу</button></div>`;document.getElementById("done").onclick=()=>{state.view="course";render()};return}
  app.innerHTML=`<button class="back" id="back">← ${l.title}</button><div class="card study"><div class="sub">Слово ${state.index+1} з ${l.words.length}</div><div class="de">${w.de}</div><div class="uk">${w.uk}</div><button class="secondary" id="speak">🔊 Прослухати</button><div class="example">${w.example}<small>${w.exampleUk}</small></div><div class="actions"><button data-grade="again">Ще раз</button><button data-grade="hard">Важко</button><button data-grade="good">Знаю</button></div></div>`;
  document.getElementById("back").onclick=()=>{state.view="course";render()};
  document.getElementById("speak").onclick=()=>speak(w.de);
  document.querySelectorAll("[data-grade]").forEach(b=>b.onclick=()=>grade(b.dataset.grade,w.de));
}
function grade(g,word){
  const s=read(key("stats"),{seen:0,known:0});s.seen++;if(g==="good")s.known++;write(key("stats"),s);
  const r=read(key("review"),[]);r.push({word,due:Date.now()+(g==="good"?3:g==="hard"?1:0)*86400000});write(key("review"),r.slice(-300));
  state.index++;render();
}
function review(){const d=read(key("review"),[]).filter(x=>x.due<=Date.now());app.innerHTML=d.length?`<div class="title"><h2>До повторення</h2><span>${d.length}</span></div><div class="card"><p>${d.slice(0,20).map(x=>x.word).join(" · ")}</p></div>`:`<div class="empty">🧠<h3>Поки все повторено</h3><p>Нові картки з’являться тут у потрібний день.</p></div>`}
function stats(){const s=read(key("stats"),{seen:0,known:0});app.innerHTML=`<div class="title"><h2>Мій прогрес</h2></div><div class="stats"><div class="card stat"><strong>${s.known}</strong><span>знаю</span></div><div class="card stat"><strong>${s.seen}</strong><span>відповідей</span></div></div>`}
function render(){
  if(!state.profile){showProfiles();return}
  nav.classList.remove("hidden");updateHeader();
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
  if(state.view==="home")home();else if(state.view==="courses")courses();else if(state.view==="course")course();else if(state.view==="study")study();else if(state.view==="review")review();else stats();
}
document.getElementById("changeProfile").onclick=()=>{localStorage.removeItem("dm_profile");showProfiles()};
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>{state.view=b.dataset.view;render()});
fetch("./data.json").then(r=>{if(!r.ok)throw new Error("data");return r.json()}).then(d=>{DATA=d;render()}).catch(()=>{app.innerHTML='<div class="empty"><h3>Не вдалося завантажити дані</h3><p>Перевірте файли data.json і налаштування Netlify.</p></div>'});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
