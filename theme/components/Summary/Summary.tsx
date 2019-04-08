import * as React from 'react';
import moment from 'moment';
import cheerio from 'cheerio';

function truncateContent(htmlString: string) {
  const $ = cheerio.load(htmlString);
  return $('p')
    .first()
    .html()!;
}

interface ISubResource {
  data: {
    date: string;
    title: string;
  };
  content: string;
  resourcePath: string;
}

export function Summary({ content, data, resourcePath }: ISubResource) {
  const { date, title } = data;
  console.log(content);
  return (
    <article className="article post-list-item">
      <div className="time-container">
        <time>{moment(date).format('DD.MM.Y')}</time>
      </div>

      <h1>
        <a href={resourcePath}>{title}</a>
      </h1>
      <div dangerouslySetInnerHTML={{ __html: truncateContent(content) }} />
    </article>
  );
}
