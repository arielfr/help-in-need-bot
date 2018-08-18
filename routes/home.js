const express = require('express');
const router = express.Router();

const Locations = require('../services/Locations');

router.get('/', (req, res) => {
  const gMapsKey = `AIzaSyCOYEvL-P4izjM3BkSqTI0oK3QTjaeAIEc`;

  const locations = Locations.getGmapsLocations();

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
            var locations = ${locations.length === 0 ? '[]' : locations.toString()};
            // The map
            var map = new google.maps.Map(
                document.getElementById('map'), {zoom: 4});
            
            for (var i = 0; i < locations.length; i++) {
                new google.maps.Marker({
                    position: {
                      lat: locations[i].lat,
                      lng: locations[i].lng,
                    },
                    map: map
                });              
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

module.exports = router;
