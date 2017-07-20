
'use strict';

var bookmarkData;

var badgeType;

$(document).ready(function() {
	
	// register refreshTree listeners
	chrome.bookmarks.onCreated.addListener(refreshTree);
	chrome.bookmarks.onRemoved.addListener(refreshTree);
	chrome.bookmarks.onChanged.addListener(refreshTree);
	//chrome.bookmarks.onMoved.addListener(refreshTree);
	//chrome.bookmarks.onChildrenReordered.addListener(refreshTree);
	chrome.bookmarks.onImportEnded.addListener(refreshTree);
	refreshTree();
	
	chrome.tabs.onUpdated.addListener(updateBadgeText);
	
	chrome.storage.onChanged.addListener(updateBadgeTextType);
	updateBadgeTextType();
	
	chrome.tabs.onActivated.addListener(function(activeInfo) {
		chrome.tabs.get(activeInfo.tabId, function(tab){
			updateBadgeText(undefined, undefined, tab);
		});
	}); 
});

function refreshTree() {
	chrome.bookmarks.search({}, function(results) {
		//handleRuntimeError();
		bookmarkData = results;
		
		chrome.tabs.query({
			active: true, 
			currentWindow: true
		}, function(tabs) {
			updateBadgeText(undefined, undefined, tabs[0]);
		});
	});
}

function updateBadgeText(tabId, changeInfo, tab) {
	
	console.log("updateBadgeText");
	
	var results = bookmarkData;
	
	// how many pages are bookmarked with the current domain?
	if(badgeType == "domain") {
		
		var reg = /:\/\/[^/]*/;
		var url = reg.exec(tab.url)[0];
	
		var count = 0;
		
		for (var i = 0; i < results.length; i++) {
			if(results[i].url == undefined) continue;
			if(results[i].url.includes(url)) count++;
		}
		
		setBadgeText(count);
		
	// how many pages are bookmarked entirely?
	} else if(badgeType == "total") {
		
		var count = 0;
		
		for (var i = 0; i < results.length; i++) {
			if(results[i].url == undefined) continue;
			count++;
		}
		
		setBadgeText(count);
		
	// how many pages are bookmarked today?
	} else if(badgeType == "today") {
		
		var startTime = new Date().setHours(0,0,0,0);
		var endTime = new Date().setHours(24,0,0,0);
	
		var count = 0;
		
		for (var i = 0; i < results.length; i++) {
			if(results[i].url == undefined) continue;
			if(results[i].dateAdded < startTime) continue;
			if(results[i].dateAdded > endTime) continue;
			count++;
		}
		
		setBadgeText(count);
		
	// none
	} else {
		setBadgeText("");
	}
	
	
}

function updateBadgeTextType() {
	
	console.log("updateBadgeTextType");
	
	chrome.storage.sync.get({
		badge: "domain",
	}, function(items) {
		badgeType = items.badge;
	});
	
	chrome.tabs.query({
		active: true, 
		currentWindow: true,
	}, function(tabs) {
		updateBadgeText(undefined, undefined, tabs[0]);
	});
	
}

function setBadgeText(count) {
	if(count > 999) {
		count = parseInt(count / 1000) + "k";
	}
	if(count > 999999) {
		count = parseInt(count / 1000000) + "m";
	}
	chrome.browserAction.setBadgeText({text: count.toString()});
}