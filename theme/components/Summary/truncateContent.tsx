import cheerio from 'cheerio';
export function truncateContent(htmlString: string, options?: { plainText?: boolean }) {
  const $ = cheerio.load(htmlString);
  const firstP = $('p').first();
  return options && options.plainText ? firstP.text() : firstP.html()!;
}
