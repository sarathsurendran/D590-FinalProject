
$().ready(function(){   
    $('#eda-chart').hide();
    $('#predictdetails').hide();
    $('#nav-pred .loader').hide();
    $('#nav-tabContent .loader').hide();
    $('#chartsdropdwn').show();

    $('.reg-warning').hide();

    $('.coef-plot').hide();
    $('.reg-details').hide();
    $('.reg-loader').hide();
    $('.pred-warning').hide();

    // Change selected dropdown value for charts and the display logic for each selection
    $('#chartselect a').click(function () {
        var value = $(this).attr('value');
        console.log("Value selected :: " + value)
        $('#eda-chart').hide()
        $('#eda-chart img').attr('width', '1000').attr('height', '800');
        if (value == 0) {
            $('#chartsdropdwnbtn span').text("Select Chart to display");
            $('#eda-chart').fadeOut(1000);
        }
        else {
            $('#chartsdropdwnbtn span').text($(this).text());
            if (value == 1) {
                $('#eda-chart img').attr('src', 'static/images/charts/year_count.png');
                $('#eda-chart img').attr('width', '1000').attr('height', '800');
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
    
   
    
    $('.chosen-select-features ').chosen();
    $('.chosen-select-reg-model').chosen();

    $('#regnbtn').click(function(){
        $('.reg-warning').hide();
        cols=$('.chosen-select-features').chosen().val()
        model=$('.chosen-select-reg-model').chosen().val()

        //validation
        if(cols.length == 0 || model == -1){
            $('.reg-warning').show();
            return;
        }

        var server_data={
            "cols":cols,
            "model":model
        }

        $('.coef-plot').hide();
        $('.reg-details').hide();
        $('.reg-loader').show();
        $.ajax({
            type: "POST",
            url: "/regression-analysis",
            data: JSON.stringify(server_data),
            contentType: "application/json",
            dataType: 'json',
            success: function(result) {
              console.log("Result: ");
              console.log(result)
              var score=result.score;
              var coefs=result.coefficients;
              var intercept=result.intercept;
              var mse=result.mse;
              var r2=result.r2score;
              console.log(coefs)
              $('#reg_score').text(score);
              $('#reg_mse').text(mse);
              $('#reg_r2').text(r2);
              $('#reg_intercept').text(intercept);
              $('.coef-plot').show();
              $('.reg-details').show();
              $('.reg-loader').hide();
              var coef_ul=$('<ul class="list-group"></ul>')
              
              $.each(coefs,function(i,item){
                coef_ul.append('<li class="list-group-item">'+item+'</li>');
              })
              $('#reg_coef').empty()
              $('#reg_coef').append(coef_ul)
              $('#coef_img').attr("src","static/images/charts/coef.png?t="+ new Date().getTime())


            } 
          });

    });

    
    data_json=JSON.parse(data)

    var make_codes=new Set()
    var make_names=new Set()
    var size_info=new Set()
    var condition_info=new Set()
    var veh_type=new Set()
    var veh_transmission=new Set()
    var make_model={}
    var veh_drive=new Set()
    var veh_color=new Set()
    var veh_cyl=new Set()
    $.each(data_json,function(index,item){
        make_codes.add(data_json[index].make)
        make_names.add(data_json[index].manufacturer)
        size_info.add(data_json[index].size_codes+"~"+data_json[index].size)
        condition_info.add(data_json[index].condition_codes+"~"+data_json[index].condition)
        veh_type.add(data_json[index].type_codes+"~"+data_json[index].type)
        veh_transmission.add(data_json[index].transmission_codes+"~"+data_json[index].transmission)
        veh_drive.add(data_json[index].drive_codes+"~"+data_json[index].drive)
        veh_color.add(data_json[index].paint_color_codes+"~"+data_json[index].paint_color)
        veh_cyl.add(data_json[index].cylinders_codes+"~"+data_json[index].cylinders)
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
    
    $('.regression-tab').click(function(){
        $('.regr-form').show()
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
    veh_drive=Array.from(veh_drive)
    veh_color=Array.from(veh_color)
    veh_cyl=Array.from(veh_cyl)
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

    //make .. on change of make
    $('.chosen-select-make').chosen().change(function() {console.log($(this).val())
        $('.chosen-select-model').empty();
        $('.chosen-select-model').append('<option value="-1">None</option>')
        if($(this).val() == -1){
            $('.chosen-select-model').trigger('chosen:updated')
            return;
        }
        var models=make_model[$(this).val()];
        models=Array.from(models)
        $.each(models,function(i,item){    
            model_struct=item.split("~")
            $('.chosen-select-model').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
        });
        $('.chosen-select-model').trigger('chosen:updated')
        //$('#' + $(this).val()).show();
    });

    //drive
    $('.chosen-select-drive').chosen()
    $.each(veh_drive,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-drive').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-drive').trigger('chosen:updated')

    //color
    $('.chosen-select-color').chosen()
    $.each(veh_color,function(i,item){
        model_struct=item.split("~")
        $('.chosen-select-color').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
    });
    $('.chosen-select-color').trigger('chosen:updated')

     //cylinders
     $('.chosen-select-cylinders').chosen()
     $.each(veh_cyl,function(i,item){
         model_struct=item.split("~")
         $('.chosen-select-cylinders').append('<option value="'+model_struct[0]+'">'+model_struct[1]+'</option>')
     });
     $('.chosen-select-cylinders').trigger('chosen:updated')

     $('.chosen-select-pred-model').chosen()

    $('button[id="predictbtn"').click(function(){
       
        //building server data
        var server_data = {
            "make": $('.chosen-select-make').chosen().val(),
            "model":$('.chosen-select-model').chosen().val(),
            "size":$('.chosen-select-size').chosen().val(),
            "condition":$('.chosen-select-condition').chosen().val(),
            "transmission":$('.chosen-select-transmission').chosen().val(),
            "drive":$('.chosen-select-drive').chosen().val(),
            "cylinders":$('.chosen-select-cylinders').chosen().val(),
            "type":$('.chosen-select-type').chosen().val(),
            "color":$('.chosen-select-color').chosen().val(),
            "year": 0,
            "miles": -1,
            "regressionmodel":$('.chosen-select-pred-model').chosen().val()
        };

        if($('#veh-miles').val()){
            server_data.miles=$('#veh-miles').val()
        }
        if($('#veh-year').val()){
            server_data.year=$('#veh-year').val();
        }
        min_factors=3
        factors_present=0
        for (var key in server_data) {
            if (server_data.hasOwnProperty(key)) {
                if(key == 'year' || key == 'regressionmodel'){
                    if(server_data[key] != 0){
                        factors_present++
                    }
                }
                else{
                    if(server_data[key] > -1){
                        factors_present++
                    }
                }
            }
        }
        if(factors_present<4){
            $('.pred-warning').show();
            return;
        }

        $('form').hide();
        $('#nav-pred .loader').show();
        //defaulting regression model to 1 if its not selected
        if(!$('.chosen-select-pred-model').chosen().val()){
            server_data.regressionmodel=1
        }

        
        $.ajax({
            type: "POST",
            url: "/predict_results",
            data: JSON.stringify(server_data),
            contentType: "application/json",
            dataType: 'json',
            success: function(result) {
              console.log("Result:");
              console.log(result.predicted_price);
              $('#nav-pred .loader').hide();
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

