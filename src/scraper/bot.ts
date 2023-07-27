import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdBlockerPlugin from 'puppeteer-extra-plugin-adblocker';
puppeteer.use(StealthPlugin());
puppeteer.use(AdBlockerPlugin());

import { PrismaClient } from '@prisma/client';
import {
    scrapeCharactersUsed,
    prismaWrapperFunctions,
    determineGameInVideo,
    waitThenClick,
    tallyCharactersUsed
} from "./functions";

const prisma = new PrismaClient();

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });

    const videoUrlList = (await prisma.videoURL.findMany()).map(obj => obj.url);

    const tournaments = await scrapeCharactersUsed({
        videoUrlList,
        tallyFunction: tallyCharactersUsed,
        prismaWrapperFunctions,
        determineGameTitleFunction: determineGameInVideo,
        waitThenClick,
        browser,
        prisma
    });

    console.log(tournaments.length);

    await browser.close();
})();