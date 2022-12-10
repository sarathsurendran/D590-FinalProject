
$().ready(function(){   
    $('#eda-chart').hide();
    $('#predictdetails').hide();
    $('.predict-results').hide();
    // Change selected dropdown value for charts and the display logic for each selection
    $('.dropdown-menu a').click(function () {
        var value = $(this).attr('value');
        console.log("Value selected :: " + value)
        $('#eda-chart').hide()
        $('#eda-chart img').attr('width', '900').attr('height', '750');
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
    
    
    data_json=JSON.parse(data)

    var make_codes=new Set()
    var make_names=new Set()
    var size_info=new Set()
    var condition_info=new Set()
    var veh_type=new Set()
    var veh_transmission=new Set()
    var make_model={}
    $.each(data_json,function(index,item){
        make_codes.add(data_json[index].make)
        make_names.add(data_json[index].manufacturer)
        size_info.add(data_json[index].size_codes+"~"+data_json[index].size)
        condition_info.add(data_json[index].condition_codes+"~"+data_json[index].condition)
        veh_type.add(data_json[index].type_codes+"~"+data_json[index].type)
        veh_transmission.add(data_json[index].transmission_codes+"~"+data_json[index].transmission)
        // creating a dictonary with make to model mapping
        if(make_model.hasOwnProperty(data_json[index].make)){
            var models=make_model[data_json[index].make]
            models.add(data_json[index].model_codes+"~"+data_json[index].model)
        }
        else{
            var model_codes=new Set()
            model_codes.add(data_json[index].model_codes+"~"+data_json[index].model)
            make_model[data_json[index].make]=model_codes
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
 
    make_codes=Array.from(make_codes)
    make_names=Array.from(make_names)
    size_info=Array.from(size_info)
    condition_info=Array.from(condition_info)
    veh_type=Array.from(veh_type)
    veh_transmission=Array.from(veh_transmission)
    $.each(make_codes,function(i,item){    
        $('.chosen-select-make').append('<option value="'+item+'">'+make_names[i]+'</option>')
    });
   
  
    $(".chosen-select-make .chosen-select-model").chosen({no_results_text: "Oops, nothing found!"});
    $('.chosen-select-model ').chosen();
    $('.chosen-select-size').chosen();
    $('.chosen-select-condition').chosen();
    $('.chosen-select-type').chosen();
    $('.chosen-select-transmission').chosen();

    //size
    $.each(size_info,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-size').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-size').trigger('chosen:updated')

    //condition
    $.each(condition_info,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-condition').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-condition').trigger('chosen:updated')

    //type
    $.each(veh_type,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-type').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-type').trigger('chosen:updated')

    //transmission
    $.each(veh_transmission,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-transmission').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-transmission').trigger('chosen:updated')

    //make
    $('.chosen-select-make').chosen().change(function() {
        $('.chosen-select-model').empty();
        var models=make_model[$(this).val()];
        models=Array.from(models)
        $.each(models,function(i,item){    
            model_struct=item.split("~")
            
            $('.chosen-select-model').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
        });
        $('.chosen-select-model').trigger('chosen:updated')
        //$('#' + $(this).val()).show();
    });
    $('button[id="predictbtn"').click(function(){
        $('form').hide();
        var server_data = {
            "make": "NA",
            "year": 0,
            "miles": 0,
            "model":0
        };

        // make": $('.chosen-select-make').chosen().val(),
        //     "year": $('#vehicle-year').val(),
        //     "miles": $('#vehicle-miles').val()

        $.ajax({
            type: "POST",
            url: "/predict_results",
            data: JSON.stringify(server_data),
            contentType: "application/json",
            dataType: 'json',
            success: function(result) {
              console.log("Result:");
              console.log(result.predicted_price);
              $('#pred_price').text(result.predicted_price +" USD")
              $('#predictdetails').show();
              $('.predict-results tbody').empty() //remove all children

              //parse through vehicles data and add to table
              veh_data=JSON.parse(result.data)
              $.each(veh_data,function(index,item){
                $('.predict-results tbody').append('<tr><td>'+(index+1)+'</td><td>'+item.model+'</td><td>'+item.type+'</td><td>'
                +item.manufacturer+'</td><td>'+item.condition+'</td><td>'+item.price+'</td>')          
            })
            } 
          });
    })

});

