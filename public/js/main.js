/*global $, Formatter*/

(function (window, $, Formatter) {
    "use strict";
    
    var iframes = 0;

    $(function () {

        $("#ohandouts, #chandouts").on("click", "header", function (e) {

            var $target = $(e.target),
                $header = $(e.currentTarget);

            if (!$target.hasClass("download") && $header.find(".editing").length === 0) {
                $(e.currentTarget).parent().find(".details").toggleClass("hidden");
                e.preventDefault();
            } else if ($target.parent().hasClass("options")) {
                $target.parent().addClass("hidden").prev().val($target.text().split(" - ")[0]);
                e.preventDefault();
            }

            // This would make download link not work!
            // e.preventDefault();

        });

        var popup = null;

        $("#ohandouts, #chandouts").on("focus", ".fill-tag", function (e) {
            popup = $(e.target).siblings(".options").removeClass("hidden");

            $(document).on("click", hidePopup);
        });


        // TO-DO: Create a function called togglePopup to have only one visible popup at a time.
        // TO-DO: Bind and unbind this document click event when needed.

        function hidePopup(e) {

            var $target = $(e.target);

            if (popup && !$target.is(popup) && !$target.next().is(popup)) {
                popup.addClass("hidden");
                $(document).off("click", hidePopup);
                e.preventDefault();
            }
        }

        /*$(document).on("click", function(e) {
            console.log("ROOT");
            console.log(e.currentTarget);
            console.log(e.target);
            if(popup) popup.addClass("hidden");
        });*/

        
        $("#ohandouts, #chandouts").on("click", ".errors", function (e) {
            var currentTarget = e.currentTarget;
            currentTarget.parentNode.removeChild(currentTarget);
        });
        
        // TO-DO: Refactor and organise all this code...

        $("#ohandouts, #chandouts").on("click", ".details", function (e) {

            var $target = $(e.target);

            if ($target.hasClass("btn") && !$target.hasClass("upload") && !$target.hasClass("file-wr") && !$target.hasClass("errors")) {

                console.log("AA");

                switch ($target.text().toLowerCase()) {

                case "edit":
                    $target.toggleClass("hidden");

                    var $handoutEntry = $target.parents("li"),
                        $handoutSubject = $handoutEntry.find(".tag"),
                        $handoutTitle = $handoutEntry.find(".title > span").eq(1),
                        $handoutDescription = $handoutEntry.find(".description > div"),
                        $handoutDueDate = $handoutEntry.find(".df");

                    $handoutSubject.data("previousValue", $handoutSubject.text()).addClass("thin");
                    var prev = $handoutSubject.text();
                    $handoutSubject.html($("#subjects").html()).find(".fill-tag").val(prev);
                    $handoutTitle.data("previousValue", $handoutTitle.text()).addClass("editing").attr("contenteditable", "true");
                    $handoutDescription.data("previousValue", $handoutDescription.text()).addClass("editing").attr("contenteditable", "true");
                    $handoutDueDate.data("previousValue", $handoutDueDate.data("df")).addClass("editing");

                    $target.siblings(".edit, .delete, .save, .discard").toggleClass("hidden");
                    break;

                case "delete":
                    $target.toggleClass("hidden");

                    $target.siblings(".yes").toggleClass("hidden").data("action", "delete");
                    $target.siblings(".no").toggleClass("hidden").data("action", ".edit, .delete, .yes, .no");
                    $target.siblings(".edit, .delete").toggleClass("hidden");
                    $target.siblings(".message").text("Delete handout?").removeClass("hidden");
                    break;

                case "save":
                    $target.toggleClass("hidden");

                    $target.siblings(".yes").toggleClass("hidden").data("action", "save");
                    $target.siblings(".no").toggleClass("hidden").data("action", ".save, .discard, .yes, .no");
                    $target.siblings(".save, .discard").toggleClass("hidden");
                    $target.siblings(".message").text("Save changes?").removeClass("hidden");
                    // Disable edit mode.
                    break;

                case "discard":
                    $target.toggleClass("hidden");

                    $target.siblings(".yes").toggleClass("hidden").data("action", "discard");
                    $target.siblings(".no").toggleClass("hidden").data("action", ".save, .discard, .yes, .no");
                    $target.siblings(".save, .discard").toggleClass("hidden");
                    $target.siblings(".message").text("Discard changes?").removeClass("hidden");
                    // Disable edit mode.
                    break;

                case "clear":
                    $target.toggleClass("hidden");

                    $target.siblings(".yes").toggleClass("hidden").data("action", "clear");
                    $target.siblings(".no").toggleClass("hidden").data("action", ".create, .clear, .yes, .no");
                    $target.siblings(".create, .clear").toggleClass("hidden");
                    $target.siblings(".message").text("Clear changes?").removeClass("hidden");
                    // Disable edit mode.
                    break;

                case "create":
                    $target.toggleClass("hidden");

                    $target.siblings(".yes").toggleClass("hidden").data("action", "create");
                    $target.siblings(".no").toggleClass("hidden").data("action", ".create, .clear, .yes, .no");
                    $target.siblings(".create, .clear").toggleClass("hidden");
                    $target.siblings(".message").text("Create new handout?").removeClass("hidden");
                    // Disable edit mode.
                    break;

                case "yes":
                    $target.toggleClass("hidden");

                    switch ($target.data("action")) {
                    case "delete":
                        break;

                    case "save":
                        break;

                    case "discard":
                        var $handoutEntry = $target.parents("li");
                        var $handoutSubject = $handoutEntry.find(".tag");
                        var $handoutTitle = $handoutEntry.find(".title > span").eq(1);
                        var $handoutDescription = $handoutEntry.find(".description > div");
                        var $handoutDueDate = $handoutEntry.find(".df");

                        $handoutSubject.text($handoutSubject.data("previousValue")).removeClass("thin");
                        $handoutTitle.text($handoutTitle.data("previousValue")).removeAttr("contenteditable").removeClass("editing");
                        $handoutDescription.text($handoutDescription.data("previousValue")).removeAttr("contenteditable").removeClass("editing");
                        $handoutDueDate.text(format($handoutDueDate.data("previousValue"))).data("df", $handoutDueDate.data("previousValue")).removeClass("editing");
                        // TO-DO: Reset $lefts data attr.

                        $target.siblings(".edit, .delete, .yes, .no").toggleClass("hidden");
                        $target.siblings(".message").addClass("hidden"); // TO-DO: Wait some time...
                        break;

                    case "clear":

                        break;

                    case "create":

                        break;
                    }

                    break;

                case "no":
                    $target.toggleClass("hidden");

                    $target.siblings($target.data("action")).toggleClass("hidden");
                    $target.siblings(".message").addClass("hidden"); // TO-DO: Wait some time...
                    // Re-enable edit mode if previously set!
                    break;

                }

                e.preventDefault();
            }

        });

        $("#ohandouts, #chandouts").on("click", ".upload", function (e) {

            var ifr = "ifr" + (iframes++);

            console.log(ifr + " CREATED.");

            var iframe = $('<iframe name="' + ifr + '" id="' + ifr + '"></iframe>');
			
			var $errors = $('<div class="errors"></div>').insertAfter($(e.target).closest(".details").find(".description"));
			
            $("body").append(iframe);

            iframe.load(function (e) {
                console.log(e.target.id + " LOADED.");
                console.log($(e.target.contentDocument || e.target.contentWindow.document).text());
				var response = JSON.parse($(e.target.contentDocument || e.target.contentWindow.document).text());
                $errors.html(response.msg);
                e.target.remove();
                iframes--;
                console.log(e.target.id + " REMOVED.");
            });

            $(e.currentTarget).parent().attr("target", ifr);
        });

        $("#ohandouts").on("change", function (e) {
            console.log(e);
            console.log(e.target.value);
            console.log($(e.target).val());

            if (e.target.type === "file") {
                var val = e.target.value;
                if (val) {
                    var path = val.split("\\");
                    e.target.previousSibling.innerHTML = path[path.length - 1];
                } else {
                    e.target.previousSibling.innerHTML = "No file selected..."
                }
            }
        });

        // TO-DO: requestAnimationFrame polyfill + timers class!!!

        var $lefts = $(".left").each(function () {
            $(this).data("df", $(this).siblings(".df").data("df"));
        });

        function recalc() {

            var now = new Date();

            requestAnimationFrame(function () {
                $lefts.each(function () {
                    $(this).text(Formatter.diff(now, $(this).data("df")));
                });

                setTimeout(recalc, 20000); // 20 sec
            });
        }

        recalc();


        // TO-DO:

        // Mark already downloaded handouts (a:visited).

        // Separate admin-only JS.
    });
   
}(window, $, Formatter));
