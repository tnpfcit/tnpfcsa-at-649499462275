module.exports = function(app) {
	   
    const lookuplist = require('../controllers/lookupMasters.js');
    
    //relationships 
    app.post('/tnpfc/v1/getRelationshipList', lookuplist.relationship);
	
	//addressproofdoclist
    app.post('/tnpfc/v1/getAddressProofDocList', lookuplist.addressProofDocList);
	
	//constitutionsList
    app.post('/tnpfc/v1/getCorporateConstitutions', lookuplist.corporates);
	
	//non individual adress proof
    app.post('/tnpfc/v1/getNonIndividualAddressProof', lookuplist.nonindividualAdrProof);
	
	//customer Title
    app.get('/tnpfc/v1/title', lookuplist.title);

    //customer occupation
    app.get('/tnpfc/v1/primaryOccupation', lookuplist.occupation);
    
}