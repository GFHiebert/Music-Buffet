
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
    // "Cornfield Chase",
    // "There and Back Again",
    // "Sweden",
    // "Island Life",
];
renderTrackList(testTrackList);

getArtist();


// Spotify Authorization Token 
let accessToken

function buildAuthLink() {
    var artist = $("#newItem").val();
    const queryURL = "https://api.spotify.com/v1/search?query=" + artist + "&offset=0&limit=20&type=artist"
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    window.location.hash = '';

    let _token = hash.access_token;

    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const clientID = "87da17f3514b4a86854820f3d7804bb0"
    const redirectURI = "https://gfhiebert.github.io/Music-Buffet/"
    const scopes = [
        'user-read-private',
        'user-read-email'
    ];

    if (!_token) {
        window.location = `${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }

    // Spotify API
    $.ajax({
        url: queryURL,
        method: "GET",
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + _token); },
        success: function (response) {
            console.log(response)
        }
    })
}

// Event Trigger for Spotify Auth
var authButton = $("#widget").append($("<button>").html("Allow Access"));
authButton.click(function () {
    buildAuthLink();
})


