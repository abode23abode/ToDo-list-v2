
exports.getDate=function (){
 
const todya=new Date();

const options={
weekday:"long",
day:"numeric",
month:"long"
};
 
return todya.toLocaleDateString("en-US" ,options);

 }
exports.getDay=function () {

 
    const todya=new Date();
    
    const options={
    weekday:"long",
    };
     
    
    return todya.toLocaleDateString("en-US" ,options);
     }
