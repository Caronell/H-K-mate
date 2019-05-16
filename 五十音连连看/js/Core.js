//#===============================================
//# ● 全局变量集中处
//#===============================================
var Hiragana = [
	"あ", "い", "う", "え", "お",
	"か", "き", "く", "け", "こ",
	"さ", "し", "す", "せ", "そ",
	"た", "ち", "つ", "て", "と",
	"な", "に", "ぬ", "ね", "の",
	"は", "ひ", "ふ", "へ", "ほ",
	"ま", "み", "む", "め", "も",
	"や", "ゆ", "よ",
	"ら", "り", "る", "れ", "ろ",
	"わ", "を", "ん",
	"が", "ぎ", "ぐ", "げ", "ご",
	"ざ", "じ", "ず", "ぜ", "ぞ",
	"だ", "ぢ", "づ", "で", "ど",
	"ば", "び", "ぶ", "べ", "ぼ",
	"ぱ", "ぴ", "ぷ", "ぺ", "ぽ"
];
var Katakana = [
	"ア", "イ", "ウ", "エ", "オ",
	"カ", "キ", "ク", "ケ", "コ",
	"サ", "シ", "ス", "セ", "ソ",
	"タ", "チ", "ツ", "テ", "ト",
	"ナ", "ニ", "ヌ", "ネ", "ノ",
	"ハ", "ヒ", "フ", "ヘ", "ホ",
	"マ", "ミ", "ム", "メ", "モ",
	"ヤ", "ユ", "ヨ",
	"ラ", "リ", "ル", "レ", "ロ",
	"ワ", "ヲ", "ン",
	"ガ", "ギ", "グ", "ゲ", "ゴ",
	"ザ", "ジ", "ズ", "ゼ", "ゾ",
	"ダ", "ヂ", "ヅ", "デ", "ド",
	"バ", "ビ", "ブ", "ベ", "ボ",
	"パ", "ピ", "プ", "ペ", "ポ"
];
var Romaji = [
	"a", "i", "u", "e", "o",
	"ka", "ki", "ku", "ke", "ko",
	"sa", "shi", "su", "se", "so",
	"ta", "chi", "tsu", "te", "to",
	"na", "ni", "nu", "ne", "no",
	"ha", "hi", "fu", "he", "ho",
	"ma", "mi", "mu", "me", "mo",
	"ya", "yu", "yo",
	"ra", "ri", "ru", "re", "ro",
	"wa", "o(wo)", "nn",
	"ga", "gi", "gu", "ge", "go",
	"za", "ji", "zu", "ze", "zo",
	"da", "ji(di)", "zu(du)", "de", "do",
	"ba", "bi", "bu", "be", "bo",
	"pa", "pi", "pu", "pe", "po"
];

var charpair = [];
var romapair = [];
var elemline = [];
var index = [] // 存放下标
var puzzle = []; // 放置选出的字
var ontip = false; // 是否正在显示罗马字
var unvoicedOnly = true;
var BGM_on = true;
var SE_on = true;
var GameMode = 0; //0:H-K 1:H-R 2:K-R
var hour, min, sec; // 计时器的时分秒
var left; // 还剩多少对
var clock;
var time;
var besttime = window.localStorage;

//#===============================================
//# ● 开始游戏
//#===============================================
function start()
{
	try
	{
		if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))
		{

		}
		else
		{
			document.getElementsByTagName("body")[0].style.height = "600px";
			document.getElementsByTagName("body")[0].style.width = "352px";
			document.getElementsByTagName("body")[0].style.background = "#B4A582";
		}
	}
	catch(e)
	{}
	window.localStorage.clear();
	document.getElementById("bgm").volume = 0.7;
	document.getElementById("resetting").volume = 0.7;
	document.getElementById("incorrect").volume = 0.9;
	clock = window.setInterval("timer()", 1000);
	initialize();
}

