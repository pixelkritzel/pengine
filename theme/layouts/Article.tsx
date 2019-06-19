import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from '../components/Container';

export default class ArticleLayout extends React.Component<{ content: string; data: any; subResources: any }> {
  render() {
    const { content, data } = this.props;
    return (
      <>
        <Helmet>
          <title>{data.title}</title>
          <meta name="description" content={data.summary} />
        </Helmet>
        <Container>
          <h1>{data.title}</h1>
          WTF
          <div dangerouslySetInnerHTML={{ __html: content }}>{}</div>
        </Container>
      </>
    );
  }
}
