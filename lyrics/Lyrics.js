	function killErrors() {
		return true;
	}

	window.onerror = killErrors;

	var LyricsTimeN, joinN, LrcN;
	var contentT, offset, i;
	var LyricsTime;
	var playerType, svalTxt, yvalTxt;
        var checkLrcCtrl, sval;

	function BodyLoaded() {
		varInit();
		GetMusicName();
		document.LRCTXT.location.replace("lyrics/LrcTxt.html");
	}

	function araVob(){}

	function varInit() {
		window.clearInterval(checkLrcCtrl);
		contentT = 0;
                LyricsTimeN = 1;
                LyricsTime = new araVob();
                document.all("LRCTXTSTATE").value = "";
                document.all("TAGS").value = "";
                i = 0;
                joinN = 0;
                svalTxt = "";
                yvalTxt = "";
		window.clearInterval(sval);
                playerType = document.all("PLAYERTYPED").value;
	}

	function GetMusicName() {
		if (GetState() != 0) {
			window.setTimeout("GetMusicName()", 500);
		}
		else{
			checkLrcLoaded();
		}
	}

	function GetState() {
		if (playerType == "wmp") {
			return(parent.mediaPlayerObj.playState - 3);}
		else if(playerType == "real") {
			return(parent.realPlayerObj.GetPlayState() - 3);
		}	
	}

	function checkLrcLoaded() {
		var loaded = document.all("LRCTXTSTATE").value;
		if (loaded == "") {
			setTimeout("checkLrcLoaded();", 500);}
		else {
			document.all("LRCTXTSTATE").value = "";
                        document.LRCTXT.document.all("musicname").value = parent.rtxt2.innerText;
			checkLrcOuted();
		}
	}

	function checkLrcOuted() {
		var loaded = document.all("LRCTXTSTATE").value;
		if (loaded == "") {
			setTimeout("checkLrcOuted();", 500);}
		else {
			eventLoader();
		}
	}

	function eventLoader() {
		var LrcTagStr = document.all("TAGS").value;
		if (LrcTagStr != "") {
			TagInit(LrcTagStr);
			HighLight("ll1");
			lrcResume();
		}
	}

	function TagInit(tags) {
		var sub, index = 1;
		sub = tags.indexOf("|");
		offset = parseInt(tags.slice(0, sub));
		tags = tags.slice(sub + 1);
		sub = tags.indexOf("|");
		while (sub != -1) {
			LyricsTime[index] = parseInt(tags.slice(0, sub));
			tags = tags.slice(sub + 1);
			sub = tags.indexOf("|");
			index ++;
		}
                LrcN = index;
		GetLength(index);
	}

	function GetLength(index) {
		var length;
		if (GetState() != 0) {
			window.setTimeout("GetLength(" + index + ")", 500);}
		else{
			if (playerType == "wmp") {
				length = parseInt(parent.mediaPlayerObj.currentMedia.duration * 1000);
			}
			else if(playerType == "real") {
				length = parent.realPlayerObj.GetLength();
			}
			LyricsTime[index] = length;
			if (LyricsTime[index] - LyricsTime[index - 1] <= 5000) {
				LyricsTime[index] = parseInt((parseInt(LyricsTime[index - 1]) + parseInt(LyricsTime[index]))/2);
			}
			else{
				LyricsTime[index] = LyricsTime[index] - 5000;
			}
		}
	}

	function checkLrc() {
		
		var curTime;
		
		if (GetState() == 0) {
			if (playerType == "wmp") {
				curTime = parseInt(parent.mediaPlayerObj.controls.currentPosition * 1000) + offset;
			}
			else if(playerType == "real") {
				curTime = parent.realPlayerObj.GetPosition() + offset;
			}
		}

		var overN = 0;
		if (curTime >= LyricsTime[LyricsTimeN]) {
			while (curTime >= LyricsTime[LyricsTimeN + overN]) {
				overN ++;
			}
			if (overN > 1) {
				jumpTo(overN - 1);
			}
			if (LyricsTimeN != 1) {
				graScrollTo(1, 1);
				LowLight("ll" + (LyricsTimeN - 1));
			}
			else {
				LowLight("ll" + LyricsTimeN);
			}
			LyricsTimeN += overN;
			HighLight("ll" + (LyricsTimeN - 1));
                        BScroll();
		}
		else if (curTime < LyricsTime[LyricsTimeN - 1]) {
			while (curTime < LyricsTime[LyricsTimeN + overN - 1]) {
				overN --;
			}
			if (overN < -1) {
				if (curTime < LyricsTime[2]) {
					jumpTo(overN - 1);
				}
				else {
					jumpTo(overN - 1);
					graScrollTo(1, 1);
				}
			}
			else {
				if (curTime > LyricsTime[1]) {
					graScrollTo(1, -1);
				}
			}
			LowLight("ll" + (LyricsTimeN - 1));
			LyricsTimeN += overN;
			if (LyricsTimeN == 1) {
				HighLight("ll1");
			}
			else {
				HighLight("ll" + (LyricsTimeN - 1));
                                BScroll();
			}
		}
	}

	function BScroll() {
                window.clearInterval(sval);
                if(i > 0 && i <= svalTxt.length)
                  document.LRCTXT.document.all("ll" + joinN).innerHTML = yvalTxt;
                joinN = LyricsTimeN - 1;
                svalTxt = document.LRCTXT.document.all("ll" + (LyricsTimeN - 1)).innerText;
                yvalTxt = document.LRCTXT.document.all("ll" + (LyricsTimeN - 1)).innerHTML;
                i = 0;
                bsTime = parseInt((LyricsTime[LyricsTimeN] - LyricsTime[LyricsTimeN - 1])/(svalTxt.length + 2));
                if(LyricsTimeN <= LrcN) sval = window.setInterval("changeCharColor();", bsTime);
        }

	function graScrollTo(step, dir) {
		contentT -= dir;
		window.setTimeout("document.LRCTXT.document.all.content.style.top = contentT;", 20); 
		if (step < LineHeight) {
			step ++;
			window.setTimeout("graScrollTo(" + step + ", " + dir + ");", 20);
		}
	}

	function jumpTo(nLine) {
		contentT -= LineHeight * nLine;
		if (contentT > 0) {
			contentT = 0;
		}
		document.LRCTXT.document.all.content.style.top = contentT;
	}

	function HighLight(lid) {
		var lid;
		document.LRCTXT.document.all(lid).style.color = LrcHLColor;
	}

	function LowLight(lid) {
		var lid;
		document.LRCTXT.document.all(lid).style.color = LrcColor;
	}

	function lrcResume() {
		checkLrcCtrl = window.setInterval("checkLrc();",10);
	}

        function changeCharColor()
        {
          str = "";
          for (var j = 0; j < svalTxt.length; j++)
          {
            if(j == i)
              str += "<font color=" + LrcBSColor + ">" + svalTxt.charAt(i) + "</font>";
            else
            {
              if(j > i)
                str += svalTxt.charAt(j);
              if(j < i)
                str += "<font color=" + LrcBSColor + ">" + svalTxt.charAt(j) + "</font>";
            }
          }
          document.LRCTXT.document.all("ll" + (LyricsTimeN - 1)).innerHTML = str;
          if(i == svalTxt.length)
          {
            window.clearInterval(sval);
            document.LRCTXT.document.all("ll" + (LyricsTimeN - 1)).innerHTML = yvalTxt;
            i = 0;
          }
          else
            i++;
        }