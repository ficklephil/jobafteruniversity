var jobMatches = [];

var ractive = new Ractive({
    el:'container',
    template:'#myTemplate',
    data: {greeting:'hello',recipient:'sdsds',estimatedPay:580,jobTitle:'Job Title Holder',qualificationsRequired:'Qualifications Holder',workFutureJobs:2323,jobs:jobMatches,percentSkillsShortages:20,percentHardToFill:20,percentHardToFillIsSkillsShortages:21,unemploymentRate:6}
});

$(function() {
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    $( "#graduation-input" ).autocomplete({
        source: availableTags
    });
});

console.log('gets to search');
$( "#career-input" ).autocomplete({
    source: function( request, response ) {
        $.ajax({
            url: "http://api.lmiforall.org.uk/api/v1/soc/search?q="+request.term,
            dataType: "jsonp",
            data: {
                featureClass: "P",
                style: "full",
                maxRows: 12
            },
            success: function( data ) {
                response( $.map( data, function( item ) {
                    return {
                        value: item.title,
                        soc: item.soc
                    }
                }));
            }
        });
    },
    minLength: 3,
    delay: 200,
    select: function( event, ui ) {
//        console.log( ui.item ?
//            "Selected: " + ui.item.label :
//            "Nothing selected, input was " + this.value);

        //what we want here is the soc code
        console.log('scroll to anchor');
        console.log('Soc code of selected item is ' + ui.item.soc);
        var soc = ui.item.soc;
        getExtendedJobInfomation(soc);
        getSkillsShortages(soc,1);
        getUnemployment(soc);
        getWorkFuture(soc);


        scrollToStart();


//        $('.search').scrollTo(500);
//        scrollToAnchor('.career-data');
    },
    open: function() {
        console.log('open');
//        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {

        console.log('close');
//        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    },
    change: function(){
      console.log('change');
    },

    focus: function(event, ui){
        console.log('focus');

        console.log('Soc code of selected item is ' + ui.item.soc);
        var soc = ui.item.soc;

        //think about putting work futures in here when finished.
        //getWorkFuture(soc);



    }

});


ractive.on( 'search', function( event ){
//    console.log('gets to search');
//    $( "#career-input" ).autocomplete({
//        source: function( request, response ) {
//            $.ajax({
//                url: "http://api.lmiforall.org.uk/api/v1/soc/search?q="+request.term,
//                dataType: "jsonp",
//                data: {
//                    featureClass: "P",
//                    style: "full",
//                    maxRows: 12
//                },
//                success: function( data ) {
//                    response( $.map( data, function( item ) {
//                        return {
//                            label: item.title,
//                            value: item.soc
//                        }
//                    }));
//                }
//            });
//        },
//        minLength: 4,
//        delay: 200,
//        select: function( event, ui ) {
////        log( ui.item ?
////            "Selected: " + ui.item.label :
////            "Nothing selected, input was " + this.value);
//        },
//        open: function() {
////        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
//        },
//        close: function() {
////        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
//        }
//    });




    //we need to clear list

//    jobMatches.splice(0);
//
//    console.log($('.search-input').val());
//    var searchInput = $('.search-input').val();

   // searchForJob(searchInput);
});

ractive.on( 'select-job', function( event ){

    node = event.node;
    soc = node.getAttribute( 'value' );
    console.log(node.getAttribute( 'value' ));

    getEstimatedPay(soc);
    getExtendedJobInfomation(soc);
    getWorkFuture(soc);

    console.log('get Skills shortages');
    getSkillsShortages(soc,1);

});

function searchForJob(searchInput){
    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/soc/search?q='+searchInput,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            for(var jobIndex=0;jobIndex < json.length; jobIndex++){
                jobMatches.push({name:json[jobIndex].title.toString(), soc:json[jobIndex].soc})
            }
        },
        error: function(e) {
            console.log(e.message);
            alert('Unable to get back searches for jobs');
        }
    });
}

function searchJobData(){
    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/soc/search?q=science',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log(JSON.stringify(json));
//                       alert('I have JSON');
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON');
        }
    });
}

