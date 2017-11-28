/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between first and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCSQhndm-Fl--evuEtIVq12ro78u9wt36w",
    authDomain: "test-48bf6.firebaseapp.com",
    databaseURL: "https://test-48bf6.firebaseio.com",
    projectId: "test-48bf6",
    storageBucket: "test-48bf6.appspot.com",
    messagingSenderId: "701632980221"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var name = $("#train-name-input").val().trim();
  var dest = $("#destination-input").val().trim();
  var first = moment($("#first-time-input").val().trim(), "hh:mm").format("X");
  var freq = $("#frequency-input").val().trim();

  // Creates local "torary" object for holding train data
  var newTrn = {
    name: name,
    dest: dest,
    first: first,
    freq: freq
  };

  // Uploads train data to the database
  database.ref().push(newTrn);

  // Logs everything to console
  console.log(newTrn.name);
  console.log(newTrn.dest);
  console.log(newTrn.first);
  console.log(newTrn.freq);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#first-train-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var name = childSnapshot.val().name;
  var dest = childSnapshot.val().dest;
  var first = childSnapshot.val().first;
  var freq = childSnapshot.val().freq;

  // train Info
  console.log(name);
  console.log(dest);
  console.log(first);
  console.log(freq);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(first, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % freq;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = freq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + dest + "</td><td>" +
  freq + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume train first date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attt we use mets this test case
