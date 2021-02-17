
const delay = ms => new Promise(res => setTimeout(res, ms));

//this event listener gets the click on the map
$("#coord-map").click(on_click_map);
$("#insert-button").click(on_click_insert_button);
$("#clear-button").click(on_click_clear_button);
$("#cluster-button").click(on_click_cluster_button);


var num_points = 0;
var points_coordinates = [];
var applicarion_state = "inserting";


var cluster_colors = ["#4D4DEC","#F98500"];

var analising_color = "#CD2121";

var num_clusters=2;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function euclidianDistance(pointA,pointB){
    return Math.hypot(pointA.x-pointB.x,pointA.y-pointB.y);
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
    if(applicarion_state != "clustering"){
        applicarion_state = "inserting";
    }
}

function on_click_clear_button(){
    if(applicarion_state != "clustering"){
        applicarion_state = "inserting";
        num_points = 0;
        points_coordinates.length = 0;
        //console.log(points_coordinates);
        $(".circle").remove();
    }
}

async function on_click_cluster_button(){
    if(applicarion_state != "clustering" && applicarion_state != "clustered"){
        applicarion_state = "clustering";
        let centroids = [];
        let indexes_togo = [];
        for(var i=0;i<num_points;i++){
            indexes_togo[i] = 1;
        }
        for(var i=0;i<num_clusters;i++){
            let index;
            do{
                index = getRandomInt(points_coordinates.length);
            }while(indexes_togo[index] == 0);
            indexes_togo[index] = 0;
            //console.log(index);
            let centroid_aux = {x: points_coordinates[index].x,y:points_coordinates[index].y};
            centroids[i] = centroid_aux;
            $("#point"+index).css("background-color",cluster_colors[i]);
        }
        await delay(1000);
        let n_points_left = num_points - num_clusters;
        while(n_points_left>0){
            let index;
            let distances = [];
            do{
                index = getRandomInt(points_coordinates.length);
            }while(indexes_togo[index] == 0);
            indexes_togo[index] = 0;
            $("#point"+index).css("background-color",analising_color);
            //console.log(index);
            await delay(1000);
            for(var i = 0;i<num_clusters;i++){
                distances[i] = euclidianDistance(points_coordinates[index],centroids[i]);
            }
            cluster_index = distances.indexOf(Math.min(...distances));
            centroids[cluster_index].x = (centroids[cluster_index].x+points_coordinates[index].x)/2;
            centroids[cluster_index].y = (centroids[cluster_index].y+points_coordinates[index].y)/2;
            $("#point"+index).css("background-color",cluster_colors[cluster_index]);
            await delay(1000);


            n_points_left--;
        }



        applicarion_state = "clustered";
        //console.log(centroids);
    }
}



