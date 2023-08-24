var clrs = ["#5a189a","#ff6d00", "#38b000", "#0080ff", "#ffee32"];

var setter = 1;

var pantograph = 0;

var zInd =  1;

var scrTop = $(document).scrollTop();

var windowHeight = $(window).height();

var minScale = 1;


$(document).ready(function() {

    // Randomly position the cards within the viewport
    randomize();
    txtWidth();
    randClr();
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
                $('.issue').each(async function() {
                    console.log($(this).find('.img').outerWidth());
                    await renderPDF($(this).attr("file-handler"), $(this).find('.img').outerWidth(), $(this).find('.img').outerHeight(), $(this).find('#the-canvas'), 1);
                    $(this).find('.img').css("opacity", "0");
                });
            } else {
                $(".news").toggleClass("hide");
                $(".pantograph").toggleClass("hide");
                pantograph = 0;
                console.log("Unchecked");
            }
        }); 
    }

    $(".wrapper").on("scroll", function() {
        scrTop = $(".wrapper").scrollTop();
    }); 

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
    scaler();

    $(".issue").on("click", async function() {
        var canvas = $(this).find('#the-canvas');
        var file = $(this).attr("file-handler");
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


    /*
    // Function to get the highest z-index value among the cards
    function getHighestZIndex() {
        var highestZIndex = 0;
        $('.sticky-wrapper').each(function() {
            var zIndex = parseInt($(this).css('z-index'));
            if (zIndex > highestZIndex) {
                highestZIndex = zIndex;
            }
        });
        return highestZIndex;
    }



    // Bring the card to the foreground on hover and keep it there
    $('.sticky-wrapper').on('mouseenter', function() {
        var $card = $(this);
        var currentZIndex = parseInt($card.css('z-index'));
        var highestZIndex = getHighestZIndex();

        if (currentZIndex !== highestZIndex) {
            $card.css('z-index', highestZIndex + 1);
        }
    });
    */

    var elementArray=[];
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

});







$(window).on('resize', function(){
    if(setter == 1){
        randomize();
        txtWidth();
        randClr();
    }
    $('.issue').each(async function() {
        console.log($(this).find('.img').outerWidth());
        await renderPDF($(this).attr("file-handler"), $(this).find('.img').outerWidth(), $(this).find('.img').outerHeight(), $(this).find('#the-canvas'), 1);
        $(this).find('.img').css("opacity", "0");
    });

});




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
            $('.left-align').each(function() {
                $(this).css({
                    left: '0px',
                    top: '0px'
                });
                $(this).toggleClass("relative");
            });
            setter = 0;
            console.log("on");
        } else {
            $('.left-align').each(function() {
                $(this).toggleClass("relative");
            });
            setter= 1;
            $(".wrapper").scrollTop(scrTop);
            randomize();
            txtWidth();
            console.log("off");
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

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})


async function renderPDF(file, width, height, canvas, pageNumber){

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';


    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(file);
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(pageNumber).then(function(page) {
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
            });
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });

}

async function flipPDF(file, width, height, canvas, pageNumber, scaler){
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';


    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(file);
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(pageNumber).then(function(page) {
            var scaledViewport = page.getViewport({ scale: 2*scaler });

            // Prepare canvas using PDF page dimension
            var context = canvas.get(0).getContext('2d');
            canvas.get(0).width = width;
            canvas.get(0).height = height;
            canvas.attr("curr-page", pageNumber);

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
            });
        });
    }, function (reason) {
        // PDF loading error
        console.error(reason);
    });

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