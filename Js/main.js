var app = angular.module('app',["ngRoute", "ngStorage", "phoneFilters"]);

//Custom directive (ngModel)
app.directive("phoneFormat", function (){
    return {
        restrict: "A",
        link: function (scope, element, attr) {
    
            element.bind('change', function() {
                if ( this.value.length === 10 ) {
                   var number = this.value;
                   this.value = '('+ number.substring(0,3) + ') ' + number.substring(3,6) + '-' + number.substring(6,10);
                }
                else {
                    document.querySelector('.helpblock').innerHTML = 'error in formatting';
                }
            });
    
        }
    };
});

//ngStorage Factory
app.factory('contactsFactory', [ '$localStorage', function( $localStorage ) {
    var contacts = [
        {
            "id": 1,
            "name": "Erin Eyeball",
            "phone": "(123) 456-7890",
            "email": "one.eye.open@ilumin.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/1"
        },
        {
            "id": 2,
            "name": "Johnathan Homebody",
            "phone": "(123) 456-7890",
            "email": "stayathomedad@wheresmom.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/2"
        },
        {
            "id": 3,
            "name": "Cletus Weatherly",
            "phone": "(123) 456-7890",
            "email": "cletus@netscape.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/3"
        },
        {
            "id": 4,
            "name": "Shirley Travels",
            "phone": "(123) 456-7890",
            "email": "shirley.travels@cityscape.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/4"
        },
        {
            "id": 5,
            "name": "John Watcher",
            "phone": "(123) 456-7890",
            "email": "train.photo.junkie@photonow.net",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/5"
        },
        {
            "id": 6,
            "name": "Curly Jenny",
            "phone": "(123) 456-7890",
            "email": "littlewhitebows@aol.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/6"
        },
        {
            "id": 8,
            "name": "Old Man Jenkins",
            "phone": "(123) 456-7890",
            "email": "wiseman@hotmail.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/8"
        },
        {
            "id": 9,
            "name": "Becky",
            "phone": "(123) 456-7890",
            "email": "whatsoverthere@myspace.com",
            "birthday": "01/01/1980",
            "avatar": "http://lorempixel.com/300/300/people/9"
        }
    ];

    if ( !$localStorage.contacts ) {
        $localStorage.contacts = contacts;
    }

    if (!($localStorage.contacts instanceof Array)) {
        $localStorage.contacts = [];
    }
        
    return {

        getContacts: function() {
            return  $localStorage.contacts;
        },

        //view single contact
        viewContact: function (id) {
            if ( id === undefined ) return false;
            for (var i = 0; i < $localStorage.contacts.length; i++) {
                if ($localStorage.contacts[i].id === id) {
                    return $localStorage.contacts[i];
                }
            }
            return null;
        },

        //add new contact
        addContact: function(newContact) {
            var newId = parseInt($localStorage.contacts[$localStorage.contacts.length-1].id) + 1;
            var newAvatar = 'http://lorempixel.com/300/300/people/' + newId;
            //format date
            var newBirthDate = USdateFormat(newContact.birthday);
            $localStorage.contacts.push(
                {   
                    id: newId,
                    name:  newContact.name, 
                    phone: newContact.phone,
                    email: newContact.email,
                    birthday: newBirthDate,
                    avatar: newAvatar
                }
            );
        },

        //Update / Edit Contact
        updateContact: function (editContact) {
            for (var i = 0; i < $localStorage.contacts.length; i++) {
                if ($localStorage.contacts[i].id === editContact.id) {
                    //format date
                    var newBirthDate = USdateFormat(editContact.birthday);    
                    $localStorage.contacts[i].name = editContact.name,
                    $localStorage.contacts[i].phone = editContact.phone,
                    $localStorage.contacts[i].email = editContact.email,
                    $localStorage.contacts[i].birthday = newBirthDate
                    return $localStorage.contacts[i];
                    break;
                }
            }
            return null;
        }
    };
  }]);

//Controllers
var controllers = {};

controllers.viewController = function ($scope, $routeParams, contactsFactory) {
    $scope.contact = {};
    
    init();

    function init() {
        //Grab contactID off of the route        
        var contactID = ($routeParams.contactID) ? parseInt($routeParams.contactID) : 0;
        if (contactID > 0) {
            $scope.contact = contactsFactory.viewContact(contactID);
        }
    }
}

controllers.editController = function ($scope, $routeParams, $location, contactsFactory) {
    $scope.contactEdit = {};
    
    init();

    function init() {
        $scope.date_regex = "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d";
        //Grab ID off of the route        
        var contactID = ($routeParams.contactID) ? parseInt($routeParams.contactID) : 0;
        if (contactID > 0) {
            $scope.contactEdit = contactsFactory.viewContact(contactID);
        }
    }

    //update contact
    $scope.updateContact = function () {
        contactsFactory.updateContact($scope.contactEdit);
        alert('contact is updated'); 
        $location.path('/');
    };
}

controllers.mainController = function($scope, $location, contactsFactory) {
        
        init();

        function init() {
            $scope.$storage = contactsFactory.getContacts();
            $scope.date_regex = "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\\d\\d";
        }

        //add contact
        $scope.addContact = function () {
            contactsFactory.addContact($scope.newContact);
            alert('New contact added.'); 
            $location.path('/');
        }

        //view contact
        $scope.viewContact = function (id) {
            contactsFactory.viewContact(id);
        };
}

app.controller(controllers);


//Routes
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    
    $routeProvider
        .when('/', {
            controller: 'mainController',
            templateUrl: 'partials/main.html'
        })
        .when('/add', {
            controller: 'mainController',
            templateUrl: 'partials/add.html'
        })
        .when('/view/:contactID', {
            controller: 'viewController',
            templateUrl: 'partials/view.html'
        })
        .when('/edit/:contactID', {
            controller: 'editController',
            templateUrl: 'partials/edit.html'
        })
        .otherwise({redirectTo: '/'});
}]);

function USdateFormat (date) {
    var givenDate = new Date(date);
    var dd = givenDate.getDate();

    var mm = givenDate.getMonth()+1; 
    var yyyy = givenDate.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 

    retDate = mm+'/'+dd+'/'+yyyy;

    return retDate;
}