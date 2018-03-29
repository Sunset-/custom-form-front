class TriageCenterStore {
    list(filter) {
           return $http({
                url: '/service/business/flow',
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
            return data;
        })
    }
    getFlow(filter) {
        return $http({
            url: `/service/business/flow/${filter}`,
            type: 'GET'
        });
    }
    getHospitalList(data){
        return $http({
            url:'/service/business/v2.1/hospital',
            type:'GET',
            data:data
        })
    }
    saveExperts(data){
        return $http({
            url: '/service/business/flow/triage',
            type:'POST',
            data: data
        })
    }
    getFlow(filter) {
        return $http({
            url: `/service/business/flow/${filter}`,
            type: 'GET'
        });
    }
}

export default new TriageCenterStore();