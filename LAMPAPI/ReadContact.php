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
		$sql = "select * from Contacts WHERE ID = $ID";
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$searchResults .= '"ID: ' . $row["ID"] . '","FirstName: ' . $row["FirstName"] . '","LastName: ' . $row["LastName"] . '","Phone: ' . $row["Phone"] . '","Email: ' . $row["Email"] . '","Relationship: ' . $row["Relationship"] . '","DateCreated: ' . $row["DateCreated"] . '"';
			/*
			results: {
				ID: ID
				FirstName: FirstName
				LastName: LastName
				Phone: Phone
				Email: Email
				Relationship: Relationship
				DateCreated: DateCreated
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
