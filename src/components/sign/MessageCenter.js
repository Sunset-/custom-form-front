var URLS = {
    POLLING_FLOWS: '/service/business/baseflow/hasNew'
}

var topNavIds = {
    ALL : 'ALL',
    transfertreatment: 'top-nav-item-span-Referral',
    difficultyflow: 'top-nav-item-span-DifficultConsultation',
    remoteflow: 'top-nav-item-span-RemoteReport'
};
var ListenFlowHasNewCallbacks = {
};
var ListenFlowHasNewResult = {};
GlobalService.ListenFlowHasNew = function (flowType, callback) {
    if (Sunset.isFunction(callback) && topNavIds[flowType]) {
        ListenFlowHasNewCallbacks[flowType] = callback;
        ListenFlowHasNewResult[flowType] && callback(flowType=='ALL'?ListenFlowHasNewResult:ListenFlowHasNewResult[flowType]);
    } else {
        delete ListenFlowHasNewCallbacks[flowType];
    }
}
GlobalService.RefreshFlowHasNew = function (flowType, callback) {
    MessageCenter._startPollingFlows();
}

var MessageCenter = {
    start() {
        this.startPollingFlows();
    },
    currentUser: null,
    startPollingFlowsTimer: null,
    pollingFlowsParams: null,
    startPollingFlows() {
        var currentUser = GlobalService.getCurrentUserSync();
        if (currentUser != this.currentUser) {
            this.currentUser = currentUser;
            clearTimeout(this.startPollingFlowsTimer);
            var relationEntityIds = currentUser.relation.teams.map(item => item.id);
            if(currentUser.relation.hospital[0].id){
                relationEntityIds.push(currentUser.relation.hospital[0].id);
            }
            this.pollingFlowsParams = {
                currentUserRoles : GlobalService.getCurrentUserSync().relation.hospitalDesc,
                systemId: GlobalService.getSystemId(),
                hospitalId: currentUser.relation.hospital[0].id,
                relationEntityIds: relationEntityIds.join(',')
            };
            this.startPollingFlowsTimer = setInterval(() => {
                this._startPollingFlows();
            }, 60000);
            this._startPollingFlows();
        }
    },
    _startPollingFlows() {
        $http({
            url: URLS.POLLING_FLOWS,
            data: this.pollingFlowsParams
        }).then(res => {
            if (res) {
                ListenFlowHasNewCallbacks.ALL&&ListenFlowHasNewCallbacks.ALL(res);
                Object.keys(res).forEach(key => {
                    // topNavIds[key] && $("#" + topNavIds[key])[res[key].hasNew ? 'addClass' : 'removeClass']('has-new');
                    ListenFlowHasNewCallbacks[key] && ListenFlowHasNewCallbacks[key](res[key]);
                    ListenFlowHasNewResult = res;
                })
            }
        })
    }
}

module.exports = MessageCenter;