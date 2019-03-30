(function() {
    angular.module('reviewStudentApp')
        .factory('reviewStudentAppService', userService);

    function userService($http) {
        // create a new object
        var profileFactory = {};

        profileFactory.loadProfile = function (email) {
            return $http.get('/api/reviewuser/'+email).then(function (data) {
                  console.log(data)
                return data.data;
            });
        };
        //<!----User Story: prof-26 | VIP-9.0, atiwa007 (Prodessors can view and search students by their attributes.)-->
        //this function makes a request to pull from the database and displays the result.
        profileFactory.loadLog = function () {
            return $http.get('/api/getallusers/').then(function (data) {
                  console.log(data)
                return data.data;
            });
        };

        profileFactory.loadProjects = function () {
            return $http.get('/api/projects/').then(function (data) {
                console.log(data.data);
                return data.data;
            });
        };

		// Get projects from every semester
		profileFactory.loadAllProjects = function () {
            return $http.get('/api/projects/findall').then(function (data) {
                // console.log(data.data);
                var mod_data = []
                var data_test = data.data.map(data=>{
                   var arr = []
                   data.members_detailed.map(memb=>{
                      arr.push({name: memb})
                   })
                   data.members_detailed_copy = arr
                })
                // data.data.members_detailed.map(memb => {
                //    mod_data.push({name: memb})
                // })
                // data.data.members_detailed = mod_data
                // console.log(data_test)
                // console.log(data.data);
                return data.data;
            });
        };

		// Changed Term API
        profileFactory.loadTerms = function () {
            return $http.get('/api/terms/findall').then(function (data) {
                return data.data;
            });
        };

        profileFactory.getTerm = function (id) {
          return $http.get('/api/terms/' + id).then(function (data) {
            return data.data;
          })
        }
        //Gets the individual member
        profileFactory.loadUser = function (id) {
            return $http.get('/api/profilestudent/' + id).then(function (data) {
                return data.data;
            });
        };
        profileFactory.addterm = function (termdata) {
            return $http.post('/api/terms', termdata);
            return data.data;
        };
        profileFactory.setJoinedProjectFalse = function (id) {
            return $http.put('/api/profilejoinedproject/' + id).then(function (data) {
                return data.data;
            });
        };

        profileFactory.RemoveFromProject = function (id, members, detailed) {
            return $http.put('/api/project/' + id + '/' + members + '/' + detailed).then(function (data) {
                return data.data;
            });
        };

        profileFactory.AddToProject = function (userid, pid) {
            return $http.put('/api/reviewusers/' + userid + '/' + pid).then(function (data) {
                return data.data;
            });
        };

        return profileFactory;
    }
}());
