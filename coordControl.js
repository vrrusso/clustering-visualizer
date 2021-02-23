
const delay = ms => new Promise(res => setTimeout(res, ms));

//this event listener gets the click on the map
$("#coord-map").click(on_click_map);
$("#insert-button").click(on_click_insert_button);
$("#clear-button").click(on_click_clear_button);
$("#cluster-button").click(on_click_cluster_button);
$("#algorithms").change(on_algorithm_change);


var num_points = 0;
var points_coordinates = [];
var applicarion_state = "inserting";


var cluster_colors = ["#4D4DEC","#F98500","#00FF1A",
                      "#FF00EF","#FF9100","#452069",
                      "#452069","#09571D"];

var analising_color = "#CD2121";

var noise_color = "#9B9F76";

var num_clusters=2;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function euclidianDistance(pointA,pointB){
    return Math.hypot(pointA.x-pointB.x,pointA.y-pointB.y);
}

//futuramente esse evento adcionará os inputs necessários a cada algoritmo
function on_algorithm_change(){
    console.log($("#algorithms").val());
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

//consertar o calculo do centroid - calcular a media certa
async function kMeans(){
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
}



function dbscan_check_neighborhood(eps,index_center_point,center_point){
    let points_neighborhood= [];
    let num_points_neighborhood = 0;
    for(let i=0;i<num_points;i++){
        let point_aux = {x:points_coordinates[i].x,y:points_coordinates[i].y};
        if(i != index_center_point && euclidianDistance(center_point,point_aux) <= eps){
            points_neighborhood[num_points_neighborhood] = i;
            num_points_neighborhood++;
        }
    }
    return points_neighborhood;

}


async function dbscan_recursion(visited ,eps,min_points,point_index,color_index){
    visited[point_index] = 1;
    let point = {x:points_coordinates[point_index].x,
                 y:points_coordinates[point_index].y};
    $("#point"+point_index).css("background-color",analising_color);
    //alert("aqui");
    await delay(1000);
    $("#point"+point_index).css("background-color",cluster_colors[color_index]);
    let neighborhood = dbscan_check_neighborhood(eps,point_index,point);
    if(neighborhood.length <min_points){
        return;
    }
    for(let i=0;i<neighborhood.length;i++){
        if(visited[neighborhood[i]] != 1)
            await dbscan_recursion(visited,eps,min_points,neighborhood[i],color_index);
    }
    

}

async function dbscan(){
    //hyperparameters - futuramente serão definidos pelo usuario
    let eps = 30;
    let min_points = 4;
    let visited = []
    for(let i=0;i<num_points;i++){
        visited[i] = 0;
    }
    let color_index = 0;
    while(visited.includes(0)){
        let first_point_index;
        do{
            first_point_index = getRandomInt(num_points);
        }while(visited[first_point_index] != 0);
        $("#point"+first_point_index).css("background-color",analising_color);
        await delay(1000);
        let first_point = {x:points_coordinates[first_point_index].x,
                           y:points_coordinates[first_point_index].y};
        let neighborhood = dbscan_check_neighborhood(eps,first_point_index,first_point);
        if(neighborhood.length < min_points){
            $("#point"+first_point_index).css("background-color",noise_color);
            visited[first_point_index] = 2;
            await delay(1000);
        }
        else{
            visited[first_point_index] = 1;
            $("#point"+first_point_index).css("background-color",cluster_colors[color_index]);
            for(let i=0;i<neighborhood.length;i++){
                await dbscan_recursion(visited,eps,min_points,neighborhood[i],color_index);
            }
            color_index++;
        }

    }


    applicarion_state = "clustered";
}

function on_click_cluster_button(){
    if(applicarion_state != "clustering" && applicarion_state != "clustered"){
        applicarion_state = "clustering";

        if($("#algorithms").val()=="kMeans"){
            kMeans();
        }
        
        if($("#algorithms").val()=="dbscan"){
            dbscan();
        }


        
        //console.log(centroids);
    }
}



