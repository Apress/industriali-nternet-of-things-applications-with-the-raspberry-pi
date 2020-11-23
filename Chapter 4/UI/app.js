const Gpio = require('onoff').Gpio;
const Vue = require('vue/dist/vue.common.js');
const axios = require('axios');
const child_process = require('child_process');
const fs = require('fs');
let startDate;
const ubidotsHeader = {
    'X-Auth-Token': 'your_token', "Content-Type":
"application/json"
};
const ubidotsURL = 'https://industrial.api.ubidots.com/api/v1.6/devices/raspberrypi';
var app = new Vue({
    el: '#app',
    data() {
        return {
            beverages: [
                {
                    name: 'rsoda', bgcolor: 'darkred', wcolor: 'white',
                    pinNumber: 16
                },
                {
                    name: 'rjuicer', bgcolor: 'orange', wcolor: 'white',
                    pinNumber: 20
                },
                {
                    name: 'rwaterr', bgcolor: 'cornflowerblue', wcolor:
                        'white', pinNumber: 21
                }],
            selection: null,
            pouring: false
        }
    },
    methods: {
        select(element) {
            this.selection = element;
        },
        async pour(action) {
            if (action) {
                this.pouring = true;
                this.selection.pin.writeSync(1);
                startDate = Date.now();
            }
            else {
                this.pouring = false;
                this.selection.pin.writeSync(0);
                let seconds = (Date.now() - startDate) / 1000;
                let mililiters = seconds * 10
                console.log (mililiters);
                let ubidotsVariable = {};
                ubidotsVariable[this.selection.name] = - mililiters;
                try {
                    let result = await axios.post(ubidotsURL,
                        ubidotsVariable, { headers: ubidotsHeader });
                    console.log(result);
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
    },
    async created() {
        this.selection = this.beverages[0];
        let payload = {};
        for (let beverage of this.beverages) {
            beverage.pin = new Gpio(beverage.pinNumber, 'out');
            payload[beverage.name] = 2000;
        }
        try {
                console.log (payload);
                let result = await axios.post(ubidotsURL,
                    payload, { headers: ubidotsHeader });
                console.log(result);
            }
            catch (err) {
                console.error(err);
            }
    }
});