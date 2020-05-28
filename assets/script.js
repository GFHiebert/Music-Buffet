
let discoverBtn = document.getElementById("discover");
let apikey = "368598-musicbuf-RZ4G3NI6";
let addBtn = document.getElementById("add");
var currentSongPlaylist = [];
var currentSongID = "";
let accessToken;

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

//sim-artist click
$("body").on("click", ".sim-artist", function (event) {
  var artist = $(this).text();
  getArtist(artist);
});



//skip button click, checks if near end of array, if so will loop to beginning

$("#skip").on("click", function () {
  for (var i = 0; i < currentSongPlaylist.length; i++) {
    if (currentSongID == currentSongPlaylist[i].id) {
      if (currentSongPlaylist.length > i + 1) {
        iFrameW(currentSongPlaylist[i + 1].id)
        currentSongID = currentSongPlaylist[i + 1].id;
      } else {
        iFrameW(currentSongPlaylist[0].id)
        currentSongID = currentSongPlaylist[0].id;
      }
      break;
    }
  }
})

//saves song to local storage array and updates favArtistList
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

//sends artist to tastedive api and retrieves/appends list of similar artist
function getArtist(artist) {
  spotifyPull(artist);
  var queryURL =
    "https://tastedive.com/api/similar?q=" +
    artist +
    "&limit=6&info=0&k=" +
    apikey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function (response) {
    if (response.Similar.Results.length == 0 || artist == "" || artist == null) {
    } else {
      let simArtistList = [];
      for (var i = 0; i < response.Similar.Results.length; i++) {
        simArtistList.push(response.Similar.Results[i].Name)
      }
      window.localStorage.setItem("simArtistList", JSON.stringify(simArtistList));
      renderSimArtistList();
      // $("#artist-list").empty();
      // for (let i = 0; i < response.Similar.Results.length; i++) {
      //   $("#artist-list").append(
      //     "<li class = sim-artist>" + response.Similar.Results[i].Name + "</li>"
      //   );
      // }
      addArtist(artist);
    }
  });
}

// retrieves simArtistList from local storage and renders
function renderSimArtistList() {
  var simArtistList = JSON.parse(window.localStorage.getItem("simArtistList")) || [];
  var artistsEl = $("#artist-list");


  artistsEl.empty();
  var ulArtistsEl = $("<ul>");
  for (var i = 0; i < simArtistList.length; i++) {
    var liArtistsEl = $("<li>").addClass("sim-artist");
    liArtistsEl.text(simArtistList[i]);
    ulArtistsEl.append(liArtistsEl);
  }
  artistsEl.append(ulArtistsEl);

}


//retrieves favArtistList from local storage and renders

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

// Spotify Widget
function iFrameW(URI) {
  $("#widget").empty();
  var iFrameW = $("<iframe>").attr({
    src: "https://open.spotify.com/embed/track/" + URI,
    width: "250",
    height: "80",
    frameborder: "0",
    allowtransparency: "true",
    allow: "encrypted-media"
  })
  $("#widget").append(iFrameW)
};

//authorizes user account with spotify, sends artist and receives top tracks
function spotifyPull(artistResult) {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1])
      }
      return initial;
    }, {});
  window.location.hash = '';

  let _token = hash.access_token;
  var authEndpoint = "https://accounts.spotify.com/authorize";
  var clientID = "87da17f3514b4a86854820f3d7804bb0";
  // Set URI to Live Site
  var redirectURI = "https://gfhiebert.github.io/Music-Buffet/";
  var scope = [
    "user-top-read"
  ];

  if (!_token) {
    window.location = authEndpoint + "?client_id=" + clientID + "&redirect_uri=" + redirectURI + "&scope=" + scope.join("%20") + "&response_type=token&show_dialog=true";
  }
  var queryURL = "https://api.spotify.com/v1/search?q=" + artistResult + "&type=artist";

  $.ajax({
    url: queryURL,
    method: "GET",
    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
  }).then(function (response) {
    var artistID = response.artists.items[0].id;
    var queryURL = "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US";
    $.ajax({
      url: queryURL,
      method: "GET",
      beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
    }).then(function (response) {
      currentSongPlaylist = response.tracks;
      var songID = response.tracks[0].id
      currentSongID = songID;
      iFrameW(songID)
    });
  });
}

renderFavArtistList();
