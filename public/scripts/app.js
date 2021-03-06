var $cityList;

$(document).ready(function() {
  console.log("JS is loaded");

  $cityList = $("#city-render");

  //AJAX calls
  //This allows us to render cities on main page
  $.ajax({
    method: "GET",
    url: "/api/cities",
    success: function(data) {
      renderOneCityOnly(data);
      //renderOneLandmark(data);
      populateDropDownCityMenu(data);
    }
  });

  // $.ajax({
  //   method: "GET",
  //   url: "/api/cities/:citiesId/landmarks",
  //   success: renderLandmarks
  // });

  //click on EDIT city button
  $("#city-render").on("click", ".edit-city", handleCityEdit);
  //submit city changes
  $("#city-edit-modal").on("click", "#save-edit-city", handleSaveCityButton);
  // click on an add city button
  $(".modal-nav").on("click", ".btn-add-city", handleAddCityClick);
  //click on save button in add city form
  $("#cityModal").on("click", "#saveCity", handleNewCitySubmit);
  //Open Add landmark modal
  $("#city-render").on("click", ".btn-add-landmark", handleAddLandmarkClick);
  //save button - Landmark form
  $("#landmarkFormModal").on("click", "#saveLandmark", handleNewLandmarkSubmit);
});

// when the ADD Landmark button is clicked, display the modal to display form for adding a landmark
function handleAddLandmarkClick(e) {
  console.log("add landmark clicked!");
  console.log(e);
  var currentCityId = $("div[data-city-id]", "main").attr("data-city-id");
  console.log(currentCityId);
  $("#landmarkFormModal").modal();
}

//Populate the dropdown menu for selecting cityList
function populateDropDownCityMenu(menu) {
  menu.forEach(function(menu) {
    renderDropMenu(menu);
  });
  console.log(menu);
}

//Render the drop menu with city info
function renderDropMenu(menu) {
  console.log("collecting menu list");
  $("div").remove(".dropdown-menu");
  let dropMenu = `
    <li class="dropMenuList"><a href='#' onclick="renderNewCity(this)" class="menu-list-link" data-id-city="${menu._id}">${menu.name}</a</li>
    `;
  $(".dropdown-menu").append(dropMenu);
}

//Edit a city
function handleCityEdit(city) {
  console.log(city);
  let $cityInfoEdit = $(city.target);
  let cityId = $cityInfoEdit.data("city-id");
  console.log("edit city", cityId);

  $.get("/api/cities/" + cityId, function(editCity) {
    console.log("got back the city object", editCity);

    let cityToEdit = `  <div class="modal fade editCityNow" tabindex="-1" role="dialog" id="editCityModal" data-city-id="${editCity._id}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Edit City</h4>
        </div>
        <div class="modal-body">

          <fieldset class='form-horizontal'>
            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="cityName">City Name</label>
              <div id="cityNameInput" class="col-md-4">
                <input id="name" name="cityName" type="text" placeholder="" value="${editCity.name}" class="form-control input-md edited-city-name" required="">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="description">Description</label>
              <div class="col-md-4">
                <input id="description" name="description" type="text" placeholder="" value="${editCity.description}" class="form-control input-md edited-city-description">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="coordinates">Coordinates</label>
              <div class="col-md-4">
                <input id="coordinates" name="coordinates" type="text" placeholder="" value="${editCity.coordinates}" class="form-control input-md edited-city-coordinates">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="population">Population</label>
              <div class="col-md-4">
                <input id="population" name="population" type="text" placeholder="" value="${editCity.population}" class="form-control input-md edited-city-population">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="area">Area</label>
              <div class="col-md-4">
                <input id="area" name="area" type="text" placeholder="" value="${editCity.area}" class="form-control input-md edited-city-area">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="elevation">Elevation</label>
              <div class="col-md-4">
                <input id="elevation" name="elevation" type="text" placeholder="" value="${editCity.elevation}" class="form-control input-md edited-city-elevation">
              </div>
            </div>

            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="time_zone">Time Zone</label>
              <div class="col-md-4">
                <input id="time_zone" name="time_zone" type="text" placeholder="" value="${editCity.time_zone}" class="form-control input-md edited-city-time-zone">
              </div>
            </div>


            <!-- Text input-->
            <div class="form-group">
              <label class="col-md-4 control-label" for="imageURL">Image URL</label>
              <div class="col-md-4">
                <input id="imageURL" name="imageURL" type="imageURL" placeholder="" value="${editCity.imageURL}" class="form-control input-md edited-city-imageURL">
              </div>
            </div>

          </fieldset>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="save-edit-city">Edit city</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal --> `;

    //adds the modal into the HTML after loading the city info
    $("#city-edit-modal").prepend(cityToEdit);

    //calls modal to show up
    $(".editCityNow").modal();
  });
}

