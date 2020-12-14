import { defineComponent, createVNode, render, toRef, watch } from 'vue';
import dialog from './dialog';

const comments = defineComponent(dialog);

export const createDialog = option => {
    option = option ? option : {};
    const instance = createVNode(comments, option);

    const container = document.createElement('div');

    render(instance, container);

    document.querySelector('#app').appendChild(instance.el);

    const props = instance.component.props;

    for (let item of Object.keys(option)) {
        props[item] = option[item];
    }
    const status = toRef(instance.component.setupState, 'status');

    return new Promise((resolve, reject) => {
        watch(status, now => {
            console.log(now);
            if (now == 0) reject();
            else if (now == 1) resolve();
        });
    });
};
