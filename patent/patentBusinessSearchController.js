// User Story: PROF-35 | VIP-19, croja022 (business search feature)
// Initial file creation and implementation.
(function () {
    'use strict';
    angular
        .module('patent')
        .controller('patentBusinessSearchController', patentBusinessSearchController);
        patentBusinessSearchController.$inject = ['DTOptionsBuilder', 'DTColumnBuilder','$sce', '$location', '$state', '$scope', '$stateParams', 'User', '$window', '$compile'];
    /* @ngInject */
    var helper = PatentHelper();
    function patentBusinessSearchController(DTOptionsBuilder, DTColumnBuilder,$sce, $location,$state, $scope, $stateParams, user, $window, $compile) 
    {
      var vm = this; 
      vm.done = false;
      vm.done = true;
      vm.options = ['Yelp'];
      vm.database = vm.options[0];
      vm.exported = [];

      var yelp_dtOptions = DTOptionsBuilder.fromSource('')
        .withFnServerData(ServerData)
        // User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
        .withDOM('lfrti')
        .withScroller({loadingIndicator: true})
        .withOption('deferRender', true)
        .withOption('scrollY', 400)
        .withDataProp('businesses')
        .withOption('responsive', true)
        .withOption('processing',  true)
        .withOption('lengthChange', false)
        .withOption('serverSide', true)
        .withOption('searching',false)
        .withOption('language',  {
            loadingRecords: "Please wait - loading...",
            processing: '<img src="img/loading.gif" width="50px" height="50px" />'
          })
        //END User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
        // User Story: PROF-9 | VIP-19, croja022 (business search report feature)
        // Added row callback, select plugin, buttons plugin
        .withOption('fnRowCallback', rowCallback)
        .withSelect({
            style: 'multi'
        })
        .withButtons([
            'colvis',        
            'print',
            {
                extend: 'selected',
                text: 'Save Selected',
                action: function(e, dt, button, config) {
                    var selectedRows = dt.rows({
                            selected: true
                        }),
                        rowsSelected = selectedRows.indexes().length,
                        rowData = selectedRows.data();
                    for (var i = 0; i < rowsSelected; i++) {
                        var copyModel = Object.assign({},rowData[i]),
                            text = helper.yelpModelToString(copyModel);
                        if(vm.exported.indexOf(text) < 0 ){
                            vm.exported.push(text);
                            $scope.$apply();
                        }
                    }
                }
            }]
        );
      function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            //$('[data-toggle="tooltip"]', nRow).tooltip();
            $compile(nRow)($scope);
            return nRow;
        }
      //END User Story: PROF-9 | VIP-19, croja022 (business search report feature)
      var yelp_dtColumns = [
            DTColumnBuilder.newColumn('name').withTitle('Name').withOption('defaultContent', '-default value-').notSortable(),
            DTColumnBuilder.newColumn('categories').withTitle('Category').renderWith(function(data, type, full)
            {
                var result = "";
                for(var i = 0; i < data.length; i++){
                 result += data[i].title + ", ";
                }
                if(result)
                    result = result.trim().slice(0, -1);
                return result;
            }).withOption('defaultContent', '-default value-').notSortable(),
        DTColumnBuilder.newColumn('phone').withTitle('Phone').renderWith(function(data, type, full)
         {
           //TODO: Format phone number
           return data;
         }).withOption('width', '150px').withOption('defaultContent', '').notSortable(),
        DTColumnBuilder.newColumn('is_closed').withTitle('Status').renderWith(function(data, type, full)
         {
           if (data)
            return "Closed location";
           return "Open for business";
         }).withOption('width', '150px').withOption('defaultContent', 'Unknown').notSortable(),
         
         DTColumnBuilder.newColumn('url').withTitle('').renderWith(function(data, type, full) {
            if (full == null)
              return null;
            var link = '<a href="' + data + '" target="_blank"><i class="fa fa-yelp fa-yelp-patent fa-3x" aria-hidden="true"></i></a>';
            return link;
          }).withOption('width', '50px').notSortable()
       ]; 
      vm.term = "";
      vm.location = "Miami";
      vm.search = search;
      vm.dtInstance = {};            
      vm.dtOptions = yelp_dtOptions;
      vm.dtColumns = yelp_dtColumns;
      // User Story: PROF-9 | VIP-19, croja022 (business search report feature)
      vm.copyExported = copyExported;
      vm.removeExported = removeExported;
      vm.removeExportedAll = removeExportedAll;
      // End of User Story: PROF-9 | VIP-19, croja022 (business search report feature)
      function ServerData(sSource, aoData, fnCallback, oSettings) {  
          if (vm.database == vm.options[0] && vm.dtOptions == yelp_dtOptions &&  vm.dtColumns == yelp_dtColumns){
            if(vm.term){
                var start = 0;
                for(var i=0; i < aoData.length; i++ ){
                    if(aoData[i].name == 'start'){
                        start = aoData[i].value;
                        break;
                    }
                }
                oSettings.jqXHR =
                    $.ajax({
                        url: helper.getYelpUrl(vm.term, vm.location, "50", start),
                     headers: {
                     'Authorization': 'Bearer ' + helper.YelpKey,
                     },
                     method: 'GET',
                     dataType: 'json'
                    })
                    .done(function (data){
                        // User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
                        data.recordsTotal = data.total > 1000 ? 1000 : data.total;
                        data.recordsFiltered = data.total > 1000 ? 1000 : data.total;
                        //END User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
                        fnCallback(data);
                    })
                    // User Story: PROF-54 | VIP-19, croja022 (business search error handling)
                    .fail(function() {
                        swal({
                            title: "Something went wrong",
                            text: helper.getBusinessSearchErrorMessage(vm.database),
                            type: "error"
                          });
                        fnCallback({businesses:[]});
                      })
                    //END User Story: PROF-54 | VIP-19, croja022 (business search error handling)
                    .always(function() {
                        vm.done = true;
                      });
            }
            else
                fnCallback({businesses:[]});
            }
        }
    
      function search(){
          if((!vm.term || !vm.term.replace(/ +/g, ' ')) &&
             (!vm.location  || !vm.location.replace(/ +/g, ' '))){
              return;
          }
          if(vm.database == vm.options[0]){
              vm.dtColumns = yelp_dtColumns;
              vm.dtOptions = yelp_dtOptions;
          }
          vm.dtInstance.rerender();// User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
      }
      // User Story: PROF-9 | VIP-19, croja022 (business search report feature)
      function removeExported(i){
        vm.exported.splice(i,1);
      }
      function removeExportedAll(){
          vm.exported = [];
      }
      function copyExported(){
        helper.copyToClipboard(vm.exported.join(', '));
      }
      // End User Story: PROF-9 | VIP-19, croja022 (business search report feature)
    }
})();