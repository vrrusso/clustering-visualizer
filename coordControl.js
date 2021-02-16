
//this event listener gets the click on the map
$("#coord-map").click(on_click_map);
$("#insert-button").click(on_click_insert_button);
$("#clear-button").click(on_click_clear_button);
$("#cluster-button").click(on_click_cluster_button);


var num_points = 0;
var points_coordinates = [];
var applicarion_state = "inserting";

var num_clusters=2;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function on_click_map(){
    if(applicarion_state == "inserting"){
        var circle = $('<div class="circle" id="point'+num_points+'"'+'></div>');
        circle.css('top',event.clientY-5);
        circle.css('left',event.clientX-5);
        $("#coord-map").append(circle);
        let point = {
            x: event.clientX-5,
            y: event.clientY-5
        };
        points_coordinates[num_points] = point;
        num_points++;
    }
}

function on_click_insert_button(){
    applicarion_state = "inserting";
}

function on_click_clear_button(){
    applicarion_state = "inserting";
    num_points = 0;
    points_coordinates.length = 0;
    console.log(points_coordinates);
    $(".circle").remove();
}

function on_click_cluster_button(){
    applicarion_state = "clustering";
    let centroids = [];
    let indexes = [];
    for(var i=0;i<num_clusters;i++){
        let index;
        do{
            index = getRandomInt(points_coordinates.length);
        }while(indexes.includes(index));
        indexes[i] = index;
        console.log(index);
        let centroid_aux = {x: points_coordinates[index].x,y:points_coordinates[index].y};
        centroids[i] = centroid_aux;
        $("#point"+index).css("background-color","red");
    }
    console.log(centroids);
}



