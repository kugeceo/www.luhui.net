<%

'+-----------------------------------------------------------------------------------------+
'| 变量设置
'+-----------------------------------------------------------------------------------------+

Admin_name				= "admin" '管理员用户名
Admin_pass				= "luhuinet" '管理员密码
cTitle					= "相册程序" '站点名字
cPicType				= "jpeg,jpg,gif,png,bmp" '图片类型 (使用","将图片格式分开)
cHeight					= 120 '缩图高度
cWidth					= 133.33333333333334 '缩图宽度
cEachLineMax			= 5	'每行显示图片数
cEachPageMax			= 30 '每页显示图片数目

'+-----------------------------------+
'|  定义函数
'+-----------------------------------+

Function getExt(name)
	getExt = right(name, 3)
End Function

Function isPIC(fileName, picType)

	ext = getExt(fileName)

	isPIC = False

	typeList = split(picType, ",")
	
	For ii = LBound(typeList) To UBound(typeList)
		If UCase(ext) = UCase(typeList(ii)) Then
			isPIC = True
			Exit For
		End If
	Next
	
End Function

Function pageBar(page, pageTotal)
	
	response.Write "[ <A HREF=?page=" & (page - 1) & " title=上一页>上一页</A> ]&nbsp;"
	response.Write "<A HREF=?page=1  title=首页><< </A>"
	
	i = pageStart
	Do while i < page
		response.Write "<A HREF=?page=" & i & " title=""第 " & i & " 页"">[" & i & "]</A>&nbsp;"
		i = i + 1
	Loop

	response.Write "[<FONT COLOR=red><B>" & page & "</B></FONT>]"

	i = pageMiddle
	Do while i <= pageEnd
		response.Write "<A HREF=?page=" & i & " title=""第 " & i & " 页"">[" & i & "]</A>&nbsp;"
		i = i + 1
	Loop

	response.Write "...<A HREF=?page=" & pageTotal & " title=""第 " & pageTotal & " 页"">[" & pageTotal & "]</A>"
	response.Write " <A HREF=?page=" & pageTotal & " title=尾页>>></A>"
	response.Write "[ <A HREF=?page=" & (page + 1) & " title=下一页>下一页</A> ]&nbsp;共 <B><FONT COLOR=red>" & pageTotal & "</FONT></B> 页&nbsp;&nbsp;当前所在第 <B><FONT COLOR=red>" & page & "</FONT></B> 页 图片数 : <B><FONT COLOR=red>" & picTotal & "</FONT></B>"

End Function

'+-----------------------------------+
'|  取图片尺寸类
'+-----------------------------------+

