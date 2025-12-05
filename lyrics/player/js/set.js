
//------------------ 初始音乐参数设置 ----------------\\
var openPLAY = 1;
//初始音乐规则： 0 = 初始时不播放音乐 
//               1 = 自动播放背乐
//               2 = 初始时让用户选择播不播放音乐

var openRND = false;

//初始音乐播放时随机状态：true  = 打开随机状态 
//                        false = 不打开随机状态

var PLAY_VOLUME = 80;
//播放器初始音量:  取值范围 0 - 100

//------------------ 类型判断参数设置 ----------------\\

//mediaPlayer类型判断数据

var LX_M_x = ";MMS://;MMST://";
//专有协议

var LX_M_v = ".MPG;.MPEG;.MPE;.M1V;.SMI;.MP2;.MPV2;.MP2V;.MPA;.AVI;.WMV;.WVX;.IVF;.DAT;.ASF;.MP3;.MID;.MIDI;.RMI;.WAV;.WMA;.WAX;.AIF;.AIFC;.AIFF;.AU;.SND;.SWA;.WPL;.M3U;.ASX;.SWF;.JPG;.BMP;.GIF;.PNG;";
//扩展名

//---------------------------------------
//realPlayer类型判断数据

var LX_R_x = ";RTSP://";
//专有协议

var LX_R_v = ".RMJ;.RT;.SMIL;.RMVB;.SSM;.RA;.RM;.SSM;.RAM;.RPM;.RA;.RMM;.MPGA;";
//扩展名
