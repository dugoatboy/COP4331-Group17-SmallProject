<?php
	$inData = getRequestInfo();
	
	#Filling in data (might need to account for error)
	$UserID = $inData["UserID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Phone = $inData["Phone"]; 
	$Email = $inData["Email"];
	$Relationship = $inData["Relationship"];

	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $sql = "insert into Contacts (UserId,FirstName,LastName,Phone,Email,Relationship) VALUES ('$UserID','$FirstName','$LastName','$Phone','$Email','$Relationship')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		returnWithInfo($UserID, $FirstName, $LastName, $Phone, $Email, $Relationship);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $UserID, $FirstName, $LastName, $Phone, $Email, $Relationship )
	{
		$retValue = '{"UserID":' . $UserID . ',"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","Phone":' . $Phone . ',"Email":"' . $Email . '","Relationship":"' . $Relationship . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>