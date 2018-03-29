const members = {};

class DoctorPatient {

    list(filter) {
        console.log(filter);
        // filter.status="";
        // filter.hospitalId="";
        // filter.systemId="";
        return $http({
            url: '/service/business/baseflow',
            type: 'GET',
            data: filter
        }).then(data=>{
            data.rows&&data.rows.forEach(item=>{
                item.flow.extension = JSON.parse(item.flow.extension);
                item.dicomArchivesInfo = item.flow.extension.extension;
                item.dicomArchivesInfo.dicomfileInfo = item.dicomArchivesInfo.dicomfile?JSON.parse(item.dicomArchivesInfo.dicomfile):{};
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
    getHospitals(id) {
        return $http({
            url: '/service/business/scenes/partyb',
            type: 'GET',
            data: {
                partybId: id
            }
        })
    }
}

export default new DoctorPatient();