const fs = require('fs');
const path = require('path');
const log = require('./log');
const slugify = require('slugify');

function createFolder(tagName, title) {
    const currentDir = __dirname;
    const downloadDir = path.join(currentDir, 'download');
    const normalizedTagName = tagName.replace(/[<>:"\\|?*@]/g, "-").replace(/ /g, "_");
    const tagNameDir = path.join(downloadDir, normalizedTagName);
    const normalizedTitle = title.replace(/[<>:"\\|?*@]/g, "-").replace(/ /g, "_");;
    const titleDir = path.join(tagNameDir, normalizedTitle);

    // 检查 download 文件夹是否存在，如果不存在则创建
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
        console.log(`成功创建 download 文件夹`);
    }

    // 检查 tagName 文件夹是否存在，如果不存在则创建
    if (!fs.existsSync(tagNameDir)) {
        fs.mkdirSync(tagNameDir);
        log.info(`成功创建 ${normalizedTagName} 文件夹`);
    }

    // 检查 title 文件夹是否存在，如果不存在则创建
    if (!fs.existsSync(titleDir)) {
        fs.mkdirSync(titleDir);
        log.info(`成功创建 ${normalizedTitle} 文件夹`);
    }

    // 返回 title 文件夹的路径
    return titleDir;
}

function saveImage(imageBinary, dir, fileName) {
    const filePath = path.join(dir, fileName);
    try {
        imageBinary.pipe(fs.createWriteStream(filePath));
        log.info(`保存图片成功, ${filePath}`);
    }
    catch (ex) {
        log.info(`保存图片失败, ${filePath}`, ex.message);
    }
    // const imageBuffer = Buffer.from(imageBinary, 'base64');
    // const filePath = path.join(dir, fileName);

    // // 写入文件
    // fs.writeFileSync(filePath, imageBuffer, 'binary');

    // log.info(`成功保存图像文件: ${filePath}`);
}

const detailUrlsFilePath = path.join(__dirname, 'detailUrls.txt');
let detailUrls = [];

function getDetailUrls() {
    if (fs.existsSync(detailUrlsFilePath)) {
        const fileContent = fs.readFileSync(detailUrlsFilePath, 'utf-8');
        detailUrls = fileContent.split('\n').filter(url => url.trim() !== '');
        log.info(`获取${detailUrlsFilePath}成功`);
    }
}

function addDetailUrl(detailUrl) {
    if (!detailUrls.includes(detailUrl)) {
        detailUrls.push(detailUrl);
        fs.writeFileSync(detailUrlsFilePath, detailUrls.join('\n'), 'utf-8');
        log.info(`成功记录 detailUrl: ${detailUrl}`);
    } else {
        log.error(`detailUrl 已存在: ${detailUrl}`);
    }
}

function isDetailUrlDuplicate(detailUrl) {
    return detailUrls.includes(detailUrl);
}


module.exports = {
    createFolder,
    saveImage,
    getDetailUrls,
    addDetailUrl,
    isDetailUrlDuplicate
}