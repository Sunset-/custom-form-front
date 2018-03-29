class ConsultationStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    URLS = {
        LIST: '/service/business/v2.1/agency',
        SAVE: '/service/business/v2.1/agency'
    }

    callbacks = {
        beforeSave(params) {
            params.json = true;
            return params;
        }
    }
    getDate(){
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/common/time',
                type: 'GET'
            })
        })
    }
    saveExperts(data){
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/flow',
                type:'POST',
                json:true,
                data: data
            })
        })
    }
    getTeams(data){
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/relation/hospital/team',
                type: 'GET',
                data: data
            })
        })
    }
    getAllTeams(data){
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/expert_team',
                type: 'GET',
                data: data
            })
        })
    }
    getTeamMembers(id){
        return Promise.resolve().then(()=>{
            return $http({
                url: `/service/business/expert_team/${id}`,
                type: 'GET'
            })
        })
    }
    doctorInFlow(id){
        return Promise.resolve().then(()=>{
            return $http({
                url: '/service/business/flow/processing_experts',
                type: 'GET',
                data:{
                    patientId:id
                }
            })
        })
    }
    submitConsultation(data){
        return $http({
            url: '/service/business/baseflow',
            type: 'POST',
            json:true,
            data:data
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

export default new ConsultationStore();