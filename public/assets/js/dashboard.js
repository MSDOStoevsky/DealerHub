function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function delCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

function ajax_err(x, e) {
    var msg = '';
    if (x.status === 0) {
        msg = 'Not connect.\n Verify Network.';
    } else if (x.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (x.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (e === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (e === 'timeout') {
        msg = 'Time out error.';
    } else if (e === 'abort') {
        msg = 'Ajax request aborted.';
    } else {
        msg = 'Uncaught Error.\n' + x.responseText;
    }
    alert(msg);
}

function ldfrom(loc) {
    $("#main > div").addClass("hidden");
    $(loc).removeClass("hidden");
}

function drkthm() {
    $("body").css("background-color", "#222");
    $("body").css("color", "#fff");
    $(".modal-content").css("background-color", "#222");
}

/* construct and open modal */
function modal(head, body, lbtn, rbtn, laction, raction){
    $("#modal-frame").find(".header-title").text(head);
    $("#modal-frame").find(".modal-body").html(body);
    $("#modal-frame #lbtn").val(lbtn);
    $("#modal-frame #rbtn").val(rbtn);
    $("#modal-frame #lbtn").on("click", function(){
        laction();
    });
    $("#modal-frame #rbtn").on("click", function(){
        raction();
    });
    $("#modal-frame").css("display", "block");
}