class CloudClinicStore {
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
    getRelationHospital(data){
        return $http({
            url:'/service/business/relation/user/hospital',
            type:'GET',
            data:data
        })
    }
    receiveClinic(data){
        return $http({
            url:'/service/business/flow/receive',
            type:'GET',
            data:data
        })
    }
}

export default new CloudClinicStore();