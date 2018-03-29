import Vue from 'vue';

var cards = [
    'CustomForm'
];

cards.forEach(name=>{
    var m = require(`./${name}/index`);
    Object.keys(m).forEach(mName=>{
        Vue.component(mName,m[mName]);
    })
});