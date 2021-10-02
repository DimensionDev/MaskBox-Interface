import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Description } from './Description';
import { Meta } from './Meta';
import styles from './index.module.less';

export const Edit: FC = () => {
  return (
    <main className={styles.editPage}>
      <h1>Create Mystery box</h1>
      <Switch>
        <Route exact path="/edit/desc" component={Description}></Route>
        <Route path="/edit/meta" component={Meta}></Route>
        <Redirect to={'/edit/desc'} />
      </Switch>
    </main>
  );
};