//#===============================================
//# ● 初始化游戏
//#===============================================
function initialize()
{
	left = 15;
	hour = 0;
	min = 0;
	sec = -1; // 不然有延迟问题……;
	charpair = [];
	romapair = [];
	elemline = [];
	puzzle = [];
	ontip = false;
	var i, t, r, len;
	if(unvoicedOnly == true)
	{
		len = 46;
	}
	else
	{
		len = 71;
	}
	for(i = 0; i < len; i += 1)
		index[i] = i;
	for(i = 0; i < 15; i += 1)
	{
		r = rand(len - i); //46
		t = index[r];
		index.splice(r, 1);
		if(GameMode == 0)
		{
			puzzle.push(Hiragana[t]);
			puzzle.unshift(Katakana[t]);
		}
		else if(GameMode == 1)
		{
			puzzle.push(Hiragana[t]);
			puzzle.unshift(Romaji[t]);
		}
		else if(GameMode == 2)
		{
			puzzle.push(Katakana[t]);
			puzzle.unshift(Romaji[t]);
		}
	}
	var ul = document.getElementById("list");
	var tpul = document.getElementById("tiplist");
	tpul.innerHTML = "";
	ul.innerHTML = '<li id="reset" onclick="update()">重新开始</li>';
	ul.innerHTML += '<li id="showtip" onclick="update()">显示罗马音</li>';
	for(i = 0; i < 30; i += 1)
	{
		var idname;
		if(i < 15)
			r = rand(15 - i);
		else
			r = rand(30 - i);
		if(is_hiragana(puzzle[r]))
		{
			t = Hiragana.indexOf(puzzle[r]);
			if(GameMode == 1)
				idname = Romaji[t].toUpperCase();
			else
				idname = Romaji[t];
		}
		else if(is_katakana(puzzle[r]))
		{
			t = Katakana.indexOf(puzzle[r]);
			idname = Romaji[t].toUpperCase();
		}
		else
		{
			idname = puzzle[r];
		}
		elemline.push(puzzle[r]);
		var str = '<li id="' + idname + '" class="inactive" ';
		if(idname.length > 3 && !is_hiragana(puzzle[r]) && !is_katakana(puzzle[r]))
		{
			str += 'data-long="yes" ';
		}
		str += 'onclick="update()">';
		str += puzzle[r] + '</li>';
		ul.innerHTML = str + ul.innerHTML;
		puzzle.splice(r, 1);
	}
	//alert(document.getElementById("besttime").innerText);
	if(document.getElementById("besttime").innerText == "最佳时间：00:00:00" || document.getElementById("besttime").innerText == "最佳时间：undefined" || besttime.time == 0)
	{
		document.getElementById("besttime").textContent = "最佳时间：00:00:00";
		besttime.time = 0;
	}
	else
		document.getElementById("besttime").textContent = "最佳时间：" + besttime.time;
	//alert(document.getElementById("besttime").textContent);
}

//#===============================================
//# ● 重置游戏
//#===============================================
function restart()
{
	document.getElementById("win").style.display = "none";
	var tsound = document.getElementById("resetting");
	tsound.currentTime = 0;
	tsound.play();
	clock = window.clearInterval(clock);
	initialize();
	clock = window.setInterval("timer()", 1000);
}

