const fetch = require('node-fetch');

const resourceData = async (userMood, songs, accessToken) => {

    const newUserMood = userMood;

    await Promise.all(

        songs.map(async song => {

            const songId = song.track.id;
    
            const features = await fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}` 
                }
            })
    
            const response = await features.json();
    
            const x = response.valence;
            const y = response.energy;
            
            if((x >= 0 && x < 0.33) && (y > 0.75 && y <= 1))
                newUserMood.angry += 1; 
            else
                if((x >= 0 && x < 0.33) && (y > 0.5 && y <= 0.75))
                    newUserMood.nervous += 1; 
                else
                    if((x >= 0 && x < 0.33) && (y > 0.25 && y <= 0.5))
                        newUserMood.bored += 1; 
                    else
                        if((x >= 0 && x < 0.33) && (y >= 0 && y <= 0.25))
                            newUserMood.sad += 1; 
    
            //---------------------------------------------------------------------------------------
            
            if((x >= 0.33 && x < 0.66) && (y > 0.75 && y <= 1))
                newUserMood.excited += 1; 
            else
                if((x >= 0.33 && x < 0.66) && (y >= 0 && y <= 0.25))
                    newUserMood.sleepy += 1; 
    
            //---------------------------------------------------------------------------------------
    
            if((x >= 0.66 && x <= 1) && (y > 0.75 && y <= 1))
                newUserMood.happy += 1; 
            else
                if((x >= 0.66 && x <= 1) && (y > 0.5 && y <= 0.75))
                    newUserMood.pleased += 1; 
                else
                    if((x >= 0.66 && x <= 1) && (y > 0.25 && y <= 0.5))
                        newUserMood.relaxed += 1; 
                    else
                        if((x >= 0.66 && x <= 1) && (y >= 0 && y <= 0.25))
                            newUserMood.peaceful += 1; 
        })
    )

    return newUserMood;
}

const percentage = () => {

}
 
module.exports = { 
    resourceData,
    percentage
}