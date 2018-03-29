const URLS = {
    ALL: '/service/business/relation/hospital/check_category_a',
    CHECK_ITEM:'/service/business/relation/hospital/check_item',
    plat_coin:'/service/business/relation/hospital/work_coin',
    // SAVE: '/service/business/group/member/add2',
    // UPDATE: '/service/business/group/update',
    // REMOVE: '/service/business/group/member/delete',
    // LOAD_DOCTORS: '/service/business/group/member/search',
    // ADD_DOCTORS: '/service/business/group/member/batchAdd',
    // MEMBER_DUTY: '/service/business/group/member/update'
};

export default {
    loadAll(hospitalId) {
        return $http({
            url: URLS.ALL,
            data: {hospitalId:hospitalId}
            // url: URLS.ALL.replace(/\{hospitalId\}/, "607668aec52347b19dc1fd0c90e10827")
            // url: URLS.ALL.replace(/\{hospitalId\}/, hospitalId)
        });
    },
    loadzidian(organizationId) {
        return $http({
            url:  URLS.CHECK_ITEM,
            data: {
                hospitalId:organizationId.hospitalId,
                categoryA:organizationId.organizationId
            }
        }).then(res => {
            var zidian = [];
            res.forEach(item => {
                zidian.push(item);
            })
            // function add(zidian) {
            //     zidian.forEach(item => {
            //         console.log(item);
            //         zidian.push(item);
            //     })
            // }
            // if (res) {
            //     add(res);
            // } else {
            //     // add(res, res.name);
            // }
            // zidian.sort((a, b) => {
            //     return a.item > b.item ? 1 : (a.item < b.item ? -1 : 0);
            // });
            return zidian;
        });
    },
    hospitalplatcoin(hospitalId) {
        return $http({
            url: URLS.plat_coin,
            data: {hospitalId:hospitalId}
        })
    },
    setplatcoin(pustmodel) {
        return $http({
            type: 'POST',
            json: true,
            url: URLS.plat_coin,
            data: pustmodel,
        });
    },
    setitem(model){
        return $http({
            url:  URLS.CHECK_ITEM,
            type: 'POST',
            json: true,
            data: model,
        })
    }
    // remove(model) {
    //     return $http({
    //         url: URLS.REMOVE,
    //         data: model
    //     });
    // },
    // loadDoctors(organizationId) {
    //     return $http({
    //         url: URLS.ALL.replace(/\{organizationId\}/, organizationId)
    //     }).then(res => {
    //         var doctors = [];
    //         function add(office, officeName) {
    //             office && office.members && office.members.forEach(item => {
    //                 if (item.memberCategory == Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL')) {
    //                     item.officeName = officeName;
    //                     doctors.push(item);
    //                 } else {
    //                     add(item.entity, `${officeName} - ${item.entity.name}`);
    //                 }
    //             })
    //         }
    //         if (res.category == Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL')) {
    //             res && res.members && res.members.forEach(item => {
    //                 add(item.entity, item.entity.name);
    //             });
    //         } else {
    //             add(res, res.name);
    //         }
    //         doctors.sort((a, b) => {
    //             return a.officeName > b.officeName ? 1 : (a.officeName < b.officeName ? -1 : 0);
    //         });
    //         return doctors;
    //     });
    // },
    // addDoctors(doctors) {
    //     return $http({
    //         url: URLS.ADD_DOCTORS,
    //         type: 'POST',
    //         json: true,
    //         data: doctors
    //     });
    // },
    // setMemberDuty(member) {
    //     return $http({
    //         url: URLS.MEMBER_DUTY,
    //         type: 'POST',
    //         json: true,
    //         data: member
    //     });
    // }
}