//Calls edit modal to screen
function handleSaveCityButton(edit) {
  edit.preventDefault();
  let cityId = $(this).parents("#editCityModal").data("city-id");

  $(".editCityNow").modal("hide");

  let cityData = {
    name: $(".edited-city-name").val(),
    description: $(".edited-city-description").val(),
    coordinates: $(".edited-city-coordinates").val(),
    population: $(".edited-city-population").val(),
    area: $(".edited-city-area").val(),
    elevation: $(".edited-city-elevation").val(),
    time_zone: $(".edited-city-time-zone").val(),
    imageURL: $(".edited-city-imageURL").val()
  };

  console.log("Editing this city", cityId, "with the following info", cityData);

  $.ajax({
    method: "PUT",
    url: "/api/cities/" + cityId,
    data: cityData,
    success: handleCityUpdateResponse
  });
}

//This handles the update of a city after click on Edit Button
function handleCityUpdateResponse(data) {
  console.log("response to update", data);

  let cityId = data._id;
  console.log(cityId);
  // close modal

  clearDomBeforeRender();

  renderNewCityUpdated(data);
}

//This handles teh rendering of a city that has been updated
function renderNewCityUpdated(newCity) {
  //confirm the id of the selected city
  let cityId = newCity._id;
  console.log("rendering city", cityId);
  //get the information of the selected city
  $.get("/api/cities/" + cityId, function(city) {
    console.log("this is the city to show now", city);
    //removes current city informtion from HTML

    clearDomBeforeRender();

    city.landmarkHtml = newCity.landmarks.map(oneLandmark).join("");
    //create template for rendering new city info
    var cityHtml = `
  <div class="row city" data-city-id="${city._id}">

  <div class="row"
    <div class="col-md-3 col-sx-12 thumbnail city-photo" id="city-image">
    <img src="${city.imageURL}"></img>
    </div>
    <div class="col-md-12" id='style-city'>
      <h2>${city.name}</h2>
      <p>${city.description}</P>
    </div>

    </div>

    <div class="city-info">
      <div class="row">
        <div class="col-md-12" id="city-facts">
          <ul id="edit-list">
            <li id="coordinatesInfo">Coordinates: ${city.coordinates}</li>
              <li id="cityPopulation">Population: ${city.population}</li>
              <li id="cityArea">City Area: ${city.area}</li>
              <li id="cityElevation">Elevation: ${city.elevation}</li>
              <li id="cityTimeZone">Time-Zone: ${city.time_zone}</li>
         </ul>
       </div>
      </div>
    </div>

    <div class="edition-button">
    <button type="button" class="btn edit-city" data-city-id="${city._id}">Update City</button>
    </div>

    <hr/>


      <h3>Landmarks</h3>
      <div class="row" id="clear-this-also">
        <button type="button" class="btn btn-add-landmark add-this-landmark">Add Landmark</button>
      </div>

      <hr>

    <div id="landmarks-render">
      ${city.landmarkHtml}
    </div>


  </div>
  `;

    renderDropMenu(newCity);

    $("#city-render").append(cityHtml);

    renderLandmarks(landmarks);
  });
}

function renderOneCityOnly(city) {
  console.log("rendering city", city);

  city.landmarkHtml = city[0].landmarks.map(oneLandmark).join("");

  var oneCity = `
    <div class="row city" data-city-id="${city[0]._id}">

    <div class="row"
      <div class="col-md-3 col-sx-12 thumbnail city-photo" id="city-image">
      <img src="${city[0].imageURL}"></img>
      </div>

      <div class="col-md-12" id="style-city">
        <h2>${city[0].name}</h2>
        <p>${city[0].description}</P>
      </div>

      </div>

      <div class="city-info">
        <div class="row">
          <div class="col-md-12" id="city-facts">
            <ul id="edit-list">
                <li id="coordinatesInfo">Coordinates: ${city[0]
                  .coordinates}</li>
                <li id="cityPopulation">Population: ${city[0].population}</li>
                <li id="cityArea">City Area: ${city[0].area}</li>
                <li id="cityElevation">Elevation: ${city[0].elevation}</li>
                <li id="cityTimeZone">Time-Zone: ${city[0].time_zone}</li>
           </ul>
         </div>
        </div>
      </div>
      <div class="edition-button">
      <button type="button" class="btn edit-city" data-city-id="${city[0]
        ._id}">Update City</button>
      </div>

      <hr/>


        <h3>Landmarks</h3>
        <div class="row" id="clear-this-also">
          <button type="button" class="btn btn-add-landmark add-this-landmark">Add Landmark</button>
        </div>

        <hr>

      <div id="landmarks-render">
        ${city.landmarkHtml}
      </div>


  </div>
  </div>

    `;

  $("#city-render").append(oneCity);

  //getOneCityLandmark(city);
}

