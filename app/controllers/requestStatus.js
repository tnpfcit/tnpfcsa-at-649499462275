const db = require('../config/db.js');
const sequelize = require('sequelize');

exports.statusRequest = (req,res) =>{
  var customerId = req.body.customerId;
    if(customerId)
    {
         db.sequelize.query("SELECT a.ACKNWLDGE_ID AS \"acknowledgementId\", a.PURPOSE AS \"purpose\", a.DEPOSIT_NUM AS \"depositNumber\", a.STATUS AS \"status\" \
			FROM ACKNOWLEDGEMENT a WHERE a.CUST_ID=:customerId \
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Form 15G&H Submission' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_g b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Address Change' as \"purpose\", null as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_customer b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Nominee Change' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_dep_nominee_detail b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId\
			UNION ALL\
			SELECT b.ACKNWLDGE_ID AS \"acknowledgementId\", 'Bank Details Change' as \"purpose\", b.deposit_no as \"depositNumber\", case when b.authorize_status is null then b.status else initcap(b.authorize_status) end as \"status\"\
			FROM web_portal_ack_master a JOIN web_portal_dep_other_bank b ON a.acknwldge_id = b.acknwldge_id where b.cust_id=:customerId",
         { replacements: {customerId: customerId}, type: sequelize.QueryTypes.SELECT }).then(results=>{
         if(results.length > 0)
                 {
                     return res.status(200).send({"responseCode":"200","response":results});
                 }
        else
                 {
                    return res.status(200).send({"responseCode":"455","message": "status details not found "});
                 }

              }).catch(err => {res.status(500).send({message: err.message});});
    }
    else
    {
      return res.status(422).send({"responseCode":"422","message": "Invalid input parameters. Please check the key value pair in the request body."});
    }
} 
//left join WEB_PORTAL_CUSTOMER wpc on wpam.ACKNWLDGE_ID = wpc.ACKNWLDGE_ID left join WEB_PORTAL_DEP_NOMINEE_DETAIL wpdnd on wpam.ACKNWLDGE_ID = wpdnd.ACKNWLDGE_ID left join WEB_PORTAL_DEP_OTHER_BANK wpdob on wpam.ACKNWLDGE_ID = wpdnd.ACKNWLDGE_ID left join WEB_PORTAL_G wpg on WPAM.ACKNWLDGE_ID = WPG.ACKNWLDGE_ID