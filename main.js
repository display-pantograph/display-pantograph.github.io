var clrs = ["#ffffff"];

/*var clrs = ["#5a189a","#ff6d00", "#38b000", "#0080ff", "#ffee32"];*/

var setter = 1;

var pantograph = 0;

var zInd =  1;

var scrTop = $(document).scrollTop();

var windowHeight = $(window).height();

var minScale = 1;

var elementArray=[];

var scrollLock = 0;

var pageRendering = false;

var pageNumPending = null;

var viewportWidth = $('.wrapper').width();
var viewportHeight = $('.wrapper').height();

var resolution = 1.3;


$(window).on("load", function() {
	$(".left-align").each(function() {
		if($(this).find('img').length == 1){
			elementArray.push($(this).find('img')); 
		} else {
			elementArray.push($(this).find('video')); 
		}
	});

	if(setter == 1){
		$(".wrapper").on("scroll", function() {
			scrTop = $(".wrapper").scrollTop();
		}); 
	}

	$(".info").on("click", function() {
		$(".info-content").toggleClass("hide");
		$(".info-rounds").toggleClass("hide");
	}); 

	$(".info-content").on("click", function() {
		$(".info-content").toggleClass("hide");
		$(".info-rounds").toggleClass("hide");
	}); 





	$(".grid").on("click", function() {
		gridder();
	}); 


	$('.issue').each(async function() {
		await renderPDF($(this).attr("file-handler"), $(this).find('.img').outerWidth(), $(this).find('.img').outerHeight(), $(this).find('#the-canvas'), 1);
		$(this).find('.img').css("display", "none");
	});


	$(".blue-bg").on("click", async function() {
		var canvas = $(this).find('#the-canvas');
		var file = $(this).closest('.issue').attr("file-handler") || $(this).closest('.issue-wide').attr("file-handler");
		var width =  canvas.attr("width");
		var height = canvas.attr("height");
		var scaler = canvas.attr("scaler");
		var pageNr = canvas.attr("curr-page");
		var noPages = parseInt(canvas.attr("no-pages"));
		if (pageNr%noPages == 0) {
			pageNr = 1;
		}  else {
			pageNr = parseInt(pageNr) + 1;
		}
		await flipPDF(file, width, height, canvas, pageNr, scaler);
	}); 


	// Scroll decay to red
	$('.news').on('scroll', function(){  
		for(elmt of elementArray){
			elmt.css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
			elmt.siblings('.txt').css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
		}
	});

	if($(window).width() >= 720) {
		$(".pantograph").closest(".wrapper").removeClass("wide");
		$(".news").closest(".wrapper").removeClass("hide");
	}

	elementArray.forEach(function(elmnt) {
		randomize(elmnt);
	});


	/* Switch and logic setup */
	if($(window).width() <= 720) {
		if($("#switch").is(':checked')) {
			$(".pantograph").removeClass("hide");
			$(".news").addClass("hide");
		} else {
			$(".news").removeClass("hide");
			$(".news").css("display", "grid");
			$(".pantograph").addClass("hide");
		}

		$(".switch").on("change", function() {
			if($("#switch").is(':checked')) {
				console.log("Checked");
				$(".news").toggleClass("hide");
				$(".pantograph").toggleClass("hide");
				pantograph = 1;
			} else {
				$(".news").toggleClass("hide");
				$(".news").css("display", "grid");
				$(".pantograph").toggleClass("hide");
				pantograph = 0;
				elementArray.forEach(item => {
					console.log(item);
					randomize(item);
				});
			}
		}); 
	} else {
		$(".pantograph").removeClass("hide");
		$(".news").removeClass("hide");
		$(".pantograph").closest(".wrapper").removeClass("wide");
	}


	scaler();
});







$(window).on('resize', function(){
	resizeRoutine();
});



