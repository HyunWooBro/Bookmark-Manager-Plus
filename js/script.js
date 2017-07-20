//
// by Kim Hyun-Woo
// 2017-06-22
//

'use strict';

function initView(targetFrame, isSearch) {
	bmp.lastSelectIndex = -1;
	
	hideToolset();
	
	if(targetFrame == '#right-frame') {
		if(isSearch) {
			bmp.isSearching = true;
		} else {
			bmp.isSearching = false;
		}
	}
	
	$(targetFrame).find('#result-panel').scrollTop(0);
}

function getHierarchy(item) {
	
	var hierarchy = "";
	var parentId = item.parentId;
	
	if(item.id == "1" || item.id == "2") {
		return "[*]";
	}
	
	// If it was already cached, we use it.
	var cache = bmp.hierarchyCache[item.parentId];
	if(cache) return cache;
	
	while (true) {
		var results = BookmarkManager.get(parentId);
		var parent = results[0];
		
		if(hierarchy.length == 0) {
			hierarchy = parent.title;
		} else {
			hierarchy = parent.title + " > " + hierarchy;
		}
		
		parentId = parent.parentId;
		if(parentId == "0") break;
	}
	
	return bmp.hierarchyCache[item.parentId] = "[" + hierarchy + "]";
}

function createList(parameter) {
	
	var queries = parameter.queries;
	var data = parameter.data;
	var targetFrame = parameter.targetFrame;
	var sortMode = parameter.sortMode;
	var isGroupBar = parameter.groupBar;
	var isSimple = parameter.simple;
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	if(sortMode == undefined) {
		sortMode = bmp.options.sort;
	}
	if(isGroupBar == undefined) {
		isGroupBar = bmp.options.group;
	}
	
	if(bmp.isHierarchyInvalidated) {
		bmp.isHierarchyInvalidated = false;
		bmp.hierarchyCache = {};
	}
	
	var $targetFrame = $(targetFrame);
	
	var $ul = $targetFrame.find('#result-list');
	
	var list = [];
	
	var prevGroup = "";
	
	
	if(isSimple) {
		
		var hash = {};
		
		var length = data.length;
		for (var i = 0; i < length; i++) {
			var temp = createListItem({
				queries: queries, 
				item: data[i], 
				simple: true,
			});
			
			if(hash[temp.data('hierarchy')] == undefined) {
				// 해쉬에 추가
				hash[temp.data('hierarchy')] = 1;
				
				//list.reverse();
				
				// 
				var index = list.findIndex(function(e) {
					if(e.data('prevGroup') == undefined) return false;
					return e.data('prevGroup').includes(temp.data('hierarchy'));
				});
				
				if(index == -1) {
					
					prevGroup = temp.data('hierarchy');
					var $f = $('<li>').addClass('group');
					
					$f.data('prevGroup', prevGroup);
					list.push($f);
					
					list.push(temp);
				} else {
					list.insert(index, temp);
					
					prevGroup = temp.data('hierarchy');
					var $f = $('<li>').addClass('group');
					
					$f.data('prevGroup', prevGroup);
					list.insert(index, $f);
					
				}
				//list.reverse();
				
				
			} else {
				
				// var index = list.findIndex(function(e) {
					// return e.data('hierarchy') == temp.data('hierarchy');
				// });
				
				var index;
				for (var j = list.length - 1; j > -1; j--) {
					if(list[j].data('hierarchy') == temp.data('hierarchy')) {
						index = j;
						break;
					}
				}
				
				list.insert(index+1, temp);
			}
		}
		
		
		// 그룹 제거
		for (var i = list.length - 1; i > -1; i--) {
			if(list[i].data('prevGroup') != undefined) {
				list.remove(i);
			}
		}
		
		//list.reverse();
		
		$ul.append(list);
		
		return;
	}
	
	
	
		
	if(sortMode == "hierarchy") {
		
		var hash = {};
		
		if(isGroupBar) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				
				if(hash[temp.data('hierarchy')] == undefined) {
					// 해쉬에 추가
					hash[temp.data('hierarchy')] = 1;
					
					//list.reverse();
					
					// 
					var index = list.findIndex(function(e) {
						if(e.data('prevGroup') == undefined) return false;
						return e.data('prevGroup').includes(temp.data('hierarchy'));
					});
					
					
					if(index == -1) {
						// 그룹이 처음 나오는 경우
						
						prevGroup = temp.data('hierarchy');
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						$f.data('prevGroup', prevGroup);
						list.push($f);
						
						list.push(temp);
					} else {
						// 그룹이 이미 만들어져 있는 경우
						
						list.insert(index, temp);
						
						prevGroup = temp.data('hierarchy');
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						$f.data('prevGroup', prevGroup);
						list.insert(index, $f);
						
						
					}
					//list.reverse();
					
					
				} else {
					
					// var index = list.findIndex(function(e) {
						// return e.data('hierarchy') == temp.data('hierarchy');
					// });
					
					var index;
					for (var j = list.length - 1; j > -1; j--) {
						if(list[j].data('hierarchy') == temp.data('hierarchy')) {
							index = j;
							break;
						}
						
					}
					
					list.insert(index+1, temp);
				}
				
				
				
				
				// if(prevGroup != temp.data('hierarchy')) {
					// prevGroup = temp.data('hierarchy');
					// var $f = $('<li>');
					// $f.append('<span>').addClass('group').text(prevGroup);
					// list.push($f);
				// }
				
				// list.push(temp);
			}
			
		} else {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				
				if(hash[temp.data('hierarchy')] == undefined) {
					// 해쉬에 추가
					hash[temp.data('hierarchy')] = 1;
					
					//list.reverse();
					
					// 
					var index = list.findIndex(function(e) {
						if(e.data('prevGroup') == undefined) return false;
						return e.data('prevGroup').includes(temp.data('hierarchy'));
					});
					
					if(index == -1) {
						
						
						prevGroup = temp.data('hierarchy');
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						$f.data('prevGroup', prevGroup);
						list.push($f);
						
						list.push(temp);
					} else {
						list.insert(index, temp);
						
						prevGroup = temp.data('hierarchy');
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						$f.data('prevGroup', prevGroup);
						list.insert(index, $f);
						
						
					}
					//list.reverse();
					
					
				} else {
					
					// var index = list.findIndex(function(e) {
						// return e.data('hierarchy') == temp.data('hierarchy');
					// });
					
					var index;
					for (var j = list.length - 1; j > -1; j--) {
						if(list[j].data('hierarchy') == temp.data('hierarchy')) {
							index = j;
							break;
						}
						
					}
					
					list.insert(index+1, temp);
				}
			}
			
			
			// 그룹 제거
			for (var i = list.length - 1; i > -1; i--) {
				if(list[i].data('prevGroup') != undefined) {
					list.remove(i);
				}
				
			}
			
			// for (var i = 0; i < data.length; i++) {
				// list.push(createListItem(queries, data[i]));
			// }
		}
		
		//list.reverse();
		
		$ul.append(list);
	} else if(sortMode == "title") {
		data.sort(function(a, b) { 
			if(a.title > b.title) return 1;
			if(a.title < b.title) return -1;
			return 0;
		});
		if(isGroupBar) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				if(prevGroup != data[i].title[0]) {
					prevGroup = data[i].title[0];
					var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
					// no title or space
					if(prevGroup == undefined || prevGroup == " ") {
						var $groupTitle = $('<span>');
						// To make a group have height, we use a transparent text
						var $transparentTitle = $('<span style="opacity: 0;">').text(".");
						$f.append($groupTitle).append($transparentTitle);
						
					// title
					} else {
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
					}
					var $g = $('<a href="#">').addClass('group-view');
					var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
					$g.append($h);
					$f.append($g);
						
					list.push($f);
				}
				
				list.push(temp);
			}
		} else {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				list.push(temp);
			}
		}
		$ul.append(list);
	} else if(sortMode == "url") {
		var reg = /\w*:\/\/[^/]*/;
		data.sort(function(a, b) {
			if(a.url == undefined) return -1;
			if(b.url == undefined) return 1;
			if(!reg.test(a.url)) return -1;
			if(!reg.test(b.url)) return 1;
			if(a.url > b.url) return 1;
			if(a.url < b.url) return -1;
			return 0;
		});
		if(isGroupBar) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				if(reg.test(data[i].url)) {
					if(prevGroup != reg.exec(data[i].url)[0]) {
						prevGroup = reg.exec(data[i].url)[0];
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						list.push($f);
					}
				} else {
					if(prevGroup != "N/A") {
						prevGroup = "N/A";
						var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
						var $groupTitle = $('<span>').text(prevGroup);
						$f.append($groupTitle);
						var $g = $('<a href="#">').addClass('group-view');
						var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
						$g.append($h);
						$f.append($g);
						
						list.push($f);
					}
				}
				
				list.push(temp);
			}
		} else {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				list.push(temp);
			}
		}
		$ul.append(list);
	} else {
		data.sort(function(a, b) { return b.dateAdded - a.dateAdded});
		if(isGroupBar) {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				if(prevGroup != new Date(data[i].dateAdded).toLocaleDateString()) {
					prevGroup = new Date(data[i].dateAdded).toLocaleDateString();
					var $f = $('<li>').addClass('group').data('parentId', temp.data('parentId'));
					var $groupTitle = $('<span>').text(prevGroup);
					$f.append($groupTitle);
					var $g = $('<a href="#">').addClass('group-view');
					var $h = $('<span>').addClass('fa fa-basic fa-hover fa-caret-down');
					$g.append($h);
					$f.append($g);
						
					list.push($f);
				}
				
				list.push(temp);
				
			}
		} else {
			var length = data.length;
			for (var i = 0; i < length; i++) {
				var temp = createListItem({
					queries: queries, 
					item: data[i],
				});
				if(!temp) continue;
				list.push(temp);
			}
		}
		$ul.append(list);
	}
	
	updateGroupMaxWidth(targetFrame);
}

