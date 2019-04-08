import * as React from 'react';
import { Helmet } from 'react-helmet';

export default class ArticleLayout extends React.Component<{ content: string; data: any; subResources: any }> {
  render() {
    const { content, data } = this.props;
    return (
      <>
        <Helmet>
          <title>{data.title}</title>
        </Helmet>
        <h1>{data.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: this.props.content }}>{}</div>
      </>
    );
  }
}
