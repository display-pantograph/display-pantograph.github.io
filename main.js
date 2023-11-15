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


$(window).on("load", function() {

    // Randomly position the cards within the viewport
    randomize();
    txtWidth();

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
        pageNr = parseInt(pageNr) + 1;
        if (pageNr%noPages == 0) {
            pageNr = parseInt(pageNr) + 1;
        }   
        await flipPDF(file, width, height, canvas, pageNr%noPages, scaler);
    }); 



    $(".left-align").each(function() {
        if($(this).find('img').length == 1){
            elementArray.push($(this).find('img')); 
        } else {
            elementArray.push($(this).find('video')); 
        }
    });

    $('.news').on('scroll', function(){  
        for(elmt of elementArray){
            elmt.css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
            elmt.siblings('.txt').css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
        }
    });


    $(".wrapper").scrollTop(0.25*windowHeight);

    randClr();

    resizeRoutine();
    scaler();
    $(".switch").click();
});







$(window).on('resize', function(){
    if(setter == 1 || $(window).width() >= 720){
        randomize();
        txtWidth();
        randClr();
    }
    resizeRoutine();
});



function resizeRoutine(){
    /* Hide/unhide routine */
    if($(window).width() <= 720) {
        $(".pantograph").closest(".wrapper").addClass("hide");
        $(".grey-out").addClass("wide");
        $(".pantograph").closest(".wrapper").addClass("wide");

        $(".news").closest(".wrapper").addClass("wide");

        $(".middle").addClass("hide");
        randomize();
    } else {
        $(".pantograph").closest(".wrapper").removeClass("hide");
        $(".grey-out").removeClass("wide");
        $(".pantograph").closest(".wrapper").removeClass("wide");

        $(".news").closest(".wrapper").removeClass("wide");

        $(".middle").removeClass("hide");
    }

    /* Switch and logic setup */
    if($(window).width() <= 720) {
        if($("#switch").is(':checked')) {
            console.log("Checked");
            $(".pantograph").removeClass("hide");
            $(".news").addClass("hide");
        } else {
            $(".news").removeClass("hide");
            $(".pantograph").addClass("hide");
            console.log("Unchecked");
        }

        $(".switch").on("change", function() {
            if($("#switch").is(':checked')) {
                console.log("Checked");
                $(".news").toggleClass("hide");
                $(".pantograph").toggleClass("hide");
                pantograph = 1;
            } else {
                $(".news").toggleClass("hide");
                $(".pantograph").toggleClass("hide");
                pantograph = 0;
                console.log("Uncheckedy");
            }
        }); 
    } else {
        $(".pantograph").removeClass("hide");
        $(".news").removeClass("hide");
    }
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
            setter= 1;
            $(".wrapper").scrollTop(scrollLock);
            randomize();
            txtWidth();
            console.log("off");
            for(elmt of elementArray){
                elmt.css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
                elmt.siblings('.txt').css('opacity', 2-Math.pow(($('.news').scrollTop()-elementArray.indexOf(elmt)*windowHeight), 1.5)/(elementArray.length*windowHeight));
            }
        }

        //txtWidth();
    }
}

function randomize() {
    $('.left-align').each(function() {
        var $card = $(this);
        var cardWidth = $card.outerWidth();
        var cardHeight = $card.outerHeight();
        var viewportWidth = $('.wrapper').width();
        var viewportHeight = $('.wrapper').height();
        var maxLeft = viewportWidth - cardWidth;
        var maxTop = viewportHeight - cardHeight;

        var randomLeft = Math.floor(Math.random() * (maxLeft+1));
        var randomTop = Math.floor(Math.random() * (maxTop+1));

        $card.css({
            left: randomLeft + 'px',
            top: randomTop + 'px'
        });
    });
}

function txtWidth() {
    $('.left-align').each(function() {
        var $img = $(this).find('.img');
        var $txt = $(this).find('.txt');
        var imgWidth = $img.outerWidth();

        $txt.css("width", "" + imgWidth - 16 + "px");
    });

    $('.post').each(function() {
        var $img = $(this).find('.img');
        var $txt = $(this).find('.post-text');
        var $title = $(this).find('.post-title');
        var imgWidth = $img.outerWidth();

        $txt.css("width", "" + imgWidth - 16 + "px");
        $title.css("width", "" + imgWidth - 16 + "px");
    });
}

function randClr() {
    $('.txt').each(function() {
        $(this).css("background-color", "" + clrs[getRandomInt(0, (clrs.length))]);
    });
}



function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


window.transitionToPage = function(href, id) {
    viewportWidth = $("#"+id).closest('.main-grid').outerWidth();
    elmntWidth = $("#"+id).closest('.sticky-wrapper').outerWidth() / 2;
    elmntX = $("#"+id).closest('.sticky-wrapper').offset().left - viewportWidth;
    left = viewportWidth/2 - elmntWidth - elmntX;
    zInd = zInd + 1;
    $("#"+id).closest('.sticky-wrapper').toggleClass("relative");
    $("#"+id).closest('.sticky-wrapper').toggleClass("absolute");
    $("#"+id).closest('.sticky-wrapper').toggleClass("issue");
    $("#"+id).closest('.sticky-wrapper').toggleClass("issue-wide");
    $("#"+id).siblings('#the-canvas').toggleClass("canvas-animate");
    $("#"+id).find('.space-bottom').toggleClass("hide");

    $(".pantograph").scrollTop(0);

    left = viewportWidth/2 - elmntWidth - elmntX;
    if($('.grey-out').css("z-index") >= 1){
        $('.grey-out').css("z-index", "auto");
    } else {
        $('.grey-out').css("z-index", ""+zInd);
    }
    $('.grey-out').toggleClass("g-o-animate");
    $("#"+id).closest('.sticky-wrapper').animate({
        zIndex: zInd
    }, 300, function() {
    });


    $("#"+id).closest('.sticky-wrapper').animate({
        left: left
    }, 1, function() {
        $("#"+id).find('#long-info').toggleClass("hide");
    });


    setTimeout(function() { 
    }, 1200)
}




async function renderPDF(file, width, height, canvas, pageNumber){

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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
            var scaler = width / viewport.width;
            var scaledViewport = page.getViewport({ scale: 2*scaler });
            // var outputScale = window.devicePixelRatio || 1;
            // Prepare canvas using PDF page dimension
            var context = canvas.get(0).getContext('2d');
            canvas.get(0).width = 2*width;
            canvas.get(0).height = 2*height;
            canvas.attr("no-pages", pdf.numPages);
            canvas.attr("scaler", scaler);
            canvas.attr("curr-page", pageNumber);
            if (scaler < minScale) {
                minScale = scaler;
                console.log(minScale);
            }

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
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
