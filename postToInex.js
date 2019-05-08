var nexPost = (data) => {
    console.log(buildLeadPost(data));
};

var buildLeadPost = (data) => {
    var leadArray = ['First Name', data.fName, 'Last Name', data.lName, 
    'Address1' , data.address, 'City', data.city, 'State', data.state, 'Zip', data.zip];
    console.log('We are here');
    
    var leadString = xmlDta('1Outbound');
    leadString += apRecord();
    //now we build the column info
    for(i = 0; i < leadArray.length; i = i + 2){
        leadString += addRecord(leadArray[i], leadArray[i + 1]);
    }
    leadString += enRecord();
    leadString += wrapUp();

    console.log('Done');
    return leadString;
};

var xmlDta = (campaignName) => {
    return 'xmlData=<Records LeadName="' + campaignName + '">';
}
var apRecord = () => {
    return '<Record>';
}
var enRecord = () => {
    return '</Record>';
}
var addRecord = (columnName, gValue) => {
    return '<Column Name="' + columnName + '" Value="' + gValue + '"/>';
}
var wrapUp = (data) => {
    return '</Records>';
}



module.exports = {
    nexPost,
    buildLeadPost
};