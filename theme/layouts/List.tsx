import * as React from 'react';
import { Helmet } from 'react-helmet';

import { Container } from '../components/Container';
import { Summary } from '../components/Summary';
import { Resource } from '../../src/DataAdapter';

export default class ListLayout extends React.Component<{ content: string; data: any; subResources: Resource[] }> {
  render() {
    const { content, data, subResources } = this.props;
    return (
      <>
        <Helmet>
          <title>{data.title}</title>
        </Helmet>
        <Container>
          <h1>{data.title}</h1>

          {subResources
            .filter(res => !res.data.draft)
            .sort((first, second) => second.data.date.getTime() - first.data.date.getTime())
            .map((res, index: number) => (
              <Summary key={index} {...res} />
            ))}

          <div dangerouslySetInnerHTML={{ __html: content }}>{}</div>
        </Container>
      </>
    );
  }
}
