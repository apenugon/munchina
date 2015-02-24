document.addEventListener('DOMContentLoaded', function() {
  var socket = io.connect("http://localhost:4000");
  var svg = document.getElementById("svgmap");
  var localTerritories = [];
  var localShade = [];
  svg.addEventListener("load", function() {
    var svgContent = svg.contentDocument;
    console.log("Loaded");
    console.log(svgContent);
    var paths = svgContent.getElementsByTagName("path");

    socket.on('updateFac2Shade', function(msg) {
      for (var i = 0; i < paths.length; i++) {
        if (msg[i] == 1) {
          paths[i].style.opacity = ".7";
          paths[i].style.fill = "black";
        } else {
          paths[i].style.opacity = "0";
        }
      }
    });

    socket.on('territories', function(msg) {
      console.log("Territories recieved");
      for (var i = 0; i < paths.length; i++) {
        console.log(paths[i].style.fill);
        if (!(paths[i].style.fill == "#000000")) {
          if (msg[i] == 2) {
            paths[i].style.fill = "red";
            paths[i].style.opacity = ".3";
          } else if (msg[i] == 1) {
            paths[i].style.fill = "blue";
            paths[i].style.opacity = ".3";
          } else {
            paths[i].style.opacity = "0";
          }
        }
      }
    });
  });


});
