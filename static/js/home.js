
$().ready(function(){   
    $('#eda-chart').hide();
    $('#predictdetails').hide();
    $('.predict-results').hide();
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
    
    
    test=JSON.parse(data)
    test_price=JSON.parse(data_price)
    var make_codes=new Set()
    var make_names=new Set()
    var count=0;
    $.each(test,function(index,item){
        make_codes.add(test[index].make)
        make_names.add(test[index].manufacturer)

    })

    make_codes_price=[]
    $.each(test_price,function(index,item){
        if(index <15){        
            $('.predict-results tbody').append('<tr><td>'+(index+1)+'</td><td>'+item.model+'</td><td>'+item.type+'</td><td>'
        +item.manufacturer+'</td><td>'+item.condition+'</td><td>'+item.price+'</td>')
    }
    })

    $('.pred-tab').click(function(){
        $('#predictdetails').hide();
        $('.predict-results').hide();
        $('form').show()
    })
    
    $('#showresults').click(function(){
        $('.predict-results').show()
    })
    console.log(make_codes)
    make_codes=Array.from(make_codes)
    make_names=Array.from(make_names)
    $.each(make_codes,function(i,item){    
        $('.chosen-select').append('<option value="'+i+'">'+make_names[i]+'</option>')
    });
   
    $(".chosen-select").chosen({no_results_text: "Oops, nothing found!"});

    $('button[id="predictbtn"').click(function(){
        $('form').hide();

        $('#predictdetails').show();
    })

});

