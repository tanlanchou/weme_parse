const log = require('./log');
const config = require('./config.json');

const getPageNumber = function ($) {
    try {
        const paginationDiv = $('.pagination');

        // 找到该 div 下的 ul 子节点
        const ulNode = paginationDiv.children('ul');

        // 找到 class 为 "next-page" 的 li 节点
        const nextPageNode = ulNode.find('li.next-page');

        // 找到该节点的上一个兄弟节点
        const previousSibling = nextPageNode.prev();

        // 获取兄弟节点的 innerText，转为数字
        const totalPages = parseInt(previousSibling.text(), 10);

        return totalPages;
    }
    catch (ex) {
        log.error(`获取页面总数失败`, ex.message);
        return 0;
    }
}

function getListAllUrl($list) {

    const postGridDivs = $list('.post.grid');
    const allLinks = [];  // 存储所有链接的数组
    postGridDivs.each((index, element) => {
        const $div = $list(element);
        const $a = $div.find('div > a');
        const link = $a.attr('href');
        const match = link.match(/\/archives\/\d+/);
        const extractedLink = match ? match[0] : null;
        allLinks.push(config.main + extractedLink);
    });
    return allLinks;
}

function getDetailAllImage($detail) {
    const asyncDecodingImgSrcArray = [];
    $detail('img[decoding="async"]').each((index, element) => {
        const src = $detail(element).attr('src');
        if (src) {
            asyncDecodingImgSrcArray.push(src);
        }
    });
    return asyncDecodingImgSrcArray;
}

function getFirstTagName($detail) {
    const element = $detail('.article-tags');
    if (element.length > 0) {
        const firstATag = element.find('a').first();
        if (firstATag.length > 0) {
            return firstATag.text();
        } else {
            return "";
        }
    } else {
        return "";
    }
}

function getTitle($detail) {
    const element = $detail('.article-title');
    if (element.length > 0) {
        return element.text();
    } else {
        return "";
    }
}


module.exports = {
    getPageNumber,
    getListAllUrl,
    getDetailAllImage,
    getFirstTagName,
    getTitle
}