function createListItem(parameter) {
	
	var queries = parameter.queries;
	var item = parameter.item;
	var isSimple = parameter.simple;
	
	
	var hierarchy = getHierarchy(item);
	
	
	var title = item.title;
	
	var isTitle = bmp.options.title;
	var isHighlight = bmp.options.highlight;
	
	var $q;
	
	var length = queries.length;
	if(isTitle && isHighlight && length) {
		
		var ranges = [];
		var range;
		
		var str;
		
		// 범위 찾기
		for (var i = 0; i < length; i++) {
			if(queries[i].length == 0) continue;
			
			var indexes = [];
			
			str = title;
			
			var match;
			//var reg = new RegExp(preg_quote(queries[i]), 'g');
			
			// 검색을 하면서 lastIndex를 기준으로 다음 검색을 하기 때문에 초기화해줘야 한다.
			queries[i].lastIndex = 0;
			while (match = queries[i].exec(str)) {
				// prevents infinite loop 
				if(match[0].length == 0) break;
				ranges.push([match.index, match.index + match[0].length]);
			}

		}
		
		// 범위 정렬
		ranges.sort(function(a, b) { 
			return a[0]-b[0] || a[1]-b[1] 
		});
		
		// 범위 병합
		ranges = merge(ranges);
		function merge(ranges) {
			var results = [];

			ranges.forEach(function(r) {
				if(!results.length || r[0] > results[results.length-1][1])
					results.push(r);
				else
					results[results.length-1][1] = r[1];
			});

			return results;
		}
		
		ranges.reverse();
		
		
		//$q = '<span>';
		
		var index = 0;
		
		var $t = "";
		
		// 찾은 범위를 바탕으로 색 입히기
		while(range = ranges.pop()) {
			
			if(index < range[0]) {
								// $t = $('<span>').text(title.substring(index, range[0]));
								// $q.append($t);
				$t += "<span>" + escapeHtml(title.substring(index, range[0])) + "</span>";
				//$q = "<span>" + $t;
			}
			
			index = range[1];
			
							// $t = $('<span style="color: red;">1</span>').text(title.substring(range[0], range[1]));
							// $q.append($t);
			$t += "<span style='color: red;'>" + escapeHtml(title.substring(range[0], range[1])) + "</span>";
			//$q = $($q + $t + "</span>");
		}
		
		
		
		if(index < title.length) {
							// $t = $('<span>').text(title.substring(index, title.length));
							// $q.append($t);
			$t += "<span>" + escapeHtml(title.substring(index, title.length)) + "</span>";
			//$q.append($t);
		}
		
		
		$q = '<span>' + $t + '</span>';
		
		
	} else {
		// $q = $('<span>').text(title);
		$q = '<span>' + escapeHtml(title) + '</span>';
	}
	
	var $a;
	if(isSimple) {
		$a = '<a>';
	} else {
		var date = new Date(item.dateAdded);
		date = date.toLocaleDateString() + " " + date.toLocaleTimeString();
		if(item.url == undefined) {
			var title = hierarchy + "\n" + item.title + "\n" + date;
			$a = '<a title="' + escapeHtml(title) + '">';
		} else {
			var title = hierarchy + "\n" + item.title + "\n" + item.url + "\n" + date;
			$a = '<a href="' + item.url + '" title="' + escapeHtml(title) + '">';
		}
		
	}
	
	var $img;
	if(item.url == undefined) {
		$img = '<img src="img/folder.png" class="result-icon">';
	} else {
		//var faviconURL = "https://www.google.com/s2/favicons?domain=" + item.url;
		//var faviconURL = "chrome://favicon/" + item.url;
		$img = '<img src="chrome://favicon/' + item.url + '" class="result-icon">';
	}
	
	// var $div = $('<div>').append($b).append($q);
	// $a.append($div);
	
	//var $div = $('<div>').append($b).append($q);
	$a = $a + '<div>' + $img + $q + '</div></a>';
	
	var $f = '<li>' + $a;
	//$f.append($a);
	
	if(item.url == undefined) {
		// var $dropArea = $('<span class="droppable-area">');
		// $f.append($dropArea);
		$f = $f + '<span class="droppable-area">';
	}
	
	$f = $($f);
	
	if(item.url == undefined) {
		$f.find('img').on('click', function(e) {
			var id = $(this).closest('li').eq(0).data('id');
			handleFolderClick(e, id);
		});
	} else {
		$f.find('img').on('click', function(e) {
			var url = $(this).closest('li').eq(0).data('url');
			
			if(e.ctrlKey && !e.shiftKey) {
				TabManager.create({
					url: url,
					active: false,
				});
			}
			
			if(!e.ctrlKey && e.shiftKey) {
				WindowManager.create({
					url: url,
				});
			}
			
			if(!e.ctrlKey && !e.shiftKey) {
				TabManager.update({
					url: url,
					active: false,
				});
			}
		});
	}
	
	$f.data('hierarchy', hierarchy);
	$f.data('parentId', item.parentId);
	$f.data('id', item.id);
	$f.data('title', item.title);
	$f.data('url', item.url);
	$f.data('index', item.index);
	$f.data('dateGroupModified', item.dateGroupModified);
	
	//console.timeEnd("createListItem");
	
	return $f;
}


