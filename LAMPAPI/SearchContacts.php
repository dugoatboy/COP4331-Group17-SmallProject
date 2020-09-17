<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$UserID = $inData["UserID"];
	$SearchType = $inData["SearchType"];
	
	$conn = new mysqli("localhost", "group17f_AdminWizard", "c71kradehtniepoh.com", "group17f_HopeinDark");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "select ID, FirstName, LastName from Contacts WHERE UserID = $UserID AND $SearchType like '%" . $inData["Search"] . "%'";
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
				$searchResults .= '"ID: ' . $row["ID"] . '","FirstName: ' . $row["FirstName"] . '","LastName: ' . $row["LastName"] . '"';
                /*
                results: {
                    1
                    ID
                    FirstName
                    LastName
                    2
                    ID
                    ...
                }
                */
			}

			$conn->close();
			returnWithInfo( $searchResults );
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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>