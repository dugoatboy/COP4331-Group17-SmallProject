var urlBase = 'https://c71kradehtniepoh.xyz/LAMPAPI';
var extension = 'php';

var ID = 0;
var firstName = "";
var lastName = "";

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
	// Change later to logged in html page
		window.location.href = "logged.html";
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + ID + ";expires=" + date.toGMTString();
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
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

function registerPage()
{
    // Change later to register html page
    window.location.href = "register.html";
}
function returntoLogin()
{
    window.location.href = "index.html";
}

function signUp()
{
	//document.getElementById("Signup result").innerHTML = "";
    var FN = document.getElementById("createFirstName").value;
    var LN = document.getElementById("createLastName").value;
	var login = document.getElementById("createName").value;
	var password = document.getElementById("createPassword").value;
	var count = password.length;
	if (count < 6)
	{
	    document.getElementById("Signup result").innerHTML = "Password must be at least 6 characters";
		return;
	}
	var hash = md5( password );

    var jsonPayload = '{"firstName" : "' + FN + '", "lastName" : "' + LN + '", "login" : "' + login + '", "passwordLength" : "' + count + '","password" : "' + hash + '"}';
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
				document.getElementById("Signup result").innerHTML = "Your account has been created. You can now return to the login page and sign in.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("Signup result").innerHTML = err.message;
	}
	
}

function searchfirstName()
{
    readCookie();
	var srch = document.getElementById("searchText1").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + ID + '}';
	var url = urlBase + '/SearchContactsFirst.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
				    colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function searchlastName()
{
    readCookie();
	var srch = document.getElementById("searchText2").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + ID + '}';
	var url = urlBase + '/SearchContactsLast.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Contact has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function createContact()
{
    readCookie();
	var contactuserID = ID;
    var FN = document.getElementById("contactFirstName").value;
    var LN = document.getElementById("contactLastName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	var relationship = document.getElementById("relationship").value;

    var jsonPayload = '{"UserID" : "' + ID + '", FirstName" : "' + FN + '", "LastName" : "' + LN + '", "Phone" : "' + phone + '", "Email" : "' + email + '","Relationship" : "' + relationship + '"}';
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("Contact Confirm").innerHTML = "Contact has been created.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("Contact Confirm").innerHTML = err.message;
	}
}

function deleteUser()
{
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
				document.getElementById("loginResult").innerHTML = "Account has been deleted, returning the login page.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
	ID = 0;
	firstName = "";
	lastName = "";
	window.location.href = "index.html";
}

function deleteContact()
{
    // Need to find contact's ID and the specific contact itself
    readCookie();
	var contactuserID = ID;
    var jsonPayload = '{"ID" : "' + FN + '","UserID" : "' + ID + '"}';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("deleteResult").innerHTML = "Contact has been deleted.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
}

function editContact()
{
    // Need to find contact's ID and the specific contact itself
    readCookie();
	var contactuserID = ID;
    var jsonPayload = '{"ID" : "' + FN + '","UserID" : "' + ID + '"}';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("deleteResult").innerHTML = "Contact has been deleted.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}
    var FN = document.getElementById("contactFirstName").value;
    var LN = document.getElementById("contactLastName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;
	var relationship = document.getElementById("relationship").value;

    var jsonPayload = '{"UserID" : "' + ID + '", FirstName" : "' + FN + '", "LastName" : "' + LN + '", "Phone" : "' + phone + '", "Email" : "' + email + '","Relationship" : "' + relationship + '"}';
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("Contact Confirm").innerHTML = "Contact has been created.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("Contact Confirm").innerHTML = err.message;
	}
}

function readContact()
{
    var contactIDval = document.getElementById("contactID").value;
    var jsonPayload = '{"ID" : "' + contactIDval + '"}';
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
				document.getElementById("Contact Info").innerHTML = jsonObject;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("readResult").innerHTML = err.message;
	}
}




