const URLS = {
    VIDEO_QUEUE: '/service/business/videoQueue',
    CHANGE_STATUS: '/service/business/videoQueue/changeStatus',
    NEXT: '/service/business/videoQueue/nextOne',
    NOTICE: '/service/business/videoQueue/chooseOne',
    TODAY_DOCTOR: '/service/business/videoQueue/today/expert',
    CURRENT_DOCTOR: '/service/business/videoQueue/current/expert'
}

export default {
    todayExpert(filter) {
        return $http({
            url: URLS.CURRENT_DOCTOR,
            data: filter
        });
    },
    queue(filter) {
        filter.order = 'ASC';
        return $http({
            url: URLS.VIDEO_QUEUE,
            data: filter
        });
    },
    next(equipmentId) {
        return $http({
            url: URLS.NEXT,
            data: {
                equipmentId: equipmentId == '_' ? null : equipmentId
            }
        });
    },
    notice(equipmentId, videoQueueId) {
        return $http({
            url: URLS.NOTICE,
            data: {
                equipmentId: equipmentId == '_' ? null : equipmentId,
                videoQueueId
            }
        });
    },
    requeue(videoQueueId) {
        return this.changeStatus(videoQueueId, Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'RELINEUP'));
    },
    cancel(videoQueueId) {
        return this.changeStatus(videoQueueId, Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'CANCELLINEUP'));
    },
    changeStatus(videoQueueId, status) {
        return $http({
            url: URLS.CHANGE_STATUS,
            type: 'POST',
            data: {
                videoQueueId,
                status
            }
        });
    }
}