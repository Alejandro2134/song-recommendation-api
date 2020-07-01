const store = require('./store');
const fetch = require('node-fetch');
const objectId = require('mongoose').Types.ObjectId();

const config = require('../../config');

const getAccessToken = (code, error) => {

    return new Promise (async (resolve, reject) => {

        if(error) {
            reject(error);
        } else {
            if(code) {
                const auth = `${config.spotifyPk}:${config.spotifySk}`;
                const buff = Buffer.from(auth);
                const base64data = buff.toString('base64');
    
                let urlencoded = new URLSearchParams();
                urlencoded.append('grant_type', 'authorization_code');
                urlencoded.append('code', code);
                urlencoded.append('redirect_uri', config.spotifyRedirect);
    
                const data = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${base64data}` 
                    },
                    body: urlencoded,
                })
    
                const response = await data.json();
                resolve(response);
            } else {
                resolve();
            }
        }
    })
    
}

const getUser = (spotifyId) => {    
    return new Promise((resolve, reject) => {
        resolve(store.get(spotifyId));
    })
}

const addUser = (accessToken) => {

    return new Promise(async (resolve, reject) => {

        if(!accessToken) {
            console.error('[message controller] no hay token de acceso');
            reject('Los datos son incorrectos');
            return false;
        }

        try {

            const data = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })

            const response = await data.json();

            const userSavedTracksData = await fetch('https://api.spotify.com/v1/me/tracks', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })

            const userSavedTracksDataResponse = await userSavedTracksData.json();

            if(response.error) {
                reject(response.error);
            } else {

                let url = '';

                if(Object.hasOwnProperty(response.images[0], 'url')) {
                    url = response.images[0].url;
                } else {
                    url = 'na';
                }
                
                const user = {
                    spotifyId: response.id,
                    name: response.display_name,
                    image: url,
                    totalPlayed: userSavedTracksDataResponse.total,
                    mood: objectId
                }

                store.add(user);
                resolve(user);
            }

        } catch (e) {
            reject(e);
        }

    })

}

const updateUserTotalPlayed = (spotifyId) => {
    return new Promise((resolve, reject) => {
        
    })
}

module.exports = {
    getAccessToken,
    addUser,
    getUser,
    updateUserTotalPlayed,
}