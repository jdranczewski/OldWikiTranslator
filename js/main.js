datatest = "";
$(document).ready(function() {
    
    $("#search_box").keyup($.throttle(function(e) {
        if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
            if ($("#search_box").val() !== "") {
                $.ajax( {
                    url: 'https://en.wikipedia.org/w/api.php?callback=?',
                    data: {'action' : 'query', 'format' : 'json', 'list' : 'prefixsearch', 'pslimit' : 5, 'pssearch' : $("#search_box").val()},
                    dataType: 'json',
                    type: 'POST',
                    headers: { 'Api-User-Agent': 'Example/1.0' },
                    success: function(data) {
                        console.log(data);
                        $("#autocomplete").empty();
                        $.each(data['query']['prefixsearch'], function(index, value) {
                            $("#autocomplete").append("<div class='ac_el'>" + value['title'] + '</div>');
                            $("#autocomplete .ac_el").last().data("id", value['pageid']);
                        });
                        if (data['query']['prefixsearch'].length) {
                            $("#autocomplete .ac_el").first().addClass("selected");
                            $("#autocomplete .ac_el").click(function() {
                                $(".selected").removeClass("selected");
                                $(this).addClass("selected");
                                loadTranslation();
                            });
                            $("#autocomplete").show();
                        } else {
                            $("#autocomplete").hide();
                        }
                    }
                });
            } else {
                $("#autocomplete").hide();
                $("#autocomplete").empty();
            }
        }
    }, 400));
    
    $("#search_box").keyup(function(e) {
        if (e.keyCode === 40 && $("#autocomplete .selected").next().length !== 0) {
            $("#autocomplete .selected").next().addClass("selected");
            $("#autocomplete .selected").first().removeClass("selected");
            $("#search_box").val($("#autocomplete .selected").text());
        } else if (e.keyCode === 38 && $("#autocomplete .selected").prev().length !== 0) {
            $("#autocomplete .selected").prev().addClass("selected");
            $("#autocomplete .selected").last().removeClass("selected");
            $("#search_box").val($("#autocomplete .selected").text());
        } else if (e.keyCode === 13 && $("#search_box").val() !== "") {
            loadTranslation();
        }
        
    });
    
    function loadTranslation(){
        sourceID = $("#autocomplete .selected").data("id");
        $("#autocomplete").empty().hide();
        $.ajax( {
            url: 'https://en.wikipedia.org/w/api.php?callback=?',
            data: {'action' : 'query', 'format' : 'json', 'prop' : 'extracts', 'exintro' : '', 'explaintext' : '', 'exsentences' : '3', 'redirects' : '' , 'pageids' : sourceID},
            dataType: 'json',
            type: 'POST',
            headers: { 'Api-User-Agent': 'Example/1.0' },
            success: function(data) {
                datatest = data
                console.log(data)
                // Workaround of the redirection problem - we do not always know the ID of the article
                $.each(data['query']['pages'], function(index, value) {
                    sourceID = value['pageid']
                });
                $("#search_box").val(data['query']['pages'][sourceID]['title']);
                $("#from_extract").text(data['query']['pages'][sourceID]['extract']);
            }
        });
    }
    
});