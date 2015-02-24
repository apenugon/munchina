document.addEventListener('DOMContentLoaded', function() {
  var controlMap = document.getElementById("controlMap");
  controlMap.addEventListener("load", function() {
    var svgContent = controlMap.contentDocument;
    console.log("Loaded");
    var paths = svgContent.getElementsByTagName("path");

    for (var i = 0; i < paths.length; i++) {
      paths[i].onclick = function() {
        console.log("Click");
      };
    }
  });
});
