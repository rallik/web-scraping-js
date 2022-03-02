const { getPageDataFromUrl } = require("../utils/getPageDataFromUrl");
const cheerio = require("cheerio");
const fs = require("fs");



const scrapeNeighborData = async () => {
    const url = "https://www.cia.gov/the-world-factbook/field/land-boundaries/";
    const { resp, error } = await getPageDataFromUrl(url);
    
    if (error === true) {
        console.log(resp);
    } else {
        const parsedData = cheerio.load(resp);
        const allLists = parsedData("ul").filter(function (i, el) {
            return parsedData(this).attr('class') === undefined;
        });
        const countries = allLists[0].children;

        
        let countryName;
        let neighborsArr;
        let countriesAdjacencyList = {}
        for (let i = 0; i < Object.keys(countries).length; i++) {
            countryName = countries[i].children[0].children[0].children[0].data;
            console.log(countryName)

            countriesAdjacencyList[countryName] = [];

            neighborsArr = countries[i].children[1]?.children[5]?.data.split(',') || [];
            neighborsArr.forEach((neighbor) => {
                let splitOutNumber = neighbor.split(/(\d+)/);
                console.log(splitOutNumber)
                let neighborName = splitOutNumber.shift().trim();
                countriesAdjacencyList[countryName].push(neighborName)
            })
            // console.log(neighborsArr)
        }

        let strigifiedAdjacencyList = JSON.stringify(countriesAdjacencyList);
        fs.writeFileSync('country-neighbors.json', strigifiedAdjacencyList);
    }


}




const checkValidCountryNames = async () => {
    const rawData = fs.readFileSync('country-neighbors.json');
    let adjacencyList = JSON.parse(rawData);
    // console.log(Object.keys(adjacencyList))

    for (let country in adjacencyList) {
        const formatCountryForURL = country.replace(' ', '%20')
        const url = `https://restcountries.com/v3.1/name/${formatCountryForURL}?fullName=true`
        const { resp, error } = await getPageDataFromUrl(url);
    
        if (error === true) {
            console.log(resp, country);
        }
    }
}

const appendFlagUrlToList = async () => {
    const updatedObjectWithFlag = {}
    const rawData = fs.readFileSync('country-neighbors.json');
    let adjacencyList = JSON.parse(rawData);

    for (let country in adjacencyList) {
        const formatCountryForURL = country.replace(' ', '%20')
        const url = `https://restcountries.com/v3.1/name/${formatCountryForURL}?fullName=true`
        const { resp, error } = await getPageDataFromUrl(url);
    
        if (error === true) {
            console.log(resp, country);
        } else {
            updatedObjectWithFlag[country] = {
                flag: resp[0]?.flags?.png,
                neighbors: adjacencyList[country]
            }
        }
    }
    let strigifiedAdjacencyList = JSON.stringify(updatedObjectWithFlag);
    fs.writeFileSync('country-neighbors-flags.json', strigifiedAdjacencyList);
}

//Function Calls
// scrapeNeighborData()
// checkValidCountryNames();

appendFlagUrlToList();