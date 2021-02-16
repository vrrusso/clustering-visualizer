/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function openMiniMenu() {
    var x = document.getElementById("myTopNav");
    if (x.className === "top-nav") {
      x.className += " responsive";
    } else {
      x.className = "top-nav";
    }
} 

