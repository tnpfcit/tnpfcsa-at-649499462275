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
		query = "select 'DEP_OPEN' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_OPEN' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING' ) as cnt from dual \
				union all\
				select 'DEP_RENEW' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_RENEW' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING')  as cnt from dual \
				union all\
				select 'DEP_CLOSE' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_CLOSE' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED' \
				and b.authorize_status = 'APPROVAL_PENDING' ) as cnt from dual \
				union all\
				select 'LOAN_OPEN' as purpose, (select count(*) from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose = 'LOAN_OPEN' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING') as cnt from dual\
				UNION ALL\
				select 'LOAN_CLOSE' as purpose, (select count(*) from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose = 'LOAN_CLOSE' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING') as cnt from dual\
				union all\
				select 'SPECIAL_ROI' as purpose, (select  count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'SPECIAL_ROI' AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING') as cnt from dual\
				union all \
				select 'TRANSFER' as purpose, (select  count(*) from approval_master a join transfer_trans b on a.batch_id = b.batch_id and a.trans_dt = b.trans_dt where purpose = 'TRANSFER' AND GM_AUTH_STATUS = 'P'  AND GM_APPROVAL_REQ = 'Y' and  a.status!='DELETED' AND b.authorize_status = 'APPROVAL_PENDING'\
				AND b.TRANS_TYPE = 'DEBIT') as cnt from dual\
				union all\
				select 'ALL TRANSACTIONS' as purpose, (select sum(cnt) from (\
				(select count(*) cnt from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose IN ('DEP_OPEN','DEP_RENEW','DEP_CLOSE','SPECIAL_ROI') AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING' \
				union all\
				select count(*) cnt from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose IN ('LOAN_OPEN' , 'LOAN_CLOSE') AND GM_AUTH_status = 'P' AND GM_APPROVAL_REQ = 'Y' and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING' \
				union all\
				select count(*) cnt from approval_master a join transfer_trans b on a.batch_id = b.batch_id and a.trans_dt = b.trans_dt where\
				purpose = 'TRANSFER' AND GM_AUTH_STATUS = 'P'  AND GM_APPROVAL_REQ = 'Y' and  a.status!='DELETED' AND b.authorize_status = 'APPROVAL_PENDING'  \
				AND b.TRANS_TYPE = 'DEBIT')) t) CNT FROM DUAL";
               } else {
        query = "select 'DEP_OPEN' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_OPEN' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING' ) as cnt from dual \
				union all\
				select 'DEP_RENEW' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_RENEW' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING')  as cnt from dual \
				union all\
				select 'DEP_CLOSE' as purpose, (select count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'DEP_CLOSE' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED' \
				and b.authorize_status = 'APPROVAL_PENDING' ) as cnt from dual \
				union all\
				select 'LOAN_OPEN' as purpose, (select count(*) from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose = 'LOAN_OPEN' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING') as cnt from dual\
				UNION ALL\
				select 'LOAN_CLOSE' as purpose, (select count(*) from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose = 'LOAN_CLOSE' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING') as cnt from dual\
				union all\
				select 'SPECIAL_ROI' as purpose, (select  count(*) from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose = 'SPECIAL_ROI' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING') as cnt from dual\
				union all \
				select 'TRANSFER' as purpose, (select  count(*) from approval_master a join transfer_trans b on a.batch_id = b.batch_id and a.trans_dt = b.trans_dt where purpose = 'TRANSFER' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and  a.status!='DELETED' AND b.authorize_status = 'APPROVAL_PENDING'\
				AND b.TRANS_TYPE = 'DEBIT') as cnt from dual\
				union all\
				select 'ALL TRANSACTIONS' as purpose, (select sum(cnt) from (\
				(select count(*) cnt from approval_master a join DEPOSIT_SUB_ACINFO b \
				on a.act_num = b.deposit_no where purpose IN ('DEP_OPEN','DEP_RENEW','DEP_CLOSE','SPECIAL_ROI') AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.authorize_status = 'APPROVAL_PENDING' \
				union all\
				select count(*) cnt from approval_master a join loans_facility_details b \
				on a.act_num = b.acct_num where purpose IN ('LOAN_OPEN' , 'LOAN_CLOSE') AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and a.status!='DELETED'\
				and b.AUTHORIZE_STATUS_1 = 'APPROVAL_PENDING' \
				union all\
				select count(*) cnt from approval_master a join transfer_trans b on a.batch_id = b.batch_id and a.trans_dt = b.trans_dt where\
				purpose = 'TRANSFER' AND cmd_approval_req='Y' and nvl(gm_auth_status,'P')='A' and cmd_auth_status is null and  a.status!='DELETED' AND b.authorize_status = 'APPROVAL_PENDING'  \
				AND b.TRANS_TYPE = 'DEBIT')) t) CNT FROM DUAL";
    }
    db.sequelize.query(query,
        { type: sequelize.QueryTypes.SELECT }
    ).then(results => {
        return res.status(200).send({ data: results, message: "Success" });
    }).catch(err => { res.status(500).send({ data: null, message: err.message }); });
}
