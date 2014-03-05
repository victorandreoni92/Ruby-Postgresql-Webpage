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
	var username = document.getElementById("log_user").value;
	var password = document.getElementById("log_pass").value;
	var parameters = "username="+username+"&password="+password;
	
	// Execute SQL check. SQL injection is handled by server
    var request = getXHR();
    request.onreadystatechange =
        function() {
            if(request.readyState == 4 && request.status == 200) {
                processLoginResponse(request.responseText);
            }
        };
    request.open('POST', "/login", true); // Block until login response
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send(parameters);
}
            
// Process response from login request
// @param response Response from server
function processLoginResponse(response){                
    if (parseInt(response) == 1) { // If login error, do not submit form and display error
		document.getElementById("login_fail_message").style.display="block";
    	return false;
    } else { // If successful, submit form and hide error
    	document.getElementById("login_fail_message").style.display="none";
    	document.getElementById("login_form").submit();
    }
}

// Logs user off, clearing session on server
function logoff() {
	window.location = "/logoff";
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

