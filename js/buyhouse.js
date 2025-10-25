
function runjs()

{

dj=parseFloat(window.document.form11.dj.value)

chsh=parseInt(window.document.form11.chsh.value)/10

nsh=parseInt(window.document.form11.nsh.value)

qsh=12*nsh

{if(nsh<6)lx=parseFloat(0.0414)

if(nsh>=6)lx=parseFloat(0.0459)}

ylx=lx/12

mj=parseFloat(window.document.form11.mj.value)

fkz=dj*mj

dkz=fkz*chsh

yj=(ylx/(1-(1/(Math.pow(1+ylx,qsh)))))*dkz

hkz=yj*qsh

window.document.form11.dkz.value=Math.round(dkz*100,5)/100

window.document.form11.shf.value=Math.round((fkz-dkz)*100,5)/100

window.document.form11.yj.value=Math.round(yj*100,5)/100

window.document.form11.fkz.value=Math.round(fkz*100,5)/100

window.document.form11.lxfd.value=Math.round((hkz-dkz)*100,5)/100

window.document.form11.hkz.value=Math.round(hkz*100,5)/100

}



function runjs2()

{

dj2=parseFloat(window.document.form22.dj2.value)

chsh2=parseInt(window.document.form22.chsh2.value)/10

nsh2=parseInt(window.document.form22.nsh2.value)

qsh2=12*nsh2

{if(nsh2<6)lx2=parseFloat(0.0531)

if(nsh2>=6)lx2=parseFloat(0.0558)}

ylx2=lx2/12

mj2=parseFloat(window.document.form22.mj2.value)

fkz2=dj2*mj2

dkz2=fkz2*chsh2

yj2=(ylx2/(1-(1/(Math.pow(1+ylx2,qsh2)))))*dkz2

hkz2=yj2*qsh2

window.document.form22.dkz2.value=Math.round(dkz2*100,5)/100

window.document.form22.shf2.value=Math.round((fkz2-dkz2)*100,5)/100

window.document.form22.yj2.value=Math.round(yj2*100,5)/100

window.document.form22.fkz2.value=Math.round(fkz2*100,5)/100

window.document.form22.lxfd2.value=Math.round((hkz2-dkz2)*100,5)/100

window.document.form22.hkz2.value=Math.round(hkz2*100,5)/100

}



function selectionMade()

{

document.zuhe.ajbl3.value=(100-(document.zuhe.gjjbl3.value)*100)+"%"}

function runjs3()

{dj3=parseFloat(document.zuhe.dj3.value)

chsh3=parseInt(window.document.zuhe.chsh3.value)/10

gjjnsh3=parseInt(window.document.zuhe.gjjnsh3.value)

ajnsh3=parseInt(window.document.zuhe.ajnsh3.value)

gjjqsh3=12*gjjnsh3

ajqsh3=12*ajnsh3

{if(gjjnsh3<6)gjjlx3=parseFloat(0.0414)

if(gjjnsh3>=6)gjjlx3=parseFloat(0.0459)}

{if(ajnsh3<6)ajlx3=parseFloat(0.0531)

if(ajnsh3>=6)ajlx3=parseFloat(0.0558)}

gjjylx3=gjjlx3/12

ajylx3=ajlx3/12

mj3=parseFloat(window.document.zuhe.mj3.value)

gjjbl3=parseFloat(window.document.zuhe.gjjbl3.value)

fkz3=dj3*mj3

dkz3=fkz3*chsh3

gjj3=dkz3*gjjbl3

aj3=dkz3*(1-window.document.zuhe.gjjbl3.value)

gjjyj3=(gjjylx3/(1-(1/(Math.pow(1+gjjylx3,gjjqsh3)))))*gjj3

ajyj3=(ajylx3/(1-(1/(Math.pow(1+ajylx3,ajqsh3)))))*aj3

gjjhkz3=gjjyj3*gjjqsh3

ajhkz3=ajyj3*ajqsh3

shf3=fkz3-dkz3

yh3=fkz3*0.0005

q3=fkz3*0.02

fw3=fkz3*0.005

gzh3=fkz3*0.003

window.document.zuhe.dkz3.value=dkz3

window.document.zuhe.fkz3.value=fkz3

window.document.zuhe.shf3.value=shf3

window.document.zuhe.gjjshf3.value=shf3*gjjbl3

window.document.zuhe.ajshf3.value=Math.round(shf3*(1-gjjbl3),2)

window.document.zuhe.ajyj3.value=Math.round(ajyj3,2)

window.document.zuhe.gjjyj3.value=Math.round(gjjyj3,2)

window.document.zuhe.yj3.value=Math.round(ajyj3+gjjyj3,2)

window.document.zuhe.gjjhkz3.value=Math.round(gjjyj3*gjjqsh3,2)

window.document.zuhe.ajhkz3.value=Math.round(ajyj3*ajqsh3,2)

window.document.zuhe.gjjlxfd3.value=Math.round(gjjhkz3-gjj3,2)

window.document.zuhe.ajlxfd3.value=Math.round(ajhkz3-aj3,2)

window.document.zuhe.yh3.value=Math.round(yh3*100,5)/100

window.document.zuhe.fkz3.value=Math.round(fkz3*100,5)/100

window.document.zuhe.q3.value=Math.round(q3*100,5)/100

window.document.zuhe.gzh3.value=Math.round(gzh3*100,5)/100

window.document.zuhe.wt3.value=Math.round(gzh3*100,5)/100

window.document.zuhe.fw3.value=Math.round(fw3*100,5)/100

}



function runjs4()

{



dj4=parseFloat(window.document.fei_form.dj4.value)



mj4=parseFloat(window.document.fei_form.mj4.value)

fkz4=dj4*mj4

yh4=fkz4*0.0005

q4=fkz4*0.02

fw4=fkz4*0.005

gzh4=fkz4*0.003

window.document.fei_form.yh4.value=Math.round(yh4*100,5)/100

window.document.fei_form.fkz4.value=Math.round(fkz4*100,5)/100

window.document.fei_form.q4.value=Math.round(q4*100,5)/100

window.document.fei_form.gzh4.value=Math.round(gzh4*100,5)/100

window.document.fei_form.wt4.value=Math.round(gzh4*100,5)/100

window.document.fei_form.fw4.value=Math.round(fw4*100,5)/100

}
