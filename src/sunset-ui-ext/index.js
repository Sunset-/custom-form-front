import SunsetUi from 'sunset-ui';
import Dicom from './components/curd/widgets/Dicom.vue';
import DicomCard from './components/curd/widgets/DicomCard.vue';
import Video from './components/curd/widgets/Video.vue';
import Checkimage from './components/curd/widgets/Checkimage.vue';
import VideoCard from './components/curd/widgets/VideoCard.vue';
import Attachment from './components/curd/widgets/Attachment.vue';
import AttachmentfileCard from './components/curd/widgets/AttachmentfileCard.vue';
import CheckimageCard from './components/curd/widgets/CheckimageCard.vue';
import Camera from './components/curd/widgets/Camera.vue';
import CameraModal from './components/curd/widgets/CameraModal.vue';
import RadioCheckbox from './components/curd/widgets/RadioCheckbox.vue';
import TableRadioCheckbox from './components/curd/widgets/TableRadioCheckbox.vue';
import EyeballTension from './components/curd/widgets/EyeballTension.vue';
import ShuttleEyeGround from './components/curd/widgets/ShuttleEyeGround.vue';
import ReportImage from './components/curd/widgets/ReportImage';

SunsetUi.registFormWidget('Dicom', Dicom);
SunsetUi.registFormWidget('Video', Video);
SunsetUi.registFormWidget('Checkimage', Checkimage);
SunsetUi.registFormWidget('Attachment', Attachment);
SunsetUi.registFormWidget('Tableradiocheckbox', TableRadioCheckbox);
SunsetUi.registFormWidget('Camera', Camera);
SunsetUi.registComponent('DicomCard', DicomCard);
SunsetUi.registComponent('VideoCard', VideoCard);
SunsetUi.registComponent('AttachmentfileCard', AttachmentfileCard);
SunsetUi.registComponent('CheckimageCard', CheckimageCard);
SunsetUi.registComponent('sunset-camera-modal', CameraModal);
SunsetUi.registFormWidget('Radiocheckbox', RadioCheckbox);
SunsetUi.registFormWidget('Eyeballtension', EyeballTension);
SunsetUi.registFormWidget('Shuttleeyeground', ShuttleEyeGround);
SunsetUi.registFormWidget('Reportimage', ReportImage);