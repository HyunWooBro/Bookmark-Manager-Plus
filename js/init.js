//
// by Kim Hyun-Woo
// 2017-06-22
//

'use strict';

var BookmarkManagerPlus = {
	
	//////////////////////////////////////////////////////////
	// synced data
	//////////////////////////////////////////////////
	
	exploreHierarchy: {
		left: {
			id: null,
			hierarchy: null,
		}, 
		right: {
			id: "0",
			hierarchy: [],
		}, 
	},
	
	exploreHistory: {
		left: {
			ids: [],
			hierarchies: [],
			index: -1,
		}, 
		right: {
			ids: [],
			hierarchies: [],
			index: -1,
		}, 
	},
	
	options: {
		
		// icon-toolbar-1
		title: true,
		highlight: true,
		whole: false,
		url: true,
		case: false,
		phrase: false,
		scope: false,
		recursive: true,
		incremental: true,
		
		// icon-toolbar-2
		search: DEFAULT_ICON_SEARCH_MODE,
		
		// icon-toolbar-3
		page: true,
		
		// icon-toolbar-4
		folder: DEFAULT_ICON_FOLDER_MODE,
		
		// icon-toolbar-5
		sort: DEFAULT_ICON_SORT_MODE,
		group: true,
		
		//////////////////////////////////////////////////////////
		// from options.html
		//////////////////////////////////////////////////
		
		/* 
		 *  maximum count where warning alert will appear
		 */
		warning: DEFAULT_WARNING_COUNT,
		apply: true,
	},
	
	/* 
	 *  true when initialized
	 */
	initialized: false,
	
	//////////////////////////////////////////////////////////
	// not synced data
	//////////////////////////////////////////////////
	
	/* 
	 *  true when sorting pages or folders
	 */
	isSorting: false,
	/* 
	 *  folder on which the cursor is hovering when sorting
	 */
	dropTarget: null,
	
	
	/* 
	 *  true when selecting pages or folders
	 */
	isSelecting: false,
	
	
	
	isExtending: false,
	
	
	/* 
	 *  true when a menu (context or option) is brought up
	 */
	isMenuBroughtUp: false,
	
	
	/* 
	 *  true when searching was initiated
	 */
	isSearching: false,
	
	
	/* 
	 *  true when view is appended
	 */
	isViewAppended: false,
	
	
	/* 
	 *  object returned from chrome.bookmarks.getTree()
	 */
	bookmarkTree: {},
	/* 
	 *  array similar to an array returned from chrome.bookmarks.search({})
	 */
	bookmarkData: [],

	
	
	
	
	refreshTreeEnabled: true,
	
	
	
	isHierarchyInvalidated: false,
	hierarchyCache: {},
	
	
	/* 
	 *  used for shift selection
	 */
	lastSelectIndex: -1,
	
	
	
	rightFrameX: 0,
	
	
	
	preventsMouseLeave: false,
	
	
	
	incrementalSearchTimeoutHandle: null,
	
	preveiwTimeoutHandle: null,
	
	scrollIntervalHandle: null,
	
	
	/* 
	 *  current frame (where the cursor is active)
	 */
	currFrame: "",
	
	
	
	actionMenuToolsetMaxWidth: 0,
	
	actionMenuToolsetMinWidth: 0,
	
	
	
	isEmptySearchStarted: false,
	
	isShortSearchStarted: false,
	shortSearchString: "",
	
	
	/* 
	 *  event queue being processed at the end of refreshTree()
	 */
	refreshTreeQueueEvents: [],
};

var bmp = BookmarkManagerPlus;

var $document;
var $body;

var $rightFrame;
var $leftFrame;

var $searchEditor;
var $searchHistory;

var $contextMenu;
var $optionMenu;

var $pickadates;

$(document).ready(function() {
	
	init();
		
	// remove obsolete sync data
	StorageManager.remove([
		"option", 
		"opacity", 
		"exploreId",
	]);
	
	// restore synced data
	StorageManager.get({
		// default values for sync data if not set
		
		// icon-toolbar-1
		title: true,
		highlight: true,
		whole: false,
		url: true,
		case: false,
		phrase: false,
		scope: false,
		recursive: true,
		incremental: true,
		
		// icon-toolbar-2
		search: DEFAULT_ICON_SEARCH_MODE,
		
		// icon-toolbar-3
		page: true,
		
		// icon-toolbar-4
		folder: DEFAULT_ICON_FOLDER_MODE,
		
		// icon-toolbar-5
		sort: DEFAULT_ICON_SORT_MODE,
		group: true,
		
		// icon-toolbar-6
		start: "",
		end: "",
		
		// option-menu
		append: false,
		advanced: false,
		
		// preference
		apply: true,
		warning: DEFAULT_WARNING_COUNT,
		
		// array
		history: [],
		exploreHistory: {
			left: {
				ids: [],
				hierarchies: [],
				index: -1,
			}, 
			right: {
				ids: [],
				hierarchies: [],
				index: -1,
			}, 
		},
		exploreHierarchy: {
			left: {
				id: null,
				hierarchy: null,
			}, 
			right: {
				id: "0",
				hierarchy: [],
			}, 
		},
		
	}, function(items) {
		
		//console.debug("get synced data");
		
		function initSwitch(option, $switch) {
			bmp.options[option] = items[option];
			if(items[option]) {
				$switch.removeClass('switch-off').addClass('switch-on');
			} else {
				$switch.removeClass('switch-on').addClass('switch-off');
			}
		}
		
		// title
		initSwitch('title', $('.icon-title-match').find('.switch'));
		if(!bmp.options.title) {
			$('.icon-highlight .switch-toggle').addClass('disabled');
			$('.icon-highlight > span').addClass('disabled');
			$('.icon-whole-match .switch-toggle').addClass('disabled');
			$('.icon-whole-match > span').addClass('disabled');
		}
		
		// highlight
		initSwitch('highlight', $('.icon-highlight').find('.switch'));
		
		// whole
		initSwitch('whole', $('.icon-whole-match').find('.switch'));
		
		// url
		initSwitch('url', $('.icon-url-match').find('.switch'));
		
		// case
		initSwitch('case', $('.icon-case-sensitive').find('.switch'));
		
		// phrase
		initSwitch('phrase', $('.icon-whole-phrase').find('.switch'));
		
		// scope
		initSwitch('scope', $('.icon-scope-limit').find('.switch'));
		if(!bmp.options.scope) {
			$('.icon-recursive .switch-toggle').addClass('disabled');
			$('.icon-recursive > span').addClass('disabled');
		}
		
		// recursive
		initSwitch('recursive', $('.icon-recursive').find('.switch'));
		
		// incremental
		initSwitch('incremental', $('.icon-incremental-search').find('.switch'));
		
		// search
		bmp.options.search = items.search;
		$('#icon-search-mode').removeClass('fa-basic fa-lg fa-search-normal fa-circle-thin fa-question-circle-o fa-registered');
		if(items.search == "normal") {
			$('#icon-search-mode').addClass('fa-lg fa-circle-thin fa-search-normal');
		} else if(items.search == "wildcard") {
			$('#icon-search-mode').addClass('fa-lg fa-question-circle-o');
		} else {
			$('#icon-search-mode').addClass('fa-basic fa-registered');
		}
		
		// page
		bmp.options.page = items.page;
		$('#icon-file').removeClass('fa-file fa-file-none');
		if(items.page) {
			$('#icon-file').addClass('fa-file');
		} else {
			$('#icon-file').addClass('fa-file fa-file-none');
		}
		
		// folder
		bmp.options.folder = items.folder;
		$('#icon-folder-mode').removeClass('fa-folder fa-folder-none fa-folder-o');
		if(items.folder == "none") {
			$('#icon-folder-mode').addClass('fa-folder fa-folder-none');
		} else if(items.folder == "children") {
			$('#icon-folder-mode').addClass('fa-folder');
		} else {
			$('#icon-folder-mode').addClass('fa-folder-o');
		}
		
		// sort
		bmp.options.sort = items.sort;
		$('#icon-sort-mode').removeClass('fa-sort-amount-asc fa-sort-alpha-asc fa-sort-alpha-asc fa-sort-numeric-asc fa-sort-url fa-sort-title');
		if(items.sort == "hierarchy") {
			$('#icon-sort-mode').addClass('fa-sort-amount-asc');
		} else if(items.sort == "title") {
			$('#icon-sort-mode').addClass('fa-sort-alpha-asc fa-sort-title');
		} else if(items.sort == "url") {
			$('#icon-sort-mode').addClass('fa-sort-alpha-asc fa-sort-url');
		} else {
			$('#icon-sort-mode').addClass('fa-sort-numeric-asc');
		}
		
		// group
		initSwitch('group', $('.icon-sort-mode-group-bar').find('.switch'));
		
		// start, end
		$('#searchStartDate').val(items.start);
		$('#searchEndDate').val(items.end);
		
		var fromPicker = $pickadates.eq(0).pickadate("picker");
		var toPicker = $pickadates.eq(1).pickadate("picker");
		
		// Check if there’s a “from” or “to” date to start with.
		if (fromPicker.get('value')) {
			toPicker.set('min', items.start);
			fromPicker.set('highlight', new Date(items.start));
		}
		if (toPicker.get('value')) {
			fromPicker.set('max', items.end);
			toPicker.set('highlight', new Date(items.end));
		}
		
		var $datepickers = $('.datepicker');
		if($datepickers.eq(0).val().length == 0 && $datepickers.eq(1).val().length == 0) {
			$('#icon-calendar').addClass('fa-calendar-none');
		} else {
			$('#icon-calendar').removeClass('fa-calendar-none');
		}
		
		// append
		if(items.append) {
			$optionMenu.find('li:first-child').trigger('click');
		}
		
		// advanced
		if(items.advanced) {
			$('.advanced-search-icon-toolbars').show();
			var width = bmp.actionMenuToolsetMaxWidth;
		} else {
			$('.advanced-search-icon-toolbars').hide();
			var width = bmp.actionMenuToolsetMinWidth;
		}
		
		// uses setTimeout to fix incorrect animation
		setTimeout(function() {
			$searchEditor.css('width', $('#search-set').outerWidth() 
				- width 
				- ($('#search-set > span').outerWidth() - $searchEditor.outerWidth()) 
				- 10);
		}, 250);
		
		// warning
		bmp.options.warning = items.warning;
		
		// apply
		bmp.options.apply = items.apply;
		
		// history
		var $history = $searchHistory.find('ul');
		var query;
		while (query = items.history.pop()) {
			var $li = $('<li>').text(query).prependTo($history);
		}
		
		// exploreHistory
		bmp.exploreHistory = items.exploreHistory;
		
		// exploreHierarchy
		bmp.exploreHierarchy = items.exploreHierarchy;
		explore({
			id: bmp.exploreHierarchy.right.id, 
			hierarchy: bmp.exploreHierarchy.right.hierarchy, 
			targetFrame: '#right-frame',
		});
		
		bmp.initialized = true;
	});
	
});

