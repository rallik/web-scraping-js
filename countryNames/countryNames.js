const axios = require("axios");
const fs = require("fs");



const fetchData = async () => {
    console.log("loaded2")
    const resp = await axios.get("https://restcountries.com/v3.1/all/?fields=name");
    const data = await resp.data.map(country => country.name.common);
    const json = await JSON.stringify(data);
    await fs.writeFileSync("countryList.json", json);
    
}
console.log("loaded")

const data = fetchData();
