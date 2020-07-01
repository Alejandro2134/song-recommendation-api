const fetch = require('node-fetch');

const dataAnalysis = require('../../lib/dataAnalysis');
const store = require('./store');

const getMood = (moodId) => {
    return new Promise((resolve, reject) => {
        resolve(store.get(moodId));
    })
}

const addMood = (moodId, accessToken) => {
    return new Promise (async (resolve, reject) => {

        //Crear el mood en el endpoint de crear usuario

        if(!moodId || !accessToken) {
            console.error('[message controller] Faltan datos');
            reject('Los datos son incorrectos');
            return false;
        }

        let userTracksData = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
            headers: {
                'Authorization': `Bearer ${accessToken}` 
            }
        })

        let { items, next } = await userTracksData.json();

        let userMood = await dataAnalysis.resourceData({
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

                userMood = await dataAnalysis.resourceData(userMood, items, accessToken);
                offset += 50;
        
            } while (next != null)
    
            const mood = {
                _id: moodId,
                angry: userMood.angry,
                nervous: userMood.nervous,
                bored: userMood.bored,
                sad: userMood.sad,
                sleepy: userMood.sleepy,
                peaceful: userMood.peaceful,
                relaxed: userMood.relaxed,
                pleased: userMood.pleased,
                happy: userMood.happy,
                excited: userMood.excited
            }
        
            store.add(mood);
            resolve(mood);

        } else {

            const mood = {
                _id: moodId,
                angry: userMood.angry,
                nervous: userMood.nervous,
                bored: userMood.bored,
                sad: userMood.sad,
                sleepy: userMood.sleepy,
                peaceful: userMood.peaceful,
                relaxed: userMood.relaxed,
                pleased: userMood.pleased,
                happy: userMood.happy,
                excited: userMood.excited
            }
        
            store.add(mood);
            resolve(mood);

        }
    })
}

const updateMood = (moodId, accessToken, userTotalPlayed) => {
    return new Promise (async (resolve, reject) => {

        if(!moodId || !accessToken || !userTotalPlayed) {
            console.error('[message controller] Faltan datos');
            reject('Los datos son incorrectos');
            return false;
        }

        try {

            const data = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })
    
            const dataResponse = await data.json();
    
            const mood = await fetch(`http://localhost:3000/mood/${moodId}`);
            const moodResponse = await mood.json();
    
            const newUserMood = dataAnalysis.resourceData(moodResponse.body, dataResponse.items, accessToken);
            resolve(newUserMood);

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