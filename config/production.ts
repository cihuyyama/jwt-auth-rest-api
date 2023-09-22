export default {
    port: 3000,
    dbUri: process.env.mongo_url,
    loglevel: 'info',
    accessTokenPrivateKey: "",
    refreshTokenPrivateKey: "",
    smtp: {
        user: 'wttygvgkz5xxello@ethereal.email',
        pass: 'p7M7CumTTrNpy68kSV',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
    }
}