function oneLandmark(landmark) {
  return `
        <div class="container">
          <div class="row">
            <div class="col-md-3 col-sx-12 thumbnail landmark-photo" class="landmark-image">
              <img src="${landmark.imageURL}">
            </div>
           <div class="col-md-12" id='style-city'>
              <h2>${landmark.name}</h2>
              <p>${landmark.address}</p>
              <p>${landmark.comments}</P>
       </div>
      </div>
     </div>`;
}

// function getOneCityLandmark(city) {
//   //   if (landmarks) {
//   //     return landmarks
//   //       .map(function(landmark) {
//   //         return getLandmarkHtml(cityId, landmark);
//   //       })
//   //       .join("");
//   //   } else {
//   //     return "";
//   //   }
//   // }
//   //
//   // function getLandmarkHtml(cityId, landmark) {
//   //   return `
//   //      <div class="container">
//   //        <div class="row">
//   //          <div class="col-md-3 col-sx-12 thumbnail landmark-photo" class="landmark-image">
//   //            <img src="${landmark.imageURL}">
//   //          </div>
//   //         <div class="col-md-12" id='style-city'>
//   //            <h2>${landmark.name}</h2>
//   //            <p>${landmark.address}</p>
//   //            <p>${landmark.comments}</P>
//   //       </div>
//   //      </div>
//   //    </div>`;
//   // }
//
//   for (var i = 0; i < city[0].landmarks[i].length; i++) {
//     var name = city[0].landmarks[i].name;
//     console.log(name);
//     address = city[0].landmarks[i].address;
//     console.log(address);
//     comments = city[0].landmarks[i].comments;
//     imageURL = city[0].landmarks[i].imageURL;
//   }
//   var landmarksList = `
// <div class="container">
//   <div class="row">
//     <div class="col-md-3 col-sx-12 thumbnail landmark-photo" class="landmark-image">
//       <img src="${city[0].landmarks[i].imageURL}">
//     </div>
//     <div class="col-md-12" id='style-city'>
//       <h2>${city[0].landmarks[i].name}</h2>
//       <p>${city[0].landmarks[i].address}</p>
//       <p>${city[0].landmarks[i].comments}</P>
//     </div>
// </div>
// `;
//   $("#landmarks-render").append(landmarksList);
// }

//Render cities on HTML
function renderCities(cities) {
  cities.forEach(function(city) {
    renderOneCity(city);
  });
}

//Render One City on HTML
function renderNewCity(city) {
  let cityId = $(city).data("id-city");
  console.log("rendering city", cityId);

  $.get("/api/cities/" + cityId, function(city) {
    console.log("this is the city to show now", city);

    clearDomBeforeRender();

    city.landmarkHtml = city.landmarks.map(oneLandmark).join("");

    var cityHtml = `
  <div class="row city" data-city-id="${city._id}">

  <div class="row"
    <div class="col-md-3 col-sx-12 thumbnail city-photo" id="city-image">
      <img src="${city.imageURL}"></img>
    </div>
    <div class="col-md-12" id='style-city'>
      <h2>${city.name}</h2>
      <p>${city.description}</P>
    </div>

    </div>

    <div class="city-info">
      <div class="row">
        <div class="col-md-12" id="city-facts">
          <ul id="edit-list">
            <li id="coordinatesInfo">Coordinates: ${city.coordinates}</li>
            <li id="cityPopulation">Population: ${city.population}</li>
            <li id="cityArea">City Area: ${city.area}</li>
            <li id="cityElevation">Elevation: ${city.elevation}</li>
            <li id="cityTimeZone">Time-Zone: ${city.time_zone}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="edition-button">
    <button type="button" class="btn edit-city" data-city-id="${city._id}">Update City</button>
    </div>

    <hr/>


      <h3>Landmarks</h3>
      <div class="row" id="clear-this-also">
        <button type="button" class="btn btn-add-landmark add-this-landmark">Add Landmark</button>
      </div>

      <hr>

    <div id="landmarks-render">
        ${city.landmarkHtml}
    </div>


  </div>
  `;

    $("#city-render").append(cityHtml);
  });
}

