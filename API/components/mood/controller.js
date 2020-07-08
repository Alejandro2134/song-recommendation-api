const fetch = require('node-fetch');

const { resourceData } = require('../../lib/dataAnalysis');
const store = require('./store');

const getMood = (moodId) => {
    return new Promise((resolve, reject) => {
        resolve(store.get(moodId));
    })
}

const addMood = (moodId, accessToken) => {
    return new Promise (async (resolve, reject) => {

        if(!moodId || !accessToken) {
            console.error('[message controller] Faltan datos');
            reject('Los datos son incorrectos');
            return false;
        }

        try {

            let userTracksData = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })

            let { items, next } = await userTracksData.json();

            let userMood = await resourceData({
                angry: 0,
                nervous: 0,
                bored: 0,
                sad: 0,
                sleepy: 0,
                peaceful: 0,
                relaxed: 0,
                pleased: 0,
                happy: 0,
                excited: 0
            }, items, accessToken);

            userMood._id = moodId;

            if(next != null) {

                do {

                    userTracksData = await fetch(`${next}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}` 
                        }
                    })

                    const data = await userTracksData.json();

                    items = data.items;
                    next = data.next;

                    userMood = await resourceData(userMood, items, accessToken);
            
                } while (next != null)
         
                store.add(userMood);
                resolve(userMood);

            } else {

                store.add(userMood);
                resolve(userMood);

            }

        } catch (err) {
            reject(err);
        }
    })
}

const updateMood = (accessToken, userId) => {
    return new Promise (async (resolve, reject) => {

        if(!accessToken || !userId) {
            console.error('[message controller] Faltan datos');
            reject('Los datos son incorrectos');
            return false;
        }

        try {

            const userData = await fetch(`http://localhost:3000/user/${userId}`);
            const { totalPlayed, mood } = await userData.json();

            let spotifyData = await fetch(`https://api.spotify.com/v1/me/tracks?offset=${totalPlayed}&limit=50`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })
    
            let { items, total, next } = await spotifyData.json();

            if(total !== totalPlayed) {

                if(total > totalPlayed) {

                    let userMoodUpdated = await resourceData(mood, items, accessToken);

                    if(next != null) {

                        do {

                            spotifyData = await fetch(`${next}`, {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}` 
                                }
                            })

                            const data = await spotifyData.json();

                            items = data.items;
                            next = data.next;

                            userMoodUpdated = await resourceData(userMoodUpdated, items, accessToken);

                        } while (next != null)

                        resolve(userMoodUpdated);

                    } else {
                        resolve(userMoodUpdated);
                    }

                } else {

                    //Falta actualizar si se quitan canciones de la libreria
                    //Probar que el offset empieza desde las nuevas canciones  
                }

            } else {
                reject('No hay datos que actualizar');
            }
    
        } catch (err) {
            reject(err);
        }

    })
}

module.exports = {
    addMood,
    updateMood,
    getMood
}