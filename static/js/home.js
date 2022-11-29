
$().ready(function(){   
    $('#eda-chart').hide();
    // Change selected dropdown value for charts and the display logic for each selection
    $('.dropdown-menu a').click(function () {
        var value = $(this).attr('value');
        console.log("Value selected :: " + value)
        $('#eda-chart').hide()
        $('#eda-chart img').attr('width', '700').attr('height', '700');
        if (value == 0) {
            $('#chartsdropdwnbtn span').text("Select Chart to display");
            $('#eda-chart').fadeOut(1000);
        }
        else {
            $('#chartsdropdwnbtn span').text($(this).text());
            if (value == 1) {
                $('#eda-chart img').attr('src', 'static/images/charts/year_count.png');
                $('#eda-chart img').attr('width', '900').attr('height', '800');
            }
            else if (value == 2) {
                $('#eda-chart img').attr('src', 'static/images/charts/by_region.png');
            }
            else if (value == 3) {
                $('#eda-chart img').attr('src', 'static/images/charts/clynd_count.png');
            }
            else if (value == 4) {
                $('#eda-chart img').attr('src', 'static/images/charts/paint_count.png');
            }
    
            $('#eda-chart').fadeIn(1000);
        }
    });
    
    
    $.each(data.made_by,function(i,item){
        $('.chosen-select').append('<option value="'+i+'">'+item+'</option>')
    });
    $(".chosen-select").chosen({no_results_text: "Oops, nothing found!"});

});

