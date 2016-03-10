import * as scraperController from "../api/controllers/scraper";


module.exports = function ( app ){

    let router = require("express-promise-router")();
    router.get("/jackpot", scraperController.getJackpot);
    router.get("/winning-numbers", scraperController.getWinningNumbers);

    app.use('/api/', router);
}