function init() {
	
	$document = $(document);
	$body = $('body');
	
	$rightFrame = $('#right-frame');
	$leftFrame = $('#left-frame');
	
	$searchEditor = $('#search-editor');
	$searchHistory = $('#search-history');
	
	$contextMenu = $('#context-menu');
	$optionMenu = $('#option-menu');
	
	// register refreshTree listeners
	chrome.bookmarks.onCreated.addListener(refreshTree);
	chrome.bookmarks.onRemoved.addListener(refreshTree);
	chrome.bookmarks.onChanged.addListener(refreshTree);
	chrome.bookmarks.onMoved.addListener(refreshTree);
	chrome.bookmarks.onChildrenReordered.addListener(refreshTree);
	chrome.bookmarks.onImportEnded.addListener(refreshTree);
	refreshTree();
	
	chrome.runtime.onUpdateAvailable.addListener(function(details) {
		console.debug("current version : " + str_version);
		console.debug("available version : " + details.version);
		alertify.success(String.format(str_alertify_success_version, str_version, details.version), 4000);
	});
	
	// capture event handlers for finding out the current frame before any other element handling these events.
	$rightFrame.get(0).addEventListener('mousemove', function(e) {
		bmp.currFrame = '#right-frame';
    }, true);
	$rightFrame.get(0).addEventListener('mouseenter', function(e) {
		bmp.currFrame = '#right-frame';
    }, true);
	$rightFrame.get(0).addEventListener('mouseover', function(e) {
		bmp.currFrame = '#right-frame';
    }, true);
	$leftFrame.get(0).addEventListener('mousemove', function(e) {
		bmp.currFrame = '#left-frame';
    }, true);
	$leftFrame.get(0).addEventListener('mouseenter', function(e) {
		bmp.currFrame = '#left-frame';
    }, true);
	$leftFrame.get(0).addEventListener('mouseover', function(e) {
		bmp.currFrame = '#left-frame';
    }, true);
	
	
	// Unfocus the search editor on mousedown
	$rightFrame.find('#result-panel').get(0).addEventListener('mousedown', function(e) {
		$searchEditor.blur();
    }, true);
	$leftFrame.find('#result-panel').get(0).addEventListener('mousedown', function(e) {
		$searchEditor.blur();
    }, true);
	
	
	$leftFrame.find('#result-panel').droppable({
		tolerance: "pointer", 
		over: function(e, ui) {
			if(!bmp.isSorting) return;
			if(bmp.isViewAppended) return;
			
			if(ui.helper.data('active')) {
				$(this).addClass('view-active');
			} else {
				$(this).addClass('view-active-not-possiable');
			}
		},
		out: function(e, ui) {
			if(!bmp.isSorting) return;
			if(bmp.isViewAppended) return;
			
			if(ui.helper.data('active')) {
				$(this).removeClass('view-active');
			} else {
				$(this).removeClass('view-active-not-possiable');
			}
		},
	});
	
	$('#separator').draggable({
		axis: "x",
		cursor: "w-resize",
		containment: '#containment',
		start: function(e, ui) {
			closeUI(e);
		},
		drag: function(e, ui) {
			var width = $('#separator').outerWidth();
			$leftFrame.css('width', ui.offset.left - getBodyHorizontalMargin()/2 - 2/*margin*/);
			$rightFrame.css('width', getPopupWidth() - ui.offset.left - width + getBodyHorizontalMargin()/2 - 2/*margin*/);
			
			bmp.rightFrameX = getPopupWidth() - ui.offset.left - width + getBodyHorizontalMargin()/2 - 2/*margin*/;
			
			updateExploreHierarchyMaxWidth('#left-frame');
			updateExploreHierarchyMaxWidth('#right-frame');
			
			updateResultPanelHeight('#left-frame');
			updateResultPanelHeight('#right-frame');
			
			updateGroupMaxWidth('#left-frame');
			updateGroupMaxWidth('#right-frame');
			
			updateSearchEditorWidth();
		},
	})
	
	$('#modal-cover').on({
		click: function(e) {
			if(bmp.isMenuBroughtUp) {
				endContextMenu(true);
				endOptionMenu();
				e.stopPropagation();
				e.preventDefault();
			}
		},
		contextmenu: function(e) {
			e.stopPropagation();
			e.preventDefault();
		},
	});
	
	$optionMenu.find('li').on('click', function(e) {
		if($(this).hasClass('menu-item-disabled')) return;
		
		// append-view
		if($(this).attr('id') == "append-view") {
			
			endOptionMenu();
			
			bmp.isExtending = true;
			
			$body.addClass('extend');
			$rightFrame.animate({
				width: bmp.rightFrameX,
			}, 350, "easeOutCubic", function() {
				
				$leftFrame.show();
				
				if(bmp.exploreHierarchy.left.id != null && !bmp.isViewAppended) {
					showView(bmp.exploreHierarchy.left.id);
				}
				
				$('#separator').show(250);
				
				updateExploreHierarchyMaxWidth('#left-frame');
				updateExploreHierarchyMaxWidth('#right-frame');
				
				updateResultPanelHeight('#left-frame');
				updateResultPanelHeight('#right-frame');
				
				updateSearchEditorWidth();
				
				updateGroupMaxWidth('#right-frame');
				updateGroupMaxWidth('#left-frame');
				
				bmp.isExtending = false;
				
				StorageManager.set({
					append: true,
				});
			});
			
		}
		
		// remove-view
		if($(this).attr('id') == "remove-view") {
			
			endOptionMenu();
			
			$body.removeClass('extend');
			$leftFrame.hide();
			$('#separator').hide();
			
			var width = $rightFrame.css('width');
			$rightFrame.css('width', 390);
			updateExploreHierarchyMaxWidth('#right-frame');
			$rightFrame.css('width', width);
			
			updateResultPanelHeight('#left-frame');
			updateResultPanelHeight('#right-frame');
			
			$rightFrame.animate({
				width: 390,
			}, 350,  "easeOutCubic", function() {
				updateSearchEditorWidth();
				
				updateGroupMaxWidth('#right-frame');
				updateGroupMaxWidth('#left-frame');
				
				StorageManager.set({
					append: false,
				});
			});
		}
		
		// show-advanced-search-options
		if($(this).attr('id') == "show-advanced-search-options") {
			endOptionMenu();
			$('.advanced-search-icon-toolbars').show();
			updateSearchEditorWidth();
			
			StorageManager.set({
				advanced: true,
			});
		}
		
		// hide-advanced-search-options
		if($(this).attr('id') == "hide-advanced-search-options") {
			endOptionMenu();
			$('.advanced-search-icon-toolbars').hide();
			updateSearchEditorWidth();
			
			StorageManager.set({
				advanced: false,
			});
		}
		
		// reset-icon-toolbar-options
		if($(this).attr('id') == "reset-icon-toolbar-options") {
			endOptionMenu();
			
			function resetSwitch(option, $switch, state) {
				bmp.options[option] = state;
				if(state) {
					$switch.removeClass('switch-off').addClass('switch-on');
				} else {
					$switch.removeClass('switch-on').addClass('switch-off');
				}
			}
			
			// title
			resetSwitch('title', $('.icon-title-match').find('.switch'), true);
			$('.icon-highlight .switch-toggle').removeClass('disabled');
			$('.icon-highlight > span').removeClass('disabled');
			$('.icon-whole-match .switch-toggle').removeClass('disabled');
			$('.icon-whole-match > span').removeClass('disabled');
			
			// highlight
			resetSwitch('highlight', $('.icon-highlight').find('.switch'), true);
			
			// whole
			resetSwitch('whole', $('.icon-whole-match').find('.switch'), false);
			
			// url
			resetSwitch('url', $('.icon-url-match').find('.switch'), true);
			
			// case
			resetSwitch('case', $('.icon-case-sensitive').find('.switch'), false);
			
			// phrase
			resetSwitch('phrase', $('.icon-whole-phrase').find('.switch'), false);
			
			// scope
			resetSwitch('scope', $('.icon-scope-limit').find('.switch'), false);
			$('.icon-recursive .switch-toggle').addClass('disabled');
			$('.icon-recursive > span').addClass('disabled');
			
			// recursive
			resetSwitch('recursive', $('.icon-recursive').find('.switch'), true);
			
			// incremental
			resetSwitch('incremental', $('.icon-incremental-search').find('.switch'), true);
			
			// search
			bmp.options.search = DEFAULT_ICON_SEARCH_MODE;
			$('#icon-search-mode').removeClass('fa-basic fa-lg fa-search-normal fa-circle-thin fa-question-circle-o fa-registered');
			$('#icon-search-mode').addClass('fa-lg fa-circle-thin fa-search-normal');
			
			// page
			bmp.options.page = true;
			$('#icon-file').removeClass('fa-file fa-file-none');
			$('#icon-file').addClass('fa-file');
			
			// folder
			bmp.options.folder = DEFAULT_ICON_FOLDER_MODE;
			$('#icon-folder-mode').removeClass('fa-folder fa-folder-none fa-folder-o');
			$('#icon-folder-mode').addClass('fa-folder');
			
			// sort
			bmp.options.sort = DEFAULT_ICON_SORT_MODE;
			$('#icon-sort-mode').removeClass('fa-sort-amount-asc fa-sort-alpha-asc fa-sort-alpha-asc fa-sort-numeric-asc fa-sort-url fa-sort-title');
			$('#icon-sort-mode').addClass('fa-sort-amount-asc');
			
			// group
			resetSwitch('group', $('.icon-sort-mode-group-bar').find('.switch'), true);
			
			// start, end
			$('#searchStartDate').val("");
			$('#searchEndDate').val("");
			$('#icon-calendar').addClass('fa-calendar-none');
			
			StorageManager.set({
				// icon-toolbar-1
				title: true,
				highlight: true,
				whole: false,
				url: true,
				case: false,
				phrase: false,
				scope: false,
				recursive: true,
				incremental: true,
				
				// icon-toolbar-2
				search: "normal",
				
				// icon-toolbar-3
				page: true,
				
				// icon-toolbar-4
				folder: "children",
				
				// icon-toolbar-5
				sort: "hierarchy",
				group: true,
				
				// icon-toolbar-6
				start: "",
				end: "",
			});
			
			decideApply();
			
			alertify.success(str_alertify_success_scope_reset_options, 2000);
		}
		
		// bookmark-info
		if($(this).attr('id') == "bookmark-info") {
			endOptionMenu();
			startCover();
			showBookmarkInfo();
		}
		
		// preference
		if($(this).attr('id') == "preference") {
			endOptionMenu();
			startCover();
			showPreference();
		}
		
		// about
		if($(this).attr('id') == "about") {
			endOptionMenu();
			startCover();
			showAbout();
		}
	});
	
	$contextMenu.find('li').on('click', function(e) {
		if($(this).hasClass('menu-item-disabled')) return;
		
		// open-in-new-tab
		if($(this).attr('id') == "open-in-new-tab") {
			TabManager.create({
				url: $document.data('url'),
				active: false,
			});
			endContextMenu(true);
		}
		
		// open-in-new-window
		if($(this).attr('id') == "open-in-new-window") {
			WindowManager.create({
				url: $document.data('url'),
			});
			endContextMenu(true);
		}
		
		// open-in-incognito-window
		if($(this).attr('id') == "open-in-incognito-window") {
			WindowManager.create({
				url: $document.data('url'),
				incognito: true,
			});
			endContextMenu(true);
		}
		
		// open-all-in-new-tab
		if($(this).attr('id') == "open-all-in-new-tab") {
			var urls = $document.data('urls');
			var length = urls.length;
			for (var i = 0; i < length; i++) {
				if(urls[i] == undefined) continue;
				
				TabManager.create({
					url: urls[i],
					active: false,
				});
			}
			
			var subUrls = $document.data('subUrls');
			if(subUrls != undefined) {
				var length = subUrls.length;
				for (var i = 0; i < length; i++) {
					if(subUrls[i] == undefined) continue;
					
					TabManager.create({
						url: subUrls[i],
						active: false,
					});
				}
			}
			endContextMenu(true);
		}
		
		// open-all-in-new-window
		if($(this).attr('id') == "open-all-in-new-window") {
			var urls = $document.data('urls');
			var i = urls.length;
			while(i--) {
				if(urls[i] == undefined) {
					urls.remove(i);
				}
			}
			
			var subUrls = $document.data('subUrls');
			if(subUrls != undefined) {
				var i = subUrls.length;
				while(i--) {
					if(subUrls[i] == undefined) {
						subUrls.remove(i);
					}
				}
				urls = urls.concat(subUrls);
			}
			
			WindowManager.create({
				url: urls,
			});
			endContextMenu(true);
		}
		
		// open-all-in-incognito-window
		if($(this).attr('id') == "open-all-in-incognito-window") {
			var urls = $document.data('urls');
			var i = urls.length;
			while(i--) {
				if(urls[i] == undefined) {
					urls.remove(i);
				}
			}
			
			var subUrls = $document.data('subUrls');
			if(subUrls != undefined) {
				var i = subUrls.length;
				while(i--) {
					if(subUrls[i] == undefined) {
						subUrls.remove(i);
					}
				}
				urls = urls.concat(subUrls);
			}
			
			WindowManager.create({
				url: urls,
				incognito: true,
			});
			endContextMenu(true);
		}
		
		// copy
		if($(this).attr('id') == "copy") {
			$document.data('clipboard', {
				type: "copy",
				ids: $document.data('ids'), 
				titles: $document.data('titles'), 
				urls: $document.data('urls')
			});
			endContextMenu(true);
		}
		
		// cut
		if($(this).attr('id') == "cut") {
			$document.data('clipboard', {
				type: "cut",
				parentIds: $document.data('parentIds'),
				ids: $document.data('ids'),
				indices: $document.data('indices')
			});
			
			$('.cut').removeClass('cut');
			
			var $selected = getSelectedItems();
			if($selected.length) {
				var length = $selected.length;
				for(var i = 0; i < length; i++) {
					$selected.eq(i).addClass('cut');
				}
			} else {
				var $hover = getHoverItem();
				
				// item
				if($hover.length) {
					$hover.addClass('cut');
				
				// group
				} else {
					var items = getGroupItems($document.data('group'));
					var length = items.length;
					for(var i = 0; i < length; i++) {
						items[i].addClass('cut');
					}
				}
			}
			
			endContextMenu(true);
		}
		
		// paste
		if($(this).attr('id') == "paste") {
			
			var clipboard = $document.data('clipboard');
			
			var parentId = $document.data('parentId');		// not null
			var id = $document.data('id');
			var title = $document.data('title');
			var url = $document.data('url');
			var index = $document.data('index');
			var folder = $document.data('folder');			// true or false
			
			var currFrame = bmp.currFrame;
			
			bmp.refreshTreeEnabled = false;
			
			// copy
			if(clipboard.type == "copy") {
				
				var ids = clipboard.ids;
				var titles = clipboard.titles;
				var urls = clipboard.urls;
				
				var totalCount = ids.length;
				var currCount = 0;
				
				// into folder
				if(folder) {
					var length = ids.length;
					for (var i = 0; i < length; i++) {
						pasteCopy({
							parentId: id, 
							id: ids[i],
							title: titles[i],
							url: urls[i],
							callback: function() {
								currCount++;
								if(totalCount == currCount) {
									var results = BookmarkManager.get(id);
									queueSelectedClass({
										item: results[0],
										targetFrame: currFrame,
									});
									bmp.refreshTreeEnabled = true;
									refreshTree();
								}
							},
						});
					}
				
				// into list
				} else {
					
					if(index == undefined) {
						var results = BookmarkManager.getChildren(parentId);
						index = results.length - 1;
					}
					
					for (var i = ids.length - 1; i > -1; i--) {
						pasteCopy({
							parentId: parentId, 
							id: ids[i],
							title: titles[i],
							url: urls[i],
							index: index,
							callback: function(result) {
								queueSelectedClass({
									item: result,
									targetFrame: currFrame,
								});
								currCount++;
								if(totalCount == currCount) {
									bmp.refreshTreeEnabled = true;
									refreshTree();
								}
							},
						});
					}
				}
				
			// cut
			} else {
				
				var parentIds = clipboard.parentIds;
				var ids = clipboard.ids;
				var indices = clipboard.indices;
				
				var oldData = prepareMovingItems(ids, parentIds, indices);
				
				// into folder
				if(folder) {
					var length = ids.length;
					for (var i = 0; i < length; i++) {
						if(i == ids.length - 1) {
							pasteCut({
								parentId: id, 
								id: ids[i],
								callback: function() {
									var results = BookmarkManager.get(id);
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
									$document.removeData('clipboard');
								},
							});
						} else {
							pasteCut({
								parentId: id, 
								id: ids[i],
							});
						}
					}
				
				// into list
				} else {
					
					if(index == undefined) {
						var results = BookmarkManager.getChildren(parentId);
						index = results.length;
					} else {
						index++;
					}
					
					var tempIndex = index;
					
					for (var i = ids.length - 1; i > -1; i--) {
						
						// cut to the same folder
						if(parentIds[i] == parentId) {
							if(indices[i] < tempIndex) {
								var cutIndex = tempIndex--;
							} else {
								var cutIndex = tempIndex;
							}
							
						// cut to another folder
						} else {
							var cutIndex = tempIndex;
						}
						
						
						if(i == 0) {
							pasteCut({
								parentId: parentId, 
								id: ids[i],
								index: cutIndex,
								callback: function(result) {
									bmp.refreshTreeEnabled = true;
									refreshTree(function() {
										validateMovingItems(oldData, parentId);
										validateExploreData({
											moved: true,
										});
									});
									$document.removeData('clipboard');
									
									queueSelectedClass({
										item: result,
										targetFrame: currFrame,
									});
								},
							});
						} else {
							pasteCut({
								parentId: parentId, 
								id: ids[i],
								index: cutIndex,
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
				
				
			}
			
			
			endContextMenu(true);
		}
		
		
		
		if($(this).attr('id') == "show-in-folder") {
			explore({
				id: $document.data('parentId'),
				hierarchy: idToHierarchy($document.data('parentId')), 
			});
			endContextMenu(true);
		}
		
		if($(this).attr('id') == "expand-all-groups") {
			var $groups = selectFromCurrFrame('#result-list li.group-hide');
			var length = $groups.length;
			for (var i = 0; i < length; i++) {
				$groups.eq(i).find('.group-view').trigger('click');
			}
			endContextMenu(true);
		}
		
		if($(this).attr('id') == "collapse-all-groups") {
			var $groups = selectFromCurrFrame('#result-list li:not(.group-hide)');
			var length = $groups.length;
			for (var i = 0; i < length; i++) {
				$groups.eq(i).find('.group-view').trigger('click');
			}
			endContextMenu(true);
		}
		
		if($(this).attr('id') == "edit") {
			endContextMenu();
			startCover();
			showEditor($document.data('id'));
		}
		
		if($(this).attr('id') == "delete") {
			var ids = $document.data('ids');
			var urls = $document.data('urls');
			
			if(confirm(str_confirm_delete)) {
				bmp.refreshTreeEnabled = false;
				
				var oldCounts = BookmarkManager.getTreeCounts();
				
				var length = ids.length;
				for(var i = 0; i < length; i++) {
					if(i == ids.length - 1) {
						remove({
							id: ids[i], 
							url: urls[i],
							callback: function() {
								bmp.refreshTreeEnabled = true;
								refreshTree(function() {
									var counts = BookmarkManager.getTreeCounts();
									var diffFolderCount = oldCounts[0] - counts[0];
									var diffPageCount = oldCounts[1] - counts[1];
									alertify.success(String.format(str_alertify_success_delete, diffFolderCount, diffPageCount), 3000);
									validateExploreData({
										deleted: true,
									});
								});
							},
						});
					} else {
						remove({
							id: ids[i], 
							url: urls[i],
						});
					}
					
				}
			}
			
			endContextMenu(true);
		}
		
		if($(this).attr('id') == "add-page") {
			endContextMenu();
			startCover();
			addPage();
		}
		
		
		if($(this).attr('id') == "add-folder") {
			endContextMenu();
			startCover();
			addFolder();
		}
		
		if($(this).attr('id') == "folder-info") {
			var id = $document.data('id');
			var title = $document.data('title');
			
			endContextMenu();
			startCover();
			showFolderInfo(id, title);
		}
		
		e.stopPropagation();
	});
	
	$document.on({
		mousewheel: function(e) {
			// e.originalEvent
			//console.debug(e);
		},
		click: function(e) {
			closeUI(e);
		},
		contextmenu: function(e) {
			// default contextmenu events are not permitted except for #search-editor
			if($('#search-editor').get(0) != document.activeElement) {
				e.preventDefault();
			}
		},
		keydown: function(e) {
			
			// [Enter]
			if(e.keyCode == KeyEvent.DOM_VK_RETURN) {
				$('[class~=button-ok]:not(:hidden)').trigger('click');
				e.preventDefault();
			}
			
			// [ESC]
			if(e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
				$('[class~=button-cancel]:not(:hidden)').trigger('click');
				e.preventDefault();
			}
			
			// In the case of modal windows, keyCode event handling should be prevented
			if(!$('#modal-cover').is(":hidden")) {
				return;
			}
			
			// below this, any search, text inputs don't handle following keyCode events
			var $focused = $(document.activeElement);
			if($focused.length) {
				if($focused.attr('type') == "search" || $focused.attr('type') == "text") {
					return;
				}
			}
			
			// [Backspace] || [Left]
			if(e.keyCode == KeyEvent.DOM_VK_BACK_SPACE || e.keyCode == KeyEvent.DOM_VK_LEFT) {
				selectFromCurrFrame('.explore-backward').trigger('click');
			}
			
			// [Right]
			if(e.keyCode == KeyEvent.DOM_VK_RIGHT) {
				selectFromCurrFrame('.explore-forward').trigger('click');
			}
			
			// [Up]
			// if(e.keyCode == KeyEvent.DOM_VK_UP) {
				// var $selected = getSelectedItems();
				// if($selected.length) {
					// var $li = $(selectFromCurrFrame('#result-list li:not(.group)'));
					// var index = $li.index($selected.eq(0));
					// if(index > 0) {
						// unselectAllItems();
						// $li.eq(index - 1).addClass('ui-selected');
					// }
					// e.preventDefault();
				// }
			// }
			
			// [Down]
			// if(e.keyCode == KeyEvent.DOM_VK_DOWN) {
				// var $selected = getSelectedItems();
				// if($selected.length) {
					// var $li = $(selectFromCurrFrame('#result-list li:not(.group)'));
					// var index = $li.index($selected.eq(0));
					// if(index < $li.length - 1) {
						// unselectAllItems();
						// $li.eq(index + 1).addClass('ui-selected');
					// }
					// e.preventDefault();
				// }
			// }
			
			// [Delete]
			// Delete 
			if(e.keyCode == KeyEvent.DOM_VK_DELETE) {
				
				var $selected = getSelectedItems();
				if($selected.length) {
					removeContextData();
					setContextData.call($selected.eq(0));
				
					var ids = $document.data('ids');
					var urls = $document.data('urls');
					
					if(confirm(str_confirm_delete)) {
						bmp.refreshTreeEnabled = false;
						
						var oldCounts = BookmarkManager.getTreeCounts();
						
						var length = ids.length;
						for(var i = 0; i < length; i++) {
							if(i == ids.length - 1) {
								remove({
									id: ids[i], 
									url: urls[i],
									callback: function() {
										bmp.refreshTreeEnabled = true;
										refreshTree(function() {
											var counts = BookmarkManager.getTreeCounts();
											var diffFolderCount = oldCounts[0] - counts[0];
											var diffPageCount = oldCounts[1] - counts[1];
											alertify.success(String.format(str_alertify_success_delete, diffFolderCount, diffPageCount), 3000);
											validateExploreData({
												deleted: true,
											});
										});
									},
								});
							} else {
								remove({
									id: ids[i], 
									url: urls[i],
								});
							}
							
						}
					}
				}
				
				e.preventDefault();
			}
			
			// [Ctrl + a]
			// Select all
			// [Ctrl + Shift + a]
			// Append/Remove View
			if(e.keyCode == KeyEvent.DOM_VK_A) {
				if(e.ctrlKey && !e.shiftKey) {
					selectFromCurrFrame('#result-panel').focus();
					selectAllItems();
					e.preventDefault();
				}
				
				if(e.ctrlKey && e.shiftKey) {
					if($body.hasClass('extend')) {
						$('#remove-view').trigger('click');
					} else {
						$('#append-view').trigger('click');
					}
					e.preventDefault();
				}
			}
			
			// [Ctrl + b]
			// Add page
			if(e.keyCode == KeyEvent.DOM_VK_B) {
				if(e.ctrlKey && !e.shiftKey) {
					
					if(!bmp.isSearching || !bmp.currFrame == '#right-frame') {

						var $selected = getSelectedItems();
						if($selected.length) {
							setContextData.call($selected.eq(0), true);
						} else {
							removeContextData();
							
							var parentId;
							if(bmp.currFrame == '#right-frame') {
								parentId = bmp.exploreHierarchy.right.id;
							} else {
								parentId = bmp.exploreHierarchy.left.id;
							}
							
							var results = BookmarkManager.get(parentId);
							$document.data('parentId', results[0].id);
							$document.data('id', results[0].id);
							$document.data('title', results[0].title);
							
							$document.data('folder', false);
						}
						
						startCover();
						addPage();
					}
					
					e.preventDefault();
				}
			}
			
			// [Ctrl + c]
			// Copy
			if(e.keyCode == KeyEvent.DOM_VK_C) {
				if(e.ctrlKey && !e.shiftKey) {
					//test();
					
					var $selected = getSelectedItems();
					if($selected.length) {
						removeContextData();
						setContextData.call($selected.eq(0));
						$document.data('clipboard', {
							type: "copy",
							ids: $document.data('ids'), 
							titles: $document.data('titles'), 
							urls: $document.data('urls')
						});
					}
					
					
					e.preventDefault();
				}
			}
			
			// [Ctrl + d]
			// if(e.keyCode == KeyEvent.DOM_VK_D) {
				// if(e.ctrlKey && !e.shiftKey) {
					// e.preventDefault();
				// }
			// }
			
			// [Ctrl + e]
			// Edit (Item)
			if(e.keyCode == KeyEvent.DOM_VK_E) {
				if(e.ctrlKey && !e.shiftKey) {
					var $selected = getSelectedItems();
					if($selected.length) {
						removeContextData();
						setContextData.call($selected.eq(0));
						showEditor($document.data('id'));
					}
					e.preventDefault();
				}
			}
			
			// [Ctrl + f]
			// Add folder
			if(e.keyCode == KeyEvent.DOM_VK_F) {
				if(e.ctrlKey && !e.shiftKey) {
					
					if(!bmp.isSearching || !bmp.currFrame == '#right-frame') {
					
						var $selected = getSelectedItems();
						if($selected.length) {
							setContextData.call($selected.eq(0), true);
						} else {
							removeContextData();
							
							var parentId;
							if(bmp.currFrame == '#right-frame') {
								parentId = bmp.exploreHierarchy.right.id;
							} else {
								parentId = bmp.exploreHierarchy.left.id;
							}
							
							var results = BookmarkManager.get(parentId);
							$document.data('parentId', results[0].id);
							$document.data('id', results[0].id);
							$document.data('title', results[0].title);
							
							$document.data('folder', false);
						}
						
						startCover();
						addFolder();
					}
					
					e.preventDefault();
				}
			}
			
			// Ctrl + g
			// if(e.keyCode == KeyEvent.DOM_VK_G) {
				// if(e.ctrlKey && !e.shiftKey) {
					// e.preventDefault();
				// }
			// }
			
			// [Ctrl + r]
			// Reset
			if(e.keyCode == KeyEvent.DOM_VK_R) {
				if(e.ctrlKey && !e.shiftKey) {
					$('#reset-icon-toolbar-options').trigger('click');
					e.preventDefault();
				}
			}
			
			// [Ctrl + s]
			// Edit (Search)
			if(e.keyCode == KeyEvent.DOM_VK_S) {
				if(e.ctrlKey && !e.shiftKey) {
					$searchEditor.focus();
					e.preventDefault();
				}
			}
			
			// [Ctrl + v]
			// Paste
			if(e.keyCode == KeyEvent.DOM_VK_V) {
				if(e.ctrlKey && !e.shiftKey) {
					
					var $selected = getSelectedItems();
					var pastable = true;
					
					if(bmp.isSearching && bmp.currFrame == '#right-frame') {
						if($selected.length) {
							if($selected.eq(0).data('url') != undefined) {
								pastable = false;
							}
						} else {
							pastable = false;
						}
					}
					
					// 왼쪽 : true
					// 오른쪽(검색X) : true
					// 오른쪽(검색O, 폴더 선택) : true
					// 오른쪽(검색O, 페이지 선택) : false
					// 오른쪽(검색O, 선택X) : false
					
					if(pastable) {
						if($selected.length) {
							setContextData.call($selected.eq(0), true);
						} else {
							removeContextData();
							
							var parentId;
							if(bmp.currFrame == '#right-frame') {
								parentId = bmp.exploreHierarchy.right.id;
							} else {
								parentId = bmp.exploreHierarchy.left.id;
							}
							
							var results = BookmarkManager.get(parentId);
							$document.data('parentId', results[0].id);
							$document.data('id', results[0].id);
							$document.data('title', results[0].title);
							
							$document.data('folder', false);
						}
						
						var clipboard = $document.data('clipboard');
				
						var parentId = $document.data('parentId');		// not null
						var id = $document.data('id');
						var title = $document.data('title');
						var url = $document.data('url');
						var index = $document.data('index');
						var folder = $document.data('folder');			// true or false
						
						var currFrame = bmp.currFrame;
						
						bmp.refreshTreeEnabled = false;
						
						// copy
						if(clipboard.type == "copy") {
							
							var ids = clipboard.ids;
							var titles = clipboard.titles;
							var urls = clipboard.urls;
							
							var totalCount = ids.length;
							var currCount = 0;
							
							// into folder
							if(folder) {
								var length = ids.length;
								for (var i = 0; i < length; i++) {
									pasteCopy({
										parentId: id, 
										id: ids[i],
										title: titles[i],
										url: urls[i],
										callback: function() {
											currCount++;
											if(totalCount == currCount) {
												var results = BookmarkManager.get(id);
												queueSelectedClass({
													item: results[0],
													targetFrame: currFrame,
												});
												bmp.refreshTreeEnabled = true;
												refreshTree();
											}
										},
									});
								}
							
							// into list
							} else {
								
								if(index == undefined) {
									var results = BookmarkManager.getChildren(parentId);
									index = results.length - 1;
								}
								
								for (var i = ids.length - 1; i > -1; i--) {
									pasteCopy({
										parentId: parentId, 
										id: ids[i],
										title: titles[i],
										url: urls[i],
										index: index,
										callback: function(result) {
											queueSelectedClass({
												item: result,
												targetFrame: currFrame,
											});
											currCount++;
											if(totalCount == currCount) {
												bmp.refreshTreeEnabled = true;
												refreshTree();
											}
										},
									});
								}
							}
							
						// cut
						} else {
							
							var parentIds = clipboard.parentIds;
							var ids = clipboard.ids;
							var indices = clipboard.indices;
							
							var oldData = prepareMovingItems(ids, parentIds, indices);
							
							// into folder
							if(folder) {
								var length = ids.length;
								for (var i = 0; i < length; i++) {
									if(i == ids.length - 1) {
										pasteCut({
											parentId: id, 
											id: ids[i],
											callback: function() {
												var results = BookmarkManager.get(id);
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
												$document.removeData('clipboard');
											},
										});
									} else {
										pasteCut({
											parentId: id, 
											id: ids[i],
										});
									}
								}
							
							// into list
							} else {
								
								if(index == undefined) {
									var results = BookmarkManager.getChildren(parentId);
									index = results.length;
								} else {
									index++;
								}
								
								var tempIndex = index;
								
								for (var i = ids.length - 1; i > -1; i--) {
									
									// cut to the same folder
									if(parentIds[i] == parentId) {
										if(indices[i] < tempIndex) {
											var cutIndex = tempIndex--;
										} else {
											var cutIndex = tempIndex;
										}
										
									// cut to another folder
									} else {
										var cutIndex = tempIndex;
									}
									
									
									if(i == 0) {
										pasteCut({
											parentId: parentId, 
											id: ids[i],
											index: cutIndex,
											callback: function(result) {
												bmp.refreshTreeEnabled = true;
												refreshTree(function() {
													validateMovingItems(oldData, parentId);
													validateExploreData({
														moved: true,
													});
												});
												$document.removeData('clipboard');
												
												queueSelectedClass({
													item: result,
													targetFrame: currFrame,
												});
											},
										});
									} else {
										pasteCut({
											parentId: parentId, 
											id: ids[i],
											index: cutIndex,
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
							
						}
					}
					
					e.preventDefault();
				}
			}
			
			// [Ctrl + x]
			// Cut
			if(e.keyCode == KeyEvent.DOM_VK_X) {
				if(e.ctrlKey && !e.shiftKey) {
					
					var $selected = getSelectedItems();
					if($selected.length) {
						removeContextData();
						setContextData.call($selected.eq(0));
						$document.data('clipboard', {
							type: "cut",
							parentIds: $document.data('parentIds'),
							ids: $document.data('ids'),
							indices: $document.data('indices')
						});
						
						$('.cut').removeClass('cut');
						
						var $selected = getSelectedItems();
						if($selected.length) {
							var length = $selected.length;
							for(var i = 0; i < length; i++) {
								$selected.eq(i).addClass('cut');
							}
						} else {
							var $hover = getHoverItem();
							
							// item
							if($hover.length) {
								$hover.addClass('cut');
							
							// group
							} else {
								var items = getGroupItems($document.data('group'));
								var length = items.length;
								for(var i = 0; i < length; i++) {
									items[i].addClass('cut');
								}
							}
						}
					}
					
					
					e.preventDefault();
				}
			}
			
			// [ESC]
			if(e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
				if(getSelectedItemsCount(bmp.currFrame) > 0) {
					unselectAllItems();
				}
				
				// prevent from exiting
				e.preventDefault();
			}
		},
	});
	
	$document.on('contextmenu', '#result-panel', function(e) {
		
		if(bmp.currFrame == '#left-frame' && !bmp.isViewAppended) {
			e.preventDefault();
			return;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		if(bmp.isSearching && bmp.currFrame == '#right-frame') {
			buildContextMenu([
				"open-all-in-new-tab",
				"open-all-in-new-window",
				"open-all-in-incognito-window",
				"-",
				"expand-all-groups",
				"collapse-all-groups",
			]);
		} else {
			buildContextMenu([
				"open-all-in-new-tab",
				"open-all-in-new-window",
				"open-all-in-incognito-window",
				"-",
				"paste",
				"-",
				"add-folder",
				"add-page",
				"-",
				"expand-all-groups",
				"collapse-all-groups",
				"-",
				"folder-info",
			]);
		}
		
		removeContextData();
		var parentId;
		if(bmp.currFrame == '#right-frame') {
			if(!bmp.isSearching) {
				parentId = bmp.exploreHierarchy.right.id;
			}
		} else {
			parentId = bmp.exploreHierarchy.left.id;
		}
		
		if(parentId != undefined) {
			var results = BookmarkManager.get(parentId);
			$document.data('parentId', results[0].id);
			$document.data('id', results[0].id);
			$document.data('title', results[0].title);
		}
		
		$document.data('folder', false);
		
		var items = getAllItems();
		
		var parentIds = [];
		var ids = [];
		var titles = [];
		var urls = [];
		var indices = [];
		
		var length = items.length;
		for(var i = 0; i < length; i++) {
			parentIds.push(items.eq(i).data('parentId'));
			ids.push(items.eq(i).data('id'));
			titles.push(items.eq(i).data('title'));
			urls.push(items.eq(i).data('url'));
			indices.push(items.eq(i).data('index'));
		}
		
		$document.data('parentIds', parentIds);
		$document.data('ids', ids);
		$document.data('titles', titles);
		$document.data('urls', urls);
		$document.data('indices', indices);
		
		updateContextMenuPosition(e);
		startContextMenu();
		
	});
	
	$document.on('contextmenu', '#result-panel li.group', function(e) {
		
		e.preventDefault();
		e.stopPropagation();
		
		if(bmp.isSearching && bmp.currFrame == '#right-frame') {
			buildContextMenu([
				"open-all-in-new-tab",
				"open-all-in-new-window",
				"open-all-in-incognito-window",
				"-",
				"copy",
				"cut",
				"-",
				"delete",
				"-",
				"expand-all-groups",
				"collapse-all-groups",
			]);
		} else {
			buildContextMenu([
				"open-all-in-new-tab",
				"open-all-in-new-window",
				"open-all-in-incognito-window",
				"-",
				"copy",
				"cut",
				"paste",
				"-",
				"delete",
				"-",
				"add-folder",
				"add-page",
				"-",
				"expand-all-groups",
				"collapse-all-groups",
			]);
		}
		
		removeContextData();
		$document.data('parentId', $(this).data('parentId'));
		$document.data('folder', false);
		
		var items = getGroupItems($(this));
		$document.data('group', $(this));
		
		var parentIds = [];
		var ids = [];
		var titles = [];
		var urls = [];
		var indices = [];
		
		var length = items.length;
		for(var i = 0; i < length; i++) {
			parentIds.push(items[i].data('parentId'));
			ids.push(items[i].data('id'));
			titles.push(items[i].data('title'));
			urls.push(items[i].data('url'));
			indices.push(items[i].data('index'));
		}
		
		$document.data('parentIds', parentIds);
		$document.data('ids', ids);
		$document.data('titles', titles);
		$document.data('urls', urls);
		$document.data('indices', indices);
		
		unselectAllItems();
		
		updateContextMenuPosition(e);
		startContextMenu();
		
	});
	
	$document.on('contextmenu', '#result-panel li:not(.group)', function(e) {
		
		e.preventDefault();
		e.stopPropagation();
		
		var isMultiple = false;
		var selectCount = getSelectedItemsCount(bmp.currFrame);
		if(selectCount > 0) {
			if($(this).hasClass('ui-selected')) {
				if(selectCount != 1) {
					isMultiple = true;
				}
			} else {
				unselectAllItems();
			}
		}
		
		var data;
		
		if(isMultiple) {
			if(bmp.isSearching && bmp.currFrame == '#right-frame') {
				data = [
					"open-all-in-new-tab",
					"open-all-in-new-window",
					"open-all-in-incognito-window",
					"-",
					"copy",
					"cut",
					"-",
					"delete",
					"-",
					"add-folder",
					"add-page",
				];
			} else {
				data = [
					"open-all-in-new-tab",
					"open-all-in-new-window",
					"open-all-in-incognito-window",
					"-",
					"copy",
					"cut",
					"paste",
					"-",
					"delete",
					"-",
					"add-folder",
					"add-page",
				];
			}
		} else {
			if(bmp.isSearching && bmp.currFrame == '#right-frame') {
				data = [
					"-",
					"copy",
					"cut",
					"-",
					"show-in-folder",
					"edit",
					"delete",
				];
			} else {
				data = [
					"-",
					"copy",
					"cut",
					"paste",
					"-",
					"edit",
					"delete",
					"-",
					"add-folder",
					"add-page",
				];
			}
			
			if($(this).data('url') == undefined) {
				data.unshift("open-all-in-incognito-window");
				data.unshift("open-all-in-new-window");
				data.unshift("open-all-in-new-tab");
			} else {
				data.unshift("open-in-incognito-window");
				data.unshift("open-in-new-window");
				data.unshift("open-in-new-tab");
			}
		}
		
		if($(this).data('url') == undefined) {
			data.push("-");
			data.push("folder-info");
			
			// if bmp.isSearching is true and the target to which contextmenu opened 
			// is a folder, we add cut.
			if(bmp.isSearching) {
				var index = data.indexOf("cut");
				data.insert(index + 1, "paste")
			}
		}
		
		removeContextData();
		setContextData.call(this);
		
		buildContextMenu(data);
		
		updateContextMenuPosition(e);
		startContextMenu();
		
	});
	
	$('#search-icon').on('click', function() {
		search(true);
	});
	
	// search event : when user enters or clicks the cancel button (e.keyCode is undefined)
	// input event : when user inputs (e.keyCode is undefined)
	// change event : when losing focus (e.keyCode is undefined)
	
	$searchEditor.on({
		keyup: function(e) {
			// [Any key except Enter]
			if(bmp.options.incremental && e.keyCode != KeyEvent.DOM_VK_RETURN) {
				clearTimeout(bmp.incrementalSearchTimeoutHandle);
				bmp.incrementalSearchTimeoutHandle = setTimeout(search, INCREMENTAL_SEARCH_TIMEOUT_DELAY);
			}
			
			// [Enter]
			if(e.keyCode == KeyEvent.DOM_VK_RETURN) {
				search(true);
			}
		},
		keydown: function(e) {
			// [ESC]
			if(e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
				if($(this).val().length == 0) {
					$(this).blur();
				}
			}
			
			// [Up]
			if(e.keyCode == KeyEvent.DOM_VK_UP) {
				
				var query = $(this).val();
				var $history = $searchHistory.find('li');
				
				var length = $history.length;
				if(length == 0) return;
				
				if(query.length == 0) {
					$(this).val($history.eq(length - 1).text());
					return;
				}
				
				for (var i = 0; i < length; i++) {
					if($history.eq(i).text() == query) {
						
						if(i > 0) {
							$(this).val($history.eq(i - 1).text());
						} else {
							return;
						}
					}
				}
			}
			
			// [Down]
			if(e.keyCode == KeyEvent.DOM_VK_DOWN) {
				
				var query = $(this).val();
				var $history = $searchHistory.find('li');
				
				var length = $history.length;
				if(length == 0) return;
				
				if(query.length == 0) {
					$(this).val($history.eq(0).text());
					return;
				}
				
				for (var i = 0; i < length; i++) {
					if($history.eq(i).text() == query) {
						
						if(i < length - 1) {
							$(this).val($history.eq(i + 1).text());
						}
							
						return;
					}
				}
				
				$(this).val($history.eq(0).text());
			}
		}
	});	
	
	$('.search-extend-trigger').on('click', function() {
		if($(this).find('span').hasClass('fa-plus')) {
			if($body.hasClass('extend')) {
				$searchEditor.css('width', bmp.rightFrameX - 100);
				//console.error('max-width ' + (bmp.rightFrameX - 80));
			} else {
				$searchEditor.css('width', 290);
			}
			
			$('#icon-set').finish();
			$('#icon-set').animate({
				opacity: 0
			}, 300, function() {
				$('#icon-set').hide();
				$('.search-extend-trigger').find('span').toggleClass('fa-plus fa-minus');
				//updateResultPanelHeight('#right-frame');
			});
			
		} else {
			
			if($('.advanced-search-icon-toolbars').css('display') == "none") {
				var width = bmp.actionMenuToolsetMinWidth;
			} else {
				var width = bmp.actionMenuToolsetMaxWidth;
			}
			
			$searchEditor.css('width', $('#search-set').outerWidth() 
				- width 
				- ($('#search-set > span').outerWidth() - $searchEditor.outerWidth()) 
				- 10);
			
			$('#icon-set').finish();
			$('#icon-set').show();
			$('#icon-set').animate({opacity: 1}, 300, function() {
				$('.search-extend-trigger').find('span').toggleClass('fa-plus fa-minus');
				//updateResultPanelHeight('#right-frame');
			});
		}
	});
	
	$('.search-history-trigger').on('click', function(e) {
		if($searchHistory.find('li').length == 0) return;
		
		if($searchHistory.is(":hidden")) {
			$(this).find('span').toggleClass('fa-chevron-up fa-chevron-down');
			var borderWidth = $searchHistory.outerWidth() - $searchHistory.innerWidth();
			var width = $('#search-set > span').outerWidth() - borderWidth;
			$searchHistory.css({
				width: width,
			});
			$searchHistory.show();
		} else {
			$(this).find('span').toggleClass('fa-chevron-up fa-chevron-down');
			$searchHistory.hide();
		}
		e.stopPropagation();
	});
	
	$('#view-hide').on('click', function() {
		hideView();
	});
	
	$('.toolset-folder').on('click', function(e) {
		explore({
			id: $(this).closest('li').data('parentId'),
			hierarchy: idToHierarchy($(this).closest('li').data('parentId')),
		});
		e.stopPropagation();
	});
	
	$('.toolset-edit').on('click', function(e) {
		var id = $(this).closest('li').data('id');
		startCover();
		showEditor(id);
		e.stopPropagation();
	});
	
	$('.toolset-trashcan').on('click', function(e) {
		var id = $(this).closest('li').data('id');
		var url = $(this).closest('li').data('url');
		
		if(confirm(str_confirm_delete)) {
			bmp.refreshTreeEnabled = false;
			
			var oldCounts = BookmarkManager.getTreeCounts();
			
			remove({
				id: id, 
				url: url,
				callback: function() {
					bmp.refreshTreeEnabled = true;
					refreshTree(function() {
						var counts = BookmarkManager.getTreeCounts();
						var diffFolderCount = oldCounts[0] - counts[0];
						var diffPageCount = oldCounts[1] - counts[1];
						alertify.success(String.format(str_alertify_success_delete, diffFolderCount, diffPageCount), 3000);
						validateExploreData({
							deleted: true,
						});
					});
				},
			});
		}
		
		e.stopPropagation();
	});
	
	function showExploreHistories(event, $arrow, arrow) {
		
		var $exploreHistory = selectFromCurrFrame('#explore-history');
		
		var diffrence;
		var length;
		if($arrow.hasClass('explore-forward')) {
			length = arrow.ids.length - arrow.index - 1;
			diffrence = 1;
		} else {
			length = arrow.index;
			diffrence = -1;
		}
		
		var $ul = $exploreHistory.find('ul');
		$ul.eq(0).children().remove();
		
		length = length + 1
		for (var i = 1; i < length; i++) {
			var index = arrow.index + diffrence * i;
			var results = BookmarkManager.get(arrow.ids[index]);
			var title;
			if(arrow.ids[index] == "0") {
				title = "*";
			} else {
				title = results[0].title;
			}
			$('<li>').text(title).data('index', index).appendTo($ul);
		}
		
		var left = $arrow.offset().left;
		var top = $arrow.offset().top;
		var height = $arrow.outerHeight();
		
		if(getPopupWidth(true) < left + $exploreHistory.outerWidth(true)) {
			left -= left + $exploreHistory.outerWidth(true) - getPopupWidth(true)
		}
		
		var siblingLeft = $exploreHistory.offset().left;
		var siblingTop = $exploreHistory.offset().top;
		
		if(left == siblingLeft && top == siblingTop - height) {
			$exploreHistory.hide();
			event.stopPropagation();
			return;
		}
		
		$exploreHistory.css({
			left: left,
			top: top + height,
		});
		
		$exploreHistory.show().scrollTop(0);
		event.stopPropagation();
	}
	
	$('.explore-backward').on({
		click: function(e) {
			if(bmp.currFrame == '#right-frame') {
				var right = bmp.exploreHistory.right;
				if(right.index > 0) {
					right.index--;
					explore({
						id: right.ids[right.index], 
						hierarchy: right.hierarchies[right.index], 
						arrow: true,
					});
				}
			} else {
				var left = bmp.exploreHistory.left;
				if(left.index > 0) {
					left.index--;
					explore({
						id: left.ids[left.index], 
						hierarchy: left.hierarchies[left.index], 
						arrow: true,
					});
				}
			}
		},
		contextmenu: function(e) {
			if(bmp.currFrame == '#right-frame') {
				var right = bmp.exploreHistory.right;
				if(right.index > 0) {
					showExploreHistories(e, $(this), right);
				}
			} else {
				var left = bmp.exploreHistory.left;
				if(left.index > 0) {
					showExploreHistories(e, $(this), left);
				}
			}
			e.preventDefault();
		},
	});
	
	$('.explore-forward').on({
		click: function(e) {
			if(bmp.currFrame == '#right-frame') {
				var right = bmp.exploreHistory.right;
				if(right.index < right.ids.length - 1) {
					right.index++;
					explore({
						id: right.ids[right.index], 
						hierarchy: right.hierarchies[right.index], 
						arrow: true,
					});
				}
			} else {
				var left = bmp.exploreHistory.left;
				if(left.index < left.ids.length - 1) {
					left.index++;
					explore({
						id: left.ids[left.index], 
						hierarchy: left.hierarchies[left.index], 
						arrow: true,
					});
				}
			}
		},
		contextmenu: function(e) {
			if(bmp.currFrame == '#right-frame') {
				var right = bmp.exploreHistory.right;
				if(right.index < right.ids.length - 1) {
					showExploreHistories(e, $(this), right);
				}
			} else {
				var left = bmp.exploreHistory.left;
				if(left.index < left.ids.length - 1) {
					showExploreHistories(e, $(this), left);
				}
			}
			e.preventDefault();
		},
	});
	
	
	
	//////////////////////////////////////////////////////////
	// mouseenter, mouseleave
	//////////////////////////////////////////////////
	
	$document.on('mouseenter', '#result-list .group', function(e) {
		$(this).addClass('list-hover');
	});
	
	$document.on('mouseleave', '#result-list .group', function(e) {
		if(bmp.preventsMouseLeave) return;
		$(this).removeClass('list-hover');
	});
	
	$document.on('mouseenter', '#result-list li', function(e) {
		$(this).addClass('list-hover');
	});
	
	$document.on('mouseleave', '#result-list li', function(e) {
		if(bmp.preventsMouseLeave) return;
		$(this).removeClass('list-hover');
	});
	
	$document.on('mouseenter', '#result-list li:not(.group)', function(e) {
		if($(this).hasClass('ui-sortable-helper')) {
			hideToolset();
		} else {
			showToolset($(this));
		}
		
		if(bmp.currFrame == '#right-frame') {
			if(bmp.isViewAppended) return;
			if($body.hasClass('extend') && $(this).data('url') == undefined) {
				showPreview($(this).data('id'));
			}
		}
		
	});
	
	$document.on('mouseleave', '#result-list li:not(.group)', function(e) {
		if(bmp.preventsMouseLeave) return;
		hideToolset($(this));
		
		if(bmp.currFrame == '#right-frame') {
			if(bmp.isViewAppended) return;
			if($body.hasClass('extend') && $(this).data('url') == undefined) {
				hidePreview();
			}
		}
	});
	
	$rightFrame.on('mouseenter', '#explore-sibling li', function() {
		if(bmp.isViewAppended) return;
		if($body.hasClass('extend') && $(this).data('url') == undefined) {
			showPreview($(this).data('id'));
		}
	});
	
	$rightFrame.on('mouseleave', '#explore-sibling li', function() {
		if(bmp.isViewAppended) return;
		if($body.hasClass('extend') && $(this).data('url') == undefined) {
			hidePreview();
		}
	});
	
	
	
	$searchHistory.on('click', 'li', function() {
		$searchEditor.val($(this).text());
		if(bmp.options.incremental) {
			clearTimeout(bmp.incrementalSearchTimeoutHandle);
			bmp.incrementalSearchTimeoutHandle = setTimeout(search, INCREMENTAL_SEARCH_TIMEOUT_DELAY);
		}
	});
	
	$document.on('click', '#explore-sibling li', function(e) {
		handleFolderClick(e, $(this).data('id'));
	});
	
	$document.on('click', '#explore-history li', function(e) {
		
		if(bmp.currFrame == '#right-frame') {
			var right = bmp.exploreHistory.right;
			right.index = $(this).data('index');
			explore({
				id: right.ids[right.index], 
				hierarchy: right.hierarchies[right.index], 
				arrow: true,
			});
		} else {
			var left = bmp.exploreHistory.left;
			left.index = $(this).data('index');
			explore({
				id: left.ids[left.index], 
				hierarchy: left.hierarchies[left.index], 
				arrow: true,
			});
		}
		
		
	});
	
	$document.on('click', '#result-list li.group', function(e) {
		
		var items = getGroupItems($(this));
		
		var all = true;
		var length = items.length;
		for(var i = 0; i < length; i++) {
			if(!items[i].hasClass('ui-selected')) {
				all = false;
			}
		}
		
		if(!e.ctrlKey) {
			unselectAllItems();
		}
		
		var length = items.length;
		for(var i = 0; i < length; i++) {
			if(all) {
				items[i].removeClass('ui-selected');
			} else {
				items[i].addClass('ui-selected');
			}
		}
		
		onSelectedItemsChanged();
		
		e.listSelected = true;
		//e.stopPropagation();
		e.preventDefault();
	});
	
	// selectable이 먼저 우선권이 있기 때문에 그곳에서 처리되지 않을 경우에만 적용
	$document.on('click', '#result-list li:not(.group)', function(e) {
		
		var curr = selectFromCurrFrame('#result-list li:not(.group)').index($(this));
		
		if(e.ctrlKey && !e.shiftKey) {
			if($(this).hasClass('ui-selected')) {
				$(this).removeClass('ui-selected');
			} else {
				$(this).addClass('ui-selected');
			}
			bmp.lastSelectIndex = curr;
		}
		
		
		if(e.shiftKey) {
			
			if(!e.ctrlKey) {
				unselectAllItems();
			}
			
			if(bmp.lastSelectIndex > -1) {
				if(bmp.lastSelectIndex < curr) {
					for(var i = bmp.lastSelectIndex ; i < curr + 1; i++) {
						selectFromCurrFrame('#result-list li:not(.group)').eq(i).addClass('ui-selected');
					}
				} else if(bmp.lastSelectIndex > curr) {
					for(var i = curr ; i < bmp.lastSelectIndex + 1; i++) {
						selectFromCurrFrame('#result-list li:not(.group)').eq(i).addClass('ui-selected');
					}
				}
			} else {
				$(this).addClass('ui-selected');
				bmp.lastSelectIndex = curr;
			}
		}
		
		if(!e.ctrlKey && !e.shiftKey) {
			selectFromCurrFrame('#result-list li').removeClass('ui-selected');
			$(this).addClass('ui-selected');
			bmp.lastSelectIndex = curr;
		}
		
		//console.debug('cc ' + bmp.lastSelectIndex);
		
		onSelectedItemsChanged();
		
		e.listSelected = true;
		//e.stopPropagation();
		e.preventDefault();
	});
	
	$document.on('dblclick', '#result-list li:not(.group)', function(e) {
		// folder
		if($(this).data('url') == undefined) {
			var id = $(this).data('id');
			explore({
				id: id,
				hierarchy: idToHierarchy(id), 
			});
			
		// page
		} else {
			var url = $(this).data('url');
			TabManager.update({
				url: url,
				active: false,
			});
		}
		e.preventDefault();
	});
	
	$document.on('click', '.group-view', function(e) {
		
		var $group = selectFromCurrFrame('#result-list li.group');
		var $li = selectFromCurrFrame('#result-list li');
		var index = $group.index($(this).parent());
		var indexStart;
		var indexEnd;
		if(index < $group.length - 1) {
			indexStart = $li.index($group.eq(index)) + 1;
			indexEnd = $li.index($group.eq(index + 1));
		} else {
			indexStart = $li.index($group.eq(index)) + 1;
			indexEnd = $li.length;
		}
		
		if($(this).parent().hasClass('group-hide')) {
			$(this).parent().removeClass('group-hide');
			for(var i = indexStart; i < indexEnd; i++) {
				selectFromCurrFrame('#result-list li').eq(i).show();
			}
			$(this).find('span').toggleClass('fa-caret-down fa-caret-left');
			
			var title = $(this).parent().find('> span').eq(0).text();
			$(this).parent().find('> span').eq(0).text(title.slice(0, title.lastIndexOf("(") - 1));
		} else {
			$(this).parent().addClass('group-hide');
			for(var i = indexStart; i < indexEnd; i++) {
				selectFromCurrFrame('#result-list li').eq(i).hide();
			}
			$(this).find('span').toggleClass('fa-caret-down fa-caret-left');
			
			var title = $(this).parent().find('> span').eq(0).text();
			$(this).parent().find('> span').eq(0).text(title + " (" + (indexEnd - indexStart) + ")");
		}
		
		updateGroupsBackgroundColor();
		
		e.stopPropagation();
		e.preventDefault();
	});
	
	
	$('.option').on('click', function(e) {
		
		var data = [
			"-",
			"reset-icon-toolbar-options",
			"bookmark-info",
			"preference",
			"-",
			"about",
		];
		
		if($('.advanced-search-icon-toolbars').css('display') == "none") {
			data.unshift("show-advanced-search-options");
		} else {
			data.unshift("hide-advanced-search-options");
		}
		
		if($body.hasClass('extend')) {
			data.unshift("remove-view");
		} else {
			data.unshift("append-view");
		}
		
		buildOptionMenu(data);
		
		updateOptionMenuPosition(e);
		startOptionMenu();
		
		e.preventDefault();
		e.stopPropagation();
	});
	
	
	$('#searchStartDate').on('change', function() {
		var value = $(this).val();
		StorageManager.set({
			start: value,
		});
	});
	$('#searchEndDate').on('change', function() {
		var value = $(this).val();
		StorageManager.set({
			end: value,
		});
	});
	
	
	var set = false;
	$pickadates = $(".datepicker").pickadate({
		selectYears: true,
		selectMonths: true,
		onSet: function() {
			set = true;
		},
		onOpen: function() {
			// set = false;
		},
		onClose: function() {
			if(!set) return;
			set = false;
			
			$('#icon-calendar').trigger('mouseleaveoff', 200);
			$('#icon-calendar').trigger('returntimeout', 3000);
			
			decideApply();
		},
	});
	
	var fromPicker = $pickadates.eq(0).pickadate("picker");
	var toPicker = $pickadates.eq(1).pickadate("picker");
	
	// When something is selected, update the “from” and “to” limits.
	fromPicker.on({
		set: function(event) {
			if (event.select) {
				toPicker.set("min", fromPicker.get("select"));
			} else if ("clear" in event) {
				toPicker.set("min", false);
			}
		},
	});
	toPicker.on({
		set: function(event) {
			if (event.select) {
				fromPicker.set("max", toPicker.get("select"));
			} else if ("clear" in event) {
				fromPicker.set("max", false);
			}
		},
	});
	
	$(".dateclick").on({
		click: function(e) {
			var picker = $(this).parent().find("input").pickadate("picker");
			picker.open();
			e.stopPropagation();
			e.preventDefault();
		}
	});
	
	bmp.currFrame = '#right-frame';
	bmp.rightFrameX = 500;
	
	bmp.actionMenuToolsetMaxWidth = $('#action-menu-toolset').outerWidth();
	bmp.actionMenuToolsetMinWidth = $('#action-menu-toolset').outerWidth() - $('.advanced-search-icon-toolbars').outerWidth();
	
	updateExploreHierarchyMaxWidth('#left-frame');
	updateExploreHierarchyMaxWidth('#right-frame');
	
	updateResultPanelHeight('#left-frame');
	updateResultPanelHeight('#right-frame');
	
	initHelpView();
	
	updateExploreMove('#left-frame');
	updateExploreMove('#right-frame');
	
	createListSelectable('#right-frame');
	createListSortable('#right-frame');
	
	createExploreSortable();
	
	$('.menu').hide();
	$('.dialog').hide();
	$('.window').hide();
	$('#action-hover-toolset').hide();
	
	$leftFrame.hide();
	$leftFrame.find('#result-list').hide();
	$('#view-hide').hide();
	$('#separator').hide();
	$('#modal-cover').hide();
	$searchHistory.hide();
	selectFromBothFrame('#explore-sibling').hide();
	selectFromBothFrame('#explore-history').hide();
	
	createIconToolbars();
}

function createIconToolbars() {
	
	function createRoundSwitch() {
		var $switch = '<div class="switch switch-round switch-off">';
		var $toggle = '<div class="switch-toggle">';
		return $($switch + $toggle);
	}
	
	var $addition = $('<div>').css({padding: "2px 0 0 0"});
	
	var $container = $('<span>').addClass('icon-title-match');
	var $label = $('<span>').text("Title Match");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<br>');
	
	var $container = $('<span>').addClass('icon-highlight');
	var $label = $('<span>').text("Highlight");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<br>');
	
	var $container = $('<span>').addClass('icon-whole-match');
	var $label = $('<span>').text("Whole Match");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<hr>');
	
	var $container = $('<span>').addClass('icon-url-match');
	var $label = $('<span>').text("URL Match");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<hr>');
	
	var $container = $('<span>').addClass('icon-case-sensitive');
	var $label = $('<span>').text("Case Sensitive");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<br>');
	
	var $container = $('<span>').addClass('icon-whole-phrase');
	var $label = $('<span>').text("Whole Phrase");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<hr>');
	
	var $container = $('<span>').addClass('icon-scope-limit');
	var $label = $('<span>').text("Scope Limit");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<br>');
	
	var $container = $('<span>').addClass('icon-recursive');
	var $label = $('<span>').text("Recursive");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	$addition.append('<hr>');
	
	var $container = $('<span>').addClass('icon-incremental-search');
	var $label = $('<span>').text("Incremental Search");
	var $roundSwitch = createRoundSwitch();
	$container.append($label).append($roundSwitch);
	$addition.append($container);
	
	
	$('#icon-filter').toolbar({
		position: "bottom",
		toolbarCss: {
			width: "155px",
			height: "180px",
		},
		addition: $addition,
	}).on("toolbarItemClick", function(e, item) {
		
	});
	
	$('.icon-title-match .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.title = false;
			$('.icon-highlight .switch-toggle').addClass('disabled');
			$('.icon-highlight > span').addClass('disabled');
			$('.icon-whole-match .switch-toggle').addClass('disabled');
			$('.icon-whole-match > span').addClass('disabled');
		} else {
			bmp.options.title = true;
			$('.icon-highlight .switch-toggle').removeClass('disabled');
			$('.icon-highlight > span').removeClass('disabled');
			$('.icon-whole-match .switch-toggle').removeClass('disabled');
			$('.icon-whole-match > span').removeClass('disabled');
		}
		
		StorageManager.set({
			title: bmp.options.title,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-highlight .switch').on('click', function() {
		if($(this).find('.switch-toggle').hasClass('disabled')) return;
		
		if($(this).hasClass('switch-on')) {
			bmp.options.highlight = false;
		} else {
			bmp.options.highlight = true;
		}
		
		StorageManager.set({
			highlight: bmp.options.highlight,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-whole-match .switch').on('click', function() {
		if($(this).find('.switch-toggle').hasClass('disabled')) return;
		
		if($(this).hasClass('switch-on')) {
			bmp.options.whole = false;
		} else {
			bmp.options.whole = true;
		}
		
		StorageManager.set({
			whole: bmp.options.whole,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-url-match .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.url = false;
		} else {
			bmp.options.url = true;
		}
		
		StorageManager.set({
			url: bmp.options.url,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-case-sensitive .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.case = false;
		} else {
			bmp.options.case = true;
		}
		
		StorageManager.set({
			case: bmp.options.case,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-whole-phrase .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.phrase = false;
		} else {
			bmp.options.phrase = true;
		}
		
		StorageManager.set({
			phrase: bmp.options.phrase,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-scope-limit .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.scope = false;
			$('.icon-recursive .switch-toggle').addClass('disabled');
			$('.icon-recursive > span').addClass('disabled');
		} else {
			bmp.options.scope = true;
			$('.icon-recursive .switch-toggle').removeClass('disabled');
			$('.icon-recursive > span').removeClass('disabled');
		}
		
		StorageManager.set({
			scope: bmp.options.scope,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-recursive .switch').on('click', function() {
		if($(this).find('.switch-toggle').hasClass('disabled')) return;
		
		if($(this).hasClass('switch-on')) {
			bmp.options.recursive = false;
		} else {
			bmp.options.recursive = true;
		}
		
		StorageManager.set({
			recursive: bmp.options.recursive,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	$('.icon-incremental-search .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.incremental = false;
		} else {
			bmp.options.incremental = true;
		}
		
		StorageManager.set({
			incremental: bmp.options.incremental,
		});
		
		$(this).toggleClass('switch-on switch-off');
	});
	
	
	$('#icon-search-mode').toolbar({
		content: '#icon-search-mode-content',
		position: "bottom",
	}).on("toolbarItemClick", function(e, item) {
		
		$(this).removeClass('fa-basic fa-lg fa-search-normal fa-circle-thin fa-question-circle-o fa-registered');
		if($(item).hasClass('search-mode-normal')) {
			$(this).addClass('fa-lg fa-circle-thin fa-search-normal');
			bmp.options.search = "normal";
		} else if($(item).hasClass('search-mode-wildcard')) {
			$(this).addClass('fa-lg fa-question-circle-o');
			bmp.options.search = "wildcard";
		} else {
			$(this).addClass('fa-basic fa-registered');
			bmp.options.search = "regex";
		}
		
		StorageManager.set({
			search: bmp.options.search,
		});
		
		decideApply();
	});
	
	
	
	
	
	$('#icon-file').toolbar({
		content: '#icon-file-content',
		position: "bottom",
	}).on("toolbarItemClick", function(e, item) {
		
		$(this).removeClass('fa-file fa-file-none');
		if($(item).hasClass('file-none')) {
			$(this).addClass('fa-file fa-file-none');
			bmp.options.page = false;
		} else {
			$(this).addClass('fa-file');
			bmp.options.page = true;
		}
		
		StorageManager.set({
			page: bmp.options.page,
		});
		
		decideApply();
	});
	
	
	
	
	
	
	$('#icon-folder-mode').toolbar({
		content: '#icon-folder-mode-content',
		position: "bottom",
	}).on("toolbarItemClick", function(e, item) {
		
		$(this).removeClass('fa-folder fa-folder-none fa-folder-o');
		if($(item).hasClass('folder-mode-none')) {
			$(this).addClass('fa-folder fa-folder-none');
			bmp.options.folder = "none";
		} else if($(item).hasClass('folder-mode-children')) {
			$(this).addClass('fa-folder');
			bmp.options.folder = "children";
		} else {
			$(this).addClass('fa-folder-o');
			bmp.options.folder = "empty";
		}
		
		StorageManager.set({
			folder: bmp.options.folder,
		});
		
		decideApply();
	});
	
	
	
	
	
	
	
	
	var $addition = $('<div>');
	var $container = $('<span>').addClass('icon-sort-mode-group-bar');
	var $roundSwitch = createRoundSwitch();
	var $label = $('<span>').text("Group bar");
	$container.append($label).append($roundSwitch);
	$addition.append('<hr>').append($container);
	
	$('#icon-sort-mode').toolbar({
		content: '#icon-sort-mode-content',
		position: "bottom",
		toolbarCss: {
			height: "60px",
		},
		addition: $addition,
	}).on("toolbarItemClick", function(e, item) {
		
		$(this).removeClass('fa-sort-amount-asc fa-sort-alpha-asc fa-sort-alpha-asc fa-sort-numeric-asc fa-sort-url fa-sort-title');
		if($(item).hasClass('sort-mode-hierarchy')) {
			$(this).addClass('fa-sort-amount-asc');
			bmp.options.sort = "hierarchy";
		} else if($(item).hasClass('sort-mode-title')) {
			$(this).addClass('fa-sort-alpha-asc fa-sort-title');
			bmp.options.sort = "title";
		} else if($(item).hasClass('sort-mode-url')) {
			$(this).addClass('fa-sort-alpha-asc fa-sort-url');
			bmp.options.sort = "url";
		} else {
			$(this).addClass('fa-sort-numeric-asc');
			bmp.options.sort = "date";
		}
		
		StorageManager.set({
			sort: bmp.options.sort,
		});
		
		decideApply();
	});
	
	$('.icon-sort-mode-group-bar .switch').on('click', function() {
		
		if($(this).hasClass('switch-on')) {
			bmp.options.group = false;
		} else {
			bmp.options.group = true;
		}
		
		StorageManager.set({
			group: bmp.options.group,
		});
		
		$(this).toggleClass('switch-on switch-off');
		
		decideApply();
	});
	
	
	
	
	
	
	
	$('.datepicker').on('change', function() {
		var $datepickers = $('.datepicker');
		if($datepickers.eq(0).val().length == 0 && $datepickers.eq(1).val().length == 0) {
			$('#icon-calendar').addClass('fa-calendar-none');
		} else {
			$('#icon-calendar').removeClass('fa-calendar-none');
		}
	});
	
	var fromPicker = $pickadates.eq(0).pickadate("picker");
	var toPicker = $pickadates.eq(1).pickadate("picker");
	
	// match the size of the calendar to the size of content
	// pickadate requires a relative parent
	// $('#icon-calendar-content').find('> div > div').css({
		// position: "relative",
		// display: "inline-block",
	// });
	
	// today
	$('#icon-calendar-content-buttons > button').eq(0).on('click', function(e) {
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', new Date());
		toPicker.set('select', new Date());
		decideApply();
	});
	
	// yesterday
	$('#icon-calendar-content-buttons > button').eq(1).on('click', function(e) {
		var date = new Date();
		date.setDate(date.getDate() - 1);
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', date);
		toPicker.set('select', date);
		decideApply();
	});
	
	// past a week
	$('#icon-calendar-content-buttons > button').eq(2).on('click', function(e) {
		var date = new Date();
		date.setDate(date.getDate() - 6);
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', date);
		toPicker.set('select', new Date());
		decideApply();
	});
	
	// past a month
	$('#icon-calendar-content-buttons > button').eq(3).on('click', function(e) {
		var date = new Date();
		date.setDate(date.getDate() - 30);
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', date);
		toPicker.set('select', new Date());
		decideApply();
	});
	
	// past 3 months
	$('#icon-calendar-content-buttons > button').eq(4).on('click', function(e) {
		var date = new Date();
		date.setDate(date.getDate() - 90);
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', date);
		toPicker.set('select', new Date());
		decideApply();
	});
	
	// past a year
	$('#icon-calendar-content-buttons > button').eq(5).on('click', function(e) {
		var date = new Date();
		date.setDate(date.getDate() - 364);
		fromPicker.set('clear');
		toPicker.set('clear');
		fromPicker.set('select', date);
		toPicker.set('select', new Date());
		decideApply();
	});
	
	// reset
	$('#icon-calendar-content-buttons > button').eq(6).on('click', function(e) {
		// reset the “from” and “to” limits
		fromPicker.set('highlight', new Date()).set('clear');
		toPicker.set('highlight', new Date()).set('clear');
		decideApply();
	});
	
	$('#icon-calendar').toolbar({
		content: '#icon-calendar-content',
		position: "bottom",
		toolbarCss: {
			width: "310px", 
			height: "60px", 
			padding: "6px 6px 8px",
		},
		addition: $('#icon-calendar-content > div'),
		selectable: false,
	}).on({
		toolbarShown: function(e) {
		},
		toolbarHidden: function(e) {
			var fromPicker = $pickadates.eq(0).pickadate("picker");
			var toPicker = $pickadates.eq(1).pickadate("picker");
			fromPicker.close();
			toPicker.close();
		},
		toolbarItemClick: function(e, item) {
		},
	});
}