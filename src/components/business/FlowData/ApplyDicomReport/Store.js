const members = {};
const URLS = {
    SAVE_VISITING: '/service/business/baseflow'
};
class DoctorPatient {

    list(filter) {
        console.log(filter);
        return $http({
            url: '/service/business/baseflow',
            type: 'GET',
            data: filter
        }).then(data=>{
            data.rows&&data.rows.forEach(item=>{
                if(item.registration){
                    try{
                        item.registration = JSON.parse(item.registration.digest);
                    }catch(e){
                        console.error(e);
                        item.registration = {};
                    }
                }
            });
            console.log(data);
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
    saveVisiting(model) {
        console.log(model);
        return $http({
            url: URLS.SAVE_VISITING,
            type: 'POST',
            data: model,
            json:true
        })
    }
    getCards(flowId){
        return $http({
            url: '/service/business//baseflow/card',
            type: 'GET',
            data:{
                flowId:flowId
            }
        })
    }
}

export default new DoctorPatient();