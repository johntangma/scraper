import cheerio from "cheerio";
import request from "request-promise";

const HOME_URL = "http://www.powerball.com/pb_home.asp";
const WINNUMS_URL = "http://www.powerball.com/powerball/winnums-text.txt";

export async function getJackpot(req, res, next){
    const html = await request(HOME_URL);
    const $ = cheerio.load(html);
    const selected = $("div#mainContent table").eq(0).find("tr").eq(1).find("td").last().text().trim();

    if(!selected) {
        return res.send({message: "failed to read data"});
    }

    const jackpot = selected.match(/\d/g).join("");
    const stringPart = selected.substr(selected.indexOf(jackpot) + 3);
    let multiplier;
    switch(stringPart){
        case "Thousand":
            multiplier = Math.pow(10, 3);
            break;
        case "Million":
            multiplier = Math.pow(10, 6);
            break;
        case "Billion":
            multiplier = Math.pow(10, 9);
            break;
    }

    const jackpotInCents = jackpot * multiplier * Math.pow(10,2);
    return res.send({ data: jackpotInCents });
}

export async function getWinningNumbers(req, res, next){
    const html = await request(WINNUMS_URL);
    const latestLine = html.split("\n")[1].trim();

    let winningNumbers = latestLine.split("  ").splice(1);
    winningNumbers = winningNumbers.map(number => parseInt(number));

    return res.send({ data: winningNumbers });
}