// item
// target
function exploreBar(parameter) {
	
	var item = parameter.item;
	var targetFrame = parameter.targetFrame;
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	var $targetFrame = $(targetFrame);
	
	var $exploreHierarchy = $targetFrame.find('.explore-hierarchy');
	$exploreHierarchy.children().remove();
	
	var id = item.id;
	
	function getExploreItem(id) {
		return $('<a href="#">')
			.addClass('explore-folder')
			.data('id', id)
			.on({
				click: function(e) {
					handleFolderClick(e, id);
				},
				mouseenter: function() {
					if(!$body.hasClass('extend')) return;
					if(bmp.isViewAppended) return;
					showPreview(id);
				},
				mouseleave: function() {
					if(!$body.hasClass('extend')) return;
					if(bmp.isViewAppended) return;
					hidePreview();
				},
			});
	}
	
	var length = 0;
	
	while (true) {
		
		if(length > 0) {
			var $arrow = $('<span>').addClass('fa fa-chevron-right explore-hierarchy-arrow');
			$exploreHierarchy.prepend($arrow);
		}
			
		if(id == "0") {
			
			var $a = getExploreItem("0");
			var $star = $('<span>').addClass('fa fa-hover fa-star');
			$a.append($star);
			if(length == 0) $star.addClass('explore-view');
			$exploreHierarchy.prepend($a);
			break;
			
		} else {
			
			var results = BookmarkManager.get(id);
			var folder = results[0];
			
			var parentId = folder.id;
			const parentParentId = folder.parentId;
			
			const $a = getExploreItem(parentId).text(folder.title);
			$exploreHierarchy.prepend($a);
			if(length == 0) $a.addClass('explore-view');
			
			var $b = $('<a href="#">').on('click', function(e) {
				showExploreSiblings(parentParentId, $a, e);
			});
			var $sibling = $('<span>').addClass('fa fa-hover fa-caret-down');
			$b.append($sibling);
			$b.insertAfter($a);
			
			id = folder.parentId;
			length++;
		}
	}
}

