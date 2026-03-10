const appConfig = {
    url: process.env.APP_URL,
    frontendUrl: process.env.FRONTEND_URL || process.env.APP_URL,
};

module.exports = appConfig;
