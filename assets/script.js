//Listeners
$("body").on("click", ".track", function () {
    var songName = $(this).text();
    console.log("Song clicked is: " + songName);
})

$("#save").on("click", function () {

    var artist = $(this).prev().val();
    console.log("Searching for: " + artist);

})

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

var testTrackList = ["Darcy's Donkey", "Cornfield Chase", "There and Back Again", "Sweden", "Island Life"];
renderTrackList(testTrackList);


$("#save").click(function (event) {
    event.preventDefault();
    var artistSearch = $("#search-item").val().trim();
    console.log("test");
    pullArtist(artistSearch);

})



