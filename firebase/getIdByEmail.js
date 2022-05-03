import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const getIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.collection('Clients').get().then(data => {
            data.docs.map(doc => {
                const d = doc.data();
                if (d.email === email) resolve(doc.id);
            });
        });
    });
}

export default getIdByEmail; 