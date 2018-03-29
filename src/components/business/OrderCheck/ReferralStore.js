const URLS = {
    GET_DOCTORS_OWNHOSPITAL: '/service/business/group/tree/{organizationId}'
};
class ReferralStore {
    list(filter) {
        return $http({
            url: '/service/business/baseflow',
            type: 'GET',
            data: filter
        }).then(data=>{
            data.rows&&data.rows.forEach(item=>{
                if(item.registration){
                    try{
                        item.registration = item.registration.digest&&JSON.parse(item.registration.digest);
                    }catch(e){
                        console.error(e);
                        item.registration = {};
                    }
                }
            });
            return data;
        })
    }
    getDate() {
        return $http({
            url: '/service/business/common/time',
            type: 'GET'
        })
    }
    saveExperts(data) {
        return $http({
            url: '/service/business/patient/flow',
            type: 'POST',
            json: true,
            data: data
        })
    }
    getFlowLogs(data) {
        return $http({
            url: '/service/business/flowlog',
            type: 'GET',
            data: data
        })
    }
    redirectFlow(data) {
        return $http({
            url: '/service/business/referralflow/in_redirect',
            type: 'POST',
            data: data
        })
    }
    getConsultList(data) {
        return $http({
            url: '/service/business/patient/flow',
            type: 'GET',
            data: data
        })
    }
    getConsultDetail(data) {
        return $http({
            url: '/service/business/card',
            type: 'GET',
            data: data
        })
    }
    newPatient(data) {
        return $http({
            url: '/service/business/patient/add',
            type: 'POST',
            data: data
        });
    }
    getStore(name) {
        return localStorage.getItem(name);
    }
    save(name, data) {
        return localStorage.setItem(name, data);
    }
    finishClinic(flowId) {
        return $http({
            url: '/service/business/patient/flow/finish',
            type: 'POST',
            data: { flowId: flowId }
        });
    }
    isRegistrationExist(data) {
        return $http({
            url: '/service/business/patient/record/count_un_finish',
            type: 'GET',
            data: data
        });
    }
    newRegistration(data) {
        return $http({
            url: '/service/business/card',
            type: 'POST',
            json: true,
            data: data
        })
    }
    isTriaged(id) {
        return $http({
            url: '/service/business//flow/is_wait_triage',
            type: 'GET',
            data: { patientId: id }
        })
    }
    getOwnHospitalOffices() {
        return $http({
            url: URLS.GET_DOCTORS_OWNHOSPITAL.replace(/\{organizationId\}/, GlobalService.getCurrentUserSync().relation.hospital[0].id)
        }).then(res => {
            var offices = [];
            res.members && res.members.forEach(item => {
                if (item.memberCategory.indexOf(Sunset.Service.Dictionary.alias('ORG_GROUP_CODE', 'DEPT')) == 0) {
                    item.entity.memberId = item.id;
                    offices.push(item.entity);
                }
            });
            return offices;
        });
    }
    getOwnHospitalDoctors(withOutMe) {
        return $http({
            url: URLS.GET_DOCTORS_OWNHOSPITAL.replace(/\{organizationId\}/, GlobalService.getCurrentUserSync().relation.hospital[0].id)
        }).then(res => {
            var doctors = [];
            res.members && res.members.forEach(item => {
                if (item.memberCategory.indexOf(Sunset.Service.Dictionary.alias('ORG_GROUP_CODE', 'DEPT')) == 0) {
                    var officeEntity = item.entity.extension&&JSON.parse(item.entity.extension);
                    item.entity && item.entity.members && item.entity.members.forEach(doctor => {
                        doctor.entity.officeEntity = officeEntity;
                        if (withOutMe && doctor.entity.userId == GlobalService.getCurrentUserSync().user.userId) {
                            return;
                        }
                        doctor.entity.memberId = doctor.id;
                        doctors.push(doctor.entity);
                    });
                }
            });
            return doctors
        });
    }
}

export default new ReferralStore();