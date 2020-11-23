var app = new Vue({
    el: '#app',
    data() {
        return {
            weather: null,
            temperature: 0,
            imgUrl: 'img/sun.png',
            error: 'No errors'
        }
    },
    created() {
        let getData = async () => {
            try {
                let response = await axios.get('https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22');
                this.weather = response.data.weather[0].main;
                if (this.weather === 'Drizzle' || this.weather === 'Rain')
                    this.imgUrl = 'img/rain.png';
                else if (this.weather === 'Sun')
                    this.imgUrl = 'img/sun.png';
                this.temperature = response.data.main.temp * 9 / 5 - 459.67;
            }
            catch (err) {
                this.error = err;
            }
            setTimeout(getData, 1000 * 60 * 15);
        };
        getData();
    }
});