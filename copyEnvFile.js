/**
 * Generate a `.env.production` file depending on the value from TARGET_ENV environment variable
 */
 const fs = require('fs');

 /**
  * @description copies the given `.env.base.${TARGET_ENV}` file to a `.env.production` file.
  */
 
 const env = {
    prod: 'prod',
    dev: 'dev',
 };
 
 function copyEnvFile() {
   const target = env[process.env.TARGET_ENV] || env.dev;
   const dotenvPath = process.cwd() + `/.env.base.${target}`;
   const fileStats = fs.statSync(dotenvPath);
 
   if (!fileStats.isFile()) {
     console.error(`[copyEnvFile] ${dotenvPath} is not a valid file`);
   }
 
   const prodDotEnv = '.env.production';
   try {
     fs.copyFileSync(dotenvPath, `${process.cwd()}/${prodDotEnv}`);
     console.log(`${prodDotEnv} successfully copied with TARGET_ENV=${target}`);
   } catch (error) {
     console.error(
       `[copyEnvFile] there was an error copying ${prodDotEnv} file`
     );
     console.error(error);
   }
   return;
 }
 
 copyEnvFile();