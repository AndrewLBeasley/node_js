//create an export configuration variables

//create container for all the environments

let environments = 
{

};

//create staging object and set to default env
environments.staging = 
{
    'httpPort':3000,
    'httpsPort':3001,
    'envName':'staging'
}

//create production object
environments.production = 
{
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production'
};

//determine which environment should be exported
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string'?
    process.env.NODE_ENV.toLocaleLowerCase()
    :'';

//check that the current environment is a listed environment
var environmentToExport = typeof(environments[currentEnvironment]) == 'object'?
    environments[currentEnvironment]
    :environments.staging;

//export the module
module.exports = environmentToExport;