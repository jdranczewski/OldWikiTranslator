datatest = ""
$(document).ready(function() {
    
    $("#search_box").keyup($.throttle(autocompleteAjax, 400));
    
    function autocompleteAjax() {
        if ($("#search_box").val() != "") {
            $.ajax( {
                url: 'https://en.wikipedia.org/w/api.php?callback=?',
                data: {'action' : 'query', 'format' : 'json', 'list' : 'prefixsearch', 'pslimit' : 5, 'pssearch' : $("#search_box").val()},
                dataType: 'json',
                type: 'POST',
                headers: { 'Api-User-Agent': 'Example/1.0' },
                success: function(data) {
                    console.log(data);
                    $("#autocomplete").empty()
                    $.each(data['query']['prefixsearch'], function(index, value) {
                        $("#autocomplete").append("<div class='ac_el'>" + value['title'] + '</div>')
                    })
                    $("#autocomplete").show()
                }
            });
        } else {
            $("#autocomplete").hide()
            $("#autocomplete").empty();
        }
    }
    
});