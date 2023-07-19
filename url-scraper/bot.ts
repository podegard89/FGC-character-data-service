import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { autoScroll, scrapeVideoURLs } from "./functions";
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

(async () => {

    const browser = await puppeteer.launch({ headless: false });

    // the slice removes the first and last items, which for some reason are showing up as empty strings
    const videoList = (await scrapeVideoURLs(process.env.SEARCHURL ?? "", browser, autoScroll)).slice(1, -1);

    await prisma.videoURL.createMany({
        data: videoList.map(url => {
            return { url };
        })
    });

    await browser.close();

})();