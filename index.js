// 引入需要的库
const config = require('./config.json');
const cheerio = require('cheerio');
const log = require('./log');
const { getPageNumber, getListAllUrl, getDetailAllImage, getFirstTagName, getTitle } = require('./parse');
const { getHtml, getImage } = require('./http');
const { createFolder, saveImage, getDetailUrls, isDetailUrlDuplicate, addDetailUrl } = require('./file');

// 目标网页的 URL
const targetUrl = config.main + config.mainUrl;

async function main() {
    log.info(`开始获取主页面`);
    getDetailUrls();
    const mainHtml = await getHtml(targetUrl);
    const $main = cheerio.load(mainHtml);
    const totalPageNumber = getPageNumber($main);
    if (totalPageNumber === 0) {
        log.error(`获取页面总数失败`);
        return;
    }
    log.info(`获取总页数成功: ${totalPageNumber}`);

    const pageUrls = [targetUrl];
    for (let i = 2; i <= totalPageNumber; i++) {
        // 注意这里使用的是变量 i，而不是 n
        pageUrls.push(config.main + config.listUrl + i);
    }
    log.info(`组装页面数组完成, 开始遍历具体列表页面`);

    for (let i = 0; i < pageUrls.length; i++) {
        const url = pageUrls[i];
        log.info(`开始获取列表页面${i + 1}html: ${url}`);
        const listHtmlString = await getHtml(url);
        if (!listHtmlString) {
            log.error(`获取listHtmlString失败, ${listHtmlString}`);
            continue;
        }
        log.info(`获取列表页面${i + 1}html成功: ${url}`);
        const $list = cheerio.load(listHtmlString);
        const detailPageUrls = getListAllUrl($list);
        if (!detailPageUrls || detailPageUrls.length === 0) {
            log.error(`获取详细页面失败:${url}`);
            continue;
        }
        log.error(`获取详细页面成功:${url}`);

        for (let x = 0; x < detailPageUrls.length; x++) {
            const detailUrl = detailPageUrls[x];

            if (isDetailUrlDuplicate(detailUrl)) {
                log.error(`${detailUrl}重复`);
                continue;
            }

            const detailHtml = await getHtml(detailUrl);
            if (!detailHtml) {
                log.error(`获取detailHtml失败, ${detailHtml}`);
                continue;
            }
            const $detail = cheerio.load(detailHtml);

            const tagName = getFirstTagName($detail);
            const title = getTitle($detail);
            if (!tagName) {
                log.error(`${tagName} 为空`);
                continue;
            }

            if (!title) {
                log.error(`${title} 为空`);
                continue;
            }

            const titleDir = createFolder(tagName, title);
            const imageUrls = getDetailAllImage($detail);

            for (let y = 0; y < imageUrls.length; y++) {
                const imageUrl = imageUrls[y];
                const imageBuffer = await getImage(imageUrl);
                saveImage(imageBuffer, titleDir, `${y}.jpg`);
            }

            addDetailUrl(detailUrl);
        }
    }
}

main();
