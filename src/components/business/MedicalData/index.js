// 注册医疗资料卡片

import Vue from 'vue';
import Card from './Card.vue';
import Detail from './Detail.vue';
import Toolbar from './Toolbar.vue';
import RightToolbar from './RightToolbar.vue';
import VisitingRecords from './VisitingRecords.vue';
import MedicalDataStore from './MedicalDataStore';

import './style.scss';

var cards = [
    'Registration',
    'Diagnosis',
    'patienthistory',
    'physicalcheck',
    'CheckApplicationForm',
    'InspectionApplicationForm',
    'InspectionFile',
    'Prescription',
    'Patient',
    'Cure',
    'DicomArchives',
    'VideoArchives',
    'PictureArchives',
    'Attachment',
    'EyesScreen',
    'TangWangScreening',
    'TangWangReport',
    'FastReply',
    'EyesQualityControl',
    'DicomReport',
    // 'applydicom'
    'ConsultationSuggest',
    'PatientReturn',
    'FirstRecord',
    'DailyRecord',
    'RoundWardsRecord',
    'PreoperativeRecord',
    'PostoperativeRecord',
    'OperativeRecord',
    'LeaveRecord',
    'OtherRecord',
    'cureplan',
    'phasedsummary',
    'leavehospitalsummary',
    'patientcaseabstract',
    'multimedia'
];

Vue.component('medicaldata-card', Card);
Vue.component('medicaldata-detail', Detail);
Vue.component('medicaldata-toolbar', Toolbar);
Vue.component('medicaldata-right-toolbar', RightToolbar);
Vue.component('visiting-records', VisitingRecords);
cards.forEach(name => {
    var m = require(`./${name}/index`);
    Object.keys(m).forEach(mName => {
        m[mName].card && Vue.component(`md-${mName}-card`, m[mName].card);
        m[mName].view && Vue.component(`md-${mName}-view`, m[mName].view);
        m[mName].detail && Vue.component(`md-${mName}-detail`, m[mName].detail);
    })
});

MedicalDataStore.getAllCards();