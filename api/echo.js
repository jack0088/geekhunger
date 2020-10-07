module.exports = function(req, res) {
    res.json({
        query: req.query,
        cookies: req.cookies,
        body: req.body
    })
}
