// Task: PROF-53 | VIP-19, croja022 (add patent feature)
// Initial file creation with incomplete implementation.
// User Story: PROF-32 | VIP-19, enwam001 (patent search)
// Added initial full implementation
(function () {
  'use strict';

  var patentFunctions = PatentHelper();

  angular
      .module('patent')
      .controller('patentSearchController', patentSearchController);
      patentSearchController.$inject = ['DTOptionsBuilder', 'DTColumnBuilder','$sce', '$interval','$location', '$state', '$scope', '$stateParams', 'User', '$window','$compile'];
  /* @ngInject */
  var i = 0;
  var serverSideDraw = 0;
  var token;
  var valid_token = false;
  var search_type = "USPTO";
  function patentSearchController(DTOptionsBuilder, DTColumnBuilder, $sce, $interval,$location, $state, $scope, $stateParams, User, $window ,$compile) {
    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      
      if ("withCredentials" in xhr) {
         
         // XHR for Chrome/Firefox/Opera/Safari.
         xhr.open(method, url, true);
      } else if (typeof XDomainRequest != "undefined") {
         
         // XDomainRequest for IE.
         xhr = new XDomainRequest();
         xhr.open(method, url, true);
      } else {
         
         // CORS not supported.
         xhr = null;
      }
      return xhr;
   }
  
  var vm = this;
  vm.done = false;
  vm.done = true;
  vm.query = "";
  vm.options = ['USPTO', 'USPTO V2', 'EPO'];
  vm.displayProgress = false;
  vm.max = 100;
  vm.dynamic = 0;
  var start = 0;
  vm.selection = vm.options[0];
  vm.exported = [];
  var dtOptions = DTOptionsBuilder.fromSource('')
  .withFnServerData(ServerData)
  .withOption('fnRowCallback', rowCallback)
  .withPaginationType('full_numbers')
  .withOption('responsive', true)
  .withDataProp('patents')
  .withOption('processing', true)
  .withOption('lengthMenu', [10, 25, 50, 75, 100])
  .withOption('serverSide', true)
  //.withOption('lengthChange', false)
  .withOption('searching', false)

  // User Story: PROF-8 | VIP-19, croja022 (patent search report feature)
  // Added row callback, select plugin, buttons plugin
  .withSelect({
    style: 'multi'
  })
  .withButtons([
    'colvis',        
    //'print',
    {
      extend: 'selected',
      text: 'Save Selected',
      action: function(e, dt, button, config) {
          var selectedRows = dt.rows({
                selected: true
              }),
              rowsSelected = selectedRows.indexes().length,
              rowData = selectedRows.data();
              var $rows = $("#patentsTable tr.selected");
          for (var i = 0; i < rowsSelected; i++) {
              var copyModel = Object.assign({},rowData[i]),
                  text = '';
                  switch (vm.selection) {
                    case 'USPTO':
                      text = patentFunctions.ustpoModelToString(copyModel);
                      break;
                    case 'USPTO V2':
                      text = patentFunctions.ustpoV2ModelToString(copyModel);
                      break;
                    case 'EPO':
                      var model = {patent_title: $rows[i].cells[0].innerText,
                                  patent_number: $rows[i].cells[1].innerText},
                      text = patentFunctions.ustpoModelToString(model);
                      break;
                    default:
                      text = '';
                   }
              if(vm.exported.indexOf(text) < 0 ){
                  vm.exported.push(text);
                  $scope.$apply();
              }
          }
      }
    }]
  );
  //END User Story: PROF-8 | VIP-19, croja022 (business search report feature)

  // User Story: FA18 | PROF-22, enwam001 (patent search feature)
  var dtColumns = [    
    DTColumnBuilder.newColumn('patents').withTitle('Title').renderWith(function(data, type, full) 
     {
         if(search_type == 'USPTO')
         {
            if (full == null)
            return null;
            return full.patent_title;
         } else  if(search_type == 'EPO'){
            if(Array.isArray(full['exchange-document'])){
                if (Array.isArray(full['exchange-document'][0]['bibliographic-data']['invention-title'])){
        
                  for(i = 0; i < full['exchange-document'][0]['bibliographic-data']['invention-title'].length; i++ )
                  {
                    if(full['exchange-document'][0]['bibliographic-data']['invention-title'][i]['@lang'] == "en")
                      return full['exchange-document'][0]['bibliographic-data']['invention-title'][i]['$']; 
                  }          
                } else{
                  return  full['exchange-document'][0]['bibliographic-data']['invention-title']['$']
                }      
              }  
        
              if (Array.isArray(full['exchange-document']['bibliographic-data']['invention-title'])){         
                for(i = 0; i < full['exchange-document']['bibliographic-data']['invention-title'].length; i++ )
                {
                  if(full['exchange-document']['bibliographic-data']['invention-title'][i]['@lang'] == "en")
                    return full['exchange-document']['bibliographic-data']['invention-title'][i]['$']; 
                }
              } else{
                return  full['exchange-document']['bibliographic-data']['invention-title']['$']
              }
         } else if(search_type == "USPTO V2"){
          return full.title;
         }

     }).withOption('defaultContent', 'N/A').notSortable(),
     DTColumnBuilder.newColumn('patents').withTitle('Patent Number').renderWith(function(data, type, full) 
     {
        if(search_type == 'USPTO')
        {
            if (full == null)
            return null;
      
            return full.patent_number;
        } else if(search_type == 'EPO'){
            if(Array.isArray(full['exchange-document'])){
                return full['exchange-document'][0]['bibliographic-data']['application-reference']['document-id'][1]['doc-number']['$'];    
              }  
        
              return full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['doc-number']['$'];
        } else if(search_type == "USPTO V2"){
          return full.patentNumber;
         }

     }).withOption('defaultContent', 'N/A').notSortable(),
     DTColumnBuilder.newColumn('patents').withTitle('Abstract:').renderWith(function(data, type, full) 
     {
        if(search_type == 'USPTO')
        {
            if (full == null)
            return null;      
            return full.patent_abstract;
        } else if(search_type == 'EPO'){

            if(Array.isArray(full['exchange-document'])){

                if(Array.isArray(full['exchange-document'][0]['abstract']))
                {
                  return(full['exchange-document'][0]['abstract'][0]['p']['$'])
                }else{
                    if(full['exchange-document'][0]['abstract'] == undefined)
                    return null
                  return(full['exchange-document'][0]['abstract']['p']['$'])
                }      
              }  
        
              if(Array.isArray(full['exchange-document']['abstract'])){        
                for(i = 0; i < full['exchange-document']['abstract'].length; i++){
                  if(full['exchange-document']['abstract'][i]['@lang'] == "en"){
                  return(full['exchange-document']['abstract'][i]['p']['$']) 
                } else {return(full['exchange-document']['abstract'][0]['p']['$']) }
                } 
              }  
              if(full['exchange-document']['abstract'] == undefined )
              return null;
        
              return full['exchange-document']['abstract']['p']['$'];
        } else if(search_type == "USPTO V2"){
          return null;
         }


     }).withOption('defaultContent', 'N/A').withClass('none').notSortable(),
    DTColumnBuilder.newColumn('patents').withTitle('Category:').renderWith(function(data, type, full) 
     {
      if(search_type == 'USPTO')
      {
          if (full == null)
          return null;
    
          return full.patent_type;
      }else if(search_type == 'EPO'){
        // User Story: FA18 | PROF-27, enwam001 (patent search feature)
        var international = "<br>International: ";
        var cooperative = "<br>Cooperative: ";
        var temp = "";
          if(Array.isArray(full['exchange-document'])){
  
           if (full ['exchange-document'][0]['bibliographic-data']['classifications-ipcr'] != undefined){
            if(Array.isArray(full['exchange-document'][0]['bibliographic-data']['classifications-ipcr']['classification-ipcr'])){        
              for(i = 0; i < full['exchange-document'][0]['bibliographic-data']['classifications-ipcr']['classification-ipcr'].length; i++)
              {            
                temp = full['exchange-document'][0]['bibliographic-data']['classifications-ipcr']['classification-ipcr'][i]['text']['$'].replace(/\s\s+/g, '').slice(0, -3);
                international += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>'; 
              }
            } else {
              temp = full['exchange-document'][0]['bibliographic-data']['classifications-ipcr']['classification-ipcr']['text']['$'].replace(/\s\s+/g, '').slice(0, -3);        
              international += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>'; 
            }
           }
           if (full ['exchange-document'][0]['bibliographic-data']['patent-classifications'] != undefined){
            if(Array.isArray( full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'])){        
  
              for(i = 0; i < full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'].length; i++)
              {      
                if(full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['classification-scheme']['@scheme'] == "CPC"){      
                temp = full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['section']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['class']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['subclass']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['main-group']['$'] + "/";
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'][i]['subgroup']['$'];
                cooperative += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>';              
                }
              }
            } else{
              if(full['exchange-document'][0]['bibliographic-data']['patent-classifications'] != undefined )
              if(full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification'] != undefined )
              if(full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme'] != undefined )
              if(full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme']['@scheme'] != undefined )        
              if( full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme']['@scheme'] != undefined && full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme']['@scheme'] == "CPC"){      
                temp = full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['section']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['class']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['subclass']['$'];
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['main-group']['$'] + "/";
                temp += full['exchange-document'][0]['bibliographic-data']['patent-classifications']['patent-classification']['subgroup']['$'];
                cooperative += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>';              
                }          
              }
           }
          
           if (international !=  "<br>International: "  && cooperative != "<br>Cooperative: "){
            return international + cooperative;
           } else if (international != "<br>International: " && cooperative == "<br>Cooperative: "){
            return international; 
           }  else if (international == "<br>International: " && cooperative != "<br>Cooperative: "){
           return cooperative;
          } else {
            return "N/A";
          }
  
          }// end of array patent
    
  
  if (full['exchange-document']['bibliographic-data']['classifications-ipcr'] != undefined){
    if(Array.isArray(full['exchange-document']['bibliographic-data']['classifications-ipcr']['classification-ipcr'])){        
      for(i = 0; i < full['exchange-document']['bibliographic-data']['classifications-ipcr']['classification-ipcr'].length; i++)
      {            
        temp = full['exchange-document']['bibliographic-data']['classifications-ipcr']['classification-ipcr'][i]['text']['$'].replace(/\s\s+/g, '').slice(0, -3);
        international += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>'; 
  
      }
    } else {
      temp = full['exchange-document']['bibliographic-data']['classifications-ipcr']['classification-ipcr']['text']['$'].replace(/\s\s+/g, '').slice(0, -3);        
      international += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp+ '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>'; 
    }
   }
   if (full['exchange-document']['bibliographic-data']['patent-classifications'] != undefined){
    if(Array.isArray( full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'])){        
      for(i = 0; i < full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'].length; i++)
      { 
        if(full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['classification-scheme']['@scheme'] == "CPC"){                 
        temp = full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['section']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['class']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['subclass']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['main-group']['$'] +"/";
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'][i]['subgroup']['$'];
        cooperative += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'; ' +'</a>';  
  
        }
      }
    } else {
      if(full['exchange-document']['bibliographic-data']['patent-classifications'] != undefined )
      if(full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification'] != undefined )
      if(full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme'] != undefined )
      if(full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme']['@scheme'] != undefined )
      if( full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['classification-scheme']['@scheme'] == "CPC"){      
        temp = full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['section']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['class']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['subclass']['$'];
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['main-group']['$'] + "/";
        temp += full['exchange-document']['bibliographic-data']['patent-classifications']['patent-classification']['subgroup']['$'];
        cooperative += '<a href="https://worldwide.espacenet.com/classification?locale=en_EP#!/CPC=' + temp + '" uib-tooltip="' + patentFunctions.getCategory(temp.charAt(0)) +'" target="_blank">' + temp +'</a>' + '; ';              
        }  
      }
   }
  
   if (international !=  "<br>International: "  && cooperative != "<br>Cooperative: "){
    return international + cooperative;
   } else if (international != "<br>International: " && cooperative == "<br>Cooperative: "){
    return international; 
   }  else if (international == "<br>International: " && cooperative != "<br>Cooperative: "){
   return cooperative;
   } else {
    return "N/A"
  }   
  
  }else if(search_type == "USPTO V2"){
        return null;
       }

     }).withOption('defaultContent', 'N/A').notSortable(),
    DTColumnBuilder.newColumn('patents').withTitle('Date').renderWith(function(data, type, full) 
     {
        if(search_type == 'USPTO')
        {
            if (full == null)
            return null;
      
            return full.patent_date;
        } else if(search_type == 'EPO'){
            var date;
      
            if(Array.isArray(full['exchange-document'])){
              date = full['exchange-document'][0]['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(0, 4);
              date += '-' + full['exchange-document'][0]['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(4, 6);
              date += '-' + full['exchange-document'][0]['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(6, );
              return date;      
            }

      if(full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date']== undefined)
        return null;
            date = full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(0, 4);
            date += '-' + full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(4, 6);
            date += '-' + full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date']['$'].substring(6, );
            return date;
        }else if(search_type == "USPTO V2"){
          return full.publicationDate.slice(0, -10);
        }


     }).withOption('defaultContent', 'N/A').notSortable(),
    DTColumnBuilder.newColumn('patents').withTitle('Inventors').renderWith(function(data, type, full) 
    {
        if(search_type == 'USPTO'){

            if (full == null)
            return null;
       
            var inventor_names = "";
           if (full.inventors.length == 1)
           {
             inventor_names += full.inventors[0].inventor_first_name + "&nbsp" + full.inventors[0].inventor_last_name;
           } else 
           {
               for (i = 0; i < full.inventors.length - 1; i++) 
               {
                 inventor_names += full.inventors[i].inventor_first_name + "&nbsp" + full.inventors[i].inventor_last_name + ", ";
               }
               inventor_names += full.inventors[i].inventor_first_name + "&nbsp" + full.inventors[i].inventor_last_name;
             }
             return inventor_names;  
        } else if(search_type == 'EPO'){
            var inventor_names = "";
      
            if(Array.isArray(full['exchange-document'])){
              if (full['exchange-document'][0]['bibliographic-data'] == undefined){
                return null;
              }
                if (full['exchange-document'][0]['bibliographic-data']['parties']['inventors'] == undefined){
                return null;
              }
              
              if(!(Array.isArray(full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'])))       
                return full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor']['inventor-name']['name']['$']
              
              
                if (full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'].length == 1)
                {
                  inventor_names += full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'][0]['inventor-name']['name']['$'];
                } else 
                {
                    for (i = 0; i < full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'].length - 1; i++) 
                    {
                      if(full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'][i]['@data-format'] == 'epodoc')
                      inventor_names += full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'][i]['inventor-name']['name']['$'] + ", <br>";
                      
                    }
                    if(full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'][i]['@data-format'] == 'epodoc')
                    inventor_names += full['exchange-document'][0]['bibliographic-data']['parties']['inventors']['inventor'][i]['inventor-name']['name']['$'];
                  }
                  
                  return inventor_names; 
            }
      
      
      
            if (full['exchange-document']['bibliographic-data'] == undefined){
            return null;
          }
            if (full['exchange-document']['bibliographic-data']['parties']['inventors'] == undefined){
            return null;
          }
          
          if(!(Array.isArray(full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'])))       
            return full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor']['inventor-name']['name']['$']
          
          
            if (full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'].length == 1)
            {
              inventor_names += full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'][0]['inventor-name']['name']['$'];
            } else 
            {
                for (i = 0; i < full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'].length - 1; i++) 
                {
                  if(full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'][i]['@data-format'] == 'epodoc')
                  inventor_names += full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'][i]['inventor-name']['name']['$'] + ", <br>";
                  
                }
                if(full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'][i]['@data-format'] == 'epodoc')
                inventor_names += full['exchange-document']['bibliographic-data']['parties']['inventors']['inventor'][i]['inventor-name']['name']['$'];
              }
              
              return inventor_names; 
        }else if(search_type == "USPTO V2"){
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
        }

    }).withOption('defaultContent', 'N/A').notSortable(),
    DTColumnBuilder.newColumn('patents').withTitle('Assignees:').renderWith(function(data, type, full) 
    {
        if(search_type == 'USPTO')
        {
            var assignee_names = "";
            if (full == null)
              return null;
      
      
            if (full.assignees.length == 1)
              {
                if(full.assignees[0].assignee_first_name != null)            
                  assignee_names += full.assignees[0].assignee_first_name + "&nbsp" + full.assignees[0].assignee_last_name;
              } else 
              {
              for (i = 0; i < full.assignees.length - 1; i++) 
              {
                if(full.assignees[i].assignee_first_name != null)    
                  assignee_names += full.assignees[i].assignee_first_name + "&nbsp" + full.assignees[i].assignee_last_name;
              }
              if(full.assignees[i].assignee_first_name != null)    
                assignee_names += ", " + full.assignees[i].assignee_first_name + "&nbsp" + full.assignees[i].assignee_last_name;
              }
      
              if (assignee_names == "")
              return null;
      
      
              return assignee_names;
        } else if(search_type == 'EPO'){
            var applicants = []
            if(Array.isArray(full['exchange-document'])){
              if(full['exchange-document'][0]['bibliographic-data']['parties']['applicants'] == undefined)
              return null;
              if(full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant'] == undefined)
              return null;
              if(Array.isArray(full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant']))
              {
                for(i = 0; i < full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant'].length; i++){       
                  if(full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant'][i]['@data-format'] == 'epodoc')
                  applicants.push(full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant'][i]['applicant-name']['name']['$'])
                }
                return applicants.toString()
              }
              return full['exchange-document'][0]['bibliographic-data']['parties']['applicants']['applicant']['applicant-name']['$']
              }

              if(full['exchange-document']['bibliographic-data']['parties']['applicants'] == undefined)
              return null;
              if(full['exchange-document']['bibliographic-data']['parties']['applicants']['applicant'] == undefined)
              return null;
   
              if(Array.isArray(full['exchange-document']['bibliographic-data']['parties']['applicants']['applicant']))
              {
                for(i = 0; i < full['exchange-document']['bibliographic-data']['parties']['applicants']['applicant'].length; i++){
                 if(full['exchange-document']['bibliographic-data']['parties']['applicants']['applicant'][i]['@data-format'] == "epodoc")
                  
                  applicants.push(full['exchange-document']['bibliographic-data']['parties']['applicants']['applicant'][i]['applicant-name']['name']['$'])
                }
                return applicants.toString()
              } 
      
            return null
        }else if(search_type == "USPTO V2"){
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
        }

  
     }).withOption('defaultContent', 'N/A').withClass('none').notSortable(),
     DTColumnBuilder.newColumn('patents').withTitle('Organizations:').renderWith(function(data, type, full) 
    {
     var organization_names = "";
 
     if(search_type == 'USPTO'){
        if (full == null)
        return null;
          
          if (full.assignees.length == 1)
          {
            if(full.assignees[0].assignee_organization != null) 
            organization_names = full.assignees[0].assignee_organization;
          } else 
          {
            for (i = 0; i < full.assignees.length - 1; i++) 
            {
              if(full.assignees[i].assignee_organization != null) 
              organization_names += full.assignees[i].assignee_organization ;
            }
            if(full.assignees[i].assignee_organization != null)
            organization_names +=  ", " + full.assignees[i].assignee_organization;
          }
          if (organization_names == "")
          return null;
          
          return organization_names;  
     } else if(search_type == 'EPO'){
         return null
     }else if(search_type == "USPTO V2"){
      return null;
    }

      
     }).withOption('defaultContent', 'N/A').withClass('none').notSortable(),     
     DTColumnBuilder.newColumn('patents').withTitle('View Document').renderWith(function(data, type, full) 
     {
        if(search_type == 'USPTO'){
            if (full== null)
            return null;
      
            var patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";
            patent_url_text += full.patent_number + ".PN.&OS=PN/" + full.patent_number + "&RS=PN/" + full.patent_number;
            var link = '<a href="' + patent_url_text + '" target="_blank">  <i class="glyphicon glyphicon-book"></i> </a>';
             return link; 
        } else if(search_type == 'EPO'){
          // User Story: FA18 | PROF-19, enwam001 (patent search feature)
          var date, country, number, kind;
          if(Array.isArray(full['exchange-document'])){
            date = full['exchange-document'][0]['bibliographic-data']['application-reference']['document-id'][1]['date']['$'];
          } else{
            if(full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date'] != undefined)
            date = full['exchange-document']['bibliographic-data']['application-reference']['document-id'][1]['date']['$'];
          }

          if(Array.isArray(full['exchange-document'])){
            country = full['exchange-document'][0]['@country'];
          } else{
            country = full['exchange-document']['@country'];
          }

          if(Array.isArray(full['exchange-document'])){
            number = full['exchange-document'][0]['@doc-number'];
          } else{
            number = full['exchange-document']['@doc-number'];
          }

          if(Array.isArray(full['exchange-document'])){
            kind = full['exchange-document'][0]['@kind'];
          } else{
            kind = full['exchange-document']['@kind'];
          }

            return  '<a href="' + "https://worldwide.espacenet.com/publicationDetails/biblio?DB=EPODOC&II=0&ND=3&adjacent=true&locale=en_EP&FT=D&date=" + date +"&CC="+country+"&NR="+number+ kind +"&KC="+ kind  + '" target="_blank"> <i class="glyphicon glyphicon-book"></a>';
        }else if(search_type == "USPTO V2"){
          var patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";
          patent_url_text += full.patentNumber + ".PN.&OS=PN/" + full.patentNumber + "&RS=PN/" + full.patentNumber;
          var link = '<a href="' + patent_url_text + '" target="_blank"> <i class="glyphicon glyphicon-book"></a>';
           return link; 
        }
              
     }).withOption('defaultContent', 'N/A').notSortable(),
     DTColumnBuilder.newColumn('patents').withTitle('Cited patents:').renderWith(function(data, type, full) 
     {
       
        if(search_type == 'USPTO'){
            if (full== null)
            return null;
            var cited_patetns_titles = "";
            var patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";            
      
            if (full.cited_patents.length == 1)
            {
              if(full.cited_patents[0].cited_patent_title != null){        
              patent_url_text += full.cited_patents[0].cited_patent_number + ".PN.&OS=PN/" + full.cited_patents[0].cited_patent_number + "&RS=PN/" + full.cited_patents[0].cited_patent_number;
              cited_patetns_titles = '<br><a href="' + patent_url_text + '" target="_blank">'+full.cited_patents[0].cited_patent_title +'</a>';}
      
            } else 
            {
              
              for (i = 0; i < full.cited_patents.length - 1; i++) 
              {
                if(full.cited_patents[i].cited_patent_title != null){ 
                  patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";
                  patent_url_text += full.cited_patents[i].cited_patent_number + ".PN.&OS=PN/" + full.cited_patents[i].cited_patent_number + "&RS=PN/" + full.cited_patents[i].cited_patent_number;
                  cited_patetns_titles += '<br><a href="' + patent_url_text + '" target="_blank">'+full.cited_patents[i].cited_patent_title +'</a>';
          
                }
              }
              if(full.cited_patents[i].cited_patent_title != null){
                patent_url_text = "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=";
                patent_url_text += full.cited_patents[i].cited_patent_number + ".PN.&OS=PN/" + full.cited_patents[i].cited_patent_number + "&RS=PN/" + full.cited_patents[i].cited_patent_number;
                cited_patetns_titles += '<br><a href="' + patent_url_text + '" target="_blank">'+full.cited_patents[i].cited_patent_title +'</a>';
        }
            }
            if (cited_patetns_titles == "")
            return null;
            
            return cited_patetns_titles;     
        } else if(search_type == 'EPO'){
            return null
        }
    }).withOption('defaultContent', 'N/A').withClass('none').notSortable()    
   ]; 
  vm.search = search;
  vm.clear = clear;
  vm.dtInstance = {};            
  vm.dtOptions = dtOptions;
  vm.dtColumns = dtColumns;
  // User Story: PROF-9 | VIP-19, croja022 (business search report feature)
  vm.copyExported = copyExported;
  vm.removeExported = removeExported;
  vm.removeExportedAll = removeExportedAll;
  // End of User Story: PROF-9 | VIP-19, croja022 (business search report feature)

  function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    $compile(nRow)($scope);
    return nRow;
}
function ServerData(sSource, aoData, fnCallback, oSettings) { 
  if(
    (vm.query == undefined || vm.query.replace(/ +/g, ' ') =='') && 
    (vm.date_begin == undefined) && 
    (vm.date_end == undefined) &&
    (vm.first_name == undefined || vm.first_name.replace(/ +/g, ' ') =='') && 
    (vm.last_name == undefined || vm.last_name.replace(/ +/g, ' ') =='') && 
    (vm.organization_name == undefined || vm.organization_name.replace(/ +/g, ' ') =='')
  ){
    return fnCallback({
      "patents": []
    }); 
  }
  // User Story: FA18 | PROF-55, enwam001 (patent search feature)

  vm.displayProgress = false;  
  vm.dynamic = 0;
  vm.max = 100;
  vm.displayProgress = true;  
  var api = this.api();
  var pgNo = api.page.info();
  var entries = api.page.len();


  if(search_type== "USPTO"){
    start =  pgNo.page + 1;

    var url = patentFunctions.getUsptoUrl(vm.query, vm.date_begin,vm.date_end, vm.first_name, vm.last_name, vm.organization_name, start, entries);
      
    var xhr = createCORSRequest('GET', url);
    xhr.responseType = 'json';    
    xhr.onprogress = function (event) {
      vm.max = event.total;
      vm.dynamic = event.loaded;
    };

    if (!xhr) {
       alert('CORS not supported');
       return;
    }      


    xhr.onreadystatechange = function (oEvent) {  

      if (xhr.readyState === 4) {  
  
          if (xhr.status === 404) {  
            fnCallback({
              "patents": []
            })
            return fnCallback({
              "patents": []
            });    
          } 
      }  
  }; 

    xhr.onload = function() {
      var json =  xhr.response;       
      if (!json.patents) {            
        return fnCallback({
          "patents": []
        });
      }      
      
      json.recordsTotal = json.total_patent_count;
      json.recordsFiltered = json.total_patent_count;
      json.draw = 0;

      fnCallback(json);         
    };      
    xhr.onerror = function() {
       alert('Woops, there was an error making the request.');
    };
    xhr.send();
  // User Story: FA18 | PROF-7, enwam001 (patent search feature)
  }else if (search_type == "EPO"){
    if(token == undefined){
      generate_epo_token();
      return;
    }

    var url = patentFunctions.getEpoUrl(vm.query, vm.date_begin,vm.date_end, vm.first_name, vm.last_name, vm.organization_name, pgNo.page, entries);      
    var xhr = createCORSRequest('GET', url);
    xhr.responseType = 'json';    
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Accept', 'application/json');


    xhr.onprogress = function (event) {   
      vm.max = event.total;
      vm.dynamic = event.loaded;        
      };

    if (!xhr) {
       alert('CORS not supported');
       return;
    }      
    xhr.onloadend = function() {
    }

    xhr.onload = function() {

      if(xhr.status == 404)
      {
        return fnCallback({
          "patents": []
        });
        
      } else if(xhr.statusText == "Bad Request"){
        valid_token = false;
        generate_epo_token();
        return fnCallback({
          "patents": []
        });
      }

      var json =  xhr.response;      
      
      json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['recordsTotal'] = json['ops:world-patent-data']['ops:biblio-search']['@total-result-count'];
      json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['recordsFiltered'] = json['ops:world-patent-data']['ops:biblio-search']['@total-result-count'];
      json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['draw'] = 0;
      
      json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['patents'] = json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['exchange-documents'];
      delete json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['exchange-documents']      
      fnCallback(json['ops:world-patent-data']['ops:biblio-search']['ops:search-result']);        
    };      

    xhr.onerror = function() {
       alert('Woops, there was an error making the request.');
    };

    xhr.send();

  } else if(search_type == "USPTO V2"){
    start =  pgNo.page * 10;
    var url = patentFunctions.getUsptoV2Url(vm.query, vm.date_begin,vm.date_end, vm.first_name,vm.last_name, vm.organization_name,start, entries);      
    var xhr = createCORSRequest('GET', url);
    xhr.responseType = 'json';    
    xhr.onprogress = function (event) {  
      vm.max = event.total;
      vm.dynamic = event.loaded;          
    };

      if (!xhr) {
         alert('CORS not supported');
         return;
      }      

      xhr.onload = function() {
        var json =  xhr.response.response;       
        json.patents = json.docs;
        delete json.docs;  
        
        
        json.recordsTotal = json.numFound;
        json.recordsFiltered = json.numFound;
        json.draw = 0;
        delete json.numFound;  

        if (json.numFound == 0) {            
          return fnCallback({
            "patents": []
          });
        } else {
          fnCallback(json); 
        }       
      };      
      xhr.onerror = function() {
         alert('Woops, there was an error making the request.');
      };
      xhr.send();
    }
      
}

function generate_epo_token() {
  if(!valid_token){
    $.ajax({
      url: 'https://ops.epo.org/3.2/auth/accesstoken',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: 'grant_type=client_credentials',
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + patentFunctions.encodedData);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      },
      success: function(response) {
        token = response.access_token;
        vm.dtInstance.reloadData();
      }
    });
    valid_token = true;
  }      
}

function search(){   
  vm.dtInstance.DataTable.clear();
  search_type = vm.selection;

  if(
    (vm.query == undefined || vm.query.replace(/ +/g, ' ') =='') && 
    (vm.date_begin == undefined) && 
    (vm.date_end == undefined) &&
    (vm.first_name == undefined || vm.first_name.replace(/ +/g, ' ') =='') && 
    (vm.last_name == undefined || vm.last_name.replace(/ +/g, ' ') =='') && 
    (vm.organization_name == undefined || vm.organization_name.replace(/ +/g, ' ') =='')
  ){
    return;
  }
vm.dtInstance.reloadData(); 
}

function clear(){
  vm.date_begin = undefined;
  vm.date_end = undefined;
  vm.first_name = undefined;
  vm.last_name = undefined;
  vm.organization_name = undefined;
}
// User Story: PROF-8 | VIP-19, croja022 (patent search report feature)
function removeExported(i){
  vm.exported.splice(i,1);
}
function removeExportedAll(){
    vm.exported = [];
}
function copyExported(){
  patentFunctions.copyToClipboard(vm.exported.join(', '));
}
// End User Story: PROF-8 | VIP-19, croja022 (patent search report feature)

// User Story: FA18 | PROF-12, enwam001 (patent search feature)
$interval(test, 100);
function test(){
  vm.max = vm.max;
  vm.dynamic = vm.dynamic;
  var percent = vm.dynamic/vm.max
  if (vm.dynamic == vm.max || percent == "Infinity"){
    vm.displayProgress = false;  
  }
}

}})();