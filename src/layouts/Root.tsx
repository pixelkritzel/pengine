import * as React from 'react';
import { Helmet } from 'react-helmet';

export default class RootLayout extends React.Component<{ content: string }> {
  render() {
    return (
      <>
        <Helmet>
          <title>This is pixelkritzel!</title>
        </Helmet>
        <h1>I'm a server side rendered static react app!</h1>
        And this my content:
        <div dangerouslySetInnerHTML={{ __html: this.props.content }}>{}</div>
      </>
    );
  }
}
