
//library for storing and editing data
const fs = require('fs');
const path = require('path');


//container for the module
let lib = {};

//define the base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

//write data to file
lib.create = function(dir, filename, data, callback){
    //open the file for writing
    fs.open(`${lib.baseDir}${dir}/.json`, 'wx', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            //convert to string and write to file
            let stringData = JSON.stringify(data);

            //write to the file and close
            fs.writeFile(fileDescriptor, stringData, (err)=>{
                if(!err ){
                    fs.close(fileDescriptor, (err)=>{
                        if(!err){
                            callback(false);
                        }else{
                            callback('err closing file');
                        }
                    })
                }else{
                    callback('error writing to new file');
                }
            })
        }else{
            callback('Could not create new file, it may already exist');
        }
    })
}


//read data from a file
lib.read = function(dir, file, callback){
    console.log('readfile')
    console.log(`${lib.baseDir}${dir}/${file}.json`)
    fs.readFileSync(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data)=>{
        callback(err, data);
    })
}


//update data inside a file
lib.update = function(dir, file, data, callback){
    conosle.log('updatefile');

    //open the file for writing
    fs.open(`${lib.baseDir}${dir}/.json`, 'r+', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            let stringData = JSON.stringify(data);

            //truncate contest of file
            fs.truncate(fileDescriptor, (err)=>{
                if(!err){
                    //write to file and close it
                    fs.writeFile(fileDescriptor, stringData ,(err)=>{
                     if(!err){
                         fs.close(fileDescriptor, (err)=>{
                            if(!err){
                                callback(false)
                            }else{
                                callback('error closing file');
                            }
                         })
                     }else{
                         callback('error')
                     }
                    })
                }else{
                    callback(err);
                }
            })
        }else{
            callback('could not open the file for updating')
        }
    })
}





module.exports = lib;