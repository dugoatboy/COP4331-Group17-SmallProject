<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$login = $inData["login"];
	$password = $inData["password"];
	// password constraint for min char
	$min = 6;
	$passwordLength = strlen ($password);

	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $first = $inData["firstName"];
        $last = $inData["lastName"];
        $id = 4;
        $sql = "SELECT firstName FROM Users where Login='" . $inData["login"]. "'";
        $result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			returnWithError( "Username already exists" );
			$conn->close();
			return;
		}
		else
		{
		 if ($passwordLength >= $min)
		 {
		    $sql = "INSERT INTO Users (ID, FirstName, LastName, Login, Password) 
		    VALUES (id, '$first', '$last', '$login', '$password')";
		    if( $result = $conn->query($sql) != TRUE )
		    {
		    	returnWithError( $conn->error );
	    	}
	    	else
		    {
		        $ud = $conn -> insert_id;
		        returnWithInfo($first, $last, (int)$ud );
		    }
		}
		else
		{
		    returnWithError("Have not reached min count of 6 characters for password");
		}
	}
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>