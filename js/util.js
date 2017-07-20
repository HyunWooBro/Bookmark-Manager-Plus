//
// by Kim Hyun-Woo
// 2017-06-22
//

'use strict';

if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}

if (!Array.prototype.insert) {
	Array.prototype.insert = function ( index, item ) {
		this.splice( index, 0, item );
	};
}


if (!Array.prototype.remove) {
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
}

if (!Array.prototype.findLast) {
	Array.prototype.findLast = function ( callback ) {
		for (var i = this.length - 1; i>-1; i--) {
			if(callback(this[i])) return this[i];
		}
	};
}

if (!Array.prototype.findLastIndex) {
	Array.prototype.findLastIndex = function ( callback ) {
		for (var i = this.length - 1; i>-1; i--) {
			if(callback(this[i])) return i;
		}
		return -1;
	};
}

if (!Array.prototype.equals) {
	Array.prototype.equals = function (array) {
		// if the other array is a falsy value, return
		if (!array)
			return false;

		// compare lengths - can save a lot of time 
		if (this.length != array.length)
			return false;

		for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
				// recurse into the nested arrays
				if (!this[i].equals(array[i]))
					return false;       
			}           
			else if (this[i] != array[i]) { 
				// Warning - two different object instances will never be equal: {x:20} != {x:20}
				return false;   
			}           
		}       
		return true;
	}
}

if(!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};
}

function escapeHtml(original) {
	return original
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

//////////////////////////////////////////////////////////
// Managers
//////////////////////////////////////////////////

var WindowManager = {
	create: function(createData, callback) {
		chrome.windows.create(createData, function(window) {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback(window);
			}
		});
	},
};

var TabManager = {
	create: function(createProperties, callback) {
		chrome.tabs.create(createProperties, function(tab) {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback(tab);
			}
		});
	},
	update: function(updateProperties, callback) {
		chrome.tabs.update(updateProperties, function(tab) {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback(tab);
			}
		});
	},
	query: function(queryInfo, callback) {
		chrome.tabs.query(queryInfo, function(tabs) {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback(tabs);
			}
		});
	},
};

var StorageManager = {
	get: function(keys, callback) {
		if($.isFunction(keys)) {
			callback = keys;
			keys = undefined;
		}
		chrome.storage.sync.get(keys, function(items) {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback(items);
			}
		});
	},
	set: function(items, callback) {
		chrome.storage.sync.set(items, function() {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback();
			}
		});
	},
	remove: function(items, callback) {
		chrome.storage.sync.remove(items, function() {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback();
			}
		});
	},
};

// faster and synchronized way of retriving bookmarks
var BookmarkManager = {
	
	get: function(id) {
		return [iterator(bmp.bookmarkTree)];
		function iterator(tree) {
			var index = tree.length;
			while (index--) {
				if(tree[index].id == id) {
					var item = $.extend({}, tree[index]);
					delete item.children;
					return item;
				} 
				if (tree[index].children) {
					var result = iterator(tree[index].children);
					if(result) return result;
				}
			}
		}
	},
	getChildren: function(id) {
		return iterator(bmp.bookmarkTree);
		function iterator(tree) {
			var index = tree.length;
			while (index--) {
				if (tree[index].children) {
					if(tree[index].id == id) {
						var children = [];
						var length = tree[index].children.length;
						for (var i = 0; i < length; i++) {
							var item = $.extend({}, tree[index].children[i]);
							delete item.children;
							children.push(item);
						}
						return children;
					} else {
						var result = iterator(tree[index].children);
						if(result) return result;
					}
				}
			}
		}
	},
	getTree: function() {
		return bmp.bookmarkTree;
	},
	// having an item for id on top
	getSubTree: function(id) {
		return [iterator(bmp.bookmarkTree)];
		function iterator(tree) {
			var index = tree.length;
			while (index--) {
				if (tree[index].children) {
					if(tree[index].id == id) {
						return tree[index];
					} else {
						var result = iterator(tree[index].children);
						if(result) return result;
					}
				}
			}
		}
	},
	getSubTreeCounts: function(tree) {
		var folderCount = 0;
		var pageCount = 0;
		
		iterator(tree[0].children);
		function iterator(tree) {
			var index = tree.length;
			while (index--) {
				// page
				if (tree[index].children == undefined) {
					pageCount++;
					
				// folder
				} else {
					folderCount++;
					iterator(tree[index].children);
				}
			}
		}
		
		return [folderCount, pageCount];
	},
	getTreeCounts: function() {
		var bookmarksCounts = this.getSubTreeCounts([bmp.bookmarkTree[0].children[0]]);
		var otherBookmarksCounts = this.getSubTreeCounts([bmp.bookmarkTree[0].children[1]]);
		return [bookmarksCounts[0] + otherBookmarksCounts[0], bookmarksCounts[1] + otherBookmarksCounts[1]];
	},
};

//////////////////////////////////////////////////////////
// refresh
//////////////////////////////////////////////////

function refreshTree(callback) {
	//console.warn("refreshTree() 1");
	if(!bmp.refreshTreeEnabled) return;
	//console.warn("refreshTree() 2");
	
	//console.time("getTree");
	chrome.bookmarks.getTree(function(tree) {
		
		handleRuntimeError();
		bmp.bookmarkTree = tree;
		bmp.isHierarchyInvalidated = true;
		
		// chrome.bookmarks.search("...", ...) 의 문제점은 특수문자 검색 불가 및 ""를 입력할 수 없다는 것.
		// 장점은 여러 단어를 모두 포함하는 결과를 찾아준다는 것.
		// 결론은 "..." 대신에 {}를 사용하고 필요한 기능은 직접 구현해야 한다는 것.
		// 어째든 search는 가장 느린 API이기 때문에 다음의 코드를 대신 사용한다.
		
		var results = [];
		
		iterator(tree[0].children[0].children);	// bookmarks
		iterator(tree[0].children[1].children);	// otherBookmarks
		function iterator(tree) {
			var length = tree.length;
			for (var i = 0; i < length; i++) {
				if (tree[i].children) {
					var item = $.extend({}, tree[i]);
					delete item.children;
					results.push(item);
					iterator(tree[i].children);
				} else {
					results.push(tree[i]);
				}
			}
		}
		
		bmp.bookmarkData = results;
		
		refreshAll();
		
		
		// sometimes callback is not a function when invoked by system.
		// callback is handled before queue events.
		if($.isFunction(callback)) {
			callback();
		}
		
		// finally, handle queue events.
		var length = bmp.refreshTreeQueueEvents.length;
		for (var i = 0; i < length; i++) {
			var event = bmp.refreshTreeQueueEvents[i];
			if($.isFunction(event)) {
				event();
			}
		}
		bmp.refreshTreeQueueEvents = [];
		
		//console.timeEnd("getTree");
	});
}

function refreshAll() {
	//console.debug("refreshAll");
	if(!bmp.initialized) return;
	
	if($body.hasClass('extend')) {
		refresh({
			targetFrame: '#right-frame',
			autoScroll: true,
		});
		refresh({
			targetFrame: '#left-frame',
			autoScroll: true,
		});
	} else {
		refresh({
			autoScroll: true,
		});
	}
}

function refresh(parameter) {
	
	if(parameter == undefined) {
		var autoScroll = false;
		var targetFrame = bmp.currFrame;
	} else {
		var autoScroll = parameter.autoScroll;
		var targetFrame = parameter.targetFrame;
		
		if(autoScroll == undefined) {
			autoScroll = false;
		}
		if(targetFrame == undefined) {
			targetFrame = bmp.currFrame;
		}
	}
	
	if(autoScroll) {
		var scrollY = $(targetFrame).find('#result-panel').scrollTop();
	}
	
	if(targetFrame == '#right-frame') {
		if(bmp.isSearching) {
			search();
		} else {
			explore({
				id: bmp.exploreHierarchy.right.id, 
				hierarchy: bmp.exploreHierarchy.right.hierarchy, 
				targetFrame: '#right-frame',
			});
		}
	} else {
		if(bmp.isViewAppended) {
			explore({
				id: bmp.exploreHierarchy.left.id, 
				hierarchy: bmp.exploreHierarchy.left.hierarchy, 
				targetFrame: '#left-frame',
			});
		}
	}

	if(autoScroll) {
		$(targetFrame).find('#result-panel').scrollTop(scrollY);
	}
}

