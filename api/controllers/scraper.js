import cheerio from "cheerio";
import request from "request-promise";

const HOME_URL = "http://www.powerball.com/pb_home.asp";
const WINNUMS_URL = "http://www.powerball.com/powerball/winnums-text.txt";

export async function getJackpot(req, res, next){
    const html = await request(HOME_URL);
    const $ = cheerio.load(html);
    const selected = $("div#mainContent table").eq(0).find("tr").eq(1).find("td").last().text().trim();

    const jackpot = selected.match(/\d/g).join("");
    let multiplier;
    if(selected.indexOf("Thousand") > -1) {
        multiplier = Math.pow(10, 3);
    }
    else if(selected.indexOf("Million") > -1){
        multiplier = Math.pow(10, 6);
    }
    else if(selected.indexOf("Billion") > -1) {
        multiplier = Math.pow(10, 9);
    }

    const jackpotInCents = jackpot * multiplier * Math.pow(10,3);
    return res.send({ data: jackpotInCents });
}

export async function getWinningNumbers(req, res, next){
    const html = await request(WINNUMS_URL);
    const latestLine = html.split("\n")[1].trim();

    let winningNumbers = latestLine.split("  ").splice(1);
    winningNumbers = winningNumbers.map(number => parseInt(number));

    return res.send({ data: winningNumbers });
}