// when the ADD CITY button is clicked, display the modal to display form for adding a city
function handleAddCityClick(e) {
  console.log("add-city clicked!");
  $("#cityModal").modal(); // display the modal!
}

// when the add city modal submit button is clicked:
function handleNewCitySubmit(e) {
  e.preventDefault();
  var $modal = $("#cityModal");
  var $cityNameField = $modal.find("#name");
  var $descriptionField = $modal.find("#description");
  var $coordinatesField = $modal.find("#coordinates");
  var $populationField = $modal.find("#population");
  var $areaField = $modal.find("#area");
  var $elevationField = $modal.find("#elevation");
  var $time_zoneField = $modal.find("#time_zone");
  var $imageURL = $modal.find("#imageURL");

  var dataToPost = {
    name: $cityNameField.val(),
    description: $descriptionField.val(),
    coordinates: $coordinatesField.val(),
    population: $populationField.val(),
    area: $areaField.val(),
    elevation: $elevationField.val(),
    time_zone: $time_zoneField.val(),
    imageURL: $imageURL.val()
  };

  //Post data to city list
  var cityPostToServer = "/api/cities/";

  $.post(cityPostToServer, dataToPost, function(data) {
    console.log("received data from post to /cities:", data);

    //clear from
    $cityNameField.val("");
    $descriptionField.val("");
    $coordinatesField.val("");
    $populationField.val("");
    $areaField.val("");
    $elevationField.val("");
    $time_zoneField.val("");
    $imageURL.val("");
  });

  $("#cityModal").modal("hide");
}

// // show all landmarks in HTML
// function renderLandmarks(landmarks) {
//   console.log(landmarks);
//   var landmarkHtml = "";
//   landmarks.forEach(function(item) {
//     landmarkHtml = `
//     <div class="container">
//       <div class="row">
//         <div class="col-md-3 col-sx-12 thumbnail landmark-photo" class="landmark-image">
//           <img src="${item.imageURL}">
//         </div>
//         <div class="col-md-12" id='style-city'>
//           <h2>${item.name}</h2>
//           <p>${item.address}</p>
//           <p>${item.comments}</P>
//         </div>
//     </div>
//     `;
//     $("#landmarks-render").append(landmarkHtml);
//   });
// }

//POST TO /api/landmarks

// when the landmark modal submit button is clicked:
function handleNewLandmarkSubmit(e) {
  e.preventDefault();
  console.log("Landmark SUBMIT clicked");
  var currentCityId = $("div[data-city-id]", "main").attr("data-city-id");
  console.log(currentCityId);

  // //var $foundCityId = $(landmark.target);//.parents('btn-add-landmark').data('city-id');
  // // var landmarkId = landmark._id;
  // console.log(e);

  var $modal = $("#landmarkFormModal");
  var $landmarkNameField = $modal.find("#landmarkName");
  var $addressField = $modal.find("#address");
  var $commentField = $modal.find("#comments");
  var $landmarkImageURL = $modal.find("#landmarkImageURL");

  //get data from form fields
  var landmarktoPost = {
    name: $landmarkNameField.val(),
    address: $addressField.val(),
    comments: $commentField.val(),
    imageURL: $landmarkImageURL.val()
  };

  $("#landmarkFormModal").modal("hide");

  console.log(landmarktoPost);

  var landmarkPostToServer = "/api/cities/" + currentCityId; //+ "/landmarks";

  $.post(landmarkPostToServer, landmarktoPost, function(data) {
    console.log("recevied data from post to /landmarks:", data);

    //clear form
    $landmarkNameField.val(
      ""
    ), $addressField.val(""), $landmarkImageURL.val("");

    //update correct city to show new landmark
    //$.get("/api/cities/" + currentCityId, function(data) {
    //remove current instance of city fr. the page.
    // $("[data-city-id=" + cityId + "]").remove();

    clearDomBeforeRender();

    //re-render city with new city data (and new landmark)
    renderNewCity(data);
  });
}

function clearDomBeforeRender() {
  $("div").remove(".city");
  $("div").remove("#city-facts");
  $("div").remove(".edition-button");
  $("div").remove("#clear-this-also");
  $("div").remove("#btn-clear-landmark");
  $("div").remove(".city-info");
  $("div").remove("#landmarksSection");
  $("div").remove("#landmarks-render");
  $("h3").remove();
  $("hr").remove();
  return;
}
