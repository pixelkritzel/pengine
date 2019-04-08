import * as React from 'react';
import { Helmet } from 'react-helmet';

import { Container } from '../components/Container';
import { Summary } from '../components/Summary';

export default class ListLayout extends React.Component<{ content: string; data: any; subResources: any }> {
  render() {
    const { content, data, subResources } = this.props;
    return (
      <>
        <Helmet>
          <title>{data.title}</title>
        </Helmet>
        <Container>
          <h1>{data.title}</h1>

          {subResources.map((res: any) => (
            <Summary {...res} />
          ))}

          <div dangerouslySetInnerHTML={{ __html: content }}>{}</div>
        </Container>
      </>
    );
  }
}
