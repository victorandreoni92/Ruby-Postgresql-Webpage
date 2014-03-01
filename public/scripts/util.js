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
    alert("loging alert");
    return false;
}

