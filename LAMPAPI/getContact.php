<?php

	$inData = getRequestInfo();
	
	#Initialize
	$ID = $inData["ID"];
	$UserID = $inData["UserID"];

	#Connect to server
	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
	    $sqlo = "select * from Contacts WHERE ID = $ID AND UserID = $UserID";
		if(($result = $conn->query($sqlo))==TRUE && $conn->affected_rows > 0)
		{
		    $row = $result->fetch_assoc();
		    $searchResults = '"ID: ' . $row["ID"] . '","FirstName: ' . $row["FirstName"] . '","LastName: ' . $row["LastName"] . '","Phone: ' . $row["Phone"] . '","Email: ' . $row["Email"] . '","Relationship: ' . $row["Relationship"] . '"';
		    returnWithInfo($searchResults);
		    $conn->close();
		}
		else
		{
			returnWithError( "No Contact to delete" );
			$conn->close();
		}
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
