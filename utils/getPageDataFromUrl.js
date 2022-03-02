const axios = require("axios");

exports.getPageDataFromUrl = async function(url) {
    return await axios.get(url)
        .then((response) => {
            return {resp: response.data, error: false};
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.status);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }

            return {resp: error.response.status, error: true}
        })
}