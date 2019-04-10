import * as React from 'react';
import { Helmet } from 'react-helmet';
import { ErrorMessage } from '../../src/DataAdapter';

export default class ErrorPage extends React.Component<ErrorMessage> {
  render() {
    const { message, statusCode } = this.props;
    return (
      <>
        <Helmet>
          <title>Error: {statusCode.toString()}</title>
        </Helmet>
        <h1>HTTP: {statusCode}</h1>
        {message}
      </>
    );
  }
}
