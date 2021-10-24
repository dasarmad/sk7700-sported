var db = firebase.firestore();

function selectCheck(){
  const c_type = document.getElementById('c_type').value;
  if (c_type === "Member") {
    $('#myModal').modal('show');
    div_verify_msg.innerHTML = ''
    memberOrNot.innerHTML = ''
    isMember = false
  } else {
    $('#myModal').modal('hide');
    div_verify_msg.innerHTML = ''
    memberOrNot.innerHTML = ''
    isMember = false
  }
}

$('#membership_form').submit(function(evt) {
  // Target the form elements by their ids
  // And build the form object like this using jQuery:
  var formData = {
    "c_membership": $('#c_membership').val(),
  }

  evt.preventDefault(); //Prevent the default form submit action

  console.log(formData);
  verifyMembership(formData.c_membership)
})

const div_verify_msg = document.getElementById('div-verification-msg')
const memberOrNot = document.getElementById('memberOrNot')

var currentVenueName;
var isMember;


function verifyMembership(membership_id) {
  div_verify_msg.innerHTML = ''
  div_verify_msg.innerHTML = 'Hold on, We`re verifing your Membership ID'
  console.log(currentVenueName);
  db.collection("MembershipIds").where("venueName", '==', currentVenueName).where("memberIDs", "array-contains", membership_id)
      .get()
      .then((querySnapshot) => {
        div_verify_msg.innerHTML = ``
          if (!querySnapshot.empty) {
              div_verify_msg.innerHTML = `<i class="fas fa-check-circle text-success"></i> Verified`
              isMember = true
              memberOrNot.innerHTML = `<i class="fas fa-check-circle text-success"></i> Verified`
              setTimeout(function(){ $('#myModal').modal('hide'); }, 500);
          } else {
              console.log('querySnapshot not exist!');
              div_verify_msg.innerHTML = `<i class="fas fa-times-circle text-danger"></i> Not Verified` 
              isMember = false
              memberOrNot.innerHTML = `<i class="fas fa-times-circle text-danger"></i> Not Verified` 
              
              setTimeout(function(){ $('#myModal').modal('hide'); }, 500);
          }
          
      })

      
}


$('#bill_form').submit(function(evt) {
  message_success.innerHTML = ''
  message_error.innerHTML = ''
  // Target the form elements by their ids
  // And build the form object like this using jQuery:
  var formData = {
    "c_name": $('#c_name').val(),
    "c_booking_date": $('#c_booking_date').val(),
    "c_time_from": $('#c_time_from').val(),
    "c_time_to": $('#c_time_to').val(),
    "c_sports": $("#c_sports :selected").val(),
    "c_receipt": $('#c_receipt').val()
  }

  evt.preventDefault(); //Prevent the default form submit action

  console.log(formData);
  var duration = getTimeDiff(formData.c_time_from, formData.c_time_to)
  var bill = calculateBill(duration, formData.c_sports, isMember)
  if (bill !== "Error") {
     
    document.getElementById('c_name_main').value = formData.c_name;
    document.getElementById('c_booking_date_main').value = formData.c_booking_date;
    document.getElementById('c_time_from_main').value = formData.c_time_from;
    document.getElementById('c_time_to_main').value = formData.c_time_to;
    document.getElementById('c_price_paid_main').value = bill;
    document.getElementById('c_sports_main').value = formData.c_sports;
    document.getElementById('c_receipt_main').value = formData.c_receipt;
    var member;
    if (isMember) {
      member = "Member"
    } else {
      member = "Guest"
    }
    document.getElementById('c_type_main').value = member;
    disableForm('main_form');
    document.getElementById('bill_form').style.display = 'none';
    document.getElementById('main_form').style.display = 'block';
    
  }
  
})

function editForm() {
  document.getElementById('bill_form').style.display = 'block';
  document.getElementById('main_form').style.display = 'none';  
}

$('#main_form').submit(function(evt) {
  message_success.innerHTML = ''
  message_error.innerHTML = ''
  // Target the form elements by their ids
  // And build the form object like this using jQuery:
  var formData = {
    "c_name": $('#c_name_main').val(),
    "c_booking_date": $('#c_booking_date_main').val(),
    "c_time_from": $('#c_time_from_main').val(),
    "c_time_to": $('#c_time_to_main').val(),
    "c_price_paid": $('#c_price_paid_main').val(),
    "c_sports": $("#c_sports_main").val(),
    "c_receipt_main": $('#c_receipt_main').val() 
  }

  evt.preventDefault(); //Prevent the default form submit action

  console.log(formData);
  var duration = getTimeDiff(formData.c_time_from, formData.c_time_to)
  var bill = calculateBill(duration, formData.c_sports, isMember)
  if (bill !== "Error") {
    document.getElementById('c_price_paid_main').value = bill
    addBooking(formData, duration, bill)
  }
  
})

const message_success = document.getElementById('message-success')
const message_error = document.getElementById('message-error')

