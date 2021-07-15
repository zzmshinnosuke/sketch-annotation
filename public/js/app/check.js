'use strict';
$(document).ready(function () {
	console.log(Apollo.total);
	console.log(Apollo.check_list);
	console.log(Apollo.list);
	for (var i = 1; i <= Apollo.total; ++i) {
		//console.log(i);
		if ($.inArray(i, Apollo.check_list) >= 0) {
			$("#markers").append("<div class='marker yellow' task='" + i + "'> </div>");
		} else{
			if ($.inArray(i, Apollo.list) >= 0) {
				$("#markers").append("<div class='marker red' task='" + i + "' > </div>");
			} else {
				$("#markers").append("<div class='marker gray' task='" + i + "'> </div>");
			}
		}
	}

	$(".marker").click(function () {
		var task = $(this).attr("task");
		window.open(Apollo.baseUrl + "?task="+ task);
	});
	
	$(".green").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});

	$(".red").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});

	$(".yellow").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});

	$(".blue").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});
});
