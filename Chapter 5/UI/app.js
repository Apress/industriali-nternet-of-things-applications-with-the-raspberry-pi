const Vue = require ('vue/dist/vue.common.js');
const child_process = require ('child_process');
const fs = require ('fs-extra');
const axios = require ('axios');
const path = require ('path');
const Gpio = require ('onoff').Gpio;
const GoogleSpreadsheet = require('google-spreadsheet');

const azureHeader = {'Content-Type': 'application/octet-stream',
 'Ocp-Apim-Subscription-Key': '414574517b91467ea8e565ea19720650'};
const azureURL = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=gender';
const credentials = require ('./credentials.json');
const doc = new GoogleSpreadsheet('1feF70BVZ5TyOIiJ34fOytZ7Yc4LT42pYSgCfqF4nWBw');
const sensor = new Gpio (17, 'in', 'rising');

let pictures = {};

let app = new Vue ({
    el: '#app',
    data(){
        return {
              image:''
        };
    },
  async created() {
    doc.useServiceAccountAuth(credentials, ()=>{
        let getPictures = ()=>{
            doc.getRows(1, async (err, rows)=>{
                console.log (err);
                if (!err){
                    for (let row of rows){
                        try{
                            let response = await axios.get(row.url, {responseType: 'arraybuffer'});
                            pictures[row.category] = Buffer.from (response.data).toString('base64');
                        }
                        catch (err){
                            console.log (err);
                        }
                    }
                    this.image = pictures.male;
                }
            });
            setInterval (getPictures, 60000);
        };
        getPictures();
    }); 
    start = Date.now();
    sensor.watch (async (err, value)=>{
        if (!err && (Date.now()-start)/1000 > 10){
            start = Date.now();
            try{
                let command = 'raspistill -o /home/pi/image';
                await child_process.exec (command);
                let imageBuffer = await fs.readFile ('/home/pi/image');
                let result = await axios.post (azureURL, imageBuffer, {headers:azureHeader}); 
                if (result.data.length > 0 && result.data[0].faceAttributes.gender){
                    this.image = pictures[result.data[0].faceAttributes.gender];
                }
            }
            catch(err){
                console.log (err);
            }
        }
    });
  }
});