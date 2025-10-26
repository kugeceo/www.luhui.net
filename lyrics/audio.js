/**
 * 音频
 * by:小怪
 * QQ877059905
 */

// (function ($) {
//     'use strict';

    // $(function () {
let voiceRole; // 语音
let voiceData = [];
$(function () {
    //初始化
    $.get("https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4", function (voices) {
        initVoiceSetting(voices);
    });
});
//初始化
const initVoiceSetting = (voices) => {
    let voicesEle = document.getElementById("preSetSpeech");
    // 支持中文和英文
    voices = voices.filter(item => item.Locale.match(/^(zh-|en-)/));
    voices.map(item => {
        item.name = item.FriendlyName || (`${item.DisplayName} Online (${item.VoiceType}) - ${item.LocaleName}`);
        item.lang = item.Locale;
    })
    voices.sort((a, b) => {
        if (a.lang.slice(0, 2) === b.lang.slice(0, 2)) {
            if (a.lang.slice(0, 2) === "zh") {
                return (a.lang === b.lang) ? 0 : (a.lang > b.lang) ? 1 : -1; // zh-CN 在前
            } else {
                return 0
            }
        }
        return (a.lang < b.lang) ? 1 : -1; // 中文"z"在前
    });
    voices.map(item => {
        if (item.name.match(/^(Google |Microsoft )/)) {
            item.displayName = item.name.replace(/^.*? /, "");
        } else {
            item.displayName = item.name;
        }
    });
    voicesEle.innerHTML = "";
    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.text = voice.displayName;
        voicesEle.options.add(option);
    });
    voiceRole = voices[0];

    voicesEle.onchange = () => {
        voiceRole = voices[voicesEle.value];
        localStorage.setItem("voice", voiceRole.name);
    };

}
const getTime = () => {
    return new Date().toString();
}
//音量
let volumeEle = document.getElementById("voiceVolume");
let localVolume = localStorage.getItem("voiceVolume");
let voiceVolume = parseFloat(localVolume || volumeEle.getAttribute("value"));
const voiceVolumeChange = () => {
    let localVolume = localStorage.getItem("voiceVolume");
    volumeEle.value = voiceVolume = parseFloat(localVolume || volumeEle.getAttribute("value"));
    volumeEle.style.backgroundSize = (volumeEle.value - volumeEle.min) * 100 / (volumeEle.max - volumeEle.min) + "% 100%";
}
volumeEle.oninput = () => {
    volumeEle.style.backgroundSize = (volumeEle.value - volumeEle.min) * 100 / (volumeEle.max - volumeEle.min) + "% 100%";
    localStorage.setItem("voiceVolume", volumeEle.value);
}
voiceVolumeChange();
//语速
let rateEle = document.getElementById("voiceRate");
let localRate = localStorage.getItem("voiceRate");
let voiceRate = parseFloat(localRate || rateEle.getAttribute("value"));
const voiceRateChange = () => {
    let localRate = localStorage.getItem("voiceRate");
    rateEle.value = voiceRate = parseFloat(localRate || rateEle.getAttribute("value"));
    rateEle.style.backgroundSize = (rateEle.value - rateEle.min) * 100 / (rateEle.max - rateEle.min) + "% 100%";
}
rateEle.oninput = () => {
    rateEle.style.backgroundSize = (rateEle.value - rateEle.min) * 100 / (rateEle.max - rateEle.min) + "% 100%";
    localStorage.setItem("voiceRate", rateEle.value);
}
voiceRateChange();
//音调
let pitchEle = document.getElementById("voicePitch");
let localPitch = localStorage.getItem("voicePitch");
let voicePitch = parseFloat(localPitch || pitchEle.getAttribute("value"));
const voicePitchChange = () => {
    let localPitch = localStorage.getItem("voicePitch");
    pitchEle.value = voicePitch = parseFloat(localPitch || pitchEle.getAttribute("value"));
    pitchEle.style.backgroundSize = (pitchEle.value - pitchEle.min) * 100 / (pitchEle.max - pitchEle.min) + "% 100%";
}
pitchEle.oninput = () => {
    pitchEle.style.backgroundSize = (pitchEle.value - pitchEle.min) * 100 / (pitchEle.max - pitchEle.min) + "% 100%";
    localStorage.setItem("voicePitch", pitchEle.value);
}
voicePitchChange();
const uuidv4 = () => {
    let uuid = ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
    return uuid;
}
const getWSAudio = (date) => {
    return `X-Timestamp:${date}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`
}
const escapeTextarea = document.createElement("textarea");
const getEscape = str => {
    escapeTextarea.textContent = str;
    return escapeTextarea.innerHTML;
}
const getWSText = (date, requestId, lang, voice, volume, rate, pitch, style, role, msg) => {
    let fmtVolume = volume === 1 ? "+0%" : volume * 100 - 100 + "%";
    let fmtRate = (rate >= 1 ? "+" : "") + (rate * 100 - 100) + "%";
    let fmtPitch = (pitch >= 1 ? "+" : "") + (pitch - 1) + "Hz";
    msg = getEscape(msg);
    return `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${date}Z\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${lang}'><voice name='${voice}'><prosody pitch='${fmtPitch}' rate='${fmtRate}' volume='${fmtVolume}'>${msg}</prosody></voice></speak>`;
}

