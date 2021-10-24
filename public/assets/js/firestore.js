var db = firebase.firestore();




const innertbody = document.getElementById("innertbody");
const sports_section = document.getElementById("sports-section") 
const f_sports = document.getElementById('f_sports');

const username = document.getElementById("username")
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid = user.uid
        var email = user.email;
        var name = email.substring(0, email.lastIndexOf("@"));

        console.log(user);
        username.innerHTML = `<a class="nav-link btn" href="index.html"><i class="fas fa-user-shield"></i> ${name}</a>`
        fetchProfile(user.uid);
      } else {
        window.location.replace("login.html");
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp()
  });

function doLogout() {
    firebase.auth().signOut().then(() => {
        window.location.replace("login.html");
        // Sign-out successful.
    }).catch((error) => {
        alert(error.message)
        // An error happened.
    });
}


function fetchProfile(uid) {
    db.collection("VenueProfile").where("user_id", "==", uid)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    console.log(doc.data().VenueName);
                    if (doc.data().VenueName) {
                        checkFilter(doc.data().VenueName)
                    }
                    
                });
            } else {
                console.log('querySnapshot not exist!');
                window.location.replace("login.html");
            }
            
        })
}

var venue;
function checkFilter(v) {
    console.log(v);
    venue = v;
    console.log(venue);
    getUser();
    var url_string = window.location.href
    var url = new URL(url_string);
    var filter = url.searchParams.get("filter");
    var date_filter = url.searchParams.get("date-filter");
    populateSports(filter)
    if (filter) {
        if (filter === "all-bookings") {
            get_appointments('abc')
            .then((result) => {
                console.log(result);
                addFilterTable()
            }).catch((err) => {
                alert(err.message)
            }); 
        } else {
            sportsFilter(filter)
            .then((result) => {
                console.log(result);
                addFilterTable()
            }).catch((err) => {
                alert(err.message)
            });  
        }
    } else if (date_filter) {
        getFilterByDate(date_filter)
        .then((result) => {
            console.log(result);
            addFilterTable()
        }).catch((err) => {
            alert(err.message)
        });
    } else {
        get_appointments('abc')
        .then((result) => {
            console.log(result);
            addFilterTable()
        }).catch((err) => {
            alert(err.message)
        });    
    }
}