function updateExploreMove(targetFrame) {
	
	function _updateExploreMove($frame, arrow) {
		if(arrow.ids.length > 1) {
			if(arrow.index > 0) {
				$frame.find('.explore-backward span').addClass('fa-hover fa-explore-movable');
			} else {
				$frame.find('.explore-backward span').removeClass('fa-hover fa-explore-movable');
			}
			
			if(arrow.index < arrow.ids.length - 1) {
				$frame.find('.explore-forward span').addClass('fa-hover fa-explore-movable');
			} else {
				$frame.find('.explore-forward span').removeClass('fa-hover fa-explore-movable');
			}
		} else {
			$frame.find('.explore-backward span').removeClass('fa-hover fa-explore-movable');
			$frame.find('.explore-forward span').removeClass('fa-hover fa-explore-movable');
		}
	}
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	if(targetFrame == '#right-frame') {
		_updateExploreMove($rightFrame, bmp.exploreHistory.right);
	} else {
		_updateExploreMove($leftFrame, bmp.exploreHistory.left);
	}
}

function showExploreSiblings(parentId, item, e) {
	
	var $exploreSibling = selectFromCurrFrame('#explore-sibling');
		
	var results = BookmarkManager.getChildren(parentId);
	
	var $ul = $exploreSibling.find('ul');
	$ul.eq(0).children().remove();
	
	var length = results.length;
	for (var i = 0; i < length; i++) {
		if(results[i].url != undefined) continue;
		
		var $li = $('<li>').text(results[i].title).data('id', results[i].id);
		if(item.data('id') == results[i].id) {
			$li.addClass('explore-sibling-top');
			
			const $target = $li;
			// 먼저 show()가 호출되고 난 후에 이 부분을 처리해야 
			// 필요한 값을 제대로 얻을 수 있다.
			setTimeout(function() {
				
				if($target.offset().top + $target.outerHeight(true) > $ul.parent().outerHeight(true) + $ul.offset().top) {
					$exploreSibling.animate({
						scrollTop: $target.offset().top - $ul.offset().top + $ul.scrollTop(),
					}, 150);
				}
				
			}, 0);
		}
		$li.appendTo($ul);
	}
	
	var left = item.offset().left;
	var top = item.offset().top;
	var height = item.outerHeight();
	
	if(getPopupWidth(true) < left + $exploreSibling.outerWidth(true)) {
		left -= left + $exploreSibling.outerWidth(true) - getPopupWidth(true)
	}
	
	var siblingLeft = $exploreSibling.offset().left;
	var siblingTop = $exploreSibling.offset().top;
	
	if(left == siblingLeft && top == siblingTop - height) {
		$exploreSibling.hide();
		e.stopPropagation();
		return;
	}
	
	$exploreSibling.css({
		left: left,
		top: top + height,
	});
	
	// TODO:
	$exploreSibling.stop(true, true).show().scrollTop(0);
	e.stopPropagation();
}

