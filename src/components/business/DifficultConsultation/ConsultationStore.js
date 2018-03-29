const members = {};

class DoctorPatient {
    list(filter) {
        return $http({
            url: '/service/business/baseflow',
            type: 'GET',
            data: filter
        }).then(data=>{
            data.rows&&data.rows.forEach(item=>{
                item.imhasnew = false;
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
    getHospitals(id) {
        return $http({
            url: '/service/business/scenes/partyb',
            type: 'GET',
            data: {
                partybId: id
            }
        })
    }


    // 获取留言板内容
    getOicm(data){
        // return $http({
        //     url: '/service/business/baseflow',
        //     type: 'GET',
        //     data: data
        // }).then(data=>{
        //     data.rows&&data.rows.forEach(item=>{
        //         if(item.registration){
        //             try{
        //                 item.registration = JSON.parse(item.registration.digest);
        //             }catch(e){
        //                 console.error(e);
        //                 item.registration = {};
        //             }
        //         }
        //     });
        //     return data;
        // })
        console.log(data)
        var list = [{
           id:"002",
           name:"张飞",
           content:"大哥，嫂子被关羽抢走了",
           date:1513063111023
        },{
            id:"000",
            name:"刘备",
            content:"卧槽，你哪个嫂子？ 还不给我抢回来",
            date:1513063218023
        },{
            id:"001",
            name:"关羽",
            content:"日，子龙跟你家香香东吴大船上幽会，你都不管！！！你管俄。。。 还有啊， 翼德弟弟~ 你是不是要跟我搞事情啊，你要是想搞事情，那就是你的不对了",
            date:1513063518023
        },{
            id:"003",
            name:"子龙",
            content:" <@_@>|   关我鸟事 ",
            date:1513063918023
        },{
            id:"9c0ee251d62f4f109ba68f8aa105dba7",
            name:"马建华",
            content:" 子龙说得对 ",
            date:1513064470911
        }]
        // if(filter.keyword){
        //     result = users.filter(item=>{
        //         return item.name.indexOf(filter.keyword)>=0;
        //     })
        // }
        // return Promise.resolve().then(()=>{
        //     return list;
        // });
        return Promise.resolve({
			rows: list,
			count: list.length
		})
    }


}

export default new DoctorPatient();