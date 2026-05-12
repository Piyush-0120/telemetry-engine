module.exports = function auth(req,res,next){
    const authHeader = req.headers['x-api-key'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is required' });
    }
    if(authHeader === process.env.API_KEY){
        return next();
    }
    return res.status(401).json({ error: 'Invalid API key' });
}