var current=0;function keyPressedEvt(){var a=window.event;a.keyCode?x=a.keyCode:a.which&&(x=a.which);13==x&&eval()}function eval(){parser(document.getElementById("input_box").value)}Array.prototype.contains=function(a){for(var g=0;g<this.length;g++)if(this[g]==a)return!0;return!1};function trace(a){document.getElementById("results").innerHTML+="<p>"+a+"</p>"}function getLogicBit(a,g){return 0!=(a&1<<g)}function variableIndex(a,g){for(var b=0;b<a.length;b++)if(a[b]==g)return b;return-1} function isValid(a){return"!"==a||("+"==a||"^"==a||"("==a||")"==a)||"a"<=a&&"z">=a||"A"<=a&&"Z">=a?!0:!1} function parser(a){var g=document.getElementById("results");a=a.replace(/\s+/g,"");for(var b=0;b<a.length;b++)if(!isValid(a.charAt(b))){g.innerHTML="ERROR!\n ilegal character found at position "+b+"["+a.charAt(b)+"] !";return}for(var d=[],b=0;b<a.length;b++){var c=a.charAt(b);"!"!=c&&("+"!=c&&"("!=c&&")"!=c&&"^"!=c)&&(d.contains(c)||d.push(c))}d.sort();for(var f=Math.pow(2,d.length),j=Array(f),k=Array(f),h=0,b=0;b<f;b++){j[b]=Array(d.length);k[b]=!1;for(var e=0;e<d.length;e++)j[b][e]=getLogicBit(h, d.length-e-1);h++}e=!1;h=!0;for(b=0;b<f;b++){current=0;e=!1;for(h=!0;;)if(c=a.charAt(current),"!"==c?e=!e:"+"==c?(h|=evaluate(a,j[b],d),e&&(h=!h,e=!1)):"^"==c?(c=evaluate(a,j[b],d),e&&(c=!c,e=!1),h=!h&&c||h&&!c):(h="("==c?h&(e?!evaluate(a,j[b],d):evaluate(a,j[b],d)):h&(e?!j[b][variableIndex(d,c)]:j[b][variableIndex(d,c)]),e&&(e=!1)),current++,current>=a.length){k[b]|=h;break}}a="<table><tr>";for(b=0;b<d.length;b++)a+="<th>"+d[b]+"</th>";a+="<th>&#402;</th></tr>";for(b=0;b<f;b++){a+='<tr class="'+ (0==b%2?"lineA":"lineB")+'">';for(e=0;e<d.length;e++)a+="<td>"+(!0==j[b][e]?1:0)+"</td>";a+='<td class="result">'+k[b]+"</td></tr>"}g.innerHTML=a+"</table>"} function evaluate(a,g,b){for(var d=!0,c=!1;;){current++;if(current>=a.length)break;var f=a.charAt(current);if("!"==f)c=!c;else if("+"==f)d|=evaluate(a,g,b),c&&(d=!d,c=!1);else if("^"==f)f=evaluate(a,g,b),c&&(f=!f,c=!1),d=!d&&f||d&&!f;else if("("==f)d&=c?!evaluate(a,g,b):evaluate(a,g,b),c&&(c=!1);else if(")"==f)break;else d&=c?!g[variableIndex(b,f)]:g[variableIndex(b,f)],c&&(c=!1)}return d};