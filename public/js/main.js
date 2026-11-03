(function(){
var d=document,hd=d.getElementById('hd'),pr=d.getElementById('prog');
function onScroll(){var y=scrollY,h=d.documentElement.scrollHeight-innerHeight;hd.classList.toggle('s',y>10);pr.style.width=(h>0?y/h*100:0)+'%'}
addEventListener('scroll',onScroll,{passive:true});onScroll();
var b=d.getElementById('burger'),n=d.querySelector('header nav');
b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
var y=d.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
function count(el){if(el.dataset.d)return;el.dataset.d=1;var to=+el.dataset.to,dec=+el.dataset.dec||0,t0=null;(function s(t){t0=t0||t;var p=Math.min((t-t0)/1200,1);el.textContent=(to*p).toFixed(dec);if(p<1)requestAnimationFrame(s)})(performance.now())}
var has='IntersectionObserver' in window;
var io=has?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);e.target.querySelectorAll('.count').forEach(count)}})},{threshold:.15}):null;
d.querySelectorAll('.rv').forEach(function(e){io?io.observe(e):e.classList.add('in')});
var st=d.querySelector('.strip');
if(st&&has){var so=new IntersectionObserver(function(es){if(es[0].isIntersecting){st.querySelectorAll('.count').forEach(count);so.disconnect()}});so.observe(st)}
var f=d.getElementById('bf');
if(f)f.addEventListener('submit',function(e){e.preventDefault();var v=function(k){return f.elements[k].value.trim()};
if(!v('name')||!v('phone')){alert('Please enter your name and phone number.');return}
var m='Hello, I would like to book an appointment at Braces & Smiles.\nName: '+v('name')+'\nPhone: '+v('phone')+(v('email')?'\nEmail: '+v('email'):'')+'\nTreatment: '+v('treat')+(v('date')?'\nPreferred date: '+v('date'):'')+(v('time')?'\nPreferred time: '+v('time'):'')+(v('msg')?'\nMessage: '+v('msg'):'');
d.getElementById('ok').hidden=false;open('https://wa.me/919911892424?text='+encodeURIComponent(m),'_blank','noopener')});
// Gallery: list your real photos here (files go in /public/images/gallery/)
var photos=[]; // e.g. [{src:'/images/gallery/clinic-1.jpg',alt:'Clinic reception area'}]
var g=d.getElementById('gallery');
if(g){if(!photos.length){g.innerHTML='<p class="c" style="grid-column:1/-1">Photos coming soon.</p>'}else photos.forEach(function(p){var fg=d.createElement('figure');fg.className='rv in';fg.innerHTML='<img loading="lazy" src="'+p.src+'" alt="'+p.alt+'">';g.appendChild(fg)})}
})();
