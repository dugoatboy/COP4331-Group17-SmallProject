<?php

	$inData = getRequestInfo();
	
	#Initialize
	$searchResults = "";
    $ID = $inData["ID"];
    
	#Connect to server
	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		#Pulls FirstName from list using string and userID
		$sql = "select ID, FirstName, LastName, Email, Phone, Relationship, DateCreated from Contacts WHERE UserID = '$ID'";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$searchResults .= '"' . $row["ID"] . ',' . $row["FirstName"] . ',' . $row["LastName"] . ',' . $row["Phone"] . ',' . $row["Email"] . ',' . $row["Relationship"] . ',' . $row["DateCreated"] . '"';
			/*
			results: {
				ID
				FirstName
				LastName
				Phone
				Email
				Relationship
				DateCreated
			}
			*/
			returnWithInfo( $searchResults );
		}
		else
		{
			returnWithError( "No Records Found" );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>