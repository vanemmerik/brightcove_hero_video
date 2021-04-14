<?php

$curl = curl_init();
// Use Brightcove playback API endpoint to reference catalogue
$baseURL = "https://edge.api.brightcove.com/playback/v1/accounts/";
// Account ID for requesting videos to use
$pubID = 1872491397001;
// videoID = 6050678412001;
$videoID = htmlspecialchars($_GET["video_id"]);
// API secret key to authenticate new video request
$pubKey = "{generated Brightcove API key goes here}";

  curl_setopt_array($curl, array(
  CURLOPT_URL => $baseURL . $pubID . "/videos/" . $videoID,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_POSTFIELDS => "",
  CURLOPT_HTTPHEADER => array(
    "Accept: application/json;pk=" . $pubKey,
    "cache-control: no-cache"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}