function preview(parameter) {
	
	var id = parameter.id;
	
	var results = BookmarkManager.getChildren(id);
	
	var $ul = $leftFrame.find('#result-list');
	$ul.children().remove();
	
	var data = [];
	
	var total = results.length;
	
	var length = results.length;
	for (var i = 0; i < length; i++) {
		data.push(results[i]);
	}
	
	updateTotalItemsCount('#left-frame', total);
	updateSelectedItemsCount('#left-frame', 0);
	
	// print list
	if(data.length) {
		createList({
			queries: [], 
			data: data, 
			targetFrame: '#left-frame', 
			sortMode: "hierarchy",
			groupBar: false,
			simple: true,
		});
	
	// print empty
	} else {
		var $empty = $('<div>').addClass('empty').text(str_result_empty);
		$ul.append($empty);
	}
	
}

// id
// arrow
// target
function explore(parameter) {
	
	console.warn("explore");
	
	var id = parameter.id;
	var hierarchy = parameter.hierarchy;
	var arrow = parameter.arrow;
	var targetFrame = parameter.targetFrame;
	
	// check if id is valid
	var results = BookmarkManager.get(id);
	if(results[0] == undefined) {
		validateExploreData({
			invalid: true,
		});
		id = hierarchyToId(hierarchy);
	}
	
	if(targetFrame == undefined) {
		targetFrame = bmp.currFrame;
	}
	
	initView(targetFrame);
	
	var $targetFrame = $(targetFrame);
	
	if(targetFrame == '#right-frame') {
		$searchEditor.val("");
		$('#current-mode').text("Explore");
		bmp.isEmptySearchStarted = false;
		bmp.isShortSearchStarted = false;
		bmp.shortSearchString = "";
	}
	
	if(arrow == undefined) {
		if(targetFrame == '#right-frame') {
			var right = bmp.exploreHistory.right;
			if(right.ids[right.index] != id) {
				right.index++;
				right.ids[right.index] = id;
				right.hierarchies[right.index] = hierarchy;
				right.ids.length = right.index + 1;
				if(right.ids.length > MAX_EXPLORE_HISTORY) {
					right.ids.shift();
					right.hierarchies.shift();
					right.index--;
				}
			}
		} else {
			var left = bmp.exploreHistory.left;
			if(left.ids[left.index] != id) {
				left.index++;
				left.ids[left.index] = id;
				left.hierarchies[left.index] = hierarchy;
				left.ids.length = left.index + 1;
				if(left.ids.length > MAX_EXPLORE_HISTORY) {
					left.ids.shift();
					left.hierarchies.shift();
					left.index--;
				}
			}
		}
		
	}
	
	updateExploreMove(targetFrame);
	
	
	if(targetFrame == '#right-frame') {
		var right = bmp.exploreHierarchy.right;
		right.id = id;
		right.hierarchy = hierarchy;
		StorageManager.set({
			exploreHierarchy: bmp.exploreHierarchy,
			exploreHistory: bmp.exploreHistory,
		});
	} else {
		var left = bmp.exploreHierarchy.left;
		left.id = id;
		left.hierarchy = hierarchy;
		StorageManager.set({
			exploreHierarchy: bmp.exploreHierarchy,
			exploreHistory: bmp.exploreHistory,
		});
	}
	
	var startDate = $('#searchStartDate').val();
	var endDate = $('#searchEndDate').val();
	var startTime;
	var endTime;
	
	if(startDate.length != 0) {
		startTime = new Date($('#searchStartDate').val()).getTime();
	} else {
		startTime = 0;
	}
	
	if(endDate.length != 0) {
		endTime = new Date($('#searchEndDate').val()).setHours(24,0,0,0);
	} else {
		endTime = Number.MAX_SAFE_INTEGER;
	}
	
		
	var results = BookmarkManager.get(id);
	exploreBar({
		item: results[0], 
		targetFrame: targetFrame,
	});
	
	updateResultPanelHeight(targetFrame);
	
		
	var results = BookmarkManager.getChildren(id);
	
	var $ul = $targetFrame.find('#result-list');
	$ul.children().remove();
	
	var data = [];
	
	var folderMode = bmp.options.folder;
	var isPage = bmp.options.page;
	
	if(folderMode == "none" && !isPage && targetFrame == '#right-frame') {
		alertify.error(str_alertify_error_page_and_folder_filter, 4000);
	}

	
	var total = results.length;
	var count = 0;
	
	var length = results.length;
	for (var i = 0; i < length; i++) {
		
		// folderMode, isPage, and date are only applied to #right-frame
		if(targetFrame == '#right-frame') {
			// folder
			if(results[i].url == undefined) {
				if(folderMode == "none") continue;
				
				if(folderMode == "empty") {
					var children = BookmarkManager.getChildren(results[i].id);
					if(children.length != 0) continue;
				}
				
			// page
			} else {
				if(!isPage) continue;
			}
			
			if(results[i].dateAdded < startTime) continue;
			if(results[i].dateAdded > endTime) continue;
		}
		
		data.push(results[i]);
		count++;
	}
	
	updateFilteredItemsCount(targetFrame, total - count);
	updateTotalItemsCount(targetFrame, count);
	updateSelectedItemsCount(targetFrame, 0);
	
	// print list
	if(data.length) {
		if(targetFrame == '#right-frame') {
			createList({
				queries: [], 
				data: data, 
				targetFrame: targetFrame,
			});
		} else {
			createList({
				queries: [], 
				data: data, 
				targetFrame: targetFrame,
				sortMode: "hierarchy",
				groupBar: false,
			});
		}
	
	// print empty
	} else {
		var $empty = $('<div>').addClass('empty').text(str_result_empty);
		$ul.append($empty);
	}
}

