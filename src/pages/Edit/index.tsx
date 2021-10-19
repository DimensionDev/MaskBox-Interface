import { Provider } from 'jotai';
import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Description } from './Description';
import styles from './index.module.less';
import { Meta } from './Meta';

export const Edit: FC = () => {
  return (
    <main className={styles.editPage}>
      <h1 className={styles.title}>Create Maskbox</h1>
      <Provider>
        <Switch>
          <Route exact path="/edit/desc" component={Description}></Route>
          <Route path="/edit/meta" component={Meta}></Route>
          <Redirect to="/edit/desc" />
        </Switch>
      </Provider>
    </main>
  );
};
