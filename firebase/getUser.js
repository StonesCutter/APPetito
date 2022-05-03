import * as firebase from 'firebase';
const db = firebase.firestore();

//CHANGED WITH ID INSTEAD EMAIL
const getUser = (id) => {
    return new Promise((resolve, reject) => {
        db.collection('Clients').doc(id).get().then(user => {
                resolve(user.data());
        })
    });
}

export default getUser;