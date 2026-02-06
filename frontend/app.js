const API="http://localhost:5000/api";
let editId=null;
let lastData=[];

// ---------- AUTH ----------
function register(){
fetch(API+"/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({email:email.value,password:pass.value})})
.then(()=>location="login.html");
}

function login(){
fetch(API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({email:email.value,password:pass.value})})
.then(()=>location="dashboard.html");
}

function logout(){ location="login.html"; }

// ---------- TOAST ----------
function toast(msg){
const t=document.getElementById("toast");
t.innerText=msg;
t.classList.add("show");
setTimeout(()=>t.classList.remove("show"),1500);
}

// ---------- ADD / UPDATE ----------
function addCampaign(){
const data={
name:name.value,
platform:platform.value,
budget:+budget.value,
leads:+leads.value,
sales:+sales.value
};

if(editId){
fetch(API+"/campaign/"+editId,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
}).then(()=>{ editId=null; clearForm(); load(); toast("Campaign Updated"); });
}else{
fetch(API+"/campaign",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
}).then(()=>{ clearForm(); load(); toast("Campaign Added"); });
}
}

// ---------- LOAD ----------
function load(){
fetch(API+"/campaign")
.then(r=>r.json())
.then(d=>{
lastData=d; // keep for CSV

list.innerHTML="";
let tbv=0, tsv=0;

d.forEach(c=>{
tbv+=c.budget;
tsv+=c.sales;

list.innerHTML+=`
<div>
<b>${c.name}</b> (${c.platform}) Profit:${c.sales-c.budget}
<button onclick="editCampaign('${c._id}','${c.name}',${c.budget},${c.leads},${c.sales})">✏</button>
<button onclick="delCampaign('${c._id}')">❌</button>
</div>`;
});

tb.innerText=tbv;
ts.innerText=tsv;
tp.innerText=tsv-tbv;
ac.innerText=d.length;

ai.innerText=(tsv-tbv)>0 ? "AI Insight: Campaigns are profitable 👍" : "AI Insight: Try reducing budget ⚠";

drawChart(d);
});
}

// ---------- DELETE ----------
function delCampaign(id){
fetch(API+"/campaign/"+id,{method:"DELETE"})
.then(()=>{ load(); toast("Campaign Deleted"); });
}

// ---------- EDIT ----------
function editCampaign(id,n,b,l,s){
editId=id;
name.value=n;
budget.value=b;
leads.value=l;
sales.value=s;
}

// ---------- CSV EXPORT ----------
function exportCSV(){
if(!lastData.length){ toast("No data to export"); return; }

let csv="Name,Platform,Budget,Leads,Sales\n";
lastData.forEach(c=>{
csv+=`${c.name},${c.platform},${c.budget},${c.leads},${c.sales}\n`;
});

const blob=new Blob([csv],{type:"text/csv"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="campaigns.csv";
a.click();

toast("CSV Downloaded");
}

// ---------- UTIL ----------
function clearForm(){
name.value=""; budget.value=""; leads.value=""; sales.value="";
}

// ---------- CHART ----------
function drawChart(d){
new Chart(document.getElementById("chart"),{
type:"bar",
data:{
labels:d.map(x=>x.name),
datasets:[
{label:"Budget",data:d.map(x=>x.budget)},
{label:"Sales",data:d.map(x=>x.sales)}
]
}
});
}

function toggleTheme(){ document.body.classList.toggle("dark"); }

// Auto-load dashboard
if(location.pathname.includes("dashboard")) load();
