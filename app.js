import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const SUPABASE_URL = "https://guhhuqxrobhuumwrypnc.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_6dr2KACqmGBM2AWZS6NTDw_1Kf3e8ru";
const API_URL = `${SUPABASE_URL}/functions/v1/rewardloop-api`;
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" }
});

const $ = (id) => document.getElementById(id);
const state = { user: null, profile: null, language: localStorage.getItem("growta-language") || "hi", installPrompt: null, stream: null, cameraTimer: null };
const copy = {
  hi: {
    eyebrow:"किसान के लिए डिजिटल पुरस्कार",heroTitle:"हर असली उत्पाद QR से जुड़ें अपने पुरस्कार से।",heroCopy:"साइन इन करें, योग्य उत्पाद कोड क्लेम करें और अपने पॉइंट्स व रिवॉर्ड्स देखें।",secureClaim:"सर्वर द्वारा सत्यापित QR क्लेम",clearLedger:"स्पष्ट पॉइंट हिस्ट्री",easyRewards:"आसान रिवॉर्ड रिडेम्प्शन",welcome:"स्वागत है",signInTitle:"ईमेल से साइन इन करें",signInCopy:"हम आपके ईमेल पर सुरक्षित साइन-इन लिंक भेजेंगे।",emailLabel:"ईमेल पता",sendLink:"साइन-इन लिंक भेजें",privacyNote:"आपके पॉइंट्स केवल सफल सर्वर सत्यापन के बाद अपडेट होंगे।",almostThere:"बस एक कदम और",profileTitle:"अपनी किसान प्रोफ़ाइल पूरी करें",profileCopy:"आपका नाम और भाषा आपके अकाउंट से जुड़ेंगे।",nameLabel:"पूरा नाम",phoneLabel:"मोबाइल नंबर (वैकल्पिक, +91 सहित)",saveProfile:"प्रोफ़ाइल सेव करें",farmerSpace:"आपका RewardLoop",serverVerified:"सर्वर सत्यापित",availablePoints:"उपलब्ध पॉइंट्स",balanceHint:"बैलेंस सुरक्षित पॉइंट्स लेजर से पढ़ा जाता है।",claimHeading:"उत्पाद QR क्लेम करें",claimCopy:"पैक पर दिया गया कोड दर्ज करें। क्लेम सर्वर पर सत्यापित होगा।",qrLabel:"उत्पाद कोड",scanCamera:"कैमरा स्कैन",claimButton:"कोड क्लेम करें",catalogEyebrow:"आपके लिए",rewardsHeading:"रिवॉर्ड कैटलॉग",refresh:"रिफ्रेश",loadingRewards:"रिवॉर्ड लोड हो रहे हैं…",historyEyebrow:"हाल की गतिविधि",activityHeading:"आपकी गतिविधि",activityPrivacy:"आपकी गतिविधि सुरक्षित रूप से लोड की जाएगी।",footerNote:"सुरक्षित क्लेम • पारदर्शी रिवॉर्ड",install:"ऐप इंस्टॉल करें",logout:"लॉग आउट",sent:"साइन-इन लिंक भेजने का अनुरोध किया गया। ईमेल और स्पैम फ़ोल्डर देखें।",sentTitle:"ईमेल चेक करें",authFail:"साइन-इन लिंक नहीं भेजा जा सका। थोड़ी देर बाद फिर कोशिश करें।",profileFail:"प्रोफ़ाइल सेव नहीं हुई। विवरण जाँचकर दोबारा कोशिश करें।",profileSaved:"प्रोफ़ाइल सेव हो गई।",claimSuccess:"क्लेम सफल हुआ।",claimFailed:"कोड क्लेम नहीं हुआ। कोड और अभियान की स्थिति जाँचें।",cameraUnsupported:"इस ब्राउज़र में QR कैमरा उपलब्ध नहीं है। कोड हाथ से दर्ज करें।",cameraDenied:"कैमरा चालू नहीं हो सका। अनुमति दें या कोड हाथ से दर्ज करें।",cameraStop:"स्कैन रोकें",noRewards:"अभी कोई सक्रिय रिवॉर्ड उपलब्ध नहीं है।",loadFailed:"डेटा लोड नहीं हो सका। रिफ्रेश करके फिर कोशिश करें।",redeem:"रिडीम करें",points:"पॉइंट्स",redemptionSent:"रिडेम्प्शन अनुरोध भेजा गया।",redemptionFail:"रिडेम्प्शन नहीं हो सका। पॉइंट्स और स्टॉक जाँचें।",activityEmpty:"अभी कोई गतिविधि नहीं है।",pending:"सत्यापन लंबित",verified:"सत्यापित",rejected:"अस्वीकृत",signInFirst:"आगे बढ़ने के लिए पहले साइन इन करें।",setupError:"सेशन की जाँच नहीं हो सकी। पेज रीलोड करें।",profileNeeded:"आगे बढ़ने के लिए प्रोफ़ाइल पूरी करें।",balanceUnavailable:"—",balanceLoadError:"बैलेंस उपलब्ध नहीं",earn:"कमाए",redeemed:"रिडीम",unknownError:"कुछ गलत हुआ। फिर कोशिश करें।"
  },
  en: {
    eyebrow:"Digital rewards for farmers",heroTitle:"Turn every genuine product QR into a reward.",heroCopy:"Sign in, claim eligible product codes, and see your points and rewards.",secureClaim:"Server-verified QR claims",clearLedger:"Clear points history",easyRewards:"Simple reward redemption",welcome:"Welcome",signInTitle:"Sign in with email",signInCopy:"We’ll send a secure sign-in link to your email.",emailLabel:"Email address",sendLink:"Send sign-in link",privacyNote:"Points update only after successful server validation.",almostThere:"One more step",profileTitle:"Complete your farmer profile",profileCopy:"Your name and language will be linked to your account.",nameLabel:"Full name",phoneLabel:"Mobile number (optional, include +91)",saveProfile:"Save profile",farmerSpace:"Your RewardLoop",serverVerified:"Server verified",availablePoints:"Available points",balanceHint:"Balance is read from the secure points ledger.",claimHeading:"Claim a product QR",claimCopy:"Enter the code printed on your pack. The server verifies every claim.",qrLabel:"Product code",scanCamera:"Scan with camera",claimButton:"Claim code",catalogEyebrow:"Picked for you",rewardsHeading:"Reward catalogue",refresh:"Refresh",loadingRewards:"Loading rewards…",historyEyebrow:"Recent activity",activityHeading:"Your activity",activityPrivacy:"Your activity will load securely.",footerNote:"Secure claims • Transparent rewards",install:"Install app",logout:"Log out",sent:"A sign-in link was requested. Check your inbox and spam folder.",sentTitle:"Check your email",authFail:"Could not send the sign-in link. Please try again shortly.",profileFail:"Profile was not saved. Check your details and retry.",profileSaved:"Profile saved.",claimSuccess:"Claim accepted.",claimFailed:"The code could not be claimed. Check the code and campaign status.",cameraUnsupported:"QR camera scanning is unavailable in this browser. Enter the code manually.",cameraDenied:"Could not start the camera. Allow access or enter the code manually.",cameraStop:"Stop scanning",noRewards:"No active rewards are available right now.",loadFailed:"Could not load data. Refresh and try again.",redeem:"Redeem",points:"points",redemptionSent:"Redemption request submitted.",redemptionFail:"Redemption failed. Check your points and reward stock.",activityEmpty:"No activity yet.",pending:"Pending verification",verified:"Verified",rejected:"Rejected",signInFirst:"Sign in to continue.",setupError:"Could not verify your session. Reload the page.",profileNeeded:"Complete your profile to continue.",balanceUnavailable:"—",balanceLoadError:"Balance unavailable",earn:"Earned",redeemed:"Redeemed",unknownError:"Something went wrong. Please try again."
  }
};
const t = (key) => copy[state.language]?.[key] || copy.en[key] || key;
function setNotice(message, kind="info") {
  const el = $("notice"); el.textContent = message; el.className = `notice ${kind}`; el.classList.remove("hidden");
}
function clearNotice() { $("notice").classList.add("hidden"); $("notice").textContent = ""; }
function showView(view) {
  for (const id of ["auth-view","profile-view","app-view"]) $(id).classList.toggle("hidden", id !== view);
  $("logout-button").classList.toggle("hidden", !state.user);
}
function applyLanguage() {
  document.documentElement.lang = state.language === "hi" ? "hi" : "en";
  $("language").value = state.language;
  document.querySelectorAll("[data-i18n]").forEach(el => { const key=el.dataset.i18n; if(t(key)) el.textContent=t(key); });
  $("install-button").textContent=t("install"); $("logout-button").textContent=t("logout");
}
async function invoke(action, data={}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("not_authenticated");
  const response = await fetch(API_URL, {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`,"apikey":SUPABASE_PUBLIC_KEY},
    body:JSON.stringify({action,...data})
  });
  const result = await response.json().catch(()=>({ok:false,error:"invalid_server_response"}));
  if (!response.ok || result.ok === false) {
    const error = new Error(result.error || "request_failed"); error.status=response.status; error.result=result; throw error;
  }
  return result;
}
async function refreshSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  state.user = data.session?.user || null;
  if (!state.user) { state.profile=null; showView("auth-view"); return; }
  $("logout-button").classList.remove("hidden");
  await loadProfile();
}
async function loadProfile() {
  const { data, error } = await supabase.from("partners")
    .select("id,user_id,display_name,role,verification_status,preferred_locale")
    .eq("user_id",state.user.id).maybeSingle();
  if (error) {
    // RLS may deliberately hide profile rows; show onboarding instead of assuming it exists.
    state.profile=null; showView("profile-view"); return;
  }
  state.profile=data;
  if (!data) { showView("profile-view"); return; }
  if (data.role !== "farmer") { setNotice("This account is not a farmer profile.", "error"); showView("profile-view"); return; }
  state.language = data.preferred_locale === "en-IN" ? "en" : state.language;
  applyLanguage();
  $("greeting").textContent = `${state.language==="hi"?"नमस्ते":"Hello"}, ${data.display_name}`;
  $("profile-status").textContent = data.verification_status === "verified" ? t("verified") : t("pending");
  showView("app-view");
  await Promise.allSettled([loadBalance(),loadRewards(),loadActivity()]);
}
async function loadBalance() {
  const el=$("points-balance"); el.textContent="…";
  const { data, error } = await supabase.from("points_ledger").select("points_delta").eq("partner_id",state.profile.id);
  if (error || !data) { el.textContent=t("balanceUnavailable"); el.title=t("balanceLoadError"); return; }
  el.textContent = data.reduce((sum,row)=>sum+Number(row.points_delta||0),0).toLocaleString(state.language==="hi"?"hi-IN":"en-IN");
}
async function loadRewards() {
  const root=$("rewards-list"); root.innerHTML=`<div class="panel muted">${t("loadingRewards")}</div>`;
  const { data, error } = await supabase.from("rewards")
    .select("id,name,name_hi,description,description_hi,points_cost,stock_quantity,category")
    .eq("active",true).eq("is_demo",false).order("sort_order").limit(50);
  if (error) { root.textContent=t("loadFailed"); return; }
  if (!data?.length) { root.textContent=t("noRewards"); return; }
  root.replaceChildren();
  for (const reward of data) {
    const card=document.createElement("article"); card.className="reward-card";
    const title=document.createElement("h3"); title.textContent=state.language==="hi"?(reward.name_hi||reward.name):reward.name;
    const desc=document.createElement("p"); desc.textContent=state.language==="hi"?(reward.description_hi||reward.description||""): (reward.description||"");
    const cost=document.createElement("div"); cost.className="reward-cost"; cost.textContent=`✦ ${Number(reward.points_cost).toLocaleString()} ${t("points")}`;
    const button=document.createElement("button"); button.className="button button-primary button-wide"; button.type="button"; button.textContent=t("redeem");
    button.disabled = reward.stock_quantity === 0;
    button.addEventListener("click",()=>redeemReward(reward,button));
    card.append(title,desc,cost,button); root.append(card);
  }
}
async function loadActivity() {
  const root=$("activity-list");
  const [claims, redemptions] = await Promise.all([
    supabase.from("claims").select("id,status,points_awarded,created_at").eq("partner_id",state.profile.id).order("created_at",{ascending:false}).limit(5),
    supabase.from("redemptions").select("id,status,points_cost,created_at").eq("partner_id",state.profile.id).order("created_at",{ascending:false}).limit(5)
  ]);
  if (claims.error && redemptions.error) { root.textContent=t("loadFailed"); return; }
  const items=[
    ...(claims.data||[]).map(x=>({...x,kind:"claim",amount:x.points_awarded})),
    ...(redemptions.data||[]).map(x=>({...x,kind:"redeem",amount:-x.points_cost}))
  ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,8);
  root.replaceChildren();
  if (!items.length) { const p=document.createElement("p");p.className="muted";p.textContent=t("activityEmpty");root.append(p);return; }
  for (const item of items) {
    const row=document.createElement("div");row.className="activity-row";
    const left=document.createElement("div");const title=document.createElement("strong");title.textContent=item.kind==="claim"?t("earn"):t("redeemed");
    const sub=document.createElement("span");sub.textContent=new Date(item.created_at).toLocaleString(state.language==="hi"?"hi-IN":"en-IN",{dateStyle:"medium",timeStyle:"short"});left.append(title,sub);
    const amount=document.createElement("strong");amount.className=item.amount>=0?"positive":"negative";amount.textContent=`${item.amount>0?"+":""}${item.amount}`;
    row.append(left,amount);root.append(row);
  }
}
async function redeemReward(reward, button) {
  if (!state.profile || state.profile.verification_status !== "verified") { setNotice(t("profileNeeded"),"error"); return; }
  button.disabled=true;
  try {
    const result=await invoke("redeem",{reward_id:reward.id,request_key:crypto.randomUUID()});
    setNotice(result.message || t("redemptionSent"),"success");
    await Promise.allSettled([loadBalance(),loadRewards(),loadActivity()]);
  } catch(error) { setNotice(error.message==="not_authenticated"?t("signInFirst"):t("redemptionFail"),"error"); }
  finally { button.disabled=false; }
}
$("auth-form").addEventListener("submit",async(event)=>{
  event.preventDefault();clearNotice();
  const email=$("email").value.trim();
  const button=event.submitter;button.disabled=true;
  try {
    const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin}});
    if(error) throw error;
    setNotice(t("sent"),"success");
  } catch(error) { setNotice(`${t("authFail")} ${error.message||""}`,"error"); }
  finally { button.disabled=false; }
});
$("profile-form").addEventListener("submit",async(event)=>{
  event.preventDefault();clearNotice();
  const display_name=$("display-name").value.trim(),phone=$("phone").value.trim();
  const button=event.submitter;button.disabled=true;
  try {
    const result=await invoke("profile",{display_name,phone_e164:phone,preferred_locale:state.language==="hi"?"hi-IN":"en-IN"});
    state.profile=result.profile;
    setNotice(t("profileSaved"),"success");
    await loadProfile();
  } catch(error) { setNotice(`${t("profileFail")} ${error.message||""}`,"error"); }
  finally { button.disabled=false; }
});
$("claim-form").addEventListener("submit",async(event)=>{
  event.preventDefault();clearNotice();
  if(!state.profile) { setNotice(t("profileNeeded"),"error");return; }
  const token=$("qr-token").value.trim(),button=event.submitter;button.disabled=true;
  try {
    const result=await invoke("claim",{token,request_id:crypto.randomUUID()});
    if(result.ok) { setNotice(`${t("claimSuccess")} ${result.points_awarded||0} ${t("points")}`,"success");$("qr-token").value="";await Promise.allSettled([loadBalance(),loadActivity()]); }
    else setNotice(result.reason_code||t("claimFailed"),"error");
  } catch(error) { setNotice(t("claimFailed"),"error"); }
  finally { button.disabled=false; }
});
$("language").addEventListener("change",async(e)=>{
  state.language=e.target.value;localStorage.setItem("growta-language",state.language);applyLanguage();
  if(state.profile) await Promise.allSettled([loadRewards(),loadActivity()]);
});
$("refresh-button").addEventListener("click",()=>Promise.allSettled([loadBalance(),loadRewards(),loadActivity()]));
$("logout-button").addEventListener("click",async()=>{
  await stopCamera();await supabase.auth.signOut();state.user=null;state.profile=null;showView("auth-view");setNotice(state.language==="hi"?"आप लॉग आउट हो गए हैं।":"You have signed out.","success");
});
$("camera-button").addEventListener("click",async()=>{
  if(state.stream){await stopCamera();return;}
  if(!("BarcodeDetector" in window) || !navigator.mediaDevices?.getUserMedia){setNotice(t("cameraUnsupported"),"error");return;}
  try{
    const detector=new BarcodeDetector({formats:["qr_code"]});
    state.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
    $("camera-video").srcObject=state.stream;$("camera-video").classList.remove("hidden");await $("camera-video").play();$("camera-button").textContent=t("cameraStop");
    const scan=async()=>{if(!state.stream)return;try{const codes=await detector.detect($("camera-video"));if(codes.length&&codes[0].rawValue){$("qr-token").value=codes[0].rawValue;await stopCamera();$("qr-token").focus();setNotice(state.language==="hi"?"QR पढ़ लिया गया। क्लेम करने के लिए बटन दबाएँ।":"QR read. Press Claim code to submit it.","success");return;}}catch{}state.cameraTimer=setTimeout(scan,350);};scan();
  }catch(error){await stopCamera();setNotice(t("cameraDenied"),"error");}
});
async function stopCamera(){
  if(state.cameraTimer)clearTimeout(state.cameraTimer);state.cameraTimer=null;
  if(state.stream)state.stream.getTracks().forEach(track=>track.stop());state.stream=null;
  $("camera-video").srcObject=null;$("camera-video").classList.add("hidden");$("camera-button").textContent=t("scanCamera");
}
window.addEventListener("beforeinstallprompt",(event)=>{event.preventDefault();state.installPrompt=event;$("install-button").classList.remove("hidden");});
$("install-button").addEventListener("click",async()=>{if(!state.installPrompt)return;state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;$("install-button").classList.add("hidden");});
window.addEventListener("appinstalled",()=>{$("install-button").classList.add("hidden");});
supabase.auth.onAuthStateChange(async(event,session)=>{
  state.user=session?.user||null;
  if(event==="SIGNED_OUT"){showView("auth-view");return;}
  if(state.user){try{await loadProfile();}catch{setNotice(t("setupError"),"error");}}
});
applyLanguage();
refreshSession().catch(()=>{showView("auth-view");setNotice(t("setupError"),"error");});
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
