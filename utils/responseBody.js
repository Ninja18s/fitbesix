const { languageFlag } = require('./languageResponse');
const messageMap = {

    0: "success",

    1: "error"

}



const fixResponse = (req, res, next) => {
    const languageCode = req.headers['language'];
    if (languageCode === undefined) {
        res.status(404).send({
            resCode: 1,
            msg: "header missing"
        })
    }
    const originJson = res.json

    res.json = (jsonData) => {
        const tempObj = { ...jsonData }
        delete tempObj.resCode;
        tempObj.message = languageFlag(jsonData.message, languageCode)

        const fixedResponse = {

            code: jsonData.resCode,
            response: tempObj,
            resStr: messageMap[jsonData.resCode]

        }

        originJson.call(res, { ...fixedResponse })

    }

    next()
}

module.exports = fixResponse