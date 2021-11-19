var functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkComplete = functions.firestore.document("chatGroups/{docId}")
                            .onWrite((snap, context)=> {
                                const data = snap.data();
                                if (Object.entries(data.splits).values().reduce((a,b)=>a+ b) >= 1) {
                                    if (data.status !== "unconfirmed") {
                                        return snap.ref.set({status: 'unconfirmed'});
                                    }
                                } else {
                                    if (data.status !== "incomplete") {
                                        return snap.ref.set({status: 'unconfirmed'});
                                    }
                                }

                                if (data.status == "unconfirmed") {
                                    if (data.numConfirmed == Object.entries(data.splits).length) {
                                        return snap.ref.set({status: 'confirmed'});
                                    }
                                }
                            });