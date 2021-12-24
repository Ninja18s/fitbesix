const { languageFlag } = require('./languageResponse');
const messageMap = {

    0: "success",

    1: "error"

}



const fixResponse = (req, res, next) => {
    const languageCode = req.headers['language'];
    const originJson = res.json

    res.json = (jsonData) => {
        const tempObj = { ...jsonData }
        delete tempObj.resCode;
        tempObj.message = languageFlag(jsonData.message, languageCode)

        const fixedResponse = {

            resCode: jsonData.resCode,
            response: tempObj,
            resStr: messageMap[jsonData.resCode]

        }

        originJson.call(res, { ...fixedResponse })

    }

    next()
}

module.exports = fixResponse