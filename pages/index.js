module.exports = (gMapsKey, { lat, long }, locations) => (`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Help In Need</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <meta name="viewport" content="width=device-width">
        <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900' rel='stylesheet' type='text/css'>
        <style>
          html,
          body{
            font-family: Roboto;
            height: 100%;
            margin: 0px;
            padding: 0px;
          }
          /* Set the size of the div element that contains the map */
          .box {
            display: flex;
            flex-flow: column;
            height: 100%;
          }
          
          .box .row {
            
          }
          
          .box .row.header {
            flex: 0 1 auto;
            /* The above is shorthand for:
            flex-grow: 0,
            flex-shrink: 1,
            flex-basis: auto
            */
          }
          
          .box .row.content {
            flex: 1 1 auto;
          }

          #map {
            height:100%;
           }
           
           .navbar {
            overflow: hidden;
            padding: 0px 30px;
            background-color: black;
            height: 60px;
           }
           
           .navbar a.logo {
            background-image: url(/logo.png);
            background-repeat: no-repeat;
            padding-left: 68px;
            display: block;
            background-size: 40px 40px;
            background-position-y: 10px;
            background-position-x: 16px;
           }
           
           .navbar a {
              float: left;
              display: block;
              color: white;
              text-align: center;
              padding: 20px 16px;
              text-decoration: none;
          }
          
          @media only screen and (max-width: 480px) {
              .navbar {
                padding: 0px 0px;
               }
          }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="row header">
            <div class="navbar">
              <a class="logo" href="/">
                  Help In Need
              </a>
            </div>
          </div>
          <div id="map" class="row content">
          </div>        
        </div>
        
        <script>
          // color: #FFFB01;
          // Initialize and add the map
          function initMap() {
            var bounds = new google.maps.LatLngBounds();
            var locations = ${locations.length === 0 ? '[]' : JSON.stringify(locations)};
            var userLatLong = ${lat && long ? 'true' : 'false'};
            
            // The map
            var map = new google.maps.Map(
                document.getElementById('map'), {
                  zoom: 12,
                  center: userLatLong ? new google.maps.LatLng(${lat}, ${long}) : (locations.length == 1) ? new google.maps.LatLng(locations[0].lat, locations[0].lng) : new google.maps.LatLng(-34.6036754, -58.3824593,18.55),
                });
            
            for (var i = 0; i < locations.length; i++) {
                var marker = new google.maps.Marker({
                    position: {
                      lat: locations[i].lat,
                      lng: locations[i].lng,
                    },
                    map: map
                });
                
                const infowindow = new google.maps.InfoWindow();
                const infoWindowContent = '<div><p>Reporter: ' + locations[i].user.first_name + '</p><div><img src="' + locations[i].user.profile_pic + '" width="100" height="100"/></div></div>';
                
                google.maps.event.addListener(marker, 'click', (function(marker,content,infowindow){ 
                    return function() {
                        infowindow.setContent(content);
                        infowindow.open(map,marker);
                    };
                })(marker,infoWindowContent,infowindow)); 
                
                marker.addListener('click', function() {
                  infowindow.open(map, this);
                });
                
                 //extend the bounds to include each marker's position
                bounds.extend(marker.position);
            }
            
            if (!userLatLong && locations.length >= 2) {
                map.fitBounds(bounds);
            }
          }
        </script>
        <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=${gMapsKey}&callback=initMap">
        </script>
        <!-- Load Facebook SDK for JavaScript -->
          <div id="fb-root"></div>
          <script>(function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js#xfbml=1&version=v2.12&autoLogAppEvents=1';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));</script>
          
          <!-- Your customer chat code -->
          <div class="fb-customerchat"
            attribution=setup_tool
            page_id="1960051050953166"
            logged_in_greeting="Hi!, I'm here to empower your community by helping one another. Talk to me!"
            logged_out_greeting="Hi!, I'm here to empower your community by helping one another. Talk to me!">
          </div>
      </body>
    </html>
`);
