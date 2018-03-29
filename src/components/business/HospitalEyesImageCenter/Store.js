import SignStore from '../../sign/SignStore';

class DicomCenterStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    callbacks = {
        afterList(res) {
            res && res.data && res.data.forEach(item => {
                item.originPatientName = item.patientName;
                try {
                    var formFixedField = JSON.parse(item.formFixedField);
                    Object.keys(formFixedField).forEach(key => {
                        item[key] = formFixedField[key];
                    });
                } catch (e) {
                    item.formFixedField = {};
                }
                try {
                    item.content = item.content && JSON.parse(item.content) || {};
                    try {
                        item.checkMethodText = `【${item.content.checkMethod}】${JSON.parse(item.content.checkPoint).map(item=>item.label).join(',')}`;
                    } catch (e) {

                    }
                    Object.keys(item.content).forEach(key => {
                        item[key] = item.content[key];
                    });
                } catch (e) {
                    item.content = {};
                }
            });
            return res;
        }
    }

    METHODS = {
        SAVE　: 'POST',
        DELETE: 'GET'
    }

    URLS = {
        OPC_LIST: '/local_service/fileRes/load_to_cloud',
        LIST: '/local_service/fileRes/load',
        APPLY: '/local_service/CloudConsult/apply',
        SERVER_TIME: '/service/common/time',
        GET_APPLY_DOCTORS: '/service/opc/consult_experts',
        CHECK: '/local_service/CloudConsult/apply_check'
    }

    opcList(filter) {
        return $http({
            url: this.URLS.OPC_LIST,
            data: filter
        }).then(this.callbacks.afterList);
    }

    /**
     * 查询是否有同类报告未完成
     */
    checkSameReportUnFinished(listId, experts) {
        return $http({
            url: this.URLS.CHECK,
            type: 'POST',
            data: {
                dcmListId: listId,
                expert: experts
            }
        });
    }


    /**
     * 
     * 发起远程诊断申请
     * 
     * @memberOf DicomCenterStore
     */
    apply(model) {
        // //插入时间
        return $http({
            url: this.URLS.SERVER_TIME
        }).then(time => {
            model.workFlow.applyTime = time;
            model.workFlow = JSON.stringify(model.workFlow);
            return $http({
                url: this.URLS.APPLY,
                type: 'POST',
                data: model
            });
        });
    }

    /**
     * 获取可申请的医生
     */
    getApplyDoctors() {
        return $http({
            url: this.URLS.GET_APPLY_DOCTORS,
            data: {
                opcId: SignStore.getCurrentUserSync().relation.customerId
            }
        });
    }
}

export default new DicomCenterStore();