function populateSports(filter) {
    sports_section.innerHTML = ''
    var ul = ''
    if (!filter) {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
        <li style="cursor: pointer;" onclick="readMore('Football')">
          <div class="disabled" style="padding: 0%;">
            <a>
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
            </a>
          </div>
          <span>Football</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('Cricket')">
          <div class="disabled" style="padding: 0%;">
            <a>
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
            </a>
          </div>
          <span>Cricket</span>
        </li>
        
        <li style="cursor: pointer;" onclick="readMore('Badminton')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
            </a>
          </div>
          <span>Badminton</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
        <li style="cursor: pointer;" onclick="readMore('all-bookings')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
            </a>
          </div>
          <span>View all</span>
        </li>
        </ul>`
    } else if (filter === "Football") {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                  <li style="cursor: pointer;" onclick="readMore('Football')">
                    <div class="enabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/000000/football2--v1.png">
                      </a>
                    </div>
                    <span>Football</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Cricket')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                      </a>
                    </div>
                    <span>Cricket</span>
                  </li>
                  
                  <li style="cursor: pointer;" onclick="readMore('Badminton')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
                      </a>
                    </div>
                    <span>Badminton</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                      </a>
                    </div>
                    <span>View all</span>
                  </li>
        </ul>`
    } else if (filter === "Cricket") {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                  <li style="cursor: pointer;" onclick="readMore('Football')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                      </a>
                    </div>
                    <span>Football</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Cricket')">
                    <div class="enabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/000000/cricket.png">
                      </a>
                    </div>
                    <span>Cricket</span>
                  </li>
                  
                  <li style="cursor: pointer;" onclick="readMore('Badminton')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
                      </a>
                    </div>
                    <span>Badminton</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                      </a>
                    </div>
                    <span>View all</span>
                  </li>
        </ul>`
    } else if (filter === "Badminton") {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                  <li style="cursor: pointer;" onclick="readMore('Football')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                      </a>
                    </div>
                    <span>Football</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Cricket')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                      </a>
                    </div>
                    <span>Cricket</span>
                  </li>
                  
                  <li style="cursor: pointer;" onclick="readMore('Badminton')">
                    <div class="enabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/000000/badminton.png"/>
                      </a>
                    </div>
                    <span>Badminton</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                      </a>
                    </div>
                    <span>View all</span>
                  </li>
        </ul>`
    } else if (filter === "Badminton") {
      ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                <li style="cursor: pointer;" onclick="readMore('Football')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                    </a>
                  </div>
                  <span>Football</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Cricket')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                    </a>
                  </div>
                  <span>Cricket</span>
                </li>
                
                </li>
                <li style="cursor: pointer;" onclick="readMore('Badminton')">
                  <div class="enabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios-glyphs/30/000000/badminton.png"/>
                    </a>
                  </div>
                  <span>Badminton</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                    </a>
                  </div>
                  <span>Volleyball</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                    </a>
                  </div>
                  <span>Table Tennis</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                    </a>
                  </div>
                  <span>View all</span>
                </li>
      </ul>`
  } else if (filter === "Volleyball") {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                  <li style="cursor: pointer;" onclick="readMore('Football')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                      </a>
                    </div>
                    <span>Football</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Cricket')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                      </a>
                    </div>
                    <span>Cricket</span>
                  </li>
                  
                  <li style="cursor: pointer;" onclick="readMore('Badminton')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
                      </a>
                    </div>
                    <span>Badminton</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="enabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/000000/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                      </a>
                    </div>
                    <span>View all</span>
                  </li>
        </ul>`
    } else if (filter === "Table Tennis") {
      ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                <li style="cursor: pointer;" onclick="readMore('Football')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                    </a>
                  </div>
                  <span>Football</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Cricket')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                    </a>
                  </div>
                  <span>Cricket</span>
                </li>
                
                <li style="cursor: pointer;" onclick="readMore('Badminton')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
                    </a>
                  </div>
                  <span>Badminton</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                    </a>
                  </div>
                  <span>Volleyball</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                  <div class="enabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/ios/30/000000/ping-pong.png"/>
                    </a>
                  </div>
                  <span>Table Tennis</span>
                </li>
                <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                  <div class="disabled" style="padding: 0%;">
                    <a>
                      <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
                    </a>
                  </div>
                  <span>View all</span>
                </li>
      </ul>`
    } else if (filter === "all-bookings") {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
                  <li style="cursor: pointer;" onclick="readMore('Football')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
                      </a>
                    </div>
                    <span>Football</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Cricket')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                          <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
                      </a>
                    </div>
                    <span>Cricket</span>
                  </li>
                  
                  <li style="cursor: pointer;" onclick="readMore('Badminton')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
                      </a>
                    </div>
                    <span>Badminton</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Volleyball')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
                      </a>
                    </div>
                    <span>Volleyball</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
                    <div class="disabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
                      </a>
                    </div>
                    <span>Table Tennis</span>
                  </li>
                  <li style="cursor: pointer;" onclick="readMore('all-bookings')">
                    <div class="enabled" style="padding: 0%;">
                      <a>
                        <img src="https://img.icons8.com/material-rounded/24/000000/show-all-views.png"/>
                      </a>
                    </div>
                    <span>View all</span>
                  </li>
        </ul>`
    } else {
        ul = `<ul id="services" style="padding-left: 0; cursor: pointer;">
        <li style="cursor: pointer;" onclick="readMore('Football')">
          <div class="disabled" style="padding: 0%;">
            <a>
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/football2--v1.png">
            </a>
          </div>
          <span>Football</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('Cricket')">
          <div class="disabled" style="padding: 0%;">
            <a>
                <img src="https://img.icons8.com/ios-glyphs/30/ffffff/cricket.png">
            </a>
          </div>
          <span>Cricket</span>
        </li>
        
        <li style="cursor: pointer;" onclick="readMore('Badminton')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/ios-glyphs/30/ffffff/badminton.png"/>
            </a>
          </div>
          <span>Badminton</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('Volleyball')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/ios/30/ffffff/volleyball--v1.png"/>
            </a>
          </div>
          <span>Volleyball</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('Table Tennis')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/ios/30/ffffff/ping-pong.png"/>
            </a>
          </div>
          <span>Table Tennis</span>
        </li>
        <li style="cursor: pointer;" onclick="readMore('all-bookings')">
          <div class="disabled" style="padding: 0%;">
            <a>
              <img src="https://img.icons8.com/material-rounded/24/ffffff/show-all-views.png"/>
            </a>
          </div>
          <span>View all</span>
        </li>
        </ul>`
    }
    sports_section.innerHTML = ul
}      
      
    
    
    function get_appointments(uid) {
        return new Promise((resolve, reject) => {
            f_sports.innerHTML = ''
            f_sports.innerHTML = 'All bookings';
            innertbody.innerHTML = '';
            db.collection("booking_history")
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    var i = 1;
                    querySnapshot.forEach((doc) => {
                      
                        if (doc.data().venueName === venue) {
                          var randomID_dropdown = makeid(10)
                          console.log(doc.id);
                            username.innerHTML = ''
                            username.innerHTML = `<a class="nav-link btn" href="index.html"><i class="fas fa-user-shield"></i> ${doc.data().venueName}</a>`
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            var row = `<tr class="col-form-label col-form-label-sm text-white" id="${doc.id}_tr">
                              <td><div class="table-content"><small>${dateToTimestamp(doc.data().dateBooked)}</small></div></td>`
                              if (doc.data().customer_name) {
                                row += `<td><div class="table-content">${doc.data().customer_name}</div></td>`
                              } else {
                                row += `<td><div class="table-content">${getUsername(doc.data().uid, doc.data().venueName)}</div></td>`
                              }
                              if (doc.data().uid === "Guest") {
                                row += `<td><div class="table-content">Guest</div></td>`
                              } else if (doc.data().uid === "Member") {
                                row += `<td><div class="table-content">Member</div></td>`
                              } else {
                                row += `<td><div class="table-content">${checkMembership(doc.data().uid, doc.data().venueName)}</div></td>`
                              }
                              if (doc.data().sportName) {
                                row += `<td><div class="table-content">${doc.data().sportName}</div></td>`
                              } else {
                                row += `<td></td>`
                              
                              }
                              row += `<td><div class="table-content">${dateFunction(doc.data().dateBooked)}</div></td>`
                              
                              if (doc.data().slotBeginTime) {
                                if (doc.data().slotBeginTime.includes("AM") || doc.data().slotBeginTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotBeginTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                              }
                              
                              if (doc.data().slotEndTime) {
                                if (doc.data().slotEndTime.includes("AM") || doc.data().slotEndTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotEndTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                              }
                              
                              
                              row += `<td><div class="table-content">${doc.data().duration}</div></td>
                              <td><div class="table-content">${doc.data().receiptNumber}</div></td>
                              <td><div class="table-content">${doc.data().pricePaid}</div></td>
                              <td class="text-center">
                                <button class="btn btn-sm btn-outline-success dropdown-toggle text-center" type="button" id="${randomID_dropdown}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="far fa-edit text-light"></i> Edit
                                </button>
                                <div class="dropdown-menu" aria-labelledby="${randomID_dropdown}">
                                  <button class="dropdown-item btn" onclick="delBooking('Delete','${doc.id}')"><i class="far fa-trash-alt"></i> Delete</button> 
                                </div>
                              </td>
                            </tr>`
                            console.log(); 
                            i++;
                            innertbody.innerHTML = innertbody.innerHTML + row;

                        }
                        
                    });
                    if ( uid ) {
                        resolve("Stuff worked!");
                    } else {
                        reject(Error("It didn't work!"));
                    }
                } else {
                    var row = `<tr class="col-form-label col-form-label-sm text-white ">
                        <td>No match found!</td>
                    </tr>`
                    console.log(); 
                    
                    innertbody.innerHTML = innertbody.innerHTML + row;
                }
                
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        });
    }
    
    function addFilterTable() {
      $(document).ready( function () {
          // Setup - add a text input to each footer cell
    /*$('#example thead tr').clone(true).appendTo( '#example thead' );
    $('#example thead tr:eq(1) th').each( function (i) {
        var title = $(this).text();
        if (i === 0 || i === 1) {

        } else if (i === 4 ) {
            $(this).html( '<input id="sports" type="text" placeholder="Search '+title+'" />' );
        } else {
            $(this).html( '<input id="" type="text" placeholder="Search '+title+'" />' );
        }
        
        $( 'input', this ).on( 'keyup change', function () {
            if ( table.column(i).search() !== this.value ) {
                table
                    .column(i)
                    .search( this.value )
                    .draw();
            }
        } );
    } );*/
        var table = $('#example').DataTable({
            responsive: true,
            order: [[ 0, 'des' ], [4, 'des']],
            orderCellsTop: true,
            fixedHeader: true,
            paging: false,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: 'Add Booking <i class="fas fa-plus"></i>',
                    className: 'btn-success btn-sm',
                    action: function ( e, dt, node, config ) {
                      window.location.assign('add-booking.html')
                    }
                }
            ],
            "columnDefs": [
              {
                  "targets": [0],
                  "visible": false,
                  "searchable": false
              }]
            /*"fnRowCallback" : function(nRow, aData, iDisplayIndex){
                $("td:first", nRow).html(iDisplayIndex +1);
                return nRow;
            },
            "columnDefs": [
                { "searchable": false, "targets": [0, 1] }  // Disable search on first and last columns
              ]
            /*,
            "autoWidth":false,
            "columnDefs": [
                { "width": "5%", "targets": 0 },
                { "width": "15%", "targets": 1 },
                { "width": "5%", "targets": 2 },
                { "width": "5%", "targets": 3 },
                { "width": "10%", "targets": 4 },
                { "width": "15%", "targets": 5 },
                { "width": "5%", "targets": 6 },
                { "width": "20%", "targets": 7 }
            ]*/
        });
      });
    }
    
    


      function timeConverter(UNIX_timestamp){
        if (UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        console.log(a);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var nowHour = a.getHours();
            var nowMinutes = a.getMinutes();
            var sec = a.getSeconds();
      
          var suffix = nowHour >= 12 ? "PM" : "AM";
          nowHour = (suffix == "PM" & (nowHour > 12 & nowHour < 24)) ? (nowHour - 12) : nowHour;
          nowHour = nowHour == 0 ? 12 : nowHour;
          nowMinutes = nowMinutes < 10 ? "0" + nowMinutes : nowMinutes;
          var currentTime = date + ' ' + month + ' ' + year + ' - ' + nowHour + ":" + nowMinutes + ' ' + suffix;
                  
          return currentTime
        } else {
          return "-";
        }
      }

      function dateFunction(UNIX_timestamp){
        if (UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        console.log(a);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var nowHour = a.getHours();
            var nowMinutes = a.getMinutes();
            var sec = a.getSeconds();
      
          var suffix = nowHour >= 12 ? "PM" : "AM";
          nowHour = (suffix == "PM" & (nowHour > 12 & nowHour < 24)) ? (nowHour - 12) : nowHour;
          nowHour = nowHour == 0 ? 12 : nowHour;
          nowMinutes = nowMinutes < 10 ? "0" + nowMinutes : nowMinutes;
          var currentTime = date + ' ' + month + ' ' + year;
                  
          return currentTime
        } else {
          return "-";
        }
      }
      
