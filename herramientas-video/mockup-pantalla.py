from PIL import Image, ImageDraw, ImageFilter
import numpy as np, glob, os
sc=2/3
bg=Image.open('../logoanim/mock-campera.png').convert('RGB'); bg=bg.resize((round(bg.width*sc),round(bg.height*sc)),Image.LANCZOS)
Q=[(672,390),(1559,203),(1632,786),(787,1018)]  # tl tr br bl en la foto original
# agrandar un poquito hacia afuera para tapar el borde de la pantalla vieja
c=np.mean(Q,0); Q=[tuple(c+(np.array(p)-c)*1.012) for p in Q]
Q=[(x*sc,y*sc) for x,y in Q]
def coeffs(dst,src):
    A=[];B=[]
    for (x,y),(u,v) in zip(dst,src):
        A+= [[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]; B+=[u,v]
    return np.linalg.solve(np.array(A,float),np.array(B,float))
fw,fh=1440,900
cf=coeffs(Q,[(0,0),(fw,0),(fw,fh),(0,fh)])
mask=Image.new('L',(bg.width*2,bg.height*2),0); ImageDraw.Draw(mask).polygon([(x*2,y*2) for x,y in Q],fill=255)
mask=mask.resize(bg.size,Image.LANCZOS)
os.makedirs('m',exist_ok=True)
for i,f in enumerate(sorted(glob.glob('f/*.jpg'))):
    fr=Image.open(f).convert('RGB')
    w=fr.transform(bg.size,Image.PERSPECTIVE,tuple(cf),Image.BICUBIC)
    w=Image.eval(w,lambda v:int(v*0.93+4))  # un poco menos de brillo, como pantalla en foto
    out=bg.copy(); out.paste(w,(0,0),mask); out.save(f'm/{i:04d}.jpg',quality=92)
print(bg.size)
