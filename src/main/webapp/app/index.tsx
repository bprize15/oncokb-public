import 'typeface-open-sans';
import * as superagent from 'superagent';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'font-awesome/css/font-awesome.css';
import './index.scss';
import 'react-table/react-table.css';
import 'oncokb-styles/dist/oncokb.css';
import 'react-responsive-tabs/styles.css';
import 'react-mutation-mapper/dist/styles.css';

import { assignPublicToken } from 'app/indexUtils';
import { AUTH_UER_TOKEN_KEY, AUTH_WEBSITE_TOKEN_KEY } from 'app/store/AuthenticationStore';
import { Storage } from 'react-jhipster';

assignPublicToken();

// Manually attach token to
// @ts-ignore
const query = superagent.Request.prototype.query;
// @ts-ignore
const end = superagent.Request.prototype.end;

// @ts-ignore
superagent.Request.prototype.query = function(queryParameters: any) {
  const token =
    Storage.local.get(AUTH_UER_TOKEN_KEY) || Storage.session.get(AUTH_UER_TOKEN_KEY) || Storage.session.get(AUTH_WEBSITE_TOKEN_KEY);
  if (token) {
    this.set('Authorization', `Bearer ${token}`);
  }
  return query.call(this, queryParameters);
};

// @ts-ignore
superagent.Request.prototype.end = function(callback) {
  return end.call(this, (error: any, response: any) => {
    // the swagger coden only returns response body
    // But in the case of the text/plain, the response should come from the response.text
    if (
      response &&
      response.statusCode === 200 &&
      response.headers &&
      response.headers['content-type'] &&
      ['application/zip', 'text/plain;'].some(item => response.headers['content-type'].includes(item))
    ) {
      response.body = response.text;
    }

    callback(error, response);
  });
};

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
