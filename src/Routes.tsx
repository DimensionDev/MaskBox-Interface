import { Home, BoxList, Details, Faqs, Profile, Edit } from '@/pages';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteKeys } from '@/configs';

export const Routes = () => (
  <Switch>
    <Route exact path={RouteKeys.Home} component={Home} />
    <Route path={RouteKeys.BoxList} component={BoxList} />
    <Route path={RouteKeys.Details} component={Details} />
    <Route path={RouteKeys.Edit} component={Edit} />
    <Route path={RouteKeys.Faqs} component={Faqs} />
    <Route path={RouteKeys.Profile} component={Profile} />
    <Redirect to={RouteKeys.Home} />
  </Switch>
);
