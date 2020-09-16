<?php

	$inData = getRequestInfo();
	
	#Initialize
	$UserID = $inData["UserID"];

	#Connect to server
	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "DELETE FROM Users WHERE ID = '$UserID'";
		
		if($conn->query($sql)==TRUE && $conn->affected_rows > 0)
		{
		    returnWithInfo($UserID, $FirstName, $LastName, $Phone);
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
	
	function returnWithInfo( $UserID, $FirstName, $LastName, $Phone)
	{
		$retValue = '{"Deleted: UserID":' . $UserID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Phone":' . $Phone . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>