function getExtendedJobInfomation(soc){
    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/soc/code/'+soc,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('Extended Soc info : ' + JSON.stringify(json));

            console.log('Job title' + json.title);
            console.log('qualificationsRequired' + json.title);

            ractive.set('jobTitle', json.title) ;
            ractive.set('qualificationsRequired', json.qualifications) ;

//                       alert('I have JSON');
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON');
        }
    });
}

/**
 * The ESS reports what percentage of vacancies are hard to fill and how much of that is due to skills shortages.
 *
 * Use this to return the skills shortages within a given region
 *
 * WARNING : Region of London hardcoded here for now.
 * WARNING : you need to do some calulations here around hard to fill jobs
 * and job shortges
 * @param soc
 */

function getSkillsShortages(soc,region){
    console.log('getSkillsShortages' + soc + region);

    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/ess/region/'+region+'/'+soc+'?coarse=true',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('ESS Data on Skills Shortages : ' + JSON.stringify(json));

            ractive.set('percentSkillsShortages', json.percentSSV)
            ractive.set('percentHardToFill', json.percentHTF)
            ractive.set('percentHardToFillIsSkillsShortages', json.percentHTFisSSV)
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON from Skills shortages');
        }
    });
}

/**
 * The Labour Force Survey provides the LMI For All API's unemployment information. Note that unemployment is not
 * precisely tracked per occupation in the LFS, so the figures are somewhat fuzzy.
 *
 * NOTE : Here we can actaully get the unemployment by age!
 * Also by qualification, also by Female/Males
 *
 * @param soc
 * @param region
 */
function getUnemployment(soc){
    $.ajax({
        type: 'GET',
//        url: 'http://api.lmiforall.org.uk/api/v1/ess/region/'+region+'/'+soc+'?coarse=true',
        url: 'http://api.lmiforall.org.uk/api/v1/lfs/unemployment?soc='+soc+'&minYear=2012&maxYear=2012',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('LFS Data on Unemployment : ' + JSON.stringify(json));

          ractive.set('unemploymentRate', json.years[0].unemprate)
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON from Unemployment');
        }
    });
}

//soc is Standard Occupational Classification
function getEstimatedPay(soc){
    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc='+soc+'&coarse=true',
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            console.log('Estimated Pay Info : ' + JSON.stringify(json));
            console.log(json.series[0].estpay);

            ractive.set('estimatedPay', json.series[0].estpay)
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON');
        }
    });
}

function getWorkFuture(soc){
    console.log('get work futures');
    $.ajax({
        type: 'GET',
        url: 'http://api.lmiforall.org.uk/api/v1/wf/predict?soc='+soc+'&minYear=2013&maxYear=2020',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
//            console.log('Work Future : ' + JSON.stringify(json));
            drawChart(createDataForChart(json));


//           ractive.set('workFutureJobs', json.predictedEmployment[3].employment)
        },
        error: function(e) {
            console.log(e.message);
            alert('I have no JSON');
        }
    });
}

function scrollToStart(){
    console.log('scrolling');
//    $('html, body').animate({
//        scrollTop: $("#start-content").offset().top
//    }, 1000);
}

//scrollToStart();
//drawChart();

function createDataForChart(json){
    console.log(JSON.stringify(json));

    //for each item.year add a year to the 'labels'
    //for each item.employment add a data to the dataset

    var year=[];
    var predictedNumberEmployed=[];

    for(var i=0;i<json.predictedEmployment.length;i++){
        year.push(json.predictedEmployment[i].year);

        console.log('predicted employment employment' + json.predictedEmployment[i].employment );
        predictedNumberEmployed.push(parseInt(json.predictedEmployment[i].employment));

        console.log('parse int' + parseInt(json.predictedEmployment[i].employment));
        //convert to number




    }




    var data = {
        labels : year,
        datasets : [
            {
                fillColor : "rgba(255,204,0,0.45)",
//                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "#1b1b1b",
                pointColor : "#CE0043",
                pointStrokeColor : "#fff",
                data : predictedNumberEmployed
            },
        ]
    }

    return data;
}

function drawChart(data){
    //Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d");



    var options = {
        bezierCurve : false
    }

        var myNewChart = new Chart(ctx).Line(data,options);             //watch out here for memory issues

}