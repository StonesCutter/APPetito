import {InteractionManager} from 'react-native';
 
 
export default class ThreadHelper {
 
    /**
     * Viene risolta la promise non appena il prossimo frame è disponibile
     */
    nextFrame() {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                resolve();
            });
        })
    }
 
    /**
     * Invece di andare a riempire la coda del thread JS cerchiamo di non sovracaricarlo eseguendo la callback dopo le interactions, dunque quando l'Animation Frame ha fatto il suo dovere
     * @param {function} callback - codice da eseguire quando il JS thread è libero
     */
    runWhenThreadIsReady(callback) {
        InteractionManager.runAfterInteractions(async () => {
            await this.nextFrame();
            callback();
        });
    }
}