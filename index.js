const HttpService = require('./httpservice');
const jsonfile = require('jsonfile');
const _ = require('lodash');

const path  = 'https://apidata.mos.ru/v1/features/';
const argv = require('optimist').argv;

let resourceId = argv.resourceId;
const apiKey = argv.apiKey;

if (!resourceId || !apiKey){
    console.error('resourceId and apiKey should be specified!');
    process.exit();
}

resourceId = parseInt(resourceId)
if (!resourceId){
    console.error('resourceId should be integer!');
    process.exit();
}

const queryParams = {};
if (apiKey){
    queryParams.api_key = apiKey;
}

const service = new HttpService(path, null);

service.getAndReturnJsonPromise(resourceId, queryParams)
.then( result => {
    
    result.features.forEach((f) => {
        f.properties = f.properties.Attributes;
        const arrToDel = [];
        Object.keys(f.properties ).forEach(function (key) {
            let obj = f.properties[key];
            if (_.isArray(obj)){
                obj.forEach( (sub, index) => {
                    if (_.isPlainObject(sub)){
                        Object.keys(sub).forEach( subKey =>{
                            f.properties[key+subKey+index] = sub[subKey];
                        });
                    }
                });
                arrToDel.push(key);
            }
        });
        arrToDel.forEach(k => { delete f.properties[k]; });
    });
    const filename = `${resourceId}.json`;
    jsonfile.writeFile(filename, result, {spaces: 2}, function(err) {
        if (err){
            console.error(err.message);
        }
        else{
            console.log(`File ${filename} created.`);
        }
        process.exit(); 
    });
})
.catch( e => { 
    console.log(e.message); 
    process.exit();
});