function dateSuffix(params) {
  if (params) {
    if(isDate(params)){
      var a = new Date(params);
      console.log(a);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var nowHour = a.getHours();
      var nowMinutes = a.getMinutes();
      var sec = a.getSeconds();
    
      var suffix = nowHour >= 12 ? "PM" : "AM";
      nowHour = (suffix == "PM" & (nowHour > 12 & nowHour < 24)) ? (nowHour - 12) : nowHour;
      nowHour = nowHour == 0 ? 12 : nowHour;
      nowMinutes = nowMinutes < 10 ? "0" + nowMinutes : nowMinutes;
      var currentTime = nowHour + ":" + nowMinutes + ' ' + suffix;          
      
      return currentTime

  } else {
        //Example of use:
        var something = params;
        something = something.insert(2, ":");
        something = something.substring(0, 5);
        console.log(something)
        return tConvert(something)
  }
  } else {
    return '-';
  }
  
}

String.prototype.insert = function(index, string) {
    if (index > 0) {
      return this.substring(0, index) + string + this.substr(index);
    }
  
    return string + this;
};

function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

function dateToTimestamp(d) {
    if (d){
        var a = new Date(d);
        console.log(a);
    }    
    console.log(a.getTime());
    return a.getTime()
}      

function isDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

var usersArray = []

