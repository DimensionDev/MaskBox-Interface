import { Home as Market, Faqs, Profile } from '@/pages';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

export const Routes = () => (
  <Switch>
    <Route exact path="/market" component={Market} />
    <Route exact path="/faqs" component={Faqs} />
    <Route exact path="/profile" component={Profile} />
    <Redirect to="/market" />
  </Switch>
);
