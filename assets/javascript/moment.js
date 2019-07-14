$(document).ready(function () {

  var firebaseConfig = {
    apiKey: "AIzaSyBKuE_XGcgsP-6iio9Zaqb-CG3QquazmLw",
    authDomain: "trainscheduler-8d5d3.firebaseapp.com",
    databaseURL: "https://trainscheduler-8d5d3.firebaseio.com",
    projectId: "trainscheduler-8d5d3",
    storageBucket: "trainscheduler-8d5d3.appspot.com",
    messagingSenderId: "297926298019",
    appId: "1:297926298019:web:1f3c1f51a1c3debd"
  };
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  var trainscheduler = database.ref("/trains");
  // created object as a back up to initialize firebase 
  // var trainObject = {
  //   trainName: "Train A",
  //   destination: "New York",
  //   frequency: 25,
  //   newArrival: "12:50",
  //   minutesAway: 10
  // };
  //trainscheduler.push(trainObject);

  var listOfCities = [
    "Sitka", "Juneau", "Wrangell", "Anchorage", "Jacksonville", "Anaconda", "Butte", "Oklahoma City", "Houston", "Phoenix", "Nashville", "Los Angeles", "San Antonio", "Suffolk", "Buckeye", "Indianapolis", "Chesapeake", "Dallas", "Fort Worth", "Louisville", "San Diego", "Memphis", "Kansas City", "New York City", "Augusta", "Austin", "Charlotte", "Lexington", "El Paso", "Virginia Beach", "Cusseta", "Chicago", "Tucson", "Columbus", "Columbus", "Valdez", "Preston", "Huntsville", "Boulder City", "California City", "Tulsa", "Colorado Springs", "Goodyear", "Albuquerque", "Scottsdale", "Hibbing", "Norman", "San Jose", "Peoria", "New Orleans", "Corpus Christi", "Montgomery", "Wichita", "Aurora", "Denver", "Sierra Vista", "Georgetown", "Birmingham", "Fayetteville", "Carson City ", "Raleigh", "Bakersfield", "Mobile", "Detroit", "Bunnell", "Chattanooga", "Mesa", "Las Vegas", "Philadelphia", "Portland", "Atlanta", "Winston-Salem", "Brownsville", "Columbia", "Lynchburg", "Omaha", "Greensboro", "Kansas City", "Lubbock", "Fernley", "Marana", "Yuma", "Little Rock", "Athens", "Hartsville", "Port St. Lucie", "Tampa", "Fresno", "Unalaska", "Eloy", "Salt Lake City", "Jackson", "Fort Wayne", "Casa Grande", "Charleston", "Henderson", "Durham", "Abilene", "Palmdale", "Babbitt", "Surprise", "Cape Coral", "Shreveport", "Rio Rancho", "Savannah", "Reno", "Orlando", "North Las Vegas", "Tallahassee", "North Port", "Amarillo", "St. Marys", "Knoxville", "Sacramento", "Clarksville", "Nightmute", "Milwaukee", "Arlington", "Lancaster", "Palm Springs", "Palm Coast", "Dothan", "Lincoln", "Waco", "Laredo", "Denton", "Oak Ridge", "Edmond", "Seattle", "Beaumont", "Springfield", "Riverside", "Lawton", "Baltimore ", "Des Moines", "Toledo", "Jonesboro", "Boise", "Ellsworth", "Caribou", "El Reno", "Cincinnati", "Cleveland", "Independence", "Fremont", "Baton Rouge", "Port Arthur", "Madison", "Las Cruces", "Presque Isle"
  ];

  function dropDown() {
    listOfCities.sort();
    for (var i = 0; i < listOfCities.length; i++) {
      var addCity = $("<option>");
      addCity.text(listOfCities[i]);
      $("#destination").append(addCity);
    }
  }
  dropDown();

  function clear() {
    $('#searchTerms').val("");
    $('#destination').val("");
    $('#time').val("");
    $('#frequency').val("");
  }

  function updateTable() {
    database.ref('/trains').on("child_added", function (snapshot) {

      var xy;
      var trainFrequency = snapshot.val().frequency;
      var nextArrivalTime = moment((moment().month() + 1) + '/' + (moment().date()) + '/' + (moment().year()) + ", " + snapshot.val().time, "MM/DD/YYYY, HH:mm");
      console.log(nextArrivalTime);
      function updateNextArrivalTime() {
        console.log(trainFrequency);
        nextArrivalTime = moment(nextArrivalTime).add(trainFrequency, 'minutes');
        console.log(nextArrivalTime);
      }

      function calcMinutesAway() {
        console.log(moment());
        console.log(moment().year());
        console.log(moment().month() + 1);
        console.log(moment().date());
        var x = (moment().month() + 1) + '/' + (moment().date()) + '/' + (moment().year()) + ", " + snapshot.val().time;
        console.log(x);
        xformat = moment(x, 'MM/DD/YYYY, HH:mm');
        var y = moment();
        console.log(y);
        xy = xformat.diff(y, 'minutes');
        console.log(xy);
        return xy;
      }
      calcMinutesAway();

      var timeOutMinutesAway = calcMinutesAway();
      console.log(timeOutMinutesAway);

      function updateTime() {
        var timeOutMinutesAway = xy--;
        console.log(timeOutMinutesAway);
        if (timeOutMinutesAway < 1) {
          timeOutMinutesAway = snapshot.val().frequency;
          console.log(timeOutMinutesAway);
          updateNextArrivalTime();
        }
        $('#' + snapshot.val().trainName + '1').text(nextArrivalTime.format('HH:mm'));
        $('#' + snapshot.val().trainName + '2').text(timeOutMinutesAway);
      }

      // setInterval(function () {
      // updateTime();

      // }, 60000);

      $('#show-table').append(
        '<tr>' +
        '<td>' + snapshot.val().trainName + '</td>' +
        '<td>' + snapshot.val().destination + '</td>' +
        '<td>' + snapshot.val().frequency + '</td>' +
        '<td id="' + snapshot.val().trainName + '1">' + nextArrivalTime.format('HH:mm') + '</td>' +
        '<td id="' + snapshot.val().trainName + '2">' + timeOutMinutesAway + '</td>' +
        '</tr>'
      );
    });
  }
  updateTable();

  $("#clearSearch").on("click", function () {
    event.preventDefault();
    clear();
  });

  $("#search").on("click", function (event) {
    event.preventDefault();
    console.log('clicked');
    var newObjectForNewTrain = {
      trainName: $('#searchTerms').val(),
      destination: $('#destination').val(),
      time: $('#time').val(),
      frequency: $('#frequency').val()
    };
    trainscheduler.push(newObjectForNewTrain);
  });
});
