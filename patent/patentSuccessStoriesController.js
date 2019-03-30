(function () {
    'use strict';
    var patentFunctions = PatentHelper();

    angular
        .module('patent')
        .controller('patentSuccessStoriesController', patentSuccessStoriesController);
    patentSuccessStoriesController.$inject = ['DTOptionsBuilder', 'DTColumnBuilder', '$interval','$sce', '$location', '$state', '$scope', '$stateParams', 'User', '$window'];

    function patentSuccessStoriesController(DTOptionsBuilder, DTColumnBuilder,$interval, $sce, $location, $state, $scope, $stateParams, User, $window) {
        var vm = this;
        var i = 0;
        vm.story = {};
        vm.done = false;
        vm.title = "Success Stories of Patents in FIU";
        vm.stories =[];

        $.ajax({url: "https://spreadsheets.google.com/feeds/list/1cTMaImTf-DbiFdDToYBE328OsdghvVh_tgLyrLw0hBo/od6/public/values?alt=json"})
        .done(function (result){

            var temp = [];
            for(i = 0; i < result.feed.entry.length; i ++){
                temp.push({            
                    'header': result['feed']['entry'][i]['title']['$t'],           
                    'patent': result['feed']['entry'][i]['gsx$patent']['$t'], 
                    'faculty': result['feed']['entry'][i]['gsx$faculty']['$t'], 
                    'image': result['feed']['entry'][i]['gsx$image']['$t'], 
                    'story': result['feed']['entry'][i]['gsx$story'], 
                    'summary': result['feed']['entry'][i]['gsx$summary'],             
                });                
            }
            vm.stories = temp;
        }).always(function() {
            
          });




        vm.done = true;
        vm.stories = vm.stories;
        vm.search = search;
        var start = 0;
        var entries = 10;



    

        function search() {

            var name = document.getElementById("searchForm").elements["searchItem"].value;
            var pattern = name.toLowerCase();
            var targetId = "";

            var divs = document.getElementsByClassName("col-md-2");
            for (var i = 0; i < divs.length; i++) {
                var para = divs[i].getElementsByTagName("p");
                var index = para[0].innerText.toLowerCase().indexOf(pattern);
                if (index != -1) {
                    targetId = divs[i].parentNode.id;
                    document.getElementById(targetId).scrollIntoView();
                    break;
                }

            }
        };

        vm.submitStories = submitStories;
        function submitStories() {
            //console.log("here");
            
           // console.log(vm.story);

        }

        var dtOptions = DTOptionsBuilder.newOptions()/*.withOption('ajax', {
           
    
            beforeSend: function( xhr ) {
         
              },
            url: 'https://developer.uspto.gov/ibd-api/v1/patent/application?criteriaSearchText=assignee%3A%22florida%20international%20university%22%20AND%20documentType%3Agrant&start=' + start +'&rows=' + entries,    
            type: 'GET',
            "dataSrc": function ( json ) {

                json.response.recordsTotal = json.response.numFound;
                json.response.recordsFiltered = json.response.numFound;
                json.response.draw = 0;

                return json;

            }      
   
        })    */
        .withFnServerData(ServerData)

        .withDataProp('patents')
        .withPaginationType('full_numbers')
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('lengthMenu', [10, 25, 50, 75, 100])
        .withOption('searching', false);


        var dtColumns = [    
            DTColumnBuilder.newColumn('patents').withTitle('Title').renderWith(function(data, type, full) 
             {                               
                  return full.title;
             }).withOption('defaultContent', 'N/A').notSortable(),
             DTColumnBuilder.newColumn('patents').withTitle('Patent Number').renderWith(function(data, type, full) 
             {
                  return full.patentNumber;            
        
             }).withOption('defaultContent', 'N/A').notSortable(),
                
            DTColumnBuilder.newColumn('patents').withTitle('Date').renderWith(function(data, type, full) 
             {
                
                  return full.publicationDate.slice(0, -10);        
        
             }).withOption('defaultContent', 'N/A').notSortable(),
            DTColumnBuilder.newColumn('patents').withTitle('Inventors').renderWith(function(data, type, full) 
            {               
                  var inventor_names = "";
                  if (full.inventor.length == 1)
                  {
                    inventor_names += full.inventor[0];
                  } else 
                  {
                      for (i = 0; i < full.inventor.length - 1; i++) 
                      {
                        inventor_names += full.inventor[i]  + ", <br>";
                      }
                      inventor_names += full.inventor[i];
                    }
                    return inventor_names;                  
        
            }).withOption('defaultContent', 'N/A').notSortable(),
            DTColumnBuilder.newColumn('patents').withTitle('Assignees:').renderWith(function(data, type, full) 
            {            
                  var assignee_names = "";                               
                  if(full.assignee == undefined)
                  return null;
            
                  if (full.assignee.length == 1)
                    {
                      assignee_names += full.assignee[0];
                    } else 
                    {
                      assignee_names+= "<br>"
                    for (i = 0; i < full.assignee.length - 1; i++) 
                    {
                        assignee_names += full.assignee[i] + ", <br>";
                    }
                      assignee_names += full.assignee[i];
                    }
            
                    if (assignee_names == "")
                    return null;  
            
                    return assignee_names;                        
          
             }).withOption('defaultContent', 'N/A').withClass('none').notSortable(),
          
             DTColumnBuilder.newColumn('patents').withTitle('View Document').renderWith(function(data, type, full) 
             {
                  var patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";
                  patent_url_text += full.patentNumber + ".PN.&OS=PN/" + full.patentNumber + "&RS=PN/" + full.patentNumber;
                  var link = '<a href="' + patent_url_text + '" target="_blank"> <i class="glyphicon glyphicon-book"></a>';
                   return link;             
                      
             }).withOption('defaultContent', 'N/A').notSortable()                
           ]; 

           vm.dtOptions = dtOptions;
           vm.dtColumns = dtColumns;
           vm.dtInstance = {};
           


           $interval(refresh, 100);
           function refresh(){
            vm.stories = vm.stories;
           }



           function ServerData(sSource, aoData, fnCallback, oSettings) {
            var api = this.api();
            var pgNo = api.page.info();
            var entries = api.page.len();
            start =  pgNo.page * 10;

            oSettings.jqXHR =
            $.ajax({
                url: 'https://developer.uspto.gov/ibd-api/v1/patent/application?criteriaSearchText=assignee%3A%22florida%20international%20university%22%20AND%20documentType%3Agrant&start=' + start +'&rows=' + entries,
    
             method: 'GET',
             dataType: 'json'
            })
            .done(function (data){
                var json =  data.response;       
                json.patents = json.docs;
                delete json.docs;  
                
                
                json.recordsTotal = json.numFound;
                json.recordsFiltered = json.numFound;
                json.draw = 0;
                delete json.numFound;                 
                fnCallback(json);
            })

           }

    }

})();