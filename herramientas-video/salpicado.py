import math,random,re
random.seed(5)
C=(100,96)
body=[]
for i in range(10):
    a=random.uniform(0,2*math.pi);r=random.uniform(0,12)
    body.append((C[0]+r*math.cos(a),C[1]+r*math.sin(a),random.uniform(26,32)))
for k in range(11):  # bordes con lóbulos
    a=2*math.pi*k/11+random.uniform(-.15,.15);d=random.uniform(30,38)
    body.append((C[0]+d*math.cos(a),C[1]+d*math.sin(a),random.uniform(8,13)))
rays=[]
for k,(L,r0) in enumerate([(66,11),(52,9),(74,10),(48,8),(60,10),(56,9)]):
    a=2*math.pi*k/6+random.uniform(-.35,.35)
    for s in range(5):
        u=(s+1)/5;d=34+u*(L-34)
        rays.append((C[0]+d*math.cos(a),C[1]+d*math.sin(a),r0*(1-.45*u),a,d))
    rays.append((C[0]+(L+6)*math.cos(a),C[1]+(L+6)*math.sin(a),r0*.85,a,L+6))
drops=[]
for i in range(12):
    a=random.uniform(0,2*math.pi);d=random.uniform(70,96);r=random.uniform(2.2,5.5)
    drops.append((C[0]+d*math.cos(a),C[1]+d*math.sin(a)*.95,r))
ci=lambda x,y,r,extra='':f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}"{extra}/>'
bodyS=''.join(ci(*b) for b in body)
raysS=''.join(ci(x,y,r,f' class="sl-ray" style="--x:{-(x-C[0])*.7:.1f}px;--y:{-(y-C[1])*.7:.1f}px"') for x,y,r,a,d in rays)
dropS=''.join(ci(x,y,r,f' class="sl-drop" style="--x:{-(x-C[0])*.6:.1f}px;--y:{-(y-C[1])*.6:.1f}px"') for x,y,r in drops)
spr=''  # segunda tanda: gotitas que caen salpicadas más arriba y más abajo, en la pantalla
for i in range(26):
    up=i%2==0
    x=random.uniform(-10,210);y=random.uniform(-70,8) if up else random.uniform(184,265)
    r=random.choice([1.3,1.8,2.3,2.8,3.4,4.2,5.2]);dl=.26+random.uniform(0,.3)
    if r>=2.8:  # las más grandes se deslizan para abajo como una gota en el vidrio, dejando rastro
        f=random.uniform(16,40)
        spr+=(f'<g style="--f:{f:.0f}px;--t:{dl:.2f}s"><rect class="sl-trail" x="{x-r*.7:.1f}" y="{y-r*.5:.1f}" width="{r*1.4:.1f}" height="{f+r*.5:.0f}" rx="{r*.7:.1f}" fill="url(#slTr)"/>'
              f'<g class="sl-fall"><circle class="sl-spr" cx="{x:.1f}" cy="{y:.1f}" r="{r}" style="animation-delay:{dl:.2f}s"/></g></g>')
    else:
        spr+=f'<circle class="sl-spr" cx="{x:.1f}" cy="{y:.1f}" r="{r}" style="animation-delay:{dl:.2f}s"/>'
drips=''
for x,w,L,d in [(86,9,34,0),(118,8,26,.12)]:
    y0=C[1]+26
    drips+=f'<g style="--d:{d}s;--h:-{L*.7:.0f}px"><rect class="sl-drip" x="{x-w/2}" y="{y0}" width="{w}" height="{L}" rx="{w/2}"/><circle class="sl-end" cx="{x}" cy="{y0+L-w/2}" r="{w*.7:.1f}"/></g>'
html=f'''  <div class="splash-load" id="splashLoad" aria-hidden="true">
    <style>
      .splash-load{{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(251,250,255,.42);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);animation:slOut .4s ease 1.4s forwards}}
      .splash-load svg{{width:min(480px,82vw);height:auto;overflow:visible}}
      .sl-paint{{opacity:.9}}
      .sl-hit{{transform-origin:100px 96px;transform:scale(.2);opacity:0;animation:slHit .3s cubic-bezier(.2,1.5,.4,1) .04s forwards}}
      .sl-ray,.sl-drop{{transform:translate(var(--x),var(--y)) scale(.3);animation:slFly .32s cubic-bezier(.15,.9,.3,1) .06s both}}
      .sl-drop{{animation-delay:.1s}}
      .sl-spr{{opacity:0;transform-box:fill-box;transform-origin:50% 50%;transform:scale(.2);animation:slSpr .18s cubic-bezier(.2,1.6,.4,1) forwards}}
      @keyframes slSpr{{to{{opacity:1;transform:none}}}}
      .sl-fall{{animation:slFall .85s cubic-bezier(.55,0,.8,.6) calc(var(--t) + .2s) forwards}}
      .sl-trail{{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(0);animation:slTrail .85s cubic-bezier(.55,0,.8,.6) calc(var(--t) + .2s) forwards}}
      @keyframes slFall{{to{{transform:translateY(var(--f)) scaleY(1.12)}}}}
      @keyframes slTrail{{to{{transform:none}}}}
      .sl-drip{{transform-box:fill-box;transform-origin:50% 0;transform:scaleY(.3);animation:slDrip .7s cubic-bezier(.5,0,.6,1) calc(.3s + var(--d)) forwards}}
      .sl-end{{transform:translateY(var(--h));animation:slDrip .7s cubic-bezier(.5,0,.6,1) calc(.3s + var(--d)) forwards}}
      @keyframes slHit{{0%{{opacity:1}}60%{{transform:scale(1.07,.95)}}to{{opacity:1;transform:none}}}}
      @keyframes slFly{{0%{{opacity:0}}20%{{opacity:1}}to{{opacity:1;transform:none}}}}
      @keyframes slDrip{{to{{transform:none}}}}
      @keyframes slOut{{to{{opacity:0;visibility:hidden}}}}
      @media (prefers-reduced-motion:reduce){{.splash-load{{display:none}}}}
    </style>
    <svg viewBox="0 0 200 200">
      <defs>
        <linearGradient id="slg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7780f"/><stop offset="1" stop-color="#e8620a"/></linearGradient>
        <linearGradient id="slTr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef6e0c" stop-opacity="0"/><stop offset="1" stop-color="#ef6e0c" stop-opacity=".75"/></linearGradient>
        <filter id="slGoo" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter>
      </defs>
      <g class="sl-paint"><g filter="url(#slGoo)" fill="url(#slg)">
        <g class="sl-hit">{bodyS}</g>
        {raysS}
        <g>{drips}</g>
        {dropS}
      </g><g fill="#ef6e0c">{spr}</g></g>
    </svg>
    <script>setTimeout(function(){{var s=document.getElementById('splashLoad');if(s)s.remove()}},1900)</script>
  </div>
'''
for f in ['index.html','portfolio.html']:
    t=open(f).read()
    t=re.sub(r'  <div class="splash-load".*?</script>\n  </div>\n',html,t,count=1,flags=re.S)
    t=t.replace('?v=28','?v=29')
    open(f,'w').write(t)
