const yearDiv = document.querySelector('#yearFilters');
const launchDiv = document.querySelector('#launchFilters');
const landingDiv = document.querySelector('#landingFilters');

getapi();
createFilters();

$("#yearFilters div").click(function(){
    if($(this).text().toLowerCase() === launch_year){
        launch_year = '';
    }
    else {
        launch_year = $(this).text();
    }
    history.pushState({}, '', createUrl());
    getapi();
})

$("#launchFilters div").click(function(){
    if($(this).text().toLowerCase() === launch_success){
        launch_success = '';
    } else {
        launch_success = $(this).text().toLowerCase();
    }
    history.pushState({}, '', createUrl());
    getapi();
})

$("#landingFilters div").click(function(){
    if($(this).text().toLowerCase() === land_success) {
        land_success = '';
    } else {
        land_success = $(this).text().toLowerCase();
    }
    history.pushState({}, '', createUrl());
    getapi();
})

function highlightFilters(){
    $("#yearFilters div").removeClass('selected');
    $("#launchFilters div").removeClass('selected');
    $("#landingFilters div").removeClass('selected');

    $("#yearFilters div").filter(function() {
        if($(this).text().toLowerCase() === launch_year){
            $(this).addClass('selected');
        }
    });
    $("#launchFilters div").filter(function() {
        if($(this).text().toLowerCase() === launch_success){
            $(this).addClass('selected');
        }
    });
    $("#landingFilters div").filter(function() {
        if($(this).text().toLowerCase() === land_success){
            $(this).addClass('selected');
        }
    });
}

function createUrl(){
    let queryParams = [];
    if(launch_year){  queryParams.push(`launch_year=${launch_year}`) };
    if(land_success){ queryParams.push(`land_success=${land_success}`) };
    if(launch_success){ queryParams.push(`launch_success=${launch_success}`)  };

    let queryStr = '?' + queryParams.join('&');
    if(queryStr === '?'){
        queryStr = '/';
    }
    return queryStr;
}

function createFilters(){
    let years = ["2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020"];
    let launchStatus = ["True","False"];
    let landingStatus = ["True","False"];

    years.forEach(element => {
        let Child = document.createElement('div');
        Child.className = 'year';
        Child.innerHTML = element;
        yearDiv.appendChild(Child);
    });
    launchStatus.forEach(element => {
        let Child = document.createElement('div');
        Child.className = 'launchings';
        Child.innerHTML = element;
        launchDiv.appendChild(Child);
    });
    landingStatus.forEach(element => {
        let Child = document.createElement('div');
        Child.className = 'landings';
        Child.innerHTML = element;
        landingDiv.appendChild(Child);
    });
}

async function getapi() {
    let api_url = 'https://api.spacexdata.com/v3/launches?limit=100';

    api_url = api_url + createUrl().replace('?', '&');

    // Storing response
    const response = await fetch(api_url);

    if (response) {
        // Storing data in form of JSON
        let data = await response.json();
        populateData(data);
    }

    highlightFilters();
}

function populateData(data) {
    $("#flightinfos").empty();
    for(let i = 0; i < data.length; i++){
        createData(data[i], i);
    }
}

function createData(data, i){
    let missions = $("<div></div>").addClass('flight').attr("id", `flight${i}`);
    $("#flightinfos").append(missions);


    let idlist = $('<ul></ul>');
    if(data.mission_id.length > 0) {
        for (let j = 0; j < data.mission_id.length; j++) {
            console.log(data.mission_id[j]);
            $(`<li>${data.mission_id[j]}</li>`).appendTo(idlist);
        }
    }

    const flightDiv = $('#flight' + i);

    let imageContainer = $("<div class='imageContainer'></div>");
    $("<img></img>")
        .addClass("missionImage")
        .attr("src", data.links.mission_patch_small)
        .attr('alt', 'mission image')
        .appendTo(imageContainer);

    imageContainer.appendTo(flightDiv);

    let flightDataContainer = $("<div class='missionDataContainer'></div>");

    $(`<div>${data.mission_name} # ${data.flight_number}</div>`).addClass("missionname").appendTo(flightDataContainer);

    $("<div></div>").attr("id", `flight ${i}`);

    if(data.mission_id.length > 0) {
        $(`<div><b>Mission Ids:</b></div>`).appendTo(flightDataContainer);
        idlist.appendTo(flightDataContainer);
    }

    $(`<div><b>Launch Year:</b> ${data.launch_year}</div>`).appendTo(flightDataContainer);

    $(`<div><b>Successful Launch:</b> ${data.launch_success}</div>`).appendTo(flightDataContainer);

    $(`<div><b>Successful Landing:</b> ${data.rocket.first_stage.cores[0].land_success === null ? 'NA' : data.rocket.first_stage.cores[0].land_success}</div>`).appendTo(flightDataContainer);

    flightDataContainer.appendTo(flightDiv);
}