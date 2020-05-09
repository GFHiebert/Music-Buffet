function renderTrackList(trackList) {
    var tracksEl = $("#tracks");
    tracksEl.empty();
    var ulTracksEl = $("<ul>");
    for (var i = 0; i < trackList.length; i++) {
        var liTracksEl = $("<li>");
        liTracksEl.text(trackList[i]);
        ulTracksEl.append(liTracksEl);
    }
    tracksEl.append(ulTracksEl);
}

var testTrackList = ["Darcy's Donkey", "Cornfield Chase", "There and Back Again", "Sweden", "Island Life"];
renderTrackList(testTrackList);