function addBooking(formData, duration, bill) {
  var item = rates[0].find(item => item.sportName === formData.c_sports);
  var rateForMember;
  var normalRate;

  if (item) {
    rateForMember = item.memberRatesPerHr;
    normalRate = item.ratesPerHr
  }



  var member;

  if (isMember) {
    member = "Member"
  } else {
    member = "Guest"
  }

  // Add a new document in collection "cities"
  db.collection("booking_history").add({
    customer_name: formData.c_name,
    dateBooked: formData.c_booking_date + " 00:00:00.000",
    memberRatesPerHr: rateForMember.toString(),
    pricePaid: bill.toString(),
    ratesPerHr: normalRate.toString(),
    slotBeginTime: formData.c_booking_date + " " + timeConverter(formData.c_time_from) + ":00.000",
    slotEndTime: formData.c_booking_date + " " + timeConverter(formData.c_time_to) + ":00.000",
    sportName: formData.c_sports,
    uid: member,
    venueName: currentVenueName,
    duration: duration,
    receiptNumber: formData.c_receipt_main.toString()
  })
  .then(() => {
    console.log("Document successfully written!");
    message_success.innerHTML = "Booking added successfully!"
    $('#myModal_Success').modal('show');
    document.getElementById('booking_label').innerHTML = `Thanks ${formData.c_name}, Your booking has been made. See you at ${formData.c_booking_date} (${formData.c_time_from}).`
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
    message_error.innerHTML = error.message;
  });
}

function timeConverter(params) {
  console.log(params)
  let number = moment(`${params}`, ["h:mm A"]).format("HH:mm");
  number = number.replace(".", ":")
  console.log(number); 
  return number
}

function getTimeDiff(start, end) {
  diff = moment.duration(moment(end, "HH:mm A").diff(moment(start, "HH:mm A")));
  diff = `${('0' + diff.hours()).slice(-2)}:${('0' + diff.minutes()).slice(-2)}`
  return timeToDecimal(diff)
}

function timeToDecimal(t) {
  var arr = t.split(':');
  var dec = parseInt((arr[1]/6)*10, 10);

  return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);
}   


function getDuration(from_time, to_time) {
  
  today = new Date()
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth()+1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);


  var date_formatted = year+"-"+month+"-"+day;
  alert(date_formatted)
  var f1 = date_formatted+"T"+from_time
  var f2 = date_formatted+"T"+to_time
  d1 = new Date(Date.parse(f1));
  d2 = new Date(Date.parse(f2));

  d3 = new Date(d2 - d1);
  d0 = new Date(0);

  return {
      getHours: function(){
          return d3.getHours() - d0.getHours();
      },
      getMinutes: function(){
          return d3.getMinutes() - d0.getMinutes();
      },
      getMilliseconds: function() {
          return d3.getMilliseconds() - d0.getMilliseconds();
      },
      toString: function(){
          return ('0' + (this.getHours())).slice(-2) + "." +
                 this.getMinutes()
      },
  };
}

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
                        currentVenueName = doc.data().VenueName
                        username.innerHTML = `<a class="nav-link btn" href="index.html"><i class="fas fa-user-shield"></i> ${doc.data().VenueName}</a>`
                        fetchSportsRates(currentVenueName)
                    }
                });
            } else {
                console.log('querySnapshot not exist!');
                window.location.replace("login.html");
            }
            
        })
}

function fetchSportsRates(currentVenueName) {
  db.collection("venues").where("venueName", '==', currentVenueName)
      .get()
      .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              console.log(doc.data().venueName);
              if (doc.data().venueName) {
                  sports.push(doc.data().sportsOfferedList)
                  rates.push(doc.data().sportsOffered)
                  populateOptions(sports[0])
                  console.log(rates[0]);
              }
            });
          } else {
              console.log('querySnapshot not exist!');
              select.innerHTML = `<option value="Something went wrong">Something went wrong, Please refresh page.</option>` 
          }
          
      })    
}


var sports = [];
var rates = [];

const select = document.getElementById('c_sports');

function populateOptions(s) {
  console.log(s);
  console.log(s.length);
  s.forEach((element) => {
    // Use the element of the array
    console.log(element)
    select.innerHTML += `<option value="${element}">${element}</option>`;
  })
  /*for (var i = 0; i < 3; i++) {
    var opt = sports[i];
    select.innerHTML = `<option value="${opt}">${opt}</option>`;
  }​*/
}

function calculateBill(duration, sport, isMember) {
  console.log('checkArray');
  console.log(rates.length);
  
  var item = rates[0].find(item => item.sportName === sport);
  console.log(item);

  if (item) {
    if (isMember) {
      return item.memberRatesPerHr * parseFloat(duration)
    } else {
      return item.ratesPerHr * parseFloat(duration)
    }
    /*
      if (item.clubA === venue || item.clubB === venue || item.clubC === venue) {
          return `${item.fullName}`
      } else {
          return `${item.fullName}`
      }*/
  } else {
      return "Error"
  }
}

function disableForm(form_id) {
  var form = document.getElementById(form_id);
  var elements = form.elements;
  for (var i = 0, len = elements.length; i < len; ++i) {
      elements[i].readOnly = true;
  }
}