const express = require('express');
const router = express.Router();

const Locations = require('../services/Locations');

router.get('/', (req, res) => {
  const { lat, long } = req.query;
  const gMapsKey = `AIzaSyCOYEvL-P4izjM3BkSqTI0oK3QTjaeAIEc`;

  Locations.getGmapsLocations().then(locations => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html,
            body{
              height: 100%;
            }
            body{
              margin: 0px;
            }
            /* Set the size of the div element that contains the map */
            #map {
              height:100%;  /* The height is 400 pixels */
              width: 100%;  /* The width is the width of the web page */
             }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
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
                  
                  var infowindow = new google.maps.InfoWindow({
                    content: '<div><p>Reporter: ' + locations[i].user.first_name + '</p><div><img src="' + locations[i].user.profile_pic + '" width="100" height="100"/></div></div>',
                  });
                  
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
  });
});

router.get('/about', (req, res) => {
  res.send({
    developer_circles: {
      project: 'Messenger Help In Need Chat Bot',
      description: 'Say hello to the first humanitarian bot... This bot will allow to empower, help and bring communities together',
      repository: 'https://github.com/arielfr/help-in-need-bot',
      participants: [
        {
          name: 'Ariel Rey',
          github: 'https://github.com/arielfr',
        },
        {
          name: 'Horacio Lopez',
          github: 'https://github.com/hdlopez',
        },
      ]
    }
  })
});

router.get('/expire', (req, res) => {
  Locations.expireYesterday().then(() => {
    res.send({
      result: 'OK',
    })
  }).catch((err) => {
    res.send({
      result: err,
    })
  });
});

router.get('/drop', (req, res) => {
  Locations.deleteAll().then(() => {
    res.send({
      result: 'OK',
    })
  }).catch((err) => {
    res.send({
      result: err,
    })
  });
});

module.exports = router;