//////////////////////////////////////////////////////////
// frame related
//////////////////////////////////////////////////

function selectFromBothFrame(selector) {
	return $('#left-frame ' + selector + ', #right-frame ' + selector);
}

function selectFromCurrFrame(selector) {
	return $(bmp.currFrame).find(selector);
}

function getParentFrame(selector) {
	if(selector instanceof jQuery) {
		return "#" + selector.closest('.frame').attr('id');
	} else {
		return "#" + $(selector).closest('.frame').attr('id');
	}
}

// get currFrame by considering its position. When sorting, it's often difficult 
// to say on which frame the mouse is actually sorting.
function getCurrFrame(event, center) {
	if($body.hasClass('extend')) {
		
		if(center) {
			var centerX = $('#separator').offset().left + $('#separator').outerWidth()/2;
			if(centerX < event.clientX) {
				return '#right-frame';
			} else {
				return '#left-frame';
			}
		} else {
			var y = $leftFrame.offset().top;
			var x = $leftFrame.offset().left;
			var width = $leftFrame.width();
			var height = $leftFrame.height();
			
			if(event.clientX > x && event.clientX < x + width + 4 && event.clientY > y && event.clientY < y + height) {
				return '#left-frame';
			}
			
			var y = $rightFrame.offset().top;
			var x = $rightFrame.offset().left;
			var width = $rightFrame.width();
			var height = $rightFrame.height();
			
			if(event.clientX > x - 4 && event.clientX < x + width && event.clientY > y && event.clientY < y + height) {
				return '#right-frame';
			}
		}
		
	} else {
		return '#right-frame';
	}
}

//////////////////////////////////////////////////////////
// contextmenu & action toolset
//////////////////////////////////////////////////

function removeContextData() {
	$document.removeData('id');
	$document.removeData('parentId');
	$document.removeData('title');
	$document.removeData('url');
	$document.removeData('index');
	$document.removeData('folder');
	
	$document.removeData('parentIds');
	$document.removeData('ids');
	$document.removeData('titles');
	$document.removeData('urls');
	$document.removeData('indices');
	
	$document.removeData('subUrls');
	
	$document.removeData('group');
}

function setContextData(simple) {
	
	$document.data('parentId', $(this).data('parentId'));
	$document.data('id', $(this).data('id'));
	$document.data('title', $(this).data('title'));
	$document.data('url', $(this).data('url'));
	$document.data('index', $(this).data('index'));
	$document.data('folder', $(this).data('url') == undefined);
	
	if(simple) return;
	
	var parentIds = [];
	var ids = [];
	var titles = [];
	var urls = [];
	var indices = [];
	
	var $selected = getSelectedItems();
	if($selected.length) {
		var length = $selected.length;
		for(var i = 0; i < length; i++) {
			parentIds.push($selected.eq(i).data('parentId'));
			ids.push($selected.eq(i).data('id'));
			titles.push($selected.eq(i).data('title'));
			urls.push($selected.eq(i).data('url'));
			indices.push($selected.eq(i).data('index'));
		}
	} else {
		parentIds.push($(this).data('parentId'));
		ids.push($(this).data('id'));
		titles.push($(this).data('title'));
		urls.push($(this).data('url'));
		indices.push($(this).data('index'));
	}
	
	$document.data('parentIds', parentIds);
	$document.data('ids', ids);
	$document.data('titles', titles);
	$document.data('urls', urls);
	$document.data('indices', indices);
	
	if($(this).data('url') == undefined) {
	
		var subUrls = [];
		
		var results = BookmarkManager.getChildren($(this).data('id'));
		var length = results.length;
		for (var i = 0; i < length; i++) {
			if(results[i].url == undefined) continue;
			
			subUrls.push(results[i].url);
		}
		
		$document.data('subUrls', subUrls);
	}
}

function addFolder(targetFrame) {
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	var $resultItemEditor = $('#result-item-editor');

	$resultItemEditor.find('h3').text("Add folder");
	$('#editor-icon').removeClass().addClass('fa fa-basic fa-folder');
	
	$resultItemEditor.find('input').eq(0).prop('disabled', false).val("New folder");
	$resultItemEditor.find('input').eq(1).prop('disabled', true).val("");
	
	$resultItemEditor.find('.button-ok').off('click');
	$resultItemEditor.find('.button-ok').on('click', function() {
		
		var parentId = $document.data('parentId');
		var id = $document.data('id');
		var index = $document.data('index')? $document.data('index') : undefined;
		
		var title = $resultItemEditor.find('input').eq(0).val();
		var url = undefined;
		
		var folder = $document.data('folder');
		
		// into folder
		if(folder) {
			add({
				parentId: id, 
				title: title, 
				url: url, 
				callback: function() {
					var results = BookmarkManager.get(id);
					queueSelectedClass({
						item: results[0],
						targetFrame: targetFrame,
					});
				},
			});
			
		// into list
		} else {
			add({
				parentId: parentId, 
				title: title, 
				url: url, 
				index: index,
				callback: function(result) {
					queueSelectedClass({
						item: result,
						targetFrame: targetFrame,
					});
				},
			});
		}
	
		closeEditor();
		endCover();
		leaveMouse();
	});
	
	$resultItemEditor.find('.button-cancel').off('click');
	$resultItemEditor.find('.button-cancel').off('click').on('click', function() {
		closeEditor();
	});
	
	$resultItemEditor.show();
	$resultItemEditor.find('input').eq(0).focus();
}

function addPage(targetFrame) {
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	TabManager.query({
		active: true, 
		currentWindow: true,
	}, function(tabs) {
		
		var $resultItemEditor = $('#result-item-editor');
		
		$resultItemEditor.find('h3').text("Add page");
		$('#editor-icon').removeClass().addClass('fa fa-basic fa-file');
		
		$resultItemEditor.find('input').eq(0).prop('disabled', false).val(tabs[0].title);
		$resultItemEditor.find('input').eq(1).prop('disabled', false).val(tabs[0].url);
		
		$resultItemEditor.find('.button-ok').off('click');
		$resultItemEditor.find('.button-ok').on('click', function() {
			
			var parentId = $document.data('parentId');
			var id = $document.data('id');
			var index = $document.data('index')? $document.data('index') : undefined;
			
			var title = $resultItemEditor.find('input').eq(0).val();
			var url = $resultItemEditor.find('input').eq(1).val();
			
			var folder = $document.data('folder');
			
			// into folder
			if(folder) {
				add({
					parentId: id, 
					title: title, 
					url: url, 
					callback: function() {
						var results = BookmarkManager.get(id);
						queueSelectedClass({
							item: results[0],
							targetFrame: targetFrame,
						});
					},
				});
				
			// into list
			} else {
				add({
					parentId: parentId, 
					title: title, 
					url: url, 
					index: index,
					callback: function(result) {
						queueSelectedClass({
							item: result,
							targetFrame: targetFrame,
						});
					},
				});
			}
		
			closeEditor();
			endCover();
			leaveMouse();
		});
		
		$resultItemEditor.find('.button-cancel').off('click');
		$resultItemEditor.find('.button-cancel').on('click', function() {
			closeEditor();
		});
		
		$resultItemEditor.show();
		$resultItemEditor.find('input').eq(0).focus();
	});
}

