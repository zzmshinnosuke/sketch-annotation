'use strict';
$(document).ready(function () {
	for (var i = 1; i <= Apollo.total; ++i) {
		//console.log(i);
		if ($.inArray(i, Apollo.admin_list_change) >= 0) {
			$("#markers").append("<div class='marker blue' task='" + i + "'> </div>");
		} 
		
		else if($.inArray(i, Apollo.admin_list) >= 0) {
			$("#markers").append("<div class='marker green' task='" + i + "'> </div>");
		} 
		else if ($.inArray(i, Apollo.check_list) >= 0) {
			$("#markers").append("<div class='marker yellow' task='" + i + "'> </div>");
		} 
		else {
			$("#markers").append("<div class='marker red' task='" + i + "'> </div>");
		}
	}

	$(".marker").click(function () {
		var task = $(this).attr("task");
		window.open(Apollo.baseUrl + "?review="+ task + "&task="+ task);
		//window.open(Apollo.baseUrl + "?task="+ task);
	});

	$(".green").hover(function () {
		var task = $(this).attr("task");
		// $("#demo").attr("src", Apollo.baseUrl + "results1/" + task + ".png");
		$("#cid").html(task);
	});

	$(".red").hover(function () {
		var task = $(this).attr("task");
		$("#cid").html(task);
	});

	$(".yellow").hover(function () {
		var task = $(this).attr("task");
		// $("#demo").attr("src", Apollo.baseUrl + "results2/" + task + ".png");
		$("#cid").html(task);
	});

	$(".blue").hover(function () {
		var task = $(this).attr("task");
		// $("#demo").attr("src", Apollo.baseUrl + "results2/" + task + ".png");
		$("#cid").html(task);
	});
});

