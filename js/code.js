
var urlBase = 'https://c71kradehtniepoh.xyz/LAMPAPI';
var extension = 'php';

var ID = 0;
var firstName = "";
var lastName = "";
var info = "";

function doLogin()
{
	ID = 0;
	firstName = "";
	lastName = "";
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	document.getElementById("loginResult").innerHTML = "";
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url , false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		ID = jsonObject.id;
		if( ID < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		saveCookie();
		window.location.href = "home.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + ID  + ";expires=" + date.toGMTString();
}

function readCookie()
{
	ID = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			ID = parseInt( tokens[1].trim() );
		}
	}
	if( ID < 0 )
	{
		window.location.href = "index.html";
	}
}

function doLogout()
{
	ID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function loggedIn()
{
    readCookie();
    window.location.href = "home.html";
}

function registerPage()
{
    window.location.href = "register.html";
}

function returntoLogin()
{
    window.location.href = "index.html";
}

function returntoSearch()
{
    readCookie();
    window.location.href = "home.html";
}

function cancelOption()
{
    readCookie();
    document.cookie = ",contactID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "home.html";
}

function returntoContactinfo()
{
    readCookie();
    window.location.href = "contactinfo.html";
}

function signUp()
{
    var FN = document.getElementById("createFirstName").value;
    var LN = document.getElementById("createLastName").value;
    // Make unique username check later
	var username = document.getElementById("createLogin").value;
	var password = document.getElementById("createPassword").value;
	var Firstlength = FN.length;
	var Lastlength = LN.length;
	var loginLength = username.length;
	var count = password.length;
	var error = "";
	
	if (Firstlength > 50)
    {
        document.getElementById("Signup Result").innerHTML = "First Name can only be a max of 50 characters";
		return;
    }
    if (Lastlength > 50)
    {
        document.getElementById("Signup Result").innerHTML = "Last Name can only be a max of 50 characters";
		return;
    }
    if (loginLength > 50)
    {
        document.getElementById("Signup Result").innerHTML = "Username can only be a max of 50 characters";
		return;
    }
    if (count > 50)
    {
        document.getElementById("Signup Result").innerHTML = "Password can only be a max of 50 characters";
		return;
    }
    if (Firstlength < 1)
    {
        document.getElementById("Signup Result").innerHTML = "Please enter a First Name";
		return;
    }
    if (Lastlength < 1)
    {
        document.getElementById("Signup Result").innerHTML = "Please enter a Last Name";
		return;
    }
    if (loginLength < 1)
    {
        document.getElementById("Signup Result").innerHTML = "Please enter a Username";
		return;
    }
    if (count < 1)
	{
	    document.getElementById("Signup Result").innerHTML = "Please enter a Password";
		return;
	}
	if (count < 6)
	{
	    document.getElementById("Signup Result").innerHTML = "Password must be at least 6 characters";
		return;
	}
	var hash = md5( password );
    var jsonPayload = '{"firstName" : "' + FN + '", "lastName" : "' + LN + '", "login" : "' + username + '", "passwordLength" : "' + count + '","password" : "' + hash + '"}';
	var url = urlBase + '/Signup.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
			    error = jsonObject.error;
			    if (error == "Username already exists" )
			    {
			        document.getElementById("Signup Result").innerHTML = "Username already exists, please use another.";
			        return;
			    }
				document.getElementById("Signup Result").innerHTML = "Your account has been created.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("Signup Result").innerHTML = err.message;
	}
}

function clear() {
    var table = document.getElementById("TABLE")
    var rows = table.getElementsByTagName("tr");
    while (rows.length > 1) {
        document.getElementById("TABLE").deleteRow(1);
        
    }
}

function search()
{
    readCookie();
    clear();
	var srch = document.getElementById("searchText1").value;
	var j = 0;
	var jsonPayload = '{"Search" : "' + srch + '","UserID" : ' + ID + '}';
	var url = urlBase + '/SearchContacts.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
			    if (jsonObject.error == "No Records Found")
			    {   
			        return;
			    }
				
				// Test Table format here, will be below current array format of Search List
				j = 0;
				var x = document.getElementById("TABLE");
				var y = x.insertRow();
				var z = "";
				var text = "";
				var buttonValue = "";
				for( var k = 0; k < jsonObject.results.length; k++)
				{
				    var information = jsonObject.results[k];
				    var thisOne = information.trim();
		            var tokens = thisOne.split(" ");
					if(tokens[0] == "ID:")
                	{
                	    buttonValue = tokens[1];
                	}
                	else if(tokens[0] == "FirstName:")
                	{
                	    z = y.insertCell();
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	    j = j + 2;
                	}
                	else if(tokens[0] == "LastName:")
                	{
                	    z = y.insertCell();
                	    j = j + 1;
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	}
                	else if(tokens[0] == "Phone:")
                	{
                	    z = y.insertCell();
                	    j = j + 1;
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	}
                	else if(tokens[0] == "Email:")
                	{
                	    z = y.insertCell();
                	    j = j + 1;
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	}
                	else if(tokens[0] == "Relationship:")
                	{
                	    z = y.insertCell();
                	    j = j + 1;
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	}
                	else if(tokens[0] == "DateCreated:")
                	{
                	    z = y.insertCell();
                	    j = j + 1;
                	    text = document.createTextNode(tokens[1]);
                	    z.appendChild(text);
                	    if (j == 7)
        				{
        				    z = y.insertCell();
        				    var btn = document.createElement("button");
                            btn.setAttribute("id", buttonValue);
                            btn.innerHTML = "Edit";
                            btn.onclick = function() {
                                var ind = this.getAttribute("id");
                                editPage(ind);
                            };
                            z.appendChild(btn);
        				    // Start next row
        				    y = x.insertRow();
        		            j = 0;
        				}
                	}
				}
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("Result").innerHTML = err.message;
	}
}

