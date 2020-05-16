
let discoverBtn = document.getElementById("discover");
let apikey = "368598-musicbuf-RZ4G3NI6";
let addBtn = document.getElementById("add");

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
  getArtist(artist)
  $("#newItem").val("");
});

//artist click
$("body").on("click", ".artist", function (event) {
  var artist = $(this).text();
  getArtist(artist);
});

//add artist to favorites. This button likey to be removed
$("#add").on("click", function () {
  var artist = $("#newItem").val();
  console.log(artist);
  addArtist(artist);
})

//saves song to local storage array
function addArtist(newArtistName) {
  var favArtistList = JSON.parse(window.localStorage.getItem("favArtistList")) || [];

  var newArtist = {
    artistName: newArtistName
  };

  var isRepeated = false;
  for (var i = 0; i < favArtistList.length; i++) {
    if (newArtistName == favArtistList[i].artistName) {
      isRepeated = true;
    }
  }

  if (isRepeated == false) {
    favArtistList.push(newArtist);
    window.localStorage.setItem("favArtistList", JSON.stringify(favArtistList));
  }
  renderFavArtistList();
}

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
    if (response.Similar.Results.length == 0 || artist == "" || artist == null) {
    } else {
      $("#artist-list").empty();
      for (let i = 0; i < response.Similar.Results.length; i++) {
        $("#artist-list").append(
          "<li>" + response.Similar.Results[i].Name + "</li>"
        );
      }
      addArtist(artist);
    } 
  });

}

function renderFavArtistList() {

  var favArtistList = JSON.parse(window.localStorage.getItem("favArtistList")) || [];
  var artistsEl = $("#fav-artist-list");

  if (favArtistList !== null) {
    artistsEl.empty();
    var ulArtistsEl = $("<ul>");
    for (var i = 0; i < favArtistList.length; i++) {
      var liArtistsEl = $("<li>").addClass("artist");
      liArtistsEl.text(favArtistList[i].artistName);
      ulArtistsEl.append(liArtistsEl);
    }
    artistsEl.append(ulArtistsEl);
  }

}

var testFavArtistList = [
  "Gaelic Storm",
  "The Dubliners",
  "Hans Zimmer",
  "Howard Shore",
  "C418",
];
renderFavArtistList();



let accessToken;

function buildAuthLink() {
  var artist = $("#newItem").val();
  const queryURL =
    "https://api.spotify.com/v1/search?query=" +
    artist +
    "&offset=0&limit=20&type=artist";
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
  window.location.hash = "";

  let _token = hash.access_token;

  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientID = "87da17f3514b4a86854820f3d7804bb0";
  const redirectURI = "https://gfhiebert.github.io/Music-Buffet/";
  const scopes = ["user-read-private", "user-read-email"];

  if (!_token) {
    window.location = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join(
      "%20"
    )}&response_type=token&show_dialog=true`;
  }

  // Spotify API
  $.ajax({
    url: queryURL,
    method: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + _token);
    },
    success: function (response) {
      console.log(response);
    },
  });
}

// Event Trigger for Spotify Auth
var authButton = $("#widget").append($("<button>").html("Allow Access"));
authButton.click(function () {
  buildAuthLink();
});




var URI = "4ZA0jcRUrVPupPnyV66aoI"



function iFrameW() {
  $("#widget").empty();
  var iFrameW = $("<iframe>").attr({
    src: "https://open.spotify.com/embed/track/" + URI,
    width: "300",
    height: "80",
    frameborder: "0",
    allowtransparency: "true",
    allow: "encrypted-media"
  })
  $("#widget").append(iFrameW)
}

iFrameW();


