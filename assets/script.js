
let discoverBtn = document.getElementById("discover");
let apikey = "368598-musicbuf-RZ4G3NI6";
let addBtn = document.getElementById("add")

jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
  }
});
function getArtist() {
  $("#discover").on("click", function (event) {
    event.preventDefault();
    var artist = $("#newItem").val();
    var queryURL =
      "https://tastedive.com/api/similar?q=" +
      artist +
      "&limit=6&info=0&k=" +
      apikey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).done(function (response) {
      console.log(response);
      for (let i = 0; i < response.Similar.Results.length; i++)
        $("#artists").append(
          "<li>" + response.Similar.Results[i].Name + "</li>"
        );
    });
  });
}
$("body").on("click", ".track", function () {
    var songName = $(this).text();
    console.log("Song clicked is: " + songName);
  });
  
  
  function renderTrackList(trackList) {

    var tracksEl = $("#tracks");
    tracksEl.empty();
    var ulTracksEl = $("<ul>");
    for (var i = 0; i < trackList.length; i++) {
      var liTracksEl = $("<li>").addClass("track");
      liTracksEl.text(trackList[i]);
      ulTracksEl.append(liTracksEl);
    }
    tracksEl.append(ulTracksEl);
  }
  
  var testTrackList = [
    "Darcy's Donkey",
    "Cornfield Chase",
    "There and Back Again",
    "Sweden",
    "Island Life",
  ];
  renderTrackList(testTrackList);
  


getArtist();
