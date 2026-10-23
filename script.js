const questions=[
{q:"毎月、自分が何にいくら使っているか把握している？",category:"household",options:["細かく把握している","大体はわかる","ほとんどわからない"]},
{q:"毎月の貯金はどうしてる？",category:"savings",options:["給料日に先取りしている","余った分だけ貯金","ほぼ貯金できていない"]},
{q:"急な出費に備えた生活費の貯金はある？",category:"savings",options:["生活費6か月分以上","生活費1〜5か月分","1か月分未満・わからない"]},
{q:"NISAについてどれくらい知ってる？",category:"investing",options:["仕組みを理解している","名前や概要は知っている","ほとんど知らない"]},
{q:"年末調整や確定申告で使える控除を確認してる？",category:"tax",options:["自分で毎年確認している","会社任せになっている","よくわからない"]},
{q:"自分が使える給付金や公的制度を調べたことは？",category:"tax",options:["定期的に確認している","必要な時だけ調べる","ほぼ調べたことがない"]},
{q:"将来に向けたお金の目標は決まっている？",category:"future",options:["金額と期限まで決めている","なんとなく考えている","まだ決めていない"]}
];
const types={
household:{icon:"🛍️",name:"使い方見直しタイプ",description:"お金の流れを見える化すると、貯金の第一歩が見つかりそう！",steps:["1か月の支出をざっくり書き出す","固定費と変動費を分ける","無理なく続けられる予算を決める"],posts:["給与明細の見方","クレカの分割・リボ・一括","先取り貯金3STEP"]},
savings:{icon:"🐿️",name:"貯金スタートタイプ",description:"少しずつ備えを増やせると、これからの選択肢が広がりそう。",steps:["毎月の無理のない貯金額を決める","生活費の予備資金を考える","自動で先取りする仕組みを作る"],posts:["先取り貯金3STEP","生活防衛資金はいくら必要？","貯金1000万円まで毎月いくら？"]},
investing:{icon:"🌱",name:"投資これからタイプ",description:"まずは資産形成の基本を学ぶのがおすすめ。急いで投資を始める必要はないよ。",steps:["生活費の備えを確認する","NISAと投資のリスクを理解する","自分の目的と使う時期を考える"],posts:["NISAの2つの枠","ドルコスト平均法","貯金と投資の違い"]},
tax:{icon:"🔍",name:"制度見逃しタイプ",description:"税金や公的制度を知ると、使える選択肢に気づけるかも。",steps:["給与明細の控除欄を確認する","年末調整と確定申告の違いを知る","使える制度を公的窓口で調べる"],posts:["会社員の控除7選","年末調整でできる？できない？","結婚・出産で確認したい税金のこと"]},
future:{icon:"🧭",name:"将来設計これからタイプ",description:"何のためにお金を貯めるか考えると、行動しやすくなるよ。",steps:["叶えたい目標を書き出す","いつ・いくら必要かざっくり考える","毎月の貯金に落とし込む"],posts:["生活防衛資金はいくら必要？","貯金1000万円まで毎月いくら？","先取り貯金3STEP"]},
advanced:{icon:"✨",name:"コツコツ貯金タイプ",description:"お金の習慣が整っているね！知識を深めて、今の習慣をもっと活かそう。",steps:["現在の目標と家計を見直す","税金や制度の確認を習慣にする","将来の計画に合う資産形成を学ぶ"],posts:["NISAの2つの枠","会社員の控除7選","ドルコスト平均法"]}
};
let index=0;const answers=Array(questions.length).fill(null);const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",s.id===id));window.scrollTo(0,0)}
function track(name,params={}){if(typeof window.gtag==="function")window.gtag("event",name,params);if(typeof window.dataLayer!=="undefined")window.dataLayer.push({event:"maneboo_"+name,...params})}
function render(){const q=questions[index];$("counter").textContent=(index+1)+" / "+questions.length;$("progress").style.width=((index+1)/questions.length*100)+"%";$("question").textContent=q.q;$("back").style.visibility=index===0?"hidden":"visible";$("choices").replaceChildren();q.options.forEach((o,i)=>{const b=document.createElement("button");b.className="choice";const tag=document.createElement("span");tag.textContent=String.fromCharCode(65+i)+".";b.append(tag,document.createTextNode(o));b.onclick=()=>{answers[index]=i;if(index===questions.length-1)finish();else{index++;render()}};$("choices").append(b)})}
function decide(){const scores={household:[],savings:[],investing:[],tax:[],future:[]};questions.forEach((q,i)=>scores[q.category].push(answers[i]));const averages=Object.fromEntries(Object.entries(scores).map(([k,v])=>[k,v.reduce((a,b)=>a+b,0)/v.length]));const weakest=Object.entries(averages).sort((a,b)=>b[1]-a[1])[0];return Object.values(averages).every(v=>v<=0.5)?"advanced":weakest[0]}
function finish(){const key=decide(),t=types[key];$("result-icon").textContent=t.icon;$("result-name").textContent=t.name;$("result-description").textContent=t.description;$("steps").replaceChildren();t.steps.forEach(s=>{const li=document.createElement("li");li.textContent=s;$("steps").append(li)});$("posts").replaceChildren();t.posts.forEach((s,i)=>{const d=document.createElement("div");d.className="post-item";const n=document.createElement("b");n.textContent=String(i+1).padStart(2,"0");d.append(n,document.createTextNode(s));$("posts").append(d)});show("result");track("diagnosis_complete",{type:key})}
$("start").onclick=()=>{track("diagnosis_start");show("quiz");render()};$("back").onclick=()=>{if(index>0){index--;render()}};$("again").onclick=()=>{answers.fill(null);index=0;show("hero")};$("follow-link").onclick=()=>track("instagram_click",{type:decide()});$("share").onclick=async()=>{const content="まねぶーのマネー診断で『"+types[decide()].name+"』だった！";if(navigator.share){try{await navigator.share({title:"まねぶーのマネー診断",text:content,url:location.href});track("share_result")}catch(e){}}else{try{await navigator.clipboard.writeText(content+" "+location.href);$("share").textContent="コピーしました！";setTimeout(()=>$("share").textContent="結果をシェア",2200)}catch(e){alert(content)}}};
