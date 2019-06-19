import * as React from 'react';
import moment from 'moment';
import { Resource } from '../../../src/DataAdapter';
import { truncateContent } from './truncateContent';

export function Summary({ content, data, resourcePath }: Resource) {
  const { date, title } = data;
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
