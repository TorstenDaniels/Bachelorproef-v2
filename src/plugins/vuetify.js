import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import nl from 'vuetify/es5/locale/nl'

Vue.use(Vuetify);

export default new Vuetify({
    lang: { locales: {nl}, current: 'nl'}
});