function createPage()
{
    readCookie();
    window.location.href = "createContact.html";
}

function createContact()
{
    readCookie();
	var contactuserID = ID;
    var FN = document.getElementById("createContactFirstName").value;
    var LN = document.getElementById("createContactLastName").value;
	var phone = document.getElementById("createContactPhoneNumber").value;
	var email = document.getElementById("createContactEmail").value;
	var relationship = document.getElementById("createContactRelationship").value;
	var FNlength = FN.length;
	var LNlength = LN.length;
	var phonelength = phone.length;
	var emaillength = email.length;
	var relationshiplength = relationship.length;
	
	if (FNlength < 1)
	{
	    document.getElementById("contactAdd").innerHTML = "Please enter a First Name at least";
		return;
	}
	if (phonelength < 1)
	{
	    phone = 0;
	}
	if (FNlength > 50)
	{
	    document.getElementById("contactAdd").innerHTML = "First Name can only be a max of 50 characters";
		return;
	}
	if (LNlength > 50)
	{
	    document.getElementById("contactAdd").innerHTML = "Last Name can only be a max of 50 characters";
		return;
	}
	if (isNaN(phone))
	{
	    document.getElementById("contactAdd").innerHTML = "The Phone Number can only be made be digits";
		return;
	}
	if (phonelength > 20)
	{
	    document.getElementById("contactAdd").innerHTML = "The Phone Number can only be a max of 20 digits";
		return;
	}
	if (emaillength > 50)
	{
	    document.getElementById("contactAdd").innerHTML = "Email can only be a max of 50 characters";
		return;
	}
	if (relationshiplength > 50)
	{
	    document.getElementById("contactAdd").innerHTML = "Relationship can only be a max of 50 characters";
		return;
	}

    var jsonPayload = '{"UserID" : "' + ID + '", "FirstName" : "' + FN + '", "LastName" : "' + LN + '", "Phone" : "' + phone + '", "Email" : "' + email + '", "Relationship" : "' + relationship + '"}';
	var url = urlBase + '/AddContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("contactAdd").innerHTML = "Contact has been created.";
				window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAdd").innerHTML = err.message;
	}
}

function deleteUser()
{
    var r = confirm("You are now deleting this account");
    if (r == false) 
    {
      return;
    } 
    readCookie();
    var jsonPayload = '{"UserID" : ' + ID + '}';
	var xhr = new XMLHttpRequest();
	var url = urlBase + '/DeleteUser.' + extension;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				ID = 0;
            	firstName = "";
            	lastName = "";
            	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
            	window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
		
	}
	catch(err)
	{
		return;
	}
}

function deleteContact()
{
    readCookie();
    var r = confirm("You are now deleting the selected contact");
    if (r == false) 
    {
      return;
    } 
    // Need to find contact's ID and the specific contact itself
    var contactIDval = "";
    var stuff = document.cookie;
    var splits = stuff.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split(" ");
	    if(tokens[0] == "contactID=ID:")
    	{
    	    contactIDval = tokens[1];
    	}
	}
    if (contactIDval === "")
    {
        document.getElementById("editResult").innerHTML = "ID was not given";
        return;
    }
    if (isNaN(contactIDval))
    {
        document.getElementById("editResult").innerHTML = "ID was not valid";
        return;
    }
	var contactuserID = ID;
    var jsonPayload = '{"ID" : "' + contactIDval + '","UserID" : "' + contactuserID + '"}';
    var url = urlBase + '/DeleteContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
			    if (jsonObject.id == 0)
			    {
			        document.getElementById("editResult").innerHTML = "Contact was Not Found.";
			        return;
			    }
				document.getElementById("editResult").innerHTML = "Contact has been deleted.";
				document.cookie = ",contactID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
		        window.location.href = "home.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function editPage(data)
{
    readCookie();
    info = "";
    info = data;
    if (info === "")
    {
        document.getElementById("contactEditResult").innerHTML = "ID was not given";
        return;
    }
    if (isNaN(info))
    {
        document.getElementById("contactEditResult").innerHTML = "ID was not valid";
        return;
    }
    var contactuserID = ID;
    var jsonPayload = '{"ID" : "' + info + '","UserID" : "' + contactuserID + '"}';
    var url = urlBase + '/getContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
			    if (jsonObject.id == 0)
			    {
			        document.getElementById("contactEditResult").innerHTML = "Contact was Not Found.";
			        return;
			    }
			    
			    getContact(jsonObject);
				window.location.href = "editContact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
}

