//权限标识
let permissions = {
    ADD: '新增',
    MODIFY: '修改',
    DELETE: '删除'
};

import Major from './components/layout/Major';
import './components/business/index';

//患者管理
import Dashboard from './components/business/Dashboard/Dashboard.vue';

//患者管理
import DoctorOutpatient from './components/business/DoctorOutpatient/DoctorOutpatient.vue';
import CurrentDept from './components/business/DoctorOutpatient/CurrentDept.vue';
import CurrentHospital from './components/business/DoctorOutpatient/CurrentHospital.vue';
import MyCreation from './components/business/DoctorOutpatient/MyCreation.vue';
import MyJoin from './components/business/DoctorOutpatient/MyJoin.vue';
import PatientReferral from './components/business/DoctorOutpatient/Referral.vue';
import ReportDetail from './components/business/MedicalData/TangWangReport/ReportDetail.vue';

//疑难会诊
import DifficultConsultation from './components/business/DifficultConsultation/DifficultConsultation.vue';
import MyTask from './components/business/DifficultConsultation/MyTask.vue';
import ConsultList from './components/business/DifficultConsultation/ConsultList.vue';

//转诊
import Referral from './components/business/Referral/Referral.vue';
import TransferOut from './components/business/Referral/TransferOut.vue';
import TransferIn from './components/business/Referral/TransferIn.vue';
import ServiceCentre from './components/business/Referral/ServiceCentre.vue';

//检查
import OrderCheck from './components/business/OrderCheck/OrderCheck.vue';
import InCheck from './components/business/OrderCheck/InCheck.vue';
import OutCheck from './components/business/OrderCheck/OutCheck.vue';

//导诊台
import Helpdesk from './components/business/Helpdesk/Helpdesk.vue';

//转诊统计
import ReferralStatistics from './components/business/ReferralStatistics/index.vue';
import ReferralStatisticsIn from './components/business/ReferralStatistics/in.vue';
import ReferralStatisticsOut from './components/business/ReferralStatistics/out.vue';

//眼科筛查
import EyeScreen from './components/business/EyeScreen/EyeScreen.vue';
import EyeScreenDetail from './components/business/EyeScreen/EyeScreenDetail.vue';
import EyeScreenPtientDetail from './components/business/EyeScreen/EyeScreenPtientDetail.vue';

//筛查活动
import ScreenActivity from './components/business/ScreenActivity/ScreenActivity.vue';
import ScreenActivityDetail from './components/business/ScreenActivity/ScreenActivityDetail.vue';

//筛查结果
import Screening from './components/business/Screening/Screening.vue';
import ScreeningDetail from './components/business/Screening/ScreeningDetail.vue';
import ScreeningList from './components/business/Screening/ScreeningList.vue';

//检查中心
import DicomCenter from './components/business/HospitalDicomCenter/DicomCenter.vue';
import EyesImageCenter from './components/business/HospitalEyesImageCenter/EyesImageCenter.vue';

//医院管理
import Hospital from './components/business/Hospital/Hospital.vue';
//医生管理
import Doctor from './components/business/Doctor/Doctor.vue';
//医生团队管理
import DoctorTeam from './components/business/DoctorTeam/DoctorTeam.vue';
//医助管理
import Assistant from './components/business/Assistant/Assistant.vue';
//分诊管理
import Triage from './components/business/Triage/Triage.vue';
//医疗圈
import MedicalCircle from './components/business/MedicalCircle/MedicalCircle.vue';


//分诊中心
import TriageCenter from './components/business/TriageCenter/TriageCenter.vue';
import TriageDetail from './components/business/TriageCenter/TriageDetail.vue';

//云诊所
import CloudClinic from './components/business/CloudClinic/CloudClinic.vue';

//视频问诊
import VideoClinicHospital from './components/business/VideoClinicHospital/Index.vue';
import VideoClinicDoctor from './components/business/VideoClinicDoctor/Index.vue';

//经典案例
// import ClassicCase from './components/business/Classiccase/ClassicCase.vue';
// import CaseView from './components/business/Classiccase/CaseView.vue';

