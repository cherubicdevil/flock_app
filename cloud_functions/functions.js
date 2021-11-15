// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

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