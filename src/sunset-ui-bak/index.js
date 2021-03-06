import iView from 'iview';
import 'iview-style';

const prefix = 'Sunset';

import FormWidgets from './components/crud/widgets/widgets';

import Sunset from './common/sunset';
import Filters from './common/filters';
import Directives from './common/directives';
import Validators from './common/validators';

import Crud from './components/crud/Crud.vue';
import Filter from './components/crud/SearchForm.vue';
import Toolbar from './components/crud/Toolbar.vue';
import Table from './components/crud/Table.vue';
import Form from './components/crud/Form.vue';
import Datapage from './components/crud/Datapage.vue';
import Editor from './components/editor/Editor';

import Tree from './components/tree/Tree.vue';
import Page from './components/pager/Page.vue';

import FormModal from './components/modal/FormModal.vue';
import TableModal from './components/modal/TableModal.vue';
import TreeModal from './components/modal/TreeModal.vue';
import ViewModal from './components/modal/ViewModal.vue';

import Breadcrumb from './components/breadcrumb/Breadcrumb';

import ImageViewer from './components/commonImageViewer/ImageViewer';
import Loading from './components/loading/Loading';

import {
    Container,
    Sidebar,
    Header,
    Major,
    Layout
} from './layout';

import Store from './components/crud/Store';

const components = {
    Crud: Crud,
    Filter: Filter,
    Table: Table,
    Form: Form,
    Toolbar: Toolbar,
    Datapage : Datapage,
    Tree: Tree,
    FormModal: FormModal,
    TableModal: TableModal,
    TreeModal: TreeModal,
    ViewModal: ViewModal,
    Breadcrumb: Breadcrumb,
    Page: Page,
    Editor: Editor,
    Loading : Loading
}
const Layouts = {
    Container: Container,
    Header: Header,
    Sidebar: Sidebar,
    Major: Major,
    Layout: Layout
}
const Services = {
    Store: Store
}

window.Sunset = Sunset;
//服务
Sunset.Service = Sunset.service || {};
Object.keys(Services).forEach(s => {
    Sunset.Service[s] = Services[s];
});

var OuterVue = null,
    waitRegistList = [];

exports.install = function install(Vue, options) {
    Vue.use(iView);
    //布局
    Object.keys(Layouts).forEach(c => {
        Vue.component(`${prefix}${c}`, Layouts[c]);
    });
    //组件
    Object.keys(components).forEach(c => {
        Vue.component(`${prefix}${c}`, components[c]);
    });
    //扩展组件
    OuterVue = Vue;
    var extC;
    while (extC = waitRegistList.pop()) {
        Vue.component(extC.name, extC.widget);
    }
    //全局提示
    var tipType = {
        info: 'info',
        success: 'success',
        warning: 'warning',
        error: 'error',
        loading: 'loading'
    };
    Sunset.tip = function (message, type, duration) {
        return Vue.prototype.$Message[tipType[type] || 'info'](message, duration);
    };
    Sunset.notice = function (title, desc, type, duration) {
        return Vue.prototype.$Notice[tipType[type] || 'info']({
            title,
            desc,
            duration
        });
    };
    Sunset.confirm = function (option) {
        Vue.prototype.$Modal.confirm(option);
        return () => {
            Vue.prototype.$Modal.remove();
        }
    };
    //(config)
    // Vue.prototype.$Loading = LoadingBar;
    // Vue.prototype.$Message = Message;
    // Vue.prototype.$Modal = Modal;
    // Vue.prototype.$Notice = Notice;
}

exports.registFormWidget = function (name, widget) {
    FormWidgets[`Widget${name}`] = widget;
}

exports.registComponent = function (name, widget) {
    if (OuterVue) {
        OuterVue.component(name, widget);
    } else {
        waitRegistList.push({
            name: name,
            widget: widget
        })
    }
}