function getUser() {
    return new Promise((resolve, reject) => {
        let status = ''
        const userRef = db.collection("userProfile")
        userRef.get().then((querySnapshot) => {
            usersArray = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
            })
            //console.log(tempDoc)
            //usersArray.push(tempDoc)
            console.log(usersArray);
        })
        
        /*userRef.get().then((doc) => {
            // doc.data() is never undefined for query doc snapshots
            if (doc.exists) {
                console.log("Document data:", doc.data());
                status = "Member"
                if ( uid ) {
                    resolve(status);
                } else {
                    reject(Error("It didn't work!"));
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                status = "Not a member"
                if ( uid ) {
                    resolve(status);
                } else {
                    reject(Error("It didn't work!"));
                }
            }
            
        })*/
    });
}

function checkMembership(user_id, venue) {
    console.log('checkArray');
    console.log(usersArray.length);
    /*for (var index = 0; index < usersArray.length; index++) {
        console.log(usersArray[index].id);
    }*/
    // grab the Array item which matchs the id "2"

    var item = usersArray.find(item => item.id === user_id);

    console.log(item);
    if (item) {
        if (item.clubA === venue || item.clubB === venue || item.clubC === venue) {
            return `Member`
        } else {
            return `Not a member`
        }
    } else {
        return "<small>UserProfile doesn't exist</small>"
    }
    

    /* print
    console.log(item.id);
    console.log(item.uid);
    */
}

