import { Home, BoxList, Details, Faqs, Profile } from '@/pages';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteKeys } from '@/configs';

export const Routes = () => (
  <Switch>
    <Route exact path={RouteKeys.Home} component={Home} />
    <Route exact path={RouteKeys.BoxList} component={BoxList} />
    <Route exact path={RouteKeys.Details} component={Details} />
    <Route exact path={RouteKeys.Faqs} component={Faqs} />
    <Route exact path={RouteKeys.Profile} component={Profile} />
    <Redirect to={RouteKeys.Home} />
  </Switch>
);
