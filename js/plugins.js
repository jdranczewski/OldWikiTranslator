// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/**
 * Debounce and throttle function's decorator plugin 1.0.5
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

	debounce : function(fn, timeout, invokeAsap, ctx) {

		if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
			ctx = invokeAsap;
			invokeAsap = false;
		}

		var timer;

		return function() {

			var args = arguments;
            ctx = ctx || this;

			invokeAsap && !timer && fn.apply(ctx, args);

			clearTimeout(timer);

			timer = setTimeout(function() {
				!invokeAsap && fn.apply(ctx, args);
				timer = null;
			}, timeout);

		};

	},

	throttle : function(fn, timeout, ctx) {

		var timer, args, needInvoke;

		return function() {

			args = arguments;
			needInvoke = true;
			ctx = ctx || this;

			if(!timer) {
				(function() {
					if(needInvoke) {
						fn.apply(ctx, args);
						needInvoke = false;
						timer = setTimeout(arguments.callee, timeout);
					}
					else {
						timer = null;
					}
				})();
			}

		};

	}

});

})(jQuery);

/*!
 * cookie-monster - a simple cookie library
 * v0.3.0
 * https://github.com/jgallen23/cookie-monster
 * copyright Greg Allen 2014
 * MIT License
*/
var monster={set:function(e,t,n,r,i){var o=new Date,s="",u=typeof t,c="",f="";if(r=r||"/",n&&(o.setTime(o.getTime()+24*n*60*60*1e3),s="; expires="+o.toUTCString()),"object"===u&&"undefined"!==u){if(!("JSON"in window))throw"Bummer, your browser doesn't support JSON parsing.";c=encodeURIComponent(JSON.stringify({v:t}))}else c=encodeURIComponent(t);i&&(f="; secure"),document.cookie=e+"="+c+s+"; path="+r+f},get:function(e){for(var t=e+"=",n=document.cookie.split(";"),r="",i="",o={},s=0;s<n.length;s++){for(var u=n[s];" "==u.charAt(0);)u=u.substring(1,u.length);if(0===u.indexOf(t)){if(r=decodeURIComponent(u.substring(t.length,u.length)),i=r.substring(0,1),"{"==i)try{if(o=JSON.parse(r),"v"in o)return o.v}catch(c){return r}return"undefined"==r?void 0:r}}return null},remove:function(e){this.set(e,"",-1)},increment:function(e,t){var n=this.get(e)||0;this.set(e,parseInt(n,10)+1,t)},decrement:function(e,t){var n=this.get(e)||0;this.set(e,parseInt(n,10)-1,t)}};

