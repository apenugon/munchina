document.addEventListener('DOMContentLoaded', function() {
  var socket = io.connect("http://localhost:4000");
  var svg = document.getElementById("svgmap");
  var localTerritories = [];
  var localShade = [];
  console.log("Here");

  var timeout;
  //Tooltip Hide function
  function hide() {
    timeout = setTimeout(function() {
      $("#tooltip").hide('fast');
    }, 50);
  }

  //Get updates
   svg.addEventListener("load", function() {
    var svgContent = svg.contentDocument;
    console.log("Loaded");
    console.log(svgContent);
    var paths = svgContent.getElementsByTagName("path");
    var localShade = [];
    var territories = [];

    resourceArray = [];
    for (var i = 0; i < paths.length; i++) {
      paths[i].id = i;
      localShade[i] = 0;
      territories[i] = 0;
      resourceArray[i] = "No Resources";
    }

    var tooltipFunc = function(event) {
      if (localShade[this.id] != 1) {
        clearTimeout(timeout);
        $("#tooltip").text(resourceArray[this.id])
                     .css("left", event.pageX)
                     .css("top", event.pageY)
                      .stop().show("fast");
      }
    };

    $("path", svgContent).css("fill", "black");
    $("path", svgContent).css("opacity", "0");
    $("path", svgContent).mouseover(tooltipFunc).mouseout(hide);

    socket.on('resources', function(msg) {
     
      resourceArray = msg.resources;
    });

    function updateMap() {
      for (var i = 0; i < paths.length; i++) {
        if (localShade[i] == 1) {
          // Shade overrides everything else
          
          paths[i].style.fill = "black";
          paths[i].style.opacity = ".7";
        } else {
          if (territories[i] == 2) {
            paths[i].style.fill = "red";
            paths[i].style.opacity = ".3";
          } else if (territories[i] == 1) {
            paths[i].style.fill = "blue";
            paths[i].style.opacity = ".3";
          } else {
            paths[i].style.opacity = "0";
          }
        }
      }

    }

    socket.on('update', function(msg) {
      localShade = msg["faction1"];
      territories = msg["territories"];

      updateMap();
    });

    socket.on('initialstate', function(msg) {
      console.log("Here");
      console.log(msg);
      localShade = msg.shade1;
      territories = msg.territories;
      resourceArray = msg.resources;

      updateMap();
    });

    socket.emit('initialstate', {});


  });

});
