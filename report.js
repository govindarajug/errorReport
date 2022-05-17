const fs = require('fs');

const createAttributes = function (attrName, attrValue) {
  if (!attrValue) {
    return '';
  }
  return attrName + '="' + attrValue + '"';
};

const openTag = (tag, attributes) => '<' + tag + ' ' + attributes + '>';
const closeTag = (tag) => '</' + tag + '>';
const createTag = function (tag, content, attributes = '') {
 return openTag(tag, attributes) + content + closeTag(tag);
};

const width = (w) => 'width:' + w + 'px';
const height = (h) => 'height:' + h + 'px';

const rectangle = function (w, h) {
  const styleAttr = [width(w), height(h)].join(';');
  return createTag('div', '', createAttributes('style', styleAttr));
};

const getFileName = (filePath) => filePath.split('/').pop();

const createBar = function ([filePath, errorCount]) {
  const bar = rectangle(30, errorCount * 10);
  const name = createTag('div', getFileName(filePath));
  return createTag('div', createTag('div', errorCount) + bar + name);
};

const createReport = function (errors) {
  const pathAndCount = errors.map(x => [x.filePath, x.errorCount]);
  
  let bars = pathAndCount.map(createBar);
  bars = createTag('div', bars.join(' '), createAttributes('class', 'errors'));
  
  const linkTag = '<link href="styles.css", rel="StyleSheet" />';
  const headTag = createTag('head', linkTag);
  const wrapper = createTag('div', bars, createAttributes('class', 'wrapper'));
  const bodyTag = createTag('body', wrapper);
  const html = createTag('html', headTag + bodyTag);
  return html;
};

const main = function (filePath) {
  let errors = [];
  try {
    errors = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw 'file not found';
  }
  const html = createReport(errors);
  try {
    fs.writeFileSync('errorReport.html', html, 'utf8');
  } catch (error) {
    throw 'cannot write to file';
  }
};

main('./report.json');