//Demo
import Demo from './components/business/Demo/Demo.vue';
import DemoDetail from './components/business/Demo/Detail.vue';

//远程阅片
import TestDemo from './components/business/TestDemo/TestDemo.vue';
// import RemoteReport from './components/business/RemoteReport/DicomReportView.vue';
import RemoteReport from './components/business/RemoteReport/DicomReportMain.vue';
import RemoteDetail from './components/business/FlowData/ApplyDicomReport/RemoteDetail.vue';
import MyTaskreport from './components/business/RemoteReport/MyTask.vue';
import MyConsulting from './components/business/RemoteReport/MyConsulting.vue';

// 积分管理
import PointManage from './components/business/PointManage/PointManageMain.vue';
import integral from './components/business/PointManage/integral.vue';
import Statistics from './components/business/PointManage/Statistics.vue';
import Settlement from './components/business/PointManage/Settlement.vue';
import seeintegral from './components/business/PointManage/seeintegral.vue';
import seetlement from './components/business/PointManage/seetlement.vue';
import seeStatistics from './components/business/PointManage/seeStatistics.vue';

// 积分管理
import VideoConsultation from './components/business/VideoConsultation/index.vue';

var moduleMap = {
    DicomCenter: {
        name: 'DicomCenter',
        title: 'DICOM检查',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: DicomCenter
    },
    EyesImageCenter: {
        name: 'EyesImageCenter',
        title: '眼科图像检查',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: EyesImageCenter
    },
    CloudClinic: {
        name: 'CloudClinic',
        title: '云诊所',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: CloudClinic,
        subRoutes: {
            '/patient/:patientId/:flowId': {
                component: CloudClinic
            }
        }
    },
    TriageCenter: {
        name: 'TriageCenter',
        title: '分诊中心',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: TriageCenter,
        subRoutes: {
            '/patient/:patientId/:flowId': {
                component: TriageDetail
            }
        }
    },
    Dashboard : {
        title: '主页',
        name: 'Dashboard',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Dashboard
    },
    DoctorOutpatient: {
        group: 'OUTPATIENT',
        name: 'DoctorOutpatient',
        default: true,
        title: '患者管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: DoctorOutpatient,
        subRoutes: {
            '/CurrentDept': {
                component: CurrentDept
            },
            '/CurrentHospital': {
                component: CurrentHospital
            },
            '/MyCreation': {
                component: MyCreation
            },
            '/MyJoin': {
                component: MyJoin
            },
            '/Referral': {
                component: PatientReferral
            },
            '/patient/:patientId': {
                component: DoctorOutpatient
            }
        }
    },
    DifficultConsultation: {
        name: 'DifficultConsultation',
        default: true,
        title: '疑难会诊',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: DifficultConsultation,
        subRoutes: {
            '/MyTask/:patientId/:flowId': {
                component: MyTask
            },
            '/ConsultList/:patientId/:flowId': {
                component: ConsultList
            },
            '/MyTask': {
                component: MyTask
            },
            '/ConsultList': {
                component: ConsultList
            }
        }
    },
    Referral: {
        name: 'Referral',
        default: true,
        title: '预约转诊',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Referral,
        icon: 'ios-home',
        subRoutes: {
            '/TransferIn/:patientId/:flowId': {
                component: TransferIn
            },
            '/TransferIn': {
                component: TransferIn
            },
            '/TransferOut': {
                component: TransferOut
            },
            '/TransferOut/:patientId/:flowId': {
                component: TransferOut
            },
            '/ServiceCentre': {
                component: ServiceCentre
            }
        }
    },
    OrderCheck: {
        name: 'OrderCheck',
        default: true,
        title: '预约检查',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: OrderCheck,
        icon: 'ios-home',
        subRoutes: {
            '/InCheck/:patientId/:flowId': {
                component: InCheck
            },
            '/InCheck': {
                component: InCheck
            },
            '/OutCheck': {
                component: OutCheck
            },
            '/OutCheck/:patientId/:flowId': {
                component: OutCheck
            }
        }
    },
    Helpdesk: {
        name: 'Helpdesk',
        default: true,
        title: '导诊台',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Helpdesk,
        icon: 'ios-home',
        subRoutes: {
            '/detail/:patientId/:flowId': {
                component: Helpdesk
            },
            '/TransferIn/:patientId/:flowId': {
                component: TransferIn
            },
            '/Helpdesk': {
                component: Helpdesk
            }
        }
    },
    ReferralStatistics: {
        name: 'ReferralStatistics',
        title: '转诊统计',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: ReferralStatistics,
        subRoutes: {
            '/In': {
                component: ReferralStatisticsIn
            },
            '/Out': {
                component: ReferralStatisticsOut
            }
        }
    },
    Hospital: {
        name: 'Hospital',
        title: '医院管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Hospital
    },
    Doctor: {
        name: 'Doctor',
        title: '医生管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Doctor
    },
    DoctorTeam: {
        name: 'DoctorTeam',
        title: '医生团队',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: DoctorTeam
    },
    MedicalCircle: {
        name: 'MedicalCircle',
        title: '医疗圈',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: MedicalCircle
    },
    Assistant: {
        name: 'Assistant',
        title: '医助管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Assistant
    },

    Triage: {
        name: 'Triage',
        title: '分诊管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Triage
    },
    //筛查活动
    ScreenActivity: {
        name: 'ScreenActivity',
        title: '筛查活动',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: ScreenActivity,
        subRoutes: {
            '/activity/:activityId': {
                component: ScreenActivityDetail,
                subRoutes: {
                    '/:patientId': {
                        component: EyeScreenPtientDetail
                    },
                    '/:patientId/:isEdit': {
                        component: EyeScreenPtientDetail
                    }
                }
            },
        }
    },
    //筛查登记
    EyeScreen: {
        name: 'EyeScreen',
        title: '筛查登记',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: EyeScreen,
        subRoutes: {
            '/activity/:activityId': {
                component: EyeScreenDetail,
                subRoutes: {
                    '/:patientId': {
                        component: EyeScreenPtientDetail
                    },
                    '/:patientId/:isEdit': {
                        component: EyeScreenPtientDetail
                    }
                }
            },
        }
    },
    //筛查结果 
    Screening: {
        name: 'Screening',
        title: '筛查结果',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: Screening,
        subRoutes: {
            '/activity/:activityId': {
                component: ScreeningList,
                subRoutes: {
                    '/:patientId': {
                        component: ScreeningDetail
                    }
                }
            },
        }
    },
    //视频问诊-医院端
    VideoClinicHospital: {
        name: 'VideoClinicHospital',
        title: '视频问诊-医院端',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: VideoClinicHospital,
        subRoutes: {
            '/:patientId/detail': {
                component: VideoClinicHospital
            }
        }
    },
    //视频问诊-医生端
    VideoClinicDoctor: {
        name: 'VideoClinicDoctor',
        title: '视频问诊-医生端',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: VideoClinicDoctor,
        subRoutes: {
            '/:patientId/:deptId/:flowId/detail': {
                component: VideoClinicDoctor
            },
            '/:patientId/:flowId/detail': {
                component: VideoClinicDoctor
            }
        }
    },
    Demo: {
        name: 'Demo',
        title: '测试示例',
        component: Demo,
        subRoutes: {
            '/:id': {
                component: DemoDetail
            }
        }
    },
    TestDemo:{
        name:'TestDemo',
        title:'自定测试',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component:TestDemo,
        subRoutes: {
            
        }
    },
    // 远程阅片
    RemoteReport: {
    name: 'RemoteReport',
    default: true,
    title: '远程阅片',
    permission: ['ADD', 'MODIFY', 'DELETE'],
    component: RemoteReport,
        subRoutes: {
            '/flowtask/:patientId/:flowId': {
                component: MyTaskreport
            },
            '/flowconsulting/:patientId/:flowId': {
                component: MyConsulting
            },
            '/flowtask': {
                component: MyTaskreport
            },
            '/flowconsulting': {
                component: MyConsulting
            }
        }
    },
    // 积分管理
    PointManage: {
        name: 'PointManage',
        default: true,
        title: '积分管理',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: PointManage,
        subRoutes: {
            '/integral': {
                component: integral
            },
            '/Statistics': {
                component: Statistics
            },
            '/Settlement': {
                component: Settlement
            },
            '/seeintegral': {
                component: seeintegral
            },
            '/seetlement': {
                component: seetlement
            },
            '/seeStatistics': {
                component: seeStatistics
            },
        }
    },
    //视频会诊
    VideoConsultation : {
        name: 'VideoConsultation',
        title: '视频会诊',
        permission: ['ADD', 'MODIFY', 'DELETE'],
        component: VideoConsultation
    },
}


