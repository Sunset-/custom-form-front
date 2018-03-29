const URLS = {
    IN: '/service/business/referral_stat/in',
    OUT: '/service/business/referral_stat/out',
    DETAIL: '/service/business/referral_stat/detail'
}

export default { in (filter) {
        return $http({
            url: URLS.IN,
            data: filter
        });
    },
    out(filter) {
        return $http({
            url: URLS.OUT,
            data: filter
        });
    },
    detail(filter) {
        return $http({
            url: URLS.DETAIL,
            data: filter
        }).then(res => {
            res && res.rows && res.rows.forEach(item => {
                try {
                    item.patient.extension = JSON.parse(item.patient.extension);
                } catch (e) {
                    console.error(e);
                }
                try {
                    item.flow.extension = JSON.parse(item.flow.extension);
                } catch (e) {
                    console.error(e);
                }
                try {
                    item.registration.digest = item.registration.digest ? JSON.parse(item.registration.digest) : {};
                } catch (e) {
                    console.error(e);
                }
            });
            return res;
        });
    }
}