function pasteCopy(parameter) {
	
	var parentId = parameter.parentId;
	var id = parameter.id;
	var title = parameter.title;
	var url = parameter.url;
	var index = parameter.index;
	var callback = parameter.callback;
	
	// folder
	if(url == undefined) {
			
		add({
			parentId: parentId, 
			title: title,
			index: index,
			callback: function(result) {
				
				var tree = BookmarkManager.getSubTree(id);
		
				var counts = BookmarkManager.getSubTreeCounts(tree);
				var totalCount = counts[0] + counts[1];
				var currCount = 0;

				iterator(tree[0].children, result.id);
				function iterator(tree, parentId) {
					var length = tree.length;
					for (var i = 0; i < length; i++) {
						// page
						if (tree[i].children == undefined) {
							add({
								parentId: parentId, 
								title: tree[i].title,
								url: tree[i].url,
								callback: function() {
									currCount++;
									if(totalCount == currCount) {
										if($.isFunction(callback)) {
											callback(result);
										}
									}
								},
							});
							
						// folder
						} else {
							
							const children = tree[i].children;
							
							add({
								parentId: parentId, 
								title: tree[i].title,
								callback: function(r) {
									iterator(children, r.id);
									currCount++;
									if(totalCount == currCount) {
										if($.isFunction(callback)) {
											callback(result);
										}
									}
								},
							});
							
						}
					}
					
					if(totalCount == currCount) {
						if($.isFunction(callback)) {
							callback(result);
						}
					}
					
				}
				
			},
		});
		
	// page
	} else {
		add({
			parentId: parentId, 
			title: title,
			url: url,
			index: index,
			callback: function(result) {
				if($.isFunction(callback)) {
					callback(result);
				}
			},
		});
	}
}

function pasteCut(parameter) {
	
	var parentId = parameter.parentId;
	var id = parameter.id;
	var index = parameter.index;
	var callback = parameter.callback;
	
	move({
		parentId: parentId,
		id: id,
		index: index,
		callback: callback,
	});
}

function showEditor(id, callback) {
	bmp.preventsMouseLeave = true;
		
	var results = BookmarkManager.get(id);
	
	var $resultItemEditor = $('#result-item-editor');
	
	$resultItemEditor.find('h3').text("Edit");
	$('#editor-icon').removeClass().addClass('fa fa-basic fa-edit');
	
	$('#result-item-editor input').eq(0).val(results[0].title);
	
	if(results[0].url == undefined) {
		$resultItemEditor.find('input').eq(1).prop('disabled', true);
		$resultItemEditor.find('input').eq(1).val("");
	} else {
		$resultItemEditor.find('input').eq(1).prop('disabled', false);
		$resultItemEditor.find('input').eq(1).val(results[0].url);
	}
	
	$resultItemEditor.find('.button-ok').off('click');
	$resultItemEditor.find('.button-ok').on('click', function() {
		
		var title = $resultItemEditor.find('input').eq(0).val();
		var url = $resultItemEditor.find('input').eq(1).val();
		
		chrome.bookmarks.update(id, {title:title, url:url}, function() {
			handleRuntimeError();
			if($.isFunction(callback)) {
				callback();
			}
		});
		
		closeEditor();
	});
	
	$resultItemEditor.find('.button-cancel').off('click');
	$resultItemEditor.find('.button-cancel').on('click', function() {
		closeEditor();
	});
	
	$resultItemEditor.show();
	$resultItemEditor.find('input').eq(0).focus();
}

function closeEditor() {
	$('#result-item-editor').hide();
	endCover();
	bmp.preventsMouseLeave = false;
	leaveMouse();
}

function showFolderInfo(id, title) {
		
	var tree = BookmarkManager.getSubTree(id);
	
	var $window = $('#info-window');
	
	$window.find('h3').text("Folder info");
	$window.find('#info-icon').addClass('fa fa-basic fa-info-circle');
	
	$window.find('#info-title').text(title);
	
	var counts = BookmarkManager.getSubTreeCounts(tree);
	
	$window.find('#info-folder-count span:first').text("# of sub folders");
	$window.find('#info-folder-count span:last').text(counts[0]);
	
	$window.find('#info-page-count span:first').text("# of sub pages");
	$window.find('#info-page-count span:last').text(counts[1]);
	
	$window.find('#info-folder-date1 span:first').text("Created date");
	var dateAdded = new Date(tree[0].dateAdded);
	$window.find('#info-folder-date1 span:last').text(dateAdded.toLocaleDateString() + " " + dateAdded.toLocaleTimeString());
	
	$window.find('#info-folder-date2 span:first').text("Modified date");
	var dateGroupModified = new Date(tree[0].dateGroupModified);
	$window.find('#info-folder-date2 span:last').text(dateGroupModified.toLocaleDateString() + " " + dateGroupModified.toLocaleTimeString());
	
	$window.find('.button-ok').off('click');
	$window.find('.button-ok').on('click', function() {
		closeInfo();
	});
	
	$window.show();
}

function closeInfo() {
	$('#info-window').hide();
	endCover();
	bmp.preventsMouseLeave = false;
	leaveMouse();
}

function showBookmarkInfo() {
	
	var $window = $('#info-window');
	
	$window.find('h3').text("Bookmark info");
	$window.find('#info-icon').addClass('fa fa-basic fa-info-circle');
	
	$window.find('#info-title').text("");
	
	var counts = BookmarkManager.getTreeCounts();
	
	$window.find('#info-folder-count span:first').text("# of total folders");
	$window.find('#info-folder-count span:last').text(counts[0]);
	
	$window.find('#info-page-count span:first').text("# of total pages");
	$window.find('#info-page-count span:last').text(counts[1]);
	
	
	var results = bmp.bookmarkData;
	
	var minDate = Number.MAX_SAFE_INTEGER;
	var maxDate = 0;
	
	var length = results.length;
	for (var i = 0; i < length; i++) {
		if(maxDate < results[i].dateAdded) {
			maxDate = results[i].dateAdded;
		}
		if(minDate > results[i].dateAdded) {
			minDate = results[i].dateAdded;
		}
	}
	
	
	$window.find('#info-folder-date1 span:first').text("Inital created date");
	var initalDateAdded = new Date(minDate);
	$window.find('#info-folder-date1 span:last').text(initalDateAdded.toLocaleDateString() + " " + initalDateAdded.toLocaleTimeString());
	
	$window.find('#info-folder-date2 span:first').text("Last created date");
	var lastDateAdded = new Date(maxDate);
	$window.find('#info-folder-date2 span:last').text(lastDateAdded.toLocaleDateString() + " " + lastDateAdded.toLocaleTimeString());
	
	$window.find('.button-ok').off('click');
	$window.find('.button-ok').on('click', function() {
		closeInfo();
	});
	
	$window.show();
}

function showAbout() {
		
	var $window = $('#about-window');
	
	$window.find('h3').text("About Bookmark Manager Plus");
	$window.find('#about-icon').addClass('fa fa-basic fa-question-circle');
	
	$window.find('#about-title').text("");
	
	$window.find('#about-developer span:last').text(str_developer);
	
	$window.find('#about-version span:last').text(str_version);
	
	
	$window.find('.button-ok').off('click');
	$window.find('.button-ok').on('click', function() {
		closeAbout();
	});
	
	$window.show();
}

function closeAbout() {
	$('#about-window').hide();
	endCover();
}

function showPreference() {
	chrome.runtime.openOptionsPage(function() {
		handleRuntimeError();
	});
}

function buildOptionMenu(items) {
	
	$optionMenu.find('li').hide();
	$optionMenu.find('hr').remove();
	$optionMenu.find('li').removeClass('menu-item-disabled');
	
	var length = items.length;
	for (var i = 0; i < length; i++) {
		if(items[i] == "-") {
			$optionMenu.find('ul').append('<hr>');
		} else {
			var $item = $("#" + items[i]).detach();
			$item.show();
			$optionMenu.find('ul').append($item);
		}
	}
}

function updateOptionMenuPosition(e) {
	var offsetX = e.clientX;
	
	var width = getPopupWidth();
	if(width < offsetX + $optionMenu.outerWidth()) {
		var x = offsetX + $optionMenu.outerWidth() - width;
		x = offsetX - x;
		$optionMenu.css('left', x);  
	} else {
		$optionMenu.css('left', e.clientX + 1/*margin*/);  
	}
	
	var offsetY = $rightFrame.find('#header-panel').outerHeight(true) + getBodyVerticalMargin()/2;
	$optionMenu.css('top', offsetY);
}

