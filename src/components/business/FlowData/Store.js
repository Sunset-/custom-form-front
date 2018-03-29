const URLS = {
    SUBMIT_FLOW: '/service/business/baseflow',
    GET_FLOW_BY_ID: '/service/business/baseflow/{id}',
    GET_FLOWS_BY_PATIENT: '/service/business/baseflow/list',
    GET_DOCTORS_OWNHOSPITAL: '/service/business/group/tree/{organizationId}'
};


export default {
    submitFlow(data) {
        return $http({
            url: URLS.SUBMIT_FLOW,
            type: 'POST',
            json: true,
            data: data
        });
    },
    getFlowById(id) {
        return $http({
            url: URLS.GET_FLOW_BY_ID.replace(/\{id\}/, id)
        }).then(res => {
            GlobalService.RefreshFlowHasNew();
            try {
                res.extension = res.extension ? JSON.parse(res.extension) : {}
            } catch (e) {
                console.error(e);
            }
            return res;
        });
    },
    getFlowsByPatientId(patientId) {
        return $http({
            url: URLS.GET_FLOWS_BY_PATIENT,
            data: {
                patientId,
                pageNumber: 0,
                pageSize: 999
            }
        }).then(res => {
            return res && res.rows.map(item => {
                try {
                    item.flow.extension = item.flow.extension ? JSON.parse(item.flow.extension) : {}
                } catch (e) {

                }
                return item;
            }) || [];
        });
    },
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
    },
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