function search(isManual) {
	
	console.warn("search");
	
	//console.time("search");
	
	if(_search(isManual) == "skipHistory") return;
	
	//console.timeEnd("search");
	
	var query =  $searchEditor.val();
	if(query.length == 0) return;
	
	var $history = $searchHistory.find('ul');
	var $li = $history.find('li');
	
	var found = false;
	
	var length = $li.length;
	for (var i = 0; i < length; i++) {
		if($li.eq(i).text() == query) {
			$li.eq(i).detach().prependTo($history);
			found = true;
			break;
		}
	}
	
	if(!found) {
		if(length > MAX_SEARCH_HISTORY) {
			$li.last().remove();
		}
		$('<li>').text(query).prependTo($history);
	}
	
	var history = [];
	
	var $li = $history.find('li');
	
	var length = $li.length;
	for (var i = 0; i < length; i++) {
		history.push($li.eq(i).text());
	}
	
	StorageManager.set({
		history: history,
	});
}

function _search(isManual) {
	
	initView('#right-frame', true);
	
	var query = $searchEditor.val();
	
	var timeSet = false;
	var startDate = $('#searchStartDate').val();
	var endDate = $('#searchEndDate').val();
	var startTime;
	var endTime;
	
	if(startDate.length != 0) {
		startTime = new Date($('#searchStartDate').val()).getTime();
		timeSet = true;
	} else {
		startTime = 0;
	}
	
	if(endDate.length != 0) {
		endTime = new Date($('#searchEndDate').val()).setHours(24,0,0,0);
		timeSet = true;
	} else {
		endTime = Number.MAX_SAFE_INTEGER;
	}
	
	var isTitle = bmp.options.title;
	var isWhole = bmp.options.whole;
	
	var isURL = bmp.options.url;
	
	var isScope = bmp.options.scope;
	
	function skipHistory() {
		return "skipHistory";
	}
	
	// short search
	if(1 <= query.length && query.length <= 2) {
		if(isManual) {
			bmp.isShortSearchStarted = true;
			bmp.shortSearchString = query;
		// 
		} else {
			if(bmp.isShortSearchStarted) {
				if(bmp.shortSearchString != query) {
					bmp.isShortSearchStarted = false;
					bmp.shortSearchString = "";
					alertify.error(str_alertify_error_too_short_query, 4000);
					return skipHistory();
				}
			} else {
				alertify.error(str_alertify_error_too_short_query, 4000);
				return skipHistory();
			}
		}
	} else {
		bmp.isShortSearchStarted = false;
		bmp.shortSearchString = "";
	}
	
	// empty search
	if(query.length == 0) {
		
		// when click a search icon or enter
		if(isManual) {
			if((isTitle && isWhole) || timeSet || isScope) {
				bmp.isEmptySearchStarted = true;
			} else {
				bmp.isEmptySearchStarted = false;
				alert(str_alert_empty_query);
				return skipHistory();
			}
			
		// 
		} else {
			if(bmp.isEmptySearchStarted) {
				if((!isTitle || !isWhole) && !timeSet && !isScope) {
					bmp.isEmptySearchStarted = false;
					return skipHistory();
				}
			} else {
				return skipHistory();
			}
		}
	} else {
		bmp.isEmptySearchStarted = false;
	}
	
	if(!isTitle && !isURL && query.length != 0) {
		alertify.error(str_alertify_error_title_and_url_filter, 4000);
	}
		
	var $ul = $rightFrame.find('#result-list');
	$ul.children().remove();
	
	var results = bmp.bookmarkData;
	
	var data = [];
	
	var folderMode = bmp.options.folder;
	var isPage = bmp.options.page;
	
	var isPhrase = bmp.options.phrase;
	
	var isCaseSensitive = bmp.options.case;
	
	var searchMode = bmp.options.search;
	
	if(folderMode == "none" && !isPage) {
		alertify.error(str_alertify_error_page_and_folder_filter, 4000);
	}
	
	var queries = [];
	
	if(isPhrase || (isTitle && isWhole)) {
		queries.push(query);
	} else {
		queries = query.split(" ").filter(function(value) {
			if(value != "") return value; 
		})
	}
	
	var flag;
	if(isCaseSensitive) {
		flag = "g";
	} else {
		flag = "gi";
	}
	
	if(searchMode == "wildcard") {
		
		queries.forEach(function(item, index) {
			queries[index] = globStringToRegex(item, flag);
			queries[index].length = item.length;
		});
		
	} else if(searchMode == "regex") {
		
		queries.forEach(function(item, index) {
			try {
				queries[index] = new RegExp(item, flag);
			} catch(e) {
				// syntax error in regular expression 
				alertify.error(e, 4000);
			}
			queries[index].length = item.length;
		});
		
	// searchMode == "normal"
	} else {
		
		queries.forEach(function(item, index) {
			queries[index] = new RegExp(preg_quote(item), flag);
			queries[index].length = item.length;
		});
		
	}
	
	var scopeIds = (isScope)? getScopeIds(bmp.exploreHierarchy.right.id) : undefined;
	function getScopeIds(id) {
		
		var ids = [id];
		var tree = BookmarkManager.getSubTree(id);
		
		iterator(tree[0].children);
		function iterator(tree) {
			var index = tree.length;
			while (index--) {
				if (tree[index].children) {
					ids.push(tree[index].id);
					iterator(tree[index].children);
				}
			}
		}
		
		return ids;
	}
	
	var warningCount = bmp.options.warning;
	var count = 0;
	
	var length = results.length;
	for (var i = 0; i < length; i++) {
		
		var isURLMatch = false;
		var isTitleMatch = false;
		
		var title = results[i].title;
		var url = results[i].url;
		
		// folder
		if(url == undefined) {
			if(folderMode == "none") continue;
			
			if(folderMode == "empty") {
				var children = BookmarkManager.getChildren(results[i].id);
				if(children.length != 0) {
					continue;
				}
			}
			
		// page
		} else {
			if(!isPage) continue;
			
			if(isURL) {
				isURLMatch = true;
				for(var j = 0; j < queries.length; j++) {
					queries[j].lastIndex = 0;
					if(!queries[j].test(url)) {
						isURLMatch = false;
						break;
					}
				}
			}
		}
		
		if(isTitle) {
			isTitleMatch = true;
			for (var j = 0; j < queries.length; j++) {
				queries[j].lastIndex = 0;
				if(!queries[j].test(title)) {
					isTitleMatch = false;
					break;
				}
			}
			
			if(isWhole) {
				if(!isTitleMatch || title.length != queries[0].length) {
					continue;
				}
			}
		}
		
		if(!isURLMatch && !isTitleMatch && query.length != 0) continue;
		
		if(isScope) {
			if(!isWithinScope(results[i], scopeIds)) continue;
			function isWithinScope(item, scopeIds) {
	
				var parentId = item.parentId;
				var isRecursive = bmp.options.recursive;
				
				if(!isRecursive && parentId != scopeIds[0]) {
					return false;
				}
				
				if(scopeIds.includes(parentId)) {
					return true;
				}
				
				return false;
			}
		}
		
		if(results[i].dateAdded < startTime) continue;
		if(results[i].dateAdded > endTime) continue;
		
		data.push(results[i]);
		count++;
		if(count == warningCount) {
			// if createList takes too long, the alert message could be swallowed. 
			// So puts it inside of setTimeout
			setTimeout(function() {
				alertify.error(String.format(str_alertify_error_warning_count, warningCount), 4000);
			}, 0);
			break;
		}
	}
	
	updateFilteredItemsCount('#right-frame', 0);
	updateTotalItemsCount('#right-frame', count);
	updateSelectedItemsCount('#right-frame', 0);
	
	if(isScope) {
		var results = BookmarkManager.get(bmp.exploreHierarchy.right.id);
		var isRecursive = bmp.options.recursive;
		setTimeout(function() {
			if(isRecursive) {
				alertify.success(String.format(str_alertify_success_scope_limit_recursive, results[0].title), 4000);
			} else {
				alertify.success(String.format(str_alertify_success_scope_limit, results[0].title), 4000);
			}
		}, 0);
	}
	
	// print list
	if(data.length) {
		createList({
			queries: queries, 
			data: data, 
			targetFrame: '#right-frame',
		});
	
	// print empty
	} else {
		var $empty = $('<div>').addClass('empty').text(str_search_result_empty);
		$ul.append($empty);
	}
	
	$rightFrame.find('#explore-panel a').removeClass('explore-view');
	$rightFrame.find('#explore-panel span').removeClass('explore-view');
	
	$('#current-mode').text("Search");
}