function startOptionMenu() {
	$optionMenu.show();
	bmp.isMenuBroughtUp = true;
	startCover();
}

function endOptionMenu() {
	$optionMenu.hide();
	bmp.isMenuBroughtUp = false;
	endCover();
}

function buildContextMenu(items) {
	
	$contextMenu.find('li').removeClass('menu-item-disabled').hide();
	$contextMenu.find('hr').remove();
	
	var length = items.length;
	for (var i = 0; i < length; i++) {
		if(items[i] == "-") {
			$contextMenu.find('ul').append('<hr>');
		} else {
			var $item = $("#" + items[i]).detach();
			$item.show();
			$contextMenu.find('ul').append($item);
			
			// Disable paste if clipboard is empty
			if($item.attr('id') == 'paste') {
				if(!$document.data('clipboard')) {
					$item.addClass('menu-item-disabled');
				}
			}
		}
	}
}

function updateContextMenuPosition(e) {
	var offsetX = e.clientX;
	var offsetY = e.clientY;
	
	var width = getPopupWidth(true);
	if(width < offsetX + $contextMenu.outerWidth(true)) {
		var x = offsetX + $contextMenu.outerWidth(true) - width;
		x = offsetX - x;
		x -= getBodyHorizontalMargin();
		$contextMenu.css('left', x);  
	} else {
		$contextMenu.css('left', e.clientX + 1/*margin*/);  
	}
	
	var height = getPopupHeight(true);
	if(height < offsetY + $contextMenu.outerHeight(true)) {
		var y = offsetY + $contextMenu.outerHeight(true) - height;
		y = offsetY - y;
		y -= getBodyVerticalMargin() + selectFromCurrFrame('#footer-panel').outerHeight(true);
		$contextMenu.css('top', y);
	} else {
		$contextMenu.css('top', e.clientY + 1/*margin*/);
	}
}

function startCover() {
	$('#modal-cover').show();
}

function endCover() {
	$('#modal-cover').hide();
}

function startContextMenu() {
	bmp.preventsMouseLeave = true;
	$contextMenu.show();
	bmp.isMenuBroughtUp = true;
	startCover();
}

function leaveMouse() {
	$('#result-list .group').trigger('mouseleave');
	$('#result-list li a').trigger('mouseleave');
	$('#result-list li:not(.group)').trigger('mouseleave');
}

function endContextMenu(isMouseLeave) {
	bmp.isMenuBroughtUp = false;
	$contextMenu.hide();
	endCover();
	if(isMouseLeave) {
		bmp.preventsMouseLeave = false;
		leaveMouse();
	}
}

//////////////////////////////////////////////////////////
// bookmark hierarchy modification
//////////////////////////////////////////////////

function add(parameter) {
	
	var parentId = parameter.parentId;
	var title = parameter.title;
	var url = parameter.url;
	var index = parameter.index;
	var callback = parameter.callback;
	
	if(index != undefined) {
		index++;
	}
	
	chrome.bookmarks.create({
		parentId: parentId,
		title: title,
		url: url,
		index: index,
	}, function(result) {
		handleRuntimeError();
		validateExploreData({
			moved: true,
		});
		if($.isFunction(callback)) {
			callback(result);
		}
	});
}

function remove(parameter) {
	
	var id = parameter.id;
	var url = parameter.url;
	var callback = parameter.callback;
	
	// prevents from removing an item in use
	if(bmp.exploreHierarchy.left.id == id || 
		bmp.exploreHierarchy.right.id == id ||
		isDescendantOf(bmp.exploreHierarchy.left.id, id) ||
		isDescendantOf(bmp.exploreHierarchy.right.id, id)) {
		// alert for error
		alertify.error(str_alertify_error_not_removable, 3000);
		if($.isFunction(callback)) {
			callback();
		}
		return;
	}
	
	// folder
	if(url == undefined) {
		var results = BookmarkManager.getChildren(id);
		
		if(results.length > 0) {
			// delete a folder with its children
			chrome.bookmarks.removeTree(id, function() {
				handleRuntimeError();
				if($.isFunction(callback)) {
					callback();
				}
			});
			return;
		}
	}
	
	// delete a page or empty folder
	chrome.bookmarks.remove(id, function() {
		handleRuntimeError();
		if($.isFunction(callback)) {
			callback();
		}
	});
}

function move(parameter) {
	
	var parentId = parameter.parentId;
	var id = parameter.id;
	var index = parameter.index;
	var callback = parameter.callback;
	
	chrome.bookmarks.move(id, {
		parentId: parentId,
		index: index,
	}, function(result) {
		handleRuntimeError();
		if($.isFunction(callback)) {
			callback(result);
		}
	});
}


//////////////////////////////////////////////////////////
// size
//////////////////////////////////////////////////

function getBodyHorizontalMargin() {
	return $body.outerWidth(true) - $body.outerWidth();
}

function getBodyVerticalMargin() {
	return $body.outerHeight(true) - $body.outerHeight();
}

function getPopupWidth(margin) {
	if(margin == undefined) {
		margin = false;
	}
	return $body.outerWidth(margin);
}

function getPopupHeight(margin) {
	if(margin == undefined) {
		margin = false;
	}
	return $body.outerHeight(margin);
}

function getFrameWidth(targetFrame) {
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	return $(targetFrame).outerWidth();
}

function getFrameHeight() {
	return getPopupHeight();
}

function updateExploreHierarchyMaxWidth(targetFrame) {
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	var $targetFrame = $(targetFrame);
	var maxWidth = getFrameWidth(targetFrame) - $targetFrame.find('.explore-arrow').outerWidth();
	$targetFrame.find('.explore-hierarchy').css('max-width', maxWidth);
}

function updateResultPanelHeight(targetFrame) {
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	var $targetFrame = $(targetFrame);
	var height = $targetFrame.find('#header-panel').outerHeight() 
			+ $targetFrame.find('#explore-panel').outerHeight() 
			+ $targetFrame.find('#footer-panel').outerHeight() 
			+ getBodyVerticalMargin();
			
	height = MAX_POPUP_HEIGHT - height;
	$targetFrame.find('#result-panel').css('height', height);
}

function updateGroupMaxWidth(targetFrame) {
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	var $targetFrame = $(targetFrame);
	var maxWidth = $targetFrame.find('.group').outerWidth() - $('.group-view').outerWidth()
	var $ul = $targetFrame.find('#result-list');
	var $li = $ul.find('.group');
	
	var length = $li.length;
	for (var i = 0; i < length; i++) {
		$li.eq(i).find('> span').css('max-width', maxWidth);
	}
}

function updateSearchEditorWidth() {
	
	if($('.search-extend-trigger').find('span').hasClass('fa-minus')) {
		if($body.hasClass('extend')) {
			$searchEditor.css('width', bmp.rightFrameX - 100);
		} else {
			$searchEditor.css('width', 290);
		}
	} else {
		
		if($('.advanced-search-icon-toolbars').css('display') == "none") {
			var width = bmp.actionMenuToolsetMinWidth;
		} else {
			var width = bmp.actionMenuToolsetMaxWidth;
		}
		
		$searchEditor.css('width', $('#search-set').outerWidth() - width - ($('#search-set > span').outerWidth() - $searchEditor.outerWidth()) - 10);
	}
}

//////////////////////////////////////////////////////////
// list items
//////////////////////////////////////////////////

function updateFilteredItemsCount(targetFrame, count) {
	var $targetFrame = $(targetFrame);
	if(count > 0) {
		$targetFrame.find('.search-info').eq(0).text("(" + count + " filtered)");
	} else {
		$targetFrame.find('.search-info').eq(0).text("");
	}
}

function updateSelectedItemsCount(targetFrame, count) {
	var $targetFrame = $(targetFrame);
	var text = $targetFrame.find('.search-info').eq(1).text();
	var array = text.split("/");
	array[0] = count;
	$targetFrame.find('.search-info').eq(1).text(array.join("/"));
}

