
'use strict';

$(document).ready(function() {
	
	restoreOptions();
	
	$('#save').on('click', function () {
		saveOptions();
	});
	
	$('#reset').on('click', function () {
		$('#badge-display-mode').val(DEFAULT_BADGE_DISPLAY_MODE);
		$('#warning-count').val(DEFAULT_WARNING_COUNT);
		$('#real-time-apply-switch').find('.switch').addClass('switch-on').removeClass('switch-off');
		alertify.success(str_alertify_success_scope_reset_options, 2000);
	});
	
	$('#warning-count').on('change', function () {
		var value = $(this).val();
		if(value < 100) value = 100;
		value = parseInt(value / 100);
		value *= 100;
		$(this).val(value);
	});
	
	$('#real-time-apply-switch').find('.switch').on('click', function() {
		$(this).toggleClass('switch-on switch-off');
	});
});

function saveOptions() {
	
	var badgeDisplayMode = $('#badge-display-mode').val();
	var warningCount = $('#warning-count').val();
	var isRealTimeApplied;
	if($('#real-time-apply-switch').find('.switch').hasClass('switch-on')) {
		isRealTimeApplied = true;
	} else {
		isRealTimeApplied = false;
	}
	
	StorageManager.set({
		// default vlaues
		badge: badgeDisplayMode,
		warning: warningCount,
		apply: isRealTimeApplied,
	}, function() {
		alertify.success(str_alertify_success_saved, 2000);
	});
}

function restoreOptions() {
	
	StorageManager.get({
		// default vlaues
		badge: DEFAULT_BADGE_DISPLAY_MODE,
		warning: DEFAULT_WARNING_COUNT,
		apply: true,
	}, function(items) {
		$('#badge-display-mode').val(items.badge);
		$('#warning-count').val(items.warning);
		if(items.apply) {
			$('#real-time-apply-switch').find('.switch').addClass('switch-on').removeClass('switch-off');
		} else {
			$('#real-time-apply-switch').find('.switch').removeClass('switch-on').addClass('switch-off');
		}
	});
}