function resizeRoutine(){
	/* Hide/unhide routine */
	/* if($(window).width() <= 720) {
        $(".pantograph").closest(".wrapper").addClass("hide");
        $(".grey-out").addClass("wide");
        $(".pantograph").closest(".wrapper").addClass("wide");

        $(".news").closest(".wrapper").addClass("wide");

        $(".middle").addClass("hide");
    } else {
        $(".pantograph").closest(".wrapper").removeClass("hide");
        $(".grey-out").removeClass("wide");
        $(".pantograph").closest(".wrapper").removeClass("wide");

        $(".news").closest(".wrapper").removeClass("wide");
        $(".pantograph").closest(".wrapper").removeClass("wide");

        $(".middle").removeClass("hide");
    }
*/
}


function gridder(){
	if(pantograph == 0){

		$(".space-s").toggleClass("hide");
		$(".wrapper").closest(".news").toggleClass("main-grid");


		$('.txt').each(function() {
			$(this).toggleClass("hide");
		});


		$('.sticky-wrapper').closest(".news").each(function() {
			$(this).toggleClass("relative");
		});
		$('.img').closest(".news").each(function() {
			$(this).toggleClass("img-widther");
		});

		$('.vid').closest(".news").each(function() {
			$(this).toggleClass("img-widther");
		});

		$(".title").closest(".sticky-wrapper").closest(".news").removeClass("relative");
		$(".news").find(".title").toggleClass("absolute");

		if(setter == 1) {
			scrollLock = scrTop;
			$('.left-align').each(function() {
				$(this).css({
					left: '0px',
					top: '0px'
				});
				$(this).toggleClass("relative");
			});
			setter = 0;
			console.log("on");
			for(elmt of elementArray){
				elmt.css('opacity', 1);
				elmt.siblings('.txt').css('opacity', 1);
			}
		} else {
			$('.left-align').each(function() {
				$(this).toggleClass("relative");
			});
			elementArray.forEach(function(elmnt) {
				randomize(elmnt);
			});
			setter= 1;
			$(".wrapper").scrollTop(scrollLock);
			/*randomize();
            txtWidth();*/
			console.log("off");
			for(elmt of elementArray){
				elmt.css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
				elmt.siblings('.txt').css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
			}
		}

	}
}


function randomize(elmnt) {
	var $card = $(elmnt).closest(".left-align");
	var cardWidth = $card.outerWidth();
	var cardHeight = $card.outerHeight();
	var viewportWidth = $('.news').width();
	var viewportHeight = $(window).height();
	var maxLeft = viewportWidth - cardWidth;
	var maxTop = viewportHeight - cardHeight;
	var randomLeft = Math.floor(Math.random() * maxLeft);
	var randomTop = Math.floor(Math.random() * maxTop);

	$card.css({
		left: Math.abs(randomLeft) + 'px',
		top: Math.abs(randomTop) + 'px'
	});
	txtWidth(elmnt);
}

function txtWidth(elmnt) {
	var $img = $(elmnt);
	var $txt = $(elmnt).siblings(".txt");
	var imgWidth = $img.innerWidth();

	$txt.css("width", "" + imgWidth - 16 + "px");
}



window.transitionToPage = function(href, id) {
	viewportWidth = $("#"+id).closest('.main-grid').outerWidth();
	elmntWidth = $("#"+id).closest('.sticky-wrapper').outerWidth() / 2;
	elmntX = $("#"+id).closest('.sticky-wrapper').offset().left - viewportWidth;
	left = viewportWidth/2 - elmntWidth - elmntX;
	zInd = zInd + 1;

	$(".pantograph").scrollTop(0);

	left = viewportWidth/2 - elmntWidth - elmntX;
	$("#"+id).closest('.sticky-wrapper').animate({
		zIndex: zInd
	}, 10, function() {
		$('.grey-out').toggleClass("g-o-animate");
		setTimeout(
			function() 
			{
				$("#"+id).closest('.sticky-wrapper').toggleClass("issue-wide");
				$("#"+id).closest('.sticky-wrapper').toggleClass("relative");
				$("#"+id).closest('.sticky-wrapper').toggleClass("absolute");
				$("#"+id).closest('.sticky-wrapper').toggleClass("issue");
				$("#"+id).siblings('#the-canvas').toggleClass("canvas-animate");
				$("#"+id).find('.space-bottom').toggleClass("hide");
				$("#"+id).find('.close-btn').toggleClass("hide");
				$("#"+id).closest('.sticky-wrapper').animate({
					left: left
				}, 1, function() {
					$("#"+id).find('#long-info').toggleClass("hide");
				});
			}, 50);
		$('.grey-out').toggleClass("g-o-animate-out");
		if($('.grey-out').css("z-index") >= 1){
			$('.grey-out').css("z-index", "auto");
		} else {
			$('.grey-out').css("z-index", ""+zInd);
		}
	});




	setTimeout(function() { 
	}, 1200)
}