// let modules = [{
//         name: 'OUTPATIENT',
//         title: '医生门诊',
//         type: 'MAJOR',
//         icon: 'ios-home'
//     }, {
//         name: 'ARCHIVES',
//         title: '检查中心',
//         type: 'MAJOR',
//         icon: 'medkit'
//     },
//     {
//         name: 'CLOUDCLINIC',
//         title: '云诊所',
//         type: 'MAJOR',
//         icon: 'fork-repo'
//     }, {
//         name: 'TRIAGECENTER',
//         title: '分诊中心',
//         type: 'MAJOR',
//         icon: 'merge'
//     },
//     // {
//     //     name: 'CASE_CENTER',
//     //     title: '经典案例',
//     //     type: 'MAJOR',
//     //     skipAuth: true,
//     //     icon: 'ios-book'
//     // }, 
//     {
//         name: 'HOSPITAL',
//         title: '医院管理',
//         type: 'MAJOR',
//         icon: 'android-wifi'
//     }, {
//         name: 'PERSONNEL',
//         title: '人员管理',
//         type: 'SIDE_MAJOR',
//         icon: 'ios-people'
//     },
//      {
//         name: 'DEMO_GROUP',
//         title: '测试示例',
//         type: 'MAJOR',
//         skipAuth: true,
//         icon: 'ios-book'
//     },
//     {
//         group: 'ARCHIVES',
//         name: 'DicomCenter',
//         title: 'DICOM检查',
//         default: true,
//         icon: 'help-buoy',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: DicomCenter
//     },
//     //云诊所
//     {
//         group: 'CLOUDCLINIC',
//         name: 'CloudClinic',
//         default: true,
//         title: '云诊所',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: CloudClinic,
//         icon: 'ios-home',
//         subRoutes: {
//             '/patient/:patientId/:flowId': {
//                 component: ReceivePatient
//             }
//         }
//     },
//     //分诊中心
//     {
//         group: 'TRIAGECENTER',
//         name: 'TriageCenter',
//         default: true,
//         title: '分诊中心',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: TriageCenter,
//         icon: 'ios-home',
//         subRoutes: {
//             '/patient/:patientId/:flowId': {
//                 component: TriageDetail
//             }
//         }
//     },
//     //医生门诊
//     {
//         group: 'OUTPATIENT',
//         name: 'DoctorOutpatient',
//         default: true,
//         title: '医生门诊',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: DoctorOutpatient,
//         icon: 'ios-home',
//         subRoutes: {
//             '/patient/:patientId': {
//                 component: PatientDetail
//             },
//             '/remote/:patientId': {
//                 component: RemoteRequest
//             }
//         }
//     },
//     //医院管理
//     {
//         group: 'HOSPITAL',
//         name: 'Hospital',
//         default: true,
//         title: '医院管理',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: Hospital,
//         icon: 'ios-home'
//     },
//     //医生管理
//     {
//         group: 'PERSONNEL',
//         name: 'Doctor',
//         default: true,
//         title: '医生管理',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: Doctor,
//         icon: 'ios-home'
//     },
//     //医生团队管理
//     {
//         group: 'PERSONNEL',
//         name: 'DoctorTeam',
//         title: '医生团队',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: DoctorTeam,
//         icon: 'ios-home'
//     },
//     //医助管理
//     {
//         group: 'PERSONNEL',
//         name: 'Assistant',
//         title: '医助管理',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: Assistant,
//         icon: 'ios-home'
//     },
//     //分诊管理
//     {
//         group: 'PERSONNEL',
//         name: 'Triage',
//         default: true,
//         title: '分诊管理',
//         permission: ['ADD', 'MODIFY', 'DELETE'],
//         component: Triage,
//         icon: 'ios-home'
//     },

