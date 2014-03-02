// Script for running the smartphone database
// Victor Andreoni    
// Assignment 4

/* Function to show the login fields. To be called after user clicks on login button
 * Function hides the register fields to ensure that only one filed is shows. Buttons
 * are not hidden in case user wants to go between register and login
*/
function show_login(){
    document.getElementById("registration_form").style.display="none";
    document.getElementById("login_form").style.display="block";
}

/* Function to show the register fields. To be called after user clicks on register button
 * Function hides the login fields to ensure that only one filed is shows. Buttons
 * are not hidden in case user wants to go between register and login
*/
function show_register(){
    document.getElementById("login_form").style.display="none";
    document.getElementById("registration_form").style.display="block";
}

/* Function to handle user registration
 * Returns true if succesful registration, false otherwise
*/
function submit_register(){
    alert("register alert");
    return false;
}

/* Function to handle user login
 * Returns true if succesful login, false otherwise
*/
function submit_login(){
	// Get arguments for login
	var username = document.getElementById("log_user");
	var password = document.getElementById("log_pass");
	var parameters = "username"+username+"&password="+password;
	
	// Execute SQL check. SQL injection is handled by server
    var request = getXHR();
    request.onreadystatechange =
        function() {
            if(request.readyState == 4 && request.status == 200) {
                signalLoginError(request.responseText);
            }
        };
    request.open('POST', "/login", false);
    request.send(parameters);
    return true;
}
            
// Modifies DOM to set new target received from server
// @param newTarget The new target to update DOM to
function signalLoginError(error){                
    alert(error);
}
            
// Cross-browser compatible XMLHttpRequest         
// Credits to Fotiman from http://www.webmasterworld.com/javascript/4027629.htm
/** 
* Gets an XMLHttpRequest. For Internet Explorer 6, attempts to use MXSML 3.0.
* @return {XMLHttpRequest or equivalent ActiveXObject} 
*/ 
function getXHR() { 
    return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); 
}

