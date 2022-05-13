const fs = require('fs');

const createAttributes = function (attrName, attrValue) {
  if (!attrValue) {
    return '';
  }
  return attrName + '="' + attrValue + '"';
};

const openTag = (tag, attributes) => '<' + tag + ' ' + attributes + '>';
const closeTag = (tag) => '</'+tag+'>';
const createTag = function (tag, content, attributes='') {
 return openTag(tag, attributes) + content + closeTag(tag);
};

const width = (w) => 'width:' + w + 'px';
const height = (h) => 'height:' + h + 'px';

const rectangle = function (w, h) {
  const styleAttr = [width(w), height(h)].join(';');
  return '<div style="' + styleAttr + '"></div>';
};

const getFileName = (filePath) => filePath.split('/').pop();

const createBar = function ([filePath, errorCount]) {
  const bar = rectangle(30,errorCount * 10);
  const name = createTag('div', getFileName(filePath));
  return createTag('div', createTag('div', errorCount) + bar + name);
};

const createReport = function (filePath) {
  const errors = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const pathAndCount = errors.map(x => [x.filePath,x.errorCount]);

  let bars = pathAndCount.map(createBar);
  bars = createTag('div', bars.join(' '), createAttributes('class', 'errors'));

  const linkTag = '<link href="styles.css", rel="StyleSheet" />'
  const headTag = createTag('head', linkTag);
  const bodyTag = createTag('body', bars);
  const html = createTag('html', headTag + bodyTag);
  return html;
};

const html = createReport('./report.json');
fs.writeFileSync('errorReport.html', html, 'utf8');