async function renderPDF(file, width, height, canvas, pageNumber){

	// Loaded via <script> tag, create shortcut to access PDF.js exports.
	var { pdfjsLib } = globalThis;

	// The workerSrc property shall be specified.
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';
	pageRendering = true;

	// Asynchronous download of PDF
	var loadingTask = pdfjsLib.getDocument(file);
	loadingTask.promise.then(function(pdf) {
		pdf.getPage(pageNumber).then(function(page) {
			var renderTask = null;

			if ( renderTask !== null ) {
				renderTask.cancel();
				return;
			}

			var viewport = page.getViewport({ scale: 1 });
			if (scaler === undefined) {
				var scaler = width / viewport.width;
			}
			var scaledViewport = page.getViewport({ scale: scaler });
			// var outputScale = window.devicePixelRatio || 1;
			// Prepare canvas using PDF page dimension
			var context = canvas.get(0).getContext('2d');

			canvas.attr("no-pages", pdf.numPages);
			if (canvas.attr("scaler") === undefined) {
				canvas.attr("scaler", scaler);
			}
			canvas.attr("curr-page", pageNumber);
			console.log(canvas.attr("width"));
			if(canvas.attr("width") === undefined || canvas.attr("height") === undefined) {
				canvas.attr("width", resolution * width);
				canvas.attr("height", resolution * height);
				canvas.get(0).width = resolution * width;
				canvas.get(0).height = resolution * height;
			} else {
				canvas.attr("width", width);
				canvas.attr("height", height);
			}
			if (scaler <= minScale) {
				minScale = scaler;
				console.log(minScale);
			}

			// Render PDF page into canvas context
			if(canvas.attr("curr-page") == 1) {
				var renderContext = {
					canvasContext: context,
					viewport: scaledViewport,
					transform: [resolution, 0, 0, resolution, 0, 0]
				};
			} else {
				var renderContext = {
					canvasContext: context,
					viewport: scaledViewport
				};
			}
			var renderTask = page.render(renderContext);
			renderTask.promise.then(function () {
				pageRendering = false;
				if (pageNumPending !== null) {
					renderPDF(file, width, height, canvas, pageNumPending);
					pageNumPending = null;
				}
			});
		});
	}, function (reason) {
		// PDF loading error
		console.error(reason);
	});
	return;
}

async function flipPDF(file, width, height, canvas, pageNumber, scaler){
	if (pageRendering) {
		pageNumPending = pageNumber;
	} else {
		renderPDF(file, width, height, canvas, pageNumber, scaler);
	}
}

async function scaler(){
	$('canvas').each(async function() {
		await waitForCondition({arg: ($(this).attr("scaler")), test: undefined}).then($(this).css("height", 100*minScale/$(this).attr("scaler")+"%"));
		if (minScale == 0) {
			$(this).css("height", "100%");
		}
	});
}



async function waitForCondition(conditionObj) {
	return new Promise(resolve => {
		var start_time = Date.now();
		function checkFlag() {
			if (conditionObj.arg == conditionObj.test) {
				window.setTimeout(scaler, 1000); 
			} else if (Date.now() > start_time + 10000) {
				resolve();
			} else {
				resolve();
			}
		}
		checkFlag();
	});
}
