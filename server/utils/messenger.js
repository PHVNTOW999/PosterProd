const returnError = async (req, res, error) => {
    return res.status(400).json({
        message: error || 'Unknown error'
    })
}
const returnJSON = async (req, res, json) => {
    return await res.status(201).json(json)
}

module.exports = {
    returnError,
    returnJSON,
}