//#===============================================
//# ● 核心更新部分
//#===============================================
function update()
{
	var a = event.srcElement;
	if(a.id == undefined)
		return;
	if(a.textContent == " ")
		return;
	if(a.id == "reset")
	{
		restart();
		return;
	}
	else if(a.id == "showtip")
	{
		//alert(besttime.time);
		if(ontip)
		{
			var cancel = document.getElementById("cancel");
			cancel.currentTime = 0;
			cancel.play();
		}
		else
		{
			var tsound = document.getElementById("show_tip");
			tsound.currentTime = 0;
			tsound.play();
		}
		showromaji();
		return;
	}
	else
	{
		var ch = document.getElementById(a.id).textContent;
		if(a.className == "active")
			a.className = "inactive";
		else
			a.className = "active";
		if(charpair.indexOf(ch) == -1)
		{
			if(charpair.length == 0)
			{
				var decision = document.getElementById("select_romaji");
				decision.currentTime = 0;
				decision.play();
			}
			charpair.push(ch);
			if(is_hiragana(ch))
			{
				var ind = Hiragana.indexOf(ch);
				if(GameMode == 1)
					romapair.push(Romaji[ind].toUpperCase());
				else
					romapair.push(Romaji[ind]);
			}
			else if(is_katakana(ch))
			{
				var ind = Katakana.indexOf(ch);
				romapair.push(Romaji[ind].toUpperCase());
			}
			else
			{
				romapair.push(ch);
			}
		}
		else
		{
			var cancel = document.getElementById("cancel");
			cancel.currentTime = 0;
			cancel.play();
			charpair = [];
			romapair = [];
			return;
		}
		var result = action_judge();
		if(result == 1) //不对
		{
			var buzzer = document.getElementById("incorrect");
			buzzer.currentTime = 0;
			buzzer.play();
			document.getElementById(romapair[0]).className = "inactive";
			document.getElementById(romapair[1]).className = "inactive";
			charpair.splice(0, 2);
			romapair.splice(0, 2);
		}
		else if(result == 2) //对
		{
			var chime = document.getElementById("correct");
			chime.currentTime = 0;
			chime.play();
			var cha = document.getElementById(romapair[0]).textContent;
			var chb = document.getElementById(romapair[1]).textContent;
			if(is_hiragana(cha) || is_katakana(cha))
			{
				var ind = elemline.indexOf(cha);
				elemline[ind] = " ";
			}
			if(is_hiragana(chb) || is_katakana(chb))
			{
				var ind = elemline.indexOf(chb);
				elemline[ind] = " ";
			}
			document.getElementById(romapair[0]).className = "disabled";
			document.getElementById(romapair[0]).textContent = " ";
			document.getElementById(romapair[1]).className = "disabled";
			document.getElementById(romapair[1]).textContent = " ";
			charpair.splice(0, 2);
			romapair.splice(0, 2);
			if(ontip)
			{
				showromaji();
				showromaji();
			}
			left -= 1;
			if(left == 0)
			{
				clock = window.clearInterval(clock);
				if(besttime.time == 0)
				{
					besttime.time = time;
					document.getElementById("besttime").textContent = "最佳时间：" + besttime.time;
				}
				else
				{
					if(time < besttime.time)
					{
						besttime.time = time;
						document.getElementById("besttime").textContent = "最佳时间：" + besttime.time;
					}
				}
				$("#win").fadeIn(100);
			}
		}
	}
}

//#===============================================
//# ● 计时器
//#===============================================
function timer()
{
	sec += 1;
	if(sec >= 60)
	{
		sec = 0;
		min += 1;
	}
	if(min >= 60)
	{
		min = 0;
		hour += 1;
	}
	var str = "";
	if(hour < 10)
		str += "0";
	str += hour + ":";
	if(min < 10)
		str += "0";
	str += min + ":"
	if(sec < 10)
		str += "0";
	str += sec;
	document.getElementById("timetext").textContent = "已用时间：" + str;
	time = str;
}

//#===============================================
//# ● 显示罗马音
//#===============================================
function showromaji()
{
	var tipul = document.getElementById("tiplist");
	if(ontip)
	{
		tipul.innerHTML = "";
		document.getElementById("showtip").textContent = "显示罗马音";
		ontip = false;
	}
	else
	{
		var i, ind;
		for(i = 4; i < 30; i -= 1)
		{
			var ch = elemline[i];
			var roma;
			if(ch == " ")
				roma = " ";
			else if(is_hiragana(ch))
			{
				ind = Hiragana.indexOf(ch);
				roma = Romaji[ind];
			}
			else if(is_katakana(ch))
			{
				ind = Katakana.indexOf(ch);
				roma = Romaji[ind];
			}
			else
			{
				roma = " ";
			}
			var str = '<li>' + roma + '</li>';
			tipul.innerHTML = str + tipul.innerHTML;
			if(i % 5 == 0)
				i += 10;
		}
		document.getElementById("showtip").textContent = "关闭罗马音";
		ontip = true;
	}
}

//#===============================================
//# ● 判断对应关系等
//#===============================================
function action_judge()
{
	if(charpair.length == 2)
	{
		var ia, ib;
		if(GameMode == 0)
		{
			if(is_katakana(charpair[0]))
			{
				var t = charpair[0];
				charpair[0] = charpair[1];
				charpair[1] = t;
			}
			ia = Hiragana.indexOf(charpair[0]);
			ib = Katakana.indexOf(charpair[1]);
		}
		else if(GameMode == 1)
		{
			if(is_hiragana(charpair[0]))
			{
				var t = charpair[0];
				charpair[0] = charpair[1];
				charpair[1] = t;
			}
			ia = Romaji.indexOf(charpair[0]);
			ib = Hiragana.indexOf(charpair[1]);
		}
		else if(GameMode == 2)
		{
			if(is_katakana(charpair[0]))
			{
				var t = charpair[0];
				charpair[0] = charpair[1];
				charpair[1] = t;
			}
			ia = Romaji.indexOf(charpair[0].toLowerCase());
			ib = Katakana.indexOf(charpair[1]);
		}
		if(ia == ib)
			return 2;
		else
			return 1;
	}
	else
		return 0;
}