/* The languages list! */
languages = JSON.parse('[["en", "English", 5488625], ["ceb", "Sinugboanong Binisaya", 5382720], ["sv", "Svenska", 3789263], ["de", "Deutsch", 2108022], ["fr", "Français", 1916144], ["nl", "Nederlands", 1912683], ["ru", "Русский", 1425204], ["it", "Italiano", 1387210], ["es", "Español", 1357491], ["war", "Winaray", 1262893], ["pl", "Polski", 1243716], ["vi", "Tiếng Việt", 1162094], ["ja", "日本語", 1078960], ["pt", "Português", 979510], ["zh", "中文", 966557], ["uk", "Українська", 740251], ["fa", "فارسی", 576704], ["ca", "Català", 557085], ["ar", "العربية", 542220], ["no", "Norsk (Bokmål)", 476129], ["sh", "Srpskohrvatski / Српскохрватски", 440140], ["fi", "Suomi", 422886], ["hu", "Magyar", 417981], ["id", "Bahasa Indonesia", 411290], ["ko", "한국어", 398953], ["cs", "Čeština", 390897], ["ro", "Română", 379460], ["sr", "Српски / Srpski", 356937], ["ms", "Bahasa Melayu", 304193], ["tr", "Türkçe", 299573], ["eu", "Euskara", 284000], ["eo", "Esperanto", 242046], ["bg", "Български", 234942], ["hy", "Հայերեն", 232434], ["da", "Dansk", 232035], ["sk", "Slovenčina", 223100], ["min", "Baso Minangkabau", 222017], ["kk", "Қазақша", 219642], ["he", "עברית", 213594], ["lt", "Lietuvių", 183209], ["hr", "Hrvatski", 178030], ["ce", "Нохчийн", 164434], ["et", "Eesti", 162021], ["sl", "Slovenščina", 158427], ["be", "Беларуская", 146505], ["gl", "Galego", 141515], ["el", "Ελληνικά", 137325], ["nn", "Nynorsk", 135134], ["uz", "O‘zbek", 129068], ["la", "Latina", 127306], ["az", "Azərbaycanca", 125710], ["ur", "اردو", 124382], ["hi", "हिन्दी", 121494], ["vo", "Volapük", 120620], ["th", "ไทย", 119345], ["ka", "ქართული", 117810], ["ta", "தமிழ்", 113351], ["cy", "Cymraeg", 92560], ["mk", "Македонски", 90765], ["mg", "Malagasy", 84696], ["oc", "Occitan", 83582], ["tl", "Tagalog", 83443], ["ky", "Кыргызча", 80583], ["lv", "Latviešu", 79172], ["bs", "Bosanski", 75763], ["tt", "Tatarça / Татарча", 72830], ["new", "नेपाल भाषा", 72138], ["sq", "Shqip", 69275], ["tg", "Тоҷикӣ", 69106], ["te", "తెలుగు", 67544], ["pms", "Piemontèis", 64197], ["br", "Brezhoneg", 63112], ["bn", "বাংলা", 52740], ["ml", "മലയാളം", 52381], ["ht", "Krèyol ayisyen", 51551], ["ast", "Asturianu", 50993], ["lb", "Lëtzebuergesch", 50416], ["jv", "Basa Jawa", 50278], ["mr", "मराठी", 48739], ["azb", "تۆرکجه", 47449], ["af", "Afrikaans", 47091], ["sco", "Scots", 46779], ["pnb", "شاہ مکھی پنجابی (Shāhmukhī Pañjābī)", 45246], ["ga", "Gaeilge", 44212], ["is", "Íslenska", 43604], ["cv", "Чăваш", 40671], ["ba", "Башҡорт", 40009], ["fy", "Frysk", 39174], ["su", "Basa Sunda", 38753], ["sw", "Kiswahili", 37863], ["my", "မြန်မာဘာသာ", 37478], ["lmo", "Lumbaart", 36238], ["an", "Aragonés", 32407], ["yo", "Yorùbá", 31585], ["ne", "नेपाली", 30082], ["gu", "ગુજરાતી", 27418], ["io", "Ido", 27269], ["pa", "ਪੰਜਾਬੀ", 26937], ["nds", "Plattdüütsch", 26768], ["scn", "Sicilianu", 25644], ["bpy", "ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী", 25079], ["als", "Alemannisch", 23401], ["bar", "Boarisch", 23127], ["ku", "Kurdî / كوردی", 23048], ["kn", "ಕನ್ನಡ", 22221], ["ia", "Interlingua", 20561], ["qu", "Runa Simi", 20284], ["ckb", "Soranî / کوردی", 19801], ["mn", "Монгол", 17567], ["arz", "مصرى (Maṣrī)", 17358], ["wa", "Walon", 14606], ["gd", "Gàidhlig", 14592], ["nap", "Nnapulitano", 14470], ["bug", "Basa Ugi", 14130], ["yi", "ייִדיש", 14126], ["am", "አማርኛ", 13853], ["si", "සිංහල", 13808], ["cdo", "Mìng-dĕ̤ng-ngṳ̄", 13438], ["or", "ଓଡ଼ିଆ", 13168], ["fo", "Føroyskt", 12609], ["mzn", "مَزِروني", 12561], ["hsb", "Hornjoserbsce", 12354], ["xmf", "მარგალური (Margaluri)", 12264], ["li", "Limburgs", 12048], ["mai", "मैथिली", 11838], ["sah", "Саха тыла (Saxa Tyla)", 11413], ["sa", "संस्कृतम्", 11182], ["vec", "Vèneto", 10981], ["ilo", "Ilokano", 10848], ["os", "Иронау", 10528], ["mrj", "Кырык Мары (Kyryk Mary) ", 10265], ["hif", "Fiji Hindi", 9707], ["mhr", "Олык Марий (Olyk Marij)", 9688], ["bh", "भोजपुरी", 9270], ["eml", "Emiliàn e rumagnòl", 9072], ["diq", "Zazaki", 8685], ["pam", "Kapampangan", 8551], ["ps", "پښتو", 8389], ["sd", "سنڌي، سندھی ، सिन्ध", 8239], ["hak", "Hak-kâ-fa / 客家話", 8006], ["nso", "Sesotho sa Leboa", 7824], ["se", "Sámegiella", 7324], ["ace", "Bahsa Acèh", 7229], ["bcl", "Bikol", 7216], ["mi", "Māori", 7133], ["nah", "Nāhuatl", 7115], ["szl", "Ślůnski", 6401], ["gan", "贛語", 6395], ["vls", "West-Vlams", 6241], ["rue", "русиньскый язык", 6191], ["wuu", "吴语", 6060], ["bo", "བོད་སྐད", 5726], ["glk", "گیلکی", 5681], ["vep", "Vepsän", 5643], ["sc", "Sardu", 5527], ["frr", "Nordfriisk", 5466], ["co", "Corsu", 5458], ["crh", "Qırımtatarca", 5407], ["km", "ភាសាខ្មែរ", 5380], ["lrc", "لۊری شومالی", 5326], ["tk", "تركمن / Туркмен", 5267], ["kv", "Коми", 5254], ["csb", "Kaszëbsczi", 5209], ["so", "Soomaaliga", 4978], ["gv", "Gaelg", 4961], ["as", "অসমীয়া", 4804], ["lad", "Dzhudezmo", 4510], ["zea", "Zeêuws", 4381], ["ay", "Aymar", 4256], ["udm", "Удмурт кыл", 4122], ["myv", "Эрзянь (Erzjanj Kelj)", 3890], ["lez", "Лезги чІал", 3850], ["stq", "Seeltersk", 3792], ["kw", "Kernewek/Karnuack", 3792], ["ie", "Interlingue", 3700], ["nrm", "Nouormand/Normaund", 3627], ["nv", "Diné bizaad", 3569], ["pcd", "Picard", 3534], ["mwl", "Mirandés", 3469], ["rm", "Rumantsch", 3455], ["koi", "Перем Коми (Perem Komi)", 3453], ["gom", "गोंयची कोंकणी / Gõychi Konknni", 3380], ["ug", "ئۇيغۇر تىلى", 3367], ["lij", "Líguru", 3281], ["ab", "Аҧсуа", 3248], ["gn", "Avañe\'ẽ", 3217], ["mt", "Malti", 3213], ["fur", "Furlan", 3193], ["dsb", "Dolnoserbski", 3090], ["dv", "ދިވެހިބަސް", 3008], ["ang", "Englisc", 2944], ["ln", "Lingala", 2916], ["ext", "Estremeñu", 2910], ["kab", "Taqbaylit", 2894], ["sn", "chiShona", 2863], ["ksh", "Ripoarisch", 2836], ["lo", "ລາວ", 2758], ["gag", "Gagauz", 2757], ["frp", "Arpitan", 2629], ["pag", "Pangasinan", 2545], ["pi", "पाऴि", 2525], ["olo", "livvin kieli", 2348], ["av", "Авар", 2312], ["dty", "डोटेली", 2116], ["xal", "Хальмг", 2074], ["pfl", "Pfälzisch", 2069], ["krc", "Къарачай-Малкъар (Qarachay-Malqar)", 2020], ["haw", "Hawai`i", 2017], ["bxr", "Буряад", 2016], ["kaa", "Qaraqalpaqsha", 1892], ["pap", "Papiamentu", 1887], ["rw", "Ikinyarwanda", 1812], ["pdc", "Deitsch", 1799], ["bjn", "Bahasa Banjar", 1761], ["to", "faka Tonga", 1689], ["nov", "Novial", 1660], ["kl", "Kalaallisut", 1638], ["arc", "ܐܪܡܝܐ", 1622], ["jam", "Patois", 1615], ["kbd", "Адыгэбзэ (Adighabze)", 1573], ["ha", "هَوُسَ", 1526], ["tpi", "Tok Pisin", 1425], ["tyv", "тыва дыл", 1419], ["tet", "Tetun", 1418], ["ig", "Igbo", 1384], ["ki", "Gĩkũyũ", 1349], ["na", "dorerin Naoero", 1283], ["lbe", "Лакку", 1213], ["jbo", "Lojban", 1201], ["ty", "Reo Mā`ohi", 1191], ["mdf", "Мокшень (Mokshanj Kälj)", 1179], ["kg", "KiKongo", 1176], ["za", "Cuengh", 1167], ["wo", "Wolof", 1157], ["lg", "Luganda", 1154], ["bi", "Bislama", 1140], ["srn", "Sranantongo", 1059], ["zu", "isiZulu", 958], ["chr", "ᏣᎳᎩ", 883], ["tcy", "ತುಳು ಭಾಷೆ", 848], ["ltg", "Latgaļu", 801], ["sm", "Gagana Samoa", 785], ["om", "Oromoo", 728], ["xh", "isiXhosa", 714], ["tn", "Setswana", 639], ["pih", "Norfuk", 620], ["chy", "Tsetsêhestâhese", 610], ["rmy", "romani - रोमानी", 601], ["tw", "Twi", 595], ["cu", "Словѣньскъ", 588], ["kbp", "Kabɩyɛ", 573], ["tum", "chiTumbuka", 567], ["ts", "Xitsonga", 540], ["st", "Sesotho", 526], ["got", "𐌲𐌿𐍄𐌹𐍃𐌺", 507], ["rn", "Kirundi", 500], ["pnt", "Ποντιακά", 454], ["ss", "SiSwati", 432], ["fj", "Na Vosa Vakaviti", 430], ["bm", "Bamanankan", 429], ["ch", "Chamoru", 423], ["ady", "адыгабзэ", 403], ["iu", "ᐃᓄᒃᑎᑐᑦ", 399], ["mo", "Молдовеняскэ", 394], ["ny", "Chi-Chewa", 381], ["ee", "Eʋegbe", 338], ["ks", "कश्मीरी / كشميري", 316], ["ak", "Akana", 306], ["ik", "Iñupiak", 256], ["ve", "Tshivenda", 256], ["sg", "Sängö", 253], ["dz", "ཇོང་ཁ", 228], ["ff", "Fulfulde", 224], ["ti", "ትግርኛ", 162], ["cr", "Nehiyaw", 128], ["atj", "Atikamekw Nehiromowin", 89], ["din", "Thuɔŋjäŋ", 44], ["ng", "Oshiwambo", 8], ["cho", "Choctaw", 6], ["mh", "Ebon", 4], ["kj", "Kuanyama", 4], ["ii", "ꆇꉙ", 3], ["ho", "Hiri Motu", 3], ["aa", "Afar", 1], ["mus", "Muskogee", 1], ["hz", "Otsiherero", 0], ["kr", "Kanuri", 0]]')