let testVoiceIns;
let testVoiceBlob;
//播放音频
const playTestAudio = () => {
    if (!testVoiceIns || testVoiceIns instanceof Audio === false) {
        testVoiceIns = new Audio();
        testVoiceIns.onended = testVoiceIns.onerror = () => {
            stopTestVoice();
        }
    }
    testVoiceIns.src = URL.createObjectURL(testVoiceBlob);
    testVoiceIns.play();

}
//暂停
const pauseTestVoice = () => {
    if (testVoiceIns) {
        if (testVoiceIns && testVoiceIns instanceof Audio) {
            testVoiceIns.pause();
        } else if (supportSpe) {
            speechSynthesis.pause();
        }
    }
    testVoiceBtn.className = "justSetLine resumeTestVoice";
}

//恢复播放
const resumeTestVoice = () => {
    if (testVoiceIns) {
        if (testVoiceIns && testVoiceIns instanceof Audio) {
            testVoiceIns.play();
        } else if (supportSpe) {
            speechSynthesis.resume();
        }
    }
    testVoiceBtn.className = "justSetLine pauseTestVoice";
}
//停止
const stopTestVoice = () => {
    if (testVoiceIns) {
        if (testVoiceIns instanceof Audio) {
            testVoiceIns.pause();
            testVoiceIns.currentTime = 0;
            URL.revokeObjectURL(testVoiceIns.src);
            testVoiceIns.removeAttribute("src");
        } else if (supportSpe) {
            speechSynthesis.cancel();
        }
    }
    testVoiceBtn.className = "justSetLine readyTestVoice";
}
//播放
const startTestVoice = async () => {
    testVoiceBtn.className = "justSetLine pauseTestVoice";
    let volume = voiceVolume;
    let rate = voiceRate;
    let pitch = voicePitch;
    let content = $('#audio').val();
    let voice = voiceRole.Name;
    let style = null;
    let role = null;
    let key = content + voice + volume + rate + pitch + (style ? style : "") + (role ? role : "");
    let blob = voiceData[key];
    if (blob) {
        testVoiceBlob = blob;
        playTestAudio();
    } else {
        await initDownSocket();
        let currDate = getTime();
        let lang = voiceRole.lang;
        let uuid = uuidv4();
        downSocket.send(getWSAudio(currDate));
        downSocket.send(getWSText(currDate, uuid, lang, voice, volume, rate, pitch, style, role, content));
        downSocket["pending"] = true;
        downQuene[uuid] = {};
        downQuene[uuid]["name"] = content;
        downQuene[uuid]["key"] = key;
        downQuene[uuid]["isTest"] = true;
        downQuene[uuid]["blob"] = [];
    }


}
let downQuene = {};
let downSocket;
const downBlob = (blob, name) => {
    let a = document.createElement("a");
    a.download = name;
    a.href = URL.createObjectURL(blob);
    a.click();
}
const initDownSocket = () => {
    return new Promise((res, rej) => {
        if (!downSocket || downSocket.readyState > 1) {
            downSocket = new WebSocket("wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4");
            downSocket.binaryType = "arraybuffer";
            downSocket.onopen = () => {
                res();
            };
            downSocket.onmessage = (e) => {
                if (e.data instanceof ArrayBuffer) {
                    let text = new TextDecoder().decode(e.data.slice(0, 130));
                    let reqIdx = text.indexOf(":");
                    let uuid = text.slice(reqIdx + 1, reqIdx + 33);
                    downQuene[uuid]["blob"].push(e.data.slice(130));
                } else if (e.data.indexOf("Path:turn.end") !== -1) {
                    let reqIdx = e.data.indexOf(":");
                    let uuid = e.data.slice(reqIdx + 1, reqIdx + 33);
                    let blob = new Blob(downQuene[uuid]["blob"], {type: "audio/mpeg"});
                    let key = downQuene[uuid]["key"];
                    let name = downQuene[uuid]["name"];
                    voiceData[key] = blob;
                    //判断播放还是试听
                    if (downQuene[uuid]["isTest"]) {
                        testVoiceBlob = blob;
                        //试听播放
                        playTestAudio();
                    } else {
                        //下载
                        downBlob(blob, name.slice(0, 16) + ".mp3");
                    }
                }
            }
            downSocket.onerror = () => {
                rej();
            }
        } else {
            return res();
        }
    })
}


//下载音频
const downloadAudio = async () => {
    let voice =  voiceRole.Name;
    let volume = voiceVolume;
    let rate = voiceRate;
    let pitch = voicePitch;
    let style = null;
    let role = null;
    let content = $('#audio').val();
    let key = content + voice + volume + rate + pitch + (style ? style : "") + (role ? role : "");
    let blob = voiceData[key];
    if (blob) {
        downBlob(blob, content.slice(0, 16) + ".mp3");
    } else {
        await initDownSocket();
        let currDate = getTime();
        let lang = voiceRole.lang;
        let uuid = uuidv4();
        downSocket.send(getWSAudio(currDate));
        downSocket.send(getWSText(currDate, uuid, lang, voice, volume, rate, pitch, style, role, content));
        downSocket["pending"] = true;
        downQuene[uuid] = {};
        downQuene[uuid]["name"] = content;
        downQuene[uuid]["key"] = key;
        downQuene[uuid]["blob"] = [];
    }
}









