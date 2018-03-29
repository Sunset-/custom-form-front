import Vue from 'vue';
import CheckForm from './CheckForm.vue';
import Prescription from './Prescription.vue';
import DemoTemplate from './DemoTemplate.vue';
import EyesScreenForm from './EyesScreenForm.vue';
import DicomReport from './DicomReport.vue';
import TangReport from './TangReport.vue';
import TransferReport from './TransferReport.vue';

Vue.component('print-template-checkform', CheckForm);
Vue.component('print-template-prescription', Prescription);
Vue.component('print-template-demo', DemoTemplate);
Vue.component('print-template-eyesscreenform', EyesScreenForm);
Vue.component('print-template-DicomReport', DicomReport);
Vue.component('print-template-tangreport', TangReport);
Vue.component('print-template-transferreport', TransferReport);
