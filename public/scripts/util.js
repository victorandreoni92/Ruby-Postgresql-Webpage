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
*/
function submit_register(){
	var name = document.getElementById("reg_name").value;
	var username = document.getElementById("reg_user").value;
	var password = document.getElementById("reg_pass").value;
	var errorMessage = document.getElementById("register_fail_message");
	
	// Perform local validation before sending information to server
	if (!name || !username || !password || name.length == 0 || username.length == 0 ||
		password.length == 0){
			errorMessage.style.display="block";
			errorMessage.innerHTML = "Please fill in all fields!";
			return false;
	}
	
	// Perform server validation
	var parameters = "fullname="+name+"&username="+username+"&password="+password;
	var request = getXHR();
	request.onreadystatechange =
	    function() {
	        if(request.readyState == 4 && request.status == 200) {
	            processRegistrationResponse(request.responseText);
	        }
	    };
	request.open("POST", "/register", true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send(parameters);
		

}

// Process response from registration request
// @param response Response from server
function processRegistrationResponse(response) {
	var errorMessage = document.getElementById("register_fail_message");
	var responseCode = parseInt(response);

	if (responseCode == 0) { // Success
		errorMessage.style.display="none";
		document.getElementById("registration_form").submit();
	} else if (responseCode == 1) { // Username already exists
		errorMessage.style.display="block";
		errorMessage.innerHTML = "The selected username already exists! Please pick a different one";
		document.getElementById("reg_pass").value = ''; // Reset password field for security
		return false;
	}
}


/* Function to handle user login
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
    request.open("POST", "/login", true);
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

// Search database for the specified search terms
// Empty fields will return all possible results. If all fields are empty, the whole db will be returned
// This may be inappropriate in terms of performance in large systems, but for this application, it is adequate 
function queryDB(){
	var name = document.getElementById("qName").value;
	var company = document.getElementById("qCompany").value;
	var year = document.getElementById("qYear").value;
	var timestamp = new Date().getTime(); // Used to prevent AJAX caching
	
	// Sanitize input. If fields left blank, match to anything. This is done to provide as many results as possible
	// Use '%' for SQL query to match anything
	if (!name || name.length == 0){name = ""}
	if (!company || company.length == 0){company = ""}
	if (!year || year.length == 0){year = ""}
	
	// Execute SQL search
	var request = getXHR();
	request.onreadystatechange =
	    function() {
	        if(request.readyState == 4 && request.status == 200) {
	        	var jsObj = JSON.parse(request.responseText);
				
				// Print results of query on a table
				var resultView = "<br /><table class='queryResultTable' style='min-width: 100%;'><tr><th>Model Code</th><th>Name</th><th>Release Year</th><th>Company</th></tr>"; // Open table	
				for (var i = 0; i < jsObj.length; i++) {
					var phone = jsObj[i];
					resultView = resultView + "<tr>";
					for (var j = 0; j < phone.length; j++) {
						resultView = resultView + "<td>" + phone[j] + "</td>"
					}
					resultView = resultView + "</tr>";
				}
				resultView = resultView + "</table>";
				document.getElementById("queryResult").innerHTML = resultView;
	        }
	    };
	request.open("GET", "/search?name="+name+"&company="+company+"&year="+year+ "&ts="+timestamp+"", true); // Use get so that query can be bookmarked
	request.send();
	

}

// Adds smartphones to DB from information provided by user
function addToDB(){
	var code = document.getElementById("aCode").value.toString();
	var name = document.getElementById("aName").value.toString();
	var company = document.getElementById("aCompany").value.toString();
	var year = document.getElementById("aYear").value.toString();
	
	// Perform local validation first
	if (!code || !name || !company || !year || code.trim().length == 0 || name.trim().length == 0 || company.trim().length == 0 || year.trim().length == 0){
		document.getElementById("addResult").innerHTML = "<p>Please fill in all values!</p>";
		return false;
	}
	
	// Send request to server
	var parameters = "code="+code+"&name="+name+"&company="+company+"&year="+year;
	var request = getXHR();
	request.onreadystatechange =
	    function() {
	        if(request.readyState == 4 && request.status == 200) {
				if (parseInt(request.responseText) == 1) { // Phone model code already exists
					document.getElementById("addResult").innerHTML = "<p>Model code already exists!</p>"
					return false;
				} else { // If successful, submit form and hide error
					document.getElementById("addResult").innerHTML = "<p>" + request.responseText + " added to database!</p>"
					return true;
				}
	        }
	    };
	request.open("POST", "/add", true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send(parameters);

}