function getUsername(user_id, venue) {
    console.log('checkArray');
    console.log(usersArray.length);
    /*for (var index = 0; index < usersArray.length; index++) {
        console.log(usersArray[index].id);
    }*/
    // grab the Array item which matchs the id "2"

    var item = usersArray.find(item => item.id === user_id);

    console.log(item);
    if (item) {
        if (item.clubA === venue || item.clubB === venue || item.clubC === venue) {
            return `${item.fullName}`
        } else {
            return `${item.fullName}`
        }
    } else {
        return "<small>UserProfile doesn't exist</small>"
    }
    

    /* print
    console.log(item.id);
    console.log(item.uid);
    */
}

function addtext() {
    document.getElementById('sports').value = "Football"
}

function sportsFilter(sport) {
    f_sports.innerHTML = ''
    f_sports.innerHTML = sport;
    return new Promise((resolve, reject) => {
        innertbody.innerHTML = '';
        db.collection("booking_history").where("sportName", "==", sport)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                var i = 1;
                querySnapshot.forEach((doc) => {
                    if (doc.data().venueName === venue) { 
                      var randomID_dropdown = makeid(10)
                      console.log(doc.id);    
                        // doc.data() is never undefined for query doc snapshots
                        username.innerHTML = ''
                        username.innerHTML = `<a class="nav-link btn" href="index.html"><i class="fas fa-user-shield"></i> ${doc.data().venueName}</a>`
                            
                        console.log(doc.id, " => ", doc.data());
                        var row = `<tr class="col-form-label col-form-label-sm text-white " id="${doc.id}_tr">
                              <td><div class="table-content"><small>${dateToTimestamp(doc.data().dateBooked)}</small></div></td>`
                              if (doc.data().customer_name) {
                                row += `<td><div class="table-content">${doc.data().customer_name}</div></td>`
                              } else {
                                row += `<td><div class="table-content">${getUsername(doc.data().uid, doc.data().venueName)}</div></td>`
                              }
                              if (doc.data().uid === "Guest") {
                                row += `<td><div class="table-content">Guest</div></td>`
                              } else if (doc.data().uid === "Member") {
                                row += `<td><div class="table-content">Member</div></td>`
                              } else {
                                row += `<td><div class="table-content">${checkMembership(doc.data().uid, doc.data().venueName)}</div></td>`
                              }

                              if (doc.data().sportName) {
                                row += `<td><div class="table-content">${doc.data().sportName}</div></td>`
                              } else {
                                row += `<td></td>`
                              
                              }

                              row += `<td><div class="table-content">${dateFunction(doc.data().dateBooked)}</div></td>`
                              
                              if (doc.data().slotBeginTime) {
                                if (doc.data().slotBeginTime.includes("AM") || doc.data().slotBeginTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotBeginTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                              }
                              
                              if (doc.data().slotEndTime) {
                                if (doc.data().slotEndTime.includes("AM") || doc.data().slotEndTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotEndTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                              }
                              
                              
                              row += `<td><div class="table-content">${doc.data().duration}</div></td>
                              <td><div class="table-content">${doc.data().receiptNumber}</div></td>
                              <td><div class="table-content">${doc.data().pricePaid}</div></td>
                              <td class="text-center">
                                <button class="btn btn-sm btn-outline-success dropdown-toggle text-center" type="button" id="${randomID_dropdown}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="far fa-edit text-light"></i> Edit
                                </button>
                                <div class="dropdown-menu" aria-labelledby="${randomID_dropdown}">
                                  <button class="dropdown-item btn" onclick="delBooking('Delete','${doc.id}')"><i class="far fa-trash-alt"></i> Delete</button> 
                                </div>
                              </td>
                            </tr>`
                        console.log(); 
                        i++;
                        innertbody.innerHTML = innertbody.innerHTML + row;
                    }
                });
                if ( sport ) {
                    resolve("Stuff worked!");
                } else {
                    reject(Error("It didn't work!"));
                }
            } else {
                var row = `<tr class="col-form-label col-form-label-sm text-white ">
                        <td>No match found!</td>
                    </tr>`
                    console.log(); 
                    
                    innertbody.innerHTML = innertbody.innerHTML + row;
                console.log('querySnapshot not exist!');
            }
            
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    });
}

function inputDateFilter(d) {
    let date = new Date(d.value)
    console.log(date);
    var result = [date.getFullYear(),pad(date.getMonth() + 1), pad(date.getDate())].join('-');
    f_sports.innerHTML = ''
    f_sports.innerHTML = result;
    result = result+' '+'00:00:00.000'
    console.log(result);
    var myStr = result;
    //var newStr = myStr.replace(/ /g, '-');
  
    var url = 'index.html?';
    var query = 'date-filter=' + myStr;
    localStorage.setItem('date-filter', myStr );
    window.location.href = url + query
}

function getFilterByDate(result) {
    
    return new Promise((resolve, reject) => {
        
        
        innertbody.innerHTML = '';
        db.collection("booking_history").where("dateBooked", "==", result)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                var i = 1;
                querySnapshot.forEach((doc) => {
                    if (doc.data().venueName === venue) { 
                      var randomID_dropdown = makeid(10)
                      console.log(doc.id);    
                        // doc.data() is never undefined for query doc snapshots
                        username.innerHTML = ''
                        username.innerHTML = `<a class="nav-link btn" href="index.html"><i class="fas fa-user-shield"></i> ${doc.data().venueName}</a>`
                            
                        console.log(doc.id, " => ", doc.data());
                        var row = `<tr class="col-form-label col-form-label-sm text-white " id="${doc.id}_tr">
                              <td><div class="table-content"><small>${dateToTimestamp(doc.data().dateBooked)}</small></div></td>`
                              if (doc.data().customer_name) {
                                row += `<td><div class="table-content">${doc.data().customer_name}</div></td>`
                              } else {
                                row += `<td><div class="table-content">${getUsername(doc.data().uid, doc.data().venueName)}</div></td>`
                              }
                              if (doc.data().uid === "Guest") {
                                row += `<td><div class="table-content">Guest</div></td>`
                              } else if (doc.data().uid === "Member") {
                                row += `<td><div class="table-content">Member</div></td>`
                              } else {
                                row += `<td><div class="table-content">${checkMembership(doc.data().uid, doc.data().venueName)}</div></td>`
                              }

                              if (doc.data().sportName) {
                                row += `<td><div class="table-content">${doc.data().sportName}</div></td>`
                              } else {
                                row += `<td></td>`
                              
                              }

                              row += `<td><div class="table-content">${dateFunction(doc.data().dateBooked)}</div></td>`
                              
                              if (doc.data().slotBeginTime) {
                                if (doc.data().slotBeginTime.includes("AM") || doc.data().slotBeginTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotBeginTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotBeginTime)}</div></td>`
                              }
                              
                              if (doc.data().slotEndTime) {
                                if (doc.data().slotEndTime.includes("AM") || doc.data().slotEndTime.includes("PM")) {
                                  row += `<td><div class="table-content">${doc.data().slotEndTime}</div></td>`
                                } else {
                                  row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                                }
                              } else {
                                row += `<td><div class="table-content">${dateSuffix(doc.data().slotEndTime)}</div></td>`
                              }
                              
                              
                              row += `<td><div class="table-content">${doc.data().duration}</div></td>
                              <td><div class="table-content">${doc.data().receiptNumber}</div></td>
                              <td><div class="table-content">${doc.data().pricePaid}</div></td>
                              <td class="text-center">
                                <button class="btn btn-sm btn-outline-success dropdown-toggle text-center" type="button" id="${randomID_dropdown}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="far fa-edit text-light"></i> Edit
                                </button>
                                <div class="dropdown-menu" aria-labelledby="${randomID_dropdown}">
                                  <button class="dropdown-item btn" onclick="delBooking('Delete','${doc.id}')"><i class="far fa-trash-alt"></i> Delete</button> 
                                </div>
                              </td>
                            </tr>`
                        console.log(); 
                        i++;
                        innertbody.innerHTML = innertbody.innerHTML + row;
                    }
                });
                if ( result ) {
                    resolve("Stuff worked!");
                } else {
                    reject(Error("It didn't work!"));
                }
            } else {
                var row = `<tr class="col-form-label col-form-label-sm text-white ">
                        <td>No match found!</td>
                    </tr>`
                    console.log(); 
                    
                    innertbody.innerHTML = innertbody.innerHTML + row;
                console.log('querySnapshot not exist!');
            }
            
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    });
}

function pad(n) {return (n<10 ? '0'+n : n);}

function readMore(id) {
    var myStr = id;
    //var newStr = myStr.replace(/ /g, '-');
  
    var url = 'index.html?';
    var query = 'filter=' + myStr;
    localStorage.setItem( 'filter', id );
    window.location.href = url + query
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function delBooking(params, id) {
  db.collection("booking_history").doc(id).delete().then(() => {
    console.log("Document successfully deleted!");
    $(`#${id}_tr`).fadeOut();
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  
}