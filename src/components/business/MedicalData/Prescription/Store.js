export default {
    /**
     * 药品字典
     * keyword
     * pageSize
     * pageNumber
    getMedicineKinds: */
    getMedicineKinds: Sunset.wait((option = {}) => {
        return $http({
            url: '/medical/drug',
            data: option
        })
    }),

    /**
     * 用药途径
     */
    getMedicineRoute: Sunset.wait((options = {}) => {
        return $http({
            url: '/medical/dictionary',
            data: {
                type: 'GEIYAO_TUJING',
                options
            }
        });
    }),
    /**
     * 用药频率
     */
    getMedicineFrequency: Sunset.wait((options = {}) => {
        return $http({
            url: '/medical/dictionary',
            data: {
                type: 'YONGYAO_PINLV',
                options
            }
        });
    }),

    /**
     * 剂量单位
     */
    getMedicineDose: Sunset.wait((options = {}) => {
        return $http({
            url: '/medical/dictionary',
            data: {
                type: 'YONGYAO_JILIANG',
                options
            }
        });
    }),

    getMedicineAllUnit: Sunset.wait((options = {}) => $http({
        url: '/medical/dictionary',
        data: {
            type: 'YONGYAO_ZONGLIANG',
            options
        }
    })),
    /**
     * 处方类型
     */
    getMedicineType: Sunset.wait((options = {}) => {
        return $http({
            url: '/medical/dictionary',
            data: {
                type: 'CHUFANG_LEIXING',
                options
            }
        })
    })
};