function editContact()
{
    readCookie();
	var data = "";
    var stuff = document.cookie;
    var splits = stuff.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split(" ");
	    if(tokens[0] == "contactID=ID:")
    	{
    	    data = tokens[1];
    	}
	}
    var FN = document.getElementById("editFirstName").value;
    var LN = document.getElementById("editLastName").value;
	var phone = document.getElementById("editPhoneNumber").value;
	var email = document.getElementById("editEmail").value;
	var relationship = document.getElementById("editRelationship").value;
	var FNlength = FN.length;
	var LNlength = LN.length;
	var phonelength = phone.length;
	var emaillength = email.length;
	var relationshiplength = relationship.length;
	
	if (FNlength < 1)
	{
	    document.getElementById("editResult").innerHTML = "Please enter a First Name at least";
		return;
	}
	if (phonelength < 1)
	{
	    phone = 0;
	}
	if (FNlength > 50)
	{
	    document.getElementById("editResult").innerHTML = "First Name can only be a max of 50 characters";
		return;
	}
	if (LNlength > 50)
	{
	    document.getElementById("editResult").innerHTML = "Last Name can only be a max of 50 characters";
		return;
	}
	if (isNaN(phone))
	{
	    document.getElementById("editResult").innerHTML = "The Phone Number can only be made be digits";
		return;
	}
	if (phonelength > 20)
	{
	    document.getElementById("editResult").innerHTML = "The Phone Number can only be a max of 20 digits";
		return;
	}
	if (emaillength > 50)
	{
	    document.getElementById("editResult").innerHTML = "Email can only be a max of 50 characters";
		return;
	}
	if (relationshiplength > 50)
	{
	    document.getElementById("editResult").innerHTML = "Relationship can only be a max of 50 characters";
		return;
	}
    var jsonPayload = '{"ID" : "' + data + '", "FirstName" : "' + FN + '", "LastName" : "' + LN + '", "Phone" : "' + phone + '", "Email" : "' + email + '","Relationship" : "' + relationship + '"}';
	var url = urlBase + '/UpdateContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("editResult").innerHTML = "Contact has been updated.";
				document.cookie = ",contactID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function getContact(jsonObject)
{
    var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = ",contactID=" + jsonObject.results + ";expires=" + date.toGMTString();
}
function displayContact()
{
    var data = "";
    var stuff = document.cookie;
    var splits = stuff.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split(" ");
		if(tokens[0] == "FirstName:")
		{
		    data = tokens[1]
			document.getElementById("editFirstName").value = data;
		}
		else if(tokens[0] == "LastName:")
		{
		    data = tokens[1]
			document.getElementById("editLastName").value = data;
		}
		else if(tokens[0] == "Phone:")
		{
		    data = tokens[1]
			document.getElementById("editPhoneNumber").value = data;
		}
		else if(tokens[0] == "Email:")
		{
		    data = tokens[1]
			document.getElementById("editEmail").value = data;
		}
		else if(tokens[0] == "Relationship:")
		{
		    data = tokens[1]
			document.getElementById("editRelationship").value = data;
		}
	}
}

function readContact()
{
    readCookie();
	var contactuserID = ID;
    var contactIDval = document.getElementById("searchText10").value;
    document.getElementById("readResult").innerHTML = "";
    
    if(contactIDval === "")
    {
        return;
    }
    var jsonPayload = '{"ID" : "' + contactIDval + '","UserID" : "' + contactuserID + '"}';
	var xhr = new XMLHttpRequest();
	var url = urlBase + '/ReadContact.' + extension;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			    var jsonObject = JSON.parse( xhr.responseText );
			    // Do check if statement if contact is not their own
			    if (jsonObject.error == "No Records Found")
			    {   
			        document.getElementById("readResult").innerHTML = "No contact found.";
			        return;
			    }
			    document.getElementById("readResult").innerHTML = "Contact info found.";
	        	
	        	getContact();
	        	window.location.href = "contactinfo.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("readResult").innerHTML = err.message;
	}
}



