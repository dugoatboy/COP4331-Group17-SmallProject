<?php

	$inData = getRequestInfo();
	
	#Initialize
	$searchResults = "";
	$searchCount = 0;
	$UserID = $inData["userId"];

	#Connect to server
	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		#Pulls FirstName from list using string and userID
		$sql = "select ID, UserID, FirstName, LastName, Phone, Email, Relationship, DateCreated from Contacts WHERE UserID = '$UserID' AND Phone like '%" . $inData["search"] . "%'"; 
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '"' . $row["ID"] . ' ' . $row["UserID"] . ' ' . $row["FirstName"] . ' ' . $row["LastName"] . ' ' . $row["Phone"] . ' ' . $row["Email"] . ' ' . $row["Relationship"] . ' ' . $row["DateCreated"] . '"';

			}

			$conn->close();
			returnWithInfo($searchResults);
		}
		else
		{
			returnWithError( "No Records Found" );
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
	
		function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>