Class possible
 dim aso
 Private Sub Class_Initialize
  set aso=CreateObject("Adodb.Stream")
  aso.Mode=3 
  aso.Type=1 
  aso.Open 
 End Sub
 Private Sub Class_Terminate
  set aso=nothing
 End Sub

 Private Function Bin2Str(Bin)
  Dim K, Str
  For K=1 to LenB(Bin)
   clow=MidB(Bin,K,1)
   if ASCB(clow)<128 then
    Str = Str & Chr(ASCB(clow))
   else
    K=K+1
    if K <= LenB(Bin) then Str = Str & Chr(ASCW(MidB(Bin,K,1)&clow))
   end if
  Next 
  Bin2Str = Str
 End Function
 
 Private Function Num2Str(num,base,lens)
  dim ret
  ret = ""
  while(num>=base)
   ret = (num mod base) & ret
   num = (num - num mod base)/base
  wend
  Num2Str = right(string(lens,"0") & num & ret,lens)
 End Function
 
 Private Function Str2Num(str,base)
  dim ret
  ret = 0
  for k=1 to len(str)
   ret = ret *base + cint(mid(str,k,1))
  next
  Str2Num=ret
 End Function
 
 Private Function BinVal(bin)
  dim ret
  ret = 0
  for k = lenb(bin) to 1 step -1
   ret = ret *256 + ascb(midb(bin,k,1))
  next
  BinVal=ret
 End Function
 
 Private Function BinVal2(bin)
  dim ret
  ret = 0
  for k = 1 to lenb(bin)
   ret = ret *256 + ascb(midb(bin,k,1))
  next
  BinVal2=ret
 End Function
 
 Private Function getImageSize(filespec) 
  dim ret(3)
  aso.LoadFromFile(filespec)
  bFlag=aso.read(3)
  select case hex(binVal(bFlag))
  case "4E5089":
   aso.read(15)
   ret(0)="PNG"
   ret(1)=BinVal2(aso.read(2))
   aso.read(2)
   ret(2)=BinVal2(aso.read(2))
  case "464947":
   aso.read(3)
   ret(0)="GIF"
   ret(1)=BinVal(aso.read(2))
   ret(2)=BinVal(aso.read(2))
  case "535746":
   aso.read(5)
   binData=aso.Read(1)
   sConv=Num2Str(ascb(binData),2 ,8)
   nBits=Str2Num(left(sConv,5),2)
   sConv=mid(sConv,6)
   while(len(sConv)<nBits*4)
    binData=aso.Read(1)
    sConv=sConv&Num2Str(ascb(binData),2 ,8)
   wend
   ret(0)="SWF"
   ret(1)=int(abs(Str2Num(mid(sConv,1*nBits+1,nBits),2)-Str2Num(mid(sConv,0*nBits+1,nBits),2))/20)
   ret(2)=int(abs(Str2Num(mid(sConv,3*nBits+1,nBits),2)-Str2Num(mid(sConv,2*nBits+1,nBits),2))/20)
  case "FFD8FF":
   do 
    do: p1=binVal(aso.Read(1)): loop while p1=255 and not aso.EOS
    if p1>191 and p1<196 then exit do else aso.read(binval2(aso.Read(2))-2)
    do:p1=binVal(aso.Read(1)):loop while p1<255 and not aso.EOS
   loop while true
   aso.Read(3)
   ret(0)="JPG"
   ret(2)=binval2(aso.Read(2))
   ret(1)=binval2(aso.Read(2))
  case else:
   if left(Bin2Str(bFlag),2)="BM" then
    aso.Read(15)
    ret(0)="BMP"
    ret(1)=binval(aso.Read(4))
    ret(2)=binval(aso.Read(4))
   else
    ret(0)=""
   end if
  end select
  ret(3)="width=""" & ret(1) &""" height=""" & ret(2) &""""
  getimagesize=ret
 End Function
 
 Function readX(pic_path)
   Set fso1 = server.CreateObject("Scripting.FileSystemObject")
   Set f1 = fso1.GetFile(pic_path)
   ext=fso1.GetExtensionName(pic_path)
   select case UCase(ext)
     case "GIF","BMP","JPG","PNG":
    arr=getImageSize(f1.path)
    readX = arr(1)
     case "swf"
    arr=pp.getimagesize(f1.path)
    readX = arr(1)
   end select
   Set f1=nothing
   Set fso1=nothing
 End Function

 Function readY(pic_path)
   Set fso1 = server.CreateObject("Scripting.FileSystemObject")
   Set f1 = fso1.GetFile(pic_path)
   ext=fso1.GetExtensionName(pic_path)
   select case UCase(ext)
     case "GIF","BMP","JPG","PNG":
    arr=getImageSize(f1.path)
    readY = arr(2)
     case "swf"
    arr=pp.getimagesize(f1.path)
    readY = arr(2)
   end select
   Set f1=nothing
   Set fso1=nothing
 End Function
End Class

'+-----------------------------------+
'|  数据处理
'+-----------------------------------+

Dim fileArray()
reDim fileArray(0)

Set fileObj		= Server.CreateObject("Scripting.FileSystemObject")
Set folderObj	= fileObj.GetFolder(server.MapPath("./"))

i = 0

For Each file in folderObj.Files
	If isPIC(file.Name, cPicType) Then
		fileArray(i) = file.Name
		i = i + 1
		reDim Preserve fileArray(i)
	End If	
Next

Set FileObj		= Nothing
Set FolderObj	= Nothing

picTotal = UBound(fileArray)

'+-----------------------------------+
'|  分页处理
'+-----------------------------------+

page = int(Request.QueryString("page"))
	
pageTotal = -(int(-(picTotal/cEachPageMax)))
	
If page = Empty or page < 0 Then page = 1
If page > pageTotal Then page = pageTotal
	
offset = cEachPageMax * page
start = offset - cEachPageMax
	
If start < 0 Then start = 0
If offset > picTotal Then offset = picTotal
	
pageStart = page - cEachPageMax
If pageStart <= 0 Then pageStart = 1

pageMiddle = page + 1
pageEnd = pageMiddle + cEachPageMax
	
If page <= cEachPageMax Then pageEnd = cEachPageMax * 2
If pageEnd > pageTotal Then pageEnd = pageTotal

%>

<%

'+-----------------------------------+
'|  上传功能实现
'+-----------------------------------+

%>

<SCRIPT RUNAT=SERVER LANGUAGE=VBSCRIPT>

dim upfile_5xSoft_Stream

Class upload_5xSoft
  
dim Form,File,Version
  
Private Sub Class_Initialize 
dim iStart,iFileNameStart,iFileNameEnd,iEnd,vbEnter,iFormStart,iFormEnd,theFile
dim strDiv,mFormName,mFormValue,mFileName,mFileSize,mFilePath,iDivLen,mStr
Version="探索者相册上传程序 Version 1.0"
if Request.TotalBytes<1 then Exit Sub
set Form=CreateObject("Scripting.Dictionary")
set File=CreateObject("Scripting.Dictionary")
set upfile_5xSoft_Stream=CreateObject("Adodb.Stream")
upfile_5xSoft_Stream.mode=3
upfile_5xSoft_Stream.type=1
upfile_5xSoft_Stream.open
upfile_5xSoft_Stream.write Request.BinaryRead(Request.TotalBytes)

vbEnter=Chr(13)&Chr(10)
iDivLen=inString(1,vbEnter)+1
strDiv=subString(1,iDivLen)
iFormStart=iDivLen
iFormEnd=inString(iformStart,strDiv)-1
while iFormStart < iFormEnd
  iStart=inString(iFormStart,"name=""")
  iEnd=inString(iStart+6,"""")
  mFormName=subString(iStart+6,iEnd-iStart-6)
  iFileNameStart=inString(iEnd+1,"filename=""")
  if iFileNameStart>0 and iFileNameStart<iFormEnd then
   iFileNameEnd=inString(iFileNameStart+10,"""")
   mFileName=subString(iFileNameStart+10,iFileNameEnd-iFileNameStart-10)
   iStart=inString(iFileNameEnd+1,vbEnter&vbEnter)
   iEnd=inString(iStart+4,vbEnter&strDiv)
   if iEnd>iStart then
    mFileSize=iEnd-iStart-4
   else
    mFileSize=0
   end if
   set theFile=new FileInfo
   theFile.FileName=getFileName(mFileName)
   theFile.FilePath=getFilePath(mFileName)
   theFile.FileSize=mFileSize
   theFile.FileStart=iStart+4
   theFile.FormName=FormName
   file.add mFormName,theFile
  else
   iStart=inString(iEnd+1,vbEnter&vbEnter)
   iEnd=inString(iStart+4,vbEnter&strDiv)

   if iEnd>iStart then
    mFormValue=subString(iStart+4,iEnd-iStart-4)
   else
    mFormValue="" 
   end if
   form.Add mFormName,mFormValue
  end if

  iFormStart=iformEnd+iDivLen
  iFormEnd=inString(iformStart,strDiv)-1
wend
End Sub

Private Function subString(theStart,theLen)
 dim i,c,stemp
 upfile_5xSoft_Stream.Position=theStart-1
 stemp=""
 for i=1 to theLen
   if upfile_5xSoft_Stream.EOS then Exit for
   c=ascB(upfile_5xSoft_Stream.Read(1))
   If c > 127 Then
    if upfile_5xSoft_Stream.EOS then Exit for
    stemp=stemp&Chr(AscW(ChrB(AscB(upfile_5xSoft_Stream.Read(1)))&ChrB(c)))
    i=i+1
   else
    stemp=stemp&Chr(c)
   End If
 Next
 subString=stemp
End function

Private Function inString(theStart,varStr)
 dim i,j,bt,theLen,str
 InString=0
 Str=toByte(varStr)
 theLen=LenB(Str)
 for i=theStart to upfile_5xSoft_Stream.Size-theLen
   if i>upfile_5xSoft_Stream.size then exit Function
   upfile_5xSoft_Stream.Position=i-1
   if AscB(upfile_5xSoft_Stream.Read(1))=AscB(midB(Str,1)) then
    InString=i
    for j=2 to theLen
      if upfile_5xSoft_Stream.EOS then 
        inString=0
        Exit for
      end if
      if AscB(upfile_5xSoft_Stream.Read(1))<>AscB(MidB(Str,j,1)) then
        InString=0
        Exit For
      end if
    next
    if InString<>0 then Exit Function
   end if
 next
End Function

Private Sub Class_Terminate  
  form.RemoveAll
  file.RemoveAll
  set form=nothing
  set file=nothing
  upfile_5xSoft_Stream.close
  set upfile_5xSoft_Stream=nothing
End Sub


 Private function GetFilePath(FullPath)
  If FullPath <> "" Then
   GetFilePath = left(FullPath,InStrRev(FullPath, "\"))
  Else
   GetFilePath = ""
  End If
 End  function
 
 Private function GetFileName(FullPath)
  If FullPath <> "" Then
   GetFileName = mid(FullPath,InStrRev(FullPath, "\")+1)
  Else
   GetFileName = ""
  End If
 End  function

 Private function toByte(Str)
   dim i,iCode,c,iLow,iHigh
   toByte=""
   For i=1 To Len(Str)
   c=mid(Str,i,1)
   iCode =Asc(c)
   If iCode<0 Then iCode = iCode + 65535
   If iCode>255 Then
     iLow = Left(Hex(Asc(c)),2)
     iHigh =Right(Hex(Asc(c)),2)
     toByte = toByte & chrB("&H"&iLow) & chrB("&H"&iHigh)
   Else
     toByte = toByte & chrB(AscB(c))
   End If
   Next
 End function
End Class


Class FileInfo
  dim FormName,FileName,FilePath,FileSize,FileStart
  Private Sub Class_Initialize 
    FileName = ""
    FilePath = ""
    FileSize = 0
    FileStart= 0
    FormName = ""
  End Sub
  
 Public function SaveAs(FullPath)
    dim dr,ErrorChar,i
    SaveAs=1
    if trim(fullpath)="" or FileSize=0 or FileStart=0 or FileName="" then exit function
    if FileStart=0 or right(fullpath,1)="/" then exit function
    set dr=CreateObject("Adodb.Stream")
    dr.Mode=3
    dr.Type=1
    dr.Open
    upfile_5xSoft_Stream.position=FileStart-1
    upfile_5xSoft_Stream.copyto dr,FileSize
    dr.SaveToFile FullPath,2
    dr.Close
    set dr=nothing 
    SaveAs=0
  end function
End Class
</SCRIPT>
	<style type='text/css'>
		a:link, a:visited, a:active { text-decoration: none; color: #000 }
		a:hover { color: orangered; text-decoration:none }
		BODY { scrollbar-face-color: #DEE3E7; scrollbar-highlight-color: #FFFFFF; scrollbar-shadow-color: #DEE3E7; scrollbar-3dlight-color: #D1D7DC; scrollbar-arrow-color:  #006699; scrollbar-track-color: #EFEFEF; scrollbar-darkshadow-color: #98AAB1; font: 12px Verdana; color:#333333; font-family: Tahoma,Verdana, Tahoma, Arial,Helvetica, sans-serif; font-size: 12px; color: #000; margin:0px 12px 0px 12px;background-color:#FFF }
		TD {font: 12px Verdana; color:#333333; font-family: Tahoma,Verdana, Tahoma, Arial,Helvetica, sans-serif; font-size: 12px; color: #000; };
	</style>
	<style type='text/css'id='defaultPopStyle'>
	.cPopText { font-family: Verdana, Tahoma; background-color: #F7F7F7; border: 1px #000000 solid; font-size: 11px; padding-right: 4px; padding-left: 4px; height: 20px; padding-top: 2px; padding-bottom: 2px; filter: Alpha(Opacity=0)}.input_bg {font-size: 12px;height: 20px;	border: 1px solid #666666;}"
	</style>

<%

'+----------------------------------------------------------------------------------------+
'| 默认主模块
'+----------------------------------------------------------------------------------------+
Dim Pic_Logined

Session("Pic_Logined")

IF Request.QueryString("mod") = Empty THEN

'+----------------------------------------------------------------------------------------+
'| 登录处理
'+----------------------------------------------------------------------------------------+

ELSEIF Request.QueryString("mod") = "login" THEN

	UserName = Request.Form("username")

	UserName = Request.Form("userpass")

	If UserName <> Admin_name OR UserName <> Admin_pass Then

	Else
	
	Session("Pic_Logined") = 1

	End If

'+----------------------------------------------------------------------------------------+
'| 登出处理
'+----------------------------------------------------------------------------------------+

ELSEIF Request.QueryString("mod") = "logout" THEN

	Session("Pic_Logined") = Empty

'+----------------------------------------------------------------------------------------+
'| 上传图片
'+----------------------------------------------------------------------------------------+

ELSEIF Request.QueryString("mod") = "upload" THEN

	'+----------------------------------------------------------------------------------------+
	'| 显示上传界面
	'+----------------------------------------------------------------------------------------+
		
		IF Session("Pic_Logined") = 1 THEN

		IF Request.QueryString("act") = Empty THEN

			%>

			<%
			Dim objFSO
			Dim objFolder
			Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
			Set objFolder = objFSO.GetFolder(server.MapPath("./"))
			PicPath = objFolder.Name
			Set objFSO = Nothing
			Set objFolder = Nothing
			%>
			<br>

		<form name="form1" method="post" action="?mod=upload&act=do" enctype="multipart/form-data" >
		  <input type="hidden" name="act" value="upload">
		  <br>
		  <table width="71%" border="1" cellspacing="0" cellpadding="5" align="center" bordercolordark="#CCCCCC" bordercolorlight="#000000" class="input_bg">
			<tr bgcolor="#CCCCCC"> 
			  <td height="22" align="left" valign="middle" bgcolor="#CCCCCC">&nbsp;<b><%=cTitle%></b>*文件上传</td>
			</tr>
			<tr align="left" valign="middle" bgcolor="#eeeeee"> 
			  <td bgcolor="#eeeeee" height="92"> 
				<script language="javascript">
				  function setid()
				  {
				  str='<br>';
				  if(!window.form1.upcount.value)
				   window.form1.upcount.value=1;
				  for(i=1;i<=window.form1.upcount.value;i++)
					 str+='文件'+i+':<input type="file" name="file'+i+'" style="width:400" class="input_bg"><br><br>';
				  window.upid.innerHTML=str+'<br>';
				  }
				</script>
				<li> 需要上传的个数 
				  <input type="text" name="upcount" class="input_bg" value="1" size="20">
				  <input type="button" name="Button" class="input_bg" onclick="setid();" value="· 设定 ·">
				</li>
				<br>
				<br>
				<li>上传到: 
				  <input type="text" name="filepath" style="width:350" value="../<%=PicPath%>" class="input_bg" size="20">
				</li>
			  </td>
			</tr>
			<tr align="center" valign="middle"> 
			  <td align="left" id="upid" height="122"> 文件1: 
				<input type="file" name="file1" style="width:400" value="" class="input_bg" size="20">
			  </td>
			</tr>
			<tr align="center" valign="middle" bgcolor="#eeeeee"> 
			  <td bgcolor="#eeeeee" height="24"> 
				<input type="submit" name="Submit" value="· 提交 ·" class="input_bg">
				<input type="reset" name="Submit2" value="· 清空 ·" class="input_bg">
				<input type="button" name="Submit3" value="· 返回 ·" class="input_bg" OnClick="javascript:history.back();">
			  </td>
			</tr>
		  </table>
		</form>
		<script language="javascript">

			setid();
		</script>
		<%
			Response.End
		%>
			<%


		'+----------------------------------------------------------------------------------------+
		'| 上传具体处理
		'+----------------------------------------------------------------------------------------+

		ELSE

			dim upload,file,formName,formPath,iCount
			set upload=new upload_5xSoft ''建立上传对象
			
			if upload.form("filepath")="" then   ''得到上传目录
			 HtmEnd "请输入要上传至的目录!"
			 set upload=nothing
			 response.end
			else
			 formPath=upload.form("filepath")
			 ''在目录后加(/)
			 if right(formPath,1)<>"/" then formPath=formPath&"/" 
			end if

			iCount=0
			for each formName in upload.file ''列出所有上传了的文件
			 set file=upload.file(formName)  ''生成一个文件对象
			 If isPIC(file.FileName,cPicType) = True Then
			 if file.FileSize>0 then         ''如果 FileSize > 0 说明有文件数据
			  file.SaveAs Server.mappath(formPath&file.FileName)   ''保存文件
			  response.write "<html><head><META HTTP-EQUIV=REFRESH CONTENT='2;URL='></head><br><br><center><b>"&cTitle&"</b>*图片上传</center><br><br><center>"&file.FilePath&file.FileName&" (大小"&file.FileSize&"&nbsp;B) => "&formPath&File.FileName&" 成功!</center><br>"
			  iCount=iCount+1
			 end if
			 Else
			Response.Write "<br><center><table><tr><td width=400 height=100 class='input_bg' bg='#eeeeee' align='center'><br><br><font color='#FF3366'>不是允许上传的文件格式或者没有选择文件！</font><br><br><a href='javascript:history.back();'>点击返回</a><br><br><br></td></tr></table></center>"
			Response.End			
			End If
			 set file=nothing
			next
			set upload=nothing  ''删除此对象
			Htmend iCount&" 个文件上传结束!"

			sub HtmEnd(Msg)
			 set upload=nothing
			 response.write "<center><br>"&Msg&" [<a href=""/"">返回</a>]</center></body></html>"
			 response.end
			end sub

		END IF

		ELSE

		Response.Write "您还没有登陆"

		END IF

	'+----------------------------------------------------------------------------------------+
	'| 删除具体处理
	'+----------------------------------------------------------------------------------------+

ELSEIF Request.QueryString("mod") = "delpic" THEN

		IF Session("Pic_Logined") = 1 THEN

		Dim	DelPicName

		DelPicName = Request.QueryString("name")

		Dim objFSO1

		Set objFSO1 = Server.CreateObject("Scripting.FileSystemObject")

		If objFSO1.FileExists(Server.MapPath(DelPicName)) Then

			objFSO1.DeleteFile Server.MapPath(DelPicName),True

		ELSE

			Response.Write DelPicName & "文件不存在"

		END IF

		Set objFSO1 = Nothing

		Response.Redirect "/"

		ELSE

		Response.Write "您还没有登陆"

		END IF

END IF

%>	<html>
	<head>
	<title> 鲁虺文化网 http://www.luhui.net 图片展示 lǔ 鲁 huǐ 虺 wén 文 huà 化 wǎng 网 鲁虺软件 全球中文最大的种源文化资讯平台 互联网资讯汇聚，鲁虺源码搜索引擎 国际共产主义源码探索共享先锋 - 鲁虺源码汇聚 - 虺客源码 - 
    ASP源码, PHP源码, CGI源码, JSP源码, .NET源码, 服务器软件, 建站资源, 
    书籍教程IE互联网,网络文化,源码,程序,电脑,文章,技术,图片,明星,音乐,影视,交友,论坛,灌水,问题,交流,娱乐,资源 </title>
	</head>
	<body bgproperties="fixed" background="/bj.gif">
	<script>
		tPopWait=20;
		showPopStep=10;
		popOpacity=85;

		sPop=null;
		curShow=null;
		tFadeOut=null;
		tFadeIn=null;
		tFadeWaiting=null;

		document.write("<style type='text/css'id='defaultPopStyle'>");
		document.write(".cPopText { font-family: Verdana, Tahoma; background-color: #F7F7F7; border: 1px #000000 solid; font-size: 11px; padding-right: 4px; padding-left: 4px; height: 20px; padding-top: 2px; padding-bottom: 2px; filter: Alpha(Opacity=0)}.input_bg {font-size: 12px;height: 20px;	border: 1px solid #666666;}");

		document.write("</style>");
		document.write("<div id='popLayer' style='position:absolute;z-index:1000;' class='cPopText'></div>");


		function showPopupText(){
			var o=event.srcElement;
			MouseX=event.x;
			MouseY=event.y;
			if(o.alt!=null && o.alt!="") { o.pop=o.alt;o.alt="" }
				if(o.title!=null && o.title!=""){ o.pop=o.title;o.title="" }
				if(o.pop) { o.pop=o.pop.replace("\n","<br>"); o.pop=o.pop.replace("\n","<br>"); }
			if(o.pop!=sPop) {
				sPop=o.pop;
				clearTimeout(curShow);
				clearTimeout(tFadeOut);
				clearTimeout(tFadeIn);
				clearTimeout(tFadeWaiting);	
				if(sPop==null || sPop=="") {
					popLayer.innerHTML="";
					popLayer.style.filter="Alpha()";
					popLayer.filters.Alpha.opacity=0;	
				} else {
					if(o.dyclass!=null) popStyle=o.dyclass 
					else popStyle="cPopText";
					curShow=setTimeout("showIt()",tPopWait);
				}
			}
		}

		function showIt() {
			popLayer.className=popStyle;
			popLayer.innerHTML='<BR>&nbsp;&nbsp;'+sPop+'&nbsp;&nbsp;<BR><BR>';
			popWidth=popLayer.clientWidth;
			popHeight=popLayer.clientHeight;
			if(MouseX+12+popWidth>document.body.clientWidth) popLeftAdjust=-popWidth-24
				else popLeftAdjust=0;
			if(MouseY+12+popHeight>document.body.clientHeight) popTopAdjust=-popHeight-24
				else popTopAdjust=0;
			popLayer.style.left=MouseX+12+document.body.scrollLeft+popLeftAdjust;
			popLayer.style.top=MouseY+12+document.body.scrollTop+popTopAdjust;
			popLayer.style.filter="Alpha(Opacity=0)";
			fadeOut();
		}

		function fadeOut(){
			if(popLayer.filters.Alpha.opacity<popOpacity) {
				popLayer.filters.Alpha.opacity+=showPopStep;
				tFadeOut=setTimeout("fadeOut()",1);
			}
		}

		document.onmouseover=showPopupText;
    </script>
<center>
  <table border="0" width="88" id="table4" style="border-collapse: collapse" bordercolor="#111111" cellpadding="0" cellspacing="0">
    <tr>
		<td style="font-size: 9pt">
  <div align="center" style="font-size: 12px; line-height: 130%">
    <center>
      <table width="798" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#FFFFFF" id="table279" style="font-size: 9pt">
        <tr> 
          <td width="798" style="font-size: 12px"> 
			<table width="797" border="0" cellspacing="0" cellpadding="0" height="20" id="table280" style="font-size: 9pt">
              <tr> 
                <td colspan="4" valign="bottom" style="font-size: 12px">
				<img src="/search/up.gif" width="100%" height="6"></td>
              </tr>
              <tr> 
                <td width="110" valign="bottom" style="font-size: 12px"> 
				<p align="center">
<b><font color="#CC0000" face="Arial, Helvetica, sans-serif"><script type="text/JavaScript" language="JavaScript" src="/language.js"></script></font></b></td>
                <td width="230" valign="bottom" style="font-size: 12px">&nbsp; </td>
                <td width="57" style="font-size: 12px">　</td>
                <td width="397" style="font-size: 12px"> 
				<div align="right" style="font-size: 12px; line-height: 130%"><font style="cursor:hand" onClick="this.style.behavior='url(#default#homepage)';this.setHomePage
('http://www.luhui.net/');"><u><font color="#000000">如果你喜欢本站，请把本站设为您的主页</font></u></font>　<a href="javascript:window.external.AddFavorite('http://www.luhui.net', '鲁虺文化网')" target="_self" style="color: #000000; text-decoration: none; font-size:9pt"><font color="#000000"><u>加入收藏</u></font></a><font color="#000000">&nbsp;</font>
</div></td>
              </tr>
            </table></td>
        </tr>
        <tr> 
          <td height="1" bgcolor="#666666" style="font-size: 12px"></td>
        </tr>
        <tr> 
          <td style="font-size: 12px"> 
			<div align="center" style="font-size: 12px; line-height: 130%"> 
              <script language="JavaScript" src="/style/top.js"></script></div></td>
        </tr>
        <tr> 
          <td bgcolor="#CCCCCC" height="1" style="font-size: 12px"></td>
        </tr>
      </table>
      </center>
  </div>
  
<div align="center">
	<A 
href="/index.php" target=_blank style="color: #000000; text-decoration: none; font-size:9pt"> 
  	</embed></A></div>
  <div align="center">
<script>var yreflocation_html=document.location.href;</script><script>var url="<iframe allowTransparency=true border=0 align=center vspace=0  hspace=0 name=searchbar marginwidth=0 marginheight=0 framespacing=0 frameborder=0 scrolling=no width=800 height=180";url+='  src="/cn/pop/luhuicaidan.htm?advert=http://search.luhui.net='+escape(yreflocation_html)+'"></iframe>';document.write(url);</script>

  <table height="0" cellSpacing="0" cellPadding="0" width="800" border="0" id="table59" style="font-size: 9pt">
	<tr bgColor="#7c7c7c">
		<td onmouseover="this.bgColor = '#555555'" onmouseout="this.bgColor = '#7C7C7C'" align="middle" width="810" height="20" style="font-size: 9pt">
		<A 
href="/search/go.asp?" target=_blank style="color: #000000; text-decoration: none; font-size:9pt"> 
  <embed pluginspage="http://www.macromedia.com/go/getflashplayer" src="/search/luhuinetClock.swf" width="800" height="22" type="application/x-shockwave-flash" quality="high"></A></td>
	</tr>
</table>
  
	</div>
  
		</td>
	</tr>
</table>
  <br>
<% pageBar page, pageTotal %>
<br>
<table border="0" CELLPADDING="8" CELLSPACING="4">
<tr>
<%

'+-----------------------------------+
'|  循环输出图片
'+-----------------------------------+

j = 1
i = start
Set pp = New possible

Do While i < offset
	
	thisPicPath = server.mappath("./" & fileArray(i))
	x = pp.readX(thisPicPath)
	y = pp.readY(thisPicPath)

	If x > cWidth or y > cHeight Then

		tWidth = x / cWidth : tHeight = y / cHeight

		If tWidth > tHeight Then
			w = cWidth
			h = y / tWidth
		Elseif tWidth < tHeight Then
			h = cHeight
			w = x / tHeight
		Else
			w = cWidth
			h = cHeight
		End If

	Else
		w = x
		h = y
	End If
		
	If j > cEachLineMax Then
	j = 1
	response.Write "</tr><tr>"
	End If
	
		If  Session("Pic_Logined") = 1 Then
			response.Write "<td style=""border: 1px solid #C0C0C0"" width=" & cWidth & " height=" & cHeight & " align=center valign=bottom><a href=""./" & fileArray(i) & """ target=""_blank""><img border=0 src=" & fileArray(i) & " width=" & w & " height=" & h & " alt=""文件:" & fileArray(i) & "&nbsp;&nbsp;<br>&nbsp;&nbsp;尺寸:" & x & " × " & y & "&nbsp;&nbsp;""></a><br><br><a href=?mod=delpic&name=" & fileArray(i) & ">删除图片</a></td>"

		Else
			response.Write "<td style=""border: 1px solid #C0C0C0"" width=" & cWidth & " height=" & cHeight & " align=center><a href=""./" & fileArray(i) & """ target=""_blank""><img border=0 src=" & fileArray(i) & " width=" & w & " height=" & h & " alt=""文件:" & fileArray(i) & "&nbsp;&nbsp;<br>&nbsp;&nbsp;尺寸:" & x & " × " & y & "&nbsp;&nbsp;""></a><br></td>"
		End If

	j = j + 1
	
	i = i + 1

Loop

Set pp = Nothing

		If  Session("Pic_Logined") = 1 Then
			Loginout_Show = "<A href='?mod=logout'>退出管理</A>"
			Admin_Menu_Show = "<A href='?mod=upload'>上传图片</A>&nbsp;&nbsp;"

		Else
			Loginout_Show = "管理登陆，请输入您的用户名和密码"
			Admin_Menu_Show = "<form method=post action='?mod=login'>用户名:&nbsp;&nbsp;<input type='text' name='username' size='10' class='input_bg'>&nbsp;&nbsp;&nbsp;&nbsp;密&nbsp;&nbsp;码:&nbsp;&nbsp;<input type='password' name='userpass' size='10' class='input_bg'>&nbsp;&nbsp;&nbsp;&nbsp;<input type='submit' name='button' value='确定' class='input_bg'></form>"

		End If

%>
</tr>
</table>
<br>
<% pageBar page, pageTotal %>
</center>
	<br>
	<center>
	<table class="input_bg" width="800">
		<tr>
		</tr>
	</table>
	</center>
	<br>
	<br>
	<center><SCRIPT language=JavaScript src="/grphp/top.js"></SCRIPT><script language="JavaScript1.1" src="/grphp/post-001.asp?oid=21&bc=no&st=15"></script><script language="JavaScript"src="/style/copyright.js"></script>
              <script language="JavaScript" src="/cn/commerce/qq/qq.js"></script>
              <script language="JavaScript" src ="/intl/platform.asp?site=38466&user=38466"></script>
</center>
	</body>
	</html>

