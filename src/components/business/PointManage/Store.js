const URLS = {
    INTERGRALALL: '/service/business/workcoin/users',
    USERSTATMENT:"/service/business/workcoin/user/detail",
    submitintegralFlow:"/service/business//workcoin/exchange",//积分兑换
    GETTLE:"/service/business/workcoin/hospital/last_report",//获取报表时间
    SETTLE:"/service/business/workcoin/settle",//生成结算报表
    userjiesuanreport:"/service/business/workcoin/user/reports",//获取 积分列表

    TLEMENT:"/service/business/workcoin/hospital/reports",
    TLEMENTDETAIL:"/service/business/workcoin/hospital/reports/detail",
    export:"/service/business/workcoin/hospital/report/export",//结算报表导出
    multi_users:"/service/business/workcoin/exchange/multi_users",// 结算报表 => 兑换   /exchange/multi_users
    // SAVE: '/service/business/group/add',
    // UPDATE: '/service/business/group/update',
    // REMOVE: '/service/business/group/member/delete/{memberId}',

    statistics:"/service/business/workcoin/user/statistics"
};

class DoctorPatient {
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
        var list = [{
            createTime:1520930095000,
            endDay:"20180201",
            exchangeTime:1520991554000,
            hospitalId:"e8f4c555680a4180aae4d01d0f9f777a",
            isExchanged:true,
            operationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            operator:{name: "白医生_勿动"},
            settleOperationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            settlementReportId:"6842ae34269911e8b408000c2907c7bb",
            stagedAmount:320,
            startDay:"20180102",
            user:{name: "赵苗苗", mobilePhone: null, hospital: "北京市隆福医院"},
            userId:"03884f4567824acf97d250911be5a252",
        },{
            createTime:1520930095000,
            endDay:"20180201",
            exchangeTime:1520991554000,
            hospitalId:"e8f4c555680a4180aae4d01d0f9f777a",
            isExchanged:false,
            operationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            operator:{name: "白医生_勿动"},
            settleOperationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            settlementReportId:"6842ae34269911e8b408000c2907c7bb",
            stagedAmount:320,
            startDay:"20180102",
            user:{name: "赵苗苗", mobilePhone: null, hospital: "北京市隆福医院"},
            userId:"03884f4567824acf97d250911be5a252",
        },{
            createTime:1520930095000,
            endDay:"20180201",
            exchangeTime:1520991554000,
            hospitalId:"e8f4c555680a4180aae4d01d0f9f777a",
            isExchanged:false,
            operationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            operator:{name: "白医生_勿动"},
            settleOperationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            settlementReportId:"6842ae34269911e8b408000c2907c7bb",
            stagedAmount:0,
            startDay:"20180102",
            user:{name: "赵苗苗", mobilePhone: null, hospital: "北京市隆福医院"},
            userId:"03884f4567824acf97d250911be5a252",
        },{
            createTime:1520930095000,
            endDay:"20180201",
            exchangeTime:1520991554000,
            hospitalId:"e8f4c555680a4180aae4d01d0f9f777a",
            isExchanged:true,
            operationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            operator:{name: "白医生_勿动"},
            settleOperationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            settlementReportId:"6842ae34269911e8b408000c2907c7bb",
            stagedAmount:0,
            startDay:"20180102",
            user:{name: "赵苗苗", mobilePhone: null, hospital: "北京市隆福医院"},
            userId:"03884f4567824acf97d250911be5a252",
        },{
            createTime:1520930095000,
            endDay:"20180201",
            exchangeTime:1520991554000,
            hospitalId:"e8f4c555680a4180aae4d01d0f9f777a",
            isExchanged:false,
            operationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            operator:{name: "白医生_勿动"},
            settleOperationUserId:"336ff549dc73430b826b6c1c2363e3a3",
            settlementReportId:"6842ae34269911e8b408000c2907c7bb",
            stagedAmount:512,
            startDay:"20180102",
            user:{name: "aa2", mobilePhone: null, hospital: "北京市隆福医院"},
            userId:"03884f4567824acf97d250911be5a252",
        }]
        // if(filter.keyword){
        //     result = users.filter(item=>{
        //         return item.name.indexOf(filter.keyword)>=0;
        //     })
        // }
        // return Promise.resolve().then(()=>{
        //     return list;
        // });
        // return Promise.resolve({
		// 	rows: list,
		// 	count: list.length
        // })
        return Promise.resolve({
			rows: list,
			totalCount: list.length
		})
    };

    // 字典管理
    // loadHospital(filter) {
    //     // filter = filter || {};
    //     // filter.category = Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL');
    //     // filter.pageNumber = 0;
    //     // filter.pageSize = 999;
    //     return $http({
    //         url: URLS.LOAD_HOSPITAL,
    //         data: filter
    //     }).then(res => {
    //         console.log(res);
    //         return (res && res.rows || []).map(item => {
    //             item.extension = item.extension ? JSON.parse(item.extension) : {};
    //             return item;
    //         });
    //     })
    // };
    // saveHospital(model) {
    //     return $http({
    //         url: model.id ? URLS.UPDATE_HOSPITAL : URLS.SAVE_HOSPITAL,
    //         type: 'POST',
    //         json: true,
    //         data: model
    //     })
    // };
    // relativeDoctor(model) {
    //     return $http({
    //         url: URLS.RELATIVE_DOCTOR,
    //         type: 'POST',
    //         json: true,
    //         data: model
    //     })
    // };

    // 积分结算相关
    getintegralmain(filter) {
        return $http({
            url:  URLS.INTERGRALALL,
            data:filter
        }).then(res => {
            return res;
        });
    };
    getuserstatement(sdata){
        return $http({
            url:  URLS.USERSTATMENT,
            data:sdata
        }).then(res => {
            return res;
        });
    }
    submitintegralFlow(data){
        return $http({
            url: URLS.submitintegralFlow,
            type: 'POST',
            data: data
        })
    }
    lastreport(data){
        return $http({
            url:  URLS.GETTLE,
            data:data
        }).then(res => {
            return res;
        });
    }
    SETTLE(data){
        return $http({
            url: URLS.SETTLE,
            type: 'POST',
            data: data
        })
    }
    GETlistarr(data){
        return $http({
            url:  URLS.userjiesuanreport,
            data:data
        }).then(res => {
            return res;
        });
    }
    // 结算报表相关
    TLEMENT(data){
        return $http({
            url:  URLS.TLEMENT,
            data:data
        })
    }
    TLEMENTDETAIL(data){
        return $http({
            url:  URLS.TLEMENTDETAIL,
            data:data
        })
    }
    export(id){
        return $http({
            url:  URLS.export,
            data:id,
        })
    }
    multiusers(data){
        return $http({
            url: URLS.multi_users,
            type: 'POST',
            data: data
        })
    }
    // 统计报表相关
    statistics(filter) {
        return $http({
            url:  URLS.statistics,
            data:filter
        }).then(res => {
            return res;
        });
    };
}

export default new DoctorPatient();