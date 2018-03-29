const URLS = {
    LIST_ROOT: '/medical/template/find_template_report_root',
    LIST_COMMON: '/medical/template/find_template_report',
    LIST_SELF: '/service/business/template/find_template_report_self',
    SAVE: '/service/business/template/add_update_template_report_self',
    DELETE: '/service/business/template/del_template_report_self'
};

export default {
    rootList() {
        return $http({
            url: URLS.LIST_ROOT
        });
    },
    commonList(id) {
        return $http({
            url: URLS.LIST_COMMON,
            data: {
                id
            }
        });
    },
    selfList(id) {
        return $http({
            url: URLS.LIST_SELF,
            data: {
                id
            }
        });
    },
    save(options) {
        let url = URLS.SAVE;

        return $http({
            url,
            method: 'POST',
            data: {
                record: JSON.stringify(options)
            }
        });
    },
    remove(id) {
        let url = URLS.DELETE;
        return $http({
            url,
            method: 'POST',
            data: {
                id
            }
        })
    }
}