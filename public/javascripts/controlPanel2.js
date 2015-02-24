document.addEventListener('DOMContentLoaded', function() {
  var socket = io.connect("http://localhost:4000");
  var svg = document.getElementById("faction1Map");
  var svg2 = document.getElementById("faction2Map");
  var territoryMap = document.getElementById("territoryMap");

  var localShadedFaction1 = [];
  var localShadedFaction2 = [];
  svg.addEventListener("load", function() {
    var svgContent = svg.contentDocument;
    console.log("Loaded");
    console.log(svgContent);
    var paths = svgContent.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      localShadedFaction1[i] = 0;
      paths[i].style.fill = "black"; //Initialize to black 
      paths[i].style.opacity = "0";
      paths[i].id = i;
      //Add onclick listener:
      paths[i].onclick = function() {
        console.log(this.id);
        if (localShadedFaction1[this.id] == 1) {
          this.style.fill = "black";
          this.style.opacity = "0";
          localShadedFaction1[this.id] = 0;
        } else {
          this.style.fill = "black";
          this.style.opacity = ".7";
          localShadedFaction1[this.id] = 1;
          console.log(localShadedFaction1);
        }
        socket.emit("faction1Shade", localShadedFaction1);
      };
    }
  });

  svg2.addEventListener("load", function() {
    var svgContent = svg2.contentDocument;
    console.log("Loaded");
    console.log(svgContent);
    var paths = svgContent.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      localShadedFaction2[i] = 0;
      paths[i].style.fill = "black"; //Initialize to black 
      paths[i].style.opacity = "0";
      paths[i].id = i;
      //Add onclick listener:
      paths[i].onclick = function() {
        console.log(this.id);
        if (localShadedFaction2[this.id] == 1) {
          this.style.fill = "black";
          this.style.opacity = "0";
          localShadedFaction2[this.id] = 0;
        } else {
          this.style.fill = "black";
          this.style.opacity = ".7";
          localShadedFaction2[this.id] = 1;
          console.log(localShadedFaction2);
        }
        socket.emit("faction2Shade", localShadedFaction2);
      };
    }
  });

  var territories = [];

  territoryMap.addEventListener("load", function() {
    var territoryContent = territoryMap.contentDocument;
    var paths = territoryContent.getElementsByTagName("path");

    var pathFunction = function() {
      console.log("Clicked");
      territories[this.id]++;
      if (territories[this.id] > 2)
        territories[this.id] = 0;
      if (territories[this.id] == 2) {
        this.style.fill = "red";
        this.style.opacity = ".3";
      }
      if (territories[this.id] == 1) {
        this.style.fill = "blue";
        this.style.opacity = ".3";
      }  
      if (territories[this.id] === 0) {
        this.style.opacity = "0";
      }
      socket.emit("territories", territories);
    };

    for (var i = 0; i < paths.length; i++) {
      paths[i].id = i;
      paths[i].style.fill = "blue";
      paths[i].style.opacity="0";
      territories[i] = 0;
      paths[i].onclick = pathFunction;
    }
    console.log(territories);

  });
});