function updateTotalItemsCount(targetFrame, count) {
	var $targetFrame = $(targetFrame);
	var text = $targetFrame.find('.search-info').eq(1).text();
	var array = text.split("/");
	array[1] = count;
	$targetFrame.find('.search-info').eq(1).text(array.join("/"));
}

function getSelectedItemsCount(targetFrame) {
	var $targetFrame = $(targetFrame);
	var text = $targetFrame.find('.search-info').eq(1).text();
	var array = text.split("/");
	return array[0];
}

function countSelectedItems() {
	var $li = selectFromCurrFrame('#result-panel li');
	var length = $li.length;
	var count = 0;
	
	for (var i = 0; i < length; i++) {
		if($li.eq(i).hasClass('ui-selected')) {
			count++;
		}	
	}
	
	return count;
}

function getGroupItems(group) {
	if(!(group instanceof jQuery)) {
		group = $(group);
	}
	
	var $group = selectFromCurrFrame('#result-list li.group');
	var $li = selectFromCurrFrame('#result-list li');
	var index = $group.index(group);
	var indexStart;
	var indexEnd;
	if(index < $group.length - 1) {
		indexStart = $li.index($group.eq(index)) + 1;
		indexEnd = $li.index($group.eq(index + 1));
	} else {
		indexStart = $li.index($group.eq(index)) + 1;
		indexEnd = $li.length;
	}
	
	var itmes = [];
	
	for(var i = indexStart; i < indexEnd; i++) {
		itmes.push($li.eq(i));
	}
	
	return itmes;
}

function getSelectedItems() {
	return selectFromCurrFrame('#result-list li:not(.group)').filter('.ui-selected');
}

function getAllItems() {
	return selectFromCurrFrame('#result-list li:not(.group)');
}

function getHoverItem() {
	return selectFromCurrFrame('#result-list li:not(.group)').filter('.list-hover');
}

function selectAllItems() {
	selectFromCurrFrame('#result-list li:not(.group)').addClass('ui-selected');
	onSelectedItemsChanged();
}

function unselectAllItems() {
	selectFromCurrFrame('#result-list li:not(.group)').removeClass('ui-selected');
	onSelectedItemsChanged();
}

function onSelectedItemsChanged() {
	var count = countSelectedItems();
	updateSelectedItemsCount(bmp.currFrame, count);
	updateGroupsBackgroundColor();
}

//////////////////////////////////////////////////////////
// etc
//////////////////////////////////////////////////

function prepareMovingItems(ids, parentIds, indices) {
	
	var oldData = [];
	
	var length = ids.length;
	for (var i = 0; i < length; i++) {
		oldData.push({
			id: ids[i],
			parentId: parentIds[i],
			index: indices[i],
		});
	}
	
	return oldData;
}

function validateMovingItems(oldData, parentId) {
	// check if unable to move
	var length = oldData.length;
	for (var i = 0; i < length; i++) {
		var results = BookmarkManager.get(oldData[i].id);
		// only if the target parentId doen't equal the old parentId, that is, 
		// moving to a different folder.
		if(parentId != oldData[i].parentId) {
			if(results[0].parentId == oldData[i].parentId && results[0].index == oldData[i].index) {
				alertify.error(str_alertify_error_sort_subfolder, 4000);
				break;
			}
		}
	}
}

function queueSelectedClass(parameter) {
	
	var item = parameter.item;
	var targetFrame = parameter.targetFrame;
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	bmp.refreshTreeQueueEvents.push(function() {
		var $items = $(targetFrame).find('li:not(.group)');
		var length = $items.length;
		for (var i = 0; i < length; i++) {
			if($items.eq(i).data('id') == item.id) {
				$items.eq(i).addClass('ui-selected');
			}
		}
	});
}

function updateGroupsBackgroundColor() {
	
	var $groups = selectFromCurrFrame('#result-list li.group');
	var length = $groups.length;
	for (var i = 0; i < length; i++) {
		var $group = $groups.eq(i);
		if($group.hasClass('group-hide')) {		
			var count = 0;
			var itmes = getGroupItems($group);
			
			var length = itmes.length;
			for(var j = 0; j < length; j++) {
				if(itmes[j].hasClass('ui-selected')) {
					count++;
				}
			}
			
			if(count == itmes.length) {
				$group.addClass('group-full-selected');
			} else if(count > 0) {
				$group.addClass('group-partial-selected');
			} else {
				$group.removeClass('group-partial-selected group-full-selected');
			}
		} else {
			$group.removeClass('group-partial-selected group-full-selected');
		}
	}
}

function globStringToRegex(str, flag) {
    return new RegExp(preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), flag);
}

function preg_quote (str, delimiter) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

function showPreview(id) {
	if(bmp.isSorting) return;
	if(bmp.isSelecting) return;
	if(bmp.isExtending) return;
	
	$leftFrame.find('ul li').remove();
	$leftFrame.find('#result-panel .help-view').hide();
	
	$('#view-icon').addClass('fa fa-tv');
	$('#view-type').text("Preview");
	
	// TO prevent from flicking too often, we have timeout set
	bmp.preveiwTimeoutHandle = setTimeout(function() {
		
		$leftFrame.find('#result-list').show("fade", {
			easing : "easeInOutExpo", 
			queue: false,
		}, 100 );
		
		console.warn("Preview");
		preview({
			id: id,
		});
		
	}, PREVIEW_TIMEOUT_DELAY);
	
}

function hidePreview() {
	clearTimeout(bmp.preveiwTimeoutHandle);
	
	$leftFrame.find('#explore-panel > span').eq(0).children().remove();
	$leftFrame.find('ul li').remove();
	
	$leftFrame.find('#view-icon').removeClass('fa fa-tv');
	$leftFrame.find('#view-type').text("");
	
	$leftFrame.find('#result-list').stop(true, true).hide();
	
	$leftFrame.find('.search-info').eq(1).text("");
	$leftFrame.find('#result-panel .help-view').show();
	
}

function showView(id) {
	
	$leftFrame.find('#result-panel').removeClass('view-active');
	bmp.isViewAppended = true;
	//$leftFrame.find('#result-panel > span').remove();
	$leftFrame.find('#result-panel .help-view').hide();
	$leftFrame.find('#result-list').show();
	
	explore({
		id: id,
		hierarchy: idToHierarchy(id), 
		targetFrame: '#left-frame'
	});
	
	$('#view-icon').addClass('fa fa-tv');
	$('#view-type').text("View");
	
	createListSelectable('#left-frame');
	createListSortable('#left-frame');
	
	selectFromBothFrame('#result-list').sortable("option", "connectWith", selectFromBothFrame('#result-list'));
	
	// doesn't work
	//$('#view-hide').show();
	$('#view-hide').css('display', "inline-block");
	
	//var $a = $("<span>").addClass('fa fa-hover fa-times right');
	//$leftFrame.find('#header-panel').prepend($a);
}

function hideView() {
	$leftFrame.find('#explore-panel > span').eq(0).children().remove();
	$leftFrame.find('ul li').remove();
	$('#view-icon').removeClass('fa fa-tv');
	$leftFrame.find('#view-type').text("");
	
	$('#view-hide').hide();
	
	$leftFrame.find('#result-panel > span').show();
	bmp.isViewAppended = false;
	var left = bmp.exploreHistory.left;
	left.ids = [];
	left.hierarchies = [];
	left.index = -1;
	updateExploreMove('#left-frame');
	
	selectFromBothFrame('#result-list').sortable("option", "connectWith", false);
	
	$leftFrame.find('.search-info').eq(1).text("");
	$leftFrame.find('#result-panel .help-view').show();
	$leftFrame.find('#result-list').hide();
	
	bmp.exploreHierarchy.left.id = null;
	bmp.exploreHierarchy.left.hierarchy = null;
	StorageManager.set({
		exploreHierarchy: bmp.exploreHierarchy,
		exploreHistory: bmp.exploreHistory,
	});
}

