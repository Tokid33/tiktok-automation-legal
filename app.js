// ===== CONFIG =====
const CLIENT_KEY = 'YOUR_CLIENT_KEY_HERE';
const SCOPES = ['user.info.basic','video.upload','video.publish'];
const REDIRECT_URI = new URL('./callback.html', location.href).toString();
// ===================

function toast(msg){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>el.classList.remove('show'), 2200);
}

function loginWithTikTok(){
  if (CLIENT_KEY === 'YOUR_CLIENT_KEY_HERE') {
    toast('Add your CLIENT_KEY in app.js to open real OAuth.');
    return;
  }
  const state = Math.random().toString(36).slice(2);
  const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
  url.searchParams.set('client_key', CLIENT_KEY);
  url.searchParams.set('scope', SCOPES.join(','));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('state', state);
  location.href = url.toString();
}

function uploadVideoDemo(){ toast('✅ Video published successfully! (demo)'); }

async function shareDemo(){
  const shareData = {
    title: 'TikTok Automation — Demo',
    text: 'Check this TikTok API demo',
    url: location.origin + location.pathname
  };
  try{
    if (navigator.share){ await navigator.share(shareData); }
    else{
      await navigator.clipboard.writeText(shareData.url);
      toast('🔗 Link copied to clipboard');
    }
  }catch(e){ toast('Share canceled'); }
}

function exportData(){
  const mock = {
    exported_at: new Date().toISOString(),
    profile: { id:'demo_user_id', username:'demo_user', display_name:'Demo User', followers:12345 },
    videos: [
      {id:'vid_001', title:'Automation demo 1', views:53012, likes:4123, comments:221},
      {id:'vid_002', title:'Automation demo 2', views:28710, likes:1702, comments:97}
    ],
    note:'This is a demo export used for App Review. No real user data.'
  };
  const blob = new Blob([JSON.stringify(mock, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tiktok_demo_export.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('⬇️ Demo JSON exported');
}

document.addEventListener('DOMContentLoaded', ()=>{
  const $ = sel => document.querySelector(sel);
  $('#loginBtn')?.addEventListener('click', loginWithTikTok);
  $('#uploadBtn')?.addEventListener('click', uploadVideoDemo);
  $('#shareBtn')?.addEventListener('click', shareDemo);
  $('#exportBtn')?.addEventListener('click', exportData);
});
