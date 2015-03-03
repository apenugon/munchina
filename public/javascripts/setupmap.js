document.addEventListener('DOMContentLoaded', function() {
  //var socket = io.connect("http://localhost:4000"); Local
  //Server
  var socket = io.connect("http://ec2-52-1-166-29.compute-1.amazonaws.com:4000");
  var svg = document.getElementById("svgmap");
  var localTerritories = [];
  var localShade = [];
  console.log("Here");

  var territoryNames = ['Xinjiang', 'Uliassutai', 'Heilongjiang', 'Jilin', 'Shengjing', 'Zhili', 'Inner Mongolia', 'Gansu', 'Shaanxi', 'Shanxi', 'Shangdong', 'Henan', 'JangSu', 'Qinghai', 'Tibet', 'Sichuan', 'Yunnan', 'Guizhou', 'Hubei', 'Anhui', 'Zheliang', 'Jiangxi', 'Hunan', 'Guangxi', 'Fujian', 'Guangdong', 'Southern Sea', 'Pacific Ocean', 'Great Southern Ocean', 'Great Eastern Ocean', 'Sea of Japan', 'Eastern Sea'];

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
    var allPaths = svgContent.getElementsByTagName("path");
    var paths = [];
    //Only place good paths into path array
    var iter = 0;
    for (var i = 0; i < allPaths.length; i++) {
      if (allPaths[i].getAttribute("class") != "border") {
        paths[iter++] = allPaths[i];
      }
    }

    var localShade = [];
    var territories = [];

    resourceArray = [];


    var tooltipFunc = function(event) {
      if (localShade[this.id] != 1) {
        clearTimeout(timeout);
        $("#resources").text(resourceArray[this.id]);
        $("#title").text(territoryNames[this.id]);
        $("#tooltip").css("left", event.pageX)
                     .css("top", event.pageY)
                      .stop().show("fast");
      }
    };

    for (var i = 0; i < paths.length; i++) {
      paths[i].id = i;
      paths[i].style.fill = "black";
      paths[i].style.opacity = "0";
      paths[i].className = "province";
      paths[i].onmouseover = tooltipFunc;
      paths[i].onmouseout = hide;
      localShade[i] = 0;
      territories[i] = 0;
      resourceArray[i] = '';
    }

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