//     // //经典案例
//     // {
//     //     group: 'CASE_CENTER',
//     //     name: 'ClassicCase',
//     //     title: '经典案例',
//     //     default: true,
//     //     permission: ['ADD', 'MODIFY', 'DELETE'],
//     //     component: ClassicCase,
//     //     subRoutes: {
//     //         '/:id': {
//     //             component: CaseView
//     //         }
//     //     }
//     // },
//     // {
//     //     group: 'CASE_CENTER',
//     //     name: 'CaseView',
//     //     title: '经典案例详情',
//     //     permission: ['ADD', 'MODIFY', 'DELETE'],
//     //     component: CaseView
//     // }
//      {
//         group: 'DEMO_GROUP',
//         name: 'Demo',
//         title: '测试示例',
//         default: true,
//         component: Demo,
//         icon: 'ios-book',
//         subRoutes: {
//             '/:id': {
//                 component: DemoDetail
//             }
//         }
//     }
// ];

// var routes = {},
//     navs = [],
//     navMap = {};
// //一级菜单
// modules.forEach(m => {
//     if (!m.component) {
//         navs.push(m);
//         m.menus = [];
//         navMap[m.name] = m;
//     }
// });
// navs.forEach(nav => {
//     routes[`/${nav.name}`] = {
//         component: Major,
//         skipAuth: nav.skipAuth,
//         subRoutes: {}
//     }
// });
// //模块
// modules.forEach(m => {
//     if (m.component) {
//         var nav;
//         if (nav = routes[`/${m.group}`]) {
//             nav.subRoutes[`/${m.name}`] = {
//                 name: m.name,
//                 component: m.component,
//                 subRoutes: m.subRoutes
//             }
//             navMap[m.group].menus.push({
//                 name: m.name,
//                 title: m.title,
//                 icon: m.icon || null,
//                 default: m.default,
//                 path: `/${m.group}/${m.name}`
//             });
//             if (m.default) {
//                 navMap[m.group].path = `/${m.group}/${m.name}`;
//             }
//         }
//     }
// });

