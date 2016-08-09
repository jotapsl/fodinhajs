(function() {
    'use strict';

    angular
        .module("wastedJSapp")
        .controller("loginController", loginCtrl);

    function loginCtrl ($timeout, $location, socket) {
        var vm = this;

        //Local variables
        vm.name = '';
        vm.loginError = false;
        vm.loginErrorMessage = '';

        //Function Binds
        vm.loginToggle = loginToggle;

        activate();

        //////////////////////////////

        function activate() {
            if (socket.isConnected()) {
                socket.disconnect();
            }
        };

    	//login button function
    	function loginToggle() {
    		//Reset error status
    		vm.loginError = false;

            //Don't login with null name
        	if(vm.name == "") return;

            //Tries to login into server
            socket.connect();
            socket.emit('login', vm.name, function(success) {
                if (success == 0) {
                    //Redirect view
                    $location.url("/game");
                } else {
                	$timeout( function() {
                		//Nick taken
                		if (success == 1) {
                			vm.loginErrorMessage =  '<strong>Cannot login!</strong>'+
                										'<br />Nick was already taken!'
                		} else if(success == 2) {
                			vm.loginErrorMessage = 	'<strong>Cannot login!</strong>'+
                										'<br />Room is full!'
                		} else if(success == 3)	{
                			vm.loginErrorMessage = 	'<strong>Cannot login!</strong>'+
                										'<br />Room in game!'
                		}

                		vm.loginError = true;
                	}, 550);
                }
            });
    	};
    };
})();