function showToolset(selector) {
	if(bmp.isSorting) return;
	var $toolset = $('#action-hover-toolset').detach();
	if(selector instanceof jQuery) {
		selector.prepend($toolset);
	} else {
		$(selector).prepend($toolset);
	}
	
	if(bmp.currFrame == '#right-frame') {
		if(bmp.isSearching) {
			$('.toolset-folder').show();
		} else {
			$('.toolset-folder').hide();
		}
	} else {
		$('.toolset-folder').hide();
	}
	
	$toolset.show();
}

function hideToolset() {
	var $toolset = $('#action-hover-toolset').detach();
	$body.append($toolset);
	$toolset.hide();
}

function closeUI(event) {
	if(!$searchHistory.is(":hidden")) {
		$('.search-history-trigger').trigger('click');
	}
	
	selectFromBothFrame('#explore-sibling').hide();
	selectFromBothFrame('#explore-history').hide();
	
	if(selectFromCurrFrame('#result-list li:not(.group)').length > 0) {
		if(!event.listSelected) {
			if(!bmp.isMenuBroughtUp) {
				unselectAllItems();
			}
		}
	}
	
}

function initHelpView() {
	var $help = $('<div>').addClass('help-view');
	
	var $message = $('<div>').text(str_help_view);
	var $a = $('<a>').attr('href', "#").text(str_open_root).on('click', function() {
		showView("0");
	});
	var $root = $('<div>').addClass('root-folder').append($a);
	$help.append($message).append($root);
	$leftFrame.find('#result-panel').append($help);
}

function showHelpView() {
	
}

function hideHelpView() {
	
	
}

// handles in/out states at the end of dragging events (sorting or selecting)
function handleDraggingInOut(e, parameter) {
	
	var x;
	var y;
	var width;
	var height;
	
	if(bmp.isViewAppended) {
		if(getCurrFrame(e, true) == '#right-frame') {
			x = $rightFrame.offset().left;
			y = $rightFrame.find('#result-panel').offset().top;
			width = $rightFrame.width();
			height = $rightFrame.find('#result-panel').height();
		} else {
			x = $leftFrame.offset().left;
			y = $leftFrame.find('#result-panel').offset().top;
			width = $leftFrame.width();
			height = $leftFrame.find('#result-panel').height();
		}
	} else {
		x = $rightFrame.offset().left;
		y = $rightFrame.find('#result-panel').offset().top;
		width = $rightFrame.width();
		height = $rightFrame.find('#result-panel').height();
	}
	
	if(x < e.clientX && e.clientX < x + width && y < e.clientY && e.clientY < y + height) {
		if($.isFunction(parameter.in)) {
			parameter.in();
		}
	} else {
		if($.isFunction(parameter.out)) {
			parameter.out();
		}
	}
}

function createListSelectable(targetFrame) {
	// selectableScroll from László Károlyi
	// https://github.com/karolyi/ui-selectableScroll
	$(targetFrame).find('#result-list').selectableScroll({
		/* .ui-selected 때문에 선택된 다음에는 selectable의 영향권에서 벗어난다 */
		cancel: 'a div, .ui-selected, .group, #action-hover-toolset, #modal-cover', 
		filter: 'li:not(.group)',
		scrollElement: $(targetFrame).find('#result-panel'),
		scrollAmount: 15,
		scrollSnapY: 10,
		create: function(e, ui) {
			//console.debug('create');
		},
		start: function(e, ui) {
			//console.debug('start');
			e.listSelected = true;
			closeUI(e);
			bmp.isSelecting = true;
		},
		selecting: function(e, ui) {
			// shift selection
			//var curr = $(ui.selecting.tagName, e.target).index(ui.selecting);
			var curr = $(targetFrame).find('#result-list li:not(.group)').index(ui.selecting);
			if(e.shiftKey && bmp.lastSelectIndex > -1) {
				//console.debug(bmp.lastSelectIndex, curr, Math.min(bmp.lastSelectIndex, curr));
				$('li:not(.group)', e.target).slice(Math.min(bmp.lastSelectIndex, curr), 1 + Math.max(bmp.lastSelectIndex, curr)).addClass('ui-selected');
			} else {
				bmp.lastSelectIndex = curr;
			}
		},
		stop: function(e, ui) {
			bmp.isSelecting = false;
			onSelectedItemsChanged();
			
			handleDraggingInOut(e, {
				out: function() {
					// 외부에서 이벤트가 종료되면 ui-selected 가 제거되기도 하므로 임시방편으로
					// ui-selected-fix 을 일단 사용한다.
					var $selected = $(targetFrame).find('.ui-selected').addClass('ui-selected-fix');
					setTimeout(function() {
						if($selected.hasClass('ui-selected')) {
							$selected.removeClass('ui-selected-fix');
						} else {
							$selected.toggleClass('ui-selected ui-selected-fix');
						}
						onSelectedItemsChanged();
					}, 0);
				},
			});
			
		},
	});
}

