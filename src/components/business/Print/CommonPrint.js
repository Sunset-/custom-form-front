import Vue from 'vue';
import './templates/index';

(function () {

    var uid = 0;
    var printer;

    function getPrinter() {
        if (printer && printer.$el && $('.sunset-global-printer').length) {
            return printer;
        } else {
            var div = document.createElement('div');
            div.innerHTML =
                `
        <div :id="id">
            <component :is="component" :data="printData"></component>
        </div>
    `;
            document.body.appendChild(div);
            $(div).css('display', 'none').addClass('sunset-global-printer');

            printer = new Vue({
                el: div,
                data() {
                    return {
                        id: `print-template-${++uid}`,
                        component: '',
                        printData: {}
                    };
                },
                methods: {
                    print(component, data) {
                        this.component = component;
                        Promise.resolve(data).then(res => {
                            this.printData = res;
                            this.$nextTick(() => {
                                $(`#${this.id}`).jqprintOrigin();
                            });
                        });
                    }
                }
            });
            return printer;
        }
    }

    window.GlobalService.CommonPrint = (component, data) => {
        getPrinter().print(component, data);
    }
})();