import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();

const getMissions = (missionId) => {
    return new Promise((resolve, reject) => {
        let missions = [];
        if (!missionId) {
            db.collection('Missions').get().then(data => {
                data.docs.map(doc => {
                    missions.push(doc.data());
                });
                resolve(missions);
            });
        } else {
            db.collection('Missions').doc(missionId.toString()).get().then(doc => {
                resolve(doc.data());
            });
        }
    });
}

export default getMissions;