function createListSortable(targetFrame) {
	
	var isCanceled;			// if the cursor is out of range at the end, isCanceled gets true
	var sortOriginFrame;	// origin frame where sorting was initiated
	
	$(targetFrame).find('#result-list').sortable({
		//opacity: 0.5, 
		placeholder: "placeholder", 
		helper: "clone", 
		cursor: "-webkit-grabbing",
		//connectWith: selectFromBothFrame('#result-panel'),
		items: 'li:not(.group)',
		cursorAt: { left: 5, top: 5 },
		handle: 'a div, a',	// items 하위임
		cancel: '#action-hover-toolset',
		scrollSpeed: 15,
		scrollSensitivity: 10,
		helper: function(e, item) {
			
			// make both frame's folders droppable before this helper items go into the list
			// because makeFoldersDroppable() may make helper items which are appended to the list droppable too.
			makeFoldersDroppable('#left-frame');
			makeFoldersDroppable('#right-frame');
			
			// if item is not selected, clear and make it selected.
			if (!item.hasClass('ui-selected')) {
			  item.parent().children('.ui-selected').removeClass('ui-selected');
			  item.addClass('ui-selected');
			}
			
			hideToolset();
			
			var $selected = item.parent().children('.ui-selected').addClass('sort-to-delete').clone(true);
			
			item.parent().children('.ui-selected').addClass('sort-selected');
			
			
			$selected.removeClass('sort-to-delete').removeClass('ui-selected');
			
			var isActive = true;
			if($selected.length == 1) {
				if(item.data('url') != undefined) {
					isActive = false;
				}
			} else {
				isActive = false;
			}		
			
			
			var $li2 = $('<li>').append($selected).data('active', isActive);
			
			
			var $li = $li2.find('li');
			
			var length = $li.length;
			
			// index 일단 0으로 강제
			var index = 0;
			var maxOpacity = 0.4;
			var step = 0.24;
			
			for (var i = 0; i < length; i++) {
				var value = 1-Math.abs((index-i)*step);
				if(value < 0) value = 0;
				
				var alpha1;
				var alpha2;
				
				if(value != 0) {
					if(index == i) {
						alpha1 = 1;
						alpha2 = 1;
					} else if(index > i) {
						alpha1 = value;
						alpha2 = value + step;
					} else {
						alpha1 = value + step;
						alpha2 = value;
					}
				} else {
					alpha1 = 0;
					alpha2 = 0;
				}
				
				value *= maxOpacity;
				alpha1 *= maxOpacity;
				alpha2 *= maxOpacity;
				
				$li.eq(i).css('background', "-webkit-linear-gradient(rgba(234, 245, 253, " + alpha1 + "), rgba(234, 245, 253, " + alpha2 + "))");
				$li.eq(i).find('a').css('opacity', value);
			}
			
			item.data('sortingItems', $selected);
			
			return $li2;
		},
		start: function(e, ui) {
			
			isCanceled = false;
			
			bmp.isSorting = true;
			bmp.dropTarget = null;
			
			sortOriginFrame = bmp.currFrame;
			
			// show ui.item again
			ui.item.show();
		},
		sort: function(e, ui) {			
			
			// drop into a folder
			if(bmp.dropTarget) {
				$('.ui-sortable-placeholder').removeClass('placeholder').removeClass('placeholder-none');
			
			// just sorting
			} else {
				
				// sorting with placeholder in the right-frame while searching
				if(ui.placeholder.closest('.frame').attr('id') == 'right-frame' && bmp.isSearching) {
					$('.ui-sortable-placeholder').removeClass('placeholder').removeClass('placeholder-none');
					
				// normal sorting
				} else {
					
					// When it comes to sorting, the sorting helper under the mouse point is always a descendent 
					// of the original frame, which means the mechanism determining the current frame doesn't work 
					// under these circumstances. So direct calculation is used here.
					
					handleDraggingInOut(e, {
						in: function() {
							$('.ui-sortable-placeholder').addClass('placeholder').removeClass('placeholder-none');
						},
						out: function() {
							$('.ui-sortable-placeholder').removeClass('placeholder').addClass('placeholder-none');
						},
					});
				}
			}
			
			e.listSelected = true;
			closeUI(e);
			
			
			var widget = $(targetFrame).find('#result-list').sortable( "instance" );
			var o = widget.options;
			
			clearInterval(bmp.scrollIntervalHandle);
			
			//Do automatic scrolling
			if ( widget.options.scroll ) {
				if ( ( widget.overflowOffset.top + widget.scrollParent[ 0 ].offsetHeight ) -
						event.pageY < o.scrollSensitivity ) {
					bmp.scrollIntervalHandle = setInterval(function () {
						widget.scrollParent[ 0 ].scrollTop = widget.scrollParent[ 0 ].scrollTop + o.scrollSpeed;
					}, 100);
				} else if ( event.pageY - widget.overflowOffset.top < o.scrollSensitivity ) {
					bmp.scrollIntervalHandle = setInterval(function () {
						widget.scrollParent[ 0 ].scrollTop = widget.scrollParent[ 0 ].scrollTop - o.scrollSpeed;
					}, 100);
				}
			}
			
			
		},
		over: function(e, ui) {
			// This enables the other frame to be scrollable
			if (ui.sender) {
				var widget = ui.sender.data("ui-sortable");
				widget.scrollParent = $(this).parent();
			}
			
			var currFrame = getCurrFrame(e, true);
			if (currFrame != sortOriginFrame) {
				$(currFrame).find('.ui-selected').removeClass('ui-selected');
			}
		},
		out: function(e, ui) {
			//console.debug("out : " + e);
		},
		// placeholder과 helper가 지워진 후인 stop이 아닌 beforeStop에서 해야 함. 
		beforeStop: function(e, ui) {
			
			clearInterval(bmp.scrollIntervalHandle);
			
			$('.sort-selected').removeClass('sort-selected');
			
			if(!bmp.isViewAppended) {
			
				if($leftFrame.find('#result-panel').hasClass('view-active')
					|| $leftFrame.find('#result-panel').hasClass('view-active-not-possiable')) {
					
					// correct drop
					if(ui.helper.data('active')) {
						showView(ui.item.data('id'));
						
					// wrong drop
					} else {
						$leftFrame.find('#result-panel').removeClass('view-active-not-possiable');
						alertify.error(str_alertify_error_drop_into_view, 3000);
					}
					
					$('.sort-to-delete').removeClass('sort-to-delete');
					bmp.isSorting = false;
					isCanceled = true;
					return;
				}
			}
			
			
			// cancel sorting when it stops outside
			handleDraggingInOut(e, {
				out: function() {
					$('.sort-to-delete').removeClass('sort-to-delete');
					bmp.isSorting = false;
					isCanceled = true;
				},
			});
			
			if(isCanceled) return;
			
			
			if(ui.item.closest('.frame').attr('id') == 'right-frame' && bmp.isSearching && !bmp.dropTarget) {
				isCanceled = true;
				return;
			}
			
			
			var currFrame = getCurrFrame(e, true);
			
			// remove class of those that are already selected
			ui.item.parent().children('.ui-selected').removeClass('ui-selected');
			
			var $selected = ui.item.data('sortingItems');
			
			// get rid of sorting effects
			$selected.find('a').css('opacity', "");
			$selected.css('background', "");
			
			var ids = [];
			var parentIds = [];
			var indices = [];
			
			var length = $selected.length;
			for (var i = 0; i < length; i++) {
				ids.push($selected.eq(i).data('id'));
				parentIds.push($selected.eq(i).data('parentId'));
				indices.push($selected.eq(i).data('index'));
			}
			
			var oldData = prepareMovingItems(ids, parentIds, indices);
			
			// onto folder
			if(bmp.dropTarget) {
				bmp.dropTarget.closest('li').removeClass('drop-selected');
				bmp.dropTarget.addClass('ui-selected');
				
				var parentId = bmp.dropTarget.closest('li').data('id');
				var index = undefined;
				
				ui.item.remove();
				
				// remove original items.
				$('.sort-to-delete').remove();
				
				bmp.refreshTreeEnabled = false;
				
				var length = $selected.length;
				for (var i = 0; i < length; i++) {
					var id = $selected.eq(i).data('id');
					
					if(i == $selected.length - 1) {
						move({
							parentId: parentId,
							id: id,
							index: index,
							callback: function() {
								var results = BookmarkManager.get(parentId);
								queueSelectedClass({
									item: results[0], 
									targetFrame: currFrame,
								});
								bmp.refreshTreeEnabled = true;
								refreshTree(function() {
									validateMovingItems(oldData, parentId);
									validateExploreData({
										moved: true,
									});
								});
							},
						});
					} else {
						move({
							parentId: parentId,
							id: id,
							index: index,
						});
					}
					
				}
				
			// onto list
			} else {
				
				$selected.addClass('ui-selected');
				
				if(currFrame == '#right-frame') {
					var parentId = bmp.exploreHierarchy.right.id;
				} else {
					var parentId = bmp.exploreHierarchy.left.id;
				}
				
				var $li = $(currFrame).find('#result-list li:not(.group)');
				
				
				// sort to the same folder
				if(ui.item.data('parentId') == parentId) {
					
					if(ui.item.data('index') < $li.index(ui.placeholder)) {
						//console.debug("nnnn");
						// ui.item 사본이 존재
						if(currFrame != sortOriginFrame) {
							var tempIndex = $li.index(ui.item);
						// ui.item이 미리 옮겨짐
						} else {
							var tempIndex = $li.index(ui.item) + 1;
						}
					} else {
						//console.debug("mmmm");
						var tempIndex = $li.index(ui.item);
					}
					
					
				// sort to another folder
				} else {
					var tempIndex = $li.index(ui.item);
				}
				
				ui.item.remove();
				
				// remove original items.
				$('.sort-to-delete').remove();
				
			
				bmp.refreshTreeEnabled = false;
				
				for (var i = $selected.length - 1; i > -1; i--) {
					var $item = $selected.eq(i);
					
					var index;
					
					// sort to the same folder
					if($item.data('parentId') == parentId) {
						if($item.data('index') < tempIndex) {
							index = tempIndex--;
						} else {
							index = tempIndex;
						}
						
					// sort to another folder
					} else {
						index = tempIndex;
					}
					
					if(i == 0) {
						move({
							parentId: parentId,
							id: $item.data('id'),
							index: index,
							callback: function(result) {
								bmp.refreshTreeEnabled = true;
								refreshTree(function() {
									validateMovingItems(oldData, parentId);
									validateExploreData({
										moved: true,
									});
								});
								
								queueSelectedClass({
									item: result, 
									targetFrame: currFrame,
								});
							},
						});
					} else {
						move({
							parentId: parentId,
							id: $item.data('id'),
							index: index,
							callback: function(result) {
								queueSelectedClass({
									item: result, 
									targetFrame: currFrame,
								});
							},
						});
					}
					
				}
				
			}
			
			bmp.isSorting = false;
		},
		stop: function(e, ui) {
			// beforeStop 에서 cancel할 경우 에러가 발생하기 때문에 stop에서 실행한다.
			if(isCanceled) return false;
		},
		change: function(e, ui) {
		},
		update: function(e, ui) {
		},
	}).sortable( "instance" )._cacheHelperProportions = function() {
		this.helperProportions = {
			width: 10,
			height: 10,
		};
	};
}

