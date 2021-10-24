const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { event } = require('firebase-functions/lib/providers/analytics');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const firestore = admin.firestore();

exports.VenueLogin = functions.https.onRequest((req, res) => {
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s
  
    res.set('Access-Control-Allow-Origin', '*');
  
    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
    } 
    
    if (req.method === 'POST') {
  
      switch (req.get('content-type')) {
        // '{"name":"John"}'
        case 'application/json':
          ({name} = req.body);
          console.log(req.body.uid);
          
          // ...
            var email = req.body.email;
            var name = email.substring(0, email.lastIndexOf("@"));
            const current_date = Date.now()
            var response_message = "";

            const p = admin.auth().updateUser(req.body.uid, {
                displayName: name,
                disabled: true
            })

            p.then(function () {
                response_message = "Profile updated!"
                console.log(response_message); 
            })

            
            const promise = firestore.collection("VenueProfile").doc(req.body.uid).set({
                displayName: name,
                email: email,
                user_id: req.body.uid,
                registration_date_timestamp: current_date,
                account_disabled: true
            });

            const p2 = promise.then(function () {
                response_message = "Data Pushed"
                console.log(response_message); 
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({res:"Account Created but disabled now."}));
        
            })

           
          
          break;
    
        // 'John', stored in a Buffer
        case 'application/octet-stream':
          name = req.body.toString(); // Convert buffer to a string
          break;
    
        // 'John'
        case 'text/plain':
          name = req.body;
          break;
    
        // 'name=John' in the body of a POST request (not the URL)
        case 'application/x-www-form-urlencoded':
          ({name} = req.body);
          break;
      }
  
    }
});

exports.UserAuthEnableDisable = functions.firestore
.document('VenueProfile/{userid}')
.onUpdate((snapshot, context) => {
  const before = snapshot.before.data();
  const after = snapshot.after.data();
  const userid = context.params.userid;
  /*const userEmail = context.params.userEmail;
  
  console.log(userEmail);*/



  if (before.account_disabled === true && after.account_disabled === false) {  

    firestore.collection("VenueProfile").doc(userid).update({
        Notice: "Please enter VenueName field. Make sure, venue's name same as bracket (Nairobi Jaffery Sports Club) OR (Aga Khan Sports Club). Sample field -> VenueName: 'ABC' "
    });

      admin.auth().updateUser(userid, {
        disabled: false 
      }).then(() => {
        const status = `User having uid:${userid} has been enabled.`;
        console.log(status);
        return status;
      }).catch((error) => {
          return `Error deleting user: ${error}`;
      });
  } else if (before.account_disabled === false && after.account_disabled === true) {
    admin.auth().updateUser(userid, {
      disabled: true 
    }).then(() => {
      const status = `User having uid:${userid} has been disabled.`;
      console.log(status);
      return status;
    }).catch((error) => {
        return `Error deleting user: ${error}`;
      });
  } else {
    "else statement"
  } 
  return `Function executed!`;
});
