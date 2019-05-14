var nexPost = (data) => {
    var buildData = buildLeadPost(data);
    //console.log(buildData);
    return buildData;
};

var buildLeadPost = (data) => {
    var leadArray = [
        'First Name', data.fName, 
        'Last Name', data.lName, 
        'Phone', data.phone, 
        'Address1' , data.address, 
        'City', data.city, 
        'State', data.state, 
        'Zip', data.zip
    ];
    
    var leadString = xmlDta('Infocu5');
    leadString += apRecord();
    //now we build the column info
    for(i = 0; i < leadArray.length; i = i + 2){
        leadString += addRecord(leadArray[i], leadArray[i + 1]);
    }
    leadString += enRecord();
    leadString += wrapUp();

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