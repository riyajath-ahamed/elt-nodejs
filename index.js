const fs = require('fs');
const csvParser = require('csv-parser');

const csvDataSet =  './DataSet/data.csv';
const jsonOutputFile = './DataSet/transformedData.json';
require('dotenv').config();

const extractData = (csvDataSet) => {
    return new Promise((resolve, reject) => {
        const data = [] ;

        fs.createReadStream(csvDataSet)
            .pipe(csvParser())
            .on('data', (item) => {
                data.push(item);
            })
            .on('end', () => {
                resolve(data);
            })
    })
}

const transformData = (csvDataSet) => {
    return csvDataSet.map((items) => ({
        timeStamp: Date.now(),
        id: items.id.trim(),
        firstName: items.first_name.trim(),
        lastName: items.last_name.trim(),
    }))
}

const saveToJsonFile = (data, filePath) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

extractData(csvDataSet)
.then((rawdata) => {
    const transformedData = transformData(rawdata);
    return saveToJsonFile(transformedData, jsonOutputFile);
})
    .then(() => {
        console.log('Data successfully transformed and saved to JSON file.');
    })
    .catch((error) => {
        console.error('Error processing the data:', error);
    });