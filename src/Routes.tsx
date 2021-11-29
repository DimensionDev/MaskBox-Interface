import { Home, BoxList, Details, Faqs, Profile, Edit, MyBoxes } from '@/pages';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { RouteKeys } from '@/configs';
import { Fragment, useEffect } from 'react';

const ScrollToTop = withRouter(({ history }) => {
  useEffect(() => {
    return history.listen(() => {
      window.scrollTo({
        top: 0,
      });
    });
  }, []);
  return null;
});

export const Routes = () => (
  <Fragment>
    <ScrollToTop />
    <Switch>
      <Route exact path={RouteKeys.Home} component={Home} />
      <Route path={RouteKeys.BoxList} component={BoxList} />
      <Route path={RouteKeys.Details} component={Details} />
      <Route path={RouteKeys.Edit} component={Edit} />
      <Route path={RouteKeys.Faqs} component={Faqs} />
      <Route path={RouteKeys.Profile} component={Profile} />
      <Route path={RouteKeys.MyMaskboxes} component={MyBoxes} />
      <Redirect to={RouteKeys.Home} />
    </Switch>
  </Fragment>
);
