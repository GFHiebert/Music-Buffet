
let discoverBtn = document.getElementById("discover");
let apikey = "368598-musicbuf-RZ4G3NI6";
let addBtn = document.getElementById("add")

jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
  }
});

//discover click
  $("#discover").on("click", function (event) {
    $("#artist-list").empty();
    event.preventDefault();
    var artist = $("#newItem").val();
    getArtist(artist);
  });


//artist click
  $("body").on("click", ".artist", function (event) {
    $("#artist-list").empty();
    var artist = $(this).text();
    getArtist(artist);
  });


function getArtist(artist) {
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
      $("#artist-list").append(
        "<li>" + response.Similar.Results[i].Name + "</li>"
      );
  });
}

function renderTrackList(favArtistList) {

  var artistsEl = $("#fav-artist-list");
  artistsEl.empty();
  var ulArtistsEl = $("<ul>");
  for (var i = 0; i < favArtistList.length; i++) {
    var liArtistsEl = $("<li>").addClass("artist");
    liArtistsEl.text(favArtistList[i]);
    ulArtistsEl.append(liArtistsEl);
  }
  artistsEl.append(ulArtistsEl);
}

var testFavArtistList = [
  "Gaelic Storm",
  "The Dubliners",
  "Hans Zimmer",
  "Howard Shore",
  "C418",
];
renderTrackList(testFavArtistList);