//#===============================================
//# ● 判断是否是平假名
//#===============================================
function is_hiragana(x)
{
	if(Hiragana.indexOf(x) != -1)
		return true;
	else
		return false;
}

//#===============================================
//# ● 判断是否是片假名
//#===============================================
function is_katakana(x)
{
	if(Katakana.indexOf(x) != -1)
		return true;
	else
		return false;
}

//#===============================================
//# ● 生成随机数
//#===============================================
function rand(m)
{
	var temp;
	temp = parseInt(Math.random() * m, 10);
	return temp;
}

//#===============================================
//# ● 更改开关状态
//#===============================================
function ShiftSwitch()
{
	var cn = event.srcElement;
	var p = cn.id;
	if(cn.className == "switches-off")
	{
		cn.src = "img/switch-on.png";
		cn.className = "switches-on";
		if(p == "s5")
		{
			if(document.getElementById("s6").className == "switches-on")
			{
				document.getElementById("s6").className = "switches-off";
				document.getElementById("s6").src = "img/switch-off.png";
			}
			else if(document.getElementById("s7").className == "switches-on")
			{
				document.getElementById("s7").className = "switches-off";
				document.getElementById("s7").src = "img/switch-off.png";
			}
		}
		else if(p == "s6")
		{
			if(document.getElementById("s5").className == "switches-on")
			{
				document.getElementById("s5").className = "switches-off";
				document.getElementById("s5").src = "img/switch-off.png";
			}
			else if(document.getElementById("s7").className == "switches-on")
			{
				document.getElementById("s7").className = "switches-off";
				document.getElementById("s7").src = "img/switch-off.png";
			}
		}
		else if(p == "s7")
		{
			if(document.getElementById("s6").className == "switches-on")
			{
				document.getElementById("s6").className = "switches-off";
				document.getElementById("s6").src = "img/switch-off.png";
			}
			else if(document.getElementById("s5").className == "switches-on")
			{
				document.getElementById("s5").className = "switches-off";
				document.getElementById("s5").src = "img/switch-off.png";
			}
		}
		dochange(parseInt(p[1]));
	}
	else
	{
		if(p != "s5" && p != "s6" && p != "s7")
		{
			cn.src = "img/switch-off.png";
			cn.className = "switches-off";
			dochange(parseInt(p[1]));
		}
	}
}

//#===============================================
//# ● 执行提示图片的淡入淡出
//#===============================================
function hintFade()
{
	$("#hint").fadeIn(500);
	setTimeout(function()
	{
		$("#hint").fadeOut(600);
	}, 2000);
}

//#===============================================
//# ● 执行开关事件
//#===============================================
function dochange(n)
{
	switch(n)
	{
		case 1: // 是否加入浊音半浊音
			if(unvoicedOnly)
			{
				unvoicedOnly = false;
				hintFade();
			}
			else
			{
				unvoicedOnly = true;
				hintFade();
			}
			restart();
			break;
		case 3: // BGM
			if(BGM_on)
			{
				document.getElementById("bgm").volume = 0;
				BGM_on = false;
			}
			else
			{
				document.getElementById("bgm").volume = 0.7;
				BGM_on = true;
			}
			break;
		case 4: // SE
			if(SE_on)
			{
				var arr = document.getElementsByClassName("se");
				for(var i = 0; i < arr.length; i += 1)
				{
					arr[i].volume = 0;
				}
				SE_on = false;
			}
			else
			{
				var arr = document.getElementsByClassName("se");
				for(var i = 0; i < arr.length; i += 1)
				{
					arr[i].volume = 0.7;
				}
				SE_on = true;
			}
			break;
		case 5:
			GameMode = 0;
			hintFade();
			restart();
			break;
		case 6:
			GameMode = 1;
			hintFade();
			restart();
			break;
		case 7:
			GameMode = 2;
			hintFade();
			restart();
			break;
	}
}

//#===============================================
//# ● 清空最佳纪录
//#===============================================
function ClearRecord()
{
	var tsound = document.getElementById("resetting");
	tsound.currentTime = 0;
	tsound.play();
	besttime.time = 0;
	document.getElementById("besttime").textContent = "最佳时间：00:00:00";
}