// module.exports = {
//     routes: routes,
//     navs: navs,
//     navMap: navMap
// };
var api = {
    setup: function (configModules) {
        var routes = {};
        var navs = [];
        var navMap = {};
        var permissions = {};
        configModules.sort(function (o1, o2) {
            if (o1.parentId != '0' && o2.parentId == '0' || o1.parentId == '0' && o2.parentId != '0') {
                return o1.parentId != '0' ? 1 : (o2.parentId != '0' ? -1 : 0);
            } else {
                return o1.orderField < o2.orderField ? -1 : (o1.orderField > o2.orderField ? 1 : 0);
            }
        });
        configModules && configModules.forEach(module => {
            var key = module.moduleNo || module.id;
            module.name = key;
            module.title = module.moduleName;
            module.path = `/${key}`;
            permissions[key] = module.parentId;
            if (module.parentId == '0') {
                routes[module.path] = moduleMap[module.moduleNo] || {
                    component: Major,
                    skipAuth: module.skipAuth,
                    subRoutes: {}
                };
                module.menus = [];
                module.type = 'SIDE_MAJOR';
                navMap[key] = module;
                navs.push(navMap[key]);
            } else if (routes[`/${module.parentId}`]) {
                routes[`/${module.parentId}`].subRoutes[module.moduleNo] = moduleMap[module.moduleNo];
                navMap[module.parentId].menus.push({
                    name: module.moduleNo,
                    title: module.moduleName,
                    icon: module.icon || null,
                    default: navMap[module.parentId].menus.length == 0,
                    path: `/${module.parentId}/${module.moduleNo}`
                });
                if (navMap[module.parentId].menus.length == 1) {
                    navMap[module.parentId].path = `/${module.parentId}/${module.moduleNo}`;
                }
            }
        });
        api.routes = routes;
        api.navs = navs;
        api.navMap = navMap;
        api.permissions = permissions;
    }
}
GlobalService.Modules = window.Modules = api;

module.exports = api;