function makeFoldersDroppable(targetFrame) {
	var $li = $(targetFrame).find('#result-list li:not(.group)');
	var length = $li.length;
	for (var i = 0; i < length; i++) {
		if($li.eq(i).data('url') == undefined) {
			$li.eq(i).find('.droppable-area').droppable({
				accept: "#result-list li",
				tolerance: "pointer",
				addClasses: false,
				over: function() {
					if(!bmp.isSorting) return;
					if($(this).closest('li').hasClass('ui-selected')) return;
					
					bmp.dropTarget = $(this);
					$(this).closest('li').addClass('drop-selected');
				},
				out: function() {
					if(!bmp.isSorting) return;
					if($(this).closest('li').hasClass('ui-selected')) return;
					
					bmp.dropTarget = null;
					$(this).closest('li').removeClass('drop-selected');
				},
			});
		}
	}
}

function createExploreSortable() {
	$rightFrame.find('#explore-panel').sortable({
		appendTo: 'body',
		opacity: 0.4, 
		placeholder: "placeholder-none", 
		helper: "clone", 
		items: '.explore-hierarchy .explore-folder, #explore-sibling li',
		cursorAt: { left: 5, top: 5 },
		helper: function(e, item) {
			
			var $img = $('<img>').attr('src', "img/folder.png").css('vertical-align', "top");
			var $item = item.clone().css({
				display: "inline-block", 
				'text-decoration': "none",
			});
			var $div = $('<div>').append($img).append($item).css({
				width: "100%",
			}).data('active', true);
			
			return $div;
		},
		start: function(e, ui) {
			
			bmp.isSorting = true;
			bmp.dropTarget = null;
			
			ui.item.show();
		},
		/* stop이 아닌 beforeStop에서 해야 함 */
		beforeStop: function(e, ui) {
			
			ui.item.parent().children('.sort-selected').removeClass('sort-selected');
			
			if(!bmp.isViewAppended) {
				if($leftFrame.find('#result-panel').hasClass('view-active')) {
					if(ui.helper.data('active')) {
						showView(ui.item.data('id'));
					} else {
						$leftFrame.find('#result-panel').removeClass('view-active-not-possiable');
					}
				}
			}
			
			bmp.isSorting = false;
			return false;
		},
	}).sortable( "instance" )._cacheHelperProportions = function() {
		this.helperProportions = {
			width: 10,
			height: 10,
		};
	};
}

// handles folder click events in the lists of View and Explore
function handleFolderClick(event, id) {
	if(event.ctrlKey) {
		if(bmp.currFrame == '#right-frame') {
			if(bmp.isViewAppended) {
				explore({
					id: id,
					hierarchy: idToHierarchy(id), 
					targetFrame: '#left-frame',
				});
			} else {
				if($body.hasClass('extend')) {
					showView(id);
				}
			}
		} else {
			if(bmp.isViewAppended) {
				explore({
					id: id,
					hierarchy: idToHierarchy(id), 
					targetFrame: '#right-frame',
				});
			} else {
				showView(id);
			}
		}
	} else {
		explore({
			id: id,
			hierarchy: idToHierarchy(id), 
		});
	}
	
	// might open web pages with View unless preventing the default behavior
	event.preventDefault();
}

function isDescendantOf(descendantId, ancestorId) {
	var id = descendantId;
	while (true) {
		var results = BookmarkManager.get(id);
		if(results[0] == undefined) return false;
		if(results[0].parentId == ancestorId) return true;
		if(results[0].parentId == "0") return false;
		id = results[0].parentId;
	}
}

function handleRuntimeError() {
	if(chrome.runtime.lastError) {
		var message;
		switch(chrome.runtime.lastError.message) {
			case "Can't modify the root bookmark folders.":
				message = str_alertify_error_cant_modify_the_root_bookmark_folders;
				break;
				
			case "Invalid URL.":
				message = str_alertify_error_invalid_url;
				break;
			
			default:
				message = chrome.runtime.lastError.message;
				break;
		}
		
		alertify.error(message, 4000);
	}
}

function validateExploreData(parameter) {
	
	// moved
	if(parameter.moved) {
		var left = bmp.exploreHistory.left;
		var length = left.ids.length;
		for (var i = 0; i < length; i++) {
			left.hierarchies[i] = idToHierarchy(left.ids[i]);
		}
		
		var right = bmp.exploreHistory.right;
		var length = right.ids.length;
		for (var i = 0; i < length; i++) {
			right.hierarchies[i] = idToHierarchy(right.ids[i]);
		}
		
		
		var left = bmp.exploreHierarchy.left;
		if(left.id != null) {
			left.hierarchy = idToHierarchy(left.id);
		}
		
		var right = bmp.exploreHierarchy.right;
		right.hierarchy = idToHierarchy(right.id);
		
	// deleted
	} else if(parameter.deleted) {
		var left = bmp.exploreHistory.left;
		var length = left.ids.length;
		for (var i = length - 1; i > -1; i--) {
			var results = BookmarkManager.get(left.ids[i]);
			if(results[0] == undefined) {
				left.ids.remove(i);
				left.hierarchies.remove(i);
				if(left.index >= i) {
					left.index--;
				}
			}
		}
		
		var right = bmp.exploreHistory.right;
		var length = right.ids.length;
		for (var i = length - 1; i > -1; i--) {
			var results = BookmarkManager.get(right.ids[i]);
			if(results[0] == undefined) {
				right.ids.remove(i);
				right.hierarchies.remove(i);
				if(right.index >= i) {
					right.index--;
				}
			}
		}
		
		var left = bmp.exploreHierarchy.left;
		if(left.id != null) {
			var results = BookmarkManager.get(left.id);
			if(results[0] == undefined) {
				left.hierarchy = [];
				left.id = "0";
			}
		}
		
		var right = bmp.exploreHierarchy.right;
		var results = BookmarkManager.get(right.id);
		if(results[0] == undefined) {
			right.hierarchy = [];
			right.id = "0";
		}
		
	// invalid ids (different computer)
	} else {
		var left = bmp.exploreHistory.left;
		var length = left.hierarchies.length;
		for (var i = 0; i < length; i++) {
			left.ids[i] = hierarchyToId(left.hierarchies[i]);
		}
		
		var right = bmp.exploreHistory.right;
		var length = right.hierarchies.length;
		for (var i = 0; i < length; i++) {
			right.ids[i] = hierarchyToId(right.hierarchies[i]);
		}
		
		
		var left = bmp.exploreHierarchy.left;
		if(left.id != null) {
			left.id = hierarchyToId(left.hierarchy);
		}
		
		var right = bmp.exploreHierarchy.right;
		right.id = hierarchyToId(right.hierarchy);
	}
	
	StorageManager.set({
		exploreHierarchy: bmp.exploreHierarchy,
		exploreHistory: bmp.exploreHistory,
	});
	
	updateExploreMove('#left-frame');
	updateExploreMove('#right-frame');
}

function idToHierarchy(id) {
	
	var hierarchy = [];
	var currId = id;
	
	while(true) {
		
		var results = BookmarkManager.get(currId);
		
		if(results[0].parentId == undefined) {
			hierarchy.reverse();
			return hierarchy;
		} else {
			hierarchy.push(results[0].index);
		}
		
		currId = results[0].parentId;
	}
}

function hierarchyToId(hierarchy) {
	
	var results = BookmarkManager.getChildren("0");
	var id;
	
	var length = hierarchy.length;
	for (var i = 0; i < length; i++) {
		id = results[hierarchy[i]].id;
		results = BookmarkManager.getChildren(id);
	}
	
	return id;
}

function decideApply() {
	//console.debug("decideApply()");
	if(!bmp.options.apply) return;
	
	refresh({
		targetFrame: '#right-frame',
		autoScroll: true,
	});
}
