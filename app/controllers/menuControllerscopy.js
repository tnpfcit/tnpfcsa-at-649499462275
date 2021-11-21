var config = require('../config/config.json');
const db = require('../config/db.js');
const enums = require('../helpers/enums');
const sequelize = require('sequelize');

exports.getMenu = (req, res) => {
    var roleId = req.body.roleId;    
    if (roleId == null) {
        return res.status(400).send({ data: null, message: "roleId should not be null" });
    }
    console.log(roleId);
    // get data from DB.
    var query = "";
    if (roleId == enums.RolesEnum.GM) {
        query = "select 'DEP_OPEN' as purpose, (select count(*) from approval_master where purpose = 'DEP_OPEN' AND GM_AUTH_status = 'P') AS CNT FROM DUAL \
                union all \
				select 'DEP_RENEW' as purpose, (select count(*) from approval_master where purpose = 'DEP_RENEW' AND GM_AUTH_status = 'P') AS CNT FROM DUAL\
				union all \
				select 'DEP_CLOSE' as purpose, (select count(*) from approval_master where purpose = 'DEP_CLOSE' AND GM_AUTH_status = 'P') AS CNT FROM DUAL \
				union all \
				select 'LOAN_OPEN' as purpose, (select count(*) from approval_master where purpose = 'LOAN_OPEN' AND GM_AUTH_status = 'P') AS CNT FROM DUAL \
				union all \
				select 'SPECIAL_ROI' as purpose, (select count(*) from approval_master where purpose = 'SPECIAL_ROI' AND GM_AUTH_status = 'P') AS CNT FROM DUAL\
				union all \
				select 'All_TRANSACTIONS' as purpose, (select count(*) from approval_master where GM_AUTH_status = 'P') AS CNT FROM DUAL"
    } else {
		
		query = "SELECT 'DEP_OPEN', (select count(*) from approval_master where purpose = 'DEP_OPEN' AND cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is null) AS CNT FROM DUAL\
				union all\
				SELECT 'DEP_RENEW', (select count(*) from approval_master where purpose = 'DEP_RENEW' AND cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is nulL) AS CNT FROM DUAL\
				union all\
				SELECT 'DEP_CLOSE', (select count(*) from approval_master where purpose = 'DEP_CLOSE' AND cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is nulL) AS CNT FROM DUAL\
				union all\
				SELECT 'LOAN_OPEN', (select count(*) from approval_master where purpose = 'LOAN_OPEN' AND cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is nulL) AS CNT FROM DUAL\
				union all\
				SELECT 'SPECIAL_ROI', (select count(*) from approval_master where purpose = 'SPECIAL_ROI' AND cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is nulL) AS CNT FROM DUAL\
				union all\
				SELECT 'All_TRANSACTIONS', (select count(*) from approval_master where cmd_approval_req='Y' and gm_auth_status='A' and cmd_auth_status is nulL) AS CNT FROM DUAL"
    }
    db.sequelize.query(query,
        { type: sequelize.QueryTypes.SELECT }
    ).then(results => {
        return res.status(200).send({ data: results, message: "Success" });
    }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
}
