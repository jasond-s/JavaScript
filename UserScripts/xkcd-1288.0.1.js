// ==UserScript==
 
// @name          Implements the XKCD comic #1288
 
// @namespace     http://www.poweruprecord.co.uk
 
// @description   Make the internet more interesting. Version 0.1.
 
// @include       *
 
// ==/UserScript==
 
var n, walk=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT,null,false);

while(n=walk.nextNode()) {
	n.textContent = n.textContent.replace(/witnesses/ig, 'these dudes I know');
	n.textContent = n.textContent.replace(/witness/ig, 'this dude I know');
	n.textContent = n.textContent.replace(/allegedly/ig, "kinda probably");
	n.textContent = n.textContent.replace(/new study/ig, 'tumblr post');
	n.textContent = n.textContent.replace(/rebuild/ig, "avenge");
	n.textContent = n.textContent.replace(/space/ig, 'spaaaaace');
	n.textContent = n.textContent.replace(/google glass/ig, "vitual boy");
	n.textContent = n.textContent.replace(/smartphones|smart phone/ig, "pokedex");
	n.textContent = n.textContent.replace(/electric|elecrical/ig, "atomic");
	n.textContent = n.textContent.replace(/senator|mp|councellor|mep/ig, "elf lord");
	n.textContent = n.textContent.replace(/car/ig, "cat");
	n.textContent = n.textContent.replace(/electionn/ig, "eating contest");
	n.textContent = n.textContent.replace(/congressional leaders/ig, "river spirits");
	n.textContent = n.textContent.replace(/homeland security/ig, "homestar runner");
	n.textContent = n.textContent.replace(/could not be reached for comment/ig, "is guilty and everyone knows it");	
}