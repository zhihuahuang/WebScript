export default function (selector) {
    var element = {};

    selector
        .replace(/#([a-zA-Z0-9\u007F-\uFFFF_:-]+)/, function (match) {
            element.id = match[1];
            return '';
        })
        .replace(/.([a-zA-Z0-9\u007F-\uFFFF_:-]+)/);

    return element;
}
