const functions = require('firebase-functions');
const admin=require("firebase-admin");
admin.initializeApp();
//auth trigger(new user sign up)
exports.newUserSignup=functions.auth.user().onCreate(user=>{
    console.log("user created",user.email,user.uid);
    var date=new Date();
    return admin.firestore().collection("users").doc(user.uid).set({
        startDate: date,
        name: ""
    });
});
//auth trigger(user deleted)
exports.userDeleted=functions.auth.user().onDelete(user=>{
    console.log("user deleted",user.email,user.uid);
    const doc = admin.firestore().collection("users").doc(user.uid);
    return doc.delete();    
});
//http callacle funcs
exports.addTask=functions.https.onCall((data,context)=>{
    //check if user auth
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated',"only auth users can add tasks");
    
    }
    
    return admin.firestore().collection("tasks").add({
        name: data.name,
        length: data.length,
        location: data.location,
        day: data.day,
        user:context.auth.uid
    });
});
//update the days of tasks
exports.updateDay=functions.https.onCall((data,context)=>{
    var task=admin.firestore().collection("tasks").doc(data.id);
    return task.update({
        day:admin.firestore.FieldValue.increment(-1)
    });
});
//update date of user
exports.updateDate=functions.https.onCall((data,context)=>{
    var user=admin.firestore().collection("users").doc(data.id);
    return user.update({
        startDate:new Date()
    });
});
