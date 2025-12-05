function m_r_sj(zsj)	
{
  var min, sec, str;
  min = Math.floor(zsj/60);
  sec = Math.floor(zsj%60);
  if (isNaN(min))
    return "0:00";
  str = min.toString()+":";
  if (sec>9)
    str += sec.toString()
  else
    str += "0"+sec.toString()
  return str;
}


function mediaClass()		
{
  
  this.obj = mediaPlayerObj;	
  this.gotov = 5;		
  this.setss = 0.5;		



  this.open = function(url)	
  {
    this.obj.URL = url;
    try {
      this.play();
    } catch(hh){}
  }
  this.play = function()	
  {
    this.obj.controls.play();
  }
  this.pause = function()	
  {
    this.obj.controls.pause();
  }
  this.stop = function()	
  {
   try {
    this.obj.controls.stop();
    this.obj.controls.currentPosition = 0;
   } catch(hh){}
  }
  this.go = function(s)		
  {
    this.obj.controls.currentPosition = s;
  }
  this.pos = function()		
  {
    return this.obj.controls.currentPosition;
  }
  this.length = function()		
  {
    return this.obj.currentMedia.duration;
  }
  this.state = function()		
  {
    var ps = this.obj.PlayState;
    return ps!=0 && ps!=1 && ps!=8;
  }
  this.volume = function(s)		
  {
    try { realPlayerObj.SetVolume(100); } catch(hh){}
    this.obj.settings.volume = s;
  }
  this.mute = function(s)		
  {
    try { realPlayerObj.SetMute(s); } catch(hh){}
    this.obj.settings.mute = s;
  }
  this.fullscreen = function()	
  {
    if(this.obj.PlayState!=3)
      return 2;
    try {
      this.obj.fullscreen=1;
    } catch(hh){}
    return 1;
  }

  this.sjxs = m_r_sj;	

  this.closed = function()	
  {
    this.stop();
  }

  this.ifending = function()	
  {
  }
}



function realClass()		
{
  
  this.obj = realPlayerObj;	
  this.gotov = 5;		
  this.setss = 1;		



  this.open = function(url)	
  {
    this.obj.setSource(url);
    setTimeout("oop.play();",1000);
  }
  this.play = function()	
  {
    if(this.obj.CanPlay())
      this.obj.DoPlay();
   }
  this.pause = function()	
  {
    this.obj.DoPause();
  }
  this.stop = function()	
  {
    if(this.obj.CanStop())
    {
      this.obj.DoStop();
      this.obj.SetPosition(0);
    }
  }
  this.go = function(s)		
  {
    this.obj.SetPosition(s*1000);
  }
  this.pos = function()		
  {
    return this.obj.GetPosition()/1000;
  }
  this.length = function()		
  {
    return this.obj.GetLength()/1000;
  }
  this.state = function()		
  {
    var ps = this.obj.GetPlayState();
    return ps!=0 && ps!=4;
  }
  this.volume = function(s)		
  {
     this.obj.SetVolume(s)
  }
  this.mute = function(s)		
  {
     this.obj.SetMute(s)
  }
  this.fullscreen = function()	
  {
    if(this.obj.GetPlayState()!=3)
      return 2;
    try {
      this.obj.SetFullScreen();
    } catch(hh){}
    return 1;
  }

  this.sjxs = m_r_sj;	

  this.closed = function()	
  {
    this.stop();
  }

  this.ifending = function()	
  {
    if(this.length()<=1) return;
    if(this.length()-this.pos()<=this.setss) 
      gonext();
  }
}