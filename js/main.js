var TabletopData = {}

TabletopData.bringData = function () {

    var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1ETpa26yszVOF8Oz1TgUxA4npQkKpXHLLHJ_iWhAO1Q0/edit?usp=sharing';

    function init() {
        Tabletop.init( { key: publicSpreadsheetUrl,
                        callback: showInfo,
                        simpleSheet: true } )
    }

    function showInfo(data, tabletop) {
        TabletopData.resourceData(data);
    }

    window.addEventListener('DOMContentLoaded', init)
}

TabletopData.resourceData = function (songs) {

    var completeData = [];

    var energy = 0;
    var danceability = 0;
    var liveness = 0;
    var valence = 0;
    var acousticness = 0;
    var speechiness = 0;
    
    songs.forEach(song => {
        energy += Number.parseInt(song.Energy);
        danceability += Number.parseInt(song.Danceability);
        liveness += Number.parseInt(song.Liveness);
        valence += Number.parseInt(song.Valence);
        acousticness += Number.parseInt(song.Acousticness);
        speechiness += Number.parseInt(song.Speechiness);
    });

    energy = TabletopData.pocentage(energy);
    danceability = TabletopData.pocentage(danceability);
    liveness = TabletopData.pocentage(liveness);
    valence = TabletopData.pocentage(valence);
    acousticness = TabletopData.pocentage(acousticness);
    speechiness = TabletopData.pocentage(speechiness);

    completeData.push(energy, danceability, liveness, valence, acousticness, speechiness);
    Chart.generateChart(completeData);
}

TabletopData.pocentage = function(data) {
    var result = ((data * 100) / 5000);
    return result;
};

TabletopData.bringData();

var Chart = {}

Chart.generateChart = function (completeData) {

  google.charts.load("current", {packages:['corechart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    var data = new google.visualization.arrayToDataTable([
      ['Move', 'Percentage', { role: 'style' }],
      ["Energy", completeData[0], '#1DB954'],
      ["Danceability", completeData[1], '#1DB954'],
      ["Liveness", completeData[2], '#1DB954'],
      ["Valence", completeData[3], '#1DB954'],
      ["Acousticness", completeData[4], '#1DB954'],
      ["Speechiness", completeData[5], '#1DB954']
    ]);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                     { calc: "stringify",
                       sourceColumn: 1,
                       type: "string",
                       role: "annotation" },
                     2]);

    var options = {
      title: "Audio features percentage",
      width: 800,
      height: 600,
      bar: {groupWidth: "90%"},
      legend: { position: "none" },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart.draw(view, options);
  };
}
